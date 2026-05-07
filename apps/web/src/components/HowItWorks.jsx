import { motion } from "framer-motion";

const SectionPill = ({ children }) => (
  <div
    style={{
      display: "inline-block",
      backgroundColor: "#EEF2FF",
      border: "1px solid #C7D2FE",
      borderRadius: 999,
      padding: "4px 14px",
      fontFamily: "Archivo",
      fontWeight: 700,
      fontSize: 11,
      color: "#4F46E5",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
    }}>
    {children}
  </div>
);

const QuestionsIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="20" fill="rgba(255,255,255,0.15)" />
    <path
      d="M24 14c-3.31 0-6 2.69-6 6 0 2.08 1.06 3.91 2.67 4.99.82.55 1.33 1.46 1.33 2.44V28h4v-.57c0-.98.51-1.89 1.33-2.44C28.94 23.91 30 22.08 30 20c0-3.31-2.69-6-6-6z"
      fill="white"
    />
    <rect x="22" y="30" width="4" height="4" rx="2" fill="white" />
  </svg>
);

const BehaviorIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="20" fill="rgba(255,255,255,0.15)" />
    <path d="M14 30l6-8 4 5 4-7 6 10H14z" fill="white" fillOpacity="0.9" />
    <circle cx="32" cy="18" r="3" fill="white" />
  </svg>
);

const VerifyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="20" fill="rgba(255,255,255,0.15)" />
    <path
      d="M16 24l5.5 5.5L33 18"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CARDS = [
  {
    icon: <QuestionsIcon />,
    title: "Show 5 human questions",
    body: "Humora doesn't show crosswalks or buses — it asks human-specific questions across 5 categories: Sensory, Social, Emotional, Memory, and Humor. Each session feels personal, never robotic.",
  },
  {
    icon: <BehaviorIcon />,
    title: "Score behavior, not answers",
    body: "There are no right or wrong answers in Humora — only human signals. We score response timing, answer patterns, mouse entropy, and behavioral consistency across all 5 questions simultaneously.",
  },
  {
    icon: <VerifyIcon />,
    title: "Instant verification",
    body: "After scoring, Humora instantly issues a signed JWT token — valid 5 minutes. Your backend verifies it with one API call. Borderline cases get a bonus question. Failures get a friendly retry. No rage, ever.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{ backgroundColor: "#fff", padding: "100px 0" }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}>
            <SectionPill>How It Works</SectionPill>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontFamily: "Archivo",
              fontWeight: 600,
              fontSize: "clamp(48px, 4vw, 48px)",
              color: "#0F0F0F",
              letterSpacing: "-0.025em",
              margin: "8px 0 0",
            }}>
            How Humora Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              fontFamily: "Archivo",
              fontWeight: 400,
              fontSize: 16,
              color: "#6B7280",
              maxWidth: 580,
              margin: "16px auto 0",
              lineHeight: 1.65,
            }}>
            We ask 5 smart questions. We score behavior, timing, and the
            human-ness of wrong answers. The result? Instant trust with zero
            frustration.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}>
          {CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: i * 0.12, ease: "easeOut" }}
              whileHover={{
                y: -6,
                boxShadow: "0 20px 48px rgba(0,0,0,0.12)",
                borderColor: "#C7D2FE",
                transition: { duration: 0.2 },
              }}
              style={{
                backgroundColor: "#fff",
                borderRadius: 20,
                border: "1px solid #E5E7EB",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                overflow: "hidden",
                cursor: "default",
              }}>
              {/* Icon area — gradient header */}
              <div
                style={{
                  height: 140,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                  borderRadius: "20px 20px 0 0",
                }}>
                {card.icon}
              </div>
              {/* Body */}
              <div style={{ padding: "24px 24px 28px" }}>
                <h3
                  style={{
                    fontFamily: "Archivo",
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#0F0F0F",
                    margin: "0 0 12px",
                    lineHeight: 1.3,
                  }}>
                  {card.title}
                </h3>
                <p
                  style={{
                    fontFamily: "Archivo",
                    fontWeight: 400,
                    fontSize: 14,
                    color: "#374151",
                    margin: 0,
                    lineHeight: 1.65,
                  }}>
                  {card.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
