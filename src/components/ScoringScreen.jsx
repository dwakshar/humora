import { motion } from "framer-motion";
import { useEffect } from "react";

export default function ScoringScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 0",
      }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-opacity {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>

      <div
        style={{
          width: "32px",
          height: "32px",
          border: "3px solid #EEF2FF",
          borderTop: "3px solid #4F46E5",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />

      <p
        style={{
          fontFamily: "Archivo, sans-serif",
          fontWeight: 400,
          fontSize: "14px",
          color: "#9CA3AF",
          marginTop: "16px",
          animation: "pulse-opacity 1s ease-in-out infinite",
        }}>
        Analyzing your responses...
      </p>
    </motion.div>
  );
}
