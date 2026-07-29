import React from "react";
import "../styles/start.css";
import hero from "../assets/hero.png"


const Svg = ({ children, size = 20, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    {children}
  </svg>
);

const ShieldIcon = (p) => (
  <Svg {...p}>
    <path d="M12 2 4 5v6c0 5 3.4 8.7 8 9 4.6-.3 8-4 8-9V5l-8-3Z" />
  </Svg>
);
const ShieldCheckIcon = (p) => (
  <Svg {...p}>
    <path d="M12 2 4 5v6c0 5 3.4 8.7 8 9 4.6-.3 8-4 8-9V5l-8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);
const LockIcon = (p) => (
  <Svg {...p}>
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </Svg>
);
const LinkIcon = (p) => (
  <Svg {...p}>
    <path d="M9 15 15 9" />
    <path d="M8.5 16.5 6 19a3.5 3.5 0 0 1-5-5l2.5-2.5" />
    <path d="M15.5 7.5 18 5a3.5 3.5 0 0 1 5 5l-2.5 2.5" />
  </Svg>
);
const UsersIcon = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 20a6 6 0 0 1 11 0" />
    <circle cx="17" cy="9" r="2.4" />
    <path d="M15.8 13a5 5 0 0 1 4.7 5" />
  </Svg>
);
const FileTextIcon = (p) => (
  <Svg {...p}>
    <path d="M6 3h9l4 4v14H6Z" />
    <path d="M8 12h8M8 16h8M8 8h3" />
  </Svg>
);
const DownloadIcon = (p) => (
  <Svg {...p}>
    <path d="M12 4v11" />
    <path d="m7 10 5 5 5-5" />
    <path d="M5 20h14" />
  </Svg>
);
const UploadIcon = (p) => (
  <Svg {...p}>
    <path d="M12 20V9" />
    <path d="m7 14 5-5 5 5" />
    <path d="M5 20h14" />
  </Svg>
);
const CloudIcon = (p) => (
  <Svg {...p}>
    <path d="M7 18a4.5 4.5 0 0 1-.6-8.96A5.5 5.5 0 0 1 17.4 8.5 4 4 0 0 1 17 18Z" />
  </Svg>
);
const PersonIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </Svg>
);
const BellIcon = (p) => (
  <Svg {...p}>
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </Svg>
);
const HomeIcon = (p) => (
  <Svg {...p}>
    <path d="m3 11 9-8 9 8" />
    <path d="M5 10v10h14V10" />
  </Svg>
);
const FolderIcon = (p) => (
  <Svg {...p}>
    <path d="M4 6h5l2 2h9v11H4Z" />
  </Svg>
);
const ActivityIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 12h1.5l1.5 3 2-6 1.5 3H16" />
  </Svg>
);
const TrashIcon = (p) => (
  <Svg {...p}>
    <path d="M5 7h14" />
    <path d="M9 7V5h6v2" />
    <path d="M7 7l1 13h8l1-13" />
  </Svg>
);
const SettingsIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 13a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V19a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H4a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.5V4a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.5 1H20a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </Svg>
);
const LogOutIcon = (p) => (
  <Svg {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5" />
    <path d="M21 12H9" />
  </Svg>
);
const MoreVerticalIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="19" r="1" />
  </Svg>
);
const ArrowRightIcon = (p) => (
  <Svg {...p}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </Svg>
);

/* ---------- static content ---------- */
const NAV_LINKS = ["Features", "How it works", "Security", "Pricing", "About"];

const RECENT_FILES = [
  { name: "Resume.pdf", meta: "2.4 MB  •  May 20, 2025", badge: "Shared", kind: "pdf" },
  { name: "Project Proposal.docx", meta: "45.6 MB  •  May 19, 2025", badge: "Private", kind: "docx" },
  { name: "Financial Report.xlsx", meta: "1 MB  •  May 18, 2025", badge: "Shared", kind: "xlsx" },
  { name: "Design Assets", meta: "7.3 MB  •  May 17, 2025", badge: "Private", kind: "folder" },
];

const FEATURES = [
  { icon: LockIcon, title: "End-to-End Encryption", text: "Your files are encrypted with AES-256." },
  { icon: LinkIcon, title: "Secure Sharing", text: "Share files with password and expiry control." },
  { icon: UsersIcon, title: "Access Control", text: "Set permissions and control who can access." },
  { icon: FileTextIcon, title: "Audit Logs", text: "Every action is logged and traceable." },
  { icon: DownloadIcon, title: "Download Tracking", text: "Know who downloaded your files and when." },
];

const STEPS = [
  { icon: UploadIcon, title: "Upload", text: "Upload your file securely." },
  { icon: LockIcon, title: "Encrypt", text: "We encrypt it with AES-256." },
  { icon: CloudIcon, title: "Store Securely", text: "Encrypted file is stored in the cloud." },
  { icon: LinkIcon, title: "Share Link", text: "Generate a secure shareable link." },
  { icon: PersonIcon, title: "Recipient Access", text: "Authorized users access the file." },
  { icon: ShieldCheckIcon, title: "Activity Logged", text: "All actions are logged." },
];

const FILE_BADGES = {
  pdf: { label: "PDF", className: "file-icon-pdf" },
  docx: { label: "W", className: "file-icon-docx" },
  xlsx: { label: "X", className: "file-icon-xlsx" },
  folder: { label: null, className: "file-icon-folder" },
};

export default function Start( {onGetStarted,onSignIn}) {
  return (
    <div className="ts-page">
      {/* ---------- Nav ---------- */}
      <header className="ts-header">
        <div className="ts-header-inner">
          <div className="ts-brand">
            <span className="ts-brand-icon">
              <ShieldIcon size={22} />
            </span>
            <span className="ts-brand-text">
              <span className="ts-brand-name">
                Trust<span className="ts-brand-accent">Share</span>
              </span>
              <span className="ts-brand-sub">Secure File Exchange</span>
            </span>
          </div>

          <nav className="ts-nav-links">
            {NAV_LINKS.map((label) => (
              <a key={label} href={`#${label.toLowerCase().replace(/\s+/g, "-")}`} className="ts-nav-link">
                {label}
              </a>
            ))}
          </nav>

          <div className="ts-header-actions">
            <button className="ts-link-btn" onClick={onGetStarted}>
              Sign In
            </button>
            <button className="ts-btn ts-btn-primary" onClick={onGetStarted}>
              Create Account
            </button>
          </div>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="ts-hero">
        <div className="ts-hero-inner">
          <div className="ts-hero-copy">
            <div className="ts-pill">
              <ShieldIcon size={13} />
              AES-256 ENCRYPTION&nbsp;&nbsp;•&nbsp;&nbsp;END-TO-END-ENCRYPTION
            </div>
            <h1 className="ts-h1">
              Share sensitive files
              <br />              <span className="ts-accent">without compromising</span>
              <br />
              them.
            </h1>
            <p className="ts-lead">
              TrustShare lets you upload, encrypt, and share files securely. You
              stay in control of who can access, view, or download them.
            </p>
            <div className="ts-actions">
              <button className="ts-btn ts-btn-primary ts-btn-lg" onClick={onGetStarted}>
                Create Free Account
              </button>
              <button className="ts-btn ts-btn-outline ts-btn-lg" onClick={onGetStarted}>
                Sign In
              </button>
            </div>
            <p className="ts-signin-hint">
              Already have an account?{" "}
              <a href="#signin" className="ts-inline-link" onClick={onSignIn}>
                Sign in <ArrowRightIcon size={13} />
              </a>
            </p>
          </div>

          {/* ---------- Dashboard preview card ---------- */}
          <img src={hero} className="dash-card" alt="Dashboard Preview" />

        </div>
      </section>

      {/* ---------- Feature strip ---------- */}
      <section className="ts-feature-strip">
        <div className="ts-feature-strip-inner">
          {FEATURES.map((f) => (
            <div className="feature-item" key={f.title}>
              <span className="feature-icon">
                <f.icon size={20} />
              </span>
              <span className="feature-title">{f.title}</span>
              <span className="feature-text">{f.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="ts-how" id="how-it-works">
        <h2 className="ts-how-title">How TrustShare works</h2>
        <div className="ts-steps">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.title}>
              <div className="step-item">
                <div className="step-icon-wrap">
                  <span className="step-icon">
                    <step.icon size={22} />
                  </span>
                  <span className="step-number">{i + 1}</span>
                </div>
                <span className="step-title">{step.title}</span>
                <span className="step-text">{step.text}</span>
              </div>
              {i < STEPS.length - 1 && <span className="step-connector" />}
            </React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
}
