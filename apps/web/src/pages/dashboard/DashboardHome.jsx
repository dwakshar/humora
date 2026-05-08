import { useState, useEffect, useCallback } from "react";
import {
  Area, AreaChart, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@context/AuthContext";
import { api } from "@utils/api";

// ─── constants ────────────────────────────────────────────────────────────────
const PERIOD_DAYS = { "7D": 7, "30D": 30, "90D": 90 };

const VERDICT_COLORS = {
  Pass:       "#10B981",
  Borderline: "#F59E0B",
  Fail:       "#EF4444",
};

const PLAN_LIMITS_DISPLAY = {
  free:       { verifications: "1,000",   domains: 1 },
  starter:    { verifications: "10,000",  domains: 3 },
  pro:        { verifications: "100,000", domains: "Unlimited" },
  enterprise: { verifications: "Unlimited", domains: "Unlimited" },
};

// ─── utils ────────────────────────────────────────────────────────────────────
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fmtShortDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fmtLongDate() {
  return new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// ─── primitives ───────────────────────────────────────────────────────────────
function Skeleton({ width = "100%", height = 16, radius = 6 }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: "linear-gradient(90deg, #F3F4F6 25%, #E9EAEC 50%, #F3F4F6 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s ease-in-out infinite",
    }} />
  );
}

function VerdictBadge({ verdict }) {
  const map = {
    pass:       { bg: "#ECFDF5", color: "#065F46", label: "Pass"       },
    borderline: { bg: "#FFFBEB", color: "#92400E", label: "Borderline" },
    fail:       { bg: "#FEF2F2", color: "#991B1B", label: "Fail"       },
  };
  const s = map[verdict] ?? map.pass;
  return (
    <span style={{
      display: "inline-block",
      fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600,
      color: s.color, backgroundColor: s.bg,
      padding: "3px 10px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.04em",
    }}>
      {s.label}
    </span>
  );
}

// ─── KPI card ─────────────────────────────────────────────────────────────────
function KPICard({ title, value, sub, icon, progress, loading, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 24,
        border: "1px solid #E5E7EB",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{
          fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600,
          color: "#9CA3AF", letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          {title}
        </span>
        {icon && (
          <div style={{
            width: 34, height: 34, borderRadius: 10, backgroundColor: "#EEF2FF",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {icon}
          </div>
        )}
      </div>

      {loading ? (
        <>
          <Skeleton width={100} height={36} radius={8} />
          <div style={{ marginTop: 8 }}><Skeleton width={140} height={14} /></div>
        </>
      ) : (
        <>
          <div style={{
            fontFamily: "Archivo, sans-serif", fontWeight: 900, fontSize: 38,
            color: "#0F0F0F", lineHeight: 1, letterSpacing: "-0.02em",
          }}>
            {value}
          </div>
          {sub && (
            <div style={{
              fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#9CA3AF", marginTop: 6,
            }}>
              {sub}
            </div>
          )}
          {progress !== undefined && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 11, color: "#9CA3AF" }}>
                  {progress}% of limit used
                </span>
                <span style={{
                  fontFamily: "Archivo, sans-serif", fontSize: 11,
                  fontWeight: 600,
                  color: progress >= 90 ? "#EF4444" : progress >= 70 ? "#F59E0B" : "#10B981",
                }}>
                  {progress >= 90 ? "Nearly full" : progress >= 70 ? "Getting full" : "Healthy"}
                </span>
              </div>
              <div style={{ backgroundColor: "#F3F4F6", height: 5, borderRadius: 999, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                  style={{
                    height: "100%", borderRadius: 999,
                    backgroundColor: progress >= 90 ? "#EF4444" : progress >= 70 ? "#F59E0B" : "#4F46E5",
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

// ─── chart tooltip ────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      backgroundColor: "#fff", padding: "10px 14px",
      borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
      border: "1px solid #E5E7EB",
    }}>
      <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#9CA3AF", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 15, color: "#0F0F0F" }}>
        {(payload[0].value ?? 0).toLocaleString()}
        <span style={{ fontWeight: 400, fontSize: 12, color: "#9CA3AF", marginLeft: 4 }}>verifications</span>
      </div>
    </div>
  );
}

// ─── icon helpers ─────────────────────────────────────────────────────────────
function IconShield() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconZap() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

const QUICK_ACTIONS = [
  { title: "Add New Site",   desc: "Register a domain and get a sitekey", icon: IconPlus,  href: "/dashboard/sites"   },
  { title: "View API Docs",  desc: "Integration guides and API reference", icon: IconBook,  href: "/docs"              },
  { title: "Upgrade Plan",   desc: "More verifications and domains",       icon: IconZap,   href: "/dashboard/billing" },
];

// ─── empty chart state ────────────────────────────────────────────────────────
function ChartEmpty() {
  return (
    <div style={{
      height: 260, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 8,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, backgroundColor: "#F3F4F6",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      </div>
      <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#9CA3AF", margin: 0 }}>
        No verification data for this period
      </p>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────
export default function DashboardHome() {
  const { user } = useAuth();
  const [period, setPeriod]               = useState("30D");
  const [overview, setOverview]           = useState(null);
  const [analytics, setAnalytics]         = useState(null);
  const [loadingOverview, setLoadingOv]   = useState(true);
  const [loadingAnalytics, setLoadingAn]  = useState(true);
  const [error, setError]                 = useState(null);

  const loadOverview = useCallback(() => {
    setLoadingOv(true);
    api.dashboard.overview()
      .then(setOverview)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingOv(false));
  }, []);

  const loadAnalytics = useCallback(() => {
    setLoadingAn(true);
    api.dashboard.analytics({ period: PERIOD_DAYS[period] })
      .then(setAnalytics)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingAn(false));
  }, [period]);

  useEffect(() => { loadOverview(); }, [loadOverview]);
  useEffect(() => { loadAnalytics(); }, [loadAnalytics]);

  // ── derived ──────────────────────────────────────────────────────────
  const stats           = overview?.stats ?? {};
  const recentActivity  = overview?.recentActivity ?? [];
  const planName        = overview?.user?.plan ?? user?.plan ?? "free";
  const planLabel       = planName.charAt(0).toUpperCase() + planName.slice(1);
  const planLimit       = stats.planLimit ?? { verifications: 1000, domains: 1 };
  const firstName       = (overview?.user?.name ?? user?.name ?? "there").split(" ")[0];

  const activeSites    = stats.activeSites ?? 0;
  const maxDomains     = planLimit.domains > 0 ? planLimit.domains : null;
  const sitesProgress  = maxDomains ? Math.min(100, Math.round((activeSites / maxDomains) * 100)) : 0;
  const passRate       = stats.passRate ?? 0;

  const chartData = (analytics?.chartData ?? []).map((d) => ({ ...d, value: d.total }));
  const vb        = analytics?.verdictBreakdown ?? {};
  const verdictData = [
    { name: "Pass",       value: vb.pass       ?? 0, color: VERDICT_COLORS.Pass       },
    { name: "Borderline", value: vb.borderline  ?? 0, color: VERDICT_COLORS.Borderline },
    { name: "Fail",       value: vb.fail        ?? 0, color: VERDICT_COLORS.Fail       },
  ];
  const hasVerdictData = verdictData.some((d) => d.value > 0);
  const hasChartData   = chartData.some((d) => d.value > 0);

  return (
    <div>
      {/* ── shimmer keyframes injected once ── */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* ── error banner ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", marginBottom: 16 }}
          >
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              backgroundColor: "#FEF2F2", border: "1px solid #FECACA",
              borderRadius: 12, padding: "12px 16px",
              fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#991B1B",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => { setError(null); loadOverview(); loadAnalytics(); }}
                  style={{
                    fontFamily: "Archivo, sans-serif", fontSize: 12, fontWeight: 600,
                    color: "#991B1B", background: "none", border: "1px solid #FECACA",
                    borderRadius: 6, padding: "4px 10px", cursor: "pointer",
                  }}
                >
                  Retry
                </button>
                <button
                  onClick={() => setError(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#991B1B", fontSize: 18, lineHeight: 1, padding: 0 }}
                >
                  ×
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── welcome row ── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}
      >
        <div>
          <h2 style={{
            fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 26,
            color: "#0F0F0F", margin: "0 0 6px", letterSpacing: "-0.01em",
          }}>
            {loadingOverview
              ? <Skeleton width={220} height={28} radius={8} />
              : `${greeting()}, ${firstName}.`
            }
          </h2>
          <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 14, color: "#6B7280", margin: 0 }}>
            Here's how Humora is performing across your sites.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#9CA3AF" }}>
            {fmtLongDate()}
          </span>
          <span style={{
            fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 700,
            color: "#4F46E5", backgroundColor: "#EEF2FF",
            border: "1px solid #C7D2FE", borderRadius: 999, padding: "5px 12px",
            letterSpacing: "0.04em", textTransform: "uppercase",
          }}>
            {loadingOverview ? "—" : `${planLabel}`}
          </span>
        </div>
      </motion.div>

      {/* ── KPI cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        <KPICard
          delay={0}
          title="Verifications This Month"
          value={(stats.verificationsThisMonth ?? 0).toLocaleString()}
          sub="total this billing period"
          loading={loadingOverview}
        />
        <KPICard
          delay={0.05}
          title="Pass Rate"
          value={`${passRate}%`}
          sub="users verified successfully"
          loading={loadingOverview}
        />
        <KPICard
          delay={0.1}
          title="Bots Blocked"
          value={(stats.botsBlocked ?? 0).toLocaleString()}
          sub="estimated bot attempts stopped"
          icon={<IconShield />}
          loading={loadingOverview}
        />
        <KPICard
          delay={0.15}
          title="Active Sites"
          value={maxDomains ? `${activeSites} / ${maxDomains}` : String(activeSites)}
          sub={maxDomains ? "domains on your plan" : "no domain limit"}
          progress={maxDomains ? sitesProgress : undefined}
          loading={loadingOverview}
        />
      </div>

      {/* ── charts row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16, marginBottom: 20 }}>

        {/* Verifications over time */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{
            backgroundColor: "#fff", borderRadius: 20, padding: 24,
            border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h3 style={{
                fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 15,
                color: "#0F0F0F", margin: "0 0 2px",
              }}>
                Verifications Over Time
              </h3>
              <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#9CA3AF" }}>
                Last {PERIOD_DAYS[period]} days
              </span>
            </div>
            <div style={{
              display: "flex", gap: 2,
              backgroundColor: "#F3F4F6", borderRadius: 10, padding: 3,
            }}>
              {Object.keys(PERIOD_DAYS).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  style={{
                    fontFamily: "Archivo, sans-serif", fontSize: 12, fontWeight: period === p ? 700 : 500,
                    color: period === p ? "#0F0F0F" : "#9CA3AF",
                    backgroundColor: period === p ? "#fff" : "transparent",
                    border: "none", borderRadius: 8, padding: "6px 12px",
                    cursor: "pointer", transition: "all 150ms",
                    boxShadow: period === p ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {loadingAnalytics ? (
            <div style={{ height: 260, display: "flex", flexDirection: "column", gap: 8, justifyContent: "flex-end", paddingBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 220 }}>
                {[60, 80, 45, 90, 70, 55, 85, 40, 75, 65, 90, 50].map((h, i) => (
                  <Skeleton key={i} width="100%" height={`${h}%`} radius={4} />
                ))}
              </div>
              <Skeleton height={12} width="100%" />
            </div>
          ) : !hasChartData ? (
            <ChartEmpty />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#4F46E5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontFamily: "Archivo, sans-serif", fontSize: 10, fill: "#9CA3AF" }}
                  axisLine={{ stroke: "#F3F4F6" }}
                  tickLine={false}
                  tickFormatter={fmtShortDate}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontFamily: "Archivo, sans-serif", fontSize: 10, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
                  width={40}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#E5E7EB", strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  fill="url(#areaGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#4F46E5", strokeWidth: 2, stroke: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Verdict breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          style={{
            backgroundColor: "#fff", borderRadius: 20, padding: 24,
            border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            display: "flex", flexDirection: "column",
          }}
        >
          <h3 style={{
            fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 15,
            color: "#0F0F0F", margin: "0 0 4px",
          }}>
            Verdict Breakdown
          </h3>
          <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#9CA3AF", marginBottom: 16 }}>
            Last {PERIOD_DAYS[period]} days
          </span>

          {loadingAnalytics ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <Skeleton width={160} height={160} radius="50%" />
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
                <Skeleton height={14} /><Skeleton height={14} /><Skeleton height={14} />
              </div>
            </div>
          ) : !hasVerdictData ? (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                border: "8px solid #F3F4F6",
              }} />
              <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#9CA3AF", margin: 0 }}>
                No data yet
              </p>
            </div>
          ) : (
            <>
              {/* donut */}
              <div style={{ position: "relative", height: 190 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={verdictData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={78}
                      paddingAngle={3}
                      startAngle={90}
                      endAngle={-270}
                    >
                      {verdictData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v, name) => [`${v}%`, name]}
                      contentStyle={{
                        fontFamily: "Archivo, sans-serif", fontSize: 12,
                        borderRadius: 10, border: "1px solid #E5E7EB",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* center label */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none",
                }}>
                  <div style={{
                    fontFamily: "Archivo, sans-serif", fontWeight: 900,
                    fontSize: 22, color: "#0F0F0F", lineHeight: 1, letterSpacing: "-0.02em",
                  }}>
                    {passRate}%
                  </div>
                  <div style={{
                    fontFamily: "Archivo, sans-serif", fontSize: 10,
                    color: "#9CA3AF", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.06em",
                  }}>
                    pass rate
                  </div>
                </div>
              </div>

              {/* legend */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
                {verdictData.map((item) => (
                  <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: item.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#374151", flex: 1 }}>
                      {item.name}
                    </span>
                    <span style={{
                      fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 13, color: "#0F0F0F",
                    }}>
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* ── recent verifications ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        style={{
          backgroundColor: "#fff", borderRadius: 20, padding: 24,
          border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{
            fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 15, color: "#0F0F0F", margin: 0,
          }}>
            Recent Verifications
          </h3>
          <a
            href="/dashboard/analytics"
            style={{
              fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: 600,
              color: "#4F46E5", textDecoration: "none",
              display: "flex", alignItems: "center", gap: 4,
            }}
          >
            View all
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #F3F4F6" }}>
                {["Site", "Time", "Score", "Verdict"].map((h) => (
                  <th key={h} style={{
                    textAlign: "left", padding: "0 16px 12px",
                    fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600,
                    color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingOverview ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #F9FAFB" }}>
                    <td style={{ padding: "14px 16px" }}><Skeleton width={140} height={14} /></td>
                    <td style={{ padding: "14px 16px" }}><Skeleton width={70} height={14} /></td>
                    <td style={{ padding: "14px 16px" }}><Skeleton width={50} height={14} /></td>
                    <td style={{ padding: "14px 16px" }}><Skeleton width={60} height={22} radius={999} /></td>
                  </tr>
                ))
              ) : recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "40px 16px", textAlign: "center" }}>
                    <div style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 12, backgroundColor: "#F3F4F6",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                      </div>
                      <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 14, fontWeight: 600, color: "#374151" }}>
                        No verifications yet
                      </span>
                      <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#9CA3AF" }}>
                        Add a site and embed the popup widget to get started.
                      </span>
                      <a
                        href="/dashboard/sites"
                        style={{
                          fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: 600,
                          color: "#4F46E5", textDecoration: "none", marginTop: 4,
                          display: "flex", alignItems: "center", gap: 4,
                        }}
                      >
                        Go to My Sites →
                      </a>
                    </div>
                  </td>
                </tr>
              ) : (
                recentActivity.map((row, i) => (
                  <tr
                    key={row.sessionId ?? i}
                    style={{ borderBottom: "1px solid #F9FAFB", transition: "background 100ms" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FAFAFA")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${row.domain}&sz=32`}
                          alt=""
                          style={{ width: 20, height: 20, borderRadius: 5 }}
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                        <span style={{
                          fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: 500, color: "#0F0F0F",
                        }}>
                          {row.domain}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#9CA3AF" }}>
                        {timeAgo(row.timestamp)}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{
                        fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: 600,
                        color: (row.score ?? 0) >= 50 ? "#10B981" : (row.score ?? 0) >= 35 ? "#F59E0B" : "#EF4444",
                      }}>
                        {row.score ?? 0}
                        <span style={{ fontWeight: 400, color: "#D1D5DB", fontSize: 12 }}>/70</span>
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <VerdictBadge verdict={row.verdict} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── quick actions ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {QUICK_ACTIONS.map((action, i) => (
          <motion.a
            key={action.title}
            href={action.href}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.25 + i * 0.06 }}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "16px 18px",
              backgroundColor: "#fff",
              borderRadius: 14,
              border: "1px solid #E5E7EB",
              textDecoration: "none",
              transition: "all 160ms",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#A5B4FC";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(79,70,229,0.08)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10, backgroundColor: "#EEF2FF",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <action.icon />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 14, color: "#0F0F0F",
              }}>
                {action.title}
              </div>
              <div style={{
                fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#9CA3AF",
                marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {action.desc}
              </div>
            </div>
            <IconArrowRight />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
