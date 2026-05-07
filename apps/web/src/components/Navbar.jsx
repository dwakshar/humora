import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const FingerprintIcon = ({ color = "#4F46E5", size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" fill={color} />
    <path d="M12 7a4 4 0 0 1 4 4c0 2.2-.8 4.2-2.1 5.8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M8 11a4 4 0 0 1 4-4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M5 11a7 7 0 0 1 14 0c0 2.4-.7 4.6-1.8 6.4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M2 11C2 5.48 6.48 1 12 1s10 4.48 10 10c0 2.3-.77 4.42-2.07 6.1" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M4.5 16.5C3.56 14.9 3 13.01 3 11" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M7 20a9.97 9.97 0 0 1-3.5-3.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M12 23c-1.6 0-3.1-.4-4.4-1.1" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M17.5 20.5A9.96 9.96 0 0 1 15 22.4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M21 15.5a10 10 0 0 1-1.8 3.3" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

function NavIcon({ paths, size = 22, color = "#4F46E5" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {paths.map((p, i) =>
        p.fill ? (
          <path key={i} d={p.d} fill={color} />
        ) : p.circle ? (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} stroke={color} strokeWidth="2" strokeLinecap="round" />
        ) : p.rect ? (
          <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx={p.rx ?? 0} stroke={color} strokeWidth="2" />
        ) : (
          <path key={i} d={p.d} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )
      )}
    </svg>
  );
}

const ICONS = {
  fingerprint: [
    { d: "M12 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z", fill: true },
    { d: "M12 7a4 4 0 0 1 4 4c0 2.2-.8 3.8-2 5.2" },
    { d: "M8 11a4 4 0 0 1 4-4" },
    { d: "M5 11a7 7 0 0 1 14 0c0 2.4-.7 4.5-1.8 6.3" },
    { d: "M2 11C2 5.48 6.48 1 12 1s10 4.48 10 10c0 2.3-.8 4.4-2.1 6.1" },
  ],
  brain: [
    { d: "M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14A2.5 2.5 0 0 1 9.5 2" },
    { d: "M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.14A2.5 2.5 0 0 0 14.5 2" },
  ],
  activity: [
    { d: "M22 12h-4l-3 9L9 3 6 12H2" },
  ],
  barChart: [
    { d: "M18 20V10" },
    { d: "M12 20V4" },
    { d: "M6 20v-6" },
  ],
  code: [
    { d: "M16 18l6-6-6-6" },
    { d: "M8 6l-6 6 6 6" },
  ],
  key: [
    { d: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" },
  ],
  checkShield: [
    { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
    { d: "M9 12l2 2 4-4" },
  ],
  sliders: [
    { d: "M4 21v-7" },
    { d: "M4 10V3" },
    { d: "M12 21v-9" },
    { d: "M12 8V3" },
    { d: "M20 21v-5" },
    { d: "M20 12V3" },
    { d: "M1 14h6" },
    { d: "M9 8h6" },
    { d: "M17 16h6" },
  ],
  rocket: [
    { d: "M9 11V6l3-3 3 3v5" },
    { d: "M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1H5v-1z" },
    { d: "M12 3C9.24 3 7 5.24 7 8v9h10V8c0-2.76-2.24-5-5-5z" },
    { d: "M10 21v-1" },
    { d: "M14 21v-1" },
  ],
  package: [
    { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" },
    { d: "M3.27 6.96L12 12.01l8.73-5.05" },
    { d: "M12 22.08V12" },
  ],
  bookOpen: [
    { d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" },
    { d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" },
  ],
  github: [
    { d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" },
  ],
  clock: [
    { circle: true, cx: 12, cy: 12, r: 10 },
    { d: "M12 6v6l4 2" },
  ],
  pulse: [
    { d: "M22 12h-4l-3 9L9 3 6 12H2" },
  ],
  messageCircle: [
    { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" },
  ],
  alertOctagon: [
    { d: "M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z" },
    { d: "M12 8v4" },
    { circle: true, cx: 12, cy: 16, r: 0.5 },
  ],
  userCheck: [
    { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" },
    { circle: true, cx: 9, cy: 7, r: 4 },
    { d: "M16 11l2 2 4-4" },
  ],
  clipboardCheck: [
    { d: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" },
    { rect: true, x: 9, y: 3, w: 6, h: 4, rx: 1 },
    { d: "M9 12l2 2 4-4" },
  ],
  server: [
    { rect: true, x: 2, y: 2, w: 20, h: 8, rx: 2 },
    { rect: true, x: 2, y: 14, w: 20, h: 8, rx: 2 },
    { d: "M6 6h.01" },
    { d: "M6 18h.01" },
  ],
  shieldAlert: [
    { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
    { d: "M12 8v4" },
    { circle: true, cx: 12, cy: 16, r: 0.5 },
  ],
  shoppingCart: [
    { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" },
    { d: "M3 6h18" },
    { d: "M16 10a4 4 0 0 1-8 0" },
  ],
  layers: [
    { d: "M12 2L2 7l10 5 10-5-10-5z" },
    { d: "M2 17l10 5 10-5" },
    { d: "M2 12l10 5 10-5" },
  ],
  creditCard: [
    { rect: true, x: 1, y: 4, w: 22, h: 16, rx: 2 },
    { d: "M1 10h22" },
  ],
  heartPulse: [
    { d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" },
    { d: "M3.22 12H9.5l.5-1 2 4 .5-4.5 1.5 2h5.27" },
  ],
};

const NAV_MENU = [
  {
    label: "Product",
    type: "dropdown",
    columns: [
      {
        heading: "Platform",
        links: [
          {
            label: "Human Verification",
            desc: "Behavioral scoring that delights users",
            href: "/#how-it-works",
            icon: ICONS.fingerprint,
          },
          {
            label: "Question Engine",
            desc: "7,776 unique human moments across 5 categories",
            href: "/#how-it-works",
            icon: ICONS.brain,
          },
          {
            label: "Multi-Signal Scoring",
            desc: "Timing, interaction & answer pattern analysis",
            href: "/#how-it-works",
            icon: ICONS.activity,
          },
          {
            label: "Analytics Dashboard",
            desc: "Real-time pass rates, bot trends & site health",
            href: "/dashboard/analytics",
            icon: ICONS.barChart,
          },
        ],
      },
      {
        heading: "Integrations",
        links: [
          {
            label: "Widget Embed",
            desc: "Drop-in React & vanilla JS widget",
            href: "/docs/widget",
            icon: ICONS.code,
          },
          {
            label: "JWT Verification",
            desc: "Signed tokens — one API call to verify",
            href: "/docs/api",
            icon: ICONS.key,
          },
          {
            label: "Form & Checkout Guard",
            desc: "Protect every entry point from bots",
            href: "/#features",
            icon: ICONS.checkShield,
          },
          {
            label: "Custom Questions",
            desc: "Brand-tailored questions (Enterprise)",
            href: "/contact",
            icon: ICONS.sliders,
          },
        ],
      },
    ],
    footer: { label: "See all features", href: "/#features" },
  },
  {
    label: "Developers",
    type: "dropdown",
    columns: [
      {
        heading: "Get Started",
        links: [
          {
            label: "Quickstart Guide",
            desc: "Live in under 2 minutes",
            href: "/docs",
            icon: ICONS.rocket,
          },
          {
            label: "Widget Library",
            desc: "React + Vite + Tailwind components",
            href: "/docs",
            icon: ICONS.package,
          },
          {
            label: "API Reference",
            desc: "JWT verification & scoring endpoints",
            href: "/docs",
            icon: ICONS.bookOpen,
          },
          {
            label: "GitHub Repo",
            desc: "Open source · MIT licensed",
            href: "https://github.com/dwakshar/humora",
            icon: ICONS.github,
            external: true,
          },
        ],
      },
      {
        heading: "Resources",
        links: [
          {
            label: "Changelog",
            desc: "What's new every release",
            href: "/changelog",
            icon: ICONS.clock,
          },
          {
            label: "Status Page",
            desc: "99.98% uptime · Live incidents",
            href: "/status",
            icon: ICONS.pulse,
          },
          {
            label: "Community",
            desc: "Discord for builders",
            href: "https://discord.gg/humora",
            icon: ICONS.messageCircle,
            external: true,
          },
          {
            label: "Report an Issue",
            desc: "Help us improve Humora",
            href: "https://github.com/dwakshar/humora/issues",
            icon: ICONS.alertOctagon,
            external: true,
          },
        ],
      },
    ],
    footer: { label: "Full documentation", href: "/docs" },
  },
  {
    label: "Solutions",
    type: "dropdown",
    columns: [
      {
        heading: "By Use Case",
        links: [
          {
            label: "Login & Signup Protection",
            desc: "Stop credential stuffing at the door",
            href: "/solutions/auth",
            icon: ICONS.userCheck,
          },
          {
            label: "Form & Checkout",
            desc: "No more bot spam on every form",
            href: "/solutions/forms",
            icon: ICONS.clipboardCheck,
          },
          {
            label: "API & Bot Defense",
            desc: "Enterprise-grade endpoint protection",
            href: "/solutions/api",
            icon: ICONS.server,
          },
          {
            label: "Abuse Prevention",
            desc: "Real-time threat scoring & retries",
            href: "/solutions/abuse",
            icon: ICONS.shieldAlert,
          },
        ],
      },
      {
        heading: "By Industry",
        links: [
          {
            label: "E-commerce",
            desc: "Protect checkout, reviews & accounts",
            href: "/solutions/ecommerce",
            icon: ICONS.shoppingCart,
          },
          {
            label: "SaaS Platforms",
            desc: "Frictionless onboarding, zero bots",
            href: "/solutions/saas",
            icon: ICONS.layers,
          },
          {
            label: "Finance & Banking",
            desc: "Compliance-first human verification",
            href: "/solutions/finance",
            icon: ICONS.creditCard,
          },
          {
            label: "Healthcare",
            desc: "HIPAA-ready behavioral checks",
            href: "/solutions/healthcare",
            icon: ICONS.heartPulse,
          },
        ],
      },
    ],
    footer: { label: "Talk to our team", href: "/contact" },
  },
  { type: "link", label: "Pricing", href: "/pricing" },
  { type: "link", label: "Docs", href: "/docs" },
  { type: "link", label: "Demo", href: "/demo" },
];

function DropdownLink({ link }) {
  const inner = (
    <>
      <div
        style={{
          width: 40,
          height: 40,
          backgroundColor: "#F1F5F9",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background-color 140ms ease",
        }}
        className="link-icon-box">
        <NavIcon paths={link.icon} />
      </div>
      <div>
        <div
          style={{
            fontFamily: "Archivo, sans-serif",
            fontWeight: 600,
            fontSize: 14.5,
            color: "#0F172A",
            lineHeight: 1.3,
          }}>
          {link.label}
        </div>
        <div
          style={{
            fontFamily: "Archivo, sans-serif",
            fontSize: 12.5,
            color: "#64748B",
            lineHeight: 1.45,
            marginTop: 2,
          }}>
          {link.desc}
        </div>
      </div>
    </>
  );

  const sharedStyle = {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "12px 14px",
    borderRadius: 14,
    textDecoration: "none",
    transition: "background-color 140ms cubic-bezier(0.4, 0, 0.2, 1)",
  };

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        style={sharedStyle}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8FAFC")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
        {inner}
      </a>
    );
  }

  return (
    <Link
      to={link.href}
      style={sharedStyle}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8FAFC")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
      {inner}
    </Link>
  );
}

function DropdownPanel({ item }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.97 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "absolute",
        top: "calc(100% + 10px)",
        left: "50%",
        transform: "translateX(-50%)",
        width: 700,
        backgroundColor: "#ffffff",
        borderRadius: 18,
        boxShadow: "0 20px 60px -10px rgba(15, 23, 42, 0.12), 0 4px 16px -4px rgba(15, 23, 42, 0.06)",
        border: "1px solid #E2E8F0",
        zIndex: 60,
        overflow: "hidden",
      }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0,
          padding: "20px 16px 16px",
        }}>
        {item.columns.map((col, colIdx) => (
          <div key={colIdx} style={{ padding: "0 8px" }}>
            <div
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 700,
                fontSize: 10.5,
                letterSpacing: "0.1em",
                color: "#94A3B8",
                textTransform: "uppercase",
                paddingLeft: 14,
                marginBottom: 10,
              }}>
              {col.heading}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {col.links.map((link, i) => (
                <DropdownLink key={i} link={link} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {item.footer && (
        <div style={{ borderTop: "1px solid #F1F5F9", padding: "14px 28px 14px" }}>
          <Link
            to={item.footer.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "Archivo, sans-serif",
              fontWeight: 600,
              fontSize: 13,
              color: "#4F46E5",
              textDecoration: "none",
              padding: "6px 12px",
              borderRadius: 10,
              transition: "background-color 140ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#EEF2FF")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
            {item.footer.label}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </motion.div>
  );
}

function NavItem({ item, activeDropdown, setActiveDropdown }) {
  const isOpen = activeDropdown === item.label;

  if (item.type === "link") {
    return (
      <Link
        to={item.href}
        style={{
          fontFamily: "Archivo, sans-serif",
          fontWeight: 500,
          fontSize: 14.5,
          color: "#374151",
          padding: "8px 13px",
          borderRadius: 9,
          textDecoration: "none",
          transition: "all 150ms ease",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#4F46E5";
          e.currentTarget.style.backgroundColor = "#F5F3FF";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#374151";
          e.currentTarget.style.backgroundColor = "transparent";
        }}>
        {item.label}
      </Link>
    );
  }

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setActiveDropdown(item.label)}
      onMouseLeave={() => setActiveDropdown(null)}>
      <button
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontFamily: "Archivo, sans-serif",
          fontWeight: 500,
          fontSize: 14.5,
          color: isOpen ? "#4F46E5" : "#374151",
          background: isOpen ? "#F5F3FF" : "none",
          border: "none",
          padding: "8px 13px",
          borderRadius: 9,
          cursor: "pointer",
          transition: "all 150ms ease",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#4F46E5";
          e.currentTarget.style.backgroundColor = "#F5F3FF";
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.color = "#374151";
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}>
        {item.label}
        <motion.svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.18 }}>
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && <DropdownPanel item={item} />}
      </AnimatePresence>
    </div>
  );
}

function MobileMenu({ onClose }) {
  const [openSection, setOpenSection] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed",
        top: 68,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fff",
        zIndex: 49,
        overflowY: "auto",
        padding: "16px 20px 40px",
        borderTop: "1px solid #E5E7EB",
      }}>
      {NAV_MENU.map((item, idx) => {
        if (item.type === "link") {
          return (
            <Link
              key={idx}
              to={item.href}
              onClick={onClose}
              style={{
                display: "block",
                fontFamily: "Archivo, sans-serif",
                fontWeight: 500,
                fontSize: 16,
                color: "#1E293B",
                padding: "14px 4px",
                textDecoration: "none",
                borderBottom: "1px solid #F1F5F9",
              }}>
              {item.label}
            </Link>
          );
        }

        const isOpen = openSection === item.label;
        return (
          <div key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
            <button
              onClick={() => setOpenSection(isOpen ? null : item.label)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                fontFamily: "Archivo, sans-serif",
                fontWeight: 500,
                fontSize: 16,
                color: "#1E293B",
                background: "none",
                border: "none",
                padding: "14px 4px",
                cursor: "pointer",
                textAlign: "left",
              }}>
              {item.label}
              <motion.svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748B"
                strokeWidth="2.5"
                strokeLinecap="round"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.18 }}>
                <polyline points="6 9 12 15 18 9" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: "hidden" }}>
                  {item.columns.map((col, colIdx) => (
                    <div key={colIdx} style={{ paddingBottom: 8 }}>
                      <div
                        style={{
                          fontFamily: "Archivo, sans-serif",
                          fontWeight: 700,
                          fontSize: 10,
                          letterSpacing: "0.1em",
                          color: "#94A3B8",
                          textTransform: "uppercase",
                          padding: "10px 4px 6px",
                        }}>
                        {col.heading}
                      </div>
                      {col.links.map((link, i) => {
                        const Tag = link.external ? "a" : Link;
                        const linkProps = link.external
                          ? { href: link.href, target: "_blank", rel: "noopener noreferrer" }
                          : { to: link.href };
                        return (
                          <Tag
                            key={i}
                            {...linkProps}
                            onClick={onClose}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              padding: "10px 8px",
                              borderRadius: 10,
                              textDecoration: "none",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8FAFC")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                            <div
                              style={{
                                width: 34,
                                height: 34,
                                backgroundColor: "#F1F5F9",
                                borderRadius: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}>
                              <NavIcon paths={link.icon} size={18} />
                            </div>
                            <div>
                              <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 14, color: "#0F172A" }}>
                                {link.label}
                              </div>
                              <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#64748B", marginTop: 1 }}>
                                {link.desc}
                              </div>
                            </div>
                          </Tag>
                        );
                      })}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
        <Link
          to="/login"
          onClick={onClose}
          style={{
            display: "block",
            textAlign: "center",
            fontFamily: "Archivo, sans-serif",
            fontWeight: 500,
            fontSize: 15,
            color: "#374151",
            padding: "13px 20px",
            borderRadius: 12,
            textDecoration: "none",
            border: "1px solid #E5E7EB",
          }}>
          Log in
        </Link>
        <Link
          to="/signup"
          onClick={onClose}
          style={{
            display: "block",
            textAlign: "center",
            fontFamily: "Archivo, sans-serif",
            fontWeight: 600,
            fontSize: 15,
            color: "#fff",
            backgroundColor: "#4F46E5",
            padding: "13px 20px",
            borderRadius: 12,
            textDecoration: "none",
          }}>
          Start for free
        </Link>
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 68,
          backgroundColor: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.92)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: scrolled ? "1px solid #E5E7EB" : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.05)" : "none",
          transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
        }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 28px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              textDecoration: "none",
              flexShrink: 0,
            }}>
            <FingerprintIcon size={26} />
            <span
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 700,
                fontSize: 20,
                letterSpacing: "-0.03em",
                color: "#0F172A",
              }}>
              Humora
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}>
            {NAV_MENU.map((item) => (
              <NavItem
                key={item.label}
                item={item}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
              />
            ))}
          </nav>

          {/* Right side CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <Link
              to="/login"
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 500,
                fontSize: 14,
                color: "#374151",
                padding: "8px 16px",
                borderRadius: 10,
                textDecoration: "none",
                transition: "all 150ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F8FAFC";
                e.currentTarget.style.color = "#1E293B";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#374151";
              }}>
              Log in
            </Link>

            <Link
              to="/signup"
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 600,
                fontSize: 14,
                color: "#fff",
                backgroundColor: "#4F46E5",
                padding: "9px 20px",
                borderRadius: 10,
                textDecoration: "none",
                boxShadow: "0 1px 4px rgba(79, 70, 229, 0.28)",
                transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#4338CA";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(79, 70, 229, 0.38)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#4F46E5";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(79, 70, 229, 0.28)";
              }}>
              Start for free
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                background: "none",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                color: "#374151",
                padding: 0,
              }}
              className="mobile-menu-btn">
              {mobileOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>

      <style>{`
        @media (max-width: 960px) {
          nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
