import { api } from "@utils/api";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

const POPUP_HTML = (sitekey) => `<!-- Step 1: Add to your <head> -->
<script src="https://widget.humora.io/humora.min.js" async defer></script>

<!-- Step 2: Your existing form — no changes needed -->
<form id="my-form">
  <input type="email"    id="email"    placeholder="Email" />
  <input type="password" id="password" placeholder="Password" />
  <button type="submit">Sign Up</button>
</form>

<!-- Step 3: Hidden popup (stays invisible until triggered) -->
<div id="humora-backdrop" style="display:none;position:fixed;inset:0;
  background:rgba(0,0,0,0.55);z-index:9999;
  align-items:center;justify-content:center;">
  <div style="background:#fff;border-radius:20px;max-width:400px;width:100%;
    overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.2);">
    <div style="padding:14px 18px;border-bottom:1px solid #F3F4F6;
      display:flex;justify-content:space-between;align-items:center;
      font-family:sans-serif;font-size:13px;font-weight:600;color:#0F0F0F;">
      Human Verification
      <button onclick="closeHumoraPopup()" style="background:none;border:none;
        font-size:22px;cursor:pointer;color:#9CA3AF;line-height:1;">×</button>
    </div>
    <div id="humora-widget"></div>
  </div>
</div>

<!-- Step 4: Wire everything together -->
<script>
  var _humoraToken = null;

  document.getElementById('my-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (_humoraToken) {
      submitMyForm();
    } else {
      document.getElementById('humora-backdrop').style.display = 'flex';
    }
  });

  function closeHumoraPopup() {
    document.getElementById('humora-backdrop').style.display = 'none';
  }

  function submitMyForm() {
    fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email:        document.getElementById('email').value,
        password:     document.getElementById('password').value,
        humora_token: _humoraToken,
      }),
    })
    .then(r => r.json())
    .then(data => { if (data.success) window.location = '/dashboard'; });
  }

  humora.ready(function() {
    humora.render('humora-widget', {
      sitekey: '${sitekey}',

      callback: function(token) {
        _humoraToken = token;
        closeHumoraPopup();
        submitMyForm();
      },

      expiredCallback: function() {
        _humoraToken = null;
      },
    });
  });
</script>`;

const POPUP_REACT = (sitekey) => `// Step 1: Add to public/index.html
// <script src="https://widget.humora.io/humora.min.js" async defer></script>

import { useState, useRef, useEffect, useCallback } from 'react'

// Reusable popup component
function HumoraPopup({ isOpen, onVerified, onClose }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isOpen || !window.humora || !containerRef.current) return
    window.humora.render(containerRef.current, {
      sitekey: '${sitekey}',
      callback: (token) => onVerified(token),
      expiredCallback: () => {},
    })
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 20,
          width: '100%', maxWidth: 400, overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 18px', borderBottom: '1px solid #F3F4F6',
          fontFamily: 'sans-serif', fontSize: 13, fontWeight: 600, color: '#0F0F0F',
        }}>
          Human Verification
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            fontSize: 22, cursor: 'pointer', color: '#9CA3AF', lineHeight: 1,
          }}>×</button>
        </div>
        <div ref={containerRef} />
      </div>
    </div>
  )
}

// Step 2: Use it in your form
export default function SignupForm() {
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [loading, setLoading]     = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowPopup(true)
  }

  const handleVerified = useCallback(async (token) => {
    setShowPopup(false)
    setLoading(true)
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, humora_token: token }),
    })
    const data = await res.json()
    if (data.success) window.location = '/dashboard'
    setLoading(false)
  }, [email, password])

  return (
    <>
      <HumoraPopup
        isOpen={showPopup}
        onVerified={handleVerified}
        onClose={() => setShowPopup(false)}
      />
      <form onSubmit={handleSubmit}>
        <input type="email"    value={email}    onChange={e => setEmail(e.target.value)}    placeholder="Email" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Sign Up'}
        </button>
      </form>
    </>
  )
}`;

const SERVER_SNIPPETS = {
  "Node.js": `// POST /api/signup — verify the token before creating the user
app.post('/api/signup', async (req, res) => {
  const { email, password, humora_token } = req.body

  const check = await fetch('https://api.humora.io/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token:   humora_token,
      sitekey: process.env.HUMORA_SITE_KEY,  // from your .env
    }),
  }).then(r => r.json())

  if (!check.success) {
    return res.status(400).json({ error: 'Human verification required' })
  }

  await createUser(email, password)
  res.json({ success: true })
})`,

  Python: `# POST /api/signup — verify the token before creating the user
@app.route('/api/signup', methods=['POST'])
def signup():
    data  = request.get_json()
    check = requests.post('https://api.humora.io/api/verify', json={
        'token':   data['humora_token'],
        'sitekey': os.environ['HUMORA_SITE_KEY'],  # from your env
    }).json()

    if not check.get('success'):
        return jsonify({'error': 'Human verification required'}), 400

    create_user(data['email'], data['password'])
    return jsonify({'success': True})`,

  PHP: `<?php
// POST /api/signup — verify the token before creating the user
$data  = json_decode(file_get_contents('php://input'), true);
$check = json_decode(file_get_contents(
  'https://api.humora.io/api/verify', false,
  stream_context_create(['http' => [
    'method'  => 'POST',
    'header'  => 'Content-Type: application/json',
    'content' => json_encode([
      'token'   => $data['humora_token'],
      'sitekey' => getenv('HUMORA_SITE_KEY'),  // from your env
    ]),
  ]])
), true);

if (!$check['success']) {
  http_response_code(400);
  echo json_encode(['error' => 'Human verification required']);
  exit;
}

create_user($data['email'], $data['password']);
echo json_encode(['success' => true]);`,
};

function getFavicon(domain) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=40`;
}

function CopyButton({ text, onCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: copied ? "#10B981" : "#9CA3AF",
        transition: "color 150ms",
      }}
      onMouseEnter={(e) => {
        if (!copied) e.currentTarget.style.color = "#4F46E5";
      }}
      onMouseLeave={(e) => {
        if (!copied) e.currentTarget.style.color = "#9CA3AF";
      }}>
      {copied ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

function EyeButton({ visible, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#9CA3AF",
        transition: "color 150ms",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#4F46E5")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}>
      {visible ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      )}
    </button>
  );
}

function SiteCard({ site, onViewAnalytics, onGetCode, onDelete, deleting }) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.2 }}
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 24,
        border: "1px solid #E5E7EB",
        opacity: deleting ? 0.5 : 1,
        transition: "all 180ms",
      }}>
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={getFavicon(site.domain)}
            alt=""
            style={{ width: 32, height: 32, borderRadius: 8 }}
          />
          <div>
            <div
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 600,
                fontSize: 15,
                color: "#0F0F0F",
              }}>
              {site.domain}
            </div>
            <span
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 11,
                fontWeight: 500,
                color: site.active ? "#065F46" : "#9CA3AF",
                backgroundColor: site.active ? "#ECFDF5" : "#F3F4F6",
                padding: "2px 8px",
                borderRadius: 6,
                textTransform: "uppercase",
              }}>
              {site.active ? "active" : "inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* Sitekey row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#F9FAFB",
          borderRadius: 8,
          padding: "10px 12px",
          marginBottom: 16,
        }}>
        <code
          style={{
            fontFamily: "'Fira Code', 'Cascadia Code', monospace",
            fontSize: 12,
            color: "#0F0F0F",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
          {showKey
            ? site.sitekey
            : site.sitekey.slice(0, 10) + "••••••••" + site.sitekey.slice(-4)}
        </code>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <EyeButton visible={showKey} onToggle={() => setShowKey(!showKey)} />
          <CopyButton text={site.sitekey} onCopy={handleCopy} />
        </div>
      </div>
      {copied && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            fontFamily: "Archivo, sans-serif",
            fontSize: 11,
            color: "#10B981",
            textAlign: "right",
            marginBottom: 8,
          }}>
          Copied!
        </motion.div>
      )}

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          marginBottom: 16,
        }}>
        <div>
          <div
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 10,
              color: "#9CA3AF",
              textTransform: "uppercase",
              marginBottom: 2,
            }}>
            Verifications
          </div>
          <div
            style={{
              fontFamily: "Archivo, sans-serif",
              fontWeight: 600,
              fontSize: 14,
              color: "#0F0F0F",
            }}>
            {(site.verificationsThisMonth ?? 0).toLocaleString()}
          </div>
        </div>
        <div>
          <div
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 10,
              color: "#9CA3AF",
              textTransform: "uppercase",
              marginBottom: 2,
            }}>
            Total
          </div>
          <div
            style={{
              fontFamily: "Archivo, sans-serif",
              fontWeight: 600,
              fontSize: 14,
              color: "#0F0F0F",
            }}>
            {(site.totalVerifications ?? 0).toLocaleString()}
          </div>
        </div>
        <div>
          <div
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 10,
              color: "#9CA3AF",
              textTransform: "uppercase",
              marginBottom: 2,
            }}>
            Environment
          </div>
          <div
            style={{
              fontFamily: "Archivo, sans-serif",
              fontWeight: 500,
              fontSize: 12,
              color: site.environment === "production" ? "#4F46E5" : "#F59E0B",
              backgroundColor:
                site.environment === "production" ? "#EEF2FF" : "#FFFBEB",
              padding: "2px 6px",
              borderRadius: 4,
              display: "inline-block",
            }}>
            {site.environment === "production" ? "sk_live" : "sk_test"}
          </div>
        </div>
      </div>

      {/* Actions row */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onGetCode(site)}
          style={{
            flex: 1,
            fontFamily: "Archivo, sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: "#4F46E5",
            backgroundColor: "#EEF2FF",
            border: "1px solid #C7D2FE",
            borderRadius: 8,
            padding: "8px 12px",
            cursor: "pointer",
            transition: "all 150ms",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#E0E7FF";
            e.currentTarget.style.borderColor = "#818CF8";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#EEF2FF";
            e.currentTarget.style.borderColor = "#C7D2FE";
          }}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          Get Code
        </button>
        <button
          onClick={() => onViewAnalytics(site)}
          style={{
            flex: 1,
            fontFamily: "Archivo, sans-serif",
            fontSize: 12,
            fontWeight: 500,
            color: "#374151",
            backgroundColor: "#F3F4F6",
            border: "none",
            borderRadius: 8,
            padding: "8px 12px",
            cursor: "pointer",
            transition: "all 150ms",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#E5E7EB";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#F3F4F6";
          }}>
          Analytics
        </button>
        <button
          onClick={() => onDelete(site)}
          disabled={deleting}
          style={{
            fontFamily: "Archivo, sans-serif",
            fontSize: 12,
            fontWeight: 500,
            color: "#EF4444",
            backgroundColor: "#FEF2F2",
            border: "none",
            borderRadius: 8,
            padding: "8px 12px",
            cursor: deleting ? "not-allowed" : "pointer",
            transition: "all 150ms",
          }}
          onMouseEnter={(e) => {
            if (!deleting) {
              e.currentTarget.style.backgroundColor = "#EF4444";
              e.currentTarget.style.color = "#fff";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FEF2F2";
            e.currentTarget.style.color = "#EF4444";
          }}>
          {deleting ? "…" : "Delete"}
        </button>
      </div>
    </motion.div>
  );
}

function AddSitePanel({ open, onClose, onAdd }) {
  const [domain, setDomain] = useState("");
  const [environment, setEnvironment] = useState("production");
  const [newSitekey, setNewSitekey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { site } = await api.dashboard.addSite({
        domain: domain.trim(),
        environment,
      });
      setNewSitekey(site.sitekey);
      onAdd(site);
    } catch (e) {
      setError(e.message || "Failed to create site");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDomain("");
    setNewSitekey("");
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 100,
            }}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: 400,
              backgroundColor: "#fff",
              boxShadow: "-8px 0 32px rgba(0,0,0,0.12)",
              zIndex: 101,
              display: "flex",
              flexDirection: "column",
            }}>
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "24px 24px",
                borderBottom: "1px solid #E5E7EB",
              }}>
              <h2
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  color: "#0F0F0F",
                  margin: 0,
                }}>
                Add New Site
              </h2>
              <button
                onClick={handleClose}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6B7280",
                  borderRadius: 8,
                  transition: "background 150ms",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#F3F4F6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
              {!newSitekey ? (
                <>
                  {error && (
                    <div
                      style={{
                        backgroundColor: "#FEF2F2",
                        border: "1px solid #FECACA",
                        borderRadius: 10,
                        padding: "12px 14px",
                        marginBottom: 16,
                        fontFamily: "Archivo, sans-serif",
                        fontSize: 13,
                        color: "#991B1B",
                      }}>
                      {error}
                    </div>
                  )}

                  {/* Domain input */}
                  <div style={{ marginBottom: 24 }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Archivo, sans-serif",
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#0F0F0F",
                        marginBottom: 8,
                      }}>
                      Domain
                    </label>
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="yoursite.com"
                      disabled={loading}
                      style={{
                        width: "100%",
                        fontFamily: "Archivo, sans-serif",
                        fontSize: 14,
                        color: "#0F0F0F",
                        backgroundColor: "#fff",
                        border: "1px solid #E5E7EB",
                        borderRadius: 10,
                        padding: "12px 14px",
                        outline: "none",
                        transition: "border-color 150ms",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#4F46E5")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && domain.trim())
                          handleGenerate();
                      }}
                    />
                    <p
                      style={{
                        fontFamily: "Archivo, sans-serif",
                        fontSize: 12,
                        color: "#9CA3AF",
                        marginTop: 6,
                      }}>
                      Don't include https:// or www
                    </p>
                  </div>

                  {/* Environment toggle */}
                  <div style={{ marginBottom: 24 }}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "Archivo, sans-serif",
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#0F0F0F",
                        marginBottom: 8,
                      }}>
                      Environment
                    </label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {["production", "testing"].map((env) => (
                        <button
                          key={env}
                          onClick={() => setEnvironment(env)}
                          disabled={loading}
                          style={{
                            flex: 1,
                            fontFamily: "Archivo, sans-serif",
                            fontWeight: environment === env ? 600 : 400,
                            fontSize: 13,
                            color: environment === env ? "#4F46E5" : "#6B7280",
                            backgroundColor:
                              environment === env ? "#EEF2FF" : "#F3F4F6",
                            border: "none",
                            borderRadius: 10,
                            padding: "12px 16px",
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "all 150ms",
                            textTransform: "capitalize",
                          }}>
                          {env === "production" ? "Production" : "Testing"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate button */}
                  <button
                    onClick={handleGenerate}
                    disabled={!domain.trim() || loading}
                    style={{
                      width: "100%",
                      fontFamily: "Archivo, sans-serif",
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#fff",
                      backgroundColor:
                        domain.trim() && !loading ? "#4F46E5" : "#C7D2FE",
                      border: "none",
                      borderRadius: 12,
                      padding: "14px 20px",
                      cursor:
                        domain.trim() && !loading ? "pointer" : "not-allowed",
                      transition: "all 200ms",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                    onMouseEnter={(e) => {
                      if (domain.trim() && !loading) {
                        e.currentTarget.style.backgroundColor = "#4338CA";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(79,70,229,0.3)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        domain.trim() && !loading ? "#4F46E5" : "#C7D2FE";
                      e.currentTarget.style.boxShadow = "none";
                    }}>
                    {loading && (
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          border: "2px solid rgba(255,255,255,0.4)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                    )}
                    {loading ? "Creating…" : "Generate Sitekey"}
                  </button>
                </>
              ) : (
                <>
                  {/* Success state */}
                  <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        backgroundColor: "#ECFDF5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                      }}>
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3
                      style={{
                        fontFamily: "Archivo, sans-serif",
                        fontWeight: 700,
                        fontSize: 18,
                        color: "#0F0F0F",
                        marginBottom: 4,
                      }}>
                      Sitekey Generated
                    </h3>
                    <p
                      style={{
                        fontFamily: "Archivo, sans-serif",
                        fontSize: 13,
                        color: "#6B7280",
                      }}>
                      Save this key securely — it's shown only once
                    </p>
                  </div>

                  {/* Sitekey display */}
                  <div
                    style={{
                      backgroundColor: "#F9FAFB",
                      borderRadius: 10,
                      padding: "14px 16px",
                      marginBottom: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                    <code
                      style={{
                        fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                        fontSize: 12,
                        color: "#0F0F0F",
                      }}>
                      {newSitekey}
                    </code>
                    <CopyButton text={newSitekey} />
                  </div>

                  {/* Warning */}
                  <div
                    style={{
                      backgroundColor: "#FFFBEB",
                      border: "1px solid #FED7AA",
                      borderRadius: 10,
                      padding: "14px 16px",
                      marginBottom: 24,
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                    <div
                      style={{
                        fontFamily: "Archivo, sans-serif",
                        fontSize: 13,
                        color: "#92400E",
                        lineHeight: 1.5,
                      }}>
                      <strong>Save this key now.</strong> You won't be able to
                      see it again after closing this panel. Store it in a
                      secure location.
                    </div>
                  </div>

                  <button
                    onClick={handleClose}
                    style={{
                      width: "100%",
                      fontFamily: "Archivo, sans-serif",
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#fff",
                      backgroundColor: "#4F46E5",
                      border: "none",
                      borderRadius: 12,
                      padding: "14px 20px",
                      cursor: "pointer",
                      transition: "all 200ms",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#4338CA";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(79,70,229,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#4F46E5";
                      e.currentTarget.style.boxShadow = "none";
                    }}>
                    Done
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CodeBlock({ code, lang }) {
  return (
    <div
      style={{
        backgroundColor: "#0D1117",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #30363D",
      }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          backgroundColor: "#161B22",
          borderBottom: "1px solid #30363D",
        }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#FF5F57", "#FFBD2E", "#28C840"].map((c) => (
            <div
              key={c}
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                backgroundColor: c,
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontFamily: "Archivo, sans-serif",
            fontSize: 11,
            color: "#8B949E",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}>
          {lang}
        </span>
        <CopyButton text={code} />
      </div>
      <pre
        style={{
          margin: 0,
          padding: "16px",
          overflowX: "auto",
          fontFamily: "'Fira Code', 'Cascadia Code', monospace",
          fontSize: 12,
          lineHeight: 1.7,
          color: "#E6EDF3",
        }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function LangPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "Archivo, sans-serif",
        fontSize: 12,
        fontWeight: active ? 600 : 500,
        color: active ? "#4F46E5" : "#6B7280",
        backgroundColor: active ? "#EEF2FF" : "transparent",
        border: active ? "1px solid #C7D2FE" : "1px solid #E5E7EB",
        borderRadius: 7,
        padding: "5px 12px",
        cursor: "pointer",
        transition: "all 120ms",
      }}>
      {label}
    </button>
  );
}

function IntegrationSnippet({ site }) {
  const [frontendLang, setFrontendLang] = useState("HTML");
  const [serverLang, setServerLang] = useState("Node.js");

  if (!site) return null;

  const frontendCode =
    frontendLang === "HTML"
      ? POPUP_HTML(site.sitekey)
      : POPUP_REACT(site.sitekey);
  const serverCode = SERVER_SNIPPETS[serverLang];

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 28,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        marginTop: 20,
        border: "1px solid #E5E7EB",
      }}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}>
        <div>
          <h3
            style={{
              fontFamily: "Archivo, sans-serif",
              fontWeight: 800,
              fontSize: 16,
              color: "#0F0F0F",
              margin: "0 0 4px",
            }}>
            Quick Integration
          </h3>
          <p
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 13,
              color: "#6B7280",
              margin: 0,
            }}>
            Your sitekey is pre-filled — copy and paste into your project.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: 10,
            padding: "8px 12px",
          }}>
          <span
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 11,
              color: "#9CA3AF",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
            Sitekey
          </span>
          <code
            style={{
              fontFamily: "'Fira Code', 'Cascadia Code', monospace",
              fontSize: 12,
              color: "#0F0F0F",
            }}>
            {site.sitekey.slice(0, 12)}••••
          </code>
          <CopyButton text={site.sitekey} />
        </div>
      </div>

      {/* ── How it works ── */}
      <div
        style={{
          display: "flex",
          marginBottom: 24,
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #E5E7EB",
          fontFamily: "Archivo, sans-serif",
          fontSize: 12,
        }}>
        {[
          { n: "1", icon: "📄", text: "Add the script tag to your page" },
          {
            n: "2",
            icon: "🖐",
            text: "Submit triggers the verification popup",
          },
          {
            n: "3",
            icon: "✅",
            text: "User passes → token verified on your server",
          },
        ].map((step, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              padding: "12px 16px",
              background: i === 1 ? "#F5F3FF" : "#F9FAFB",
              borderRight: i < 2 ? "1px solid #E5E7EB" : "none",
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}>
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: i === 1 ? "#EEF2FF" : "#fff",
                border: "1px solid " + (i === 1 ? "#C7D2FE" : "#E5E7EB"),
                color: "#4F46E5",
                fontWeight: 700,
                fontSize: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 1,
              }}>
              {step.n}
            </span>
            <div>
              <div style={{ fontSize: 15, marginBottom: 2 }}>{step.icon}</div>
              <div style={{ color: "#374151", lineHeight: 1.45 }}>
                {step.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Frontend code ── */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}>
          <div>
            <span
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color: "#0F0F0F",
              }}>
              Frontend — Popup Integration
            </span>
            <span
              style={{
                marginLeft: 8,
                fontFamily: "Archivo, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: "#059669",
                backgroundColor: "#ECFDF5",
                padding: "2px 8px",
                borderRadius: 6,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}>
              Popup Mode
            </span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <LangPill
              label="HTML"
              active={frontendLang === "HTML"}
              onClick={() => setFrontendLang("HTML")}
            />
            <LangPill
              label="React"
              active={frontendLang === "React"}
              onClick={() => setFrontendLang("React")}
            />
          </div>
        </div>
        <CodeBlock
          code={frontendCode}
          lang={frontendLang === "HTML" ? "HTML + JS" : "JSX"}
        />
      </div>

      {/* ── Divider ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}>
        <div style={{ flex: 1, height: 1, backgroundColor: "#E5E7EB" }} />
        <span
          style={{
            fontFamily: "Archivo, sans-serif",
            fontSize: 11,
            color: "#9CA3AF",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}>
          STEP 4 · SERVER VERIFICATION
        </span>
        <div style={{ flex: 1, height: 1, backgroundColor: "#E5E7EB" }} />
      </div>

      {/* ── Server verification ── */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}>
          <div>
            <span
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color: "#0F0F0F",
              }}>
              Backend — Verify the Token
            </span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["Node.js", "Python", "PHP"].map((l) => (
              <LangPill
                key={l}
                label={l}
                active={serverLang === l}
                onClick={() => setServerLang(l)}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            padding: "10px 14px",
            background: "#FFFBEB",
            borderRadius: 8,
            marginBottom: 10,
            border: "1px solid #FDE68A",
          }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
          <p
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 12,
              color: "#92400E",
              margin: 0,
              lineHeight: 1.5,
            }}>
            Always verify the token on your server — never trust client-side
            only. Use{" "}
            <code
              style={{
                background: "#FEF3C7",
                padding: "1px 4px",
                borderRadius: 3,
                fontSize: 11,
              }}>
              HUMORA_SITE_KEY
            </code>{" "}
            from your environment variables, not the frontend sitekey.
          </p>
        </div>

        <CodeBlock code={serverCode} lang={serverLang} />
      </div>

      {/* ── Footer ── */}
      <div style={{ marginTop: 16, textAlign: "right" }}>
        <a
          href="/docs"
          style={{
            fontFamily: "Archivo, sans-serif",
            fontSize: 12,
            color: "#4F46E5",
            fontWeight: 600,
            textDecoration: "none",
          }}>
          Full API reference & integration guide →
        </a>
      </div>
    </div>
  );
}

const GC_FRAMEWORKS = [
  {
    id: "HTML",
    label: "HTML",
    color: "#F97316",
    install: null,
    frontLang: "html",
    backLang: "javascript",
  },
  {
    id: "React",
    label: "React",
    color: "#0EA5E9",
    install: "npm install @humora-io/widget",
    frontLang: "jsx",
    backLang: "javascript",
  },
  {
    id: "Next.js",
    label: "Next.js",
    color: "#0F0F0F",
    install: "npm install @humora-io/widget",
    frontLang: "tsx",
    backLang: "javascript",
  },
  {
    id: "PHP",
    label: "PHP",
    color: "#8B5CF6",
    install: null,
    frontLang: "php",
    backLang: "php",
  },
  {
    id: "Python",
    label: "Python",
    color: "#3B82F6",
    install: null,
    frontLang: "html",
    backLang: "python",
  },
];

function GCCopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      style={{
        background: copied ? "rgba(16,185,129,.15)" : "rgba(255,255,255,.07)",
        border: `1px solid ${copied ? "#10B981" : "rgba(255,255,255,.12)"}`,
        borderRadius: 6,
        padding: "3px 10px",
        fontFamily: "Archivo, sans-serif",
        fontSize: 11,
        fontWeight: 500,
        color: copied ? "#10B981" : "#9CA3AF",
        cursor: "pointer",
        transition: "all 150ms",
        display: "flex",
        alignItems: "center",
        gap: 5,
        flexShrink: 0,
      }}>
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function GCCodeBlock({ code, lang, label }) {
  const langColors = {
    html: "#F97316",
    javascript: "#EAB308",
    jsx: "#61DAFB",
    tsx: "#61DAFB",
    python: "#3B82F6",
    php: "#8B5CF6",
  };
  return (
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #2d2d4e",
      }}>
      <div
        style={{
          background: "#13132a",
          borderBottom: "1px solid #2d2d4e",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
          minHeight: 40,
        }}>
        <span
          style={{
            fontFamily: "Archivo,sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: langColors[lang] || "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}>
          {label || lang}
        </span>
        <GCCopyButton text={code} />
      </div>
      <div
        style={{
          background: "#0d0d1a",
          padding: "16px 18px",
          overflowX: "auto",
        }}>
        <pre
          style={{
            fontFamily: "'Fira Code','Cascadia Code','Courier New',monospace",
            fontSize: 12,
            lineHeight: 1.7,
            color: "#e2e8f0",
            margin: 0,
            whiteSpace: "pre",
          }}>
          {code}
        </pre>
      </div>
    </div>
  );
}

function GetCodePanelInner({ site, onClose }) {
  const [fw, setFw] = useState("HTML");
  const [tab, setTab] = useState("frontend"); // "frontend" | "backend"

  const framework = GC_FRAMEWORKS.find((f) => f.id === fw);
  const snippets = POPUP_HTML(site.sitekey);
  const reactSnip = POPUP_REACT(site.sitekey);
  const serverSnip = SERVER_SNIPPETS["Node.js"];

  const frontendCode =
    fw === "HTML"
      ? POPUP_HTML(site.sitekey)
      : fw === "React" || fw === "Next.js"
      ? POPUP_REACT(site.sitekey)
      : fw === "PHP"
      ? `<?php\n// See backend tab — PHP handles both frontend and server-side in one file`
      : `{# Django template — add the script tag to your <head> #}\n<script src="https://widget.humora.io/humora.min.js" async defer></script>\n<div id="humora-widget"></div>\n<script>\n  humora.ready(function() {\n    humora.render('humora-widget', {\n      sitekey: '${site.sitekey}',\n      callback: function(t) { document.getElementById('h-token').value = t; },\n    });\n  });\n</script>`;

  const backendCode =
    fw === "PHP"
      ? SERVER_SNIPPETS["PHP"]
      : fw === "Python"
      ? SERVER_SNIPPETS["Python"]
      : SERVER_SNIPPETS["Node.js"];

  const backLang =
    fw === "PHP" ? "php" : fw === "Python" ? "python" : "javascript";

  return (
    <>
      <motion.div
        key="gc-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 200,
        }}
      />
      <motion.div
        key="gc-panel"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 520,
          backgroundColor: "#fff",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.14)",
          zIndex: 201,
          display: "flex",
          flexDirection: "column",
        }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid #E5E7EB",
            flexShrink: 0,
          }}>
          <div>
            <h2
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 800,
                fontSize: 18,
                color: "#0F0F0F",
                margin: 0,
              }}>
              Integration Code
            </h2>
            <p
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 13,
                color: "#6B7280",
                margin: "3px 0 0",
              }}>
              {site.domain} · Your sitekey is pre-filled
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              color: "#6B7280",
              borderRadius: 8,
              transition: "background 150ms",
              display: "flex",
              alignItems: "center",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#F3F4F6")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Framework selector */}
        <div style={{ padding: "16px 24px 0", flexShrink: 0 }}>
          <p
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 10,
            }}>
            Framework
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {GC_FRAMEWORKS.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setFw(f.id);
                  setTab("frontend");
                }}
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontSize: 12,
                  fontWeight: fw === f.id ? 700 : 500,
                  color: fw === f.id ? f.color : "#6B7280",
                  background: fw === f.id ? f.color + "18" : "transparent",
                  border: `1.5px solid ${
                    fw === f.id ? f.color + "55" : "#E5E7EB"
                  }`,
                  borderRadius: 8,
                  padding: "6px 14px",
                  cursor: "pointer",
                  transition: "all 120ms",
                }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Install command */}
          {framework.install && (
            <div
              style={{
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#0d0d1a",
                border: "1px solid #2d2d4e",
                borderRadius: 9,
                padding: "9px 14px",
                cursor: "pointer",
              }}
              onClick={() => {
                navigator.clipboard.writeText(framework.install);
              }}
              title="Click to copy">
              <code
                style={{
                  fontFamily:
                    "'Fira Code','Cascadia Code','Courier New',monospace",
                  fontSize: 12,
                  color: "#e2e8f0",
                  flex: 1,
                }}>
                {framework.install}
              </code>
              <span
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontSize: 11,
                  color: "#9CA3AF",
                  flexShrink: 0,
                }}>
                Copy
              </span>
            </div>
          )}

          {/* Frontend / Backend tab toggle */}
          <div
            style={{
              display: "flex",
              gap: 4,
              marginTop: 16,
              marginBottom: 0,
              borderBottom: "1px solid #E5E7EB",
            }}>
            {["frontend", "backend"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontSize: 13,
                  fontWeight: tab === t ? 700 : 500,
                  color: tab === t ? "#4F46E5" : "#6B7280",
                  background: "none",
                  border: "none",
                  borderBottom: `2px solid ${
                    tab === t ? "#4F46E5" : "transparent"
                  }`,
                  padding: "8px 14px 10px",
                  cursor: "pointer",
                  transition: "all 150ms",
                  textTransform: "capitalize",
                }}>
                {t === "backend" ? "Server (required)" : "Frontend"}
              </button>
            ))}
          </div>
        </div>

        {/* Code area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 24px" }}>
          {tab === "frontend" ? (
            <GCCodeBlock
              code={frontendCode}
              lang={framework.frontLang}
              label={
                fw === "HTML"
                  ? "HTML + JS"
                  : fw === "React"
                  ? "JSX"
                  : fw === "Next.js"
                  ? "TSX"
                  : fw
              }
            />
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  padding: "10px 14px",
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 10,
                  marginBottom: 12,
                }}>
                <span style={{ fontSize: 13, flexShrink: 0 }}>🚨</span>
                <p
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontSize: 12,
                    color: "#991B1B",
                    margin: 0,
                    lineHeight: 1.5,
                  }}>
                  <strong>Mandatory.</strong> Without server-side verification,
                  bots can bypass the widget.
                </p>
              </div>
              <GCCodeBlock
                code={backendCode}
                lang={backLang}
                label={
                  fw === "Python" ? "Python" : fw === "PHP" ? "PHP" : "Node.js"
                }
              />
            </>
          )}

          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}>
            <a
              href="/quickstart"
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: "#4F46E5",
                textDecoration: "none",
              }}>
              Quick Start guide →
            </a>
            <span style={{ color: "#E5E7EB" }}>·</span>
            <a
              href="/docs"
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 12,
                fontWeight: 500,
                color: "#6B7280",
                textDecoration: "none",
              }}>
              Full docs
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function GetCodePanel({ site, onClose }) {
  return (
    <AnimatePresence>
      {site && (
        <GetCodePanelInner key={site.sitekey} site={site} onClose={onClose} />
      )}
    </AnimatePresence>
  );
}

export default function MySitesPage() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingKey, setDeletingKey] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [codesite, setCodeSite] = useState(null);
  const [error, setError] = useState(null);

  const loadSites = useCallback(() => {
    setLoading(true);
    api.dashboard
      .sites()
      .then((res) => {
        const list = res.sites ?? [];
        setSites(list);
        if (!selectedSite && list.length > 0) setSelectedSite(list[0]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedSite]);

  useEffect(() => {
    loadSites();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddSite = (newSite) => {
    setSites((prev) => [...prev, newSite]);
    setSelectedSite(newSite);
  };

  const handleDeleteSite = async (site) => {
    if (
      !confirm(
        `Are you sure you want to delete ${site.domain}? This action cannot be undone.`
      )
    )
      return;
    setDeletingKey(site.sitekey);
    try {
      await api.dashboard.deleteSite(site.sitekey);
      setSites((prev) => prev.filter((s) => s.sitekey !== site.sitekey));
      if (selectedSite?.sitekey === site.sitekey) {
        const remaining = sites.filter((s) => s.sitekey !== site.sitekey);
        setSelectedSite(remaining[0] ?? null);
      }
    } catch (e) {
      setError(e.message || "Failed to delete site");
    } finally {
      setDeletingKey(null);
    }
  };

  const handleViewAnalytics = (site) => {
    setSelectedSite(site);
    window.location.href = `/dashboard/analytics`;
  };

  return (
    <div>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 24,
        }}>
        <div>
          <h1
            style={{
              fontFamily: "Archivo, sans-serif",
              fontWeight: 800,
              fontSize: 26,
              color: "#0F0F0F",
              margin: "0 0 6px",
            }}>
            My Sites
          </h1>
          <p
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 15,
              color: "#6B7280",
              margin: 0,
            }}>
            Manage your domains and sitekeys
          </p>
        </div>
        <button
          onClick={() => setPanelOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "Archivo, sans-serif",
            fontWeight: 600,
            fontSize: 14,
            color: "#fff",
            backgroundColor: "#4F46E5",
            border: "none",
            borderRadius: 10,
            padding: "10px 16px",
            cursor: "pointer",
            transition: "all 200ms",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#4338CA";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(79,70,229,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#4F46E5";
            e.currentTarget.style.boxShadow = "none";
          }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Site
        </button>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 16,
            fontFamily: "Archivo, sans-serif",
            fontSize: 13,
            color: "#991B1B",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#991B1B",
              fontSize: 16,
            }}>
            ×
          </button>
        </div>
      )}

      {/* Sites grid */}
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            marginBottom: 20,
          }}>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#fff",
                borderRadius: 20,
                padding: 24,
                border: "1px solid #E5E7EB",
                height: 200,
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      ) : sites.length === 0 ? (
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: "48px 24px",
            border: "1px dashed #E5E7EB",
            textAlign: "center",
            marginBottom: 20,
          }}>
          <div
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 15,
              fontWeight: 500,
              color: "#374151",
              marginBottom: 8,
            }}>
            No sites yet
          </div>
          <div
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 13,
              color: "#9CA3AF",
              marginBottom: 20,
            }}>
            Add your first site to get a sitekey and start protecting your
            forms.
          </div>
          <button
            onClick={() => setPanelOpen(true)}
            style={{
              fontFamily: "Archivo, sans-serif",
              fontWeight: 600,
              fontSize: 14,
              color: "#fff",
              backgroundColor: "#4F46E5",
              border: "none",
              borderRadius: 10,
              padding: "10px 20px",
              cursor: "pointer",
            }}>
            Add Your First Site
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            marginBottom: 20,
          }}>
          {sites.map((site) => (
            <SiteCard
              key={site.sitekey}
              site={site}
              onViewAnalytics={handleViewAnalytics}
              onGetCode={(s) => setCodeSite(s)}
              onDelete={handleDeleteSite}
              deleting={deletingKey === site.sitekey}
            />
          ))}
        </div>
      )}

      {/* Integration snippet (legacy inline panel — still shown for selected site) */}
      {selectedSite && <IntegrationSnippet site={selectedSite} />}

      {/* Add Site Panel */}
      <AddSitePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onAdd={handleAddSite}
      />

      {/* Get Code slide-over */}
      <GetCodePanel site={codesite} onClose={() => setCodeSite(null)} />
    </div>
  );
}
