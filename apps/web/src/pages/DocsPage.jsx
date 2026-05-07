import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

// ── STYLES ────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Archivo', sans-serif; background: white; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 999px; }
  ::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .docs-sidebar::-webkit-scrollbar { width: 4px; }
  .code-block pre { overflow-x: auto; }
  .docs-content h2 { scroll-margin-top: 88px; }
  .docs-content h3 { scroll-margin-top: 88px; }
`;

// ── COLORS ────────────────────────────────────────────────────
const C = {
  indigo: "#4F46E5",
  indigoD: "#4338CA",
  indigoL: "#EEF2FF",
  black: "#0F0F0F",
  dark: "#374151",
  mid: "#6B7280",
  muted: "#9CA3AF",
  border: "#E5E7EB",
  bg: "#F5F5F7",
  codeBg: "#1a1a2e",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  warningBg: "#FFF7ED",
  warningText: "#92400E",
  errorBg: "#FEF2F2",
  errorText: "#991B1B",
  tipBg: "#ECFDF5",
  tipText: "#065F46",
};

// ── NAVIGATION STRUCTURE ──────────────────────────────────────
const NAV_SECTIONS = [
  {
    title: "GETTING STARTED",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "quick-start", label: "Quick Start", badge: "5 min" },
      { id: "how-it-works", label: "How It Works" },
      { id: "get-sitekey", label: "Getting Your Sitekey" },
    ],
  },
  {
    title: "INTEGRATION GUIDES",
    items: [
      { id: "popup-modal", label: "Popup / Modal Mode", badge: "★ Recommended" },
      { id: "html-vanilla", label: "HTML / Vanilla JS" },
      { id: "react-vite", label: "React + Vite" },
      { id: "nextjs", label: "Next.js App Router" },
      { id: "vue-nuxt", label: "Vue / Nuxt" },
      { id: "wordpress", label: "WordPress" },
      { id: "webflow", label: "Webflow" },
      { id: "laravel", label: "Laravel / PHP" },
      { id: "django", label: "Django / Python" },
      { id: "rails", label: "Ruby on Rails" },
    ],
  },
  {
    title: "WIDGET REFERENCE",
    items: [
      { id: "render", label: "humora.render()" },
      { id: "getresponse", label: "humora.getResponse()" },
      { id: "reset", label: "humora.reset()" },
      { id: "ready", label: "humora.ready()" },
      { id: "config-options", label: "Configuration options" },
      { id: "postmessage", label: "postMessage events" },
      { id: "error-handling", label: "Error handling" },
    ],
  },
  {
    title: "API REFERENCE",
    items: [
      { id: "authentication", label: "Authentication" },
      { id: "verify", label: "POST /api/verify" },
      { id: "register", label: "POST /api/register" },
      { id: "health", label: "GET /api/health" },
      { id: "error-codes", label: "Error codes" },
      { id: "rate-limits", label: "Rate limits" },
      { id: "webhooks", label: "Webhooks" },
    ],
  },
  {
    title: "SECURITY",
    items: [
      { id: "scoring", label: "Scoring methodology" },
      { id: "jwt-lifecycle", label: "JWT token lifecycle" },
      { id: "replay", label: "Replay protection" },
      { id: "self-hosting", label: "Self-hosting guide" },
      { id: "gdpr", label: "GDPR compliance" },
    ],
  },
  {
    title: "CHANGELOG",
    items: [{ id: "v1-0-0", label: "v1.0.0", badge: "latest" }],
  },
];

// ── LEAD TEXT ─────────────────────────────────────────────────
const LEAD_TEXT = {
  "popup-modal": "The recommended way to use Humora — a popup appears when the user submits, verifies them, then lets the action through. Just like reCAPTCHA but as a beautiful modal.",
  "quick-start": "Get Humora running on your site in under 5 minutes. No account required for testing. No credit card ever.",
  introduction: "What Humora is, why it replaces reCAPTCHA, and how behavioral scoring works.",
  "how-it-works": "A deep dive into behavioral scoring, timing analysis, and how JWT tokens are issued.",
  "get-sitekey": "Register your domain and obtain your sk_live_ credentials from the dashboard.",
  "html-vanilla": "Embed the Humora widget in any plain HTML page with a single script tag.",
  "react-vite": "Use Humora in React with a reusable component wrapper. Works with Vite and CRA.",
  nextjs: "Server-side token verification using Next.js App Router route handlers.",
  "vue-nuxt": "Add Humora to Vue 3 or Nuxt applications with a composable wrapper.",
  wordpress: "Install the Humora WordPress plugin and protect any form in minutes.",
  webflow: "Embed Humora on Webflow sites using custom code embeds.",
  laravel: "Verify tokens server-side in Laravel using the built-in HTTP client.",
  django: "Protect Django forms and API endpoints with server-side token verification.",
  rails: "Add Humora to Ruby on Rails apps with simple server-side verification.",
  render: "Mount the Humora widget into a DOM element with full configuration options.",
  getresponse: "Read the current verification state and token after the user passes.",
  reset: "Reset the widget back to its initial state, clearing any stored token.",
  ready: "Queue callbacks to run once the Humora script has fully loaded.",
  "config-options": "All available configuration options for humora.render().",
  postmessage: "Cross-origin communication events emitted by the widget iframe.",
  "error-handling": "How to handle widget errors and network failures gracefully.",
  authentication: "How to authenticate API requests using your secret sitekey.",
  verify: "Verify a Humora JWT token server-side. Always call this from your backend.",
  register: "Register a new domain and obtain a sitekey programmatically.",
  health: "Check the health and uptime status of the Humora API.",
  "error-codes": "Complete reference of all error codes returned by the API.",
  "rate-limits": "Request limits per sitekey and how to handle 429 responses.",
  webhooks: "Receive real-time notifications when verifications succeed or fail.",
  scoring: "How answer score, timing bonus, and behavior score combine into a verdict.",
  "jwt-lifecycle": "Token signing, 5-minute expiry, and replay attack prevention explained.",
  replay: "How Humora prevents replay attacks using single-use token enforcement.",
  "self-hosting": "Run the widget and API server entirely within your own infrastructure.",
  gdpr: "No PII collected, no cookies set, no third-party data sharing.",
  "v1-0-0": "Release notes and changelog for Humora v1.0.0.",
};

// ── SEARCH DATA ───────────────────────────────────────────────
const SEARCH_DATA = [
  {
    id: "quick-start",
    title: "Quick Start",
    section: "Getting Started",
    snippet: "Get Humora running on your site in under 5 minutes",
  },
  {
    id: "introduction",
    title: "Introduction",
    section: "Getting Started",
    snippet: "What is Humora and why it replaces reCAPTCHA",
  },
  {
    id: "how-it-works",
    title: "How It Works",
    section: "Getting Started",
    snippet: "Behavioral scoring, timing analysis, and JWT tokens",
  },
  {
    id: "get-sitekey",
    title: "Getting Your Sitekey",
    section: "Getting Started",
    snippet: "Register your domain and get sk_live_ credentials",
  },
  {
    id: "react-vite",
    title: "React + Vite Integration",
    section: "Integration Guides",
    snippet: "Embed Humora in React apps using the widget component",
  },
  {
    id: "nextjs",
    title: "Next.js App Router",
    section: "Integration Guides",
    snippet: "Server-side verification with Next.js route handlers",
  },
  {
    id: "wordpress",
    title: "WordPress Plugin",
    section: "Integration Guides",
    snippet: "Add Humora to WordPress forms with one plugin",
  },
  {
    id: "verify",
    title: "POST /api/verify",
    section: "API Reference",
    snippet: "Verify a JWT token server-side after user passes",
  },
  {
    id: "error-codes",
    title: "Error Codes",
    section: "API Reference",
    snippet: "invalid-token, expired-token, duplicate-token explained",
  },
  {
    id: "scoring",
    title: "Scoring Methodology",
    section: "Security",
    snippet: "How answer score, timing bonus, and behavior score work",
  },
  {
    id: "gdpr",
    title: "GDPR Compliance",
    section: "Security",
    snippet: "No PII collected, no cookies, self-hostable",
  },
  {
    id: "jwt-lifecycle",
    title: "JWT Token Lifecycle",
    section: "Security",
    snippet: "5-minute expiry, HS256 signing, replay attack prevention",
  },
  {
    id: "render",
    title: "humora.render()",
    section: "Widget Reference",
    snippet: "Mount the widget into a DOM element with config options",
  },
  {
    id: "postmessage",
    title: "postMessage Events",
    section: "Widget Reference",
    snippet: "Cross-origin communication with verified and token data",
  },
];

// ══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ══════════════════════════════════════════════════════════════

// ── Fingerprint Icon ──────────────────────────────────────────
function FingerprintIcon({ size = 20, color = C.indigo }) {
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
    </svg>
  );
}

// ── Code Block ────────────────────────────────────────────────
function CodeBlock({ code, language = "html", tabs }) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentCode = tabs ? tabs[activeTab].code : code;
  const currentLang = tabs ? tabs[activeTab].lang : language;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langColors = {
    html: "#F97316",
    javascript: "#EAB308",
    jsx: "#61DAFB",
    python: "#3B82F6",
    php: "#8B5CF6",
    ruby: "#EF4444",
    bash: "#10B981",
    json: "#F59E0B",
  };

  return (
    <div
      className="code-block"
      style={{
        borderRadius: 14,
        overflow: "hidden",
        border: `1px solid #2d2d4e`,
        marginBottom: 24,
      }}>
      {/* Tab bar */}
      <div
        style={{
          background: "#13132a",
          borderBottom: "1px solid #2d2d4e",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          minHeight: 44,
        }}>
        <div style={{ display: "flex", gap: 0 }}>
          {tabs ? (
            tabs.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "12px 16px",
                  fontFamily: "Archivo, sans-serif",
                  fontWeight: activeTab === i ? 600 : 400,
                  fontSize: 12,
                  color: activeTab === i ? "white" : "#6B7280",
                  cursor: "pointer",
                  borderBottom:
                    activeTab === i
                      ? `2px solid ${C.indigo}`
                      : "2px solid transparent",
                  transition: "all 150ms",
                }}>
                {t.label}
              </button>
            ))
          ) : (
            <span
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: langColors[currentLang] || "#9CA3AF",
                padding: "12px 0",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
              {currentLang}
            </span>
          )}
        </div>

        <button
          onClick={handleCopy}
          style={{
            background: copied ? "#10B98120" : "rgba(255,255,255,0.06)",
            border: `1px solid ${copied ? "#10B981" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 6,
            padding: "4px 12px",
            fontFamily: "Archivo, sans-serif",
            fontSize: 11,
            fontWeight: 500,
            color: copied ? "#10B981" : "#9CA3AF",
            cursor: "pointer",
            transition: "all 150ms",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}>
          {copied ? (
            <>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="#10B981"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>{" "}
              Copied!
            </>
          ) : (
            <>
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>{" "}
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div
        style={{
          background: C.codeBg,
          padding: "20px 24px",
          overflowX: "auto",
        }}>
        <pre
          style={{
            fontFamily: "Courier New, Courier, monospace",
            fontSize: 13,
            lineHeight: 1.7,
            color: "#e2e8f0",
            margin: 0,
            whiteSpace: "pre",
          }}>
          {currentCode}
        </pre>
      </div>
    </div>
  );
}

// ── Callout Box ───────────────────────────────────────────────
function Callout({ type = "note", children }) {
  const styles = {
    note: { bg: C.indigoL, border: "#C7D2FE", icon: "ℹ️", color: "#3730A3" },
    warning: {
      bg: C.warningBg,
      border: "#FDE68A",
      icon: "⚠️",
      color: C.warningText,
    },
    danger: {
      bg: C.errorBg,
      border: "#FECACA",
      icon: "🚨",
      color: C.errorText,
    },
    tip: { bg: C.tipBg, border: "#A7F3D0", icon: "💡", color: C.tipText },
  };
  const s = styles[type];
  return (
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: 12,
        padding: "14px 18px",
        display: "flex",
        gap: 12,
        marginBottom: 20,
      }}>
      <span style={{ fontSize: 15, flexShrink: 0 }}>{s.icon}</span>
      <p
        style={{
          fontFamily: "Archivo, sans-serif",
          fontSize: 14,
          color: s.color,
          lineHeight: 1.6,
          margin: 0,
        }}>
        {children}
      </p>
    </div>
  );
}

// ── Method Badge ──────────────────────────────────────────────
function MethodBadge({ method }) {
  const colors = {
    POST: { bg: "#DCFCE7", color: "#166534" },
    GET: { bg: "#DBEAFE", color: "#1E40AF" },
    DELETE: { bg: "#FEE2E2", color: "#991B1B" },
  };
  const c = colors[method] || colors.GET;
  return (
    <span
      style={{
        background: c.bg,
        color: c.color,
        fontFamily: "Courier New, monospace",
        fontWeight: 700,
        fontSize: 11,
        padding: "2px 8px",
        borderRadius: 6,
        marginRight: 8,
      }}>
      {method}
    </span>
  );
}

// ── Next Steps Cards ──────────────────────────────────────────
function NextStepCards({ onNavigate }) {
  const cards = [
    {
      id: "verify",
      label: "Explore API Reference →",
      desc: "Full endpoint docs",
    },
    {
      id: "html-vanilla",
      label: "Integration Guides →",
      desc: "React, Vue, WordPress...",
    },
    {
      id: "config-options",
      label: "Configuration Options →",
      desc: "Widget customization",
    },
    { id: "scoring", label: "Security Overview →", desc: "How scoring works" },
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        marginTop: 8,
      }}>
      {cards.map((c) => (
        <button
          key={c.id}
          onClick={() => onNavigate(c.id)}
          style={{
            background: "white",
            border: `1.5px solid ${C.border}`,
            borderRadius: 12,
            padding: "16px 20px",
            textAlign: "left",
            cursor: "pointer",
            transition: "all 180ms ease",
            fontFamily: "Archivo, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = C.indigo;
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(79,70,229,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = C.border;
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "none";
          }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: C.indigo,
              marginBottom: 4,
            }}>
            {c.label}
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>{c.desc}</div>
        </button>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// CONTENT ARTICLES
// ══════════════════════════════════════════════════════════════
function ArticleContent({ articleId, onNavigate }) {
  const h2 = (text, id) => (
    <h2
      id={id}
      style={{
        fontFamily: "Archivo, sans-serif",
        fontWeight: 800,
        fontSize: 22,
        color: C.black,
        marginTop: 40,
        marginBottom: 12,
        paddingBottom: 8,
        borderBottom: `1px solid ${C.border}`,
      }}>
      {text}
    </h2>
  );

  const h3 = (text) => (
    <h3
      style={{
        fontFamily: "Archivo, sans-serif",
        fontWeight: 700,
        fontSize: 16,
        color: C.black,
        marginTop: 24,
        marginBottom: 8,
      }}>
      {text}
    </h3>
  );

  const p = (text, style = {}) => (
    <p
      style={{
        fontFamily: "Archivo, sans-serif",
        fontSize: 15,
        color: C.dark,
        lineHeight: 1.8,
        marginBottom: 16,
        ...style,
      }}>
      {text}
    </p>
  );

  const ul = (items) => (
    <ul style={{ marginBottom: 16, paddingLeft: 20 }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            fontFamily: "Archivo, sans-serif",
            fontSize: 15,
            color: C.dark,
            lineHeight: 1.8,
            marginBottom: 4,
          }}>
          {item}
        </li>
      ))}
    </ul>
  );

  // ── QUICK START ──────────────────────────────────────────
  if (articleId === "quick-start")
    return (
      <div className="docs-content">
        <Callout type="tip">
          <strong>First time here?</strong> Think of Humora like reCAPTCHA — but instead of
          "click all the traffic lights", it asks 5 quick personality questions that only a real
          human could answer naturally. When a user passes, you get a token you verify on your server.
          That's the whole flow.
        </Callout>

        {h2("What you need before starting", "prerequisites")}
        {p("Three things — that's it:")}
        {ul([
          "A page on your website that has a form (login, signup, contact, etc.)",
          "A Humora sitekey — a free code that links the widget to your domain (see Step 1)",
          "A way to run server-side code (Node.js, Python, PHP, Ruby — or any backend)",
        ])}
        <Callout type="note">
          No backend yet? You can still test the widget in your browser right now using our test
          sitekey: <code style={{ fontFamily: "monospace", background: "#E0E7FF", padding: "1px 6px", borderRadius: 4 }}>sk_test_humora_dev</code>. Skip Step 5 for now and come back when your server is ready.
        </Callout>

        {h2("Step 1 — Get your sitekey", "get-sitekey")}
        {p("A sitekey is a unique code that tells Humora 'this widget belongs to yourdomain.com'. You need one before anything else works.")}
        {ul([
          "Go to your Humora dashboard → My Sites",
          "Click 'Add Site' and enter your domain (e.g. mywebsite.com)",
          "Copy the sitekey that looks like: sk_live_x9k2mf3p...",
          "Keep this key safe — paste it wherever you see YOUR_SITE_KEY below",
        ])}
        <Callout type="warning">
          Use your <strong>live sitekey</strong> (sk_live_...) on your real website.
          Use <code style={{ fontFamily: "monospace", background: "#FEF3C7", padding: "1px 6px", borderRadius: 4 }}>sk_test_humora_dev</code> while testing locally — test tokens never expire and always pass.
        </Callout>

        {h2("Step 2 — Choose your integration style", "choose-style")}
        {p("There are two ways to show the widget. Pick one:")}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {[
            {
              title: "★ Popup (Recommended)",
              desc: "A modal appears when the user clicks submit. They verify inside the popup, then your form goes through. Clean, modern, no layout changes needed.",
              badge: "Like reCAPTCHA v3 but visible",
              color: C.indigo,
              bg: C.indigoL,
              id: "popup-modal",
            },
            {
              title: "Inline Widget",
              desc: "The widget sits directly inside your form, like reCAPTCHA v2's checkbox. User verifies before hitting submit.",
              badge: "Classic style",
              color: C.mid,
              bg: "#F9FAFB",
              id: "html-vanilla",
            },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => onNavigate(opt.id)}
              style={{
                background: opt.bg,
                border: `2px solid ${opt.color}`,
                borderRadius: 14,
                padding: "18px 20px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 180ms",
                fontFamily: "Archivo, sans-serif",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ fontWeight: 700, fontSize: 14, color: opt.color, marginBottom: 6 }}>{opt.title}</div>
              <div style={{ fontSize: 13, color: C.dark, lineHeight: 1.5, marginBottom: 10 }}>{opt.desc}</div>
              <span style={{ fontSize: 11, fontWeight: 600, color: opt.color, background: "rgba(255,255,255,0.7)", padding: "2px 8px", borderRadius: 999 }}>{opt.badge}</span>
            </button>
          ))}
        </div>
        {p("Continue below for the fastest path — inline widget in plain HTML. For the popup pattern, see the Popup / Modal Mode guide.")}

        {h2("Step 3 — Add the script to your page", "script-tag")}
        {p("Copy this one line into the <head> section of your HTML page. This loads the Humora widget code.")}
        <CodeBlock
          language="html"
          code={`<!-- Paste this inside your <head> tag -->
<script
  src="https://widget.humora.io/humora.min.js"
  async
  defer
></script>`}
        />
        <Callout type="note">
          Put it in <code style={{ fontFamily: "monospace", background: "#E0E7FF", padding: "1px 6px", borderRadius: 4 }}>&lt;head&gt;</code>, not at the bottom of your page. This ensures it loads before your form is shown.
        </Callout>

        {h2("Step 4 — Add the widget to your form", "add-widget")}
        {p("Add this div wherever you want the widget to appear — usually just above the submit button.")}
        <CodeBlock
          language="html"
          code={`<form id="my-form">
  <input type="email"    name="email"    placeholder="Your email" />
  <input type="password" name="password" placeholder="Password" />

  <!-- Humora widget goes here -->
  <div id="humora-box"></div>

  <!-- Hidden field to hold the token -->
  <input type="hidden" id="humora-token" name="humora_token" />

  <button type="submit" id="submit-btn" disabled>
    Sign Up
  </button>
</form>

<script>
  humora.ready(function () {
    humora.render('humora-box', {
      sitekey: 'YOUR_SITE_KEY',   // ← paste your sitekey here

      callback: function (token) {
        // User passed! Save the token and enable the button
        document.getElementById('humora-token').value = token
        document.getElementById('submit-btn').disabled = false
      },

      expiredCallback: function () {
        // Token expired after 5 min — lock button until they re-verify
        document.getElementById('humora-token').value = ''
        document.getElementById('submit-btn').disabled = true
      },
    })
  })
</script>`}
        />
        {p("That's the entire frontend. The widget renders itself, asks the 5 questions, and gives you a token when the user passes.")}

        {h2("Step 5 — Verify the token on your server", "server-verify")}
        {p("When your form submits, your server receives the token. You must check it with Humora's API before doing anything with the data. This is what stops bots from bypassing the widget.")}
        <Callout type="danger">
          <strong>This step is mandatory.</strong> If you skip server-side verification, the widget is decoration — anyone can submit your form without completing it.
        </Callout>
        <CodeBlock
          tabs={[
            {
              label: "Node.js",
              lang: "javascript",
              code: `// In your Express route (or any Node.js server):
app.post('/signup', async (req, res) => {
  const token = req.body.humora_token

  // Step 1: Check the token with Humora
  const check = await fetch('https://api.humora.io/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token:   token,
      sitekey: process.env.HUMORA_SITE_KEY, // your secret key
    }),
  }).then(r => r.json())

  // Step 2: If it failed, reject the submission
  if (!check.success) {
    return res.status(400).json({ error: 'Please complete verification' })
  }

  // Step 3: Token is valid — do your real work
  await createUser(req.body.email, req.body.password)
  res.json({ success: true })
})`,
            },
            {
              label: "Python",
              lang: "python",
              code: `# In your Flask or Django view:
import requests, os

def signup(request):
    token = request.POST.get('humora_token')

    # Step 1: Check the token with Humora
    check = requests.post(
        'https://api.humora.io/api/verify',
        json={
            'token':   token,
            'sitekey': os.environ['HUMORA_SITE_KEY'],
        }
    ).json()

    # Step 2: If it failed, reject the submission
    if not check.get('success'):
        return JsonResponse({'error': 'Please complete verification'}, status=400)

    # Step 3: Token is valid — do your real work
    create_user(request.POST['email'], request.POST['password'])
    return JsonResponse({'success': True})`,
            },
            {
              label: "PHP",
              lang: "php",
              code: `<?php
// In your form handler:
$token = $_POST['humora_token'];

// Step 1: Check the token with Humora
$response = file_get_contents('https://api.humora.io/api/verify', false,
  stream_context_create(['http' => [
    'method'  => 'POST',
    'header'  => 'Content-Type: application/json',
    'content' => json_encode([
      'token'   => $token,
      'sitekey' => getenv('HUMORA_SITE_KEY'),
    ]),
  ]])
);
$check = json_decode($response, true);

// Step 2: If it failed, stop here
if (!$check['success']) {
  http_response_code(400);
  echo json_encode(['error' => 'Please complete verification']);
  exit;
}

// Step 3: Token is valid — do your real work
createUser($_POST['email'], $_POST['password']);`,
            },
          ]}
        />

        {h2("Step 6 — Test it", "test-it")}
        {p("Here's what to check before you go live:")}
        {ul([
          "Open your page — the widget should appear where you placed the div",
          "Answer all 5 questions — the submit button should become clickable",
          "Submit the form — your server should log a successful verification",
          "Try submitting without verifying — the button should stay disabled",
          "Wait 5 minutes after verifying — the token expires and the button should lock again",
        ])}
        <Callout type="tip">
          Test locally using <code style={{ fontFamily: "monospace", background: "#D1FAE5", padding: "1px 6px", borderRadius: 4 }}>sk_test_humora_dev</code> as your sitekey.
          Swap it for your real <code style={{ fontFamily: "monospace", background: "#D1FAE5", padding: "1px 6px", borderRadius: 4 }}>sk_live_...</code> key before deploying.
        </Callout>

        {h2("Next steps", "next-steps")}
        {p("Want the popup experience instead of inline? Or using React or Next.js? Pick your path:")}
        <NextStepCards onNavigate={onNavigate} />
      </div>
    );

  // ── POPUP / MODAL MODE ────────────────────────────────────
  if (articleId === "popup-modal")
    return (
      <div className="docs-content">
        <Callout type="tip">
          <strong>This is how Humora works on this very site.</strong> Instead of embedding the widget
          inside your form, a popup appears the moment the user clicks submit. They verify inside the popup —
          then your form goes through automatically. No layout changes, no extra space in your form.
        </Callout>

        {h2("How it works", "how-it-works")}
        {p("The popup flow has 4 steps:")}
        {ul([
          "1. User fills in your form and clicks Submit",
          "2. Instead of submitting, you show the Humora popup",
          "3. User answers the 5 questions inside the popup",
          "4. On pass → popup closes, your real form submission fires automatically",
        ])}
        {p("If they fail, they can retry inside the popup without losing their form data.")}

        {h2("Plain HTML implementation", "html-implementation")}
        {p("No framework needed. Copy this complete example and swap in your sitekey.")}
        <CodeBlock
          language="html"
          code={`<!DOCTYPE html>
<html>
<head>
  <script src="https://widget.humora.io/humora.min.js" async defer></script>
  <style>
    /* Backdrop */
    #humora-backdrop {
      display: none;
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(3px);
      z-index: 999;
      align-items: center;
      justify-content: center;
    }
    #humora-backdrop.open { display: flex; }

    /* Popup card */
    #humora-popup {
      background: white;
      border-radius: 20px;
      box-shadow: 0 24px 80px rgba(0,0,0,0.25);
      width: 100%;
      max-width: 400px;
      overflow: hidden;
    }

    /* Header bar */
    #humora-popup-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      border-bottom: 1px solid #F3F4F6;
      font-family: sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #0F0F0F;
    }

    /* Close button */
    #humora-close {
      background: none; border: none;
      font-size: 20px; cursor: pointer;
      color: #9CA3AF; line-height: 1;
    }

    /* The widget renders here */
    #humora-widget-container { padding: 0; }
  </style>
</head>
<body>

<!-- Your normal form — nothing special needed here -->
<form id="signup-form">
  <input type="email" id="email" placeholder="Email" required />
  <input type="password" id="password" placeholder="Password" required />
  <button type="submit">Create Account</button>
</form>

<!-- The popup (hidden by default) -->
<div id="humora-backdrop">
  <div id="humora-popup">
    <div id="humora-popup-header">
      🖐 Humora · Human Verification
      <button id="humora-close" onclick="closePopup()">×</button>
    </div>
    <div id="humora-widget-container"></div>
  </div>
</div>

<script>
  var humanToken = null;

  // Intercept form submit → show popup instead
  document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();

    if (humanToken) {
      // Already verified — go straight to submit
      submitForm();
    } else {
      // Show the popup
      openPopup();
    }
  });

  function openPopup() {
    document.getElementById('humora-backdrop').classList.add('open');
  }

  function closePopup() {
    document.getElementById('humora-backdrop').classList.remove('open');
  }

  function submitForm() {
    var email    = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Send to your server
    fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email:        email,
        password:     password,
        humora_token: humanToken,
      }),
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data.success) {
        window.location = '/dashboard'; // redirect on success
      }
    });
  }

  // Initialize widget when script loads
  humora.ready(function() {
    humora.render('humora-widget-container', {
      sitekey: 'YOUR_SITE_KEY',   // ← your sitekey here

      callback: function(token) {
        humanToken = token;       // store the token
        closePopup();             // close the popup
        submitForm();             // fire the real submission
      },

      expiredCallback: function() {
        humanToken = null;        // token expired, user must re-verify
      },
    });
  });
</script>

</body>
</html>`}
        />

        {h2("React implementation", "react-implementation")}
        {p("In React, intercept the form's onSubmit, show a state-controlled modal, and fire the real API call inside the verified callback.")}
        <CodeBlock
          language="jsx"
          code={`import { useState, useRef, useEffect, useCallback } from 'react'

// 1. The popup component — drop this anywhere in your app
function HumoraPopup({ isOpen, onVerified, onClose }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isOpen || !window.humora || !containerRef.current) return

    window.humora.render(containerRef.current, {
      sitekey: import.meta.env.VITE_HUMORA_SITE_KEY,
      callback: (token) => onVerified(token),
      expiredCallback: () => {},
    })
  }, [isOpen])

  if (!isOpen) return null

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Card — stop clicks from closing */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 20, width: '100%',
          maxWidth: 400, overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px', borderBottom: '1px solid #F3F4F6',
          fontFamily: 'sans-serif', fontSize: 13, fontWeight: 600,
        }}>
          🖐 Humora · Human Verification
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9CA3AF' }}>
            ×
          </button>
        </div>

        {/* Widget mounts here */}
        <div ref={containerRef} />
      </div>
    </div>
  )
}

// 2. Use it in your login or signup form
function SignupForm() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [loading, setLoading]   = useState(false)

  // Step A: User clicks submit → show popup (don't submit yet)
  const handleSubmit = (e) => {
    e.preventDefault()
    setShowPopup(true)
  }

  // Step B: User passes verification → fire the real API call
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
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>
    </>
  )
}`}
        />

        {h2("What happens on the server", "server-side")}
        {p("Your server receives the token just like the inline widget — nothing changes there.")}
        <CodeBlock
          language="javascript"
          code={`// Node.js / Express — exact same verification code as inline widget
app.post('/api/signup', async (req, res) => {
  const { email, password, humora_token } = req.body

  // Verify the token
  const check = await fetch('https://api.humora.io/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token:   humora_token,
      sitekey: process.env.HUMORA_SITE_KEY,
    }),
  }).then(r => r.json())

  if (!check.success) {
    return res.status(400).json({ error: 'Verification required' })
  }

  await createUser(email, password)
  res.json({ success: true })
})`}
        />

        {h2("Where to use the popup", "where-to-use")}
        {p("The popup pattern works on any action where you want human verification. Recommended touchpoints:")}
        {[
          ["Login form", "Prevents credential stuffing attacks"],
          ["Signup form", "Stops fake account creation"],
          ["Forgot password", "Prevents email flooding / user enumeration"],
          ["Contact / support form", "Blocks spam submissions"],
          ["Comment / review submission", "Prevents fake reviews"],
          ["Account deletion", "Step-up verification before irreversible action"],
          ["API key generation", "Confirms a human is creating the key"],
          ["Checkout / payment", "Bot protection before high-value transactions"],
        ].map(([place, reason]) => (
          <div key={place} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 14, color: C.black, minWidth: 180 }}>{place}</span>
            <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 14, color: C.mid }}>{reason}</span>
          </div>
        ))}

        {h2("Environment variables", "env-vars")}
        {p("Keep your sitekey out of your code. Use environment variables:")}
        <CodeBlock
          language="bash"
          code={`# .env file (never commit this to git)
VITE_HUMORA_SITE_KEY=sk_live_yourkey   # frontend (Vite/React)
HUMORA_SITE_KEY=sk_live_yourkey        # backend (Node, Python, PHP, etc.)`}
        />
        <Callout type="danger">
          Never put your live sitekey directly in your HTML or JavaScript source code. Anyone who views your source can steal it.
          Use environment variables and keep your <code style={{ fontFamily: "monospace" }}>sk_live_</code> key server-side only.
        </Callout>

        {h2("Next steps", "next-steps")}
        <NextStepCards onNavigate={onNavigate} />
      </div>
    );

  // ── INTRODUCTION ─────────────────────────────────────────
  if (articleId === "introduction")
    return (
      <div className="docs-content">
        {h2("What is Humora?", "what-is")}
        {p(
          "Humora is a behavioral human verification widget — a drop-in replacement for reCAPTCHA that verifies humanity through emotionally intelligent questions instead of image puzzles."
        )}
        {p(
          'Instead of "click all the traffic lights", Humora asks things like "you said you too when the waiter said enjoy your meal — how long did you think about it?" Bots fail instantly. Humans answer before they finish reading.'
        )}

        {h2("Why not reCAPTCHA?", "why-not")}
        {ul([
          "30% of real users fail reCAPTCHA at least once",
          "Modern bots solve image puzzles with 97% accuracy",
          "Google owns all verification data that passes through it",
          "CAPTCHA friction causes up to 40% form abandonment",
          "You have no control over the experience or styling",
        ])}

        {h2("How Humora is different", "how-different")}
        {p(
          "Humora doesn't test for knowledge — it tests for humanity. Questions are drawn from 5 categories of lived human experience that AIs and bots simply haven't had:"
        )}
        {ul([
          "Sensory & Visceral — physical memory and sensory reactions",
          "Social Awkwardness — relatable micro-cringe moments",
          "Emotional Micro-decisions — small irrational human choices",
          "Nostalgia & Memory — universal childhood experiences",
          "Humor & Absurdity — reactions that require genuine human context",
        ])}
        <Callout type="tip">
          No option is ever wrong. Scoring is entirely behavioral — not
          correctness-based. Humans answer naturally. Bots pattern-match to
          "safe" neutral options and fail.
        </Callout>

        {h2("Integration", "integration")}
        {p(
          "Humora integrates exactly like reCAPTCHA. If you've used it before, you already know how to use Humora. One script tag, one div, one callback."
        )}
        <NextStepCards onNavigate={onNavigate} />
      </div>
    );

  // ── API VERIFY ───────────────────────────────────────────
  if (articleId === "verify")
    return (
      <div className="docs-content">
        {h2("POST /api/verify", "post-verify")}
        {p(
          "Verify a Humora token server-side. Always call this from your backend — never from the browser."
        )}

        <div
          style={{
            background: C.codeBg,
            borderRadius: 12,
            padding: "14px 20px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
          }}>
          <MethodBadge method="POST" />
          <code
            style={{
              fontFamily: "Courier New, monospace",
              fontSize: 14,
              color: "#e2e8f0",
            }}>
            https://api.humora.io/api/verify
          </code>
        </div>

        {h3("Request Body")}
        <CodeBlock
          language="json"
          code={`{
  "token":   "eyJhbGciOiJIUzI1NiJ9...",  // required
  "sitekey": "sk_live_x9k2mf3p"           // required
}`}
        />

        {h3("Success Response (200)")}
        <CodeBlock
          language="json"
          code={`{
  "success":   true,
  "score":     58,
  "verdict":   "pass",
  "timestamp": "2026-04-23T10:23:45Z",
  "sessionId": "hr_x9k2m"
}`}
        />

        {h3("Failure Response (400)")}
        <CodeBlock
          language="json"
          code={`{
  "success":    false,
  "error":      "expired-token",
  "errorCodes": ["expired-token"]
}`}
        />

        {h3("Error Codes")}
        {[
          ["invalid-token", "Token is malformed or signature mismatch"],
          ["expired-token", "Token is older than 5 minutes"],
          ["duplicate-token", "Token has already been used (replay attack)"],
          ["invalid-sitekey", "Sitekey not registered or domain mismatch"],
        ].map(([code, desc]) => (
          <div
            key={code}
            style={{
              display: "flex",
              gap: 16,
              padding: "10px 0",
              borderBottom: `1px solid ${C.border}`,
              alignItems: "flex-start",
            }}>
            <code
              style={{
                fontFamily: "Courier New, monospace",
                fontSize: 12,
                color: C.error,
                background: C.errorBg,
                padding: "2px 8px",
                borderRadius: 6,
                flexShrink: 0,
              }}>
              {code}
            </code>
            <span
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 14,
                color: C.dark,
              }}>
              {desc}
            </span>
          </div>
        ))}
        <Callout type="danger" style={{ marginTop: 20 }}>
          Never call /api/verify from the browser. Your secret key must stay on
          your server.
        </Callout>
      </div>
    );

  // ── SCORING ──────────────────────────────────────────────
  if (articleId === "scoring")
    return (
      <div className="docs-content">
        {h2("Scoring Methodology", "scoring")}
        {p(
          "Humora never scores correctness — it scores humanity. Three independent signals are measured simultaneously and combined into a single confidence score."
        )}

        {h3("Signal Breakdown")}
        {[
          [
            "Answer Score",
            "50 pts",
            "~71%",
            "10 pts × 5 questions. Based on how distinctly human each chosen option is — not whether it's correct.",
          ],
          [
            "Timing Bonus",
            "10 pts",
            "~14%",
            "2 pts per question. Measures response time within the human zone (800ms–4000ms).",
          ],
          [
            "Behavior Score",
            "10 pts",
            "~14%",
            "Session-wide. Measures mouse entropy, option hover patterns, and click precision.",
          ],
        ].map(([name, pts, weight, desc]) => (
          <div
            key={name}
            style={{
              background: "#F9FAFB",
              borderRadius: 12,
              padding: 20,
              marginBottom: 12,
              border: `1px solid ${C.border}`,
            }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}>
              <span
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  color: C.black,
                }}>
                {name}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                    color: C.indigo,
                  }}>
                  {pts}
                </span>
                <span
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontSize: 13,
                    color: C.muted,
                  }}>
                  {weight}
                </span>
              </div>
            </div>
            <p
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 14,
                color: C.dark,
                lineHeight: 1.6,
                margin: 0,
              }}>
              {desc}
            </p>
          </div>
        ))}

        {h3("Timing Zones")}
        {[
          ["< 300ms", "Bot flag", C.error, "#FEF2F2", "0 pts"],
          ["300–800ms", "Suspicious", C.warning, "#FFFBEB", "1 pt"],
          ["800–4,000ms", "Human zone ✓", C.success, "#ECFDF5", "2 pts"],
          ["4,000–8,000ms", "Thoughtful", C.success, "#ECFDF5", "1 pt"],
          ["> 8,000ms", "Distracted", C.muted, "#F9FAFB", "0 pts"],
        ].map(([range, label, color, bg, pts]) => (
          <div
            key={range}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: bg,
              borderRadius: 8,
              padding: "10px 16px",
              marginBottom: 6,
              border: `1px solid ${C.border}`,
            }}>
            <code
              style={{
                fontFamily: "monospace",
                fontSize: 13,
                color: C.dark,
                fontWeight: 600,
              }}>
              {range}
            </code>
            <span
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 13,
                color,
                fontWeight: 600,
              }}>
              {label}
            </span>
            <span
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 13,
                color: C.muted,
              }}>
              {pts}
            </span>
          </div>
        ))}

        {h3("Verdict Thresholds")}
        {[
          ["≥ 50", "PASS", C.success, "#ECFDF5", "JWT token issued"],
          [
            "35–49",
            "BORDERLINE",
            C.warning,
            "#FFFBEB",
            "1 bonus question shown",
          ],
          ["< 35", "FAIL", C.error, "#FEF2F2", "Verification denied"],
        ].map(([score, verdict, color, bg, action]) => (
          <div
            key={verdict}
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              background: bg,
              borderRadius: 8,
              padding: "12px 16px",
              marginBottom: 6,
              border: `1px solid ${C.border}`,
            }}>
            <code
              style={{
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize: 14,
                color,
                minWidth: 48,
              }}>
              {score}
            </code>
            <span
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color,
                minWidth: 100,
              }}>
              {verdict}
            </span>
            <span
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 13,
                color: C.dark,
              }}>
              {action}
            </span>
          </div>
        ))}
      </div>
    );

  // ── GDPR ─────────────────────────────────────────────────
  if (articleId === "gdpr")
    return (
      <div className="docs-content">
        {h2("GDPR Compliance", "gdpr")}
        {p(
          "Humora was built privacy-first from day one. Verification works without collecting, storing, or transmitting any personally identifiable information."
        )}

        {h3("What Humora collects")}
        <Callout type="tip">
          Nothing that identifies a person. Only behavioral signals that exist
          for the duration of the verification session.
        </Callout>
        {ul([
          "Response timing per question (milliseconds, not timestamps)",
          "Mouse movement entropy score (a number, not coordinates)",
          "Answer pattern score (a number, not which answers were chosen)",
          "A session ID (random string, not tied to any user)",
        ])}

        {h3("What Humora does NOT collect")}
        {ul([
          "No IP addresses stored",
          "No cookies set",
          "No browser fingerprinting",
          "No cross-site tracking",
          "No names, emails, or any user data",
          "No data sent to Google or any third party",
        ])}

        {h3("Data retention")}
        {p(
          "Verification session data exists only in memory during the verification itself. Once the JWT token is issued, all session data is discarded. Tokens expire after 5 minutes and used tokens are immediately invalidated."
        )}

        {h3("Self-hosting")}
        {p(
          "For maximum data sovereignty, Humora can be fully self-hosted. Your widget and API server run entirely within your own infrastructure. Zero data ever leaves your servers."
        )}
        <Callout type="note">
          Enterprise plans include full self-hosting support with deployment
          guides for AWS, GCP, Azure, and bare metal.
        </Callout>
      </div>
    );

  // ── REACT INTEGRATION ─────────────────────────────────────
  if (articleId === "react-vite")
    return (
      <div className="docs-content">
        {h2("React + Vite Integration", "react-vite")}
        {p(
          "Use Humora in any React application with a simple component wrapper. Works with Vite, Create React App, and any other React setup."
        )}

        {h3("Option A — Script tag + useEffect (simplest)")}
        {p(
          "Load the Humora script in your index.html and use it via window.humora in a React component."
        )}
        <CodeBlock
          language="html"
          code={`<!-- public/index.html -->
<script
  src="https://widget.humora.io/humora.min.js"
  async
  defer
></script>`}
        />
        <CodeBlock
          language="jsx"
          code={`// src/components/HumoraWidget.jsx
import { useEffect, useRef } from 'react'

export function HumoraWidget({ onVerified, onExpired }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!window.humora || !containerRef.current) return

    window.humora.render(containerRef.current.id, {
      sitekey: import.meta.env.VITE_HUMORA_SITE_KEY,
      callback: (token) => onVerified?.(token),
      expiredCallback: () => onExpired?.(),
    })

    return () => {
      window.humora.reset(containerRef.current?.id)
    }
  }, [])

  return <div id="humora-widget-container" ref={containerRef} />
}

// Usage in a form:
function SignupForm() {
  const [token, setToken] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) return

    await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify({ token, ...formData }),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" />
      <HumoraWidget
        onVerified={setToken}
        onExpired={() => setToken(null)}
      />
      <button disabled={!token}>Create Account</button>
    </form>
  )
}`}
        />

        {h3("Option B — postMessage listener (iframe embed)")}
        {p(
          "If embedding as an iframe, listen for postMessage events from the widget."
        )}
        <CodeBlock
          language="jsx"
          code={`import { useEffect, useState } from 'react'

function useHumoraVerification() {
  const [token,    setToken]    = useState(null)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const handler = (event) => {
      if (event.data?.source !== 'humora') return
      if (event.data.verified) {
        setToken(event.data.token)
        setVerified(true)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  return { token, verified }
}`}
        />
        <Callout type="note">
          For most React apps, Option A is simpler and recommended. Use Option B
          only if you need strict iframe isolation.
        </Callout>
      </div>
    );

  // ── DEFAULT — placeholder for unimplemented pages ─────────
  const found = SEARCH_DATA.find((d) => d.id === articleId);
  return (
    <div className="docs-content">
      {h2(found?.title || "Documentation", "content")}
      {p(`This section covers ${found?.snippet || "this topic"}.`)}
      <Callout type="note">
        Full documentation for this section is being expanded. Check back soon
        or view the Quick Start guide to get up and running.
      </Callout>
      <NextStepCards onNavigate={onNavigate} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SEARCH MODAL
// ══════════════════════════════════════════════════════════════
export function SearchModal({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    setResults(
      SEARCH_DATA.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.section.toLowerCase().includes(q) ||
          d.snippet.toLowerCase().includes(q)
      ).slice(0, 8)
    );
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const highlight = (text) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.trim()})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          style={{ background: "#FEF9C3", color: C.black, borderRadius: 2 }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 1000,
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -16 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: "15%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "90%",
              maxWidth: 560,
              background: "white",
              borderRadius: 20,
              boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
              overflow: "hidden",
              zIndex: 1001,
            }}>
            {/* Search Input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "0 20px",
                borderBottom: `1px solid ${C.border}`,
              }}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.muted}
                strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documentation..."
                style={{
                  flex: 1,
                  height: 56,
                  border: "none",
                  outline: "none",
                  fontFamily: "Archivo, sans-serif",
                  fontSize: 16,
                  color: C.black,
                  background: "transparent",
                }}
              />
              <kbd
                style={{
                  background: "#F3F4F6",
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  padding: "2px 8px",
                  fontFamily: "Archivo, sans-serif",
                  fontSize: 11,
                  color: C.muted,
                }}>
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              {results.length > 0 ? (
                results.map((r, i) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      onNavigate(r.id);
                      onClose();
                    }}
                    style={{
                      width: "100%",
                      padding: "14px 20px",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      borderBottom:
                        i < results.length - 1
                          ? `1px solid ${C.border}`
                          : "none",
                      transition: "background 120ms",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = C.indigoL)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "none")
                    }>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                      }}>
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={C.muted}
                        strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                      </svg>
                      <span
                        style={{
                          fontFamily: "Archivo, sans-serif",
                          fontWeight: 600,
                          fontSize: 14,
                          color: C.black,
                        }}>
                        {highlight(r.title)}
                      </span>
                      <span
                        style={{
                          fontFamily: "Archivo, sans-serif",
                          fontSize: 11,
                          color: C.indigo,
                          background: C.indigoL,
                          padding: "1px 8px",
                          borderRadius: 999,
                        }}>
                        {r.section}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "Archivo, sans-serif",
                        fontSize: 13,
                        color: C.muted,
                        margin: 0,
                        lineHeight: 1.5,
                      }}>
                      {highlight(r.snippet)}
                    </p>
                  </button>
                ))
              ) : query ? (
                <div style={{ padding: "32px 20px", textAlign: "center" }}>
                  <p
                    style={{
                      fontFamily: "Archivo, sans-serif",
                      fontSize: 14,
                      color: C.muted,
                    }}>
                    No results for "
                    <strong style={{ color: C.black }}>{query}</strong>"
                  </p>
                </div>
              ) : (
                <div style={{ padding: "20px" }}>
                  <p
                    style={{
                      fontFamily: "Archivo, sans-serif",
                      fontSize: 12,
                      color: C.muted,
                      marginBottom: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}>
                    Quick Links
                  </p>
                  {SEARCH_DATA.slice(0, 5).map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        onNavigate(r.id);
                        onClose();
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "8px 12px",
                        background: "none",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        borderRadius: 8,
                        fontFamily: "Archivo, sans-serif",
                        fontSize: 14,
                        color: C.dark,
                        transition: "background 120ms",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = C.indigoL)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "none")
                      }>
                      {r.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════
// DOCS SIDEBAR
// ══════════════════════════════════════════════════════════════
export function DocsSidebar({ activeId, onNavigate }) {
  return (
    <div
      className="docs-sidebar"
      style={{
        position: "fixed",
        top: 64,
        left: 0,
        width: 260,
        height: "calc(100vh - 64px)",
        background: "white",
        borderRight: `1px solid ${C.border}`,
        overflowY: "auto",
        padding: "24px 12px",
        zIndex: 50,
      }}>
      {/* Version badge */}
      <div
        style={{
          background: C.indigoL,
          color: C.indigo,
          borderRadius: 8,
          padding: "4px 10px",
          display: "inline-block",
          marginBottom: 20,
          fontFamily: "Archivo, sans-serif",
          fontWeight: 600,
          fontSize: 11,
          border: `1px solid #C7D2FE`,
        }}>
        v1.0 · Stable
      </div>

      {NAV_SECTIONS.map((section) => (
        <div key={section.title} style={{ marginBottom: 28 }}>
          <p
            style={{
              fontFamily: "Archivo, sans-serif",
              fontWeight: 700,
              fontSize: 10,
              color: C.muted,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "0 8px",
              marginBottom: 6,
            }}>
            {section.title}
          </p>

          {section.items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "7px 10px",
                  background: isActive ? C.indigoL : "none",
                  border: "none",
                  borderLeft: isActive
                    ? `3px solid ${C.indigo}`
                    : "3px solid transparent",
                  borderRadius: isActive ? "0 8px 8px 0" : 8,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  fontFamily: "Archivo, sans-serif",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 13,
                  color: isActive ? C.indigo : C.dark,
                  transition: "all 150ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = C.indigo;
                    e.currentTarget.style.background = "#F9FAFB";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = C.dark;
                    e.currentTarget.style.background = "none";
                  }
                }}>
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      fontFamily: "Archivo, sans-serif",
                      fontSize: 10,
                      fontWeight: 600,
                      background: isActive ? C.indigo : "#E5E7EB",
                      color: isActive ? "white" : C.mid,
                      padding: "1px 6px",
                      borderRadius: 999,
                      flexShrink: 0,
                    }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ON THIS PAGE SIDEBAR (right)
// ══════════════════════════════════════════════════════════════
const ON_PAGE_SECTIONS = {
  "quick-start": [
    "What you need",
    "Get your sitekey",
    "Choose style",
    "Add the script",
    "Add the widget",
    "Verify server-side",
    "Test it",
    "Next steps",
  ],
  "popup-modal": [
    "How it works",
    "Plain HTML",
    "React",
    "Server-side",
    "Where to use",
    "Environment vars",
    "Next steps",
  ],
  introduction: [
    "What is Humora?",
    "Why not reCAPTCHA?",
    "How Humora is different",
    "Integration",
  ],
  verify: [
    "Request Body",
    "Success Response",
    "Failure Response",
    "Error Codes",
  ],
  scoring: ["Signal Breakdown", "Timing Zones", "Verdict Thresholds"],
  gdpr: [
    "What Humora collects",
    "What Humora does NOT collect",
    "Data retention",
    "Self-hosting",
  ],
  "react-vite": ["Script tag + useEffect", "postMessage listener"],
};

function OnThisPage({ articleId }) {
  const sections = ON_PAGE_SECTIONS[articleId];
  if (!sections) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 88,
        right: 32,
        width: 180,
      }}>
      <p
        style={{
          fontFamily: "Archivo, sans-serif",
          fontSize: 11,
          fontWeight: 700,
          color: C.muted,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 10,
        }}>
        On this page
      </p>
      {sections.map((s, i) => (
        <p
          key={i}
          style={{
            fontFamily: "Archivo, sans-serif",
            fontSize: 12,
            color: C.muted,
            lineHeight: 1.6,
            marginBottom: 4,
            cursor: "pointer",
            transition: "color 120ms",
          }}
          onMouseEnter={(e) => (e.target.style.color = C.indigo)}
          onMouseLeave={(e) => (e.target.style.color = C.muted)}>
          {s}
        </p>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN DOCS PAGE
// ══════════════════════════════════════════════════════════════
export default function DocsPage() {
  const { slug } = useParams();
  const allItemIds = NAV_SECTIONS.flatMap((s) => s.items.map((i) => i.id));
  const initialId = slug && allItemIds.includes(slug) ? slug : "quick-start";
  const [activeId, setActiveId] = useState(initialId);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navShadow, setNavShadow] = useState(false);

  // current article metadata
  const allItems = NAV_SECTIONS.flatMap((s) => s.items);
  const current = allItems.find((i) => i.id === activeId) || allItems[0];

  // breadcrumb section
  const breadSection = NAV_SECTIONS.find((s) =>
    s.items.some((i) => i.id === activeId)
  );

  const navigate = (id) => {
    setActiveId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // CMD+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // scroll shadow
  useEffect(() => {
    const handler = () => setNavShadow(window.scrollY > 0);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      {/* ── TOP NAV BAR ─────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          background: "white",
          zIndex: 100,
          borderBottom: `1px solid ${C.border}`,
          boxShadow: navShadow ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: 24,
          transition: "box-shadow 200ms",
        }}>
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            flexShrink: 0,
          }}>
          <FingerprintIcon size={22} />
          <span
            style={{
              fontFamily: "Archivo, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: C.black,
            }}>
            Humora
          </span>
          <span
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 11,
              color: C.muted,
              background: "#F3F4F6",
              padding: "1px 6px",
              borderRadius: 4,
              marginLeft: 2,
            }}>
            Docs
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
          {["Features", "Integrations", "Pricing"].map((l) => (
            <Link
              key={l}
              to={`/${l.toLowerCase()}`}
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 14,
                color: C.dark,
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: 8,
                transition: "all 120ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = C.indigo;
                e.currentTarget.style.background = C.indigoL;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = C.dark;
                e.currentTarget.style.background = "none";
              }}>
              {l}
            </Link>
          ))}
        </div>

        {/* Search bar — center */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: 240,
              height: 36,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              background: "#F9FAFB",
              cursor: "pointer",
              padding: "0 12px",
              fontFamily: "Archivo, sans-serif",
              fontSize: 13,
              color: C.muted,
              transition: "all 150ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = C.indigo;
              e.currentTarget.style.boxShadow = "0 0 0 3px #EEF2FF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.boxShadow = "none";
            }}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke={C.muted}
              strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Search docs...
            <kbd
              style={{
                marginLeft: "auto",
                background: "#E5E7EB",
                border: `1px solid ${C.border}`,
                borderRadius: 4,
                padding: "1px 5px",
                fontFamily: "Archivo, sans-serif",
                fontSize: 10,
                color: C.muted,
              }}>
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right CTAs */}
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <Link
            to="/login"
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 14,
              color: C.dark,
              textDecoration: "none",
              padding: "8px 14px",
              borderRadius: 10,
              transition: "all 120ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.indigo)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.dark)}>
            Sign In
          </Link>
          <Link
            to="/signup"
            style={{
              fontFamily: "Archivo, sans-serif",
              fontWeight: 600,
              fontSize: 14,
              color: "white",
              textDecoration: "none",
              padding: "8px 16px",
              background: C.indigo,
              borderRadius: 10,
              transition: "all 150ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C.indigoD)}
            onMouseLeave={(e) => (e.currentTarget.style.background = C.indigo)}>
            Start Free Trial
          </Link>
        </div>
      </div>

      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <DocsSidebar activeId={activeId} onNavigate={navigate} />

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <div
        style={{
          marginLeft: 260,
          marginTop: 64,
          minHeight: "calc(100vh - 64px)",
          background: "white",
        }}>
        <div
          style={{
            maxWidth: 720,
            padding: "48px 64px 80px",
          }}>
          {/* Breadcrumb */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 24,
            }}>
            {[
              "Docs",
              breadSection?.title?.replace(/ /g, " ") || "Getting Started",
              current?.label,
            ].map((crumb, i, arr) => (
              <span
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontSize: 13,
                    color: i === arr.length - 1 ? C.dark : C.muted,
                    cursor: i < arr.length - 1 ? "pointer" : "default",
                    fontWeight: i === arr.length - 1 ? 500 : 400,
                  }}
                  onClick={() => i === 0 && navigate("quick-start")}>
                  {crumb}
                </span>
                {i < arr.length - 1 && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M4.5 3l3 3-3 3"
                      stroke={C.muted}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            ))}
          </div>

          {/* Article title */}
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}>
            <h1
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 800,
                fontSize: 40,
                color: C.black,
                lineHeight: 1.2,
                marginBottom: 10,
              }}>
              {current?.label}
            </h1>

            {/* Meta */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 28,
              }}>
              <span
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontSize: 12,
                  color: C.muted,
                }}>
                5 min read
              </span>
              <span style={{ color: C.border }}>·</span>
              <span
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontSize: 12,
                  color: C.muted,
                }}>
                Last updated April 2026
              </span>
            </div>

            {/* Lead */}
            {LEAD_TEXT[activeId] && (
              <p
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontSize: 17,
                  color: C.dark,
                  lineHeight: 1.8,
                  marginBottom: 36,
                  borderLeft: `3px solid ${C.indigo}`,
                  background: C.indigoL,
                  borderRadius: "0 8px 8px 0",
                  padding: "12px 16px",
                }}>
                {LEAD_TEXT[activeId]}
              </p>
            )}

            {/* Article body */}
            <ArticleContent articleId={activeId} onNavigate={navigate} />

            {/* Edit on GitHub */}
            <div
              style={{
                borderTop: `1px solid ${C.border}`,
                paddingTop: 32,
                marginTop: 40,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <a
                href={`https://github.com/dwakshar/humora/edit/main/docs/${activeId}.md`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontSize: 13,
                  color: C.indigo,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit this page on GitHub →
              </a>
              <div style={{ display: "flex", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontSize: 12,
                    color: C.muted,
                  }}>
                  Was this helpful?
                </span>
                {["👍", "👎"].map((emoji) => (
                  <button
                    key={emoji}
                    style={{
                      background: "#F3F4F6",
                      border: "none",
                      borderRadius: 8,
                      padding: "4px 10px",
                      cursor: "pointer",
                      fontSize: 14,
                      transition: "background 120ms",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = C.indigoL)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#F3F4F6")
                    }>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── ON THIS PAGE (right sidebar) ────────────────── */}
      <OnThisPage articleId={activeId} />

      {/* ── SEARCH MODAL ────────────────────────────────── */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigate}
      />
    </>
  );
}
