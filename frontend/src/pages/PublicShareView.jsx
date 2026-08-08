import { useState, useEffect } from "react";
import { supabase } from "../lib/SupabaseClient";
import { ShieldCheckIcon, DownloadIcon } from "../components/Icons";
import "../styles/dashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function PublicShareView({ shareToken, onGoHome }) {
  const [fileInfo, setFileInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function loadInfo() {
      if (!shareToken) {
        setError("Invalid or missing share token.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const cleanedToken = shareToken.trim();

      // 1. Try FastAPI backend route first
      try {
        const res = await fetch(`${API_URL}/public/shared/${cleanedToken}`).catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          setFileInfo(data);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.log("FastAPI backend notice, switching to direct Supabase query...", e);
      }

      // 2. Direct Supabase Query Fallback
      try {
        let linkRecord = null;

        // Query by 'token' column
        const { data: byToken } = await supabase
          .from("share_links")
          .select("*")
          .eq("token", cleanedToken)
          .limit(1);

        if (byToken && byToken.length > 0) {
          linkRecord = byToken[0];
        } else {
          // Query by 'share_token' fallback
          const { data: byShareToken } = await supabase
            .from("share_links")
            .select("*")
            .eq("share_token", cleanedToken)
            .limit(1);

          if (byShareToken && byShareToken.length > 0) {
            linkRecord = byShareToken[0];
          }
        }

        if (!linkRecord) {
          throw new Error("This shared link has expired, was revoked, or does not exist.");
        }

        if (linkRecord.revoked) {
          throw new Error("This shared link has been revoked by its owner.");
        }

        // Check expiration
        if (linkRecord.expires_at && new Date() > new Date(linkRecord.expires_at)) {
          throw new Error("This shared link has expired.");
        }

        // Check download limit
        const dCount = linkRecord.download_count ?? linkRecord.downloads_count ?? 0;
        if (linkRecord.max_downloads && dCount >= linkRecord.max_downloads) {
          throw new Error("Maximum download limit reached for this shared link.");
        }

        // Fetch target file metadata
        const { data: fData, error: fErr } = await supabase
          .from("files")
          .select("id, filename, size_bytes, created_at, storage_path")
          .eq("id", linkRecord.file_id)
          .limit(1);

        if (fErr || !fData || fData.length === 0) {
          throw new Error("The file associated with this share link no longer exists.");
        }

        const targetFile = fData[0];

        setFileInfo({
          share_token: cleanedToken,
          filename: targetFile.filename,
          size_bytes: targetFile.size_bytes,
          created_at: targetFile.created_at,
          expires_at: linkRecord.expires_at,
          max_downloads: linkRecord.max_downloads,
          download_count: dCount,
          storage_path: targetFile.storage_path,
        });
      } catch (err) {
        setError(err.message || "Failed to load shared file details.");
      } finally {
        setLoading(false);
      }
    }

    loadInfo();
  }, [shareToken]);

  async function handleDownload() {
    if (!fileInfo) return;
    setDownloading(true);

    // 1. Try FastAPI stream download (performs server-side AES-256 decryption)
    try {
      const res = await fetch(`${API_URL}/public/shared/${shareToken}/download`).catch(() => null);
      if (res && res.ok) {
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileInfo.filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(blobUrl);
        setDownloading(false);
        return;
      }
    } catch (e) {
      console.log("FastAPI stream notice, using direct storage download fallback...", e);
    }

    // 2. Direct Supabase storage download fallback
    try {
      if (fileInfo?.storage_path) {
        const { data: fileData, error: dlErr } = await supabase.storage
          .from("trustshare-files")
          .download(fileInfo.storage_path);

        if (dlErr) throw dlErr;

        const blobUrl = window.URL.createObjectURL(fileData);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileInfo.filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(blobUrl);
      } else {
        alert("File download is currently unavailable.");
      }
    } catch (err) {
      alert(`Download Error: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="public-share-page">
        <div className="public-share-container">
          <div className="loader" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-share-page">
        <div className="public-share-container">
          <div className="public-share-card">
            <h2 style={{ color: "#ef4444" }}>Unavailable Share Link</h2>
            <p style={{ color: "#94a3b8", margin: "16px 0 24px", fontSize: "15px" }}>{error}</p>
            <button className="btn-primary" onClick={onGoHome}>Go to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-share-page">
      <div className="public-share-container">
        <div className="public-share-card">
          <div className="share-security-badge">
            <ShieldCheckIcon size={18} /> Verified Encrypted Document
          </div>

          <div className="file-icon-large">📄</div>
          <h1 className="shared-filename">{fileInfo.filename}</h1>

          <div className="file-meta-row">
            <span className="meta-pill">{formatBytes(fileInfo.size_bytes)}</span>
            {fileInfo.expires_at ? (
              <span className="meta-pill expiry">Expires: {new Date(fileInfo.expires_at).toLocaleDateString()}</span>
            ) : (
              <span className="meta-pill">Permanent Link</span>
            )}
          </div>

          <button className="btn-primary download-btn" onClick={handleDownload} disabled={downloading}>
            {downloading ? "Downloading File…" : <><DownloadIcon size={18} /> Download Decrypted File</>}
          </button>

          <p className="decrypt-info">
            🔒 Secured with server-side Fernet AES-256 encryption.
          </p>
        </div>
      </div>
    </div>
  );
}
