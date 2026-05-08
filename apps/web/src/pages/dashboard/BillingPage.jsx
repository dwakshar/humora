import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@utils/api";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: "$9",
    annualPrice: "$7",
    period: "/month",
    verifications: "10,000",
    domains: 3,
    features: ["Email support", "Basic analytics", "99.9% SLA"],
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: "$29",
    annualPrice: "$23",
    period: "/month",
    verifications: "100,000",
    domains: "Unlimited",
    features: ["Priority support", "Advanced analytics", "Team members", "99.95% SLA"],
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: "Custom",
    annualPrice: "Custom",
    period: "",
    verifications: "Unlimited",
    domains: "Unlimited",
    features: ["Dedicated support", "Custom contracts", "On-premise option", "100% SLA"],
    highlight: false,
  },
];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

function StatusBadge({ status }) {
  const styles = {
    paid:     { bg: "#ECFDF5", text: "#065F46" },
    pending:  { bg: "#FFFBEB", text: "#92400E" },
    failed:   { bg: "#FEF2F2", text: "#991B1B" },
    past_due: { bg: "#FEF2F2", text: "#991B1B" },
  };
  const s = styles[status] || styles.paid;
  return (
    <span style={{
      display: "inline-block",
      fontFamily: "Archivo, sans-serif",
      fontSize: 11,
      fontWeight: 600,
      color: s.text,
      backgroundColor: s.bg,
      padding: "3px 10px",
      borderRadius: 999,
      textTransform: "uppercase",
    }}>
      {status === "paid" ? "Paid ✓" : status}
    </span>
  );
}

function PlanCard({ plan, isCurrent, billingPeriod, onSelect, loading }) {
  const isEnterprise = plan.id === "enterprise";
  const price = billingPeriod === "annual" ? plan.annualPrice : plan.monthlyPrice;

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        border: plan.highlight ? "2px solid #4F46E5" : "1px solid #E5E7EB",
        position: "relative",
        transition: "all 200ms",
      }}
      onMouseEnter={(e) => {
        if (!plan.highlight && !isCurrent) {
          e.currentTarget.style.borderColor = "#C7D2FE";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(79,70,229,0.08)";
        }
      }}
      onMouseLeave={(e) => {
        if (!plan.highlight && !isCurrent) {
          e.currentTarget.style.borderColor = "#E5E7EB";
          e.currentTarget.style.boxShadow = "none";
        }
      }}
    >
      {isCurrent && (
        <span style={{
          position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
          fontFamily: "Archivo, sans-serif", fontSize: 10, fontWeight: 700,
          color: "#fff", backgroundColor: "#4F46E5",
          padding: "3px 10px", borderRadius: 999,
          textTransform: "uppercase", letterSpacing: "0.05em",
        }}>
          Current Plan
        </span>
      )}
      {plan.highlight && !isCurrent && (
        <span style={{
          position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
          fontFamily: "Archivo, sans-serif", fontSize: 10, fontWeight: 700,
          color: "#fff", backgroundColor: "#10B981",
          padding: "3px 10px", borderRadius: 999,
          textTransform: "uppercase", letterSpacing: "0.05em",
        }}>
          Most Popular
        </span>
      )}

      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h3 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 16, color: "#0F0F0F", margin: "0 0 4px" }}>
          {plan.name}
        </h3>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 2 }}>
          <span style={{ fontFamily: "Archivo, sans-serif", fontWeight: 900, fontSize: 28, color: "#0F0F0F" }}>
            {price}
          </span>
          <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#9CA3AF" }}>
            {plan.period}
          </span>
        </div>
        <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280", marginTop: 4 }}>
          {plan.verifications} verifications/mo
        </div>
      </div>

      <ul style={{ margin: "0 0 16px", paddingLeft: 0, listStyle: "none" }}>
        {plan.features.map((feature, i) => (
          <li key={i} style={{
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#374151", marginBottom: 8,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={() => !isCurrent && !loading && onSelect(plan.id, billingPeriod)}
        disabled={isCurrent || loading || isEnterprise}
        style={{
          width: "100%",
          fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13,
          color: isCurrent || isEnterprise ? "#9CA3AF" : plan.highlight ? "#fff" : "#4F46E5",
          backgroundColor: isCurrent || isEnterprise ? "#F3F4F6" : plan.highlight ? "#4F46E5" : "#EEF2FF",
          border: "none", borderRadius: 10, padding: "10px 16px",
          cursor: isCurrent || loading || isEnterprise ? "not-allowed" : "pointer",
          transition: "all 150ms",
        }}
        onMouseEnter={(e) => {
          if (!isCurrent && !isEnterprise) {
            e.currentTarget.style.backgroundColor = plan.highlight ? "#4338CA" : "#C7D2FE";
          }
        }}
        onMouseLeave={(e) => {
          if (!isCurrent && !isEnterprise) {
            e.currentTarget.style.backgroundColor = plan.highlight ? "#4F46E5" : "#EEF2FF";
          }
        }}
      >
        {isCurrent ? "Current Plan" : isEnterprise ? "Contact Sales" : loading ? "Loading…" : "Upgrade"}
      </button>
    </div>
  );
}

function CancelModal({ open, onClose, onConfirm, loading }) {
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (!open) setConfirmText("");
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff", borderRadius: 20, padding: 24,
          width: 400, maxWidth: "calc(100vw - 32px)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", backgroundColor: "#FEF2F2",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h3 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 18, color: "#0F0F0F", marginBottom: 8 }}>
            Cancel your subscription?
          </h3>
          <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>
            You'll lose access to premium features at the end of your billing period. This action can be reversed before then.
          </p>
        </div>

        <div style={{
          backgroundColor: "#FFF5F5", border: "1px solid #FECACA",
          borderRadius: 10, padding: "14px 16px", marginBottom: 20,
        }}>
          <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#991B1B", marginBottom: 8 }}>
            <strong>What you'll lose:</strong>
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#991B1B", lineHeight: 1.8 }}>
            <li>Advanced analytics</li>
            <li>Priority support</li>
            <li>More than 3 domains</li>
          </ul>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 12, color: "#0F0F0F", marginBottom: 8 }}>
            Type "DELETE" to confirm cancellation
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            style={{
              width: "100%", fontFamily: "Archivo, sans-serif", fontSize: 14,
              color: "#0F0F0F", backgroundColor: "#fff",
              border: "1px solid #E5E7EB", borderRadius: 10,
              padding: "12px 14px", boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 14,
              color: "#374151", backgroundColor: "#F3F4F6",
              border: "none", borderRadius: 12, padding: "12px 16px", cursor: "pointer",
            }}
          >
            Keep My Plan
          </button>
          <button
            onClick={() => confirmText === "DELETE" && onConfirm()}
            disabled={confirmText !== "DELETE" || loading}
            style={{
              flex: 1, fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 14,
              color: "#fff",
              backgroundColor: confirmText === "DELETE" && !loading ? "#EF4444" : "#FECACA",
              border: "none", borderRadius: 12, padding: "12px 16px",
              cursor: confirmText === "DELETE" && !loading ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Cancelling…" : "Yes, Cancel"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function BillingPage() {
  const [billing, setBilling]           = useState(null);
  const [invoices, setInvoices]         = useState([]);
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [cancelOpen, setCancelOpen]     = useState(false);
  const [loadingData, setLoadingData]   = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError]               = useState(null);

  const loadBilling = useCallback(async () => {
    try {
      const [billingData, historyData] = await Promise.all([
        api.billing.current(),
        api.billing.history(),
      ]);
      setBilling(billingData);
      setInvoices(historyData.invoices ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => { loadBilling(); }, [loadBilling]);

  async function handleCheckout(planId, period) {
    try {
      setLoadingAction(true);
      const { checkoutUrl } = await api.billing.checkout(planId, period);
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err.message);
      setLoadingAction(false);
    }
  }

  async function handlePortal() {
    try {
      setLoadingAction(true);
      const { portalUrl } = await api.billing.portal();
      window.location.href = portalUrl;
    } catch (err) {
      setError(err.message);
      setLoadingAction(false);
    }
  }

  async function handleCancel() {
    try {
      setLoadingAction(true);
      await api.billing.cancel();
      setCancelOpen(false);
      await loadBilling();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAction(false);
    }
  }

  async function handleReactivate() {
    try {
      setLoadingAction(true);
      await api.billing.reactivate();
      await loadBilling();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAction(false);
    }
  }

  const plan         = billing?.plan ?? "free";
  const limits       = billing?.limits ?? {};
  const usage        = billing?.usage ?? {};
  const subscription = billing?.subscription ?? {};
  const pm           = billing?.paymentMethod ?? null;

  const usedVerifications = usage.verificationsThisMonth ?? 0;
  const maxVerifications  = limits.verifications ?? 1000;
  const usagePercent      = maxVerifications > 0
    ? Math.min(100, Math.round((usedVerifications / maxVerifications) * 100))
    : 0;

  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);

  return (
    <div>
      {error && (
        <div style={{
          backgroundColor: "#FEF2F2", border: "1px solid #FECACA",
          borderRadius: 12, padding: "12px 16px", marginBottom: 16,
          fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#991B1B",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          {error}
          <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#991B1B", fontSize: 16, lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          borderRadius: 20, padding: 32, marginBottom: 24, color: "#fff",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 28, color: "#fff", margin: "0 0 8px" }}>
              {loadingData ? "Loading…" : `${planLabel} Plan`}
            </h2>
            <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 15, color: "rgba(255,255,255,0.8)", margin: 0 }}>
              {subscription.status === "active" && subscription.currentPeriodEnd
                ? `Renews ${formatDate(subscription.currentPeriodEnd)}`
                : subscription.status === "cancelled"
                ? "Subscription cancelled"
                : subscription.cancelAtPeriodEnd && subscription.currentPeriodEnd
                ? `Cancels ${formatDate(subscription.currentPeriodEnd)}`
                : plan === "free"
                ? "Free plan"
                : "—"}
            </p>

            {!loadingData && (
              <>
                <div style={{ marginTop: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.9)" }}>
                      {usedVerifications.toLocaleString()} / {maxVerifications > 0 ? maxVerifications.toLocaleString() : "∞"} verifications
                    </span>
                    <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                      {maxVerifications > 0 ? `${usagePercent}% used` : "Unlimited"}
                    </span>
                  </div>
                  <div style={{ backgroundColor: "rgba(255,255,255,0.2)", height: 8, borderRadius: 999, overflow: "hidden" }}>
                    <div style={{
                      width: `${usagePercent}%`, height: "100%",
                      backgroundColor: "#fff", borderRadius: 999, transition: "width 0.3s",
                    }} />
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
                    {usage.domainsActive ?? 0} / {limits.domains > 0 ? limits.domains : "∞"} domains active
                  </span>
                </div>
              </>
            )}
          </div>

          {plan !== "free" && (
            <button
              onClick={handlePortal}
              disabled={loadingAction}
              style={{
                fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 14,
                color: "#4F46E5", backgroundColor: "#fff",
                border: "none", borderRadius: 10, padding: "10px 20px",
                cursor: loadingAction ? "not-allowed" : "pointer", transition: "all 200ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.9)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {loadingAction ? "Loading…" : "Manage Billing"}
            </button>
          )}
        </div>
      </motion.div>

      {/* Plan cards */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 16, color: "#0F0F0F", margin: 0 }}>
            Available Plans
          </h3>
          {/* Period toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              display: "flex", backgroundColor: "#F3F4F6",
              borderRadius: 10, padding: 4, gap: 2,
            }}>
              {["monthly", "annual"].map((p) => (
                <button
                  key={p}
                  onClick={() => setBillingPeriod(p)}
                  style={{
                    fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 12,
                    color: billingPeriod === p ? "#4F46E5" : "#6B7280",
                    backgroundColor: billingPeriod === p ? "#fff" : "transparent",
                    border: "none", borderRadius: 7,
                    padding: "6px 16px", cursor: "pointer", transition: "all 150ms",
                    boxShadow: billingPeriod === p ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <span style={{
              fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 700,
              color: "#059669", backgroundColor: "#ECFDF5",
              border: "1px solid #A7F3D0",
              padding: "3px 9px", borderRadius: 999,
              opacity: billingPeriod === "annual" ? 1 : 0.4,
              transition: "opacity 200ms",
            }}>
              Save 20%
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {PLANS.map((p) => (
            <PlanCard
              key={p.id}
              plan={p}
              isCurrent={plan === p.id}
              billingPeriod={billingPeriod}
              onSelect={handleCheckout}
              loading={loadingAction}
            />
          ))}
        </div>
      </div>

      {/* Payment method */}
      <div style={{
        backgroundColor: "#fff", borderRadius: 20, padding: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 24,
      }}>
        <h3 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 16, color: "#0F0F0F", marginBottom: 16 }}>
          Payment Method
        </h3>

        {pm ? (
          <>
            <div style={{
              background: "linear-gradient(135deg, #1E1E2F 0%, #2D2D44 100%)",
              borderRadius: 16, padding: 20, marginBottom: 16, color: "#fff",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontFamily: "'Fira Code', monospace", fontSize: 16, letterSpacing: "0.1em", marginBottom: 12 }}>
                  **** **** **** {pm.last4}
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  <div>
                    <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 10, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", marginBottom: 2 }}>
                      Brand
                    </div>
                    <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: 500 }}>
                      {pm.brand}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 10, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", marginBottom: 2 }}>
                      Expires
                    </div>
                    <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: 500 }}>
                      {pm.expiry}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{
                fontFamily: "Archivo, sans-serif", fontWeight: 900, fontSize: 24,
                color: "#fff", fontStyle: "italic",
              }}>
                {pm.brand?.toUpperCase()}
              </div>
            </div>

            <button
              onClick={handlePortal}
              disabled={loadingAction}
              style={{
                fontFamily: "Archivo, sans-serif", fontWeight: 500, fontSize: 13,
                color: "#4F46E5", backgroundColor: "#EEF2FF",
                border: "none", borderRadius: 8, padding: "8px 16px",
                cursor: loadingAction ? "not-allowed" : "pointer", transition: "all 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#C7D2FE"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#EEF2FF"; }}
            >
              Update Payment Method
            </button>
          </>
        ) : (
          <div style={{
            border: "1px dashed #E5E7EB", borderRadius: 16, padding: 24,
            textAlign: "center",
          }}>
            <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 14, color: "#6B7280", marginBottom: 8 }}>
              No payment method on file
            </div>
            <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#9CA3AF", marginBottom: 16 }}>
              Add a payment method via the billing portal
            </div>
            <button
              onClick={handlePortal}
              disabled={loadingAction || !billing?.subscription?.id}
              style={{
                fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13,
                color: "#4F46E5", backgroundColor: "#EEF2FF",
                border: "none", borderRadius: 8, padding: "8px 16px",
                cursor: loadingAction || !billing?.subscription?.id ? "not-allowed" : "pointer",
                transition: "all 150ms",
              }}
              onMouseEnter={(e) => { if (!loadingAction) e.currentTarget.style.backgroundColor = "#C7D2FE"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#EEF2FF"; }}
            >
              Add Payment Method
            </button>
          </div>
        )}
      </div>

      {/* Billing history */}
      <div id="history" style={{
        backgroundColor: "#fff", borderRadius: 20, padding: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 16, color: "#0F0F0F", margin: 0 }}>
            Billing History
          </h3>
        </div>

        {invoices.length === 0 ? (
          <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#9CA3AF", textAlign: "center", padding: "24px 0" }}>
            No billing history yet.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                {["Date", "Description", "Amount", "Status", ""].map((h, i) => (
                  <th key={i} style={{
                    textAlign: i === 4 ? "right" : "left",
                    padding: "12px 0",
                    fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600,
                    color: "#9CA3AF", textTransform: "uppercase",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((row) => (
                <tr key={row.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "14px 0", fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#374151" }}>
                    {formatDate(row.createdAt)}
                  </td>
                  <td style={{ padding: "14px 0", fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#374151" }}>
                    {row.plan.charAt(0).toUpperCase() + row.plan.slice(1)} Plan
                  </td>
                  <td style={{ padding: "14px 0", fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13, color: "#0F0F0F" }}>
                    {formatCurrency(row.amount, row.currency)}
                  </td>
                  <td style={{ padding: "14px 0" }}>
                    <StatusBadge status={row.status} />
                  </td>
                  <td style={{ padding: "14px 0", textAlign: "right" }}>
                    <button
                      onClick={handlePortal}
                      style={{
                        fontFamily: "Archivo, sans-serif", fontWeight: 500, fontSize: 12,
                        color: "#4F46E5", backgroundColor: "#EEF2FF",
                        border: "none", borderRadius: 6, padding: "5px 10px",
                        cursor: "pointer", transition: "all 150ms",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#C7D2FE"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#EEF2FF"; }}
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Reactivate banner */}
      {subscription.cancelAtPeriodEnd && (
        <div style={{
          backgroundColor: "#FFFBEB", border: "1px solid #FDE68A",
          borderRadius: 20, padding: 24, marginBottom: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 15, color: "#92400E", marginBottom: 4 }}>
              Your subscription is set to cancel
            </div>
            <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#B45309" }}>
              Access ends {formatDate(subscription.currentPeriodEnd)}. Reactivate to keep your plan.
            </div>
          </div>
          <button
            onClick={handleReactivate}
            disabled={loadingAction}
            style={{
              fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13,
              color: "#fff", backgroundColor: "#D97706",
              border: "none", borderRadius: 10, padding: "10px 20px",
              cursor: loadingAction ? "not-allowed" : "pointer", transition: "all 150ms",
              whiteSpace: "nowrap", flexShrink: 0,
            }}
            onMouseEnter={(e) => { if (!loadingAction) e.currentTarget.style.backgroundColor = "#B45309"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#D97706"; }}
          >
            {loadingAction ? "Loading…" : "Reactivate Subscription"}
          </button>
        </div>
      )}

      {/* Danger zone */}
      {!subscription.cancelAtPeriodEnd && plan !== "free" && (
        <div style={{
          backgroundColor: "#FFF5F5", border: "1px solid #FECACA",
          borderRadius: 20, padding: 24,
        }}>
          <h3 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 16, color: "#991B1B", margin: "0 0 8px" }}>
            Danger Zone
          </h3>
          <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#991B1B", marginBottom: 16 }}>
            Once you cancel your subscription, you will lose access to all premium features at the end of your billing period.
          </p>
          <button
            onClick={() => setCancelOpen(true)}
            style={{
              fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13,
              color: "#EF4444", backgroundColor: "#fff",
              border: "1px solid #EF4444", borderRadius: 10, padding: "10px 16px",
              cursor: "pointer", transition: "all 150ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#EF4444";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fff";
              e.currentTarget.style.color = "#EF4444";
            }}
          >
            Cancel Subscription
          </button>
        </div>
      )}

      <AnimatePresence>
        {cancelOpen && (
          <CancelModal
            open={cancelOpen}
            onClose={() => setCancelOpen(false)}
            onConfirm={handleCancel}
            loading={loadingAction}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
