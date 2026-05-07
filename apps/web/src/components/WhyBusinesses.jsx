import { motion } from "framer-motion";

const SectionPill = ({ children, dark }) => (
  <div
    style={{
      display: "inline-block",
      backgroundColor: dark ? "rgba(255,255,255,0.15)" : "#EEF2FF",
      border: dark ? "1px solid rgba(255,255,255,0.25)" : "1px solid #C7D2FE",
      borderRadius: 999,
      padding: "4px 14px",
      fontFamily: "Archivo",
      fontWeight: 700,
      fontSize: 11,
      color: dark ? "rgba(255,255,255,0.9)" : "#4F46E5",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
    }}>
    {children}
  </div>
);

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, delay, ease: "easeOut" },
});

/* ── Row 1: friction leaks revenue ── */
function Row1() {
  return (
    <motion.div
      {...fadeIn(0)}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 48,
        alignItems: "center",
      }}
      className="grid-responsive">
      {/* Illustration */}
      <div
        style={{
          height: 280,
          borderRadius: 20,
          background: "linear-gradient(145deg, #F3F4F6 0%, #E5E7EB 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: 32,
        }}>
        {/* Funnel illustration */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            width: "100%",
          }}>
          {[
            { label: "Visitors", pct: "100%", color: "#4F46E5" },
            { label: "Start form", pct: "72%", color: "#7C3AED" },
            { label: "Hit CAPTCHA", pct: "48%", color: "#A78BFA" },
            { label: "Complete", pct: "31%", color: "#C4B5FD" },
          ].map((row, i) => (
            <div key={i} style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}>
                <span
                  style={{
                    fontFamily: "Archivo",
                    fontWeight: 500,
                    fontSize: 11,
                    color: "#6B7280",
                  }}>
                  {row.label}
                </span>
                <span
                  style={{
                    fontFamily: "Archivo",
                    fontWeight: 700,
                    fontSize: 11,
                    color: "#374151",
                  }}>
                  {row.pct}
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#E5E7EB",
                  overflow: "hidden",
                }}>
                <div
                  style={{
                    width: row.pct,
                    height: "100%",
                    backgroundColor: row.color,
                    borderRadius: 3,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <p
          style={{
            fontFamily: "Archivo",
            fontWeight: 500,
            fontSize: 11,
            color: "#9CA3AF",
            marginTop: 8,
            textAlign: "center",
          }}>
          Avg CAPTCHA drop-off funnel
        </p>
      </div>

      {/* Text */}
      <div>
        <motion.div {...fadeIn(0.1)}>
          <SectionPill>Revenue Impact</SectionPill>
          <h3
            style={{
              fontFamily: "Archivo",
              fontWeight: 700,
              fontSize: "clamp(22px, 3vw, 26px)",
              color: "#0F0F0F",
              margin: "16px 0 16px",
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
            }}>
            Every second of friction leaks revenue
          </h3>
          <p
            style={{
              fontFamily: "Archivo",
              fontWeight: 400,
              fontSize: 15,
              color: "#374151",
              lineHeight: 1.7,
              margin: 0,
            }}>
            Every removed friction source converts. Users don't usually think
            'that CAPTCHA was too easy' — they just give up, ghost you on return
            visits, and simply never bother. Fixing a small number of friction
            points leads to a far higher number of conversions.
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginTop: 20,
              backgroundColor: "#ECFDF5",
              border: "1px solid #A7F3D0",
              borderRadius: 999,
              padding: "6px 14px",
            }}>
            <span
              style={{
                fontFamily: "Archivo",
                fontWeight: 600,
                fontSize: 13,
                color: "#065F46",
              }}>
              +23% avg conversion lift
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── Row 2: bots know how to win (indigo bg) ── */
function Row2() {
  return (
    <motion.div
      {...fadeIn(0.05)}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 48,
        alignItems: "center",
        backgroundColor: "#4F46E5",
        borderRadius: 24,
        padding: "48px 48px",
      }}
      className="grid-responsive">
      {/* Text */}
      <div>
        <SectionPill dark>Bot Intelligence</SectionPill>
        <h3
          style={{
            fontFamily: "Archivo",
            fontWeight: 700,
            fontSize: "clamp(22px, 3vw, 26px)",
            color: "#fff",
            margin: "16px 0 16px",
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
          }}>
          Bots already know how to win
        </h3>
        <p
          style={{
            fontFamily: "Archivo",
            fontWeight: 400,
            fontSize: 15,
            color: "rgba(255,255,255,0.8)",
            lineHeight: 1.7,
            margin: "0 0 20px",
          }}>
          Traditional CAPTCHAs follow fixed patterns, so solvers learn them
          within days and can complete them faster than real users. Humora's
          behavioral scoring changes with every session — there's no pattern to
          learn.
        </p>
        <a
          href="#how-it-works"
          onClick={(e) => {
            e.preventDefault();
            document
              .querySelector("#how-it-works")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          style={{
            fontFamily: "Archivo",
            fontWeight: 600,
            fontSize: 14,
            color: "#fff",
            textDecoration: "underline",
            cursor: "pointer",
          }}>
          Learn how scoring works →
        </a>
      </div>

      {/* Illustration */}
      <div
        style={{
          height: 220,
          borderRadius: 16,
          backgroundColor: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: 28,
        }}>
        {[
          { label: "reCAPTCHA", score: "8%", fail: true },
          { label: "hCaptcha", score: "14%", fail: true },
          { label: "Cloudflare", score: "22%", fail: true },
          { label: "Humora", score: "94%", fail: false },
        ].map((row, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
            }}>
            <span
              style={{
                fontFamily: "Archivo",
                fontWeight: 500,
                fontSize: 11,
                color: "rgba(255,255,255,0.75)",
                width: 80,
                flexShrink: 0,
              }}>
              {row.label}
            </span>
            <div
              style={{
                flex: 1,
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(255,255,255,0.15)",
              }}>
              <div
                style={{
                  width: row.score,
                  height: "100%",
                  borderRadius: 4,
                  backgroundColor: row.fail ? "rgba(239,68,68,0.7)" : "#10B981",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "Archivo",
                fontWeight: 700,
                fontSize: 11,
                color: row.fail ? "rgba(252,165,165,0.9)" : "#6EE7B7",
                width: 32,
                textAlign: "right",
              }}>
              {row.score}
            </span>
          </div>
        ))}
        <p
          style={{
            fontFamily: "Archivo",
            fontWeight: 500,
            fontSize: 10,
            color: "rgba(255,255,255,0.45)",
            margin: 0,
            marginTop: 4,
          }}>
          Bot bypass success rates
        </p>
      </div>
    </motion.div>
  );
}

/* ── Row 3: invisible UX ── */
function Row3() {
  return (
    <motion.div
      {...fadeIn(0)}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 48,
        alignItems: "center",
      }}
      className="grid-responsive">
      {/* Illustration */}
      <div
        style={{
          height: 280,
          borderRadius: 20,
          background: "linear-gradient(145deg, #F5F5F7 0%, #E8E8EC 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}>
        {/* Mini widget preview */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 20,
            width: "100%",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            border: "1px solid #E5E7EB",
          }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 14,
            }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#10B981",
              }}
            />
            <span
              style={{
                fontFamily: "Archivo",
                fontWeight: 600,
                fontSize: 10,
                color: "#10B981",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}>
              Verified Human ✓
            </span>
          </div>
          <p
            style={{
              fontFamily: "Archivo",
              fontWeight: 700,
              fontSize: 13,
              color: "#0F0F0F",
              margin: "0 0 4px",
            }}>
            Gloriously irrational. Verified human.
          </p>
          <p
            style={{
              fontFamily: "Archivo",
              fontWeight: 400,
              fontSize: 11,
              color: "#9CA3AF",
              margin: 0,
            }}>
            Score: 71 / 70 · Session: 28s
          </p>
          <div
            style={{
              marginTop: 14,
              height: 36,
              borderRadius: 10,
              backgroundColor: "#4F46E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <span
              style={{
                fontFamily: "Archivo",
                fontWeight: 600,
                fontSize: 12,
                color: "#fff",
              }}>
              Continue →
            </span>
          </div>
        </div>
      </div>

      {/* Text */}
      <div>
        <motion.div {...fadeIn(0.1)}>
          <SectionPill>Invisible UX</SectionPill>
          <h3
            style={{
              fontFamily: "Archivo",
              fontWeight: 700,
              fontSize: "clamp(22px, 3vw, 26px)",
              color: "#0F0F0F",
              margin: "16px 0 16px",
              lineHeight: 1.3,
              letterSpacing: "-0.02em",
            }}>
            Humora makes verification invisible
          </h3>
          <p
            style={{
              fontFamily: "Archivo",
              fontWeight: 400,
              fontSize: 15,
              color: "#374151",
              lineHeight: 1.7,
              margin: 0,
            }}>
            As long as it works — Humora's verification is so delightfully human
            it barely registers as security. Users simply answer questions and
            continue — noticing they encountered absolutely zero friction on
            their way through.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function WhyBusinesses() {
  return (
    <section style={{ backgroundColor: "#F5F5F7", padding: "100px 0" }}>
      <style>{`
        @media (max-width: 768px) {
          .grid-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <motion.div {...fadeIn(0)}>
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
              Annoying your customers is expensive.
            </div>
          </motion.div>
          <motion.h2
            {...fadeIn(0.1)}
            style={{
              fontFamily: "Archivo",
              fontWeight: 600,
              fontSize: "clamp(48px, 4vw, 48px)",
              color: "#0F0F0F",
              maxWidth: 600,
              margin: "16px auto 0",
              lineHeight: 1.35,
              letterSpacing: "-0.02em",
            }}>
            Why Businesses Love It
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
            Old CAPTCHAs kill conversions. Humora turns a necessary security
            step into a delightful micro-experience that boosts trust and
            increases sales.
          </motion.p>
        </div>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          <Row1 />
          <Row2 />
          <Row3 />
        </div>
      </div>
    </section>
  );
}
