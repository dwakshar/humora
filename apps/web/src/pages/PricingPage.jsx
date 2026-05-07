import Footer from "@components/Footer";
import Navbar from "@components/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { Link } from "react-router-dom";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    annual: 0,
    sub: "Perfect for personal projects and testing",
    cta: "Get Started Free",
    ctaHref: "/signup",
    dark: false,
    featured: false,
    features: [
      { label: "1,000 verifications/month", ok: true },
      { label: "1 domain", ok: true },
      { label: "Basic behavioral scoring", ok: true },
      { label: "JWT token verification", ok: true },
      { label: "postMessage API", ok: true },
      { label: "Community support", ok: true },
      { label: "Analytics dashboard", ok: false },
      { label: "Custom questions", ok: false },
      { label: "Priority support", ok: false },
    ],
  },
  {
    id: "starter",
    name: "Starter",
    monthly: 9,
    annual: 7,
    annualTotal: 84,
    sub: "For indie developers and small projects",
    cta: "Start Free Trial",
    ctaHref: "/signup",
    dark: false,
    featured: true,
    features: [
      { label: "10,000 verifications/month", ok: true },
      { label: "3 domains", ok: true },
      { label: "Full behavioral scoring", ok: true },
      { label: "Analytics dashboard", ok: true },
      { label: "Email support (48hr)", ok: true },
      { label: "JWT + replay protection", ok: true },
      { label: "postMessage API", ok: true },
      { label: "Integration guides", ok: true },
      { label: "Custom questions", ok: false },
      { label: "Priority support", ok: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 29,
    annual: 23,
    annualTotal: 276,
    sub: "For growing startups and teams",
    cta: "Start Free Trial",
    ctaHref: "/signup",
    dark: false,
    featured: false,
    features: [
      { label: "100,000 verifications/month", ok: true },
      { label: "Unlimited domains", ok: true },
      { label: "Full behavioral scoring", ok: true },
      { label: "Advanced analytics", ok: true },
      { label: "Priority support (12hr)", ok: true },
      { label: "API access", ok: true },
      { label: "Custom question sets", ok: true },
      { label: "Webhook events", ok: true },
      { label: "CSV data export", ok: true },
      { label: "Multiple team members", ok: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: null,
    annual: null,
    sub: "For large teams and compliance needs",
    cta: "Contact Sales",
    ctaHref: "/contact",
    dark: true,
    featured: false,
    features: [
      { label: "Unlimited verifications", ok: true },
      { label: "Unlimited domains", ok: true },
      { label: "SLA guarantee (99.9% uptime)", ok: true },
      { label: "SSO / SAML authentication", ok: true },
      { label: "Dedicated support engineer", ok: true },
      { label: "On-premise deployment", ok: true },
      { label: "Custom question bank", ok: true },
      { label: "Advanced security audit logs", ok: true },
      { label: "Custom contract & invoicing", ok: true },
      { label: "Priority onboarding", ok: true },
    ],
  },
];

const TABLE_SECTIONS = [
  {
    category: "Verification",
    rows: [
      { f: "Monthly verifications", v: ["1K", "10K", "100K", "Unlimited"] },
      { f: "Domains", v: ["1", "3", "Unlimited", "Unlimited"] },
      { f: "Behavioral scoring", v: ["Basic", "Full", "Full", "Full"] },
      { f: "JWT token verification", v: [true, true, true, true] },
      { f: "Replay protection", v: [true, true, true, true] },
      { f: "Timing analysis", v: [true, true, true, true] },
      { f: "Mouse entropy tracking", v: [false, true, true, true] },
    ],
  },
  {
    category: "Questions",
    rows: [
      { f: "Question bank (30 Qs)", v: [true, true, true, true] },
      { f: "Custom questions", v: [false, false, true, true] },
      { f: "Question analytics", v: [false, true, true, true] },
    ],
  },
  {
    category: "Analytics",
    rows: [
      { f: "Basic dashboard", v: [false, true, true, true] },
      { f: "Advanced analytics", v: [false, false, true, true] },
      { f: "CSV export", v: [false, false, true, true] },
      { f: "Webhook events", v: [false, false, true, true] },
    ],
  },
  {
    category: "Support",
    rows: [
      { f: "Community support", v: [true, true, true, true] },
      { f: "Email support", v: [false, "48hr", "12hr", "1hr"] },
      { f: "Dedicated engineer", v: [false, false, false, true] },
      { f: "SLA guarantee", v: [false, false, false, "99.9%"] },
    ],
  },
  {
    category: "Security & Compliance",
    rows: [
      { f: "GDPR friendly", v: [true, true, true, true] },
      { f: "SSO / SAML", v: [false, false, false, true] },
      { f: "Audit logs", v: [false, false, false, true] },
      { f: "On-premise", v: [false, false, false, true] },
    ],
  },
];

const FAQS = [
  {
    q: "How is Humora different from reCAPTCHA?",
    a: "reCAPTCHA asks you to identify objects in images — a task bots are now better at than humans. Humora asks questions rooted in lived human experience: sensory memories, social awkwardness, emotional micro-decisions. These require genuine human context that AIs and bots can't reliably fake.",
  },
  {
    q: "Can bots pass Humora?",
    a: "Sophisticated bots can attempt it, which is why we combine answer scoring with response timing and behavioral signals. A bot answering in 180ms with perfectly neutral answers fails on timing and behavior even if its answers score reasonably well. We also rotate from 7,776 possible session combinations.",
  },
  {
    q: "What happens if a real user fails?",
    a: 'Borderline scores (35–49/70) trigger one bonus question rather than an immediate fail. Hard fails get a friendly "Something felt off" screen with a Try Again button. No user is permanently locked out. The experience stays human even when it doesn\'t pass.',
  },
  {
    q: "How do I integrate Humora?",
    a: "One script tag, one div. Exactly like reCAPTCHA. If you've used reCAPTCHA before, you already know how to use Humora. Full guides available for HTML, React, Next.js, Vue, WordPress, Laravel, and Django.",
  },
  {
    q: "Is Humora GDPR compliant?",
    a: "Yes. Humora collects no personally identifiable information. No cookies. No cross-site tracking. No data is sent to Google or any third party. Everything stays between your site, your user's browser, and your backend.",
  },
  {
    q: "Can I self-host Humora?",
    a: "Yes. The widget is open source and can be deployed on your own infrastructure. Enterprise plans include full on-premise deployment support and a dedicated implementation engineer.",
  },
  {
    q: "What's the verification token and how does it work?",
    a: "On pass, Humora generates a signed JWT token (HS256, 5-minute expiry) containing the session score, verdict, and session ID. Your backend verifies this token with one POST request to our API. Used tokens are invalidated immediately to prevent replay attacks.",
  },
  {
    q: "Do you offer a free trial on paid plans?",
    a: "Yes. Starter and Pro both come with a 14-day free trial. No credit card required to start. You'll be notified before any charge.",
  },
  {
    q: "What if I exceed my monthly verification limit?",
    a: 'We\'ll notify you at 80% and 95% usage. If you hit the limit, the widget falls back to a simple "I am human" checkbox mode rather than blocking your users entirely. You can upgrade instantly from the dashboard.',
  },
  {
    q: "How do I cancel?",
    a: "From your dashboard, one click. No calls, no retention flows, no dark patterns. Your data is available for 30 days after cancellation.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function BillingToggle({ billing, set }) {
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div
        style={{
          display: "inline-flex",
          backgroundColor: "#F3F4F6",
          borderRadius: 10,
          padding: 4,
          position: "relative",
        }}>
        <motion.div
          animate={{ x: billing === "monthly" ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
          style={{
            position: "absolute",
            top: 4,
            bottom: 4,
            left: 4,
            width: "calc(50% - 4px)",
            backgroundColor: "#fff",
            borderRadius: 8,
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        />
        {["monthly", "annual"].map((b) => (
          <button
            key={b}
            onClick={() => set(b)}
            style={{
              position: "relative",
              zIndex: 1,
              padding: "9px 0",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontFamily: "Archivo",
              fontWeight: billing === b ? 600 : 400,
              fontSize: 14,
              color: billing === b ? "#0F0F0F" : "#6B7280",
              transition: "color 150ms",
              width: 90,
              textAlign: "center",
            }}>
            {b === "monthly" ? "Monthly" : "Annual"}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {billing === "annual" && (
          <motion.span
            key="save-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18 }}
            style={{
              backgroundColor: "#ECFDF5",
              color: "#065F46",
              border: "1px solid #A7F3D0",
              borderRadius: 999,
              padding: "3px 9px",
              fontFamily: "Archivo",
              fontWeight: 600,
              fontSize: 11,
              pointerEvents: "none",
              display: "inline-block",
            }}>
            Save 20%
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function Check({ ok, dark }) {
  if (ok === true)
    return (
      <span
        style={{
          color: "#10B981",
          fontWeight: 700,
          fontSize: 14,
          flexShrink: 0,
        }}>
        ✓
      </span>
    );
  if (ok === false)
    return (
      <span
        style={{
          color: dark ? "#4B5563" : "#D1D5DB",
          fontWeight: 700,
          fontSize: 14,
          flexShrink: 0,
        }}>
        ✗
      </span>
    );
  return null;
}

function PricingCard({ plan, billing }) {
  const price = billing === "monthly" ? plan.monthly : plan.annual;
  const cardStyle = {
    backgroundColor: plan.dark ? "#0F0F0F" : "#fff",
    borderRadius: 20,
    padding: "32px 28px",
    border: plan.featured
      ? "2px solid #4F46E5"
      : plan.dark
      ? "1.5px solid #1F2937"
      : "1.5px solid #E5E7EB",
    boxShadow: plan.featured
      ? "0 0 0 4px #EEF2FF, 0 8px 32px rgba(79,70,229,0.12)"
      : plan.dark
      ? "0 4px 24px rgba(0,0,0,0.3)"
      : "0 2px 8px rgba(0,0,0,0.04)",
    position: "relative",
    transform: plan.featured ? "scale(1.03)" : "scale(1)",
    flex: 1,
    minWidth: 220,
    display: "flex",
    flexDirection: "column",
    transition: "box-shadow 200ms",
  };

  const nameColor = plan.dark
    ? "#9CA3AF"
    : plan.featured
    ? "#4F46E5"
    : "#9CA3AF";
  const textColor = plan.dark ? "#fff" : "#0F0F0F";
  const subColor = plan.dark ? "rgba(255,255,255,0.55)" : "#6B7280";
  const featureText = plan.dark ? "rgba(255,255,255,0.75)" : "#374151";
  const dividerClr = plan.dark ? "#1F2937" : "#E5E7EB";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={cardStyle}>
      {/* Most Popular badge */}
      {plan.featured && (
        <div
          style={{
            position: "absolute",
            top: -14,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#4F46E5",
            color: "#fff",
            fontFamily: "Archivo",
            fontWeight: 600,
            fontSize: 11,
            borderRadius: 999,
            padding: "4px 16px",
            whiteSpace: "nowrap",
          }}>
          Most Popular
        </div>
      )}

      {/* Plan name */}
      <div
        style={{
          fontFamily: "Archivo",
          fontWeight: 700,
          fontSize: 12,
          color: nameColor,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 16,
        }}>
        {plan.name}
      </div>

      {/* Price */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 4,
          marginBottom: 6,
        }}>
        {plan.monthly !== null ? (
          <>
            <span
              style={{
                fontFamily: "Archivo",
                fontWeight: 700,
                fontSize: 28,
                color: textColor,
                lineHeight: 1,
                alignSelf: "flex-start",
                marginTop: 8,
              }}>
              $
            </span>
            <div
              style={{
                overflow: "hidden",
                height: 56,
                display: "flex",
                alignItems: "flex-end",
              }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${plan.id}-${billing}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  style={{
                    fontFamily: "Archivo",
                    fontWeight: 900,
                    fontSize: 52,
                    color: textColor,
                    lineHeight: 1,
                    display: "block",
                  }}>
                  {price}
                </motion.span>
              </AnimatePresence>
            </div>
            <span
              style={{
                fontFamily: "Archivo",
                fontWeight: 400,
                fontSize: 14,
                color: subColor,
                paddingBottom: 10,
              }}>
              /month
            </span>
          </>
        ) : (
          <span
            style={{
              fontFamily: "Archivo",
              fontWeight: 900,
              fontSize: 38,
              color: textColor,
              lineHeight: 1,
            }}>
            Custom
          </span>
        )}
      </div>

      {/* Annual note */}
      {billing === "annual" && plan.annualTotal && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ marginBottom: 4 }}>
            <span
              style={{
                fontFamily: "Archivo",
                fontWeight: 500,
                fontSize: 12,
                color: "#10B981",
              }}>
              Billed ${plan.annualTotal}/year
            </span>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Sub */}
      <p
        style={{
          fontFamily: "Archivo",
          fontWeight: 400,
          fontSize: 13,
          color: subColor,
          margin: "10px 0 0",
          lineHeight: 1.5,
        }}>
        {plan.sub}
      </p>

      {/* Divider */}
      <div
        style={{ height: 1, backgroundColor: dividerClr, margin: "22px 0" }}
      />

      {/* Features */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {plan.features.map((f, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <Check ok={f.ok} dark={plan.dark} />
            <span
              style={{
                fontFamily: "Archivo",
                fontWeight: 400,
                fontSize: 13,
                color: f.ok ? featureText : plan.dark ? "#4B5563" : "#9CA3AF",
                lineHeight: 1.4,
                textDecoration: f.ok ? "none" : "none",
              }}>
              {f.label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 28 }}>
        {plan.featured || (!plan.dark && plan.id !== "free") ? (
          <Link
            to={plan.ctaHref}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 52,
              borderRadius: 14,
              width: "100%",
              backgroundColor: "#4F46E5",
              color: "#fff",
              fontFamily: "Archivo",
              fontWeight: 600,
              fontSize: 15,
              textDecoration: "none",
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#4338CA";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(79,70,229,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#4F46E5";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}>
            {plan.cta}
          </Link>
        ) : plan.dark ? (
          <Link
            to={plan.ctaHref}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 52,
              borderRadius: 14,
              width: "100%",
              backgroundColor: "transparent",
              color: "#fff",
              fontFamily: "Archivo",
              fontWeight: 600,
              fontSize: 15,
              textDecoration: "none",
              border: "1.5px solid #374151",
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#1F2937";
              e.currentTarget.style.borderColor = "#4B5563";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "#374151";
            }}>
            {plan.cta}
          </Link>
        ) : (
          <Link
            to={plan.ctaHref}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 52,
              borderRadius: 14,
              width: "100%",
              backgroundColor: "#fff",
              color: "#374151",
              fontFamily: "Archivo",
              fontWeight: 600,
              fontSize: 15,
              textDecoration: "none",
              border: "1.5px solid #E5E7EB",
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#4F46E5";
              e.currentTarget.style.color = "#4F46E5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.color = "#374151";
            }}>
            {plan.cta}
          </Link>
        )}
      </div>
    </motion.div>
  );
}

function TableCell({ v, colIdx }) {
  const isProCol = colIdx === 2;
  const borderLeft = isProCol ? "2px solid #EEF2FF" : "none";

  if (v === true)
    return (
      <td style={{ padding: "12px 20px", textAlign: "center", borderLeft }}>
        <span style={{ color: "#10B981", fontWeight: 700, fontSize: 16 }}>
          ✓
        </span>
      </td>
    );
  if (v === false)
    return (
      <td style={{ padding: "12px 20px", textAlign: "center", borderLeft }}>
        <span style={{ color: "#E5E7EB", fontWeight: 700, fontSize: 16 }}>
          ✗
        </span>
      </td>
    );
  return (
    <td
      style={{
        padding: "12px 20px",
        textAlign: "center",
        borderLeft,
        fontFamily: "Archivo",
        fontWeight: 500,
        fontSize: 13,
        color: "#374151",
      }}>
      {v}
    </td>
  );
}

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{ borderBottom: "1px solid #E5E7EB" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "none",
          border: "none",
          padding: "20px 0",
          cursor: "pointer",
          gap: 16,
        }}>
        <span
          style={{
            fontFamily: "Archivo",
            fontWeight: 600,
            fontSize: 16,
            color: "#0F0F0F",
            textAlign: "left",
            lineHeight: 1.4,
          }}>
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            color: "#4F46E5",
            fontSize: 22,
            fontWeight: 300,
            lineHeight: 1,
            flexShrink: 0,
            display: "block",
          }}>
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ overflow: "hidden" }}>
            <p
              style={{
                fontFamily: "Archivo",
                fontWeight: 400,
                fontSize: 15,
                color: "#374151",
                lineHeight: 1.75,
                margin: "0 0 20px",
                paddingRight: 32,
              }}>
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly");

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64 }}>
        {/* ── Section 1: Hero ──────────────────────────────────────────────── */}
        <section style={{ backgroundColor: "#fff", padding: "100px 0 80px" }}>
          <div
            style={{
              maxWidth: 700,
              margin: "0 auto",
              padding: "0 24px",
              textAlign: "center",
            }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}>
              <div
                style={{
                  display: "inline-block",
                  marginBottom: 24,
                  backgroundColor: "#EEF2FF",
                  border: "1px solid #C7D2FE",
                  borderRadius: 999,
                  padding: "6px 16px",
                  fontFamily: "Archivo",
                  fontWeight: 500,
                  fontSize: 13,
                  color: "#4F46E5",
                }}>
                Transparent pricing. No surprises.
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              style={{
                fontFamily: "Archivo",
                fontWeight: 600,
                fontSize: "clamp(40px, 6vw, 56px)",
                color: "#0F0F0F",
                letterSpacing: "-0.02em",
                margin: "0 0 20px",
                lineHeight: 1.1,
              }}>
              Simple, honest pricing.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
              style={{
                fontFamily: "Archivo",
                fontWeight: 400,
                fontSize: 18,
                color: "#6B7280",
                margin: "0 0 32px",
                lineHeight: 1.6,
              }}>
              Start free. Scale when you need to.
              <br />
              Cancel anytime. No contracts. No hidden fees.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ display: "flex", justifyContent: "center" }}>
              <BillingToggle billing={billing} set={setBilling} />
            </motion.div>
          </div>
        </section>

        {/* ── Section 2: Cards ─────────────────────────────────────────────── */}
        <section style={{ backgroundColor: "#fff", padding: "0 0 100px" }}>
          <div style={{ maxWidth: 1500, margin: "0 auto", padding: "0 24px" }}>
            <div
              style={{
                display: "flex",
                gap: 24,
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}>
              {PLANS.map((plan) => (
                <PricingCard key={plan.id} plan={plan} billing={billing} />
              ))}
            </div>
            {/* Trial note */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              style={{
                fontFamily: "Archivo",
                fontSize: 13,
                color: "#9CA3AF",
                textAlign: "center",
                marginTop: 36,
              }}>
              All paid plans include a 14-day free trial · No credit card
              required
            </motion.p>
          </div>
        </section>

        {/* ── Section 3: Comparison Table ──────────────────────────────────── */}
        <section style={{ backgroundColor: "#F5F5F7", padding: "80px 0" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              style={{
                fontFamily: "Archivo",
                fontWeight: 600,
                fontSize: "clamp(28px, 4vw, 38px)",
                color: "#0F0F0F",
                textAlign: "center",
                margin: "0 0 40px",
                letterSpacing: "-0.02em",
              }}>
              Compare all features
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.1 }}
              style={{
                overflowX: "auto",
                borderRadius: 16,
                boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                border: "1px solid #E5E7EB",
              }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 640,
                }}>
                <thead>
                  <tr style={{ backgroundColor: "#4F46E5" }}>
                    <th
                      style={{
                        padding: "16px 20px",
                        textAlign: "left",
                        fontFamily: "Archivo",
                        fontWeight: 700,
                        fontSize: 13,
                        color: "rgba(255,255,255,0.7)",
                        width: "35%",
                      }}>
                      Feature
                    </th>
                    {["Free", "Starter", "Pro", "Enterprise"].map((h, i) => (
                      <th
                        key={h}
                        style={{
                          padding: "16px 20px",
                          textAlign: "center",
                          fontFamily: "Archivo",
                          fontWeight: 700,
                          fontSize: 14,
                          color: "#fff",
                          borderLeft:
                            i === 2
                              ? "2px solid rgba(255,255,255,0.15)"
                              : "none",
                        }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TABLE_SECTIONS.map((section, si) => (
                    <React.Fragment key={`section-${si}`}>
                      <tr style={{ backgroundColor: "#F9FAFB" }}>
                        <td
                          colSpan={5}
                          style={{
                            padding: "10px 20px",
                            fontFamily: "Archivo",
                            fontWeight: 700,
                            fontSize: 11,
                            color: "#4F46E5",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            borderTop: si > 0 ? "1px solid #E5E7EB" : "none",
                          }}>
                          {section.category}
                        </td>
                      </tr>
                      {section.rows.map((row, ri) => (
                        <tr
                          key={`row-${si}-${ri}`}
                          style={{
                            backgroundColor: ri % 2 === 0 ? "#fff" : "#F9FAFB",
                            borderTop: "1px solid #F3F4F6",
                          }}>
                          <td
                            style={{
                              padding: "12px 20px",
                              fontFamily: "Archivo",
                              fontWeight: 400,
                              fontSize: 13,
                              color: "#374151",
                            }}>
                            {row.f}
                          </td>
                          {row.v.map((v, ci) => (
                            <TableCell key={ci} v={v} colIdx={ci} />
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* ── Section 4: FAQ ────────────────────────────────────────────────── */}
        <section style={{ backgroundColor: "#fff", padding: "80px 0" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
              style={{
                fontFamily: "Archivo",
                fontWeight: 600,
                fontSize: "clamp(28px, 4vw, 38px)",
                color: "#0F0F0F",
                textAlign: "center",
                margin: "0 0 48px",
                letterSpacing: "-0.02em",
              }}>
              Frequently asked questions
            </motion.h2>
            <div>
              {FAQS.map((item, i) => (
                <FAQItem key={i} item={item} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 5: Bottom CTA ─────────────────────────────────────────── */}
        <div style={{ padding: "0 32px 80px" }}>
          <motion.section
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            style={{
              backgroundColor: "#4F46E5",
              borderRadius: 24,
              padding: "80px 32px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}>
            {/* Subtle orb */}
            <div
              style={{
                position: "absolute",
                top: -80,
                right: -80,
                width: 360,
                height: 360,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -60,
                left: -60,
                width: 280,
                height: 280,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <h2
              style={{
                fontFamily: "Archivo",
                fontWeight: 600,
                fontSize: "clamp(40px, 6vw, 48px)",
                color: "#fff",
                margin: "0 0 16px",
                letterSpacing: "-0.02em",
                position: "relative",
                zIndex: 1,
              }}>
              Start free. Upgrade when you're ready.
            </h2>
            <p
              style={{
                fontFamily: "Archivo",
                fontWeight: 400,
                fontSize: 17,
                color: "rgba(255,255,255,0.8)",
                margin: "0 auto 40px",
                maxWidth: 460,
                lineHeight: 1.65,
                position: "relative",
                zIndex: 1,
              }}>
              No credit card. No commitment.
              <br />
              No traffic lights. Ever.
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                flexWrap: "wrap",
                position: "relative",
                zIndex: 1,
              }}>
              <Link
                to="/signup"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 52,
                  borderRadius: 14,
                  padding: "0 28px",
                  backgroundColor: "#fff",
                  color: "#4F46E5",
                  fontFamily: "Archivo",
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: "none",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.9)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.transform = "none";
                }}>
                Get Started Free
              </Link>
              <Link
                to="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: 52,
                  borderRadius: 14,
                  padding: "0 28px",
                  backgroundColor: "transparent",
                  color: "#fff",
                  fontFamily: "Archivo",
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: "none",
                  border: "1.5px solid rgba(255,255,255,0.4)",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.1)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                }}>
                Talk to Sales
              </Link>
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </>
  );
}
