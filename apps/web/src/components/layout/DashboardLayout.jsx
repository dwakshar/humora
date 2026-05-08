import { useState, useCallback } from "react";
import { useAuth } from "@context/AuthContext";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ─── nav config ──────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: "OVERVIEW",
    items: [
      { label: "Dashboard",     href: "/dashboard",                icon: IconDashboard, exact: true },
      { label: "Analytics",     href: "/dashboard/analytics",      icon: IconAnalytics              },
    ],
  },
  {
    label: "INTEGRATION",
    items: [
      { label: "My Sites",      href: "/dashboard/sites",          icon: IconGlobe                  },
      { label: "API Keys",      href: "/dashboard/api-keys",       icon: IconKey                    },
      { label: "Documentation", href: "/docs",                     icon: IconBook, external: true   },
    ],
  },
  {
    label: "BILLING",
    items: [
      { label: "Plan & Usage",    href: "/dashboard/billing",          icon: IconCard    },
      { label: "Billing History", href: "/dashboard/billing-history",  icon: IconReceipt },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { label: "Settings", href: "/dashboard/settings", icon: IconGear    },
      { label: "Support",  href: "/dashboard/support",  icon: IconMessage },
    ],
  },
];

const PAGE_TITLES = {
  "/dashboard":                  "Dashboard",
  "/dashboard/analytics":        "Analytics",
  "/dashboard/sites":            "My Sites",
  "/dashboard/api-keys":         "API Keys",
  "/dashboard/billing":          "Plan & Usage",
  "/dashboard/billing-history":  "Billing History",
  "/dashboard/settings":         "Settings",
  "/dashboard/support":          "Support",
};

const PLAN_ORDER = ["free", "starter", "pro", "enterprise"];

// ─── icons ───────────────────────────────────────────────────────────────────
function IconDashboard({ active }) {
  const c = active ? "#4F46E5" : "#9CA3AF";
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconAnalytics({ active }) {
  const c = active ? "#4F46E5" : "#9CA3AF";
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M18 9l-5 5-4-4-3 3" />
    </svg>
  );
}

function IconGlobe({ active }) {
  const c = active ? "#4F46E5" : "#9CA3AF";
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconKey({ active }) {
  const c = active ? "#4F46E5" : "#9CA3AF";
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="M21 2l-9.5 9.5" />
      <path d="M16 7l5-5" />
    </svg>
  );
}

function IconBook({ active }) {
  const c = active ? "#4F46E5" : "#9CA3AF";
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconCard({ active }) {
  const c = active ? "#4F46E5" : "#9CA3AF";
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <path d="M1 10h22" />
    </svg>
  );
}

function IconReceipt({ active }) {
  const c = active ? "#4F46E5" : "#9CA3AF";
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function IconGear({ active }) {
  const c = active ? "#4F46E5" : "#9CA3AF";
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function IconMessage({ active }) {
  const c = active ? "#4F46E5" : "#9CA3AF";
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ─── avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, size = 32 }) {
  const initials = (name || "U").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const colors = ["#4F46E5", "#7C3AED", "#2563EB", "#059669", "#D97706"];
  const color  = colors[(name?.charCodeAt(0) ?? 0) % colors.length];

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      backgroundColor: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{
        fontFamily: "Archivo, sans-serif", fontWeight: 700,
        fontSize: Math.round(size * 0.37), color: "#fff",
        userSelect: "none",
      }}>
        {initials}
      </span>
    </div>
  );
}

// ─── sidebar nav item ─────────────────────────────────────────────────────────
function NavItem({ item, active }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "8px 12px", marginBottom: 2, borderRadius: 10,
        fontFamily: "Archivo, sans-serif",
        fontWeight: active ? 600 : 400,
        fontSize: 13,
        color: active ? "#4F46E5" : "#4B5563",
        backgroundColor: active ? "#EEF2FF" : "transparent",
        textDecoration: "none",
        transition: "all 120ms",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.color = "#111827";
          e.currentTarget.style.backgroundColor = "#F5F5F7";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.color = "#4B5563";
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      {active && (
        <span style={{
          position: "absolute", left: 0, top: "20%", bottom: "20%",
          width: 3, borderRadius: "0 3px 3px 0", backgroundColor: "#4F46E5",
        }} />
      )}
      <Icon active={active} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.external && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      )}
    </Link>
  );
}

// ─── notification panel ───────────────────────────────────────────────────────
function NotificationPanel({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.14 }}
      style={{
        position: "absolute", top: "calc(100% + 10px)", right: 0,
        width: 320, backgroundColor: "#fff",
        border: "1px solid #E5E7EB", borderRadius: 14,
        boxShadow: "0 12px 40px rgba(0,0,0,0.12)", zIndex: 60, overflow: "hidden",
      }}
    >
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px", borderBottom: "1px solid #F3F4F6",
      }}>
        <span style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 14, color: "#0F0F0F" }}>
          Notifications
        </span>
        <button
          onClick={onClose}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#9CA3AF", fontSize: 18, lineHeight: 1, padding: 2,
          }}
        >
          ×
        </button>
      </div>
      <div style={{ padding: "32px 16px", textAlign: "center" }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, backgroundColor: "#F3F4F6",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <p style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13, color: "#374151", margin: "0 0 4px" }}>
          You're all caught up
        </p>
        <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#9CA3AF", margin: 0 }}>
          No new notifications right now.
        </p>
      </div>
    </motion.div>
  );
}

// ─── avatar dropdown ──────────────────────────────────────────────────────────
function AvatarMenu({ user, onLogout, onClose }) {
  const planName  = user?.plan || "free";
  const planLabel = planName.charAt(0).toUpperCase() + planName.slice(1);

  const menuItem = (label, href, danger = false) => (
    <Link
      to={href}
      onClick={onClose}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "9px 14px",
        fontFamily: "Archivo, sans-serif", fontSize: 13,
        color: danger ? "#EF4444" : "#374151",
        textDecoration: "none",
        borderRadius: 8, transition: "background 100ms",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = danger ? "#FEF2F2" : "#F5F5F7")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      {label}
    </Link>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.14 }}
      style={{
        position: "absolute", top: "calc(100% + 10px)", right: 0,
        width: 220, backgroundColor: "#fff",
        border: "1px solid #E5E7EB", borderRadius: 14,
        boxShadow: "0 12px 40px rgba(0,0,0,0.12)", zIndex: 60,
        padding: 6, overflow: "hidden",
      }}
    >
      {/* User info */}
      <div style={{ padding: "10px 14px 12px", borderBottom: "1px solid #F3F4F6", marginBottom: 4 }}>
        <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 13, color: "#0F0F0F", marginBottom: 2 }}>
          {user?.name || "User"}
        </div>
        <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 11, color: "#9CA3AF", marginBottom: 6 }}>
          {user?.email || ""}
        </div>
        <span style={{
          fontFamily: "Archivo, sans-serif", fontSize: 10, fontWeight: 700,
          color: "#4F46E5", backgroundColor: "#EEF2FF",
          border: "1px solid #C7D2FE", borderRadius: 999,
          padding: "2px 8px", textTransform: "uppercase", letterSpacing: "0.06em",
        }}>
          {planLabel}
        </span>
      </div>

      {menuItem("Profile & Settings", "/dashboard/settings")}
      {menuItem("Plan & Billing", "/dashboard/billing")}
      {menuItem("Support", "/dashboard/support")}

      <div style={{ borderTop: "1px solid #F3F4F6", margin: "4px 0" }} />

      <button
        onClick={() => { onClose(); onLogout(); }}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          width: "100%", padding: "9px 14px",
          fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#EF4444",
          backgroundColor: "transparent", border: "none",
          cursor: "pointer", borderRadius: 8, transition: "background 100ms",
          textAlign: "left",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FEF2F2")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <IconLogout />
        Sign out
      </button>
    </motion.div>
  );
}

// ─── topbar ───────────────────────────────────────────────────────────────────
function TopBar({ pageTitle, user, onLogout }) {
  const [notifOpen, setNotifOpen]   = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const planName = user?.plan || "free";
  const showUpgrade = ["free", "starter"].includes(planName);

  return (
    <header style={{
      height: 60, flexShrink: 0,
      backgroundColor: "#fff", borderBottom: "1px solid #EAECF0",
      display: "flex", alignItems: "center",
      padding: "0 32px", gap: 16,
      zIndex: 10,
    }}>
      {/* Page title */}
      <h1 style={{
        fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 18,
        color: "#0F0F0F", margin: 0, letterSpacing: "-0.01em",
      }}>
        {pageTitle}
      </h1>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>

        {/* Upgrade CTA */}
        {showUpgrade && (
          <Link
            to="/dashboard/billing"
            style={{
              fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 12,
              color: "#4F46E5", backgroundColor: "#EEF2FF",
              border: "1px solid #C7D2FE",
              padding: "6px 14px", borderRadius: 999,
              textDecoration: "none", transition: "all 150ms",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#4F46E5";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "#4F46E5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#EEF2FF";
              e.currentTarget.style.color = "#4F46E5";
              e.currentTarget.style.borderColor = "#C7D2FE";
            }}
          >
            Upgrade plan ↑
          </Link>
        )}

        {/* Notification bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setNotifOpen((o) => !o); setAvatarOpen(false); }}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "none", border: "1px solid transparent",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 150ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F5F5F7";
              e.currentTarget.style.borderColor = "#E5E7EB";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <IconBell />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 50 }} onClick={() => setNotifOpen(false)} />
                <NotificationPanel onClose={() => setNotifOpen(false)} />
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 20, backgroundColor: "#E5E7EB" }} />

        {/* Avatar + dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => { setAvatarOpen((o) => !o); setNotifOpen(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "none", border: "1px solid transparent",
              borderRadius: 10, padding: "4px 8px 4px 4px",
              cursor: "pointer", transition: "all 150ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F5F5F7";
              e.currentTarget.style.borderColor = "#E5E7EB";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <Avatar name={user?.name} size={28} />
            <span style={{
              fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: 600, color: "#111827",
              maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {(user?.name || "User").split(" ")[0]}
            </span>
            <span style={{ color: "#9CA3AF", transition: "transform 150ms", transform: avatarOpen ? "rotate(90deg)" : "none" }}>
              <IconChevronRight />
            </span>
          </button>

          <AnimatePresence>
            {avatarOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 50 }} onClick={() => setAvatarOpen(false)} />
                <AvatarMenu user={user} onLogout={onLogout} onClose={() => setAvatarOpen(false)} />
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

// ─── sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ user, location, onLogout }) {
  const planName  = user?.plan || "free";
  const planLabel = planName.charAt(0).toUpperCase() + planName.slice(1);

  return (
    <aside style={{
      width: 256, flexShrink: 0,
      display: "flex", flexDirection: "column",
      height: "100vh", overflow: "hidden",
      backgroundColor: "#fff", borderRight: "1px solid #EAECF0",
    }}>
      {/* Logo */}
      <div style={{
        padding: "18px 20px",
        borderBottom: "1px solid #F3F4F6",
        flexShrink: 0,
      }}>
        <Link
          to="/"
          style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}
        >
          <div style={{
            width: 30, height: 30, borderRadius: 8, backgroundColor: "#EEF2FF",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" fill="#4F46E5" />
              <path d="M12 7a4 4 0 0 1 4 4c0 2.2-.8 4.2-2.1 5.8" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M8 11a4 4 0 0 1 4-4" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M5 11a7 7 0 0 1 14 0c0 2.4-.7 4.6-1.8 6.4" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M2 11C2 5.48 6.48 1 12 1s10 4.48 10 10c0 2.3-.77 4.42-2.07 6.1" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{
            fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 16,
            color: "#0F0F0F", letterSpacing: "-0.02em",
          }}>
            Humora
          </span>
        </Link>
      </div>

      {/* User section */}
      <div style={{
        padding: "14px 16px", borderBottom: "1px solid #F3F4F6", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={user?.name} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13,
              color: "#0F0F0F",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {user?.name || "User"}
            </div>
            <div style={{
              fontFamily: "Archivo, sans-serif", fontSize: 11, color: "#9CA3AF",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {user?.email || ""}
            </div>
          </div>
          <span style={{
            fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 10,
            color: "#4F46E5", backgroundColor: "#EEF2FF",
            border: "1px solid #C7D2FE",
            borderRadius: 999, padding: "3px 8px",
            flexShrink: 0, textTransform: "capitalize", letterSpacing: "0.04em",
          }}>
            {planLabel}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "10px 12px 0" }}>
        {NAV_GROUPS.map((group) => (
          <div key={group.label} style={{ marginBottom: 18 }}>
            <div style={{
              fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 9,
              color: "#C4C9D4", letterSpacing: "0.1em", textTransform: "uppercase",
              padding: "0 12px", marginBottom: 4,
            }}>
              {group.label}
            </div>
            {group.items.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href);
              return <NavItem key={item.href} item={item} active={isActive} />;
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #F3F4F6", flexShrink: 0 }}>
        <button
          onClick={onLogout}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            width: "100%", padding: "8px 12px",
            fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#9CA3AF",
            backgroundColor: "transparent", border: "none",
            cursor: "pointer", borderRadius: 8, transition: "all 140ms",
            textAlign: "left",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#EF4444";
            e.currentTarget.style.backgroundColor = "#FEF2F2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#9CA3AF";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <IconLogout />
          Sign out
        </button>
      </div>
    </aside>
  );
}

// ─── root layout ─────────────────────────────────────────────────────────────
export default function DashboardLayout() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  const pageTitle = PAGE_TITLES[location.pathname] ?? "Dashboard";

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      overflow: "hidden",
      backgroundColor: "#F5F5F7",
    }}>
      {/* Sidebar */}
      <Sidebar user={user} location={location} onLogout={handleLogout} />

      {/* Right panel: topbar + scrollable content */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        minWidth: 0,
      }}>
        <TopBar pageTitle={pageTitle} user={user} onLogout={handleLogout} />

        <main style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px 36px",
          backgroundColor: "#F5F5F7",
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
