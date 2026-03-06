import { Avatar, Badge, Btn } from "../components/ui";

export default function BlogScreen({ setScreen, posts = [], user, setEditPost }) {
  const profile = user || {
    name: "Abhishek Panda",
    bio: "Technical blogger",
    github: "@abhishek-panda",
    twitter: "@AbhishekPanda",
    website: "https://example.com",
  };

  const seriesList = [
    { name: "C# Mastery", icon: "🎯", chapters: 24, desc: "Deep dive into C# patterns, performance, CLR internals.", progress: 75, color: "var(--accent)" },
    { name: "Cloud Architecture", icon: "☁️", chapters: 12, desc: "Microservices, K8s, distributed systems with .NET.", progress: 30, color: "var(--blue)" },
    { name: "Frontend Mastery", icon: "⚡", chapters: 8, desc: "Modern React, Next.js, TypeScript and performance.", progress: 0, color: "var(--purple)" },
  ];

  const published = [...posts]
    .filter((post) => post.status === "published")
    .sort((a, b) => new Date(b.publishedAt || b.updatedAt || 0) - new Date(a.publishedAt || a.updatedAt || 0));

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "var(--nav-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)", padding: "0 48px", display: "flex", alignItems: "center", height: 56, gap: 32 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--text)" }}>{profile.name}</h1>
        <div style={{ display: "flex", gap: 20, marginLeft: 24 }}>
          {["Series", "About"].map((item) => (
            <button key={item} style={{ background: "none", color: "var(--text2)", fontSize: 13, fontFamily: "var(--font-body)", border: "none", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text2)")}>{item}</button>
          ))}
        </div>
        <Btn variant="primary" size="sm" style={{ marginLeft: "auto" }}>Subscribe →</Btn>
      </nav>

      <section style={{ padding: "56px 48px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", marginBottom: 8 }}>
          <Avatar name={profile.name} size="lg" />
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 38, color: "var(--text)", letterSpacing: "-1px", marginBottom: 8 }}>{profile.name}</h1>
            <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.7, maxWidth: 540, marginBottom: 16 }}>{profile.bio || ""}</p>
            <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
              {[[posts.length, "posts"], ["2,400+", "readers"], ["3", "series"]].map(([n, l]) => (
                <div key={l}><span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text)" }}>{n}</span> <span style={{ color: "var(--text3)", fontSize: 13 }}>{l}</span></div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {["GitHub", "Twitter", "Website"].map((platform) => <a key={platform} style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text2)", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 10px" }}>{platform}</a>)}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 48px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text)", letterSpacing: "-0.5px", marginBottom: 18 }}>Series</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 48 }}>
          {seriesList.map((s, i) => (
            <div key={i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, padding: 22, cursor: "pointer", transition: "all .13s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <span style={{ fontSize: 26, display: "block", marginBottom: 12 }}>{s.icon}</span>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 6 }}>{s.name}</h3>
              <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6, marginBottom: 12 }}>{s.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>{s.chapters} chapters</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: s.color }}>{s.progress}% read</span>
              </div>
              <div style={{ height: 3, background: "var(--bg4)", borderRadius: 2 }}><div style={{ width: `${s.progress}%`, height: "100%", background: s.color, borderRadius: 2 }} /></div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text)", letterSpacing: "-0.5px" }}>Recent Posts</h2>
        </div>

        {published[0] && (
          <div onClick={() => {
            setEditPost?.(published[0]);
            setScreen("post");
          }} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 16, padding: 28, marginBottom: 18, cursor: "pointer", transition: "all .13s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border3)"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              <Badge variant="published">✨ Featured</Badge>
              <span style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>📚 {published[0].series} · Ch.{published[0].chapter || 1}</span>
              <Badge variant={published[0].difficulty}>{published[0].difficulty}</Badge>
              <span style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>~{published[0].readTime}</span>
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--text)", letterSpacing: "-0.5px", marginBottom: 10 }}>{published[0].title}</h3>
            <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>{published[0].excerpt}</p>
            <div style={{ display: "flex", gap: 6 }}>{(published[0].tags || []).map((t) => <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", background: "var(--bg3)", border: "1px solid var(--border)", padding: "2px 7px", borderRadius: 4 }}>{t}</span>)}</div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {published.slice(1).map((p) => (
            <div key={p.id} onClick={() => {
              setEditPost?.(p);
              setScreen("post");
            }} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, cursor: "pointer", transition: "all .13s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border3)"; e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>📚 {p.series}</span>
                <Badge variant={p.difficulty}>{p.difficulty}</Badge>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 8, lineHeight: 1.4 }}>{p.title}</h3>
              <p style={{ color: "var(--text2)", fontSize: 12, lineHeight: 1.6, marginBottom: 12 }}>{(p.excerpt || "").slice(0, 100)}…</p>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>~{p.readTime}</span>
                <span style={{ color: "var(--text4)" }}>·</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>{Number(p.views || 0).toLocaleString()} views</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
