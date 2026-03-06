import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { analyticsApi } from "../lib/apiClient";

const PIE_COLORS = ["#00ccf8", "#5aabff", "#b08aff", "#00e5a0", "#ffaa44"];

export default function AnalyticsScreen({ token, toast }) {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!token) {
        setAnalytics(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await analyticsApi.overview(token);
        if (!alive) return;
        setAnalytics(response.data);
      } catch (error) {
        if (!alive) return;
        toast(error.message || "Failed to load analytics", "error");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [token]);

  const kpis = useMemo(() => {
    const data = analytics?.kpis || {};
    return [
      { label: "Total Views (30d)", val: (data.totalViews || 0).toLocaleString(), delta: "Live", color: "var(--accent)" },
      { label: "Unique Visitors", val: (data.uniqueVisitors || 0).toLocaleString(), delta: "Estimated", color: "var(--green)" },
      { label: "Avg Read Time", val: data.avgReadTime || "0 min", delta: "Content quality", color: "var(--blue)" },
      { label: "Subscribers", val: (data.subscribers || 0).toLocaleString(), delta: "Audience", color: "var(--purple)" },
    ];
  }, [analytics]);

  const chartData = analytics?.chart || [];
  const trafficData = analytics?.traffic || [];
  const topPostsData = analytics?.topPosts || [];
  const geoData = analytics?.geo || [];
  const performance = analytics?.performance || [];

  if (!token) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <span style={{ fontFamily: "var(--font-mono)", color: "var(--text3)" }}>Sign in to view analytics</span>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)", padding: "28px 32px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--text)", letterSpacing: "-0.5px", marginBottom: 24 }}>Analytics</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 20px" }}>
            <div style={{ fontSize: 22, fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>{loading ? "..." : kpi.val}</div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 6 }}>{kpi.label}</div>
            <div style={{ fontSize: 11, color: kpi.color, fontFamily: "var(--font-mono)" }}>{kpi.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 16 }}>Views over time (30 days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="aviz" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ccf8" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#00ccf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: "#3e5a7a", fontSize: 10, fontFamily: "var(--font-mono)" }} tickLine={false} axisLine={false} interval={6} />
              <Tooltip contentStyle={{ background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text)" }} />
              <Area type="monotone" dataKey="views" stroke="#00ccf8" strokeWidth={2} fill="url(#aviz)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 16 }}>Traffic sources</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={trafficData} cx="50%" cy="50%" outerRadius={68} dataKey="value" paddingAngle={2}>
                {trafficData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 8 }}>
            {trafficData.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text2)" }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{d.name}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 16 }}>Top Posts</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topPostsData} layout="vertical">
              <XAxis type="number" tick={{ fill: "#3e5a7a", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#7a9ab8", fontSize: 10 }} axisLine={false} tickLine={false} width={110} />
              <Tooltip contentStyle={{ background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text)" }} />
              <Bar dataKey="views" fill="#00ccf8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 14 }}>Geo Distribution</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Country", "Visitors", "Share"].map((h) => <th key={h} style={{ padding: "6px 8px", textAlign: "left", fontSize: 10, color: "var(--text3)", fontFamily: "var(--font-mono)", borderBottom: "1px solid var(--border)" }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {geoData.map((row) => {
                const total = geoData.reduce((sum, item) => sum + Number(item.visitors || 0), 0) || 1;
                const share = Math.round((Number(row.visitors || 0) / total) * 100);
                return (
                  <tr key={row.country} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px", fontSize: 12, color: "var(--text2)" }}>{row.country}</td>
                    <td style={{ padding: "8px", fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-mono)" }}>{row.visitors}</td>
                    <td style={{ padding: "8px", fontSize: 12, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>{share}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text)" }}>Posts Performance</h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg3)" }}>
              {["Title", "Views", "Avg Read%", "Subscribers", "Published", "Series"].map((heading) => (
                <th key={heading} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)", borderBottom: "1px solid var(--border)" }}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {performance.map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "12px 14px", fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{row.title}</td>
                <td style={{ padding: "12px 14px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text2)" }}>{Number(row.views || 0).toLocaleString()}</td>
                <td style={{ padding: "12px 14px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--green)" }}>{row.avgRead}</td>
                <td style={{ padding: "12px 14px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text2)" }}>{row.subscribers}</td>
                <td style={{ padding: "12px 14px", fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>{row.published}</td>
                <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--text2)" }}>{row.series}</td>
              </tr>
            ))}
            {!performance.length && (
              <tr>
                <td colSpan={6} style={{ padding: 20, textAlign: "center", color: "var(--text3)", fontFamily: "var(--font-mono)" }}>No analytics yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
