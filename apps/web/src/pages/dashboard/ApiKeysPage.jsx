import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@utils/api";

// ─── utils ────────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function timeAgo(iso) {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── icons ───────────────────────────────────────────────────────────────────
function IconCopy({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconCheck({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconKey({ size = 20, color = "#4F46E5" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

function IconTrash({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function IconWarn({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// ─── copy button ──────────────────────────────────────────────────────────────
function CopyBtn({ text, label = "Copy", size = "sm" }) {
  const [copied, setCopied] = useState(false);
  const btnSize = size === "lg"
    ? { padding: "10px 18px", fontSize: 14, gap: 8, borderRadius: 10 }
    : { padding: "6px 12px", fontSize: 12, gap: 6, borderRadius: 7 };

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <button
      onClick={copy}
      style={{
        display: "inline-flex", alignItems: "center",
        fontFamily: "Archivo, sans-serif", fontWeight: 600,
        color: copied ? "#10B981" : "#4F46E5",
        background: copied ? "#ECFDF5" : "#EEF2FF",
        border: `1px solid ${copied ? "#A7F3D0" : "#C7D2FE"}`,
        cursor: "pointer", transition: "all 150ms",
        ...btnSize,
      }}
    >
      {copied ? <IconCheck size={size === "lg" ? 16 : 14} /> : <IconCopy size={size === "lg" ? 16 : 14} />}
      {copied ? "Copied!" : label}
    </button>
  );
}

// ─── create key modal ─────────────────────────────────────────────────────────
function CreateKeyModal({ onClose, onCreate }) {
  const [name, setName]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.keys.create(name.trim());
      onCreate(res);
    } catch (err) {
      setError(err.message || "Failed to create key");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20, width: 440, padding: 28,
          boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: "#EEF2FF",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <IconKey size={18} />
          </div>
          <div>
            <h2 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 17, color: "#0F0F0F", margin: 0 }}>
              Create API Key
            </h2>
            <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280", margin: 0 }}>
              Give it a name to remember what it's for.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13, color: "#0F0F0F", display: "block", marginBottom: 8 }}>
            Key name
          </label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Production server, Staging, CI/CD pipeline"
            maxLength={80}
            style={{
              width: "100%", boxSizing: "border-box",
              fontFamily: "Archivo, sans-serif", fontSize: 14, color: "#0F0F0F",
              border: "1px solid #E5E7EB", borderRadius: 10, padding: "11px 14px",
              outline: "none", transition: "border-color 150ms",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#4F46E5")}
            onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
          />

          {error && (
            <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#EF4444", marginTop: 8, marginBottom: 0 }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 14,
                color: "#374151", background: "#F3F4F6", border: "none",
                borderRadius: 10, padding: "11px 0", cursor: "pointer", transition: "background 150ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#E5E7EB")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#F3F4F6")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || loading}
              style={{
                flex: 1, fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 14,
                color: "#fff",
                background: name.trim() && !loading ? "#4F46E5" : "#C7D2FE",
                border: "none", borderRadius: 10, padding: "11px 0",
                cursor: name.trim() && !loading ? "pointer" : "not-allowed",
                transition: "background 150ms",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {loading && (
                <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              )}
              {loading ? "Creating…" : "Create key"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── key created modal (show-once) ───────────────────────────────────────────
function KeyCreatedModal({ keyData, onClose }) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        style={{
          background: "#fff", borderRadius: 20, width: 500, padding: 28,
          boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: "#ECFDF5",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 17, color: "#0F0F0F", margin: 0 }}>
              API key created
            </h2>
            <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280", margin: 0 }}>
              "{keyData.key.name}"
            </p>
          </div>
        </div>

        {/* Warning */}
        <div style={{
          display: "flex", gap: 10, alignItems: "flex-start",
          background: "#FFFBEB", border: "1px solid #FCD34D",
          borderRadius: 10, padding: "12px 14px", marginBottom: 16,
        }}>
          <span style={{ color: "#D97706", flexShrink: 0, marginTop: 1 }}><IconWarn /></span>
          <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#92400E", lineHeight: 1.55 }}>
            <strong>Copy this key now.</strong> For security, we don't store API keys in plain text — you won't be able to see it again after closing this dialog.
          </div>
        </div>

        {/* Key display */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 12, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
            Your API key
          </label>
          <div style={{
            display: "flex", alignItems: "center", gap: 0,
            background: "#0D1117", borderRadius: 10, overflow: "hidden",
            border: "1px solid #30363D",
          }}>
            <code style={{
              flex: 1, fontFamily: "'Fira Code', 'Cascadia Code', monospace",
              fontSize: 13, color: "#E6EDF3", padding: "13px 16px",
              wordBreak: "break-all", lineHeight: 1.5,
            }}>
              {keyData.secret}
            </code>
          </div>
          <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
            <CopyBtn text={keyData.secret} label="Copy API key" size="lg" />
          </div>
        </div>

        {/* Confirm checkbox */}
        <label style={{
          display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
          padding: "12px 14px", borderRadius: 10,
          background: confirmed ? "#ECFDF5" : "#F9FAFB",
          border: `1px solid ${confirmed ? "#A7F3D0" : "#E5E7EB"}`,
          transition: "all 150ms", marginBottom: 16,
        }}>
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: "#10B981", cursor: "pointer" }}
          />
          <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#374151", fontWeight: 500 }}>
            I have copied my API key and stored it somewhere safe.
          </span>
        </label>

        <button
          onClick={onClose}
          disabled={!confirmed}
          style={{
            width: "100%", fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 14,
            color: "#fff",
            background: confirmed ? "#10B981" : "#D1D5DB",
            border: "none", borderRadius: 10, padding: "12px 0",
            cursor: confirmed ? "pointer" : "not-allowed", transition: "background 150ms",
          }}
        >
          Done, I've saved it
        </button>
      </motion.div>
    </div>
  );
}

// ─── revoke confirm ───────────────────────────────────────────────────────────
function RevokeConfirmModal({ keyName, onConfirm, onCancel, loading }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20, width: 400, padding: 28,
          boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%", background: "#FEF2F2",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
          }}>
            <IconTrash size={20} />
          </div>
          <h2 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 18, color: "#0F0F0F", margin: "0 0 8px" }}>
            Revoke API key?
          </h2>
          <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 14, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>
            <strong style={{ color: "#0F0F0F" }}>{keyName}</strong> will stop working immediately. Any integrations using it will break.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 14,
              color: "#374151", background: "#F3F4F6", border: "none",
              borderRadius: 10, padding: "11px 0", cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1, fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 14,
              color: "#fff", background: loading ? "#FCA5A5" : "#EF4444",
              border: "none", borderRadius: 10, padding: "11px 0",
              cursor: loading ? "not-allowed" : "pointer", transition: "background 150ms",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {loading && <div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />}
            {loading ? "Revoking…" : "Revoke key"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── key row ──────────────────────────────────────────────────────────────────
function KeyRow({ k, onRevoke }) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ borderBottom: "1px solid #F3F4F6" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* Name */}
      <td style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: "#EEF2FF",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <IconKey size={14} />
          </div>
          <span style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13, color: "#0F0F0F" }}>
            {k.name}
          </span>
        </div>
      </td>

      {/* Key prefix */}
      <td style={{ padding: "14px 16px" }}>
        <code style={{
          fontFamily: "'Fira Code', 'Cascadia Code', monospace",
          fontSize: 12, color: "#6B7280",
          background: "#F3F4F6", padding: "4px 10px", borderRadius: 6,
        }}>
          {k.keyPrefix}
        </code>
      </td>

      {/* Status */}
      <td style={{ padding: "14px 16px" }}>
        <span style={{
          fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 700,
          color: k.active ? "#065F46" : "#991B1B",
          background: k.active ? "#ECFDF5" : "#FEF2F2",
          padding: "3px 10px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.05em",
        }}>
          {k.active ? "Active" : "Revoked"}
        </span>
      </td>

      {/* Created */}
      <td style={{ padding: "14px 16px" }}>
        <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280" }}>
          {fmtDate(k.createdAt)}
        </span>
      </td>

      {/* Last used */}
      <td style={{ padding: "14px 16px" }}>
        <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#9CA3AF" }}>
          {timeAgo(k.lastUsedAt)}
        </span>
      </td>

      {/* Actions */}
      <td style={{ padding: "14px 16px", textAlign: "right" }}>
        {k.active && (
          <button
            onClick={() => onRevoke(k)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontFamily: "Archivo, sans-serif", fontSize: 12, fontWeight: 600,
              color: "#EF4444", background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 7, padding: "6px 12px",
              cursor: "pointer", transition: "all 150ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#EF4444";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "#EF4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#FEF2F2";
              e.currentTarget.style.color = "#EF4444";
              e.currentTarget.style.borderColor = "#FECACA";
            }}
          >
            <IconTrash />
            Revoke
          </button>
        )}
      </td>
    </motion.tr>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function ApiKeysPage() {
  const [keys, setKeys]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [createOpen, setCreate]   = useState(false);
  const [newKeyData, setNewKeyData] = useState(null);
  const [revoking, setRevoking]   = useState(null);
  const [revokeLoading, setRL]    = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api.keys.list();
      setKeys(res.keys ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreated(data) {
    setCreate(false);
    setNewKeyData(data);
    setKeys((prev) => [data.key, ...prev]);
  }

  async function handleRevoke(k) {
    setRevoking(k);
  }

  async function confirmRevoke() {
    if (!revoking) return;
    setRL(true);
    try {
      await api.keys.revoke(revoking.id);
      setKeys((prev) => prev.map((k) => k.id === revoking.id ? { ...k, active: false } : k));
      setRevoking(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setRL(false);
    }
  }

  const activeKeys  = keys.filter((k) => k.active);
  const revokedKeys = keys.filter((k) => !k.active);

  return (
    <div style={{ fontFamily: "Archivo, sans-serif", maxWidth: 900 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Modals */}
      <AnimatePresence>
        {createOpen && (
          <CreateKeyModal
            onClose={() => setCreate(false)}
            onCreate={handleCreated}
          />
        )}
        {newKeyData && (
          <KeyCreatedModal
            keyData={newKeyData}
            onClose={() => setNewKeyData(null)}
          />
        )}
        {revoking && (
          <RevokeConfirmModal
            keyName={revoking.name}
            onConfirm={confirmRevoke}
            onCancel={() => setRevoking(null)}
            loading={revokeLoading}
          />
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "Archivo, sans-serif", fontSize: 26, fontWeight: 800, color: "#0F0F0F", margin: "0 0 6px" }}>
            API Keys
          </h1>
          <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 15, color: "#6B7280", margin: 0 }}>
            Use API keys to authenticate server-side calls to the Humora API.
          </p>
        </div>
        <button
          onClick={() => setCreate(true)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 14,
            color: "#fff", background: "#4F46E5",
            border: "none", borderRadius: 10, padding: "10px 18px",
            cursor: "pointer", transition: "all 150ms",
            boxShadow: "0 1px 4px rgba(79,70,229,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#4338CA";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(79,70,229,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#4F46E5";
            e.currentTarget.style.boxShadow = "0 1px 4px rgba(79,70,229,0.3)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create API key
        </button>
      </div>

      {/* ── Security banner ── */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 12,
        background: "#FFF7ED", border: "1px solid #FED7AA",
        borderRadius: 12, padding: "12px 16px", marginBottom: 24,
      }}>
        <span style={{ color: "#EA580C", flexShrink: 0, marginTop: 1 }}><IconWarn size={15} /></span>
        <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#9A3412", margin: 0, lineHeight: 1.55 }}>
          API keys are <strong>secret credentials</strong> — never expose them in client-side code, public repos, or frontend apps.
          Use environment variables (e.g. <code style={{ fontFamily: "monospace", background: "#FEE2C0", padding: "1px 5px", borderRadius: 4 }}>HUMORA_API_KEY</code>) to keep them secure.
        </p>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#FEF2F2", border: "1px solid #FECACA",
          borderRadius: 10, padding: "11px 16px", marginBottom: 20,
          fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#991B1B",
        }}>
          {error}
          <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#991B1B", fontSize: 18 }}>×</button>
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div style={{
          background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16,
          padding: 48, display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          fontFamily: "Archivo, sans-serif", fontSize: 14, color: "#9CA3AF",
        }}>
          <div style={{ width: 22, height: 22, border: "2px solid #E5E7EB", borderTop: "2px solid #4F46E5", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          Loading keys…
        </div>
      ) : keys.length === 0 ? (
        /* ── Empty state ── */
        <div style={{
          background: "#fff", border: "1px dashed #E5E7EB", borderRadius: 16,
          padding: "56px 24px", textAlign: "center",
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", background: "#EEF2FF",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
          }}>
            <IconKey size={24} />
          </div>
          <p style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 16, color: "#0F0F0F", margin: "0 0 8px" }}>
            No API keys yet
          </p>
          <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 14, color: "#6B7280", margin: "0 0 24px" }}>
            Create your first API key to start authenticating server-side requests.
          </p>
          <button
            onClick={() => setCreate(true)}
            style={{
              fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 14,
              color: "#fff", background: "#4F46E5", border: "none",
              borderRadius: 10, padding: "11px 22px", cursor: "pointer",
            }}
          >
            Create your first key
          </button>
        </div>
      ) : (
        <>
          {/* ── Active keys table ── */}
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 14, color: "#0F0F0F" }}>
                  Active keys
                </span>
                <span style={{
                  fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 700,
                  color: "#4F46E5", background: "#EEF2FF",
                  borderRadius: 999, padding: "2px 8px",
                }}>
                  {activeKeys.length}
                </span>
              </div>
            </div>
            {activeKeys.length === 0 ? (
              <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#9CA3AF", textAlign: "center", padding: "28px 20px", margin: 0 }}>
                No active keys — create one above.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                      {["Name", "Key", "Status", "Created", "Last used", ""].map((h) => (
                        <th key={h} style={{
                          textAlign: h === "" ? "right" : "left",
                          padding: "10px 16px",
                          fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600,
                          color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em",
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeKeys.map((k) => (
                      <KeyRow key={k.id} k={k} onRevoke={handleRevoke} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Revoked keys (collapsed) ── */}
          {revokedKeys.length > 0 && (
            <details style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden" }}>
              <summary style={{
                padding: "16px 20px", cursor: "pointer", userSelect: "none",
                fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 14, color: "#6B7280",
                display: "flex", alignItems: "center", gap: 8, listStyle: "none",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                Revoked keys ({revokedKeys.length})
              </summary>
              <div style={{ overflowX: "auto", borderTop: "1px solid #F3F4F6" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                      {["Name", "Key", "Status", "Created", "Last used", ""].map((h) => (
                        <th key={h} style={{
                          textAlign: "left", padding: "10px 16px",
                          fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600,
                          color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em",
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {revokedKeys.map((k) => (
                      <KeyRow key={k.id} k={k} onRevoke={handleRevoke} />
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </>
      )}
    </div>
  );
}
