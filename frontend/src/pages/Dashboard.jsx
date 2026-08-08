import { useState, useEffect } from "react";
import { supabase } from "../lib/SupabaseClient";
import { getOrInitProfile, saveUserProfile } from "../lib/profileManager";
import ShareModal from "../components/ShareModal";
import {
  ShieldIcon,
  LockIcon,
  FolderIcon,
  LinkIcon,
  ActivityIcon,
  UserIcon,
  SettingsIcon,
  UploadIcon,
  DownloadIcon,
  TrashIcon,
  SunIcon,
  MoonIcon,
  CopyIcon,
  SearchIcon,
  RefreshIcon,
  LogOutIcon,
  CheckIcon,
} from "../components/Icons";
import "../styles/dashboard.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const NAV_ITEMS = [
  { key: "files", label: "My Files", icon: FolderIcon },
  { key: "shared", label: "Shared Links", icon: LinkIcon },
  { key: "activity", label: "Activity Log", icon: ActivityIcon },
  { key: "settings", label: "Settings", icon: SettingsIcon },
  { key: "profile", label: "Profile", icon: UserIcon },
];

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getFileCategory(filename) {
  if (!filename) return "other";
  const ext = filename.split(".").pop().toLowerCase();
  if (["pdf", "doc", "docx", "txt", "rtf", "md", "csv", "xlsx", "pptx"].includes(ext)) return "documents";
  if (["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"].includes(ext)) return "images";
  if (["js", "jsx", "ts", "tsx", "py", "html", "css", "json", "c", "cpp", "java"].includes(ext)) return "code";
  if (["zip", "tar", "gz", "7z", "rar"].includes(ext)) return "archives";
  return "other";
}

function getFileEmoji(filename) {
  const cat = getFileCategory(filename);
  if (cat === "documents") return "📄";
  if (cat === "images") return "🖼️";
  if (cat === "code") return "💻";
  if (cat === "archives") return "📦";
  return "📁";
}

function compressAvatarFile(file, onComplete) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const maxSize = 128;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxSize) {
          height = Math.round(height * (maxSize / width));
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = Math.round(width * (maxSize / height));
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const compressedUrl = canvas.toDataURL("image/jpeg", 0.75);
      onComplete(compressedUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

export default function Dashboard({ session }) {
  const { user } = session;
  const [activeTab, setActiveTab] = useState("files");
  const [files, setFiles] = useState([]);
  const [shareLinks, setShareLinks] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [sharingFile, setSharingFile] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [themeMode, setThemeMode] = useState("dark");
  
  const defaultHandle = user.email ? user.email.split("@")[0] : "User";
  const meta = user.user_metadata || {};

  const [profile, setProfile] = useState({
    username: meta.username || defaultHandle,
    avatar_url: meta.avatar_url || null,
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode);
  }, [themeMode]);

  // Enterprise Dual-Source Profile Synchronization
  useEffect(() => {
    let isMounted = true;

    async function loadProfileData() {
      try {
        const res = await fetch(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }).catch(() => null);

        if (res && res.ok) {
          const apiData = await res.json();
          if (isMounted && apiData) {
            setProfile({
              username: apiData.username || meta.username || defaultHandle,
              avatar_url: apiData.avatar_url || meta.avatar_url || null,
            });
            return;
          }
        }
      } catch (e) {
        console.log("FastAPI backend profile load notice:", e);
      }

      const profData = await getOrInitProfile(user);
      if (isMounted && profData) {
        setProfile(profData);
      }
    }

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, [user, session.access_token, meta.username, meta.avatar_url, defaultHandle]);

  function toggleTheme() {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
  }

  function showToast(text, type = "info") {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  const initials = (profile.username || user.email)?.[0]?.toUpperCase() || "U";
  const totalStorageBytes = files.reduce((acc, f) => acc + (f.size_bytes || 0), 0);

  return (
    <div className={`dash ${themeMode}-mode`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`dash-toast toast-${toastMessage.type}`}>
          {toastMessage.text}
        </div>
      )}

      {/* Top Navbar */}
      <header className="dash-header">
        <div className="dash-brand">
          <span className="ts-brand-icon">
            <ShieldIcon size={22} color="#ffffff" />
          </span>
          <span>Trust<span className="dash-brand-accent">Share</span></span>
        </div>

        <div className="dash-user">
          <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${themeMode === "dark" ? "Light" : "Dark"} Mode`}>
            {themeMode === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            <span className="theme-label">{themeMode === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
          
          <div className="user-profile-badge" onClick={() => setActiveTab("profile")} style={{ cursor: "pointer" }}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="dash-avatar-img" />
            ) : (
              <span className="dash-avatar">{initials}</span>
            )}
            <span className="user-email-header">{profile.username || user.email}</span>
          </div>

          <button className="btn-outline" onClick={handleSignOut} title="Sign Out">
            <LogOutIcon size={16} /> Sign Out
          </button>
        </div>
      </header>

      <div className="dash-body">
        {/* Sidebar */}
        <aside className="dash-sidebar">
          <nav className="sidebar-nav">
            {NAV_ITEMS.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.key}
                  className={"sidebar-link" + (activeTab === item.key ? " active" : "")}
                  aria-current={activeTab === item.key ? "page" : undefined}
                  onClick={() => setActiveTab(item.key)}
                >
                  <span className="sidebar-icon">
                    <IconComp size={18} />
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="dash-main">
          {activeTab === "files" && (
            <FilesView
              user={user}
              session={session}
              files={files}
              setFiles={setFiles}
              onShareClick={(file) => setSharingFile(file)}
              showToast={showToast}
              totalStorageBytes={totalStorageBytes}
            />
          )}

          {activeTab === "shared" && (
            <SharedLinksView
              session={session}
              shareLinks={shareLinks}
              setShareLinks={setShareLinks}
              showToast={showToast}
            />
          )}

          {activeTab === "activity" && (
            <ActivityView
              session={session}
              activityLogs={activityLogs}
              setActivityLogs={setActivityLogs}
            />
          )}

          {activeTab === "settings" && <SettingsView user={user} session={session} showToast={showToast} />}
          
          {activeTab === "profile" && (
            <ProfileView
              user={user}
              session={session}
              profile={profile}
              setProfile={setProfile}
              filesCount={files.length}
              storageUsed={formatBytes(totalStorageBytes)}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Share Link Modal */}
      {sharingFile && (
        <ShareModal
          file={sharingFile}
          session={session}
          onClose={() => setSharingFile(null)}
          onLinkCreated={() => showToast("Share link created successfully!", "success")}
        />
      )}
    </div>
  );
}

function FilesView({ user, session, files, setFiles, onShareClick, showToast, totalStorageBytes }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [downloadingId, setDownloadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch(`${API_URL}/files`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json();
          setFiles(data);
          return;
        }
      } catch (err) {
        console.log("FastAPI backend files fetch notice:", err);
      }

      try {
        const { data, error } = await supabase
          .from("files")
          .select("id, owner_id, filename, size_bytes, storage_path, created_at")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setFiles(data);
        }
      } catch (sbErr) {
        console.warn("Files query notice:", sbErr);
      }
    }

    fetchFiles();
  }, [user.id, session.access_token, setFiles]);

  async function handleUpload(selectedFile) {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.detail || `Upload failed (${response.status})`);
      }

      const result = await response.json();

      setFiles((prev) => [
        {
          id: result.file_id,
          filename: selectedFile.name,
          size_bytes: selectedFile.size,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      showToast(`"${selectedFile.name}" uploaded and encrypted successfully!`, "success");
    } catch (err) {
      setUploadError(err.message || "Upload failed. Please check backend server.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(file) {
    try {
      setDownloadingId(file.id);
      const res = await fetch(`${API_URL}/download/${file.id}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.detail || "Download failed");
      }

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
      showToast(`Downloaded "${file.filename}"`, "info");
    } catch (err) {
      showToast(`Download error: ${err.message}`, "error");
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleDelete(file) {
    if (!confirm(`Are you sure you want to delete "${file.filename}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(file.id);
      
      const res = await fetch(`${API_URL}/files/${file.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.detail || "Delete failed");
      }

      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      showToast(`Deleted "${file.filename}"`, "warn");
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, "error");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.filename.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterCategory === "all") return matchesSearch;
    return matchesSearch && getFileCategory(f.filename) === filterCategory;
  });

  return (
    <>
      <section className="dash-stats">
        <div className="stat-card">
          <span className="stat-icon"><LockIcon size={24} /></span>
          <div className="stat-value">{files.length}</div>
          <div className="stat-label">Files Stored</div>
        </div>

        <div className="stat-card">
          <span className="stat-icon"><FolderIcon size={24} /></span>
          <div className="stat-value">{formatBytes(totalStorageBytes)}</div>
          <div className="stat-label">Encrypted Storage Used</div>
        </div>

        <div className="stat-card">
          <span className="stat-icon"><ShieldIcon size={24} /></span>
          <div className="stat-value">AES-256</div>
          <div className="stat-label">Server-Side Encryption</div>
        </div>
      </section>

      <section className="upload-card">
        <label
          className={`upload-zone ${uploading ? "uploading" : ""}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const dropped = e.dataTransfer.files?.[0];
            if (dropped) handleUpload(dropped);
          }}
        >
          <input
            type="file"
            hidden
            disabled={uploading}
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) handleUpload(selected);
              e.target.value = "";
            }}
          />
          <span className="upload-icon"><UploadIcon size={36} /></span>
          <p className="upload-text">
            {uploading ? "Encrypting and uploading file…" : "Drag & drop your file here, or click to browse"}
          </p>
          <span className="btn-primary">
            {uploading ? "Encrypting…" : "Upload File"}
          </span>
        </label>
        {uploadError && <p className="upload-error-msg">{uploadError}</p>}
      </section>

      <section className="files-card">
        <div className="files-card-header flex-between">
          <h2>My Encrypted Files</h2>
          <div className="files-controls">
            <div className="search-wrap">
              <SearchIcon size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search files…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        <div className="category-pills">
          {["all", "documents", "images", "code", "archives"].map((cat) => (
            <button
              key={cat}
              className={`pill-btn ${filterCategory === cat ? "active" : ""}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {filteredFiles.length === 0 ? (
          <div className="files-empty-box">
            <p className="files-empty">
              {searchQuery ? "No files match your search criteria." : "No files uploaded yet. Upload a file above to get started!"}
            </p>
          </div>
        ) : (
          <div className="files-table-wrap">
            <table className="files-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Size</th>
                  <th>Uploaded Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((f) => (
                  <tr key={f.id}>
                    <td>
                      <div className="file-name-cell">
                        <span className="file-type-emoji">{getFileEmoji(f.filename)}</span>
                        <span className="file-name-text">{f.filename}</span>
                      </div>
                    </td>
                    <td><span className="size-badge">{formatBytes(f.size_bytes)}</span></td>
                    <td>{new Date(f.created_at).toLocaleDateString()}</td>
                    <td style={{ textAlign: "right" }}>
                      <div className="action-buttons">
                        <button
                          className="btn-action download"
                          title="Download Decrypted File"
                          disabled={downloadingId === f.id}
                          onClick={() => handleDownload(f)}
                        >
                          <DownloadIcon size={14} /> Download
                        </button>
                        <button
                          className="btn-action share"
                          title="Create Share Link"
                          onClick={() => onShareClick(f)}
                        >
                          <LinkIcon size={14} /> Share
                        </button>
                        <button
                          className="btn-action delete"
                          title="Delete File"
                          disabled={deletingId === f.id}
                          onClick={() => handleDelete(f)}
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

function SharedLinksView({ session, shareLinks, setShareLinks, showToast }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLinks() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/share-links`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json();
          setShareLinks(data);
        }
      } catch (err) {
        console.error("Failed to load share links:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLinks();
  }, [session.access_token, setShareLinks]);

  async function handleRevoke(link) {
    if (!confirm("Are you sure you want to revoke this share link?")) return;

    try {
      const token = link.share_token || link.token;
      const res = await fetch(`${API_URL}/share-links/${token}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.ok) {
        setShareLinks((prev) => prev.filter((l) => (l.share_token || l.token) !== token));
        showToast("Share link revoked", "warn");
      }
    } catch (err) {
      showToast(`Failed to revoke link: ${err.message}`, "error");
    }
  }

  function handleCopy(linkToken) {
    const fullUrl = `${window.location.origin}${window.location.pathname}?share=${linkToken}`;
    navigator.clipboard.writeText(fullUrl);
    showToast("Share link copied to clipboard!", "success");
  }

  return (
    <section className="files-card">
      <div className="files-card-header flex-between">
        <h2>Active Shared Links</h2>
        <span className="badge-count">{shareLinks.length} Active</span>
      </div>

      {loading ? (
        <div className="files-empty-box"><div className="loader" /></div>
      ) : shareLinks.length === 0 ? (
        <div className="files-empty-box">
          <p className="files-empty">No active share links. Click "Share" on any file in "My Files" to create one.</p>
        </div>
      ) : (
        <div className="files-table-wrap">
          <table className="files-table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Share Token</th>
                <th>Created</th>
                <th>Expires</th>
                <th>Downloads</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shareLinks.map((l) => {
                const token = l.share_token || l.token;
                return (
                  <tr key={token || l.id}>
                    <td><strong>{l.filename || "Shared File"}</strong></td>
                    <td><code>{token?.substring(0, 12)}…</code></td>
                    <td>{l.created_at ? new Date(l.created_at).toLocaleDateString() : "—"}</td>
                    <td>
                      {l.expires_at ? (
                        <span className="meta-pill expiry">{new Date(l.expires_at).toLocaleDateString()}</span>
                      ) : (
                        <span className="meta-pill">Never</span>
                      )}
                    </td>
                    <td><span className="size-badge">{l.download_count || l.downloads_count || 0} {l.max_downloads ? `/ ${l.max_downloads}` : ""}</span></td>
                    <td style={{ textAlign: "right" }}>
                      <div className="action-buttons">
                        <button className="btn-action share" onClick={() => handleCopy(token)}>
                          <CopyIcon size={14} /> Copy Link
                        </button>
                        <button className="btn-action delete" onClick={() => handleRevoke(l)}>
                          <TrashIcon size={14} /> Revoke
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function ActivityView({ session, activityLogs, setActivityLogs }) {
  const [loading, setLoading] = useState(true);

  async function fetchActivity() {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/activity`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        setActivityLogs(data);
      }
    } catch (err) {
      console.error("Failed to load activity logs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchActivity();
  }, [session.access_token]);

  return (
    <section className="files-card">
      <div className="files-card-header flex-between">
        <h2>Security & Activity Audit Log</h2>
        <button className="btn-outline btn-sm" onClick={fetchActivity}>
          <RefreshIcon size={14} /> Refresh Log
        </button>
      </div>

      {loading ? (
        <div className="files-empty-box"><div className="loader" /></div>
      ) : activityLogs.length === 0 ? (
        <div className="files-empty-box">
          <p className="files-empty">No activity recorded yet.</p>
        </div>
      ) : (
        <div className="files-table-wrap">
          <table className="files-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Resource Type</th>
                <th>Severity</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.map((log, idx) => (
                <tr key={log.id || idx}>
                  <td><strong>{log.action}</strong></td>
                  <td><code>{log.resource_type || "system"}</code></td>
                  <td>
                    <span className={`severity-badge severity-${log.severity || "info"}`}>
                      {log.severity || "info"}
                    </span>
                  </td>
                  <td>{log.timestamp ? new Date(log.timestamp).toLocaleString() : "Recently"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function SettingsView({ user, session, showToast }) {
  return (
    <div className="settings-grid">
      <section className="files-card">
        <div className="files-card-header">
          <h2>Encryption & Security Settings</h2>
        </div>
        <div className="settings-list">
          <div className="setting-item flex-between">
            <div>
              <strong>AES-256 Fernet Encryption</strong>
              <p className="setting-desc">Server-side encryption algorithm applied per file before saving to object storage.</p>
            </div>
            <span className="status-badge active">Enabled</span>
          </div>

          <div className="setting-item flex-between">
            <div>
              <strong>JWT Token Verification</strong>
              <p className="setting-desc">Validates Supabase Bearer token headers for every backend endpoint call.</p>
            </div>
            <span className="status-badge active">Enforced</span>
          </div>

          <div className="setting-item flex-between">
            <div>
              <strong>Auto-Expire Share Links</strong>
              <p className="setting-desc">Default validity duration for generated temporary download links.</p>
            </div>
            <select className="modal-select small">
              <option>24 Hours (Default)</option>
              <option>1 Hour</option>
              <option>7 Days</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfileView({ user, session, profile, setProfile, filesCount, storageUsed, showToast }) {
  const [usernameInput, setUsernameInput] = useState(profile.username || "");
  const [avatarUrlInput, setAvatarUrlInput] = useState(profile.avatar_url || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setUsernameInput(profile.username || "");
    setAvatarUrlInput(profile.avatar_url || "");
  }, [profile]);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await saveUserProfile(user, usernameInput, avatarUrlInput);
      setProfile({
        username: res.username,
        avatar_url: res.avatar_url,
      });

      if (res.dbError) {
        showToast(`Saved to session. DB Note: ${res.dbError}`, "warn");
      } else {
        showToast("Profile saved to database successfully!", "success");
      }
    } catch (err) {
      showToast(`Error: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleAvatarUpload(file) {
    if (!file) return;

    compressAvatarFile(file, (compressedBase64) => {
      setAvatarUrlInput(compressedBase64);
      showToast("Avatar photo compressed & loaded! Click 'Save Profile Changes' to save.", "info");
    });
  }

  const lastSignIn = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString()
    : "—";

  return (
    <div className="profile-container">
      <section className="files-card profile-card-styled">
        <div className="profile-header-banner">
          <div className="avatar-picker-wrap">
            {avatarUrlInput ? (
              <img src={avatarUrlInput} alt="Avatar" className="profile-avatar-large-img" />
            ) : (
              <div className="profile-avatar-large">
                {(usernameInput || user.email)?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <label className="avatar-upload-overlay" title="Upload Profile Photo">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const selected = e.target.files?.[0];
                  if (selected) handleAvatarUpload(selected);
                }}
              />
              <span>📷 Change</span>
            </label>
          </div>

          <div className="profile-header-text">
            <h1 className="dash-title">{usernameInput || user.email}</h1>
            <span className="dash-eyebrow">USER PROFILE & CREDENTIALS</span>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="profile-edit-form">
          <div className="form-group">
            <label className="form-label">Username (Stored in `profiles.username`)</label>
            <input
              type="text"
              required
              placeholder="e.g. sushil_vatane"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="modal-input"
            />
            <span className="field-hint">Stored directly in Supabase `profiles.username` column.</span>
          </div>

          <div className="form-group">
            <label className="form-label">Avatar Image URL (Stored in `profiles.avatar_url`)</label>
            <input
              type="text"
              placeholder="https://example.com/photo.png or click camera above"
              value={avatarUrlInput}
              onChange={(e) => setAvatarUrlInput(e.target.value)}
              className="modal-input"
            />
            <span className="field-hint">Stored directly in Supabase `profiles.avatar_url` column.</span>
          </div>

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving Changes…" : <><CheckIcon size={16} /> Save Profile Changes</>}
          </button>
        </form>

        <div className="user-meta-grid" style={{ marginTop: "24px" }}>
          <div className="user-meta-card">
            <span className="meta-label">User ID</span>
            <code className="meta-code">{user.id}</code>
          </div>
          <div className="user-meta-card">
            <span className="meta-label">Email Address</span>
            <strong>{user.email}</strong>
          </div>
          <div className="user-meta-card">
            <span className="meta-label">Last Sign In</span>
            <strong>{lastSignIn}</strong>
          </div>
          <div className="user-meta-card">
            <span className="meta-label">Encrypted Files</span>
            <strong>{filesCount} Files ({storageUsed})</strong>
          </div>
        </div>
      </section>
    </div>
  );
}