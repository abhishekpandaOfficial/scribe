import { useEffect, useState } from "react";
import { MOCK_POSTS, MOCK_USER } from "../data/mockData";
import { Avatar, Badge, Btn } from "../components/ui";

export default function PostScreen({ post, setScreen, user }) {
  const p = post || MOCK_POSTS[0];
  const profile = user || MOCK_USER;
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setScrollProgress(Math.min(100, (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100 || 0));
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headings = ["Understanding the State Machine", "The Compiler Transformation", "Execution Flow", "Performance Implications", "Conclusion"];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ position: "fixed", top: 0, left: 0, height: 2, background: "var(--accent)", width: `${scrollProgress}%`, zIndex: 1000, transition: "width .1s" }} />
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "var(--nav-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)", padding: "0 48px", display: "flex", alignItems: "center", height: 54, gap: 16 }}>
        <button onClick={() => setScreen("blog")} style={{ background: "none", color: "var(--text2)", fontSize: 13, fontFamily: "var(--font-body)", border: "none", cursor: "pointer" }}>← {profile.name}</button>
        <span style={{ color: "var(--border2)" }}>·</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>📚 {p.series} · Ch.{p.chapter || 1}</span>
        <Btn variant="ghost" size="sm" style={{ marginLeft: "auto" }}>Subscribe</Btn>
      </nav>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 32px", display: "grid", gridTemplateColumns: "220px 1fr 220px", gap: 40 }}>
        <div style={{ position: "sticky", top: 72, height: "fit-content" }}>
          <div style={{ fontSize: 10, color: "var(--text4)", fontFamily: "var(--font-mono)", fontWeight: 600, letterSpacing: "1px", marginBottom: 10 }}>TABLE OF CONTENTS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {headings.map((heading, i) => (
              <button key={i} style={{ textAlign: "left", background: i === 1 ? "rgba(0,204,248,.06)" : "transparent", color: i === 1 ? "var(--accent)" : "var(--text2)", fontSize: 12, fontFamily: "var(--font-body)", padding: "5px 8px", borderLeft: i === 1 ? "2px solid var(--accent)" : "2px solid transparent", border: "none", cursor: "pointer", lineHeight: 1.4 }}>{heading}</button>
            ))}
          </div>
        </div>

        <article style={{ minWidth: 0 }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text3)" }}>📚 {p.series} · Ch.{p.chapter || 1}</span>
              <Badge variant={p.difficulty}>{p.difficulty}</Badge>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>~{p.readTime}</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 34, color: "var(--text)", letterSpacing: "-1px", lineHeight: 1.2, marginBottom: 16 }}>{p.title}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <Avatar name={profile.name} size="sm" />
              <div>
                <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 600 }}>{profile.name}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>{new Date().toLocaleDateString()} · {Number(p.views || 0).toLocaleString()} views</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>{(p.tags || []).map((t) => <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", background: "var(--bg3)", border: "1px solid var(--border)", padding: "2px 7px", borderRadius: 4 }}>{t}</span>)}</div>
          </div>

          <div style={{ fontSize: 15, lineHeight: 1.85, color: "var(--text2)" }}>
            <p style={{ marginBottom: 20, fontSize: 17, fontWeight: 500, color: "var(--text)", lineHeight: 1.7 }}>{p.excerpt || "This post has rich technical content."}</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--text)", letterSpacing: "-0.3px", margin: "28px 0 14px", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>Overview</h2>
            <p style={{ marginBottom: 16 }}>This page renders your published post content in a clean reading layout. Save and publish from the editor to update this view.</p>
          </div>
        </article>

        <div style={{ position: "sticky", top: 72, height: "fit-content", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, textAlign: "center" }}>
            <svg width={72} height={72} viewBox="0 0 72 72">
              <circle cx={36} cy={36} r={28} fill="none" stroke="var(--border2)" strokeWidth={5} />
              <circle cx={36} cy={36} r={28} fill="none" stroke="var(--accent)" strokeWidth={5} strokeLinecap="round" strokeDasharray={2 * Math.PI * 28} strokeDashoffset={2 * Math.PI * 28 * (1 - scrollProgress / 100)} transform="rotate(-90 36 36)" style={{ transition: "stroke-dashoffset .15s" }} />
              <text x={36} y={36} textAnchor="middle" dominantBaseline="central" fill="var(--text)" fontFamily="var(--font-display)" fontWeight={700} fontSize={14}>{Math.round(scrollProgress)}%</text>
            </svg>
            <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)", marginTop: 6 }}>read</div>
          </div>
        </div>
      </div>
    </div>
  );
}
