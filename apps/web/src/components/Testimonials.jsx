import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    quote:
      "Finally a CAPTCHA that doesn't make my users feel like suspects. Conversion rate went up 12%.",
    name: "Alex M.",
    role: "SaaS Founder",
    initials: "AM",
    color: "#4F46E5",
  },
  {
    quote:
      "I was skeptical. Then I tried it. My team literally laughed at the questions. Now it's on every form we have.",
    name: "Sarah K.",
    role: "Product Designer",
    initials: "SK",
    color: "#7C3AED",
  },
  {
    quote:
      "Set it up in 8 minutes. My clients haven't complained about the contact form since. Not once.",
    name: "James R.",
    role: "Freelance Developer",
    initials: "JR",
    color: "#0891B2",
  },
  {
    quote:
      "Wet socks or stepping on Lego. My users picked sides. Bots didn't even make it past question 2.",
    name: "Dev on Twitter",
    role: "@buildinginstages",
    initials: "DT",
    color: "#0F172A",
  },
  {
    quote:
      "We were losing 30% of signups to CAPTCHA drop-off. Humora cut that to basically zero.",
    name: "Maria T.",
    role: "Growth Lead",
    initials: "MT",
    color: "#059669",
  },
  {
    quote:
      "The JWT verification took 10 minutes to integrate. reCAPTCHA took us 2 days and it still felt broken.",
    name: "Tom W.",
    role: "Backend Engineer",
    initials: "TW",
    color: "#DC2626",
  },
  {
    quote:
      "Our enterprise clients specifically asked us to keep Humora when we shipped v2. Never heard that about a CAPTCHA before.",
    name: "Rachel B.",
    role: "Agency Owner",
    initials: "RB",
    color: "#D97706",
  },
  {
    quote:
      "I failed a reCAPTCHA 4 times last month. I've never failed Humora. That's the whole pitch.",
    name: "Anonymous",
    role: "Reddit · r/webdev",
    initials: "?",
    color: "#6B7280",
  },
  {
    quote:
      "Open source, self-hostable, no Google dependency. This is everything we needed for GDPR compliance.",
    name: "Lars N.",
    role: "CTO",
    initials: "LN",
    color: "#0284C7",
  },
  {
    quote:
      "The personality line at the end — 'Gloriously irrational. Verified human.' — my users screenshot it. They screenshot a CAPTCHA result. Wild.",
    name: "Priya S.",
    role: "Community Lead",
    initials: "PS",
    color: "#BE185D",
  },
  {
    quote: "Implemented on our checkout. Bot signups dropped 94% in week one.",
    name: "David C.",
    role: "E-commerce Founder",
    initials: "DC",
    color: "#16A34A",
  },
  {
    quote:
      "It literally asks if you've ever faked being asleep to avoid a conversation. Of course I have. Verified human. 10/10.",
    name: "Designer on X",
    role: "@uidesignthings",
    initials: "DX",
    color: "#7C3AED",
  },
];

function StarRating() {
  return (
    <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#F59E0B">
          <path d="M7 1l1.55 3.14L12 4.68l-2.5 2.44.59 3.44L7 8.96l-3.09 1.6.59-3.44L2 4.68l3.45-.54L7 1z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ initials, color }) {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        flexShrink: 0,
        backgroundColor: color + "18",
        border: `1.5px solid ${color}30`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <span
        style={{ fontFamily: "Archivo", fontWeight: 700, fontSize: 13, color }}>
        {initials}
      </span>
    </div>
  );
}

function TestimonialCard({ t, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{
        y: -3,
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        transition: { duration: 0.2 },
      }}
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: "24px",
        border: "1px solid #E5E7EB",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        breakInside: "avoid",
        display: "block",
        marginBottom: 20,
        cursor: "default",
      }}>
      <StarRating />
      <p
        style={{
          fontFamily: "Archivo",
          fontWeight: 400,
          fontSize: 14,
          color: "#374151",
          lineHeight: 1.65,
          margin: 0,
        }}>
        "{t.quote}"
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginTop: 16,
        }}>
        <Avatar initials={t.initials} color={t.color} />
        <div>
          <div
            style={{
              fontFamily: "Archivo",
              fontWeight: 700,
              fontSize: 13,
              color: "#0F0F0F",
            }}>
            {t.name}
          </div>
          <div
            style={{
              fontFamily: "Archivo",
              fontWeight: 400,
              fontSize: 12,
              color: "#9CA3AF",
              marginTop: 1,
            }}>
            {t.role}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const col1 = TESTIMONIALS.filter((_, i) => i % 4 === 0);
  const col2 = TESTIMONIALS.filter((_, i) => i % 4 === 1);
  const col3 = TESTIMONIALS.filter((_, i) => i % 4 === 2);
  const col4 = TESTIMONIALS.filter((_, i) => i % 4 === 3);

  return (
    <section
      id="testimonials"
      style={{ backgroundColor: "#F5F5F7", padding: "100px 0" }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            style={{
              fontFamily: "Archivo",
              fontWeight: 600,
              fontSize: "clamp(48px, 4vw, 48px)",
              color: "#0F0F0F",
              letterSpacing: "-0.025em",
              margin: 0,
            }}>
            Loved by Real Users
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontFamily: "Archivo",
              fontWeight: 400,
              fontSize: 16,
              color: "#6B7280",
              maxWidth: 480,
              margin: "16px auto 0",
              lineHeight: 1.65,
            }}>
            Whether you get 500 visitors or 500,000 — Humora turns every
            security check into a moment worth remembering.
          </motion.p>
        </div>

        {/* Masonry grid — 4 columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            alignItems: "start",
          }}>
          {[col1, col2, col3, col4].map((col, ci) => (
            <div key={ci}>
              {col.map((t, ti) => (
                <TestimonialCard
                  key={t.name + ti}
                  t={t}
                  delay={(ci * 3 + ti) * 0.07}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Responsive override */}
        <style>{`
          @media (max-width: 1024px) {
            #testimonials [style*="repeat(4, 1fr)"] {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 600px) {
            #testimonials [style*="repeat(4, 1fr)"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
