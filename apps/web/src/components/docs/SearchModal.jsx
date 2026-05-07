import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const SEARCH_INDEX = [
  {
    title: "Quick Start",
    section: "Getting Started",
    slug: "quick-start",
    snippet: "Get Humora running on your site in under 5 minutes.",
  },
  {
    title: "Introduction",
    section: "Getting Started",
    slug: "introduction",
    snippet: "Humora is a human verification widget that replaces CAPTCHAs.",
  },
  {
    title: "How It Works",
    section: "Getting Started",
    slug: "how-it-works",
    snippet: "Behavioral scoring, question engine, and JWT token lifecycle.",
  },
  {
    title: "Getting Your Sitekey",
    section: "Getting Started",
    slug: "sitekey",
    snippet: "Generate a sitekey from the dashboard under My Sites.",
  },
  {
    title: "HTML / Vanilla JS",
    section: "Integration Guides",
    slug: "html",
    snippet: "Add a script tag and a widget div to your HTML page.",
  },
  {
    title: "React + Vite",
    section: "Integration Guides",
    slug: "react",
    snippet: "Use the useHumora hook or HumoraWidget component.",
  },
  {
    title: "Next.js App Router",
    section: "Integration Guides",
    slug: "nextjs",
    snippet: "Client component with dynamic import and ssr: false.",
  },
  {
    title: "Vue / Nuxt",
    section: "Integration Guides",
    slug: "vue",
    snippet: "Import humora.min.js and call humora.render() on mount.",
  },
  {
    title: "WordPress",
    section: "Integration Guides",
    slug: "wordpress",
    snippet: "Enqueue the script with wp_enqueue_script in functions.php.",
  },
  {
    title: "Webflow",
    section: "Integration Guides",
    slug: "webflow",
    snippet: "Paste the script tag in Project Settings > Custom Code.",
  },
  {
    title: "Laravel / PHP",
    section: "Integration Guides",
    slug: "laravel",
    snippet: "Verify the token server-side using Humora's REST API.",
  },
  {
    title: "Django / Python",
    section: "Integration Guides",
    slug: "django",
    snippet: "Use requests.post to verify the token from your view.",
  },
  {
    title: "Ruby on Rails",
    section: "Integration Guides",
    slug: "rails",
    snippet: "Verify with Net::HTTP in a before_action callback.",
  },
  {
    title: "humora.render()",
    section: "Widget Reference",
    slug: "api-render",
    snippet: "Renders the widget inside a target element with options.",
  },
  {
    title: "humora.getResponse()",
    section: "Widget Reference",
    slug: "api-get-response",
    snippet: "Returns the current JWT token or null if not yet verified.",
  },
  {
    title: "humora.reset()",
    section: "Widget Reference",
    slug: "api-reset",
    snippet: "Resets the widget to initial state, clears any stored token.",
  },
  {
    title: "humora.ready()",
    section: "Widget Reference",
    slug: "api-ready",
    snippet: "Fires a callback when the widget script has fully loaded.",
  },
  {
    title: "Configuration Options",
    section: "Widget Reference",
    slug: "config",
    snippet: "theme, locale, callback, errorCallback, size, tabindex.",
  },
  {
    title: "postMessage Events",
    section: "Widget Reference",
    slug: "postmessage",
    snippet: "Listen for humora:pass, humora:fail, humora:error events.",
  },
  {
    title: "Error Handling",
    section: "Widget Reference",
    slug: "errors",
    snippet: "Handle network errors, invalid sitekeys, and expired tokens.",
  },
  {
    title: "Authentication",
    section: "API Reference",
    slug: "auth",
    snippet: "Pass your secret key in the Authorization: Bearer header.",
  },
  {
    title: "POST /api/verify",
    section: "API Reference",
    slug: "verify",
    snippet:
      "Verify a token returned by the widget. Returns score and verdict.",
  },
  {
    title: "POST /api/register",
    section: "API Reference",
    slug: "register",
    snippet: "Register a new sitekey for a domain you own.",
  },
  {
    title: "GET /api/health",
    section: "API Reference",
    slug: "health",
    snippet: 'Check API availability. Returns { status: "ok" }.',
  },
  {
    title: "Error Codes",
    section: "API Reference",
    slug: "error-codes",
    snippet: "INVALID_TOKEN, EXPIRED_TOKEN, DOMAIN_MISMATCH, RATE_LIMITED.",
  },
  {
    title: "Rate Limits",
    section: "API Reference",
    slug: "rate-limits",
    snippet:
      "Free: 1,000 verifications/day. Pro: 100,000/day. Enterprise: unlimited.",
  },
  {
    title: "Webhooks",
    section: "API Reference",
    slug: "webhooks",
    snippet: "Receive real-time event payloads for every verification attempt.",
  },
  {
    title: "Scoring Methodology",
    section: "Security",
    slug: "scoring",
    snippet:
      "Answer quality, timing entropy, behavioral signals combined into a score.",
  },
  {
    title: "JWT Token Lifecycle",
    section: "Security",
    slug: "jwt",
    snippet: "Tokens expire after 5 minutes. Each token is single-use.",
  },
  {
    title: "Replay Protection",
    section: "Security",
    slug: "replay",
    snippet:
      "Every token is burned on first verification to prevent replay attacks.",
  },
  {
    title: "Self-hosting Guide",
    section: "Security",
    slug: "self-hosting",
    snippet: "Run the Humora server on your own infrastructure.",
  },
  {
    title: "GDPR Compliance",
    section: "Security",
    slug: "gdpr",
    snippet: "No cookies, no fingerprinting. GDPR, CCPA, and PECR compliant.",
  },
  {
    title: "v1.0.0",
    section: "Changelog",
    slug: "changelog",
    snippet: "Initial public release. Widget, API, and dashboard.",
  },
];

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark
        style={{
          backgroundColor: "#EEF2FF",
          color: "#4F46E5",
          borderRadius: 3,
          padding: "0 2px",
        }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const results =
    query.trim().length < 1
      ? SEARCH_INDEX.slice(0, 8)
      : SEARCH_INDEX.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.section.toLowerCase().includes(query.toLowerCase()) ||
            item.snippet.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const go = useCallback(
    (slug) => {
      navigate(`/docs/${slug}`);
      onClose();
    },
    [navigate, onClose]
  );

  useEffect(() => {
    const handler = (e) => {
      if (!open) return;
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && results[activeIdx]) {
        go(results[activeIdx].slug);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, results, activeIdx, go, onClose]);

  useEffect(() => {
    const el = listRef.current?.children[activeIdx];
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          />

          {/* Modal */}
          <motion.div
            key="search-modal"
            initial={{ opacity: 0, scale: 0.95, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -12 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: "15%",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 201,
              width: 560,
              maxWidth: "calc(100vw - 32px)",
              backgroundColor: "#fff",
              borderRadius: 16,
              boxShadow:
                "0 24px 64px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}>
            {/* Search input */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "0 20px",
                borderBottom: "1px solid #E5E7EB",
                height: 56,
              }}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documentation..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontFamily: "Archivo, sans-serif",
                  fontSize: 16,
                  color: "#0F0F0F",
                  backgroundColor: "transparent",
                  "::placeholder": { color: "#9CA3AF" },
                }}
              />
              <kbd
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontSize: 11,
                  color: "#9CA3AF",
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: 6,
                  padding: "2px 7px",
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                }}>
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} style={{ maxHeight: 400, overflowY: "auto" }}>
              {results.length === 0 ? (
                <div
                  style={{
                    padding: "32px 24px",
                    textAlign: "center",
                    fontFamily: "Archivo, sans-serif",
                    fontSize: 14,
                    color: "#9CA3AF",
                  }}>
                  No results for "{query}"
                </div>
              ) : (
                results.map((item, i) => (
                  <button
                    key={item.slug}
                    onClick={() => go(item.slug)}
                    onMouseEnter={() => setActiveIdx(i)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                      width: "100%",
                      padding: "14px 20px",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      backgroundColor:
                        i === activeIdx ? "#EEF2FF" : "transparent",
                      borderBottom: "1px solid #F3F4F6",
                      transition: "background 100ms",
                    }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}>
                      <span
                        style={{
                          fontFamily: "Archivo, sans-serif",
                          fontWeight: 600,
                          fontSize: 14,
                          color: "#0F0F0F",
                        }}>
                        {highlight(item.title, query)}
                      </span>
                      <span
                        style={{
                          fontFamily: "Archivo, sans-serif",
                          fontSize: 11,
                          color: "#9CA3AF",
                          backgroundColor: "#F3F4F6",
                          borderRadius: 6,
                          padding: "2px 8px",
                          whiteSpace: "nowrap",
                          marginLeft: 8,
                        }}>
                        {item.section}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: "Archivo, sans-serif",
                        fontSize: 13,
                        color: "#6B7280",
                        lineHeight: 1.4,
                      }}>
                      {highlight(item.snippet, query)}
                    </span>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "10px 20px",
                borderTop: "1px solid #F3F4F6",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}>
              {[
                { keys: ["↑", "↓"], label: "navigate" },
                { keys: ["↵"], label: "select" },
                { keys: ["ESC"], label: "close" },
              ].map(({ keys, label }) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {keys.map((k) => (
                    <kbd
                      key={k}
                      style={{
                        fontFamily: "Archivo, sans-serif",
                        fontSize: 10,
                        color: "#9CA3AF",
                        backgroundColor: "#F9FAFB",
                        border: "1px solid #E5E7EB",
                        borderRadius: 4,
                        padding: "1px 5px",
                      }}>
                      {k}
                    </kbd>
                  ))}
                  <span
                    style={{
                      fontFamily: "Archivo, sans-serif",
                      fontSize: 11,
                      color: "#9CA3AF",
                    }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
