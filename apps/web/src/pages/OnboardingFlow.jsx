import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@context/AuthContext";
import { api } from "@utils/api";

const C = {
  indigo: "#4F46E5",
  indigoD: "#4338CA",
  indigoL: "#EEF2FF",
  black: "#0F0F0F",
  dark: "#374151",
  mid: "#6B7280",
  muted: "#9CA3AF",
  border: "#E5E7EB",
  success: "#10B981",
  successBg: "#ECFDF5",
  codeBg: "#1a1a2e",
};

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Archivo', sans-serif; background: #F5F5F7; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function FingerprintIcon({ size = 24, color = C.indigo }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.5 2 5.5 3.5 3.5 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 12c0-1.5.3-3 .8-4.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 22c3.5 0 6.5-1.5 8.5-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M22 12c0 1.5-.3 3-.8 4.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 6c-3.3 0-6 2.7-6 6 0 2 .5 3.8 1.4 5.4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 12c0-3.3-2.7-6-6-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 10c-1.1 0-2 .9-2 2 0 2.5.8 4.8 2.1 6.8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 12c0-1.1-.9-2-2-2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function StepDot({ n, active, done }) {
  return (
    <div style={{
      width: 32,
      height: 32,
      borderRadius: "50%",
      backgroundColor: done ? C.success : active ? C.indigo : C.border,
      color: done || active ? "#fff" : C.muted,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Archivo, sans-serif",
      fontWeight: 700,
      fontSize: 13,
      flexShrink: 0,
      transition: "all 300ms",
    }}>
      {done ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : n}
    </div>
  );
}

function StepTrack({ step }) {
  const steps = ["Add your site", "Get your sitekey", "Integrate", "You're live!"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 48 }}>
      {steps.map((label, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <StepDot n={i + 1} active={step === i} done={step > i} />
            <span style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 11,
              fontWeight: step === i ? 600 : 400,
              color: step === i ? C.indigo : step > i ? C.success : C.muted,
              whiteSpace: "nowrap",
            }}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              flex: 1,
              height: 2,
              backgroundColor: step > i ? C.success : C.border,
              margin: "-18px 8px 0",
              transition: "background 300ms",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      style={{
        background: copied ? "#10B98120" : "rgba(255,255,255,0.06)",
        border: `1px solid ${copied ? C.success : "rgba(255,255,255,0.1)"}`,
        borderRadius: 6,
        padding: "4px 12px",
        fontFamily: "Archivo, sans-serif",
        fontSize: 11,
        fontWeight: 500,
        color: copied ? C.success : C.muted,
        cursor: "pointer",
        transition: "all 150ms",
        display: "flex",
        alignItems: "center",
        gap: 5,
        flexShrink: 0,
      }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function CodeSnippet({ code, lang = "html" }) {
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #2d2d4e", marginBottom: 16 }}>
      <div style={{ background: "#13132a", borderBottom: "1px solid #2d2d4e", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", minHeight: 40 }}>
        <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600, color: lang === "html" ? "#F97316" : lang === "jsx" ? "#61DAFB" : "#EAB308", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {lang}
        </span>
        <CopyButton text={code} />
      </div>
      <div style={{ background: C.codeBg, padding: "16px 20px", overflowX: "auto" }}>
        <pre style={{ fontFamily: "Courier New, Courier, monospace", fontSize: 12, lineHeight: 1.7, color: "#e2e8f0", margin: 0, whiteSpace: "pre" }}>
          {code}
        </pre>
      </div>
    </div>
  );
}

// Step 1: Add domain
function Step1({ onNext }) {
  const [domain, setDomain] = useState("");
  const [environment, setEnvironment] = useState("production");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    const cleaned = domain.trim().replace(/^https?:\/\/(www\.)?/, "");
    if (!cleaned) { setError("Please enter your domain"); return; }
    if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(cleaned)) {
      setError("Enter a valid domain (e.g. yoursite.com)"); return;
    }
    setError("");
    setLoading(true);
    try {
      const site = await api.dashboard.addSite({ domain: cleaned, environment });
      onNext(site);
    } catch (err) {
      setError(err.message || "Failed to create site. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 28, color: C.black, margin: "0 0 8px" }}>
          Add your first site
        </h2>
        <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 15, color: C.mid, lineHeight: 1.6 }}>
          Tell us where you'll be using Humora. We'll generate a unique sitekey for that domain.
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13, color: C.black, marginBottom: 8 }}>
          Domain
        </label>
        <input
          type="text"
          value={domain}
          onChange={e => { setDomain(e.target.value); setError(""); }}
          placeholder="yoursite.com"
          onKeyDown={e => e.key === "Enter" && handleNext()}
          style={{
            width: "100%",
            fontFamily: "Archivo, sans-serif",
            fontSize: 15,
            color: C.black,
            border: `1.5px solid ${error ? "#EF4444" : C.border}`,
            borderRadius: 12,
            padding: "13px 16px",
            outline: "none",
            transition: "border-color 150ms",
          }}
          onFocus={e => (e.target.style.borderColor = C.indigo)}
          onBlur={e => (e.target.style.borderColor = error ? "#EF4444" : C.border)}
        />
        {error && (
          <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#EF4444", marginTop: 6 }}>{error}</p>
        )}
        <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: C.muted, marginTop: 6 }}>
          Don't include https:// or www
        </p>
      </div>

      <div style={{ marginBottom: 32 }}>
        <label style={{ display: "block", fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13, color: C.black, marginBottom: 8 }}>
          Environment
        </label>
        <div style={{ display: "flex", gap: 10 }}>
          {["production", "testing"].map(env => (
            <button
              key={env}
              onClick={() => setEnvironment(env)}
              style={{
                flex: 1,
                fontFamily: "Archivo, sans-serif",
                fontWeight: environment === env ? 600 : 400,
                fontSize: 14,
                color: environment === env ? C.indigo : C.mid,
                backgroundColor: environment === env ? C.indigoL : "#F9FAFB",
                border: `1.5px solid ${environment === env ? "#C7D2FE" : C.border}`,
                borderRadius: 10,
                padding: "12px 16px",
                cursor: "pointer",
                transition: "all 150ms",
                textTransform: "capitalize",
              }}
            >
              {env === "production" ? "🚀 Production" : "🧪 Testing"}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={loading}
        style={{
          width: "100%",
          height: 52,
          backgroundColor: loading ? "#6366F1" : C.indigo,
          color: "#fff",
          border: "none",
          borderRadius: 14,
          fontFamily: "Archivo, sans-serif",
          fontWeight: 600,
          fontSize: 15,
          cursor: loading ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          transition: "all 200ms",
        }}
        onMouseEnter={e => { if (!loading) { e.currentTarget.style.backgroundColor = C.indigoD; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(79,70,229,0.3)"; }}}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = loading ? "#6366F1" : C.indigo; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
      >
        {loading ? (
          <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        ) : "Generate Sitekey →"}
      </button>
    </div>
  );
}

// Step 2: Show sitekey
function Step2({ site, onNext }) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: C.successBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 28, color: C.black, margin: "0 0 8px" }}>
          Your sitekey is ready
        </h2>
        <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 15, color: C.mid }}>
          Save this key securely — it's shown only once.
        </p>
      </div>

      <div style={{ backgroundColor: "#F9FAFB", border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <code style={{ fontFamily: "'Fira Code', 'Cascadia Code', monospace", fontSize: 13, color: C.black, wordBreak: "break-all" }}>
          {site.sitekey}
        </code>
        <div style={{ flexShrink: 0 }}>
          <CopyButton text={site.sitekey} />
        </div>
      </div>

      <div style={{ backgroundColor: "#FFFBEB", border: "1px solid #FED7AA", borderRadius: 10, padding: "14px 16px", marginBottom: 28, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
        <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#92400E", lineHeight: 1.5 }}>
          <strong>Save this now.</strong> For security, we won't show it again. Store it in your environment variables or a secrets manager.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 24, cursor: "pointer", alignItems: "flex-start" }} onClick={() => setConfirmed(c => !c)}>
        <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${confirmed ? C.indigo : C.border}`, backgroundColor: confirmed ? C.indigo : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, transition: "all 150ms" }}>
          {confirmed && (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 14, color: C.dark, lineHeight: 1.5 }}>
          I've saved my sitekey in a safe place
        </span>
      </div>

      <button
        onClick={onNext}
        disabled={!confirmed}
        style={{
          width: "100%",
          height: 52,
          backgroundColor: confirmed ? C.indigo : "#C7D2FE",
          color: "#fff",
          border: "none",
          borderRadius: 14,
          fontFamily: "Archivo, sans-serif",
          fontWeight: 600,
          fontSize: 15,
          cursor: confirmed ? "pointer" : "not-allowed",
          transition: "all 200ms",
        }}
        onMouseEnter={e => { if (confirmed) { e.currentTarget.style.backgroundColor = C.indigoD; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(79,70,229,0.3)"; }}}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = confirmed ? C.indigo : "#C7D2FE"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
      >
        Continue to Integration →
      </button>
    </div>
  );
}

// Step 3: Integration guide
function Step3({ site, onNext }) {
  const [tab, setTab] = useState("HTML");
  const tabs = ["HTML", "React", "Next.js"];

  const snippets = {
    HTML: `<!-- 1. Add to your <head> -->
<script
  src="https://widget.humora.io/humora.min.js"
  async defer
></script>

<!-- 2. Add to your form -->
<div
  class="humora-widget"
  data-sitekey="${site.sitekey}"
  data-callback="onHumoraPass"
></div>

<!-- 3. Handle the token -->
<script>
function onHumoraPass(token) {
  document.getElementById('humora-token').value = token
}
</script>`,
    React: `// Install: npm install @humora-io/widget

import { HumoraWidget } from '@humora-io/widget'

function MyForm() {
  const [token, setToken] = useState(null)

  return (
    <form onSubmit={handleSubmit}>
      <HumoraWidget
        sitekey="${site.sitekey}"
        onPass={setToken}
      />
      <button disabled={!token}>Submit</button>
    </form>
  )
}`,
    "Next.js": `'use client'

import { HumoraWidget } from '@humora-io/widget'

export default function MyForm() {
  const [token, setToken] = useState(null)

  return (
    <form>
      <HumoraWidget
        sitekey="${site.sitekey}"
        onPass={setToken}
      />
      <button disabled={!token}>Submit</button>
    </form>
  )
}

// Server action / route handler
export async function POST(req) {
  const { token } = await req.json()

  const res = await fetch('https://api.humora.io/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token,
      sitekey: process.env.HUMORA_SITE_KEY,
    }),
  }).then(r => r.json())

  if (!res.success) {
    return Response.json({ error: 'Verification failed' }, { status: 400 })
  }
  // proceed...
}`,
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 28, color: C.black, margin: "0 0 8px" }}>
          Add Humora to your site
        </h2>
        <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 15, color: C.mid }}>
          Copy the snippet for your framework. Full docs at{" "}
          <Link to="/docs" style={{ color: C.indigo, textDecoration: "none", fontWeight: 500 }}>humora.io/docs</Link>
        </p>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 13,
              fontWeight: tab === t ? 600 : 400,
              color: tab === t ? C.indigo : C.mid,
              backgroundColor: tab === t ? C.indigoL : "transparent",
              border: `1px solid ${tab === t ? "#C7D2FE" : "transparent"}`,
              borderRadius: 8,
              padding: "7px 14px",
              cursor: "pointer",
              transition: "all 120ms",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <CodeSnippet code={snippets[tab]} lang={tab === "HTML" ? "html" : "jsx"} />

      <div style={{ backgroundColor: C.indigoL, border: "1px solid #C7D2FE", borderRadius: 10, padding: "12px 16px", marginBottom: 28, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 15, flexShrink: 0 }}>ℹ️</span>
        <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#3730A3", lineHeight: 1.5 }}>
          Always verify the token on your backend — never client-side only. See the{" "}
          <Link to="/docs/verify" style={{ color: "#3730A3", fontWeight: 600 }}>server-side verification guide →</Link>
        </p>
      </div>

      <button
        onClick={onNext}
        style={{
          width: "100%",
          height: 52,
          backgroundColor: C.indigo,
          color: "#fff",
          border: "none",
          borderRadius: 14,
          fontFamily: "Archivo, sans-serif",
          fontWeight: 600,
          fontSize: 15,
          cursor: "pointer",
          transition: "all 200ms",
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.indigoD; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(79,70,229,0.3)"; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.indigo; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
      >
        Done — Go to Dashboard →
      </button>
    </div>
  );
}

// Step 4: Success
function Step4() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={{ textAlign: "center" }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: C.successBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </motion.div>

      <h2 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 900, fontSize: 32, color: C.black, margin: "0 0 12px" }}>
        You're all set, {user?.name?.split(" ")[0] || "there"}!
      </h2>
      <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 16, color: C.mid, marginBottom: 40, lineHeight: 1.6 }}>
        Humora is configured. Head to your dashboard to track<br />verifications in real time.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxWidth: 400, margin: "0 auto 32px" }}>
        {[
          { icon: "📊", title: "View Analytics", desc: "Real-time verification data", href: "/dashboard/analytics" },
          { icon: "📖", title: "Read the Docs", desc: "Full API & integration guide", href: "/docs" },
          { icon: "🌐", title: "My Sites", desc: "Manage domains & sitekeys", href: "/dashboard/sites" },
          { icon: "💳", title: "Billing", desc: "Upgrade your plan", href: "/dashboard/billing" },
        ].map(card => (
          <Link
            key={card.href}
            to={card.href}
            style={{
              display: "block",
              backgroundColor: "white",
              border: `1.5px solid ${C.border}`,
              borderRadius: 12,
              padding: "16px",
              textDecoration: "none",
              textAlign: "left",
              transition: "all 180ms",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(79,70,229,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ fontSize: 20, marginBottom: 6 }}>{card.icon}</div>
            <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13, color: C.black, marginBottom: 2 }}>{card.title}</div>
            <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: C.muted }}>{card.desc}</div>
          </Link>
        ))}
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          width: "100%",
          maxWidth: 400,
          height: 52,
          backgroundColor: C.indigo,
          color: "#fff",
          border: "none",
          borderRadius: 14,
          fontFamily: "Archivo, sans-serif",
          fontWeight: 600,
          fontSize: 15,
          cursor: "pointer",
          transition: "all 200ms",
          margin: "0 auto",
          display: "block",
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.indigoD; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(79,70,229,0.3)"; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.indigo; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
      >
        Go to Dashboard →
      </button>
    </div>
  );
}

const variants = {
  enter: { opacity: 0, x: 32 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -32 },
};

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [site, setSite] = useState(null);

  const handleStep1Done = (newSite) => {
    setSite(newSite);
    setStep(1);
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <div style={{ minHeight: "100vh", backgroundColor: "#F5F5F7", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>

        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 40 }}>
          <FingerprintIcon size={24} />
          <span style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 17, color: C.black }}>Humora</span>
        </Link>

        {/* Step track */}
        <div style={{ width: "100%", maxWidth: 600 }}>
          <StepTrack step={step} />
        </div>

        {/* Card */}
        <div style={{ width: "100%", maxWidth: 520, backgroundColor: "white", borderRadius: 24, padding: 40, boxShadow: "0 8px 40px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {step === 0 && <Step1 onNext={handleStep1Done} />}
              {step === 1 && <Step2 site={site} onNext={() => setStep(2)} />}
              {step === 2 && <Step3 site={site} onNext={() => setStep(3)} />}
              {step === 3 && <Step4 />}
            </motion.div>
          </AnimatePresence>
        </div>

        {step < 3 && (
          <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: C.muted, marginTop: 24 }}>
            Step {step + 1} of 4 ·{" "}
            <Link to="/dashboard" style={{ color: C.mid, textDecoration: "none" }}>Skip for now</Link>
          </p>
        )}
      </div>
    </>
  );
}
