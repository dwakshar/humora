import { Link } from "react-router-dom";

const FingerprintIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" fill="#fff" />
    <path d="M12 7a4 4 0 0 1 4 4c0 2.2-.8 4.2-2.1 5.8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 11a4 4 0 0 1 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5 11a7 7 0 0 1 14 0c0 2.4-.7 4.6-1.8 6.4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M2 11C2 5.48 6.48 1 12 1s10 4.48 10 10c0 2.3-.77 4.42-2.07 6.1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4.5 16.5C3.56 14.9 3 13.01 3 11" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const COLS = [
  {
    title: "Product",
    links: [
      { label: "How It Works",         href: "/#how-it-works" },
      { label: "Question Engine",       href: "/#how-it-works" },
      { label: "Multi-Signal Scoring",  href: "/#how-it-works" },
      { label: "Analytics Dashboard",   href: "/dashboard/analytics" },
      { label: "Pricing",               href: "/pricing" },
      { label: "Live Demo",             href: "/demo" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Quickstart Guide",  href: "/docs" },
      { label: "Widget Library",    href: "/docs" },
      { label: "API Reference",     href: "/docs" },
      { label: "GitHub",            href: "https://github.com/dwakshar/humora", external: true },
      { label: "Changelog",         href: "/changelog" },
      { label: "Status Page",       href: "/status" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Login & Signup",    href: "/solutions/auth" },
      { label: "Form Protection",   href: "/solutions/forms" },
      { label: "API & Bot Defense", href: "/solutions/api" },
      { label: "E-commerce",        href: "/solutions/ecommerce" },
      { label: "SaaS Platforms",    href: "/solutions/saas" },
      { label: "Enterprise",        href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About",           href: "/about" },
      { label: "Contact Us",      href: "/contact" },
      { label: "Community",       href: "https://discord.gg/humora", external: true },
      { label: "Privacy Policy",  href: "/privacy" },
      { label: "Terms of Service",href: "/terms" },
    ],
  },
];

const SOCIALS = [
  {
    label: "Twitter / X",
    href: "https://x.com/humora_hq",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.261 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/dwakshar/humora",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "Discord",
    href: "https://discord.gg/humora",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
      </svg>
    ),
  },
];

function ColLink({ href, external, children }) {
  const baseStyle = {
    fontFamily: "Archivo, sans-serif",
    fontWeight: 400,
    fontSize: 13.5,
    color: "#6B7280",
    textDecoration: "none",
    display: "block",
    padding: "5px 0",
    transition: "color 150ms ease",
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        style={baseStyle}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}>
        {children}
      </a>
    );
  }

  return (
    <Link
      to={href}
      style={baseStyle}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}>
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0A0A0F", padding: "72px 0 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
        {/* Top grid — brand + 4 columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.8fr 1fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 56,
          }}
          className="footer-grid">
          {/* Brand column */}
          <div>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                textDecoration: "none",
                marginBottom: 14,
              }}>
              <FingerprintIcon size={24} />
              <span
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontWeight: 700,
                  fontSize: 19,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                }}>
                Humora
              </span>
            </Link>

            <p
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 400,
                fontSize: 13.5,
                color: "#6B7280",
                lineHeight: 1.7,
                margin: "0 0 8px",
                maxWidth: 230,
              }}>
              The behavioral human verification widget. Replacing CAPTCHAs with human moments.
            </p>

            <p
              style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 12,
                color: "#374151",
                lineHeight: 1.5,
                margin: "0 0 22px",
              }}>
              94% bot bypass failure rate.
              <br />
              Average 23% conversion lift.
            </p>

            {/* Social links */}
            <div style={{ display: "flex", gap: 8 }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    backgroundColor: "#1C1C27",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 160ms ease",
                    border: "1px solid #2A2A3A",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4F46E5")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1C1C27")}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontWeight: 700,
                  fontSize: 10.5,
                  color: "#9CA3AF",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {col.links.map((link) => (
                  <ColLink key={link.label} href={link.href} external={link.external}>
                    {link.label}
                  </ColLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: "#1C1C27", margin: "0 0 28px" }} />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}>
          <span
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 12.5,
              color: "#374151",
            }}>
            © 2026 Humora, Inc. All rights reserved.
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Security", href: "/security" },
            ].map((l) => (
              <Link
                key={l.label}
                to={l.href}
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontSize: 12.5,
                  color: "#374151",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#374151")}>
                {l.label}
              </Link>
            ))}
          </div>

          <span
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 12.5,
              color: "#374151",
            }}>
            Made by developers who hate bad CAPTCHAs
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 400px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
