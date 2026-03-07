import { Btn } from "../components/ui";
import logoIcon from "../assets/scribe-logo-icon.svg";

export default function LandingScreen({ setScreen }) {
  const features = [
    {
      icon: "🧱",
      title: "22 Technical Blocks",
      desc: "Code, diagrams, callouts, charts, toggles, tabs, tables, media embeds, and structured steps.",
    },
    {
      icon: "⚡",
      title: "Fast Authoring Loop",
      desc: "Write, preview, publish, and trigger webhooks instantly. Move from draft to production in minutes.",
    },
    {
      icon: "🔌",
      title: "API-First Publishing",
      desc: "Fetch posts from any Next.js, Astro, or custom frontend with stable REST endpoints and schemas.",
    },
    {
      icon: "🌐",
      title: "Custom Domain + SSL",
      desc: "Run your publication on your own domain with secure defaults and minimal setup overhead.",
    },
    {
      icon: "📚",
      title: "Series & Curriculum",
      desc: "Create chaptered learning tracks with progression, difficulty labels, and linked navigation.",
    },
    {
      icon: "🔄",
      title: "Webhook Automation",
      desc: "Trigger deploys, cache purge, notifications, and downstream workflows on content lifecycle events.",
    },
  ];

  const heroStats = [
    { label: "Technical creators", value: "2,400+" },
    { label: "Posts shipped", value: "18,000+" },
    { label: "Monthly reads", value: "4.2M" },
  ];

  const proofCards = [
    {
      title: "Built for engineering content",
      desc: "Blocks are opinionated for technical writing, not generic blogging.",
      badge: "Editor DNA",
      color: "var(--accent)",
    },
    {
      title: "Distribution without rewrite",
      desc: "Single source of truth for dashboard, API, and public blog views.",
      badge: "API + UI",
      color: "var(--green)",
    },
    {
      title: "Growth instrumentation",
      desc: "Track performance and content outcomes with built-in analytics surfaces.",
      badge: "Insights",
      color: "var(--orange)",
    },
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      color: "var(--border2)",
      features: [
        "1 workspace",
        "5 published posts",
        "scribe.dev subdomain",
        "REST API access",
        "3 API keys",
      ],
    },
    {
      name: "Pro",
      price: "$12",
      color: "var(--accent)",
      popular: true,
      features: [
        "Unlimited posts",
        "Custom domain",
        "Unlimited webhooks",
        "Analytics dashboard",
        "Remove Scribe branding",
        "20 API keys",
        "Priority support",
      ],
    },
    {
      name: "Team",
      price: "$39",
      color: "var(--orange)",
      features: [
        "Everything in Pro",
        "5 team members",
        "Shared workspace",
        "GitHub login",
        "Dedicated API rate limits",
        "SLA guarantee",
      ],
    },
  ];

  const handleNavClick = (item) => {
    if (item === "Docs") {
      setScreen("apidocs");
      return;
    }
    if (item === "Blog") {
      setScreen("blog");
      return;
    }

    const sectionId = item === "Features" ? "landing-features" : "landing-pricing";
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <nav className="landing-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logoIcon} alt="Scribe" style={{ width: 28, height: 28, borderRadius: 7, display: "block" }} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--text)", letterSpacing: "-0.5px" }}>
            SCRIBE
          </span>
        </div>

        <div className="landing-nav-links">
          {["Features", "Pricing", "Docs", "Blog"].map((item) => (
            <button
              key={item}
              style={{ background: "none", color: "var(--text2)", fontSize: 13, fontFamily: "var(--font-body)", padding: "4px 0", border: "none" }}
              onClick={() => handleNavClick(item)}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text2)";
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="landing-nav-actions">
          <Btn variant="ghost" size="sm" onClick={() => setScreen("login")}>Log in</Btn>
          <Btn variant="primary" size="sm" onClick={() => setScreen("signup")}>Start free →</Btn>
        </div>
      </nav>

      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: 66,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--hero-gradient)",
            backgroundSize: "400% 400%",
            animation: "gradientShift 15s ease infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "12%",
            right: "6%",
            width: 430,
            height: 430,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(0,204,248,.14) 0%,transparent 72%)",
            animation: "orb 14s ease infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "4%",
            left: "4%",
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(0,229,160,.09) 0%,transparent 70%)",
            animation: "orb 20s ease infinite reverse",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "linear-gradient(to right,var(--hero-gridline) 1px,transparent 1px),linear-gradient(to bottom,var(--hero-gridline) 1px,transparent 1px)",
            backgroundSize: "44px 44px",
            pointerEvents: "none",
          }}
        />

        <div className="landing-main" style={{ position: "relative", zIndex: 2 }}>
          <div className="hero-grid">
            <div className="fadeIn">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(0,204,248,.1)",
                  border: "1px solid rgba(0,204,248,.24)",
                  borderRadius: 20,
                  padding: "5px 12px",
                  marginBottom: 22,
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", animation: "pulse 2s infinite" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)" }}>
                  v1.0 · Built for technical creators
                </span>
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(36px,7vw,58px)",
                  lineHeight: 1.06,
                  letterSpacing: "-1.8px",
                  color: "var(--text)",
                  marginBottom: 18,
                }}
              >
                The publishing OS
                <br />
                for <span style={{ background: "linear-gradient(90deg,var(--accent),var(--green))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>engineering minds</span>
              </h1>

              <p style={{ fontSize: 18, color: "var(--text2)", lineHeight: 1.7, marginBottom: 26, maxWidth: 560 }}>
                Scribe helps you ship technical content faster with a developer-native editor, structured series, webhooks,
                and API-first distribution. Write once, publish everywhere, measure what converts.
              </p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                <Btn variant="primary" size="lg" onClick={() => setScreen("signup")}>Start writing free →</Btn>
                <Btn variant="ghost" size="lg" onClick={() => setScreen("login")}>Open live workspace</Btn>
              </div>
              <p style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>
                No credit card · Free plan forever · Deploy-ready API
              </p>

              <div className="landing-stat-grid">
                {heroStats.map((item) => (
                  <div key={item.label} className="landing-stat">
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--text)", lineHeight: 1.1 }}>
                      {item.value}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", marginTop: 3 }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-scene">
              <div className="hero-mesh" />

              <div className="hero-editor">
                <div className="hero-stripe" />
                <div
                  style={{
                    background: "var(--bg3)",
                    borderBottom: "1px solid var(--border)",
                    padding: "10px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {["#ff6b6b", "#ffaa44", "#00e5a0"].map((color) => (
                    <div key={color} style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                  ))}
                  <span style={{ marginLeft: 12, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>
                    architecture-decision-record.md
                  </span>
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", animation: "pulse 2s infinite" }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--green)" }}>autosaved</span>
                  </div>
                </div>
                <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.6px" }}>
                    ADR: Move to Event-Driven Invalidation
                  </div>
                  <div
                    style={{
                      background: "rgba(0,204,248,.06)",
                      border: "1px solid rgba(0,204,248,.24)",
                      borderRadius: 10,
                      padding: "9px 12px",
                      display: "flex",
                      gap: 9,
                      color: "var(--text2)",
                      fontSize: 13,
                      lineHeight: 1.65,
                    }}
                  >
                    <span>💡</span>
                    <span>Publishing triggers webhook fanout to Vercel + CDN purge + Slack digest in under 300ms.</span>
                  </div>
                  <div style={{ background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ background: "var(--bg4)", borderBottom: "1px solid var(--border2)", padding: "6px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent)", background: "rgba(0,204,248,.1)", padding: "2px 7px", borderRadius: 4 }}>
                        typescript
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)" }}>
                        triggerInvalidate.ts
                      </span>
                    </div>
                    <pre style={{ padding: "11px 12px", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.62, color: "var(--text2)", overflow: "hidden" }}>
{`await fetch('/api/webhooks/publish', {
  method: 'POST',
  body: JSON.stringify({ event: 'post.published' })
});`}
                    </pre>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["Event-driven", "Webhooks", "ISR", "Analytics"].map((tag) => (
                      <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", background: "var(--bg4)", border: "1px solid var(--border2)", padding: "2px 8px", borderRadius: 5 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hero-float-card hero-float-card--top" style={{ top: 18, right: -18, animationDelay: ".2s" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", marginBottom: 5 }}>
                  WEBHOOK DELIVERY
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ color: "var(--green)", fontSize: 16 }}>●</span>
                  <span style={{ color: "var(--text)", fontSize: 13, fontWeight: 600 }}>post.published · 200 OK</span>
                </div>
                <div style={{ color: "var(--text3)", fontSize: 11, marginTop: 4, fontFamily: "var(--font-mono)" }}>
                  latency: 148ms
                </div>
              </div>

              <div className="hero-float-card hero-float-card--left" style={{ top: 200, left: -22, animationDelay: ".7s" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", marginBottom: 5 }}>
                  GROWTH SNAPSHOT
                </div>
                <div style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontWeight: 800, fontSize: 23, lineHeight: 1 }}>
                  +38%
                </div>
                <div style={{ color: "var(--text2)", fontSize: 12, marginTop: 4 }}>
                  subscriber growth in 30 days
                </div>
              </div>

              <div className="hero-float-card hero-float-card--bottom" style={{ bottom: 24, right: 16, animationDelay: "1.1s" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", marginBottom: 5 }}>
                  API CALL
                </div>
                <code style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)" }}>
                  GET /v1/posts → 24 items
                </code>
              </div>
            </div>
          </div>

          <div className="hero-card-grid">
            {proofCards.map((card) => (
              <div key={card.title} className="hero-card">
                <span style={{ display: "inline-flex", fontFamily: "var(--font-mono)", fontSize: 10, color: card.color, border: `1px solid ${card.color}50`, background: `${card.color}12`, padding: "2px 8px", borderRadius: 6, marginBottom: 10 }}>
                  {card.badge}
                </span>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19, letterSpacing: "-0.4px", color: "var(--text)", marginBottom: 6 }}>
                  {card.title}
                </h3>
                <p style={{ color: "var(--text2)", fontSize: 13, lineHeight: 1.7 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="landing-features" style={{ padding: "86px 0 74px", scrollMarginTop: 86 }}>
        <div className="landing-main">
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,5vw,40px)", color: "var(--text)", letterSpacing: "-1px", marginBottom: 12 }}>
              Why technical creators choose Scribe
            </h2>
            <p style={{ color: "var(--text2)", fontSize: 16 }}>
              Everything needed to write, publish, distribute, and optimize engineering content.
            </p>
          </div>

          <div className="landing-feature-grid">
            {features.map((feature, i) => (
              <div
                key={i}
                style={{
                  background: "var(--hero-card-gradient)",
                  border: "1px solid var(--border2)",
                  borderRadius: 14,
                  padding: 24,
                  transition: "all .18s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--border3)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "var(--hero-shadow-rest)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border2)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span style={{ fontSize: 30, display: "block", marginBottom: 14 }}>{feature.icon}</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text)", marginBottom: 8 }}>
                  {feature.title}
                </h3>
                <p style={{ color: "var(--text2)", fontSize: 13, lineHeight: 1.75 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "64px 0", background: "var(--bg2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="landing-main" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.18fr)", gap: 56, alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px,5vw,36px)", color: "var(--text)", letterSpacing: "-1px", marginBottom: 14 }}>
              API distribution from day one
            </h2>
            <p style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.75, marginBottom: 24 }}>
              Consume Scribe posts from any frontend stack. Stable JSON contracts, auth headers, and webhook-driven sync.
            </p>
            <Btn variant="outline" onClick={() => setScreen("apidocs")}>View API docs →</Btn>
          </div>
          <div style={{ background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ background: "var(--bg4)", borderBottom: "1px solid var(--border2)", padding: "9px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              {["#ff6b6b", "#ffaa44", "#00e5a0"].map((c) => <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />)}
              <span style={{ marginLeft: 8, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>fetch-content.ts</span>
            </div>
            <pre style={{ padding: "20px", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.8, color: "var(--text2)", overflowX: "auto" }}>{`const res = await fetch(
  'https://api.scribe.dev/v1/posts',
  { headers: { 'x-api-key': process.env.SCRIBE_KEY } }
);

const { data } = await res.json();
return data.filter(post => post.status === 'published');`}</pre>
          </div>
        </div>
      </section>

      <section id="landing-pricing" style={{ padding: "84px 0 76px", background: "var(--bg)", scrollMarginTop: 86 }}>
        <div className="landing-main">
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(30px,5vw,38px)", color: "var(--text)", letterSpacing: "-1px", textAlign: "center", marginBottom: 12 }}>
            Transparent pricing for growth
          </h2>
          <p style={{ textAlign: "center", color: "var(--text2)", marginBottom: 50, fontSize: 15 }}>
            Start free. Upgrade when distribution and analytics matter.
          </p>

          <div style={{ maxWidth: 1040, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.1fr 1fr", gap: 20 }}>
            {plans.map((plan, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg3)",
                  border: `1px solid ${plan.color}`,
                  borderRadius: 16,
                  padding: 28,
                  position: "relative",
                  transition: "transform .13s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {plan.popular && (
                  <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--accent)", color: "#000", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, padding: "3px 12px", borderRadius: 10 }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: plan.color, marginBottom: 8 }}>{plan.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 36, color: "var(--text)" }}>{plan.price}</span>
                  <span style={{ color: "var(--text3)", fontSize: 13 }}>/month</span>
                </div>
                <ul style={{ listStyle: "none", marginBottom: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                  {plan.features.map((feature, j) => (
                    <li key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "var(--text2)" }}>
                      <span style={{ color: "var(--green)", fontSize: 12, marginTop: 2 }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Btn variant={plan.popular ? "primary" : plan.name === "Team" ? "outline" : "ghost"} style={{ width: "100%", justifyContent: "center" }} onClick={() => setScreen("signup")}>
                  {plan.name === "Free" ? "Start free →" : "Get started →"}
                </Btn>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ padding: "38px 0", borderTop: "1px solid var(--border)" }}>
        <div className="landing-main" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={logoIcon} alt="Scribe" style={{ width: 24, height: 24, borderRadius: 6, display: "block" }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text)" }}>SCRIBE</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Product", "Docs", "Pricing", "Blog", "GitHub"].map((link) => (
              <button key={link} style={{ background: "none", color: "var(--text3)", fontSize: 12, fontFamily: "var(--font-body)", border: "none" }} onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text2)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text3)"; }}>
                {link}
              </button>
            ))}
          </div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>© 2026 Scribe · Built by Abhishek Panda · MIT License</p>
        </div>
      </footer>
    </div>
  );
}
