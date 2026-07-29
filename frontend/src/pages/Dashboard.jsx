import { useState } from "react";
import { supabase } from "../lib/SupabaseClient";
import "../styles/dashboard.css";
import lock from '../assets/icons/lock.svg'
import folder from '../assets/icons/folder.svg'
import activity from '../assets/icons/activity.svg'
import link from '../assets/icons/link.svg'
import log from '../assets/icons/log.svg'
import person from '../assets/icons/person.svg'
import settings from '../assets/icons/settings.svg'
import upload from '../assets/icons/upload.svg'
// import { Upload } from "lucide-react";

const NAV_ITEMS = [
  { key: "files", label: "My Files", icon: folder },
  { key: "activity", label: "Activity", icon: activity },
  { key: "shared", label: "Shared Links", icon: link },
  { key: "settings", label: "Settings", icon: settings },
  { key: "profile", label: "Profile", icon: person },
];

export default function Dashboard({ session }) {
  const { user } = session;
  const [activeTab, setActiveTab] = useState("files");
  const [files] = useState([]); // TODO: populate once the file listing API is ready

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  const initials = user.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="dash">
      {/* Top nav */}
      <header className="dash-header">
        <div className="dash-brand">
          <span className="ts-brand-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.7 8 9 4.6-.3 8-4 8-9V5l-8-3Z"></path></svg></span>          <span>
            Trust<span className="dash-brand-accent">Share</span>
          </span>
        </div>
        <div className="dash-user">
          <span className="dash-avatar">{initials}</span>
          <button className="btn-outline" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </header>

      <div className="dash-body">
        {/* Sidebar (becomes a horizontal tab bar on small screens, see CSS) */}
        <aside className="dash-sidebar">
          <nav className="sidebar-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                className={
                  "sidebar-link" + (activeTab === item.key ? " active" : "")
                }
                aria-current={activeTab === item.key ? "page" : undefined}
                onClick={() => setActiveTab(item.key)}
              >
                <span className="sidebar-icon" height='30px' aria-hidden="true">
                  <img src={item.icon} alt="" height={24} />
                </span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content area */}
        <main className="dash-main">
          {activeTab === "files" && <FilesView user={user} files={files} />}
          {activeTab === "activity" && <ActivityView />}
          {activeTab === "shared" && <SharedLinksView />}
          {activeTab === "settings" && <SettingsView />}
          {activeTab === "profile" && <ProfileView user={user} />}
        </main>
      </div>
    </div>
  );
}

function FilesView({ user, files }) {
  return (
    <>
      <section className="dash-stats">
        <div className="stat-card">
          <span className="stat-icon" aria-hidden="true">
            <img src={lock} height="30px" />
          </span>
          <div className="stat-value">{files.length}</div>
          <div className="stat-label">Files Stored</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon" aria-hidden="true">
            <img src={folder} height="30px" />

          </span>
          <div className="stat-value">0</div>
          <div className="stat-label">Active Shares</div>
        </div>
        <div className="stat-card">
          <span className="stat-icon" aria-hidden="true">
            <img src={log} height="30px" />

          </span>
          <div className="stat-value">0</div>
          <div className="stat-label">Logged Actions</div>
        </div>
      </section>

      <section className="upload-card">
        <label
          className="upload-zone"
         
        >
          <input type="file" hidden   />
          <span className="upload-icon" aria-hidden="true"><img src={upload} alt="" height={30}/></span>
          <p className="upload-text">
          {"Drag & drop a file here, or click to browse"}
          </p>
          <span className="btn-primary"> Upload File</span>
        </label>
        
      </section>

      <section className="files-card">
        <div className="files-card-header">
          <h2>My Files</h2>
        </div>
        {files.length === 0 ? (
          <p className="files-empty">No files uploaded yet.</p>
        ) : (
          <div className="files-table-wrap">
            <table className="files-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Uploaded</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr key={f.id}>
                    <td>{f.filename}</td>
                    <td>{f.size_bytes}</td>
                    <td>{new Date(f.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn-link">Share</button>
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

function ActivityView() {
  return (
    <section className="files-card">
      <div className="files-card-header">
        <h2>Activity Log</h2>
      </div>
      <p className="files-empty">No activity recorded yet.</p>
    </section>
  );
}

function SharedLinksView() {
  return (
    <section className="files-card">
      <div className="files-card-header">
        <h2>Shared Links</h2>
      </div>
      <p className="files-empty">No shared links yet.</p>
    </section>
  );
}

function SettingsView() {
  return (
    <section className="files-card">
      <div className="files-card-header">
        <h2>Settings</h2>
      </div>
      <p className="files-empty">Settings coming soon.</p>
    </section>
  );
}

function ProfileView({ user }) {
  const lastSignIn = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString()
    : "—";

  return (
    <section className="dash-welcome">
      <div className="dash-eyebrow">SIGNED IN</div>
      <h1 className="dash-title">You're in</h1>
      <p className="dash-subtitle">Signed in as {user.email}</p>

      <div className="user-meta">
        <div className="user-meta-row">
          <span>User ID</span>
          <code>{user.id}</code>
        </div>
        <div className="user-meta-row">
          <span>Last Sign In</span>
          <code>{lastSignIn}</code>
        </div>
      </div>
    </section>
  );
}