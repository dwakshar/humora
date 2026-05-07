import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
      }}>
      <div
        style={{
          fontFamily: "Archivo, sans-serif",
          fontWeight: 900,
          fontSize: 96,
          color: "#4F46E5",
          lineHeight: 1,
          marginBottom: 16,
        }}>
        404
      </div>
      <h1
        style={{
          fontFamily: "Archivo, sans-serif",
          fontWeight: 800,
          fontSize: 28,
          color: "#0F0F0F",
          margin: "0 0 12px",
        }}>
        Page not found.
      </h1>
      <p
        style={{
          fontFamily: "Archivo, sans-serif",
          fontSize: 16,
          color: "#6B7280",
          margin: "0 0 28px",
          maxWidth: 360,
        }}>
        This page doesn't exist or was moved.
      </p>
      <Link
        to="/"
        style={{
          height: 48,
          backgroundColor: "#4F46E5",
          color: "#fff",
          borderRadius: 12,
          padding: "0 24px",
          fontFamily: "Archivo, sans-serif",
          fontWeight: 600,
          fontSize: 14,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
        }}>
        ← Back to Home
      </Link>
    </div>
  );
}
