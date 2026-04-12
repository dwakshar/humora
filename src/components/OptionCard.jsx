import { useState } from "react";

export default function OptionCard({ text, isSelected, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle = {
    backgroundColor: "#FFFFFF",
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: "#E5E7EB",
    borderRadius: "14px",
    padding: "16px",
    minHeight: "72px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    position: "relative",
    transition: "all 180ms ease",
    boxSizing: "border-box",
    width: "100%",
  };

  const hoverStyle = {
    borderColor: "#4F46E5",
    backgroundColor: "#EEF2FF",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(79,70,229,0.12)",
  };

  const selectedStyle = {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 16px rgba(79,70,229,0.25)",
  };

  const computedStyle = {
    ...baseStyle,
    ...(isHovered && !isSelected ? hoverStyle : {}),
    ...(isSelected ? selectedStyle : {}),
  };

  const textStyle = {
    fontFamily: "Archivo, sans-serif",
    fontWeight: 500,
    fontSize: "14px",
    color: isSelected ? "#FFFFFF" : "#374151",
    lineHeight: 1.4,
    transition: "color 180ms ease",
  };

  return (
    <div
      style={computedStyle}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {isSelected && (
        <span
          style={{
            position: "absolute",
            top: "10px",
            right: "12px",
            color: "#FFFFFF",
            fontSize: "12px",
            fontWeight: 700,
            lineHeight: 1,
          }}>
          ✓
        </span>
      )}
      <span style={textStyle}>{text}</span>
    </div>
  );
}
