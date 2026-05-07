import { Link, useParams } from "react-router-dom";

const NAV = [
  {
    group: "GETTING STARTED",
    items: [
      { label: "Introduction", slug: "introduction" },
      { label: "Quick Start (5 min)", slug: "quick-start" },
      { label: "How It Works", slug: "how-it-works" },
      { label: "Getting Your Sitekey", slug: "sitekey" },
    ],
  },
  {
    group: "INTEGRATION GUIDES",
    items: [
      { label: "HTML / Vanilla JS", slug: "html" },
      { label: "React + Vite", slug: "react" },
      { label: "Next.js App Router", slug: "nextjs" },
      { label: "Vue / Nuxt", slug: "vue" },
      { label: "WordPress", slug: "wordpress" },
      { label: "Webflow", slug: "webflow" },
      { label: "Laravel / PHP", slug: "laravel" },
      { label: "Django / Python", slug: "django" },
      { label: "Ruby on Rails", slug: "rails" },
    ],
  },
  {
    group: "WIDGET REFERENCE",
    items: [
      { label: "humora.render()", slug: "api-render" },
      { label: "humora.getResponse()", slug: "api-get-response" },
      { label: "humora.reset()", slug: "api-reset" },
      { label: "humora.ready()", slug: "api-ready" },
      { label: "Configuration options", slug: "config" },
      { label: "postMessage events", slug: "postmessage" },
      { label: "Error handling", slug: "errors" },
    ],
  },
  {
    group: "API REFERENCE",
    items: [
      { label: "Authentication", slug: "auth" },
      { label: "POST /api/verify", slug: "verify" },
      { label: "POST /api/register", slug: "register" },
      { label: "GET /api/health", slug: "health" },
      { label: "Error codes", slug: "error-codes" },
      { label: "Rate limits", slug: "rate-limits" },
      { label: "Webhooks", slug: "webhooks" },
    ],
  },
  {
    group: "SECURITY",
    items: [
      { label: "Scoring methodology", slug: "scoring" },
      { label: "JWT token lifecycle", slug: "jwt" },
      { label: "Replay protection", slug: "replay" },
      { label: "Self-hosting guide", slug: "self-hosting" },
      { label: "GDPR compliance", slug: "gdpr" },
    ],
  },
  {
    group: "CHANGELOG",
    items: [{ label: "v1.0.0", slug: "changelog" }],
  },
];

export default function DocsSidebar() {
  const { slug } = useParams();
  const active = slug || "quick-start";

  return (
    <aside
      style={{
        width: 260,
        position: "fixed",
        top: 64,
        left: 0,
        bottom: 0,
        backgroundColor: "#fff",
        borderRight: "1px solid #E5E7EB",
        overflowY: "auto",
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
      }}>
      {/* Version badge */}
      <div style={{ padding: "20px 20px 12px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "Archivo, sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: "#4F46E5",
            backgroundColor: "#EEF2FF",
            border: "1px solid #C7D2FE",
            borderRadius: 20,
            padding: "4px 10px",
            letterSpacing: "0.03em",
          }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#4F46E5",
              display: "inline-block",
            }}
          />
          v1.0
        </span>
      </div>

      {/* Nav tree */}
      <nav style={{ padding: "4px 12px 32px", flex: 1 }}>
        {NAV.map(({ group, items }) => (
          <div key={group} style={{ marginBottom: 20 }}>
            <div
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: "#9CA3AF",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "0 8px",
                marginBottom: 4,
              }}>
              {group}
            </div>
            {items.map(({ label, slug: itemSlug }) => {
              const isActive = active === itemSlug;
              return (
                <Link
                  key={itemSlug}
                  to={`/docs/${itemSlug}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "7px 10px",
                    marginBottom: 1,
                    borderRadius: 8,
                    fontFamily: "Archivo, sans-serif",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#4F46E5" : "#374151",
                    backgroundColor: isActive ? "#EEF2FF" : "transparent",
                    textDecoration: "none",
                    borderLeft: isActive
                      ? "3px solid #4F46E5"
                      : "3px solid transparent",
                    transition: "all 120ms",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#4F46E5";
                      e.currentTarget.style.backgroundColor = "#F5F3FF";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#374151";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}>
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
