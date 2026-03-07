import { Avatar, Badge, Btn } from "../components/ui";
import logoIcon from "../assets/scribe-logo-icon.svg";

const WRITERS = [
  {
    id: "w1",
    name: "Priya Raman",
    role: "Staff Platform Engineer",
    focus: "Kubernetes, Reliability, Distributed Systems",
    blurb: "Publishes battle-tested architecture content with clear trade-offs and production metrics.",
  },
  {
    id: "w2",
    name: "Daniel Cho",
    role: "Principal Software Architect",
    focus: "Design Patterns, Domain Modeling, Refactoring",
    blurb: "Turns complex design decisions into practical implementation guides for engineering teams.",
  },
  {
    id: "w3",
    name: "Aarav Menon",
    role: "Senior .NET Engineer",
    focus: ".NET Core, APIs, Performance",
    blurb: "Writes practical .NET and API scaling tutorials grounded in real production workloads.",
  },
  {
    id: "w4",
    name: "Sophia Nguyen",
    role: "Java Platform Lead",
    focus: "Java, Spring Boot, Microservices",
    blurb: "Shares migration and scalability playbooks for Spring Boot services in enterprise environments.",
  },
  {
    id: "w5",
    name: "Elena Torres",
    role: "MLOps Architect",
    focus: "ML Pipelines, Feature Stores, Model Serving",
    blurb: "Covers end-to-end MLOps systems from data contracts to reliable model delivery.",
  },
  {
    id: "w6",
    name: "Marcus Reed",
    role: "AI Systems Engineer",
    focus: "LLMs, AI Agents, Agentic Workflows",
    blurb: "Explains modern GenAI architecture, safety patterns, and agentic orchestration in production.",
  },
];

const DEMO_POSTS = [
  {
    id: "m1",
    title: "Scaling ASP.NET Core APIs Beyond 100k RPS",
    slug: "scaling-aspnet-core-apis-100k-rps",
    series: ".NET Performance Lab",
    chapter: 6,
    status: "published",
    difficulty: "advanced",
    readTime: "12 min",
    views: 21430,
    excerpt:
      "A production reference for threading, pooling, caching, and async throughput tuning in modern ASP.NET Core services.",
    tags: ["dotnet", "aspnet-core", "performance", "redis"],
    author: WRITERS[2],
    content: [
      { id: "m1-h1", type: "h1", content: "Scaling ASP.NET Core APIs Beyond 100k RPS" },
      { id: "m1-lead", type: "lead", content: "Practical throughput optimization strategies for high-traffic .NET services." },
      { id: "m1-img", type: "image", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80", caption: "API architecture and cache topology" },
      { id: "m1-c1", type: "callout-insight", content: "Start with p95 latency and saturation telemetry before optimizing code paths." },
      { id: "m1-code", type: "code", content: "builder.Services.AddStackExchangeRedisCache(o => o.Configuration = redisConn);\napp.MapGet('/health/live', () => Results.Ok(new { ok = true }));" },
      { id: "m1-yt", type: "youtube", url: "https://youtu.be/6Yf-eDsRrnM" },
    ],
  },
  {
    id: "m2",
    title: "Design Patterns That Survive Distributed Systems",
    slug: "design-patterns-distributed-systems",
    series: "Architecture Playbooks",
    chapter: 2,
    status: "published",
    difficulty: "architect",
    readTime: "10 min",
    views: 18870,
    excerpt:
      "Applying Strategy, Circuit Breaker, Saga, and Outbox patterns with explicit operational constraints and failure modes.",
    tags: ["design-patterns", "saga", "outbox", "architecture"],
    author: WRITERS[1],
    content: [
      { id: "m2-h1", type: "h1", content: "Design Patterns for Real Distributed Systems" },
      { id: "m2-lead", type: "lead", content: "Pattern selection based on failure characteristics, not diagram aesthetics." },
      { id: "m2-steps", type: "steps", items: ["Identify consistency boundaries", "Apply Outbox for atomic events", "Implement retries with jitter", "Instrument all compensations"] },
      { id: "m2-c1", type: "callout-warning", content: "Pattern overuse increases coupling; optimize for observability and rollback clarity." },
      { id: "m2-table", type: "table", headers: ["Pattern", "Use Case", "Risk"], rows: [["Saga", "Cross-service transaction", "Compensation complexity"], ["Circuit Breaker", "Dependency instability", "False-open tuning"], ["Outbox", "Event reliability", "Backfill lag"]] },
    ],
  },
  {
    id: "m3",
    title: "Spring Boot Modular Monolith: A Practical Migration Strategy",
    slug: "spring-boot-modular-monolith-migration",
    series: "Java Platform",
    chapter: 4,
    status: "published",
    difficulty: "intermediate",
    readTime: "9 min",
    views: 16240,
    excerpt:
      "How teams reduce microservice sprawl by moving to bounded modules with explicit interfaces in Spring Boot.",
    tags: ["java", "spring-boot", "modular-monolith"],
    author: WRITERS[3],
    content: [
      { id: "m3-h1", type: "h1", content: "Spring Boot Modular Monolith Migration" },
      { id: "m3-lead", type: "lead", content: "A low-risk pathway from fragmented microservices to cohesive module boundaries." },
      { id: "m3-img", type: "image", url: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80", caption: "Service decomposition and module boundary mapping" },
      { id: "m3-code", type: "code", content: "@Configuration\nclass BillingModuleConfig {\n  @Bean BillingFacade billingFacade(...) { return new BillingFacade(...); }\n}" },
      { id: "m3-c1", type: "callout-success", content: "Pilot one bounded context first. Measure deploy frequency and MTTR before full rollout." },
    ],
  },
  {
    id: "m4",
    title: "Building Reliable MLOps Pipelines on Kubernetes",
    slug: "reliable-mlops-pipelines-kubernetes",
    series: "MLOps Systems",
    chapter: 5,
    status: "published",
    difficulty: "advanced",
    readTime: "13 min",
    views: 14770,
    excerpt:
      "From feature pipelines to model registry and canary rollout: a practical reliability architecture for ML platforms.",
    tags: ["mlops", "kubeflow", "feature-store", "kubernetes"],
    author: WRITERS[4],
    content: [
      { id: "m4-h1", type: "h1", content: "Reliable MLOps Pipelines on Kubernetes" },
      { id: "m4-lead", type: "lead", content: "Designing reproducible ML delivery with lineage, quality gates, and safe rollout control." },
      { id: "m4-numbered", type: "numbered", items: ["Validate feature contracts", "Register model + lineage", "Run drift checks", "Canary deploy with rollback policy"] },
      { id: "m4-c1", type: "callout-info", content: "Treat model-serving endpoints as product APIs with SLOs and version guarantees." },
      { id: "m4-yt", type: "youtube", url: "https://youtu.be/0U0wQ4P6QYw" },
    ],
  },
  {
    id: "m5",
    title: "What Is an LLM? Architecture, Tokens, and Context Windows",
    slug: "what-is-llm-architecture-tokens-context",
    series: "AI Foundations",
    chapter: 1,
    status: "published",
    difficulty: "intermediate",
    readTime: "8 min",
    views: 23820,
    excerpt:
      "A concise engineering explanation of transformers, tokenization, inference cost, and context limitations.",
    tags: ["llm", "transformers", "tokens", "ai"],
    author: WRITERS[5],
    content: [
      { id: "m5-h1", type: "h1", content: "What Is an LLM?" },
      { id: "m5-lead", type: "lead", content: "Large Language Models are sequence prediction systems trained on massive token corpora." },
      { id: "m5-h2", type: "h2", content: "Core Components" },
      { id: "m5-bul", type: "bullet", items: ["Tokenizer", "Transformer layers", "Attention mechanism", "Inference runtime"] },
      { id: "m5-c1", type: "callout-insight", content: "Most production failures are context management failures, not model failures." },
      { id: "m5-img", type: "image", url: "https://images.unsplash.com/photo-1677442135968-6f8e379c3c13?auto=format&fit=crop&w=1200&q=80", caption: "Transformer model topology concept" },
    ],
  },
  {
    id: "m6",
    title: "AI Agents and Agentic AI: System Design in Production",
    slug: "ai-agents-agentic-ai-system-design",
    series: "AI Systems",
    chapter: 3,
    status: "published",
    difficulty: "architect",
    readTime: "11 min",
    views: 20710,
    excerpt:
      "How to design multi-step agent workflows with tools, memory boundaries, guardrails, and human approval loops.",
    tags: ["ai-agents", "agentic-ai", "tool-calling", "llm"],
    author: WRITERS[5],
    content: [
      { id: "m6-h1", type: "h1", content: "AI Agents and Agentic AI in Production" },
      { id: "m6-lead", type: "lead", content: "Agentic systems combine planning, tool execution, and feedback loops under governance constraints." },
      { id: "m6-tabs", type: "tabs", tabs: [{ label: "Planner", content: "Break objective into deterministic tasks and confidence thresholds." }, { label: "Executor", content: "Invoke tools with strict schema validation and retries." }, { label: "Critic", content: "Score output quality and trigger refinement or escalation." }], active: 0 },
      { id: "m6-c1", type: "callout-danger", content: "Never allow unrestricted tool execution. Add policy checks before every external side-effect." },
      { id: "m6-code", type: "code", content: "if (policyEngine.denies(action)) {\n  return escalateToHuman(action, context);\n}" },
    ],
  },
  {
    id: "m7",
    title: "OpenTelemetry for End-to-End Platform Observability",
    slug: "opentelemetry-end-to-end-observability",
    series: "Observability",
    chapter: 5,
    status: "published",
    difficulty: "advanced",
    readTime: "10 min",
    views: 11980,
    excerpt:
      "Implement traces, metrics, and logs across API, queue, and worker boundaries with actionable correlation IDs.",
    tags: ["opentelemetry", "observability", "tracing"],
    author: WRITERS[0],
    content: [
      { id: "m7-h1", type: "h1", content: "OpenTelemetry Across API and Workers" },
      { id: "m7-lead", type: "lead", content: "Unified telemetry should explain causality, not just activity." },
      { id: "m7-code", type: "code", content: "services.AddOpenTelemetry().WithTracing(b => b.AddAspNetCoreInstrumentation());" },
      { id: "m7-toggle", type: "toggle", title: "What to alert on", content: "Alert on user-impacting latency and error-budget burn, not raw CPU spikes." },
    ],
  },
  {
    id: "m8",
    title: "Clean Architecture in .NET Core Without Over-Engineering",
    slug: "clean-architecture-dotnet-core-practical",
    series: ".NET Engineering",
    chapter: 8,
    status: "published",
    difficulty: "intermediate",
    readTime: "9 min",
    views: 13660,
    excerpt:
      "A pragmatic approach to boundaries, application services, and test seams in ASP.NET Core systems.",
    tags: ["clean-architecture", "dotnet", "ddd"],
    author: WRITERS[2],
    content: [
      { id: "m8-h1", type: "h1", content: "Pragmatic Clean Architecture in .NET" },
      { id: "m8-lead", type: "lead", content: "Use architecture to reduce coupling and improve testability, not to maximize abstraction count." },
      { id: "m8-columns", type: "columns", left: "Application layer: orchestration, policies, use cases.", right: "Infrastructure layer: IO, persistence, messaging adapters." },
      { id: "m8-c1", type: "callout-warning", content: "Avoid repository interfaces for trivial CRUD-only modules." },
    ],
  },
  {
    id: "m9",
    title: "Kafka Event Contracts That Keep Teams Aligned",
    slug: "kafka-event-contracts-team-alignment",
    series: "Data and Events",
    chapter: 4,
    status: "published",
    difficulty: "advanced",
    readTime: "10 min",
    views: 10940,
    excerpt:
      "Schema governance patterns that prevent producer/consumer drift and reduce integration incidents.",
    tags: ["kafka", "schema-registry", "event-driven"],
    author: WRITERS[1],
    content: [
      { id: "m9-h1", type: "h1", content: "Kafka Event Contracts for Reliability" },
      { id: "m9-lead", type: "lead", content: "Contract discipline is the difference between scalable autonomy and cross-team breakage." },
      { id: "m9-table", type: "table", headers: ["Version", "Change", "Compatibility"], rows: [["v1", "Add optional field", "Backward compatible"], ["v2", "Rename required field", "Breaking"], ["v3", "Add enum value", "Check consumers"]] },
      { id: "m9-c1", type: "callout-success", content: "Require consumer contract tests in CI for every event schema change." },
    ],
  },
  {
    id: "m10",
    title: "RAG Systems: Vector Databases, Retrieval Quality, and Cost Control",
    slug: "rag-systems-vector-db-retrieval-cost",
    series: "Applied GenAI",
    chapter: 6,
    status: "published",
    difficulty: "architect",
    readTime: "12 min",
    views: 17630,
    excerpt:
      "A practical guide for chunking, embeddings, reranking, grounding quality metrics, and inference spend governance.",
    tags: ["rag", "vector-db", "genai", "retrieval"],
    author: WRITERS[5],
    content: [
      { id: "m10-h1", type: "h1", content: "RAG Systems in Production" },
      { id: "m10-lead", type: "lead", content: "Retrieval quality and citation grounding matter more than model size in many enterprise workloads." },
      { id: "m10-numbered", type: "numbered", items: ["Tune chunking for semantic coherence", "Use hybrid retrieval + reranking", "Track answer faithfulness metrics", "Add cost budgets and guardrails"] },
      { id: "m10-img", type: "image", url: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&w=1200&q=80", caption: "RAG pipeline: retrieval, reranking, grounded generation" },
      { id: "m10-yt", type: "youtube", url: "https://youtu.be/T-D1OfcDW1M" },
    ],
  },
];

export default function BlogScreen({ setScreen, posts = [], user, setEditPost }) {
  const profile = user || {
    name: "Scribe Community",
    bio: "Engineering writers publishing deep technical content.",
  };

  const published = [...posts]
    .filter((post) => post.status === "published")
    .sort((a, b) => new Date(b.publishedAt || b.updatedAt || 0) - new Date(a.publishedAt || a.updatedAt || 0));

  const isMarketingMode = published.length === 0;
  const feedPosts = isMarketingMode ? DEMO_POSTS : published;
  const featured = feedPosts[0] || null;
  const rest = feedPosts.slice(1);

  const openPost = (post) => {
    if (!post) return;
    setEditPost?.(post);
    setScreen("post", { slug: post.slug });
  };

  const handleNavClick = (item) => {
    if (item === "Docs") {
      setScreen("apidocs");
      return;
    }
    if (item === "Community") {
      setScreen("blog");
      return;
    }
    if (item === "Features" || item === "Pricing") {
      setScreen("landing");
    }
  };

  const handleJoinCommunity = () => {
    window.open("https://t.me/scribecommunity", "_blank", "noopener,noreferrer");
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <nav className="landing-nav">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={logoIcon} alt="Scribe" style={{ width: 28, height: 28, borderRadius: 7, display: "block" }} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, color: "var(--text)", letterSpacing: "-0.5px" }}>
            SCRIBE
          </span>
        </div>

        <div className="landing-nav-links">
          {["Features", "Pricing", "Docs", "Community"].map((item) => (
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
          <Btn variant="outline" size="sm" onClick={() => setScreen("signup")}>Become a writer</Btn>
          <Btn variant="ghost" size="sm" onClick={() => setScreen("login")}>Log in</Btn>
          <Btn variant="primary" size="sm" onClick={handleJoinCommunity}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="11" fill="#229ED9" />
                <path d="M18.6 6.8 5.7 11.7c-.9.3-.9 1.5 0 1.8l3.3 1.1 1.2 3.9c.2.8 1.2 1.1 1.8.5l2-2 3.5 2.6c.6.4 1.5.1 1.7-.7l2.4-11.2c.2-.8-.6-1.5-1.4-1.2zM10 14.3l6.3-5.5-4.9 6.6-.3 2.2-1.1-3.3z" fill="#fff" />
              </svg>
              Join Community
            </span>
          </Btn>
        </div>
      </nav>

      <section style={{ padding: "68px 48px 34px", maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", marginBottom: 8 }}>
          <Avatar name={profile.name} size="lg" />
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 38, color: "var(--text)", letterSpacing: "-1px", marginBottom: 8 }}>
              Scribe Community Network
            </h1>
            <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.7, maxWidth: 700, marginBottom: 16 }}>
              Public publishing showcase: technical writers ship API-first articles, series, and editorial content with structured blocks, code walkthroughs, guidance callouts, and media-rich storytelling.
            </p>
            <button
              onClick={handleJoinCommunity}
              style={{
                border: "1px solid #229ED955",
                background: "#229ED918",
                color: "var(--text)",
                borderRadius: 999,
                padding: "7px 12px",
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
                cursor: "pointer",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="11" fill="#229ED9" />
                <path d="M18.6 6.8 5.7 11.7c-.9.3-.9 1.5 0 1.8l3.3 1.1 1.2 3.9c.2.8 1.2 1.1 1.8.5l2-2 3.5 2.6c.6.4 1.5.1 1.7-.7l2.4-11.2c.2-.8-.6-1.5-1.4-1.2zM10 14.3l6.3-5.5-4.9 6.6-.3 2.2-1.1-3.3z" fill="#fff" />
              </svg>
              Professional Writers Community of Scribe
            </button>
            <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
              {[[feedPosts.length, "public posts"], ["42k+", "monthly readers"], [WRITERS.length, "active writers"]].map(([n, l]) => (
                <div key={l}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text)" }}>{n}</span>{" "}
                  <span style={{ color: "var(--text3)", fontSize: 13 }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 48px 34px", maxWidth: 1120, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 21, color: "var(--text)", letterSpacing: "-0.5px", marginBottom: 14 }}>
          Community Spotlight
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {WRITERS.map((writer) => (
            <div key={writer.id} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Avatar name={writer.name} size="sm" />
                <div>
                  <div style={{ color: "var(--text)", fontWeight: 600, fontSize: 13 }}>{writer.name}</div>
                  <div style={{ color: "var(--text3)", fontSize: 11, fontFamily: "var(--font-mono)" }}>{writer.role}</div>
                </div>
              </div>
              <div style={{ color: "var(--accent)", fontSize: 11, fontFamily: "var(--font-mono)", marginBottom: 6 }}>{writer.focus}</div>
              <p style={{ color: "var(--text2)", fontSize: 12, lineHeight: 1.6 }}>{writer.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "0 48px 48px", maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 21, color: "var(--text)", letterSpacing: "-0.5px" }}>
            {isMarketingMode ? "Public Writing Showcase" : "Recent Publications"}
          </h2>
          <span style={{ color: "var(--text3)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
            {isMarketingMode ? "demo mode" : "live mode"}
          </span>
        </div>

        {featured && (
          <div
            onClick={() => openPost(featured)}
            style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 16, padding: 28, marginBottom: 18, cursor: "pointer", transition: "all .13s" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border3)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              <Badge variant="published">Featured</Badge>
              <span style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>Series: {featured.series} · Ch.{featured.chapter || 1}</span>
              <Badge variant={featured.difficulty}>{featured.difficulty}</Badge>
              <span style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>~{featured.readTime}</span>
              {featured.author?.name && (
                <span style={{ fontSize: 12, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>by {featured.author.name}</span>
              )}
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--text)", letterSpacing: "-0.5px", marginBottom: 10 }}>
              {featured.title}
            </h3>
            <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>{featured.excerpt}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {(featured.tags || []).map((tag) => (
                <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)", background: "var(--bg3)", border: "1px solid var(--border)", padding: "2px 7px", borderRadius: 4 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {rest.map((post) => (
            <div
              key={post.id}
              onClick={() => openPost(post)}
              style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, cursor: "pointer", transition: "all .13s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border3)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>Series: {post.series}</span>
                <Badge variant={post.difficulty}>{post.difficulty}</Badge>
                {post.author?.name && (
                  <span style={{ fontSize: 11, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>by {post.author.name}</span>
                )}
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 8, lineHeight: 1.4 }}>
                {post.title}
              </h3>
              <p style={{ color: "var(--text2)", fontSize: 12, lineHeight: 1.65, marginBottom: 12 }}>{(post.excerpt || "").slice(0, 140)}...</p>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>~{post.readTime}</span>
                <span style={{ color: "var(--text4)" }}>·</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)" }}>
                  {Number(post.views || 0).toLocaleString()} views
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
