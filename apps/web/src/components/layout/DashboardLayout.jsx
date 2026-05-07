import { useState, useCallback } from "react";
import { useAuth } from "@context/AuthContext";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NAV_GROUPS = [
  {
    label: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
      { label: "Analytics", href: "/dashboard/analytics", icon: AnalyticsIcon },
    ],
  },
  {
    label: "INTEGRATION",
    items: [
      { label: "My Sites", href: "/dashboard/sites", icon: GlobeIcon },
      { label: "API Keys", href: "/dashboard/sites#api-keys", icon: KeyIcon },
      { label: "Documentation", href: "/docs", icon: BookIcon, external: true },
    ],
  },
  {
    label: "BILLING",
    items: [
      { label: "Plan & Usage", href: "/dashboard/billing", icon: CardIcon },
      { label: "Billing History", href: "/dashboard/billing#history", icon: ReceiptIcon },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { label: "Settings", href: "/dashboard/settings", icon: GearIcon },
      { label: "Support", href: "/dashboard/settings#support", icon: MessageIcon },
    ],
  },
];

function DashboardIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#4F46E5" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function AnalyticsIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#4F46E5" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M18 9l-5 5-4-4-3 3" />
    </svg>
  );
}

function GlobeIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#4F46E5" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function KeyIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#4F46E5" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="M21 2l-9.5 9.5" />
      <path d="M16 7l5-5" />
    </svg>
  );
}

function BookIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#4F46E5" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function CardIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#4F46E5" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <path d="M1 10h22" />
    </svg>
  );
}

function ReceiptIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#4F46E5" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-2 2 2 2-2 2 2 2-2 2 2 2-2 2 2V2l-2 2-2-2-2 2-2-2-2 2-2-2-2 2-2-2z" />
      <path d="M16 8h-6" />
      <path d="M16 12h-6" />
      <path d="M14 16h-4" />
    </svg>
  );
}

function GearIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#4F46E5" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function MessageIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#4F46E5" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function BellIcon({ hasUnread }) {
  return (
    <div style={{ position: "relative" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {hasUnread && (
        <span style={{
          position: "absolute",
          top: -2,
          right: -2,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#EF4444",
          border: "2px solid #fff",
        }} />
      )}
    </div>
  );
}

function Avatar({ user, size = 32, onClick }) {
  const initials = (user?.name || "U").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <button
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "#4F46E5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: "none",
        padding: 0,
      }}
    >
      <span style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: Math.round(size * 0.35), color: "#fff" }}>
        {initials}
      </span>
    </button>
  );
}

const MOCK_NOTIFICATIONS = [
  { id: 1, title: "New site registered", body: "example.com was successfully registered.", time: "2m ago", read: false },
  { id: 2, title: "Assessment completed", body: "A visitor completed the human assessment.", time: "1h ago", read: false },
  { id: 3, title: "API key created", body: "A new API key was generated for your account.", time: "3h ago", read: true },
];

function TopBar({ pageTitle, user, onLogout }) {
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const hasUnreadNotifications = notifications.some((n) => !n.read);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 240,
      right: 0,
      height: 64,
      backgroundColor: "#fff",
      borderBottom: "1px solid #E5E7EB",
      zIndex: 35,
      display: "flex",
      alignItems: "center",
      padding: "0 32px",
    }}>
      <h1 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 20, color: "#0F0F0F", margin: 0 }}>
        {pageTitle}
      </h1>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 150ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <BellIcon hasUnread={hasUnreadNotifications} />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ position: "fixed", inset: 0, zIndex: 40 }}
                  onClick={() => setNotifOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.12 }}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: 320,
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    zIndex: 50,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                    <span style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 14, color: "#0F0F0F" }}>Notifications</span>
                    {hasUnreadNotifications && (
                      <button
                        onClick={markAllRead}
                        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#4F46E5", padding: 0 }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div style={{ maxHeight: 320, overflowY: "auto" }}>
                    {notifications.length === 0 ? (
                      <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280", textAlign: "center", padding: "24px 16px", margin: 0 }}>No notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          style={{
                            padding: "12px 16px",
                            borderBottom: "1px solid #F9FAFB",
                            backgroundColor: n.read ? "#fff" : "#F5F3FF",
                            display: "flex",
                            gap: 10,
                            alignItems: "flex-start",
                          }}
                        >
                          {!n.read && (
                            <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#4F46E5", flexShrink: 0, marginTop: 5 }} />
                          )}
                          <div style={{ flex: 1, paddingLeft: n.read ? 18 : 0 }}>
                            <p style={{ margin: 0, fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13, color: "#0F0F0F" }}>{n.title}</p>
                            <p style={{ margin: "2px 0 0", fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#6B7280" }}>{n.body}</p>
                            <p style={{ margin: "4px 0 0", fontFamily: "Archivo, sans-serif", fontSize: 11, color: "#9CA3AF" }}>{n.time}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <Link
          to="/dashboard/billing"
          style={{
            fontFamily: "Archivo, sans-serif",
            fontWeight: 600,
            fontSize: 12,
            color: "#4F46E5",
            backgroundColor: "#EEF2FF",
            padding: "6px 12px",
            borderRadius: 999,
            textDecoration: "none",
            transition: "all 150ms",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#4F46E5";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#EEF2FF";
            e.currentTarget.style.color = "#4F46E5";
          }}
        >
          Upgrade ↑
        </Link>

        <div style={{ position: "relative" }}>
          <Avatar user={user} onClick={() => setAvatarOpen(!avatarOpen)} />

          <AnimatePresence>
            {avatarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.12 }}
                  style={{
                    position: "absolute",
                    top: 44,
                    right: 0,
                    width: 200,
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    border: "1px solid #E5E7EB",
                    padding: 8,
                    zIndex: 50,
                  }}
                >
                  <div style={{ padding: "8px 12px", borderBottom: "1px solid #F3F4F6", marginBottom: 4 }}>
                    <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13, color: "#0F0F0F" }}>
                      {user?.name || "User"}
                    </div>
                    <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#9CA3AF" }}>
                      {user?.email || ""}
                    </div>
                  </div>
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setAvatarOpen(false)}
                    style={{
                      display: "block",
                      padding: "8px 12px",
                      fontFamily: "Archivo, sans-serif",
                      fontSize: 13,
                      color: "#374151",
                      textDecoration: "none",
                      borderRadius: 6,
                      transition: "background 120ms",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    Profile & Settings
                  </Link>
                  <Link
                    to="/dashboard/billing"
                    onClick={() => setAvatarOpen(false)}
                    style={{
                      display: "block",
                      padding: "8px 12px",
                      fontFamily: "Archivo, sans-serif",
                      fontSize: 13,
                      color: "#374151",
                      textDecoration: "none",
                      borderRadius: 6,
                      transition: "background 120ms",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F4F6")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    Billing
                  </Link>
                  <button
                    onClick={() => { setAvatarOpen(false); onLogout(); }}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      fontFamily: "Archivo, sans-serif",
                      fontSize: 13,
                      color: "#EF4444",
                      backgroundColor: "transparent",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      borderRadius: 6,
                      transition: "background 120ms",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FEF2F2")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    Logout
                  </button>
                </motion.div>
                <div
                  style={{ position: "fixed", inset: 0, zIndex: 49 }}
                  onClick={() => setAvatarOpen(false)}
                />
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path === "/dashboard/analytics") return "Analytics";
    if (path === "/dashboard/sites") return "My Sites";
    if (path === "/dashboard/billing") return "Billing";
    if (path === "/dashboard/settings") return "Settings";
    return "Dashboard";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F5F5F7" }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        backgroundColor: "#fff",
        borderRight: "1px solid #E5E7EB",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 40,
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #F3F4F6" }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" fill="#4F46E5" />
              <path d="M12 7a4 4 0 0 1 4 4c0 2.2-.8 4.2-2.1 5.8" stroke="#4F46E5" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M8 11a4 4 0 0 1 4-4" stroke="#4F46E5" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M5 11a7 7 0 0 1 14 0c0 2.4-.7 4.6-1.8 6.4" stroke="#4F46E5" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M2 11C2 5.48 6.48 1 12 1s10 4.48 10 10c0 2.3-.77 4.42-2.07 6.1" stroke="#4F46E5" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 16, color: "#0F0F0F" }}>
              Humora
            </span>
          </Link>
        </div>

        {/* User pill */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar user={user} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13, color: "#0F0F0F" }}>
                {user?.name || "User"}
              </div>
              <span style={{
                display: "inline-block",
                fontFamily: "Archivo, sans-serif",
                fontWeight: 500,
                fontSize: 11,
                color: "#4F46E5",
                backgroundColor: "#EEF2FF",
                border: "1px solid #C7D2FE",
                borderRadius: 999,
                padding: "2px 8px",
                marginTop: 2,
              }}>
                Starter
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: "16px 12px", flex: 1, overflowY: "auto" }}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} style={{ marginBottom: 20 }}>
              <div style={{
                fontFamily: "Archivo, sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: "#9CA3AF",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "0 12px",
                marginBottom: 6,
              }}>
                {group.label}
              </div>
              {group.items.map((item) => {
                const active = location.pathname === item.href || (item.href.startsWith("/docs") && location.pathname.startsWith("/docs"));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 12px",
                      marginBottom: 1,
                      borderRadius: 10,
                      fontFamily: "Archivo, sans-serif",
                      fontWeight: active ? 600 : 400,
                      fontSize: 13,
                      color: active ? "#4F46E5" : "#374151",
                      textDecoration: "none",
                      backgroundColor: active ? "#EEF2FF" : "transparent",
                      borderLeft: active ? "3px solid #4F46E5" : "3px solid transparent",
                      transition: "all 120ms",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = "#0F0F0F";
                        e.currentTarget.style.backgroundColor = "#F9FAFB";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = "#374151";
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <Icon active={active} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid #F3F4F6" }}>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              padding: "8px 12px",
              fontFamily: "Archivo, sans-serif",
              fontSize: 13,
              color: "#9CA3AF",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: 8,
              transition: "all 150ms",
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
            <LogoutIcon />
            Logout
          </button>
        </div>
      </aside>

      {/* Top Bar + Content */}
      <div style={{ marginLeft: 240, flex: 1 }}>
        <TopBar pageTitle={getPageTitle()} user={user} onLogout={handleLogout} />
        <main style={{ padding: "32px 40px", minHeight: "calc(100vh - 64px)" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
