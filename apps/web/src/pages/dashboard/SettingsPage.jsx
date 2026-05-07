import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@context/AuthContext";
import HumoraVerificationModal from "@components/HumoraVerificationModal";

const SESSIONS = [
  { device: "Chrome on macOS", location: "San Francisco, CA", lastActive: "Now", current: true },
  { device: "Safari on iPhone", location: "San Francisco, CA", lastActive: "2 hours ago", current: false },
  { device: "Firefox on Windows", location: "New York, NY", lastActive: "3 days ago", current: false },
];

const TEAM_MEMBERS = [
  { name: "Alex Johnson", email: "alex@example.com", role: "Admin", joined: "Jan 2024", avatar: "AJ" },
  { name: "Sam Chen", email: "sam@example.com", role: "Developer", joined: "Mar 2024", avatar: "SC" },
  { name: "Jordan Lee", email: "jordan@example.com", role: "Viewer", joined: "Apr 2024", avatar: "JL" },
];

const ROLES = ["Admin", "Developer", "Viewer"];

function Avatar({ initials, size = 40, color = "#4F46E5" }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: Math.round(size * 0.35), color: "#fff" }}>
        {initials}
      </span>
    </div>
  );
}

function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={{
        width: 44,
        height: 24,
        borderRadius: 999,
        backgroundColor: checked ? "#4F46E5" : "#E5E7EB",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        padding: 2,
        position: "relative",
        transition: "background 200ms",
      }}
    >
      <div style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        backgroundColor: "#fff",
        position: "absolute",
        top: 2,
        left: checked ? 22 : 2,
        transition: "left 200ms",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}

function Input({ label, type = "text", value, onChange, placeholder, disabled, hint }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13, color: "#0F0F0F", marginBottom: 8 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: "100%",
          fontFamily: "Archivo, sans-serif",
          fontSize: 14,
          color: disabled ? "#9CA3AF" : "#0F0F0F",
          backgroundColor: disabled ? "#F3F4F6" : "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 10,
          padding: "12px 14px",
          outline: "none",
          transition: "border-color 150ms",
          boxSizing: "border-box",
        }}
        onFocus={(e) => { if (!disabled) e.target.style.borderColor = "#4F46E5"; }}
        onBlur={(e) => { if (!disabled) e.target.style.borderColor = "#E5E7EB"; }}
      />
      {hint && (
        <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#9CA3AF", marginTop: 6, marginBottom: 0 }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function ProfileTab({ user, onSave }) {
  const [name, setName] = useState(user?.name || "Alex Johnson");
  const [email, setEmail] = useState(user?.email || "alex@example.com");
  const [company, setCompany] = useState("Example Inc.");
  const [website, setWebsite] = useState("https://example.com");
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleSave = () => {
    onSave({ name, email, company, website });
  };

  return (
    <div>
      {/* Avatar upload */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <div
          onClick={handleAvatarClick}
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: avatarFile ? "#E5E7EB" : "#4F46E5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            transition: "all 150ms",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {avatarFile ? (
            <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 28, color: "#6B7280" }}>
              {name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
            </span>
          ) : (
            <span style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 28, color: "#fff" }}>
              {name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
            </span>
          )}
          <div
            onMouseEnter={(e) => {
              e.currentTarget.parentElement.style.opacity = 1;
            }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 150ms",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        </div>
        <div>
          <h4 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 15, color: "#0F0F0F", margin: "0 0 4px" }}>
            Profile Picture
          </h4>
          <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280", margin: 0 }}>
            Click to upload a new avatar
          </p>
        </div>
      </div>

      {/* Form fields */}
      <div style={{ maxWidth: 480 }}>
        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          hint={
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Verified
            </span>
          }
        />
        <Input
          label="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Your company"
        />
        <Input
          label="Website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://yourcompany.com"
        />
      </div>

      <button
        onClick={handleSave}
        style={{
          fontFamily: "Archivo, sans-serif",
          fontWeight: 600,
          fontSize: 14,
          color: "#fff",
          backgroundColor: "#4F46E5",
          border: "none",
          borderRadius: 10,
          padding: "12px 24px",
          cursor: "pointer",
          transition: "all 200ms",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#4338CA";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(79,70,229,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#4F46E5";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        Save Changes
      </button>
    </div>
  );
}

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handlePasswordUpdate = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    // In real app, call API
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    alert("Password updated successfully");
  };

  return (
    <div>
      {/* Change password */}
      <div style={{ marginBottom: 32 }}>
        <h4 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 16, color: "#0F0F0F", marginBottom: 16 }}>
          Change Password
        </h4>
        <div style={{ maxWidth: 480 }}>
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <button
          onClick={handlePasswordUpdate}
          style={{
            fontFamily: "Archivo, sans-serif",
            fontWeight: 600,
            fontSize: 14,
            color: "#fff",
            backgroundColor: "#4F46E5",
            border: "none",
            borderRadius: 10,
            padding: "12px 24px",
            cursor: "pointer",
            transition: "all 200ms",
          }}
        >
          Update Password
        </button>
      </div>

      {/* Two-factor authentication */}
      <div style={{ marginBottom: 32 }}>
        <h4 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 16, color: "#0F0F0F", marginBottom: 16 }}>
          Two-Factor Authentication
        </h4>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
          backgroundColor: "#F9FAFB",
          borderRadius: 12,
          marginBottom: 16,
        }}>
          <div>
            <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 14, color: "#0F0F0F", marginBottom: 2 }}>
              Authenticator App
            </div>
            <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280" }}>
              Use an authenticator app to generate codes
            </div>
          </div>
          <Toggle checked={twoFactorEnabled} onChange={setTwoFactorEnabled} />
        </div>

        <AnimatePresence>
          {twoFactorEnabled && !showQR && (
            <motion.button
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              onClick={() => setShowQR(true)}
              style={{
                fontFamily: "Archivo, sans-serif",
                fontWeight: 500,
                fontSize: 13,
                color: "#4F46E5",
                backgroundColor: "#EEF2FF",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              Set up authenticator app
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 24,
                backgroundColor: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: 12,
                maxWidth: 320,
              }}
            >
              {/* QR Code placeholder */}
              <div style={{
                width: 180,
                height: 180,
                backgroundColor: "#0F0F0F",
                borderRadius: 12,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <div style={{
                  width: 160,
                  height: 160,
                  backgroundColor: "#fff",
                  display: "grid",
                  gridTemplateColumns: "repeat(8, 1fr)",
                  gap: 2,
                  padding: 10,
                }}>
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: Math.random() > 0.5 ? "#0F0F0F" : "#fff",
                        borderRadius: 2,
                      }}
                    />
                  ))}
                </div>
              </div>
              <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280", textAlign: "center", marginBottom: 16 }}>
                Scan this QR code with your authenticator app
              </p>
              <button
                onClick={() => { setShowQR(false); setTwoFactorEnabled(true); }}
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  color: "#fff",
                  backgroundColor: "#10B981",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                I've scanned the code
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active sessions */}
      <div>
        <h4 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 16, color: "#0F0F0F", marginBottom: 16 }}>
          Active Sessions
        </h4>
        <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
          {SESSIONS.map((session, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderBottom: i < SESSIONS.length - 1 ? "1px solid #E5E7EB" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: "#F3F4F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 500, fontSize: 13, color: "#0F0F0F" }}>
                    {session.device}
                  </div>
                  <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#9CA3AF" }}>
                    {session.location} · {session.lastActive}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {session.current && (
                  <span style={{
                    fontFamily: "Archivo, sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#059669",
                    backgroundColor: "#ECFDF5",
                    padding: "3px 8px",
                    borderRadius: 6,
                  }}>
                    Current
                  </span>
                )}
                {!session.current && (
                  <button
                    style={{
                      fontFamily: "Archivo, sans-serif",
                      fontWeight: 500,
                      fontSize: 12,
                      color: "#EF4444",
                      backgroundColor: "#FEF2F2",
                      border: "none",
                      borderRadius: 6,
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [limits80, setLimits80] = useState(true);
  const [limits90, setLimits90] = useState(true);
  const [limits100, setLimits100] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [featureAnnouncements, setFeatureAnnouncements] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  return (
    <div>
      {/* Usage limits */}
      <div style={{ marginBottom: 32 }}>
        <h4 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 16, color: "#0F0F0F", marginBottom: 16 }}>
          Usage Notifications
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", backgroundColor: "#F9FAFB", borderRadius: 12 }}>
            <div>
              <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 500, fontSize: 14, color: "#0F0F0F", marginBottom: 2 }}>
                80% usage reached
              </div>
              <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280" }}>
                Get notified when you reach 80% of your monthly limit
              </div>
            </div>
            <Toggle checked={limits80} onChange={setLimits80} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", backgroundColor: "#F9FAFB", borderRadius: 12 }}>
            <div>
              <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 500, fontSize: 14, color: "#0F0F0F", marginBottom: 2 }}>
                90% usage reached
              </div>
              <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280" }}>
                Get notified when you reach 90% of your monthly limit
              </div>
            </div>
            <Toggle checked={limits90} onChange={setLimits90} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", backgroundColor: "#F9FAFB", borderRadius: 12 }}>
            <div>
              <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 500, fontSize: 14, color: "#0F0F0F", marginBottom: 2 }}>
                100% usage reached
              </div>
              <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280" }}>
                Get notified when you reach your monthly limit
              </div>
            </div>
            <Toggle checked={limits100} onChange={setLimits100} />
          </div>
        </div>
      </div>

      {/* Email preferences */}
      <div style={{ marginBottom: 32 }}>
        <h4 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 16, color: "#0F0F0F", marginBottom: 16 }}>
          Email Preferences
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", backgroundColor: "#F9FAFB", borderRadius: 12 }}>
            <div>
              <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 500, fontSize: 14, color: "#0F0F0F", marginBottom: 2 }}>
                Weekly usage digest
              </div>
              <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280" }}>
                Receive a summary of your usage every Monday
              </div>
            </div>
            <Toggle checked={weeklyDigest} onChange={setWeeklyDigest} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", backgroundColor: "#F9FAFB", borderRadius: 12 }}>
            <div>
              <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 500, fontSize: 14, color: "#0F0F0F", marginBottom: 2 }}>
                New feature announcements
              </div>
              <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280" }}>
                Be the first to know about new features and updates
              </div>
            </div>
            <Toggle checked={featureAnnouncements} onChange={setFeatureAnnouncements} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", backgroundColor: "#F9FAFB", borderRadius: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontFamily: "Archivo, sans-serif", fontWeight: 500, fontSize: 14, color: "#0F0F0F" }}>
                  Security alerts
                </span>
                <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 10, fontWeight: 600, color: "#059669", backgroundColor: "#ECFDF5", padding: "2px 6px", borderRadius: 4 }}>
                  REQUIRED
                </span>
              </div>
              <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280" }}>
                Critical security notifications (cannot be disabled)
              </div>
            </div>
            <Toggle checked={securityAlerts} onChange={setSecurityAlerts} disabled />
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamTab() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Developer");
  const isProPlan = false;

  const handleInvite = () => {
    if (inviteEmail) {
      alert(`Invite sent to ${inviteEmail}`);
      setInviteEmail("");
    }
  };

  if (!isProPlan) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 48,
        backgroundColor: "#F9FAFB",
        borderRadius: 16,
        textAlign: "center",
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          backgroundColor: "#EEF2FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h4 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 18, color: "#0F0F0F", marginBottom: 8 }}>
          Team Members
        </h4>
        <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 14, color: "#6B7280", marginBottom: 20, maxWidth: 400 }}>
          Invite team members to collaborate on your Humora account. Available on Pro and higher plans.
        </p>
        <button
          style={{
            fontFamily: "Archivo, sans-serif",
            fontWeight: 600,
            fontSize: 14,
            color: "#fff",
            backgroundColor: "#4F46E5",
            border: "none",
            borderRadius: 10,
            padding: "12px 24px",
            cursor: "pointer",
          }}
        >
          Upgrade to Pro
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Invite member */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 16, color: "#0F0F0F", marginBottom: 16 }}>
          Invite Team Member
        </h4>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
            style={{
              flex: 1,
              fontFamily: "Archivo, sans-serif",
              fontSize: 14,
              color: "#0F0F0F",
              backgroundColor: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 10,
              padding: "12px 14px",
              outline: "none",
            }}
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 14,
              color: "#0F0F0F",
              backgroundColor: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 10,
              padding: "12px 14px",
              cursor: "pointer",
            }}
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <button
            onClick={handleInvite}
            style={{
              fontFamily: "Archivo, sans-serif",
              fontWeight: 600,
              fontSize: 14,
              color: "#fff",
              backgroundColor: "#4F46E5",
              border: "none",
              borderRadius: 10,
              padding: "12px 20px",
              cursor: "pointer",
            }}
          >
            Send Invite
          </button>
        </div>
      </div>

      {/* Team members table */}
      <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 40px",
          padding: "12px 16px",
          backgroundColor: "#F9FAFB",
          borderBottom: "1px solid #E5E7EB",
        }}>
          <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" }}>Member</span>
          <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" }}>Role</span>
          <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" }}>Joined</span>
          <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" }}> </span>
        </div>
        {TEAM_MEMBERS.map((member, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 40px",
              alignItems: "center",
              padding: "14px 16px",
              borderBottom: i < TEAM_MEMBERS.length - 1 ? "1px solid #E5E7EB" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar initials={member.avatar} size={36} />
              <div>
                <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 500, fontSize: 13, color: "#0F0F0F" }}>
                  {member.name}
                </div>
                <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#9CA3AF" }}>
                  {member.email}
                </div>
              </div>
            </div>
            <div>
              <select
                defaultValue={member.role}
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontSize: 13,
                  color: "#374151",
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 6,
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280" }}>
              {member.joined}
            </div>
            <div />
            <div>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 6,
                  color: "#9CA3AF",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DangerZoneTab() {
  const [deleteText, setDeleteText] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const handleDeleteClick = () => {
    if (deleteText === "DELETE") {
      setShowVerification(true);
    }
  };

  const handleVerified = useCallback(() => {
    setShowVerification(false);
    alert("Account deletion scheduled. You have 30 days to recover your account.");
    setDeleteText("");
    setShowConfirm(false);
  }, []);

  return (
    <>
      <HumoraVerificationModal
        isOpen={showVerification}
        onVerified={handleVerified}
        onClose={() => setShowVerification(false)}
      />
    <div>
      <div style={{
        backgroundColor: "#FFF5F5",
        border: "1px solid #FECACA",
        borderRadius: 16,
        padding: 24,
      }}>
        <h4 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 16, color: "#991B1B", marginBottom: 8 }}>
          Delete Account
        </h4>
        <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#991B1B", marginBottom: 16 }}>
          Once you delete your account, all your data will be permanently deleted after 30 days. This action cannot be undone.
        </p>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              fontFamily: "Archivo, sans-serif",
              fontWeight: 600,
              fontSize: 13,
              color: "#EF4444",
              backgroundColor: "#fff",
              border: "1px solid #EF4444",
              borderRadius: 10,
              padding: "10px 16px",
              cursor: "pointer",
              transition: "all 150ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#EF4444";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fff";
              e.currentTarget.style.color = "#EF4444";
            }}
          >
            Delete Account
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 16 }}
          >
            <div style={{
              backgroundColor: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 10,
              padding: "14px 16px",
              marginBottom: 16,
            }}>
              <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#991B1B", marginBottom: 8 }}>
                <strong>Warning:</strong> This will schedule your account for deletion in 30 days.
              </div>
              <label style={{ display: "block", fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 12, color: "#991B1B", marginBottom: 8 }}>
                Type "DELETE" to confirm
              </label>
              <input
                type="text"
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                placeholder="Type DELETE here"
                style={{
                  width: "100%",
                  maxWidth: 280,
                  fontFamily: "Archivo, sans-serif",
                  fontSize: 14,
                  color: "#0F0F0F",
                  backgroundColor: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  padding: "10px 12px",
                  marginBottom: 12,
                }}
              />
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={handleDeleteClick}
                  disabled={deleteText !== "DELETE"}
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "#fff",
                    backgroundColor: deleteText === "DELETE" ? "#EF4444" : "#FECACA",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 16px",
                    cursor: deleteText === "DELETE" ? "pointer" : "not-allowed",
                  }}
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => { setShowConfirm(false); setDeleteText(""); }}
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontWeight: 500,
                    fontSize: 13,
                    color: "#374151",
                    backgroundColor: "#F3F4F6",
                    border: "none",
                    borderRadius: 8,
                    padding: "10px 16px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
    </>
  );
}

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "notifications", label: "Notifications" },
  { id: "team", label: "Team" },
  { id: "danger", label: "Danger Zone" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user: authUser } = useAuth();
  const [user, setUser] = useState({ name: authUser?.name || "", email: authUser?.email || "" });

  const handleSaveProfile = (data) => {
    setUser({ ...user, ...data });
    alert("Profile saved successfully");
  };

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab user={user} onSave={handleSaveProfile} />;
      case "security":
        return <SecurityTab />;
      case "notifications":
        return <NotificationsTab />;
      case "team":
        return <TeamTab />;
      case "danger":
        return <DangerZoneTab />;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid #E5E7EB", paddingBottom: 0 }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              fontFamily: "Archivo, sans-serif",
              fontWeight: activeTab === tab.id ? 600 : 400,
              fontSize: 14,
              color: activeTab === tab.id ? "#4F46E5" : "#6B7280",
              backgroundColor: "transparent",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #4F46E5" : "2px solid transparent",
              borderRadius: 0,
              padding: "12px 20px",
              cursor: "pointer",
              transition: "all 120ms",
              marginBottom: -1,
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.color = "#0F0F0F";
                e.currentTarget.style.backgroundColor = "#F9FAFB";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.color = "#6B7280";
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        {renderTab()}
      </motion.div>
    </div>
  );
}
