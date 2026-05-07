import { AnimatePresence, motion } from "framer-motion";
import { useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import HumoraVerificationModal from "@components/HumoraVerificationModal";

// ── Fingerprint SVG Icon ─────────────────────────────────────
function FingerprintIcon({ size = 32, color = "#4F46E5" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C8.5 2 5.5 3.5 3.5 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2 12c0-1.5.3-3 .8-4.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 22c3.5 0 6.5-1.5 8.5-4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M22 12c0 1.5-.3 3-.8 4.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 6c-3.3 0-6 2.7-6 6 0 2 .5 3.8 1.4 5.4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M18 12c0-3.3-2.7-6-6-6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 10c-1.1 0-2 .9-2 2 0 2.5.8 4.8 2.1 6.8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 12c0-1.1-.9-2-2-2"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6.5 17.5C5.5 15.8 5 13.9 5 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M19 12c0 4.2-2.1 7.9-5.3 10.1"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── GitHub Icon ───────────────────────────────────────────────
function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

// ── Google Icon ───────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ── Eye Icons ─────────────────────────────────────────────────
function EyeIcon({ open }) {
  return open ? (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2">
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
      strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// ── Spinner ───────────────────────────────────────────────────
function Spinner() {
  return (
    <div
      style={{
        width: 18,
        height: 18,
        border: "2px solid rgba(255,255,255,0.3)",
        borderTop: "2px solid white",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        display: "inline-block",
      }}
    />
  );
}

// ── Left Panel (shared) ───────────────────────────────────────
function AuthLeftPanel() {
  return (
    <div
      style={{
        width: "55%",
        background: "#4F46E5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px",
        position: "relative",
        overflow: "hidden",
      }}
      className="auth-left-panel">
      {/* Decorative fingerprint background */}
      <div
        style={{
          position: "absolute",
          bottom: -40,
          right: -40,
          opacity: 0.05,
          pointerEvents: "none",
        }}>
        <svg width="320" height="320" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C8.5 2 5.5 3.5 3.5 6"
            stroke="white"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <path
            d="M2 12c0-1.5.3-3 .8-4.3"
            stroke="white"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <path
            d="M12 22c3.5 0 6.5-1.5 8.5-4"
            stroke="white"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <path
            d="M22 12c0 1.5-.3 3-.8 4.3"
            stroke="white"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <path
            d="M12 6c-3.3 0-6 2.7-6 6 0 2 .5 3.8 1.4 5.4"
            stroke="white"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <path
            d="M18 12c0-3.3-2.7-6-6-6"
            stroke="white"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <path
            d="M12 10c-1.1 0-2 .9-2 2 0 2.5.8 4.8 2.1 6.8"
            stroke="white"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <path
            d="M14 12c0-1.1-.9-2-2-2"
            stroke="white"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <path
            d="M6.5 17.5C5.5 15.8 5 13.9 5 12"
            stroke="white"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <path
            d="M19 12c0 4.2-2.1 7.9-5.3 10.1"
            stroke="white"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Top — Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <FingerprintIcon size={28} color="white" />
        <span
          style={{
            fontFamily: "Archivo, sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: "white",
          }}>
          Humora
        </span>
      </div>

      {/* Center — Main content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}>
        <h2
          style={{
            fontFamily: "Archivo, sans-serif",
            fontWeight: 900,
            fontSize: 36,
            color: "white",
            lineHeight: 1.2,
            marginBottom: 16,
          }}>
          Verify humanity.
          <br />
          Not patience.
        </h2>
        <p
          style={{
            fontFamily: "Archivo, sans-serif",
            fontWeight: 400,
            fontSize: 16,
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.6,
            marginBottom: 40,
          }}>
          The CAPTCHA replacement developers actually enjoy building with.
        </p>

        {/* Social proof bullets */}
        {[
          "Setup in under 5 minutes",
          "500+ websites trust Humora",
          "2M+ verifications served",
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 14,
            }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 400,
                fontSize: 15,
                color: "white",
              }}>
              {item}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom — Testimonial */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        style={{
          borderTop: "1px solid rgba(255,255,255,0.15)",
          paddingTop: 24,
        }}>
        <p
          style={{
            fontFamily: "Archivo, sans-serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 14,
            color: "rgba(255,255,255,0.8)",
            lineHeight: 1.6,
            marginBottom: 8,
          }}>
          "Finally a CAPTCHA that doesn't make my users feel like suspects."
        </p>
        <span
          style={{
            fontFamily: "Archivo, sans-serif",
            fontWeight: 600,
            fontSize: 13,
            color: "rgba(255,255,255,0.6)",
          }}>
          — Alex M., SaaS Founder
        </span>
      </motion.div>
    </div>
  );
}

// ── Input Field ───────────────────────────────────────────────
function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  rightElement,
  note,
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "block",
          fontFamily: "Archivo, sans-serif",
          fontWeight: 500,
          fontSize: 13,
          color: "#374151",
          marginBottom: 6,
        }}>
        {label}
      </label>

      <div style={{ position: "relative" }}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            width: "100%",
            height: 48,
            border: `1.5px solid ${error ? "#EF4444" : "#E5E7EB"}`,
            borderRadius: 12,
            padding: "0 14px",
            paddingRight: rightElement ? 44 : 14,
            fontFamily: "Archivo, sans-serif",
            fontWeight: 400,
            fontSize: 14,
            color: "#0F0F0F",
            background: "white",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 150ms ease, box-shadow 150ms ease",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#4F46E5";
            e.target.style.boxShadow = "0 0 0 3px #EEF2FF";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? "#EF4444" : "#E5E7EB";
            e.target.style.boxShadow = "none";
          }}
        />
        {rightElement && (
          <div
            style={{
              position: "absolute",
              right: 14,
              top: "50%",
              transform: "translateY(-50%)",
            }}>
            {rightElement}
          </div>
        )}
      </div>

      {note && !error && (
        <p
          style={{
            fontFamily: "Archivo, sans-serif",
            fontSize: 12,
            color: "#9CA3AF",
            marginTop: 4,
          }}>
          {note}
        </p>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: "Archivo, sans-serif",
            fontSize: 12,
            color: "#EF4444",
            marginTop: 4,
          }}>
          {error}
        </motion.p>
      )}
    </div>
  );
}

// ── OAuth Buttons ─────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function OAuthButtons() {
  const btnStyle = {
    width: "100%",
    height: 48,
    border: "1.5px solid #E5E7EB",
    borderRadius: 12,
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    fontFamily: "Archivo, sans-serif",
    fontWeight: 600,
    fontSize: 14,
    color: "#0F0F0F",
    cursor: "pointer",
    transition: "all 150ms ease",
    marginBottom: 12,
  };
  return (
    <>
      <button
        style={btnStyle}
        onClick={() => { window.location.href = `${API_BASE}/api/auth/oauth/github` }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#F9FAFB";
          e.currentTarget.style.borderColor = "#D1D5DB";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "white";
          e.currentTarget.style.borderColor = "#E5E7EB";
        }}>
        <GitHubIcon /> Continue with GitHub
      </button>
      <button
        style={btnStyle}
        onClick={() => { window.location.href = `${API_BASE}/api/auth/oauth/google` }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#F9FAFB";
          e.currentTarget.style.borderColor = "#D1D5DB";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "white";
          e.currentTarget.style.borderColor = "#E5E7EB";
        }}>
        <GoogleIcon /> Continue with Google
      </button>
    </>
  );
}

// ── Divider ───────────────────────────────────────────────────
function Divider({ text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "20px 0",
      }}>
      <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
      <span
        style={{
          fontFamily: "Archivo, sans-serif",
          fontSize: 13,
          color: "#9CA3AF",
          whiteSpace: "nowrap",
        }}>
        {text}
      </span>
      <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
    </div>
  );
}

// ── Primary Button ────────────────────────────────────────────
function PrimaryButton({ children, onClick, loading, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      style={{
        width: "100%",
        height: 52,
        background: loading ? "#6366F1" : "#4F46E5",
        border: "none",
        borderRadius: 14,
        fontFamily: "Archivo, sans-serif",
        fontWeight: 600,
        fontSize: 15,
        color: "white",
        cursor: loading ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "all 200ms ease",
        marginTop: 8,
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.background = "#4338CA";
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(79,70,229,0.3)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = loading ? "#6366F1" : "#4F46E5";
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}>
      {loading ? <Spinner /> : children}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
// LOGIN PAGE
// ══════════════════════════════════════════════════════════════
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showVerification, setShowVerification] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email) errs.email = "Email is required";
    if (!password) errs.password = "Password is required";
    if (email && !/\S+@\S+\.\S+/.test(email))
      errs.email = "Enter a valid email address";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setShowVerification(true);
  };

  const handleVerified = useCallback(async (_token) => {
    setShowVerification(false);
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid email or password. Try again.");
    } finally {
      setLoading(false);
    }
  }, [email, password, login, navigate, from]);

  return (
    <>
      <HumoraVerificationModal
        isOpen={showVerification}
        onVerified={handleVerified}
        onClose={() => setShowVerification(false)}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Archivo', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-4px); }
          80%      { transform: translateX(4px); }
        }
        .auth-left-panel { display: flex !important; }
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
          .auth-right-panel { width: 100% !important; }
        }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh" }}>
        <AuthLeftPanel />

        {/* Right Panel */}
        <div
          className="auth-right-panel"
          style={{
            width: "45%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 24px",
          }}>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: "100%", maxWidth: 400 }}>
            {/* Mobile logo */}
            <div
              style={{
                display: "none",
                alignItems: "center",
                gap: 8,
                marginBottom: 32,
              }}
              className="mobile-logo">
              <FingerprintIcon size={24} />
              <span
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#0F0F0F",
                }}>
                Humora
              </span>
            </div>

            <h2
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 800,
                fontSize: 28,
                color: "#0F0F0F",
                marginBottom: 6,
              }}>
              Welcome back
            </h2>
            <p
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 400,
                fontSize: 14,
                color: "#9CA3AF",
                marginBottom: 28,
              }}>
              Sign in to your Humora dashboard.
            </p>

            <OAuthButtons />
            <Divider text="or sign in with email" />

            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  style={{
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    borderRadius: 12,
                    padding: "12px 16px",
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                  <span
                    style={{
                      fontFamily: "Archivo, sans-serif",
                      fontSize: 13,
                      color: "#991B1B",
                    }}>
                    {error}
                  </span>
                  <button
                    onClick={() => setError("")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#991B1B",
                      fontSize: 16,
                      lineHeight: 1,
                      padding: "0 0 0 8px",
                    }}>
                    ×
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <InputField
                label="Email"
                type="email"
                placeholder="john@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email}
              />

              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}>
                  <label
                    style={{
                      fontFamily: "Archivo, sans-serif",
                      fontWeight: 500,
                      fontSize: 13,
                      color: "#374151",
                    }}>
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    style={{
                      fontFamily: "Archivo, sans-serif",
                      fontSize: 13,
                      color: "#4F46E5",
                      textDecoration: "none",
                    }}>
                    Forgot password?
                  </Link>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      height: 48,
                      border: `1.5px solid ${
                        fieldErrors.password ? "#EF4444" : "#E5E7EB"
                      }`,
                      borderRadius: 12,
                      padding: "0 44px 0 14px",
                      fontFamily: "Archivo, sans-serif",
                      fontSize: 14,
                      color: "#0F0F0F",
                      background: "white",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 150ms, box-shadow 150ms",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#4F46E5";
                      e.target.style.boxShadow = "0 0 0 3px #EEF2FF";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = fieldErrors.password
                        ? "#EF4444"
                        : "#E5E7EB";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#9CA3AF",
                      display: "flex",
                      alignItems: "center",
                      padding: 0,
                    }}>
                    <EyeIcon open={showPass} />
                  </button>
                </div>
                {fieldErrors.password && (
                  <p
                    style={{
                      fontFamily: "Archivo, sans-serif",
                      fontSize: 12,
                      color: "#EF4444",
                      marginTop: 4,
                    }}>
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                  marginBottom: 4,
                }}>
                <div
                  onClick={() => setRemember((r) => !r)}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 5,
                    border: `2px solid ${remember ? "#4F46E5" : "#D1D5DB"}`,
                    background: remember ? "#4F46E5" : "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 150ms",
                    cursor: "pointer",
                  }}>
                  {remember && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5l2.5 2.5 4-4"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontSize: 13,
                    color: "#374151",
                  }}>
                  Keep me signed in for 30 days
                </span>
              </label>

              <PrimaryButton type="submit" loading={loading}>
                Sign In
              </PrimaryButton>
            </form>

            <p
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 14,
                color: "#374151",
                textAlign: "center",
                marginTop: 24,
              }}>
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{
                  color: "#4F46E5",
                  fontWeight: 600,
                  textDecoration: "none",
                }}>
                Start free →
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// SIGNUP PAGE
// ══════════════════════════════════════════════════════════════
function PasswordStrength({ password }) {
  const getStrength = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };
  const strength = getStrength();
  const colors = ["#E5E7EB", "#EF4444", "#F59E0B", "#10B981", "#10B981"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const labelColors = ["", "#EF4444", "#F59E0B", "#10B981", "#10B981"];

  if (!password) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 999,
              background: i <= strength ? colors[strength] : "#E5E7EB",
              transition: "background 200ms",
            }}
          />
        ))}
      </div>
      {strength > 0 && (
        <span
          style={{
            fontFamily: "Archivo, sans-serif",
            fontSize: 11,
            color: labelColors[strength],
            fontWeight: 500,
          }}>
          {labels[strength]}
        </span>
      )}
    </div>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showVerification, setShowVerification] = useState(false);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Full name is required";
    if (!email) errs.email = "Email is required";
    if (!password) errs.password = "Password is required";
    if (email && !/\S+@\S+\.\S+/.test(email))
      errs.email = "Enter a valid email address";
    if (password && password.length < 8)
      errs.password = "Password must be at least 8 characters";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setShowVerification(true);
  };

  const handleVerified = useCallback(async (_token) => {
    setShowVerification(false);
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate("/onboarding");
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("already exists") || msg.includes("email-taken")) {
        setFieldErrors({ email: "An account with this email already exists" });
      } else {
        setFieldErrors({ email: msg || "Signup failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  }, [name, email, password, signup, navigate]);

  return (
    <>
      <HumoraVerificationModal
        isOpen={showVerification}
        onVerified={handleVerified}
        onClose={() => setShowVerification(false)}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-left-panel { display: flex !important; }
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
          .auth-right-panel { width: 100% !important; }
        }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh" }}>
        <AuthLeftPanel />

        <div
          className="auth-right-panel"
          style={{
            width: "45%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 24px",
            overflowY: "auto",
          }}>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: "100%", maxWidth: 400, paddingTop: 24 }}>
            <h2
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 800,
                fontSize: 28,
                color: "#0F0F0F",
                marginBottom: 6,
              }}>
              Create your account
            </h2>
            <p
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 14,
                color: "#9CA3AF",
                marginBottom: 28,
              }}>
              Free forever. No credit card required.
            </p>

            <OAuthButtons />
            <Divider text="or sign up with email" />

            <form onSubmit={handleSubmit}>
              <InputField
                label="Full Name"
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={fieldErrors.name}
              />
              <InputField
                label="Email"
                type="email"
                placeholder="john@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email}
              />

              {/* Password with strength */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontFamily: "Archivo, sans-serif",
                    fontWeight: 500,
                    fontSize: 13,
                    color: "#374151",
                    marginBottom: 6,
                  }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      height: 48,
                      border: `1.5px solid ${
                        fieldErrors.password ? "#EF4444" : "#E5E7EB"
                      }`,
                      borderRadius: 12,
                      padding: "0 44px 0 14px",
                      fontFamily: "Archivo, sans-serif",
                      fontSize: 14,
                      color: "#0F0F0F",
                      background: "white",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 150ms, box-shadow 150ms",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#4F46E5";
                      e.target.style.boxShadow = "0 0 0 3px #EEF2FF";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = fieldErrors.password
                        ? "#EF4444"
                        : "#E5E7EB";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#9CA3AF",
                      display: "flex",
                      alignItems: "center",
                      padding: 0,
                    }}>
                    <EyeIcon open={showPass} />
                  </button>
                </div>
                <PasswordStrength password={password} />
                {fieldErrors.password && (
                  <p
                    style={{
                      fontFamily: "Archivo, sans-serif",
                      fontSize: 12,
                      color: "#EF4444",
                      marginTop: 4,
                    }}>
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <PrimaryButton type="submit" loading={loading}>
                Create Account
              </PrimaryButton>
            </form>

            <p
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 12,
                color: "#9CA3AF",
                textAlign: "center",
                marginTop: 16,
                lineHeight: 1.6,
              }}>
              By creating an account you agree to our{" "}
              <a
                href="/terms"
                style={{ color: "#4F46E5", textDecoration: "none" }}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                style={{ color: "#4F46E5", textDecoration: "none" }}>
                Privacy Policy
              </a>
              .
            </p>

            <p
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 14,
                color: "#374151",
                textAlign: "center",
                marginTop: 16,
              }}>
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#4F46E5",
                  fontWeight: 600,
                  textDecoration: "none",
                }}>
                Sign in →
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// FORGOT PASSWORD PAGE
// ══════════════════════════════════════════════════════════════
export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    setShowVerification(true);
  };

  const handleVerified = useCallback(async () => {
    setShowVerification(false);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  }, []);

  return (
    <>
      <HumoraVerificationModal
        isOpen={showVerification}
        onVerified={handleVerified}
        onClose={() => setShowVerification(false)}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F5F5F7; font-family: 'Archivo', sans-serif; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5F5F7",
          padding: 24,
        }}>
        {/* Back to login */}
        <div style={{ position: "absolute", top: 24, left: 24 }}>
          <Link
            to="/login"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "Archivo, sans-serif",
              fontSize: 13,
              color: "#374151",
              textDecoration: "none",
            }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 12L6 8l4-4"
                stroke="#374151"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to login
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            width: "100%",
            maxWidth: 420,
            background: "white",
            borderRadius: 24,
            boxShadow:
              "0 8px 48px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
            padding: 40,
          }}>
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div
                key="enter-email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}>
                {/* Lock icon */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "#EEF2FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                  }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      stroke="#4F46E5"
                      strokeWidth="2"
                    />
                    <path
                      d="M7 11V7a5 5 0 0110 0v4"
                      stroke="#4F46E5"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h2
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontWeight: 800,
                    fontSize: 26,
                    color: "#0F0F0F",
                    marginBottom: 8,
                  }}>
                  Forgot your password?
                </h2>
                <p
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontSize: 14,
                    color: "#6B7280",
                    lineHeight: 1.6,
                    marginBottom: 28,
                  }}>
                  Enter your email and we'll send you a reset link instantly.
                </p>

                <form onSubmit={handleSubmit}>
                  <InputField
                    label="Email address"
                    type="email"
                    placeholder="john@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={error}
                  />
                  <PrimaryButton type="submit" loading={loading}>
                    Send Reset Link
                  </PrimaryButton>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="email-sent"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ textAlign: "center" }}>
                {/* Success envelope icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "#ECFDF5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                  }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      stroke="#10B981"
                      strokeWidth="2"
                    />
                    <polyline
                      points="22,6 12,13 2,6"
                      stroke="#10B981"
                      strokeWidth="2"
                    />
                  </svg>
                </motion.div>

                <h2
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontWeight: 800,
                    fontSize: 26,
                    color: "#0F0F0F",
                    marginBottom: 8,
                  }}>
                  Check your inbox
                </h2>
                <p
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontSize: 14,
                    color: "#6B7280",
                    lineHeight: 1.6,
                    marginBottom: 8,
                  }}>
                  We sent a reset link to
                </p>
                <p
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#0F0F0F",
                    marginBottom: 28,
                  }}>
                  {email}
                </p>

                <p
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontSize: 13,
                    color: "#9CA3AF",
                    marginBottom: 20,
                  }}>
                  Didn't get it? Check your spam folder or
                </p>

                <button
                  onClick={() => setSent(false)}
                  style={{
                    width: "100%",
                    height: 48,
                    border: "1.5px solid #E5E7EB",
                    borderRadius: 12,
                    background: "white",
                    fontFamily: "Archivo, sans-serif",
                    fontWeight: 500,
                    fontSize: 14,
                    color: "#374151",
                    cursor: "pointer",
                    transition: "all 150ms",
                    marginBottom: 16,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#4F46E5";
                    e.currentTarget.style.color = "#4F46E5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#E5E7EB";
                    e.currentTarget.style.color = "#374151";
                  }}>
                  Resend Email
                </button>

                <Link
                  to="/login"
                  style={{
                    display: "block",
                    textAlign: "center",
                    fontFamily: "Archivo, sans-serif",
                    fontSize: 13,
                    color: "#9CA3AF",
                    textDecoration: "none",
                  }}>
                  ← Back to login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}

// ── Default export (Login) ────────────────────────────────────
export default LoginPage;
