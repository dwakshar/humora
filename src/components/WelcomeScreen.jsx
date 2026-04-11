import { motion } from "framer-motion";
import { useState } from "react";

export default function WelcomeScreen({ onBegin }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}>
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "#4F46E5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          fontSize: "18px",
          fontFamily: "Archivo, sans-serif",
          fontWeight: 700,
        }}>
        H
      </div>

      <span
        style={{
          fontFamily: "Archivo, sans-serif",
          fontWeight: 700,
          fontSize: "11px",
          color: "#9CA3AF",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginTop: "8px",
          textAlign: "center",
        }}>
        HumanCheck
      </span>

      <h1
        style={{
          fontFamily: "Archivo, sans-serif",
          fontWeight: 700,
          fontSize: "24px",
          color: "#0F0F0F",
          lineHeight: 1.3,
          textAlign: "center",
          marginTop: "24px",
          marginBottom: 0,
        }}>
        Let's make sure you're human.
      </h1>

      <p
        style={{
          fontFamily: "Archivo, sans-serif",
          fontWeight: 400,
          fontSize: "14px",
          color: "#9CA3AF",
          textAlign: "center",
          marginTop: "8px",
          marginBottom: 0,
        }}>
        5 quick questions. No puzzles. No traffic lights. Just you.
      </p>

      <button
        onClick={onBegin}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: "100%",
          height: "52px",
          borderRadius: "14px",
          backgroundColor: isHovered ? "#4338CA" : "#4F46E5",
          color: "#FFFFFF",
          fontFamily: "Archivo, sans-serif",
          fontWeight: 600,
          fontSize: "15px",
          border: "none",
          cursor: "pointer",
          marginTop: "32px",
          transition: "background-color 200ms ease",
        }}>
        Begin Check
      </button>

      <p
        style={{
          fontFamily: "Archivo, sans-serif",
          fontWeight: 400,
          fontSize: "12px",
          color: "#9CA3AF",
          textAlign: "center",
          marginTop: "16px",
          marginBottom: 0,
        }}>
        Your answers are private and never stored.
      </p>
    </motion.div>
  );
}
