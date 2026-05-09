import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Archivo', sans-serif; background: #fff; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const C = {
  indigo: "#4F46E5",
  indigoD: "#4338CA",
  indigoL: "#EEF2FF",
  black: "#0F0F0F",
  dark: "#374151",
  mid: "#6B7280",
  muted: "#9CA3AF",
  border: "#E5E7EB",
  bg: "#F9FAFB",
  codeBg: "#0d0d1a",
  codeHeader: "#13132a",
  codeBorder: "#2d2d4e",
  success: "#10B981",
  successBg: "#ECFDF5",
};

const FRAMEWORKS = [
  {
    id: "html",
    label: "HTML",
    color: "#F97316",
    bg: "#FFF7ED",
    install: null,
    serverLang: "node",
  },
  {
    id: "react",
    label: "React",
    color: "#0EA5E9",
    bg: "#F0F9FF",
    install: "npm install @humora-io/widget",
    serverLang: "node",
  },
  {
    id: "nextjs",
    label: "Next.js",
    color: "#0F0F0F",
    bg: "#F3F4F6",
    install: "npm install @humora-io/widget",
    serverLang: "node",
  },
  {
    id: "vue",
    label: "Vue",
    color: "#42B883",
    bg: "#F0FDF4",
    install: "npm install @humora-io/widget",
    serverLang: "node",
  },
  {
    id: "php",
    label: "PHP",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    install: null,
    serverLang: "php",
  },
  {
    id: "django",
    label: "Django",
    color: "#3B82F6",
    bg: "#EFF6FF",
    install: null,
    serverLang: "python",
  },
];

const STEP2_CODE = {
  html: `<!-- 1. Paste in your <head> -->
<script src="https://widget.humora.io/humora.min.js" async defer></script>

<!-- 2. Your existing form — no changes needed -->
<form id="my-form">
  <input type="email"    id="email"    placeholder="Email" />
  <input type="password" id="password" placeholder="Password" />
  <button type="submit">Sign Up</button>
</form>

<!-- 3. The popup overlay (hidden until submit) -->
<div id="humora-backdrop" style="display:none;position:fixed;inset:0;
  background:rgba(0,0,0,0.55);z-index:9999;align-items:center;
  justify-content:center;">
  <div style="background:#fff;border-radius:20px;max-width:400px;
    width:100%;overflow:hidden;box-shadow:0 24px 80px rgba(0,0,0,0.2);">
    <div style="padding:14px 18px;border-bottom:1px solid #F3F4F6;
      font-family:sans-serif;font-size:13px;font-weight:600;
      display:flex;justify-content:space-between;align-items:center;">
      Human Verification
      <button onclick="closePopup()"
        style="background:none;border:none;font-size:22px;
        cursor:pointer;color:#9CA3AF;">×</button>
    </div>
    <div id="humora-widget"></div>
  </div>
</div>

<!-- 4. Wire it up -->
<script>
  var _token = null;

  document.getElementById('my-form').addEventListener('submit', function(e) {
    e.preventDefault();
    _token ? submitForm() : openPopup();
  });

  function openPopup()  { document.getElementById('humora-backdrop').style.display = 'flex'; }
  function closePopup() { document.getElementById('humora-backdrop').style.display = 'none'; }

  function submitForm() {
    fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email:        document.getElementById('email').value,
        password:     document.getElementById('password').value,
        humora_token: _token,
      }),
    }).then(r => r.json()).then(d => { if (d.success) location.href = '/dashboard' });
  }

  humora.ready(function() {
    humora.render('humora-widget', {
      sitekey: 'YOUR_SITE_KEY',       // ← paste your sitekey here

      callback: function(token) {
        _token = token;
        closePopup();
        submitForm();
      },

      expiredCallback: function() { _token = null; },
    });
  });
</script>`,

  react: `'use client' // remove this line if not using Next.js

import { useState, useRef, useEffect, useCallback } from 'react'

// Drop this anywhere in your app — reusable popup
function HumoraPopup({ isOpen, onVerified, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!isOpen || !window.humora || !ref.current) return
    window.humora.render(ref.current, {
      sitekey: import.meta.env.VITE_HUMORA_SITE_KEY,   // ← your sitekey
      callback:        (token) => onVerified(token),
      expiredCallback: () => {},
    })
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 20, width: '100%',
        maxWidth: 400, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '14px 18px',
          borderBottom: '1px solid #F3F4F6',
          fontSize: 13, fontWeight: 600 }}>
          Human Verification
          <button onClick={onClose} style={{ background: 'none', border: 'none',
            fontSize: 22, cursor: 'pointer', color: '#9CA3AF' }}>×</button>
        </div>
        <div ref={ref} />
      </div>
    </div>
  )
}

export default function SignupForm() {
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [loading, setLoading]     = useState(false)

  const handleVerified = useCallback(async (token) => {
    setShowPopup(false)
    setLoading(true)
    const res  = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, humora_token: token }),
    })
    const data = await res.json()
    if (data.success) location.href = '/dashboard'
    setLoading(false)
  }, [email, password])

  return (
    <>
      <HumoraPopup
        isOpen={showPopup}
        onVerified={handleVerified}
        onClose={() => setShowPopup(false)}
      />
      <form onSubmit={e => { e.preventDefault(); setShowPopup(true) }}>
        <input value={email}    onChange={e => setEmail(e.target.value)}
          type="email" placeholder="Email" />
        <input value={password} onChange={e => setPassword(e.target.value)}
          type="password" placeholder="Password" />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Sign Up'}
        </button>
      </form>
    </>
  )
}`,

  nextjs: `// app/components/HumoraPopup.tsx
'use client'
import { useRef, useEffect } from 'react'
declare const window: any

export function HumoraPopup({
  isOpen, onVerified, onClose,
}: {
  isOpen: boolean
  onVerified: (token: string) => void
  onClose: () => void
}) {
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
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#fff', borderRadius: 20, width: '100%',
        maxWidth: 400, overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '14px 18px',
          borderBottom: '1px solid #F3F4F6',
          fontSize: 13, fontWeight: 600 }}>
          Human Verification
          <button onClick={onClose} style={{ background: 'none', border: 'none',
            fontSize: 22, cursor: 'pointer', color: '#9CA3AF' }}>×</button>
        </div>
        <div ref={ref} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------
// app/layout.tsx — load the widget script globally
// ---------------------------------------------------------
// Add this to your root layout <head>:
// <Script src="https://widget.humora.io/humora.min.js" strategy="afterInteractive" />`,

  vue: `<!-- components/HumoraPopup.vue -->
<template>
  <Teleport to="body">
    <div v-if="isOpen" @click="$emit('close')" :style="{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }">
      <div @click.stop :style="{
        background: '#fff', borderRadius: '20px', width: '100%',
        maxWidth: '400px', overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
      }">
        <div :style="{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '14px 18px',
          borderBottom: '1px solid #F3F4F6',
          fontSize: '13px', fontWeight: 600,
        }">
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

const props  = defineProps(['isOpen'])
const emits  = defineEmits(['close', 'verified'])
const container = ref(null)

watch(() => props.isOpen, (open) => {
  if (!open || !window.humora || !container.value) return
  window.humora.render(container.value, {
    sitekey: import.meta.env.VITE_HUMORA_SITE_KEY,
    callback:        (token) => emits('verified', token),
    expiredCallback: () => {},
  })
})
</script>`,

  php: `<?php
// No frontend package needed — use the script tag

// ── In your HTML template ──────────────────────────────────────────────
// <script src="https://widget.humora.io/humora.min.js" async defer></script>
// <div id="humora-widget"></div>
// <script>
//   humora.ready(function() {
//     humora.render('humora-widget', {
//       sitekey: '<?= htmlspecialchars($HUMORA_SITE_KEY) ?>',
//       callback: function(token) {
//         document.getElementById('humora_token').value = token;
//         document.getElementById('submit-btn').disabled = false;
//       },
//     });
//   });
// </script>
// ── End template ─────────────────────────────────────────────────────

// ── Your form handler (e.g. signup.php) ───────────────────────────────
$token = $_POST['humora_token'] ?? '';

$response = file_get_contents(
  'https://api.humora.io/api/verify', false,
  stream_context_create(['http' => [
    'method'  => 'POST',
    'header'  => 'Content-Type: application/json',
    'content' => json_encode([
      'token'   => $token,
      'sitekey' => $_ENV['HUMORA_SITE_KEY'],
    ]),
  ]])
);

$result = json_decode($response, true);

if (!$result['success']) {
  http_response_code(400);
  echo json_encode(['error' => 'Human verification required']);
  exit;
}

// ✅ Token valid — proceed with your logic
createUser($_POST['email'], $_POST['password']);
echo json_encode(['success' => true]);`,

  django: `# No frontend package needed — use the script tag in your template
# {% load static %}
# <script src="https://widget.humora.io/humora.min.js" async defer></script>

# ── views.py ──────────────────────────────────────────────────────────
import os, requests
from django.http import JsonResponse

def signup(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    import json
    data  = json.loads(request.body)
    token = data.get('humora_token', '')

    # 1. Verify with Humora
    check = requests.post(
        'https://api.humora.io/api/verify',
        json={
            'token':   token,
            'sitekey': os.environ['HUMORA_SITE_KEY'],
        },
        timeout=10,
    ).json()

    if not check.get('success'):
        return JsonResponse({'error': 'Human verification required'}, status=400)

    # 2. Token valid — proceed
    create_user(data['email'], data['password'])
    return JsonResponse({'success': True})`,
};

const STEP3_CODE = {
  node: `// Express — POST /api/signup
app.post('/api/signup', async (req, res) => {
  const { email, password, humora_token } = req.body

  // 1. Verify the token with Humora
  const check = await fetch('https://api.humora.io/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token:   humora_token,
      sitekey: process.env.HUMORA_SITE_KEY,   // keep this server-side only
    }),
  }).then(r => r.json())

  // 2. Reject if verification failed
  if (!check.success) {
    return res.status(400).json({ error: 'Human verification required' })
  }

  // 3. All good — create the user
  await createUser(email, password)
  res.json({ success: true })
})`,

  php: null, // shown inline in step 2 for PHP

  python: null, // shown inline in step 2 for Django
};

function FingerprintIcon({ size = 22, color = C.indigo }) {
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

function CopyButton({ text, small = false }) {
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
        background: copied ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.08)",
        border: `1px solid ${copied ? "#10B981" : "rgba(255,255,255,0.12)"}`,
        borderRadius: 6,
        padding: small ? "3px 10px" : "5px 14px",
        fontFamily: "Archivo, sans-serif",
        fontSize: small ? 11 : 12,
        fontWeight: 500,
        color: copied ? "#10B981" : "#9CA3AF",
        cursor: "pointer",
        transition: "all 150ms",
        display: "flex",
        alignItems: "center",
        gap: 5,
        flexShrink: 0,
      }}
    >
      {copied ? (
        <>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function CodeBlock({ code, lang, label }) {
  const langColors = {
    html: "#F97316", javascript: "#EAB308", jsx: "#61DAFB",
    tsx: "#61DAFB", python: "#3B82F6", php: "#8B5CF6",
    bash: "#10B981", vue: "#42B883",
  };
  return (
    <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${C.codeBorder}` }}>
      <div style={{
        background: C.codeHeader, borderBottom: `1px solid ${C.codeBorder}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", minHeight: 44,
      }}>
        <span style={{
          fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600,
          color: langColors[lang] || "#9CA3AF", textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}>
          {label || lang}
        </span>
        <CopyButton text={code} />
      </div>
      <div style={{ background: C.codeBg, padding: "20px 24px", overflowX: "auto" }}>
        <pre style={{
          fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
          fontSize: 13, lineHeight: 1.7, color: "#e2e8f0",
          margin: 0, whiteSpace: "pre",
        }}>
          {code}
        </pre>
      </div>
    </div>
  );
}

function InlineCommand({ cmd }) {
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
        display: "inline-flex", alignItems: "center", gap: 10,
        background: C.codeBg, border: `1px solid ${C.codeBorder}`,
        borderRadius: 10, padding: "10px 18px",
        cursor: "pointer", transition: "border-color 150ms",
        maxWidth: "100%",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = C.indigo)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = C.codeBorder)}
    >
      <code style={{
        fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
        fontSize: 14, color: "#e2e8f0", flex: 1,
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

function StepNumber({ n }) {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      background: C.indigoL, border: `2px solid #C7D2FE`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 14,
      color: C.indigo, flexShrink: 0,
    }}>
      {n}
    </div>
  );
}

export default function QuickStartPage() {
  const [fw, setFw] = useState("html");
  const framework = FRAMEWORKS.find(f => f.id === fw);

  const step2Code = STEP2_CODE[fw];
  const step3Code = fw === "php" || fw === "django" ? null : STEP3_CODE.node;
  const step2Lang = fw === "html" ? "html" : fw === "react" ? "jsx" : fw === "nextjs" ? "tsx" : fw === "vue" ? "vue" : fw === "php" ? "php" : "python";
  const step2Label = fw === "html" ? "HTML + JS" : fw === "react" ? "JSX" : fw === "nextjs" ? "TSX" : fw === "vue" ? "Vue SFC" : fw === "php" ? "PHP" : "Python";

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: 56,
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <FingerprintIcon size={20} />
          <span style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 16, color: C.black }}>
            Humora
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link to="/docs" style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: C.mid, textDecoration: "none", fontWeight: 500 }}>
            Full Docs
          </Link>
          <Link to="/demo" style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: C.mid, textDecoration: "none", fontWeight: 500 }}>
            Demo
          </Link>
          <Link to="/dashboard" style={{
            fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13,
            color: "#fff", background: C.indigo, textDecoration: "none",
            borderRadius: 8, padding: "7px 14px",
          }}>
            Dashboard →
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div style={{
        maxWidth: 720, margin: "0 auto", padding: "64px 24px 0",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: C.indigoL, border: "1px solid #C7D2FE",
          borderRadius: 999, padding: "5px 14px", marginBottom: 24,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.indigo} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, fontWeight: 600, color: C.indigo }}>
            Quick Start — 5 minutes
          </span>
        </div>

        <h1 style={{
          fontFamily: "Archivo, sans-serif", fontWeight: 900, fontSize: 48,
          color: C.black, lineHeight: 1.1, marginBottom: 16,
          letterSpacing: "-0.02em",
        }}>
          Integrate Humora<br />
          <span style={{ color: C.indigo }}>in minutes.</span>
        </h1>

        <p style={{
          fontFamily: "Archivo, sans-serif", fontSize: 18, color: C.mid,
          lineHeight: 1.6, maxWidth: 520, margin: "0 auto 40px",
        }}>
          Copy-paste integration for any stack. No complex setup. Works like reCAPTCHA — but people actually enjoy it.
        </p>

        {/* Test sitekey banner */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: C.successBg, border: "1px solid #A7F3D0",
          borderRadius: 10, padding: "10px 18px", marginBottom: 48,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#065F46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#065F46" }}>
            <strong>Test without signing up</strong> — use sitekey{" "}
            <code style={{
              fontFamily: "monospace", background: "#D1FAE5",
              padding: "1px 6px", borderRadius: 4, fontSize: 12,
            }}>
              sk_test_humora_dev
            </code>{" "}
            for local development.
          </span>
        </div>
      </div>

      {/* ── Framework Picker ─────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 48px" }}>
        <p style={{
          fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: 600,
          color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em",
          marginBottom: 12, textAlign: "center",
        }}>
          Choose your stack
        </p>
        <div style={{
          display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center",
        }}>
          {FRAMEWORKS.map(f => (
            <button
              key={f.id}
              onClick={() => setFw(f.id)}
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: fw === f.id ? 700 : 500,
                fontSize: 14,
                color: fw === f.id ? f.color : C.mid,
                background: fw === f.id ? f.bg : "#F9FAFB",
                border: `1.5px solid ${fw === f.id ? f.color + "66" : C.border}`,
                borderRadius: 10,
                padding: "10px 20px",
                cursor: "pointer",
                transition: "all 150ms",
              }}
              onMouseEnter={e => {
                if (fw !== f.id) e.currentTarget.style.borderColor = f.color + "44";
              }}
              onMouseLeave={e => {
                if (fw !== f.id) e.currentTarget.style.borderColor = C.border;
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Steps ────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 80px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={fw}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >

            {/* ── Step 1 ── */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <StepNumber n={1} />
                <div>
                  <h2 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 20, color: C.black, marginBottom: 2 }}>
                    Get your sitekey
                  </h2>
                  <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 14, color: C.mid }}>
                    A sitekey links the widget to your domain. Takes 30 seconds.
                  </p>
                </div>
              </div>

              <div style={{
                background: C.bg, border: `1px solid ${C.border}`,
                borderRadius: 14, padding: "20px 24px",
              }}>
                <ol style={{ paddingLeft: 20 }}>
                  {[
                    <>Go to your <Link to="/dashboard/sites" style={{ color: C.indigo, fontWeight: 600 }}>Dashboard → My Sites</Link></>,
                    'Click "Add New Site" and enter your domain',
                    <>Copy your sitekey — it looks like <code style={{ fontFamily: "monospace", background: C.indigoL, color: C.indigo, padding: "1px 6px", borderRadius: 4, fontSize: 12 }}>sk_live_x9k2mf3p…</code></>,
                    'Paste it wherever you see YOUR_SITE_KEY below',
                  ].map((item, i) => (
                    <li key={i} style={{
                      fontFamily: "Archivo, sans-serif", fontSize: 14,
                      color: C.dark, lineHeight: 1.7, marginBottom: 6,
                    }}>
                      {item}
                    </li>
                  ))}
                </ol>
                <div style={{
                  marginTop: 16, padding: "12px 16px",
                  background: C.successBg, border: "1px solid #A7F3D0",
                  borderRadius: 10,
                  fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#065F46",
                }}>
                  <strong>Testing locally?</strong> Skip signup — use{" "}
                  <code style={{ fontFamily: "monospace", background: "#D1FAE5", padding: "1px 6px", borderRadius: 4, fontSize: 12 }}>
                    sk_test_humora_dev
                  </code>{" "}
                  as your sitekey right now. Swap it for your real key before deploying.
                </div>
              </div>
            </div>

            {/* ── Step 2 ── */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <StepNumber n={2} />
                <div>
                  <h2 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 20, color: C.black, marginBottom: 2 }}>
                    {framework.install ? "Install and add to your form" : "Add the widget to your page"}
                  </h2>
                  <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 14, color: C.mid }}>
                    {framework.install
                      ? "Install the package, then drop the component in your form."
                      : "One script tag, then place the widget in your form."}
                  </p>
                </div>
              </div>

              {framework.install && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{
                    fontFamily: "Archivo, sans-serif", fontSize: 12, fontWeight: 600,
                    color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em",
                    marginBottom: 8,
                  }}>
                    Install
                  </p>
                  <InlineCommand cmd={framework.install} />
                </div>
              )}

              <CodeBlock code={step2Code} lang={step2Lang} label={step2Label} />
            </div>

            {/* ── Step 3 (Node.js server verification — only for HTML/React/Next.js/Vue) ── */}
            {step3Code && (
              <div style={{ marginBottom: 48 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <StepNumber n={3} />
                  <div>
                    <h2 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 20, color: C.black, marginBottom: 2 }}>
                      Verify the token on your server
                    </h2>
                    <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 14, color: C.mid }}>
                      Always verify server-side. Never trust client-side only.
                    </p>
                  </div>
                </div>

                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px",
                  background: "#FEF2F2", border: "1px solid #FECACA",
                  borderRadius: 10, marginBottom: 16,
                }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>🚨</span>
                  <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#991B1B", margin: 0, lineHeight: 1.5 }}>
                    <strong>This step is mandatory.</strong> Skipping server-side verification means bots can bypass the widget entirely.
                  </p>
                </div>

                <CodeBlock code={step3Code} lang="javascript" label="Node.js" />

                <div style={{
                  marginTop: 12, padding: "11px 16px",
                  background: C.indigoL, border: "1px solid #C7D2FE",
                  borderRadius: 10,
                  fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#3730A3",
                }}>
                  Using Python, PHP, or another language?{" "}
                  <Link to="/docs" style={{ color: C.indigo, fontWeight: 600 }}>
                    See all server examples in the docs →
                  </Link>
                </div>
              </div>
            )}

            {/* For PHP/Django, step 3 is already shown inline in step 2 */}
            {!step3Code && (
              <div style={{ marginBottom: 48 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <StepNumber n={3} />
                  <h2 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 20, color: C.black }}>
                    You're done
                  </h2>
                </div>
                <div style={{
                  background: C.successBg, border: "1px solid #A7F3D0",
                  borderRadius: 14, padding: "16px 20px",
                  fontFamily: "Archivo, sans-serif", fontSize: 14, color: "#065F46",
                }}>
                  The server verification was already included in Step 2. Your backend is ready.
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* ── You're done ── */}
        <div style={{
          background: C.indigoL, border: "1px solid #C7D2FE",
          borderRadius: 20, padding: "32px 36px", textAlign: "center",
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: C.successBg, border: "2px solid #A7F3D0",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 22, color: C.black, marginBottom: 8 }}>
            You're integrated!
          </h3>
          <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 15, color: C.mid, marginBottom: 24, lineHeight: 1.6 }}>
            Open your page, answer the 5 questions, and watch verifications appear in your dashboard.
          </p>

          {/* Quick checklist */}
          <div style={{
            background: "white", borderRadius: 12, padding: "16px 20px",
            border: "1px solid #C7D2FE", marginBottom: 28, textAlign: "left",
          }}>
            <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, fontWeight: 700, color: C.indigo, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
              Before you ship
            </p>
            {[
              "Widget appears on the page",
              "Completing all 5 questions enables your submit button",
              "Submitting the form hits your server and token is verified",
              "Submitting without verifying is blocked",
              "You've swapped sk_test_humora_dev for your real sk_live_ key",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 5,
                  border: `2px solid ${C.border}`, background: "white",
                  flexShrink: 0, marginTop: 1,
                }} />
                <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: C.dark, lineHeight: 1.5 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/dashboard"
              style={{
                fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 14,
                color: "#fff", background: C.indigo, textDecoration: "none",
                borderRadius: 10, padding: "12px 24px",
                transition: "all 200ms",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.indigoD; e.currentTarget.style.boxShadow = "0 4px 16px rgba(79,70,229,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.indigo; e.currentTarget.style.boxShadow = "none"; }}
            >
              Go to Dashboard →
            </Link>
            <Link
              to="/docs"
              style={{
                fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 14,
                color: C.indigo, background: "white", textDecoration: "none",
                borderRadius: 10, padding: "12px 24px",
                border: `1.5px solid #C7D2FE`,
                transition: "all 200ms",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.boxShadow = "0 2px 8px rgba(79,70,229,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#C7D2FE"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Full Docs
            </Link>
          </div>
        </div>

        {/* ── Footer ── */}
        <p style={{
          fontFamily: "Archivo, sans-serif", fontSize: 13, color: C.muted,
          textAlign: "center", marginTop: 40,
        }}>
          Need help?{" "}
          <a href="mailto:support@humora.io" style={{ color: C.indigo, textDecoration: "none", fontWeight: 500 }}>
            support@humora.io
          </a>
          {" · "}
          <Link to="/docs" style={{ color: C.indigo, textDecoration: "none", fontWeight: 500 }}>
            Full documentation
          </Link>
        </p>
      </div>
    </>
  );
}
