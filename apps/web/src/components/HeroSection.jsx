import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay },
});

const CARDS = [
  {
    label: "Question 2 of 5",
    question: "You haven't slept. The meeting starts in 5 minutes. You...",
    options: [
      "Panic visibly",
      "Fake a smile",
      "Caffeinate aggressively",
      "Reschedule boldly",
    ],
    picked: 2,
    delay: 0.4,
    shadow: "0 8px 32px rgba(0,0,0,0.1)",
    border: "1px solid #E5E7EB",
  },
  {
    label: "Question 3 of 5",
    question: "The vending machine gives you an extra snack. You...",
    options: [
      "Keep it — machine's fault",
      "Tell someone immediately",
      "Walk away fast",
      "Leave it on top",
    ],
    picked: 0,
    delay: 0.5,
    shadow: "0 16px 48px rgba(79,70,229,0.18)",
    border: "1px solid #C7D2FE",
  },
  {
    label: "Question 4 of 5",
    question: "Your friend sends a 9-minute voice note. You...",
    options: [
      "Listen fully",
      "Speed it to 2x",
      "Skim the transcript",
      "Reply with a voice note",
    ],
    picked: 1,
    delay: 0.6,
    shadow: "0 8px 32px rgba(0,0,0,0.1)",
    border: "1px solid #E5E7EB",
  },
];

function WidgetCard({ card }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: card.delay }}
      whileHover={{
        y: -8,
        boxShadow: "0 24px 56px rgba(0,0,0,0.14)",
        transition: { duration: 0.2 },
      }}
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        border: card.border,
        boxShadow: card.shadow,
        overflow: "hidden",
        flexShrink: 0,
        width: "100%",
        maxWidth: 450,
        minHeight: 420,

        display: "flex",
        flexDirection: "column",
        cursor: "default",
      }}>
      {/* Card header */}
      <div
        style={{
          padding: "16px 20px 12px",
          borderBottom: "1px solid #F3F4F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#4F46E5",
            }}
          />
          <span
            style={{
              fontFamily: "Archivo",
              fontWeight: 600,
              fontSize: 11,
              color: "#4F46E5",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
            {card.label}
          </span>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 4 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor:
                  i <= parseInt(card.label[9]) - 1 ? "#4F46E5" : "#E5E7EB",
              }}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div style={{ padding: "30px 20px" }}>
        <p
          style={{
            fontFamily: "Archivo",
            fontWeight: 600,
            fontSize: 13,
            color: "#0F0F0F",
            lineHeight: 1.5,
            marginBottom: 14,
          }}>
          {card.question}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {card.options.map((opt, i) => (
            <div
              key={i}
              style={{
                padding: "9px 14px",
                borderRadius: 10,
                border:
                  i === card.picked
                    ? "1.5px solid #4F46E5"
                    : "1.5px solid #E5E7EB",
                backgroundColor: i === card.picked ? "#EEF2FF" : "#FAFAFA",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  flexShrink: 0,
                  border:
                    i === card.picked
                      ? "2px solid #4F46E5"
                      : "2px solid #D1D5DB",
                  backgroundColor:
                    i === card.picked ? "#4F46E5" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                {i === card.picked && (
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  fontFamily: "Archivo",
                  fontWeight: i === card.picked ? 600 : 400,
                  fontSize: 12,
                  color: i === card.picked ? "#4F46E5" : "#374151",
                }}>
                {opt}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section
      style={{
        backgroundColor: "#fff",
        paddingTop: 128,
        paddingBottom: 96,
        overflow: "hidden",
      }}>
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px",
          textAlign: "center",
        }}>
        {/* Announcement pill */}
        <motion.div
          {...fadeUp(0)}
          style={{ display: "inline-block", marginBottom: 26 }}>
          <a
            href="https://github.com/dwakshar/humora"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#EEF2FF",
              border: "1px solid #C7D2FE",
              borderRadius: 999,
              padding: "6px 20px",
              fontFamily: "Archivo",
              fontWeight: 500,
              fontSize: 13,
              color: "#4F46E5",
              textDecoration: "none",
              transition: "background-color 150ms",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#E0E7FF")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#EEF2FF")
            }>
            🎉 Now open source · Star us on GitHub →
          </a>
        </motion.div>

        {/* H1 */}
        <motion.h1
          {...fadeUp(0.1)}
          style={{
            fontFamily: "Archivo",
            fontWeight: 600,
            fontSize: "clamp(42px, 7vw, 72px)",
            color: "#0F0F0F",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            margin: 0,
          }}>
          Stop bots. Delight humans.
          <br />
          <span style={{ color: "#0F0F0F" }}>One widget.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          {...fadeUp(0.2)}
          style={{
            fontFamily: "Archivo",
            fontWeight: 400,
            fontSize: 18,
            color: "#6B7280",
            maxWidth: 600,
            margin: "20px auto 0",
            lineHeight: 1.65,
          }}>
          The fun behavioral human verification widget that feels delightful to
          use and turns every visitor into a happy, converting customer.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          {...fadeUp(0.3)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 15,
            marginTop: 36,
            flexWrap: "wrap",
          }}>
          <Link
            to="/signup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#4F46E5",
              color: "#fff",
              fontFamily: "Archivo",
              fontWeight: 600,
              fontSize: 15,
              height: 52,
              borderRadius: 14,
              padding: "0 28px",
              textDecoration: "none",
              transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#4338CA";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(79,70,229,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#4F46E5";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}>
            ✦ Get Early Access
          </Link>
          <a
            href="#video"
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelector("#video")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#fff",
              color: "#374151",
              fontFamily: "Archivo",
              fontWeight: 500,
              fontSize: 15,
              height: 52,
              borderRadius: 14,
              padding: "0 28px",
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
            <span style={{ fontSize: 14 }}>▶</span> Watch 2-minute demo
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.p
          {...fadeUp(0.35)}
          style={{
            fontFamily: "Archivo",
            fontWeight: 400,
            fontSize: 13,
            color: "#9CA3AF",
            marginTop: 25,
          }}>
          Trusted by 500+ websites
          <span style={{ margin: "0 15px", color: "#D1D5DB" }}>·</span>
          2M+ verifications
          <span style={{ margin: "0 15px", color: "#D1D5DB" }}>·</span>
          Zero traffic lights
        </motion.p>

        {/* Hero cards */}
        <div
          style={{
            display: "flex",
            gap: 25,
            justifyContent: "center",
            alignItems: "flex-start",
            marginTop: 100,
            maxWidth: 900,
            marginLeft: "auto",
            marginRight: "auto",
          }}>
          {CARDS.map((card, i) => (
            <WidgetCard key={i} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
