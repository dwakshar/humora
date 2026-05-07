import { useState, useEffect } from "react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { useAuth } from "@context/AuthContext";
import { api } from "@utils/api";

const PERIOD_DAYS = { "7D": 7, "30D": 30, "90D": 90 };

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getFavicon(domain) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

const QUICK_ACTIONS = [
  { title: "Add New Site", icon: PlusIcon, href: "/dashboard/sites" },
  { title: "View API Docs", icon: BookIcon, href: "/docs" },
  { title: "Upgrade Plan", icon: ArrowUpIcon, href: "/dashboard/billing" },
];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: "#fff",
        padding: "10px 14px",
        borderRadius: 8,
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        border: "1px solid #E5E7EB",
      }}>
        <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#9CA3AF", marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 14, color: "#0F0F0F" }}>
          {payload[0].value.toLocaleString()} verifications
        </div>
      </div>
    );
  }
  return null;
}

function KPICard({ title, value, sub, trend, trendUp, icon, progress }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 500, color: "#9CA3AF", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          {title}
        </div>
        {icon && <div style={{ color: "#4F46E5" }}>{icon}</div>}
      </div>
      <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 900, fontSize: 40, color: "#0F0F0F", lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280", marginTop: 4 }}>
          {sub}
        </div>
      )}
      {trend && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontFamily: "Archivo, sans-serif",
          fontSize: 13,
          fontWeight: 600,
          color: trendUp ? "#10B981" : "#EF4444",
          marginTop: 8,
        }}>
          {trendUp ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
          {trend}
        </div>
      )}
      {progress !== undefined && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#6B7280" }}>
              {progress}% used
            </span>
          </div>
          <div style={{ backgroundColor: "#F3F4F6", height: 6, borderRadius: 999, overflow: "hidden" }}>
            <div style={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: "#4F46E5",
              borderRadius: 999,
              transition: "width 0.3s",
            }} />
          </div>
        </div>
      )}
    </motion.div>
  );
}

function VerdictBadge({ verdict }) {
  const styles = {
    pass:       { bg: "#ECFDF5", text: "#065F46" },
    borderline: { bg: "#FFFBEB", text: "#92400E" },
    fail:       { bg: "#FEF2F2", text: "#991B1B" },
  };
  const s = styles[verdict] || styles.pass;
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
      {verdict}
    </span>
  );
}

function Skeleton({ width = "100%", height = 20, radius = 6 }) {
  return (
    <div style={{
      width,
      height,
      borderRadius: radius,
      backgroundColor: "#F3F4F6",
      animation: "pulse 1.5s ease-in-out infinite",
    }} />
  );
}

export default function DashboardHome() {
  const [period, setPeriod] = useState("30D");
  const [overview, setOverview] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [verdictData, setVerdictData] = useState([]);
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingChart, setLoadingChart] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    api.dashboard.overview()
      .then(setOverview)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingOverview(false));
  }, []);

  useEffect(() => {
    setLoadingChart(true);
    api.dashboard.analytics({ period: PERIOD_DAYS[period] })
      .then((data) => {
        setChartData(data.chartData.map((d) => ({ ...d, value: d.total })));
        const vb = data.verdictBreakdown ?? {};
        setVerdictData([
          { name: "Pass",       value: vb.pass       ?? 0, color: "#10B981" },
          { name: "Borderline", value: vb.borderline  ?? 0, color: "#F59E0B" },
          { name: "Fail",       value: vb.fail        ?? 0, color: "#EF4444" },
        ]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingChart(false));
  }, [period]);

  const stats        = overview?.stats ?? {};
  const recentActivity = overview?.recentActivity ?? [];
  const planName     = overview?.user?.plan ?? user?.plan ?? "free";
  const planLabel    = planName.charAt(0).toUpperCase() + planName.slice(1);
  const planLimit    = stats.planLimit ?? { verifications: 1000, domains: 1 };
  const firstName    = (overview?.user?.name ?? user?.name ?? "there").split(" ")[0];
  const currentDate  = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const activeSites      = stats.activeSites ?? 0;
  const maxDomains       = planLimit.domains > 0 ? planLimit.domains : null;
  const sitesProgress    = maxDomains ? Math.min(100, Math.round((activeSites / maxDomains) * 100)) : 0;
  const passRate         = stats.passRate ?? 0;
  const passRatePct      = `${passRate}%`;
  const verificationsStr = (stats.verificationsThisMonth ?? 0).toLocaleString();
  const botsStr          = (stats.botsBlocked ?? 0).toLocaleString();

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
          <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#991B1B", fontSize: 16 }}>×</button>
        </div>
      )}

      {/* Welcome row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 26, color: "#0F0F0F", margin: "0 0 6px" }}>
            {loadingOverview ? "Loading…" : `Good morning, ${firstName}.`}
          </h2>
          <p style={{ fontFamily: "Archivo, sans-serif", fontSize: 15, color: "#6B7280", margin: 0 }}>
            Here's how Humora is performing.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#9CA3AF" }}>
            {currentDate}
          </span>
          <span style={{
            fontFamily: "Archivo, sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: "#4F46E5",
            backgroundColor: "#EEF2FF",
            border: "1px solid #C7D2FE",
            borderRadius: 999,
            padding: "4px 10px",
          }}>
            {loadingOverview ? "—" : `${planLabel} Plan`}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 20 }}>
        <KPICard
          title="Verifications This Month"
          value={loadingOverview ? "—" : verificationsStr}
          sub="total this billing period"
        />
        <KPICard
          title="Pass Rate"
          value={loadingOverview ? "—" : passRatePct}
          sub="of users verified successfully"
        />
        <KPICard
          title="Bots Blocked"
          value={loadingOverview ? "—" : botsStr}
          sub="estimated bot attempts rejected"
          icon={<ShieldIcon />}
        />
        <KPICard
          title="Active Sites"
          value={loadingOverview ? "—" : (maxDomains ? `${activeSites} / ${maxDomains}` : `${activeSites}`)}
          sub={maxDomains ? "domains on your plan" : "unlimited domains"}
          progress={maxDomains ? sitesProgress : undefined}
        />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20, marginBottom: 20 }}>
        {/* Verifications Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{ backgroundColor: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 15, color: "#0F0F0F", margin: 0 }}>
                Verifications Over Time
              </h3>
              <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#9CA3AF" }}>
                Last {PERIOD_DAYS[period]} days
              </span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {["7D", "30D", "90D"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontSize: 12,
                    fontWeight: period === p ? 600 : 400,
                    color: period === p ? "#4F46E5" : "#6B7280",
                    backgroundColor: period === p ? "#EEF2FF" : "transparent",
                    border: "none",
                    borderRadius: 6,
                    padding: "5px 10px",
                    cursor: "pointer",
                    transition: "all 120ms",
                  }}
                  onMouseEnter={(e) => { if (period !== p) e.currentTarget.style.backgroundColor = "#F3F4F6"; }}
                  onMouseLeave={(e) => { if (period !== p) e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          {loadingChart ? (
            <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 28, height: 28, border: "2px solid #4F46E5", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontFamily: "Archivo, sans-serif", fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={{ stroke: "#E5E7EB" }}
                  tickFormatter={fmtDate}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontFamily: "Archivo, sans-serif", fontSize: 11, fill: "#9CA3AF" }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={{ stroke: "#E5E7EB" }}
                  tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Verdict Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          style={{ backgroundColor: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          <h3 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 15, color: "#0F0F0F", margin: "0 0 16px" }}>
            Verdict Breakdown
          </h3>
          <div style={{ position: "relative", height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={verdictData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {verdictData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}>
              <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 18, color: "#0F0F0F" }}>
                {loadingChart ? "—" : `${verdictData[0]?.value ?? 0}%`}
              </div>
              <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 10, color: "#9CA3AF" }}>
                pass rate
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {verdictData.map((item) => (
              <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: item.color }} />
                <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#374151", flex: 1 }}>
                  {item.name}
                </span>
                <span style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 13, color: "#0F0F0F" }}>
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        style={{ backgroundColor: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 20 }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 15, color: "#0F0F0F", margin: 0 }}>
            Recent Verifications
          </h3>
          <a
            href="/dashboard/analytics"
            style={{
              fontFamily: "Archivo, sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: "#4F46E5",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            View all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                {["Site", "Time", "Score", "Verdict"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingOverview ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    {[...Array(4)].map((_, j) => (
                      <td key={j} style={{ padding: "14px 16px" }}>
                        <Skeleton height={14} width={j === 0 ? 120 : 60} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "32px 16px", textAlign: "center", fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#9CA3AF" }}>
                    No verifications yet. Add a site and embed the widget to get started.
                  </td>
                </tr>
              ) : (
                recentActivity.map((row, i) => (
                  <tr
                    key={row.sessionId ?? i}
                    style={{ borderBottom: "1px solid #F3F4F6", transition: "background 120ms" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F9FAFB")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <img src={getFavicon(row.domain)} alt="" style={{ width: 20, height: 20, borderRadius: 4 }} />
                        <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: 500, color: "#0F0F0F" }}>
                          {row.domain}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#9CA3AF" }}>
                      {timeAgo(row.timestamp)}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: 500, color: row.score >= 50 ? "#10B981" : row.score >= 35 ? "#F59E0B" : "#EF4444" }}>
                        {row.score}/70
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <VerdictBadge verdict={row.verdict} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {QUICK_ACTIONS.map((action, i) => (
          <motion.a
            key={action.title}
            href={action.href}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 * i }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 20px",
              backgroundColor: "#fff",
              borderRadius: 12,
              border: "1px solid #E5E7EB",
              textDecoration: "none",
              transition: "all 180ms",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#4F46E5";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(79,70,229,0.08)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: "#EEF2FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <action.icon />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 600, fontSize: 14, color: "#0F0F0F" }}>
                {action.title}
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
