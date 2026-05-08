import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@utils/api";
import { Link } from "react-router-dom";

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

function KeyCard({ site }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied]     = useState(false);

  const isLive  = site.sitekey.startsWith("sk_live_");
  // Show prefix + first 4 random chars + •••• + last 4 chars
  const prefix  = isLive ? "sk_live_" : "sk_test_";
  const rand    = site.sitekey.slice(prefix.length);
  const masked  = `${prefix}${rand.slice(0, 4)}${"•".repeat(Math.max(0, rand.length - 8))}${rand.slice(-4)}`;

  async function copy() {
    await navigator.clipboard.writeText(site.sitekey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 14,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: isLive ? "#EEF2FF" : "#F3F4F6",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <KeyIcon />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 14, color: "#0F0F0F" }}>
              {site.domain}
            </span>
            <span style={{
              fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600,
              color: isLive ? "#065F46" : "#92400E",
              background: isLive ? "#ECFDF5" : "#FFFBEB",
              padding: "2px 8px", borderRadius: 999, textTransform: "uppercase",
            }}>
              {isLive ? "Live" : "Test"}
            </span>
          </div>
          <code style={{
            fontFamily: "monospace", fontSize: 13, color: "#6B7280",
            background: "#F9FAFB", padding: "4px 10px", borderRadius: 6,
            letterSpacing: "0.03em",
          }}>
            {revealed ? site.sitekey : masked}
          </code>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#9CA3AF" }}>
          {site.totalVerifications?.toLocaleString() ?? 0} verifications
        </span>
        <button
          onClick={() => setRevealed(r => !r)}
          title={revealed ? "Hide key" : "Reveal key"}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32, borderRadius: 8,
            border: "1px solid #E5E7EB", background: "#fff",
            cursor: "pointer", color: "#6B7280", transition: "all 150ms",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#4F46E5"; e.currentTarget.style.color = "#4F46E5"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#6B7280"; }}
        >
          <EyeIcon open={revealed} />
        </button>
        <button
          onClick={copy}
          title="Copy key"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32, borderRadius: 8,
            border: "1px solid #E5E7EB", background: "#fff",
            cursor: "pointer", color: copied ? "#10B981" : "#6B7280", transition: "all 150ms",
          }}
          onMouseEnter={e => { if (!copied) { e.currentTarget.style.borderColor = "#4F46E5"; e.currentTarget.style.color = "#4F46E5"; } }}
          onMouseLeave={e => { if (!copied) { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#6B7280"; } }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
    </motion.div>
  );
}

export default function ApiKeysPage() {
  const [sites, setSites]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    api.dashboard.sites()
      .then(data => setSites(Array.isArray(data) ? data : data.sites ?? []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ fontFamily: "Archivo, sans-serif", maxWidth: 800 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F0F0F", margin: 0 }}>API Keys</h1>
          <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
            Your sitekeys authenticate requests from your domains to Humora.
          </p>
        </div>
        <Link
          to="/dashboard/sites"
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#4F46E5", color: "#fff",
            padding: "10px 18px", borderRadius: 10,
            fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 14,
            textDecoration: "none", transition: "background 150ms",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#4338CA")}
          onMouseLeave={e => (e.currentTarget.style.background = "#4F46E5")}
        >
          + Add Site
        </Link>
      </div>

      {/* Info banner */}
      <div style={{
        background: "#EEF2FF", border: "1px solid #C7D2FE",
        borderRadius: 12, padding: "12px 16px",
        display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 24,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#3730A3", margin: 0, lineHeight: 1.5 }}>
          Each site has its own sitekey. Use it in the widget's <code style={{ fontFamily: "monospace", background: "#E0E7FF", padding: "1px 5px", borderRadius: 4 }}>data-sitekey</code> attribute.
          Never share live keys publicly.
        </p>
      </div>

      {/* Keys list */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60, color: "#9CA3AF", fontSize: 14 }}>
          <div style={{ width: 28, height: 28, border: "2px solid #E5E7EB", borderTop: "2px solid #4F46E5", borderRadius: "50%", animation: "spin 0.7s linear infinite", marginRight: 12 }} />
          Loading keys…
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: 60, color: "#EF4444", fontSize: 14 }}>{error}</div>
      ) : sites.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 24px",
          background: "#fff", border: "1px dashed #E5E7EB", borderRadius: 14,
        }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
          </div>
          <p style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 15, color: "#0F0F0F", marginBottom: 8 }}>No API keys yet</p>
          <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 14, color: "#6B7280", marginBottom: 20 }}>Add your first site to generate a sitekey.</p>
          <Link to="/dashboard/sites" style={{ color: "#4F46E5", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
            Add a site →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sites.map(site => <KeyCard key={site.sitekey} site={site} />)}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
