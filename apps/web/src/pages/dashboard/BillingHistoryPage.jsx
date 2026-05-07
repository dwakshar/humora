import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "@utils/api";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatAmount(amount, currency = "USD") {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

function StatusBadge({ status }) {
  const map = {
    paid:     { bg: "#ECFDF5", color: "#065F46", label: "Paid ✓" },
    pending:  { bg: "#FFFBEB", color: "#92400E", label: "Pending" },
    failed:   { bg: "#FEF2F2", color: "#991B1B", label: "Failed" },
    refunded: { bg: "#F3F4F6", color: "#374151", label: "Refunded" },
  };
  const s = map[status] || map.paid;
  return (
    <span style={{
      fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600,
      color: s.color, background: s.bg,
      padding: "3px 10px", borderRadius: 999, textTransform: "uppercase",
    }}>
      {s.label}
    </span>
  );
}

function ReceiptIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function EmptyState() {
  return (
    <div style={{
      textAlign: "center", padding: "64px 24px",
      background: "#fff", border: "1px dashed #E5E7EB", borderRadius: 14,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: "#EEF2FF",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 16px",
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      </div>
      <p style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 15, color: "#0F0F0F", marginBottom: 6 }}>
        No billing history yet
      </p>
      <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280" }}>
        Your invoices and payments will appear here once you subscribe to a plan.
      </p>
    </div>
  );
}

function SummaryCard({ label, value, sub }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #E5E7EB",
      borderRadius: 14, padding: "20px 24px", flex: 1,
    }}>
      <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280", margin: 0 }}>{label}</p>
      <p style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 26, color: "#0F0F0F", margin: "6px 0 4px" }}>{value}</p>
      {sub && <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#9CA3AF", margin: 0 }}>{sub}</p>}
    </div>
  );
}

export default function BillingHistoryPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    api.billing.history()
      .then(data => setInvoices(Array.isArray(data) ? data : data.invoices ?? []))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalPaid = invoices
    .filter(i => i.status === "paid")
    .reduce((sum, i) => sum + parseFloat(i.amount ?? 0), 0);

  return (
    <div style={{ fontFamily: "Archivo, sans-serif", maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F0F0F", margin: 0 }}>Billing History</h1>
        <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
          All your past payments and invoices in one place.
        </p>
      </div>

      {/* Summary cards */}
      {!loading && !error && invoices.length > 0 && (
        <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
          <SummaryCard
            label="Total Paid"
            value={formatAmount(totalPaid)}
            sub="All time"
          />
          <SummaryCard
            label="Invoices"
            value={invoices.length}
            sub={`${invoices.filter(i => i.status === "paid").length} paid`}
          />
          <SummaryCard
            label="Last Payment"
            value={formatAmount(invoices[0]?.amount)}
            sub={formatDate(invoices[0]?.createdAt)}
          />
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60, color: "#9CA3AF", fontSize: 14 }}>
          <div style={{ width: 28, height: 28, border: "2px solid #E5E7EB", borderTop: "2px solid #4F46E5", borderRadius: "50%", animation: "spin 0.7s linear infinite", marginRight: 12 }} />
          Loading history…
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: 60, color: "#EF4444", fontSize: 14 }}>{error}</div>
      ) : invoices.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 120px 120px 120px 48px",
            gap: 16, padding: "12px 24px",
            borderBottom: "1px solid #F3F4F6",
            background: "#F9FAFB",
          }}>
            {["Description", "Date", "Amount", "Status", ""].map(h => (
              <span key={h} style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 12, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {invoices.map((inv, i) => (
            <motion.div
              key={inv.id || i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 120px 120px 48px",
                gap: 16, padding: "16px 24px",
                borderBottom: i < invoices.length - 1 ? "1px solid #F3F4F6" : "none",
                alignItems: "center",
                transition: "background 150ms",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#FAFAFA")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Description */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: "#EEF2FF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, color: "#4F46E5",
                }}>
                  <ReceiptIcon />
                </div>
                <div>
                  <p style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 14, color: "#0F0F0F", margin: 0 }}>
                    {inv.plan ? `${inv.plan.charAt(0).toUpperCase() + inv.plan.slice(1)} Plan` : "Subscription"}
                  </p>
                  {inv.dodoSubscriptionId && (
                    <p style={{ fontFamily: "monospace", fontSize: 11, color: "#9CA3AF", margin: "2px 0 0" }}>
                      {inv.dodoSubscriptionId.slice(0, 20)}…
                    </p>
                  )}
                </div>
              </div>

              <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#374151" }}>
                {formatDate(inv.createdAt)}
              </span>

              <span style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 14, color: "#0F0F0F" }}>
                {formatAmount(inv.amount, inv.currency)}
              </span>

              <StatusBadge status={inv.status} />

              <button
                title="Download invoice"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 32, height: 32, borderRadius: 8,
                  border: "1px solid #E5E7EB", background: "#fff",
                  cursor: "pointer", color: "#6B7280", transition: "all 150ms",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#4F46E5"; e.currentTarget.style.color = "#4F46E5"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#6B7280"; }}
              >
                <DownloadIcon />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
