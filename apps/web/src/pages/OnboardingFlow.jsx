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
  codeBorder: "#2d2d4e",
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
const FRAMEWORK_OPTIONS = [
  { id: "HTML",    label: "HTML",    color: "#F97316", install: null },
  { id: "React",   label: "React",   color: "#0EA5E9", install: "npm install @humora-io/widget" },
  { id: "Next.js", label: "Next.js", color: "#0F0F0F", install: "npm install @humora-io/widget" },
  { id: "Vue",     label: "Vue",     color: "#42B883", install: "npm install @humora-io/widget" },
  { id: "PHP",     label: "PHP",     color: "#8B5CF6", install: null },
  { id: "Django",  label: "Django",  color: "#3B82F6", install: null },
];

function getSnippets(sitekey) {
  return {
    HTML: {
      frontend: `<!-- 1. Add to your <head> -->
<script src="https://widget.humora.io/humora.min.js" async defer></script>

<!-- 2. Popup overlay — add anywhere in your body -->
<div id="humora-backdrop" style="display:none;position:fixed;inset:0;
  background:rgba(0,0,0,0.55);z-index:9999;align-items:center;
  justify-content:center;">
  <div style="background:#fff;border-radius:20px;max-width:400px;
    width:100%;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,.2);">
    <div style="padding:14px 18px;border-bottom:1px solid #F3F4F6;
      display:flex;justify-content:space-between;align-items:center;
      font-size:13px;font-weight:600;">
      Human Verification
      <button onclick="closeHumora()"
        style="background:none;border:none;font-size:22px;
        cursor:pointer;color:#9CA3AF;">×</button>
    </div>
    <div id="humora-widget"></div>
  </div>
</div>

<!-- 3. Intercept form submit, verify, then submit for real -->
<script>
  var _token = null;

  document.getElementById('my-form').addEventListener('submit', function(e) {
    e.preventDefault();
    _token ? submitForm() : document.getElementById('humora-backdrop').style.display = 'flex';
  });

  function closeHumora() {
    document.getElementById('humora-backdrop').style.display = 'none';
  }

  function submitForm() {
    fetch('/api/signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ humora_token: _token,
        email:    document.getElementById('email').value,
        password: document.getElementById('password').value }),
    }).then(r => r.json()).then(d => { if (d.success) location.href = '/dashboard'; });
  }

  humora.ready(function() {
    humora.render('humora-widget', {
      sitekey: '${sitekey}',
      callback:        function(token) { _token = token; closeHumora(); submitForm(); },
      expiredCallback: function()      { _token = null; },
    });
  });
</script>`,
      backend: `// Node.js / Express
app.post('/api/signup', async (req, res) => {
  const { email, password, humora_token } = req.body

  const check = await fetch('https://api.humora.io/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token:   humora_token,
      sitekey: process.env.HUMORA_SITE_KEY,   // never expose this client-side
    }),
  }).then(r => r.json())

  if (!check.success) {
    return res.status(400).json({ error: 'Human verification required' })
  }

  await createUser(email, password)
  res.json({ success: true })
})`,
    },
    React: {
      frontend: `// components/HumoraPopup.jsx
import { useRef, useEffect } from 'react'

export function HumoraPopup({ isOpen, onVerified, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!isOpen || !window.humora || !ref.current) return
    window.humora.render(ref.current, {
      sitekey: '${sitekey}',
      callback:        (token) => onVerified(token),
      expiredCallback: () => {},
    })
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div onClick={onClose} style={{
      position:'fixed',inset:0,zIndex:9999,
      background:'rgba(0,0,0,0.55)',backdropFilter:'blur(3px)',
      display:'flex',alignItems:'center',justifyContent:'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:'#fff',borderRadius:20,width:'100%',
        maxWidth:400,overflow:'hidden',boxShadow:'0 24px 80px rgba(0,0,0,0.2)',
      }}>
        <div style={{display:'flex',justifyContent:'space-between',
          alignItems:'center',padding:'14px 18px',
          borderBottom:'1px solid #F3F4F6',fontSize:13,fontWeight:600}}>
          Human Verification
          <button onClick={onClose} style={{background:'none',border:'none',
            fontSize:22,cursor:'pointer',color:'#9CA3AF'}}>×</button>
        </div>
        <div ref={ref} />
      </div>
    </div>
  )
}

// In your form component:
import { useState, useCallback } from 'react'
import { HumoraPopup } from './HumoraPopup'

export default function SignupForm() {
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPopup, setShowPopup] = useState(false)

  const handleVerified = useCallback(async (token) => {
    setShowPopup(false)
    const res  = await fetch('/api/signup', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, humora_token: token }),
    })
    const data = await res.json()
    if (data.success) location.href = '/dashboard'
  }, [email, password])

  return (
    <>
      <HumoraPopup isOpen={showPopup} onVerified={handleVerified}
        onClose={() => setShowPopup(false)} />
      <form onSubmit={e => { e.preventDefault(); setShowPopup(true) }}>
        <input value={email}    onChange={e => setEmail(e.target.value)}
          type="email" placeholder="Email" />
        <input value={password} onChange={e => setPassword(e.target.value)}
          type="password" placeholder="Password" />
        <button type="submit">Sign Up</button>
      </form>
    </>
  )
}`,
      backend: `// app/api/signup/route.js  (Next.js App Router)
// or any Node.js / Express route

export async function POST(req) {
  const { email, password, humora_token } = await req.json()

  const check = await fetch('https://api.humora.io/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token:   humora_token,
      sitekey: process.env.HUMORA_SITE_KEY,
    }),
  }).then(r => r.json())

  if (!check.success) {
    return Response.json({ error: 'Human verification required' }, { status: 400 })
  }

  await createUser(email, password)
  return Response.json({ success: true })
}`,
    },
    "Next.js": {
      frontend: `// app/components/HumoraPopup.tsx
'use client'
import { useRef, useEffect } from 'react'
declare const window: any

export function HumoraPopup({
  isOpen, onVerified, onClose,
}: { isOpen: boolean; onVerified: (t: string) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || !window.humora || !ref.current) return
    window.humora.render(ref.current, {
      sitekey: process.env.NEXT_PUBLIC_HUMORA_SITE_KEY,
      callback:        (token: string) => onVerified(token),
      expiredCallback: () => {},
    })
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div onClick={onClose} style={{
      position:'fixed',inset:0,zIndex:9999,
      background:'rgba(0,0,0,0.55)',backdropFilter:'blur(3px)',
      display:'flex',alignItems:'center',justifyContent:'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:'#fff',borderRadius:20,width:'100%',maxWidth:400,
        overflow:'hidden',boxShadow:'0 24px 80px rgba(0,0,0,0.2)',
      }}>
        <div style={{display:'flex',justifyContent:'space-between',
          alignItems:'center',padding:'14px 18px',
          borderBottom:'1px solid #F3F4F6',fontSize:13,fontWeight:600}}>
          Human Verification
          <button onClick={onClose} style={{background:'none',border:'none',
            fontSize:22,cursor:'pointer',color:'#9CA3AF'}}>×</button>
        </div>
        <div ref={ref} />
      </div>
    </div>
  )
}

// Also add to app/layout.tsx <head>:
// import Script from 'next/script'
// <Script src="https://widget.humora.io/humora.min.js" strategy="afterInteractive" />`,
      backend: `// app/api/signup/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, password, humora_token } = await req.json()

  const check = await fetch('https://api.humora.io/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token:   humora_token,
      sitekey: process.env.HUMORA_SITE_KEY,   // server-side env var
    }),
  }).then(r => r.json())

  if (!check.success) {
    return NextResponse.json({ error: 'Human verification required' }, { status: 400 })
  }

  await createUser(email, password)
  return NextResponse.json({ success: true })
}`,
    },
    Vue: {
      frontend: `<!-- components/HumoraPopup.vue -->
<template>
  <Teleport to="body">
    <div v-if="isOpen" @click="$emit('close')" :style="{
      position:'fixed',inset:0,zIndex:9999,
      background:'rgba(0,0,0,0.55)',backdropFilter:'blur(3px)',
      display:'flex',alignItems:'center',justifyContent:'center',
    }">
      <div @click.stop :style="{
        background:'#fff',borderRadius:'20px',width:'100%',
        maxWidth:'400px',overflow:'hidden',
        boxShadow:'0 24px 80px rgba(0,0,0,0.2)',
      }">
        <div :style="{display:'flex',justifyContent:'space-between',
          alignItems:'center',padding:'14px 18px',
          borderBottom:'1px solid #F3F4F6',fontSize:'13px',fontWeight:600}">
          Human Verification
          <button @click="$emit('close')"
            style="background:none;border:none;font-size:22px;cursor:pointer;">×</button>
        </div>
        <div ref="container" />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
const props   = defineProps(['isOpen'])
const emits   = defineEmits(['close', 'verified'])
const container = ref(null)

watch(() => props.isOpen, open => {
  if (!open || !window.humora || !container.value) return
  window.humora.render(container.value, {
    sitekey: import.meta.env.VITE_HUMORA_SITE_KEY,
    callback:        token => emits('verified', token),
    expiredCallback: () => {},
  })
})
</script>`,
      backend: `// server.js (Express / Nitro / any Node backend)
app.post('/api/signup', async (req, res) => {
  const { email, password, humora_token } = req.body

  const check = await fetch('https://api.humora.io/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token:   humora_token,
      sitekey: process.env.HUMORA_SITE_KEY,
    }),
  }).then(r => r.json())

  if (!check.success) return res.status(400).json({ error: 'Verification required' })
  await createUser(email, password)
  res.json({ success: true })
})`,
    },
    PHP: {
      frontend: `<!-- 1. In your <head> -->
<script src="https://widget.humora.io/humora.min.js" async defer></script>

<!-- 2. In your form -->
<form method="POST" action="/signup.php">
  <input type="email"    name="email"    placeholder="Email" />
  <input type="password" name="password" placeholder="Password" />
  <input type="hidden"   name="humora_token" id="humora-token" />

  <div id="humora-widget"></div>

  <button type="submit" id="submit-btn" disabled>Sign Up</button>
</form>

<script>
  humora.ready(function() {
    humora.render('humora-widget', {
      sitekey: '${sitekey}',
      callback: function(token) {
        document.getElementById('humora-token').value = token;
        document.getElementById('submit-btn').disabled = false;
      },
      expiredCallback: function() {
        document.getElementById('submit-btn').disabled = true;
      },
    });
  });
</script>`,
      backend: `<?php
// signup.php — verify before processing
$token = $_POST['humora_token'] ?? '';

$response = file_get_contents(
  'https://api.humora.io/api/verify', false,
  stream_context_create(['http' => [
    'method'  => 'POST',
    'header'  => 'Content-Type: application/json',
    'content' => json_encode([
      'token'   => $token,
      'sitekey' => getenv('HUMORA_SITE_KEY'),
    ]),
  ]])
);

$result = json_decode($response, true);

if (!$result['success']) {
  http_response_code(400);
  echo 'Human verification required';
  exit;
}

// ✅ Verified — create the user
createUser($_POST['email'], $_POST['password']);
header('Location: /dashboard');`,
    },
    Django: {
      frontend: `{# In your template — add script to <head> #}
<script src="https://widget.humora.io/humora.min.js" async defer></script>

{# In your form #}
<form method="POST" action="/signup/">
  {% csrf_token %}
  <input type="email"    name="email"    placeholder="Email" />
  <input type="password" name="password" placeholder="Password" />
  <input type="hidden"   name="humora_token" id="humora-token" />

  <div id="humora-widget"></div>

  <button type="submit" id="submit-btn" disabled>Sign Up</button>
</form>

<script>
  humora.ready(function() {
    humora.render('humora-widget', {
      sitekey: '${sitekey}',
      callback: function(token) {
        document.getElementById('humora-token').value = token;
        document.getElementById('submit-btn').disabled = false;
      },
      expiredCallback: function() {
        document.getElementById('submit-btn').disabled = true;
      },
    });
  });
</script>`,
      backend: `# views.py
import os, json, requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def signup(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    data  = json.loads(request.body)
    token = data.get('humora_token', '')

    check = requests.post(
        'https://api.humora.io/api/verify',
        json={ 'token': token, 'sitekey': os.environ['HUMORA_SITE_KEY'] },
        timeout=10,
    ).json()

    if not check.get('success'):
        return JsonResponse({'error': 'Human verification required'}, status=400)

    create_user(data['email'], data['password'])
    return JsonResponse({'success': True})`,
    },
  };
}

function InstallBadge({ cmd }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      onClick={copy}
      title="Click to copy"
      style={{
        display: "inline-flex", alignItems: "center", gap: 12,
        background: C.codeBg, border: "1px solid #2d2d4e",
        borderRadius: 10, padding: "10px 16px", cursor: "pointer",
        marginBottom: 16, transition: "border-color 150ms", maxWidth: "100%",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "#4F46E5")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "#2d2d4e")}
    >
      <code style={{
        fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
        fontSize: 13, color: "#e2e8f0", flex: 1,
      }}>
        {cmd}
      </code>
      <span style={{
        fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 500,
        color: copied ? "#10B981" : C.muted, flexShrink: 0, transition: "color 150ms",
      }}>
        {copied ? "Copied!" : "Copy"}
      </span>
    </div>
  );
}

function Step3({ site, onNext }) {
  const [fw, setFw] = useState("HTML");
  const [showBackend, setShowBackend] = useState(false);
  const snippets = getSnippets(site.sitekey);
  const framework = FRAMEWORK_OPTIONS.find(f => f.id === fw);
  const { frontend, backend } = snippets[fw];
  const frontLang = fw === "HTML" ? "html" : fw === "PHP" ? "php" : fw === "Django" ? "html" : "jsx";
  const backLang  = fw === "PHP" ? "php" : fw === "Django" ? "python" : "javascript";

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 26, color: C.black, margin: "0 0 6px" }}>
          Add Humora to your site
        </h2>
        <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 14, color: C.mid }}>
          Pick your stack — your sitekey is already filled in.
        </p>
      </div>

      {/* Test sitekey tip */}
      <div style={{
        display: "flex", gap: 10, alignItems: "flex-start",
        backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0",
        borderRadius: 10, padding: "11px 14px", marginBottom: 20,
      }}>
        <span style={{ fontSize: 14, flexShrink: 0 }}>✅</span>
        <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#065F46", margin: 0, lineHeight: 1.5 }}>
          <strong>Testing locally?</strong> Use{" "}
          <code style={{ fontFamily: "monospace", background: "#D1FAE5", padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>
            sk_test_humora_dev
          </code>{" "}
          as your sitekey — no signup needed. Swap for your real key before deploying.
        </p>
      </div>

      {/* Framework picker */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {FRAMEWORK_OPTIONS.map(f => (
          <button
            key={f.id}
            onClick={() => { setFw(f.id); setShowBackend(false); }}
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 12,
              fontWeight: fw === f.id ? 700 : 500,
              color: fw === f.id ? f.color : C.mid,
              backgroundColor: fw === f.id ? f.color + "18" : "transparent",
              border: `1.5px solid ${fw === f.id ? f.color + "66" : C.border}`,
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              transition: "all 120ms",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Install command */}
      {framework.install && (
        <div>
          <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
            Install
          </p>
          <InstallBadge cmd={framework.install} />
        </div>
      )}

      {/* Frontend code */}
      <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
        Frontend
      </p>
      <CodeSnippet code={frontend} lang={frontLang} />

      {/* Backend section toggle */}
      <button
        onClick={() => setShowBackend(v => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: showBackend ? C.indigoL : "#F9FAFB",
          border: `1px solid ${showBackend ? "#C7D2FE" : C.border}`,
          borderRadius: 10, padding: "11px 16px", cursor: "pointer",
          marginBottom: showBackend ? 12 : 20, transition: "all 150ms",
        }}
      >
        <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, fontWeight: 700, color: showBackend ? C.indigo : C.dark, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Server Verification (required)
        </span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke={showBackend ? C.indigo : C.mid} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: showBackend ? "rotate(180deg)" : "none", transition: "transform 200ms", flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {showBackend && (
        <div style={{ marginBottom: 20 }}>
          <div style={{
            display: "flex", gap: 8, alignItems: "flex-start",
            background: "#FEF2F2", border: "1px solid #FECACA",
            borderRadius: 10, padding: "10px 14px", marginBottom: 10,
          }}>
            <span style={{ fontSize: 13, flexShrink: 0 }}>🚨</span>
            <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#991B1B", margin: 0, lineHeight: 1.5 }}>
              <strong>Mandatory.</strong> Without this step, bots can bypass the widget entirely. Always verify on your server.
            </p>
          </div>
          <CodeSnippet code={backend} lang={backLang} />
        </div>
      )}

      <button
        onClick={onNext}
        style={{
          width: "100%", height: 52, backgroundColor: C.indigo, color: "#fff",
          border: "none", borderRadius: 14, fontFamily: "Archivo, sans-serif",
          fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "all 200ms",
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
          { icon: "⚡", title: "Quick Start", desc: "5-min integration guide", href: "/quickstart" },
          { icon: "📊", title: "View Analytics", desc: "Real-time verification data", href: "/dashboard/analytics" },
          { icon: "📖", title: "Full Docs", desc: "Complete API reference", href: "/docs" },
          { icon: "🌐", title: "My Sites", desc: "Manage domains & sitekeys", href: "/dashboard/sites" },
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
