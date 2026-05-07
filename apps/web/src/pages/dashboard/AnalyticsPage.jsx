import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { api } from "@utils/api";

const PERIOD_DAYS = { "7D": 7, "30D": 30, "90D": 90 };

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function CustomTooltip({ active, payload, label, formatter }) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: "#fff",
        padding: "10px 14px",
        borderRadius: 8,
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        border: "1px solid #E5E7EB",
      }}>
        <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 12, color: "#9CA3AF", marginBottom: 4 }}>
          {label}
        </div>
        {payload.map((p, i) => (
          <div key={i} style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: p.color || "#0F0F0F", fontWeight: 500 }}>
            {p.name}: {formatter ? formatter(p.value) : p.value.toLocaleString()}
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function KPICard({ title, value, sub, trend, trendUp }) {
  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: 24,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 500, color: "#9CA3AF", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 900, fontSize: 36, color: "#0F0F0F" }}>
        {value}
      </div>
      {sub && <div style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280", marginTop: 4 }}>{sub}</div>}
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
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      gap: 8,
    }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M18 12l-5-5-4 4-3-3" />
      </svg>
      <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#9CA3AF" }}>
        {message}
      </span>
    </div>
  );
}

export default function AnalyticsPage() {
  const [selectedSitekey, setSelectedSitekey] = useState("all");
  const [period, setPeriod]                   = useState("30D");
  const [data, setData]                       = useState(null);
  const [sites, setSites]                     = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);

  // Load sites for dropdown once
  useEffect(() => {
    api.dashboard.sites()
      .then((res) => setSites(res.sites ?? []))
      .catch(() => {});
  }, []);

  // Re-fetch analytics whenever period or site filter changes
  useEffect(() => {
    setLoading(true);
    const params = { period: PERIOD_DAYS[period] };
    if (selectedSitekey !== "all") params.sitekey = selectedSitekey;

    api.dashboard.analytics(params)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [period, selectedSitekey]);

  const summary         = data?.summary ?? {};
  const chartData       = data?.chartData ?? [];
  const sitePerformance = data?.sitePerformance ?? [];
  const topQuestions    = data?.topQuestions ?? [];

  const exportCSV = () => {
    const headers = ["Date", "Total", "Passed", "Failed", "Borderline", "Pass Rate"];
    const rows = chartData.map((d) => [
      d.date, d.total, d.passed, d.failed ?? 0, d.borderline ?? 0,
      d.total > 0 ? `${((d.passed / d.total) * 100).toFixed(1)}%` : "0%",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `humora-analytics-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

      {/* Filter bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <select
          value={selectedSitekey}
          onChange={(e) => setSelectedSitekey(e.target.value)}
          style={{
            fontFamily: "Archivo, sans-serif",
            fontSize: 13,
            color: "#0F0F0F",
            backgroundColor: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            padding: "8px 12px",
            cursor: "pointer",
            minWidth: 160,
          }}
        >
          <option value="all">All Sites</option>
          {sites.map((s) => (
            <option key={s.sitekey} value={s.sitekey}>{s.domain}</option>
          ))}
        </select>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={exportCSV}
            disabled={chartData.length === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "Archivo, sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: "#4F46E5",
              backgroundColor: "#EEF2FF",
              border: "none",
              borderRadius: 8,
              padding: "8px 12px",
              cursor: chartData.length === 0 ? "not-allowed" : "pointer",
              transition: "all 150ms",
              opacity: chartData.length === 0 ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (chartData.length > 0) {
                e.currentTarget.style.backgroundColor = "#4F46E5";
                e.currentTarget.style.color = "#fff";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#EEF2FF";
              e.currentTarget.style.color = "#4F46E5";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download CSV
          </button>
        </div>
      </div>

      {/* Row 1 - KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 20 }}>
        <KPICard
          title="Total Verifications"
          value={loading ? "—" : (summary.total ?? 0).toLocaleString()}
        />
        <KPICard
          title="Pass Rate"
          value={loading ? "—" : `${summary.passRate ?? 0}%`}
          sub="of all verifications"
        />
        <KPICard
          title="Avg Score"
          value={loading ? "—" : `${summary.avgScore ?? 0}/70`}
          sub="average completion score"
        />
        <KPICard
          title="Bots Blocked"
          value={loading ? "—" : (summary.failed ?? 0).toLocaleString()}
          sub="failed verifications"
        />
      </div>

      {/* Row 2 - Main Chart */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{ backgroundColor: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 20 }}
      >
        <h3 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 15, color: "#0F0F0F", margin: "0 0 20px" }}>
          Verification Volume
        </h3>
        {loading ? (
          <div style={{ height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 28, height: 28, border: "2px solid #4F46E5", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : chartData.length === 0 ? (
          <div style={{ height: 320 }}>
            <EmptyState message="No verifications in this period." />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
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
              />
              <Tooltip content={<CustomTooltip formatter={(v) => v.toLocaleString()} />} />
              <Line type="monotone" dataKey="total"  name="Total"  stroke="#4F46E5" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="passed" name="Passed" stroke="#10B981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Row 3 - Site Performance + Top Questions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Site Performance */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{ backgroundColor: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          <h3 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 15, color: "#0F0F0F", margin: "0 0 16px" }}>
            Site Performance
          </h3>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
              <div style={{ width: 24, height: 24, border: "2px solid #4F46E5", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            </div>
          ) : sitePerformance.length === 0 ? (
            <EmptyState message="No site data yet." />
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                  {["Site", "Pass %", "Avg Score", "Total"].map((h, i) => (
                    <th key={h} style={{ textAlign: i === 0 ? "left" : "right", padding: "10px 0", fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sitePerformance.map((row, i) => (
                  <tr key={row.sitekey ?? i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "12px 0" }}>
                      <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: 500, color: "#0F0F0F" }}>
                        {row.domain}
                      </span>
                    </td>
                    <td style={{ padding: "12px 0", textAlign: "right" }}>
                      <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: 600, color: row.passRate >= 90 ? "#10B981" : "#F59E0B" }}>
                        {row.passRate}%
                      </span>
                    </td>
                    <td style={{ padding: "12px 0", textAlign: "right" }}>
                      <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: 500, color: "#374151" }}>
                        {row.avgScore}/70
                      </span>
                    </td>
                    <td style={{ padding: "12px 0", textAlign: "right", fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280" }}>
                      {row.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>

        {/* Top Questions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          style={{ backgroundColor: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
        >
          <h3 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 15, color: "#0F0F0F", margin: "0 0 16px" }}>
            Top Performing Questions
          </h3>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
              <div style={{ width: 24, height: 24, border: "2px solid #4F46E5", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            </div>
          ) : topQuestions.length === 0 ? (
            <EmptyState message="No question data yet." />
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                  <th style={{ textAlign: "left", padding: "10px 0", fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" }}>Question</th>
                  <th style={{ textAlign: "right", padding: "10px 0", fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" }}>Pass Rate</th>
                  <th style={{ textAlign: "right", padding: "10px 0", fontFamily: "Archivo, sans-serif", fontSize: 11, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase" }}>Avg Time</th>
                </tr>
              </thead>
              <tbody>
                {topQuestions.map((row) => (
                  <tr key={row.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "12px 0" }}>
                      <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#0F0F0F" }}>
                        {row.text.length > 36 ? row.text.slice(0, 36) + "…" : row.text}
                      </span>
                    </td>
                    <td style={{ padding: "12px 0", textAlign: "right" }}>
                      <span style={{ fontFamily: "Archivo, sans-serif", fontSize: 13, fontWeight: 600, color: row.passRate >= 80 ? "#10B981" : "#F59E0B" }}>
                        {row.passRate}%
                      </span>
                    </td>
                    <td style={{ padding: "12px 0", textAlign: "right", fontFamily: "Archivo, sans-serif", fontSize: 13, color: "#6B7280" }}>
                      {(row.avgTime / 1000).toFixed(1)}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </div>

      {/* Row 4 - Verdict bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        style={{ backgroundColor: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      >
        <h3 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 15, color: "#0F0F0F", margin: "0 0 16px" }}>
          Daily Verdict Breakdown
        </h3>
        {loading ? (
          <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 28, height: 28, border: "2px solid #4F46E5", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : chartData.length === 0 ? (
          <div style={{ height: 280 }}>
            <EmptyState message="No data in this period." />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
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
              />
              <Tooltip content={<CustomTooltip formatter={(v) => v.toLocaleString()} />} />
              <Bar dataKey="passed"    name="Passed"     stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="borderline" name="Borderline" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
              <Bar dataKey="failed"    name="Failed"     stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </div>
  );
}
