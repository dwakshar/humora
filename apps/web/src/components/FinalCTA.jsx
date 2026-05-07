import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function FinalCTA() {
  // ←←← CHANGE THIS NUMBER to control density (80 is smooth)
  const userAvatars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 16 + Math.random() * 14,
    delay: Math.random() * 4,
    duration: 5 + Math.random() * 7,
    opacity: 0.06 + Math.random() * 0.13,
  }));

  return (
    <section
      style={{
        backgroundColor: "#fff",
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
      }}>
      {/* NEW: GitHub-style Indigo Grid in 4 Corners */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: -1,
          overflow: "hidden",
        }}>
        {/* Top-Left Grid */}
        <div
          style={{
            position: "absolute",
            top: "-15%",
            left: "-15%",
            width: "48%",
            height: "48%",
            backgroundImage: `
              linear-gradient(rgba(79, 70, 229, 0.14) 1px, transparent 1px),
              linear-gradient(90deg, rgba(79, 70, 229, 0.14) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
            opacity: 0.85,
          }}
        />

        {/* Top-Right Grid */}
        <div
          style={{
            position: "absolute",
            top: "-15%",
            right: "-15%",
            width: "48%",
            height: "48%",
            backgroundImage: `
              linear-gradient(rgba(79, 70, 229, 0.14) 1px, transparent 1px),
              linear-gradient(90deg, rgba(79, 70, 229, 0.14) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
            opacity: 0.85,
          }}
        />

        {/* Bottom-Left Grid */}
        <div
          style={{
            position: "absolute",
            bottom: "-15%",
            left: "-15%",
            width: "48%",
            height: "48%",
            backgroundImage: `
              linear-gradient(rgba(79, 70, 229, 0.14) 1px, transparent 1px),
              linear-gradient(90deg, rgba(79, 70, 229, 0.14) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
            opacity: 0.85,
          }}
        />

        {/* Bottom-Right Grid */}
        <div
          style={{
            position: "absolute",
            bottom: "-15%",
            right: "-15%",
            width: "48%",
            height: "48%",
            backgroundImage: `
              linear-gradient(rgba(79, 70, 229, 0.14) 1px, transparent 1px),
              linear-gradient(90deg, rgba(79, 70, 229, 0.14) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
            opacity: 0.85,
          }}
        />
      </div>

      {/* DENSE ANIMATED USERS BACKGROUND - OPTIMIZED */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}>
        {userAvatars.map((avatar) => (
          <motion.div
            key={avatar.id}
            initial={{ y: 0, scale: 1 }}
            animate={{
              y: [-14, 14, -14],
              scale: [1, 1.07, 1],
            }}
            transition={{
              duration: avatar.duration,
              repeat: Infinity,
              delay: avatar.delay,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              left: avatar.left,
              top: avatar.top,
              width: avatar.size,
              height: avatar.size,
              borderRadius: "4px",
              backgroundColor: "#ffffff",
              border: "1.5px solid rgba(79, 70, 229, 0.25)",
              boxShadow: "0 4px 12px -2px rgba(79, 70, 229, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: avatar.size * 0.65,
              color: "#4F46E5",
              opacity: avatar.opacity,
              willChange: "transform",
            }}>
            👤
          </motion.div>
        ))}
      </div>

      {/* Original decorative orb */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "0 24px",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}>
        {/* Top pill */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "#EEF2FF",
              border: "1px solid #C7D2FE",
              borderRadius: 999,
              padding: "6px 16px",
              fontFamily: "Archivo",
              fontWeight: 500,
              fontSize: 13,
              color: "#4F46E5",
            }}>
            Finally, human-friendly.
          </div>
        </div>

        {/* H2 */}
        <h2
          style={{
            fontFamily: "Archivo",
            fontWeight: 600,
            fontSize: "clamp(42px, 7vw, 72px)",
            color: "#0F0F0F",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            margin: "0 0 20px",
          }}>
          If you really like our project...
        </h2>

        {/* Sub */}
        <p
          style={{
            fontFamily: "Archivo",
            fontWeight: 400,
            fontSize: 17,
            color: "#6B7280",
            maxWidth: 520,
            margin: "0 auto 40px",
            lineHeight: 1.65,
          }}>
          The fun behavioral human verification widget that feels delightful to
          use and turns every visitor into a happy, converting customer.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            flexWrap: "wrap",
          }}>
          <Link
            to="/demo"
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
            Give Demo
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
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
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.color = "#374151";
              e.currentTarget.style.transform = "none";
            }}>
            ⭐ Star on GitHub
          </a>
        </div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{
            fontFamily: "Archivo",
            fontWeight: 400,
            fontSize: 13,
            color: "#9CA3AF",
            marginTop: 24,
          }}>
          Free tier available · No credit card required · Open source MIT
        </motion.p>
      </motion.div>
    </section>
  );
}
