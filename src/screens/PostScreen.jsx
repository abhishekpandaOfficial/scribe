import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import BlockPreviewRenderer from "../components/editor/BlockPreviewRenderer";
import { Avatar, Badge, Btn } from "../components/ui";
import { postsApi, publicApi } from "../lib/apiClient";

function slugifyHeading(text = "", index = 0) {
  const base = String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${base || "section"}-${index}`;
}

export default function PostScreen({ post, posts = [], token, setScreen, user }) {
  const { slug } = useParams();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [remotePost, setRemotePost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);

  const localPost = useMemo(() => {
    if (post?.slug && slug && post.slug === slug) {
      return post;
    }

    if (!slug) {
      return post || null;
    }

    return posts.find((item) => item.slug === slug) || null;
  }, [post, posts, slug]);

  useEffect(() => {
    if (!slug || localPost) {
      setRemotePost(null);
      return;
    }

    let cancelled = false;
    const load = async () => {
      try {
        setLoadingPost(true);
        if (token) {
          const response = await postsApi.list(token, "all");
          const found = (response?.data || []).find((item) => item.slug === slug) || null;
          if (!cancelled) {
            setRemotePost(found);
          }
          return;
        }

        if (user?.username) {
          const response = await publicApi.post(user.username, slug);
          if (!cancelled) {
            setRemotePost(response?.data || null);
          }
        }
      } catch {
        if (!cancelled) {
          setRemotePost(null);
        }
      } finally {
        if (!cancelled) {
          setLoadingPost(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, localPost, token, user?.username]);

  const resolvedPost = localPost || remotePost;

  const profile = user || {
    name: "Creator",
    username: "creator",
    bio: "Technical writer",
  };

  const contentBlocks = Array.isArray(resolvedPost?.content)
    ? resolvedPost.content.filter((block) => Boolean(block?.type))
    : [];

  const tocItems = useMemo(() => {
    return contentBlocks
      .map((block, index) => ({ block, index }))
      .filter(({ block }) => ["h2", "h3"].includes(block.type) && (block.content || "").trim().length > 0)
      .map(({ block, index }) => ({
        id: slugifyHeading(block.content, index),
        label: block.content,
        level: block.type === "h3" ? 3 : 2,
      }));
  }, [contentBlocks]);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const progress = (el.scrollTop / Math.max(el.scrollHeight - el.clientHeight, 1)) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress || 0)));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!resolvedPost && loadingPost) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ color: "var(--text3)", fontFamily: "var(--font-mono)", fontSize: 12 }}>Loading post…</div>
      </div>
    );
  }

  if (!resolvedPost) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 560, width: "100%", border: "1px solid var(--border)", borderRadius: 14, background: "var(--bg2)", padding: 28, textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text)", marginBottom: 10 }}>Post not found</h2>
          <p style={{ color: "var(--text2)", marginBottom: 18, lineHeight: 1.7 }}>
            This post may not be published yet or the URL is outdated.
          </p>
          <Btn variant="primary" onClick={() => setScreen("blog")}>Back to blog</Btn>
        </div>
      </div>
    );
  }

  const publishedLabel = resolvedPost.publishedAt
    ? new Date(resolvedPost.publishedAt).toLocaleDateString()
    : new Date().toLocaleDateString();

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ position: "fixed", top: 0, left: 0, height: 2, background: "var(--accent)", width: `${scrollProgress}%`, zIndex: 1000, transition: "width .1s" }} />

      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "var(--nav-bg)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)", padding: "0 48px", display: "flex", alignItems: "center", height: 54, gap: 16 }}>
        <button onClick={() => setScreen("blog")} style={{ background: "none", color: "var(--text2)", fontSize: 13, fontFamily: "var(--font-body)", border: "none", cursor: "pointer" }}>← {profile.name}</button>
        <span style={{ color: "var(--border2)" }}>·</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>/{resolvedPost.slug}</span>
        <Btn variant="ghost" size="sm" style={{ marginLeft: "auto" }}>Subscribe</Btn>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 32px", display: "grid", gridTemplateColumns: "220px 1fr 220px", gap: 34 }}>
        <aside style={{ position: "sticky", top: 70, height: "fit-content" }}>
          <div style={{ fontSize: 10, color: "var(--text4)", fontFamily: "var(--font-mono)", letterSpacing: "1px", marginBottom: 10 }}>ON THIS PAGE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {tocItems.length === 0 && (
              <span style={{ color: "var(--text3)", fontSize: 12 }}>No headings yet</span>
            )}
            {tocItems.map((item) => (
              <button
                key={item.id}
                onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                style={{
                  textAlign: "left",
                  background: "transparent",
                  color: "var(--text2)",
                  fontSize: 12,
                  fontFamily: "var(--font-body)",
                  padding: "4px 8px",
                  marginLeft: item.level === 3 ? 12 : 0,
                  borderLeft: "2px solid transparent",
                  border: "none",
                  cursor: "pointer",
                  lineHeight: 1.45,
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <article style={{ minWidth: 0, maxWidth: 760, margin: "0 auto", width: "100%" }}>
          <header style={{ marginBottom: 28, borderBottom: "1px solid var(--border)", paddingBottom: 18 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>📚 {resolvedPost.series || "General"}{resolvedPost.chapter ? ` · Ch.${resolvedPost.chapter}` : ""}</span>
              <Badge variant={resolvedPost.difficulty || "intermediate"}>{resolvedPost.difficulty || "intermediate"}</Badge>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>~{resolvedPost.readTime || "5 min"}</span>
            </div>

            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,5vw,44px)", color: "var(--text)", letterSpacing: "-0.8px", lineHeight: 1.13, marginBottom: 14 }}>
              {resolvedPost.title}
            </h1>

            {(resolvedPost.excerpt || "").trim().length > 0 && (
              <p style={{ color: "var(--text2)", lineHeight: 1.85, fontSize: 18, marginBottom: 16 }}>
                {resolvedPost.excerpt}
              </p>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <Avatar name={profile.name} size="sm" />
              <div>
                <div style={{ color: "var(--text)", fontWeight: 600, fontSize: 13 }}>{profile.name}</div>
                <div style={{ color: "var(--text3)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
                  {publishedLabel} · {Number(resolvedPost.views || 0).toLocaleString()} views
                </div>
              </div>
            </div>

            {!!resolvedPost.tags?.length && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {resolvedPost.tags.map((tag) => (
                  <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", background: "var(--bg3)", border: "1px solid var(--border)", padding: "2px 7px", borderRadius: 4 }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div style={{ color: "var(--text2)", lineHeight: 1.9, fontSize: 16 }}>
            {contentBlocks.length === 0 && (
              <p style={{ color: "var(--text3)", fontStyle: "italic" }}>
                No content blocks found for this post yet.
              </p>
            )}
            {contentBlocks.map((block, index) => {
              const headingId = ["h2", "h3"].includes(block.type) ? slugifyHeading(block.content || "", index) : undefined;
              return (
                <section key={block.id || `${block.type}-${index}`} id={headingId} style={{ scrollMarginTop: 82 }}>
                  <BlockPreviewRenderer block={block} />
                </section>
              );
            })}
          </div>
        </article>

        <aside style={{ position: "sticky", top: 70, height: "fit-content", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, textAlign: "center" }}>
            <svg width={72} height={72} viewBox="0 0 72 72">
              <circle cx={36} cy={36} r={28} fill="none" stroke="var(--border2)" strokeWidth={5} />
              <circle
                cx={36}
                cy={36}
                r={28}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={5}
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 * (1 - scrollProgress / 100)}
                transform="rotate(-90 36 36)"
                style={{ transition: "stroke-dashoffset .15s" }}
              />
              <text x={36} y={36} textAnchor="middle" dominantBaseline="central" fill="var(--text)" fontFamily="var(--font-display)" fontWeight={700} fontSize={14}>{Math.round(scrollProgress)}%</text>
            </svg>
            <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)", marginTop: 6 }}>read</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
