import { motion } from "framer-motion";
import { useState } from "react";

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section id="video" style={{ backgroundColor: "#fff", padding: "100px 0" }}>
      <div
        style={{
          maxWidth: 1152,
          margin: "0 auto",
          padding: "0 24px",
          textAlign: "center",
        }}>
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          style={{
            fontFamily: "Archivo",
            fontWeight: 600,
            fontSize: "clamp(48px, 4vw, 48px)",
            color: "#0F0F0F",
            letterSpacing: "-0.025em",
            margin: 0,
          }}>
          Watch Humora in Action
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.1 }}
          style={{
            fontFamily: "Archivo",
            fontWeight: 400,
            fontSize: 16,
            color: "#6B7280",
            maxWidth: 600,
            margin: "16px auto 0",
            lineHeight: 1.65,
          }}>
          Watch a real user complete the full Humora flow from the first
          question to the instant 'You're human!' result. Try it yourself below.
          No signup. No bots. Just pure delight.
        </motion.p>

        {/* Video container */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          style={{
            maxWidth: 800,
            margin: "48px auto 0",
            position: "relative",
          }}>
          <div
            style={{
              backgroundColor: "#E5E7EB",
              borderRadius: 20,
              aspectRatio: "16 / 9",
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
              position: "relative",
              cursor: "pointer",
            }}
            onClick={() => setPlaying(true)}>
            {/* Placeholder gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(145deg, #E5E7EB 0%, #D1D5DB 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              {/* Subtle grid overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.3,
                  backgroundImage:
                    "linear-gradient(#C9D0D8 1px, transparent 1px), linear-gradient(90deg, #C9D0D8 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              {playing ? (
                <div style={{ zIndex: 2, textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "Archivo",
                      fontWeight: 600,
                      fontSize: 14,
                      color: "#6B7280",
                    }}>
                    Video would play here
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                  }}>
                  {/* Pulse ring */}
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <div
                      style={{
                        position: "absolute",
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        backgroundColor: "rgba(79,70,229,0.25)",
                        animation: "pulse-ring 2s ease-out infinite",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        width: 88,
                        height: 88,
                        borderRadius: "50%",
                        backgroundColor: "rgba(79,70,229,0.12)",
                        animation: "pulse-ring 2s ease-out infinite",
                        animationDelay: "0.5s",
                      }}
                    />
                    {/* Play button */}
                    <motion.div
                      whileHover={{
                        scale: 1.1,
                        boxShadow: "0 8px 32px rgba(79,70,229,0.45)",
                      }}
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        backgroundColor: "#4F46E5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 20px rgba(79,70,229,0.35)",
                        transition: "box-shadow 200ms",
                        position: "relative",
                        zIndex: 1,
                      }}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none">
                        <path d="M8 5.14v14l11-7-11-7z" fill="white" />
                      </svg>
                    </motion.div>
                  </div>
                  <span
                    style={{
                      fontFamily: "Archivo",
                      fontWeight: 600,
                      fontSize: 13,
                      color: "#6B7280",
                    }}>
                    Watch 2-min demo
                  </span>
                </div>
              )}
            </div>

            {/* Duration badge */}
            {!playing && (
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  borderRadius: 6,
                  padding: "4px 10px",
                  zIndex: 3,
                }}>
                <span
                  style={{
                    fontFamily: "Archivo",
                    fontWeight: 600,
                    fontSize: 12,
                    color: "#fff",
                  }}>
                  2:18
                </span>
              </div>
            )}
          </div>

          {/* Below video CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            style={{
              marginTop: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}>
            <span
              style={{
                fontFamily: "Archivo",
                fontWeight: 400,
                fontSize: 14,
                color: "#9CA3AF",
              }}>
              Want to try the live widget?
            </span>
            <a
              href="/demo"
              style={{
                fontFamily: "Archivo",
                fontWeight: 600,
                fontSize: 14,
                color: "#4F46E5",
                textDecoration: "none",
                transition: "opacity 150ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
              Try it live ↓
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
