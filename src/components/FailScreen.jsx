import { motion } from "framer-motion";
import { useState } from "react";

export default function FailScreen({ onRetry }) {
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
          backgroundColor: "#FEF2F2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
        }}>
        <span
          style={{
            color: "#EF4444",
            fontSize: "28px",
            fontWeight: 700,
            lineHeight: 1,
          }}>
          ✗
        </span>
      </motion.div>

      <h2
        style={{
          fontFamily: "Archivo, sans-serif",
          fontWeight: 700,
          fontSize: "24px",
          color: "#0F0F0F",
          marginTop: "20px",
          marginBottom: 0,
          textAlign: "center",
        }}>
        Something felt off.
      </h2>

      <p
        style={{
          fontFamily: "Archivo, sans-serif",
          fontWeight: 400,
          fontSize: "14px",
          color: "#9CA3AF",
          marginTop: "8px",
          marginBottom: 0,
          textAlign: "center",
        }}>
        You might be a bot. Or just having a weird day.
      </p>

      <button
        onClick={onRetry}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: "100%",
          height: "52px",
          borderRadius: "14px",
          backgroundColor: "#FFFFFF",
          border: `1.5px solid ${isHovered ? "#4F46E5" : "#E5E7EB"}`,
          color: isHovered ? "#4F46E5" : "#374151",
          fontFamily: "Archivo, sans-serif",
          fontWeight: 500,
          fontSize: "15px",
          cursor: "pointer",
          marginTop: "24px",
          transition: "border-color 200ms ease, color 200ms ease",
        }}>
        Try Again
      </button>
    </motion.div>
  );
}
