import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import HumoraVerificationModal from "@components/HumoraVerificationModal";

const CHANNELS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    title: "Email Support",
    desc: "Get a reply within 24 hours on business days.",
    action: "support@humora.io",
    href: "mailto:support@humora.io",
    badge: null,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Discord Community",
    desc: "Chat with the team and other developers in real time.",
    action: "Join Discord",
    href: "https://discord.gg/humora",
    badge: "Fast",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: "Documentation",
    desc: "Full API reference, guides, and integration examples.",
    action: "Browse Docs",
    href: "/docs",
    badge: null,
  },
];

const FAQS = [
  {
    q: "How do I get my sitekey?",
    a: "Go to My Sites → Add a site. Once created, your sitekey appears in the API Keys page. Use it in the widget's data-sitekey attribute.",
  },
  {
    q: "What counts as a verification?",
    a: "Every successful human verification (verdict: 'pass') increments your monthly counter. Failed or incomplete sessions are not counted.",
  },
  {
    q: "Can I use Humora on multiple domains?",
    a: "Yes. Each domain needs its own sitekey. Free plan supports 1 domain, Starter 3, and Pro supports unlimited domains.",
  },
  {
    q: "How do I verify a token on my server?",
    a: "POST the token to POST /api/verify with your sitekey. Humora validates the JWT signature, checks it hasn't been used, and confirms the domain.",
  },
  {
    q: "What happens if I exceed my monthly limit?",
    a: "Verifications are paused until the next billing cycle or you upgrade. Your site won't break — the widget will show an error state.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Go to Plan & Usage → Cancel Subscription. Your plan stays active until the end of the billing period.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #F3F4F6" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "16px 0",
          background: "none", border: "none", cursor: "pointer",
          textAlign: "left", gap: 12,
        }}
      >
        <span style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 14, color: "#0F0F0F" }}>
          {q}
        </span>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 200ms" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: "hidden" }}
          >
            <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 14, color: "#6B7280", lineHeight: 1.6, paddingBottom: 16, margin: 0 }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TicketForm() {
  const [form, setForm]   = useState({ subject: "", category: "general", message: "" });
  const [sent, setSent]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  function set(k) { return e => setForm(f => ({ ...f, [k]: e.target.value })); }

  function submit(e) {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) return;
    setShowVerification(true);
  }

  const handleVerified = useCallback(async () => {
    setShowVerification(false);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  }, []);

  const inputStyle = {
    width: "100%", fontFamily: "Archivo, sans-serif", fontSize: 14, color: "#0F0F0F",
    border: "1.5px solid #E5E7EB", borderRadius: 10, padding: "10px 14px",
    outline: "none", background: "#fff", boxSizing: "border-box", transition: "border-color 150ms",
  };

  return (
    <>
      <HumoraVerificationModal
        isOpen={showVerification}
        onVerified={handleVerified}
        onClose={() => setShowVerification(false)}
      />
      {sent ? (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: "center", padding: "40px 24px" }}
      >
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 16, color: "#0F0F0F", marginBottom: 6 }}>Ticket submitted!</p>
        <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280", marginBottom: 20 }}>We'll get back to you within 24 hours.</p>
        <button
          onClick={() => { setSent(false); setForm({ subject: "", category: "general", message: "" }); }}
          style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#4F46E5", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
        >
          Submit another ticket
        </button>
      </motion.div>
      ) : (
    <form onSubmit={submit}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 6 }}>
          Category
        </label>
        <select
          value={form.category}
          onChange={set("category")}
          style={{ ...inputStyle, appearance: "none" }}
          onFocus={e => (e.target.style.borderColor = "#4F46E5")}
          onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
        >
          <option value="general">General Question</option>
          <option value="billing">Billing & Payments</option>
          <option value="technical">Technical Issue</option>
          <option value="integration">Integration Help</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 6 }}>
          Subject
        </label>
        <input
          type="text"
          placeholder="Brief description of your issue"
          value={form.subject}
          onChange={set("subject")}
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = "#4F46E5")}
          onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 6 }}>
          Message
        </label>
        <textarea
          placeholder="Describe your issue in detail. Include any error messages or steps to reproduce."
          value={form.message}
          onChange={set("message")}
          rows={5}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          onFocus={e => (e.target.style.borderColor = "#4F46E5")}
          onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !form.subject.trim() || !form.message.trim()}
        style={{
          width: "100%", height: 48,
          background: loading ? "#6366F1" : "#4F46E5", border: "none",
          borderRadius: 12, fontFamily: "Archivo, sans-serif", fontWeight: 600,
          fontSize: 15, color: "#fff",
          cursor: loading || !form.subject.trim() || !form.message.trim() ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          opacity: !form.subject.trim() || !form.message.trim() ? 0.6 : 1,
          transition: "all 200ms",
        }}
      >
        {loading ? (
          <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        ) : "Send Ticket"}
      </button>
    </form>
      )}
    </>
  );
}

export default function SupportPage() {
  return (
    <div style={{ fontFamily: "Archivo, sans-serif", maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "Archivo, sans-serif", fontSize: 26, fontWeight: 800, color: "#0F0F0F", margin: "0 0 6px" }}>
            Support
          </h1>
          <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 15, color: "#6B7280", margin: 0 }}>
            We're here to help. Choose the fastest channel for your issue.
          </p>
        </div>
      </div>

      {/* Contact channels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 40 }}>
        {CHANNELS.map(ch => (
          <a
            key={ch.title}
            href={ch.href}
            target={ch.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            style={{
              display: "flex", flexDirection: "column",
              background: "#fff", border: "1px solid #E5E7EB",
              borderRadius: 14, padding: "20px 22px",
              textDecoration: "none", transition: "all 200ms",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "#C7D2FE";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(79,70,229,0.08)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "none";
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {ch.icon}
              </div>
              {ch.badge && (
                <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600, color: "#065F46", background: "#ECFDF5", padding: "2px 8px", borderRadius: 999 }}>
                  {ch.badge}
                </span>
              )}
            </div>
            <p style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 15, color: "#0F0F0F", margin: "0 0 6px" }}>{ch.title}</p>
            <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280", margin: "0 0 14px", lineHeight: 1.5 }}>{ch.desc}</p>
            <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: 600, color: "#4F46E5", marginTop: "auto" }}>
              {ch.action} →
            </span>
          </a>
        ))}
      </div>

      {/* Two-column: FAQ + Ticket form */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        {/* FAQ */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "24px 28px" }}>
          <h2 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 17, color: "#0F0F0F", margin: "0 0 20px" }}>
            Frequently Asked Questions
          </h2>
          {FAQS.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #F3F4F6" }}>
            <Link to="/docs" style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#4F46E5", fontWeight: 600, textDecoration: "none" }}>
              Browse full documentation →
            </Link>
          </div>
        </div>

        {/* Submit ticket */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "24px 28px" }}>
          <h2 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 17, color: "#0F0F0F", margin: "0 0 6px" }}>
            Submit a Ticket
          </h2>
          <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280", margin: "0 0 20px" }}>
            Can't find an answer? We'll respond within 24 hours.
          </p>
          <TicketForm />
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
