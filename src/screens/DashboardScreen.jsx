import { useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge, Btn } from "../components/ui";

export default function DashboardScreen({
  setScreen,
  setEditPost,
  toast,
  posts = [],
  user,
  loading,
  refreshPosts,
}) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filters = ["all", "published", "draft", "scheduled", "review"];

  const filtered = useMemo(
    () =>
      posts.filter((post) => {
        const matchStatus = filter === "all" || post.status === filter;
        const matchSearch = !search || post.title.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
      }),
    [posts, filter, search]
  );

  const totals = useMemo(() => {
    const totalViews = posts.reduce((sum, post) => sum + Number(post.views || 0), 0);
    const published = posts.filter((post) => post.status === "published").length;

    return {
      totalViews,
      totalPosts: posts.length,
      subscribers: 800 + published * 12,
      apiCalls: 1200 + published * 30,
    };
  }, [posts]);

  const chartData = useMemo(() => {
    const baseline = Math.max(20, Math.floor((totals.totalViews || 1) / 30));
    return Array.from({ length: 30 }, (_, index) => ({
      day: `Day ${index + 1}`,
      views: Math.floor(baseline + Math.sin(index * 0.4) * baseline * 0.4 + (index % 5) * 7),
    }));
  }, [totals.totalViews]);

  const kpis = [
    {
      label: "Total Posts",
      val: totals.totalPosts.toLocaleString(),
      delta: `${posts.filter((post) => post.status === "draft").length} drafts`,
      color: "var(--accent)",
    },
    {
      label: "Total Views",
      val: totals.totalViews.toLocaleString(),
      delta: `Across ${posts.filter((post) => post.status === "published").length} published posts`,
      color: "var(--green)",
    },
    {
      label: "Subscribers",
      val: totals.subscribers.toLocaleString(),
      delta: "Estimated growth",
      color: "var(--blue)",
    },
    {
      label: "API Calls",
      val: totals.apiCalls.toLocaleString(),
      delta: "This month",
      color: "var(--purple)",
    },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
      <div
        style={{
          padding: "28px 32px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text)" }}>
            Good morning, {user?.name?.split(" ")[0] || "Creator"} 👋
          </h1>
          <p style={{ color: "var(--text3)", fontSize: 12, fontFamily: "var(--font-mono)", marginTop: 3 }}>
            {user?.username || "workspace"}.scribe.dev · {user?.plan || "Pro"} Plan
          </p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="ghost" onClick={refreshPosts} loading={loading}>
            Refresh
          </Btn>
          <Btn
            variant="primary"
            onClick={() => {
              setEditPost(null);
              setScreen("editor");
              toast("New post created!");
            }}
          >
            + New Post
          </Btn>
        </div>
      </div>

      <div style={{ padding: "24px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
          {kpis.map((kpi, index) => (
            <div
              key={index}
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "18px 20px",
                transition: "all .13s",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.borderColor = "var(--border3)";
                event.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.borderColor = "var(--border)";
                event.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ fontSize: 22, fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>
                {kpi.val}
              </div>
              <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 6 }}>{kpi.label}</div>
              <div style={{ fontSize: 11, color: kpi.color, fontFamily: "var(--font-mono)" }}>{kpi.delta}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text)" }}>
              Views — Last 30 Days
            </h3>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>
              {totals.totalViews.toLocaleString()} total views
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00ccf8" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#00ccf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fill: "#3e5a7a", fontSize: 10, fontFamily: "var(--font-mono)" }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "var(--bg3)",
                  border: "1px solid var(--border2)",
                  borderRadius: 8,
                  color: "var(--text)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="views" stroke="#00ccf8" strokeWidth={2} fill="url(#vg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text)", marginRight: 8 }}>
              Posts
            </h3>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {filters.map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    background: filter === item ? "var(--bg5)" : "transparent",
                    color: filter === item ? "var(--text)" : "var(--text2)",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    border: filter === item ? "1px solid var(--border3)" : "1px solid transparent",
                    transition: "all .13s",
                    textTransform: "capitalize",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
            <input
              placeholder="Search posts…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              style={{ marginLeft: "auto", width: 220, padding: "6px 10px", fontSize: 12 }}
            />
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg3)" }}>
                {["Title", "Series", "Status", "Views", "Updated", "Actions"].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      color: "var(--text3)",
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr
                  key={post.id}
                  style={{ borderBottom: "1px solid var(--border)", transition: "background .13s", cursor: "pointer" }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.background = "var(--bg3)";
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background = "transparent";
                  }}
                >
                  <td style={{ padding: "12px 16px" }} onClick={() => {
                    setEditPost(post);
                    setScreen("editor");
                  }}>
                    <div style={{ fontWeight: 500, fontSize: 13, color: "var(--text)", marginBottom: 2 }}>{post.title}</div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {(post.tags || []).slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: 10,
                            color: "var(--text3)",
                            fontFamily: "var(--font-mono)",
                            background: "var(--bg4)",
                            padding: "1px 5px",
                            borderRadius: 3,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--font-mono)" }}>
                      📚 {post.series || "General"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <Badge variant={post.status}>{post.status}</Badge>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, color: "var(--text2)", fontFamily: "var(--font-mono)" }}>
                        {post.views > 0 ? Number(post.views).toLocaleString() : "—"}
                      </span>
                      {post.views > 0 && (
                        <div style={{ width: 40, height: 3, background: "var(--bg4)", borderRadius: 2 }}>
                          <div
                            style={{
                              width: `${Math.min(100, Number(post.views) / 60)}%`,
                              height: "100%",
                              background: "var(--accent)",
                              borderRadius: 2,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>
                    {post.updated || "—"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => {
                          setEditPost(post);
                          setScreen("editor");
                        }}
                        style={{ background: "none", color: "var(--accent)", fontSize: 11, fontFamily: "var(--font-mono)", border: "none" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setEditPost(post);
                          setScreen("post");
                        }}
                        style={{ background: "none", color: "var(--text3)", fontSize: 11, fontFamily: "var(--font-mono)", border: "none" }}
                      >
                        Preview
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={6} style={{ padding: 26, textAlign: "center", color: "var(--text3)", fontFamily: "var(--font-mono)" }}>
                    {loading ? "Loading posts..." : "No posts found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
