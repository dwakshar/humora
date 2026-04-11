import { motion } from "framer-motion";
import { useState } from "react";

export default function PassScreen({ personalityLine, onContinue }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5, delay: 0.1 }}
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          backgroundColor: "#ECFDF5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
        }}>
        <span
          style={{
            color: "#10B981",
            fontSize: "28px",
            fontWeight: 700,
            lineHeight: 1,
          }}>
          ✓
        </span>
      </motion.div>

      <h2
        style={{
          fontFamily: "Archivo, sans-serif",
          fontWeight: 800,
          fontSize: "28px",
          color: "#0F0F0F",
          marginTop: "20px",
          marginBottom: 0,
          textAlign: "center",
        }}>
        You're human.
      </h2>

      <p
        style={{
          fontFamily: "Archivo, sans-serif",
          fontWeight: 400,
          fontSize: "15px",
          color: "#6B7280",
          marginTop: "8px",
          marginBottom: 0,
          textAlign: "center",
        }}>
        {personalityLine}
      </p>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          backgroundColor: "#ECFDF5",
          border: "1px solid #A7F3D0",
          borderRadius: "999px",
          padding: "6px 16px",
          marginTop: "20px",
        }}>
        <span
          style={{
            fontFamily: "Archivo, sans-serif",
            fontWeight: 500,
            fontSize: "13px",
            color: "#10B981",
          }}>
          Verified Human
        </span>
      </div>

      <button
        onClick={onContinue}
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
          marginTop: "24px",
          transition: "background-color 200ms ease",
        }}>
        Continue
      </button>
    </motion.div>
  );
}
