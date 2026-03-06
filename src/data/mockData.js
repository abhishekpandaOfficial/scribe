export const MOCK_POSTS = [
  {
    id: "1",
    title: "The async/await State Machine",
    series: "C# Mastery",
    chapter: 22,
    status: "published",
    views: 4821,
    updated: "2 days ago",
    tags: ["CLR", "async", "performance"],
    difficulty: "advanced",
    slug: "async-await-state-machine",
    readTime: "7 min",
    excerpt:
      "Deep dive into how the C# compiler transforms async/await into an IAsyncStateMachine struct...",
  },
  {
    id: "2",
    title: "Zero-Allocation Patterns in .NET 9",
    series: "C# Mastery",
    chapter: 21,
    status: "published",
    views: 3204,
    updated: "5 days ago",
    tags: ["performance", ".NET 9", "Span"],
    difficulty: "architect",
    slug: "zero-allocation-patterns",
    readTime: "9 min",
    excerpt:
      "Using Span<T>, Memory<T>, and ref structs to eliminate GC pressure in hot paths...",
  },
  {
    id: "3",
    title: "Microservices with .NET Aspire",
    series: "Cloud Architecture",
    chapter: 1,
    status: "draft",
    views: 0,
    updated: "1 hour ago",
    tags: ["microservices", "Aspire", "Docker"],
    difficulty: "intermediate",
    slug: "microservices-dotnet-aspire",
    readTime: "6 min",
    excerpt:
      "Building distributed systems with the new .NET Aspire orchestration framework...",
  },
  {
    id: "4",
    title: "EF Core Performance Pitfalls",
    series: "C# Mastery",
    chapter: 20,
    status: "review",
    views: 1820,
    updated: "1 week ago",
    tags: ["EF Core", "SQL", "ORM"],
    difficulty: "advanced",
    slug: "ef-core-performance",
    readTime: "8 min",
    excerpt:
      "N+1 queries, cartesian explosion, and how to write efficient LINQ queries...",
  },
  {
    id: "5",
    title: "Kubernetes Networking Deep Dive",
    series: "Cloud Architecture",
    chapter: 3,
    status: "scheduled",
    views: 0,
    updated: "3 days ago",
    tags: ["K8s", "networking", "CNI"],
    difficulty: "architect",
    slug: "kubernetes-networking",
    readTime: "12 min",
    excerpt:
      "Understanding pod-to-pod communication, service meshes, and Ingress controllers...",
  },
  {
    id: "6",
    title: "Building a gRPC Service in C# 13",
    series: "C# Mastery",
    chapter: 19,
    status: "published",
    views: 2190,
    updated: "2 weeks ago",
    tags: ["gRPC", "Protobuf", "streaming"],
    difficulty: "intermediate",
    slug: "grpc-service-csharp",
    readTime: "7 min",
    excerpt:
      "Complete guide to gRPC with bidirectional streaming using the latest C# features...",
  },
];

export const CHART_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: `Mar ${i + 1}`,
  views: Math.floor(800 + Math.random() * 2400 + Math.sin(i * 0.4) * 600),
}));

export const TOP_POSTS_DATA = MOCK_POSTS.filter((post) => post.views > 0).map((post) => ({
  name: `${post.title.split(" ").slice(0, 3).join(" ")}…`,
  views: post.views,
}));

export const TRAFFIC_DATA = [
  { name: "Direct", value: 38 },
  { name: "Google", value: 31 },
  { name: "Twitter", value: 15 },
  { name: "GitHub", value: 10 },
  { name: "Other", value: 6 },
];

export const PIE_COLORS = ["#00ccf8", "#5aabff", "#b08aff", "#00e5a0", "#ffaa44"];

export const MOCK_USER = {
  name: "Abhishek Panda",
  username: "abhishekpanda",
  plan: "Pro",
  email: "abhishek@abhishekpanda.com",
  avatar: "AP",
  bio: "Senior .NET Engineer · Writing about performance, architecture, and real-world C#. 22K readers.",
  website: "https://abhishekpanda.com",
  twitter: "@AbhishekPanda",
  github: "@abhishek-panda",
};

export const TEMPLATES = [
  {
    id: 1,
    name: "Technical Deep Dive",
    category: "Deep Dive",
    blocks: 14,
    desc: "Lead + H2s + code blocks + callouts + tech stack",
    color: "var(--accent)",
  },
  {
    id: 2,
    name: "Tutorial / How-To",
    category: "Tutorial",
    blocks: 11,
    desc: "Steps-based, code examples, warning callouts",
    color: "var(--green)",
  },
  {
    id: 3,
    name: "Series Introduction",
    category: "Series Intro",
    blocks: 9,
    desc: "Hero-style opener, curriculum overview, what you'll learn",
    color: "var(--blue)",
  },
  {
    id: 4,
    name: "Architecture Decision",
    category: "Architecture",
    blocks: 12,
    desc: "ADR format: Context → Decision → Consequences",
    color: "var(--purple)",
  },
  {
    id: 5,
    name: "Performance Analysis",
    category: "Deep Dive",
    blocks: 15,
    desc: "Benchmark chart + code blocks + comparison table",
    color: "var(--orange)",
  },
  {
    id: 6,
    name: "Bug Post-Mortem",
    category: "Retrospective",
    blocks: 10,
    desc: "Timeline steps + danger callouts + root cause",
    color: "var(--red)",
  },
  {
    id: 7,
    name: "Library Comparison",
    category: "Deep Dive",
    blocks: 13,
    desc: "Comparison tables + pros/cons + recommendation",
    color: "var(--yellow)",
  },
  {
    id: 8,
    name: "Weekly Dev Journal",
    category: "Retrospective",
    blocks: 8,
    desc: "What I learned, built, and what's next",
    color: "var(--pink)",
  },
  {
    id: 9,
    name: "Interview Prep Guide",
    category: "Interview Prep",
    blocks: 16,
    desc: "Q&A format with interview question callouts",
    color: "var(--blue)",
  },
  {
    id: 10,
    name: "API Reference",
    category: "Architecture",
    blocks: 12,
    desc: "Endpoint table + code examples per endpoint",
    color: "var(--accent)",
  },
  {
    id: 11,
    name: "Release Notes / Changelog",
    category: "Announcement",
    blocks: 7,
    desc: "Success callouts for features, warning for breaking changes",
    color: "var(--green)",
  },
  {
    id: 12,
    name: "Book / Course Review",
    category: "Tutorial",
    blocks: 9,
    desc: "Rating, chapters, key takeaways, recommendation",
    color: "var(--purple)",
  },
];

export const BLOCK_TYPES = [
  { type: "paragraph", label: "Paragraph", desc: "Plain text block", icon: "¶", cat: "TEXT" },
  { type: "lead", label: "Lead", desc: "Large intro paragraph", icon: "L", cat: "TEXT" },
  { type: "h1", label: "Heading 1", desc: "Large section title", icon: "H1", cat: "TEXT" },
  { type: "h2", label: "Heading 2", desc: "Section heading", icon: "H2", cat: "TEXT" },
  { type: "h3", label: "Heading 3", desc: "Subsection heading", icon: "H3", cat: "TEXT" },
  { type: "bullet", label: "Bullet List", desc: "Unordered list", icon: "•", cat: "TEXT" },
  { type: "numbered", label: "Numbered List", desc: "Ordered list", icon: "1.", cat: "TEXT" },
  { type: "quote", label: "Quote", desc: "Blockquote", icon: "❝", cat: "TEXT" },
  { type: "divider", label: "Divider", desc: "Horizontal rule", icon: "─", cat: "TEXT" },
  { type: "code", label: "Code Block", desc: "Syntax-highlighted code", icon: "</>", cat: "CODE" },
  { type: "math", label: "Math / LaTeX", desc: "Mathematical equations", icon: "∑", cat: "CODE" },
  { type: "callout-insight", label: "Insight", desc: "Cyan info callout", icon: "💡", cat: "CALLOUT" },
  { type: "callout-warning", label: "Warning", desc: "Orange warning callout", icon: "⚠️", cat: "CALLOUT" },
  { type: "callout-danger", label: "Danger", desc: "Red danger callout", icon: "🚨", cat: "CALLOUT" },
  { type: "callout-success", label: "Success", desc: "Green success callout", icon: "✅", cat: "CALLOUT" },
  { type: "callout-info", label: "Info", desc: "Blue info callout", icon: "ℹ️", cat: "CALLOUT" },
  { type: "image", label: "Image", desc: "Image with caption", icon: "🖼", cat: "MEDIA" },
  { type: "youtube", label: "YouTube", desc: "Embedded video", icon: "▶", cat: "MEDIA" },
  { type: "techstack", label: "Tech Stack", desc: "Technology badge row", icon: "⚙", cat: "MEDIA" },
  { type: "mermaid", label: "Mermaid Diagram", desc: "Flowchart, sequence, ER", icon: "◇", cat: "DIAGRAM" },
  { type: "chart", label: "Chart", desc: "Bar, line, or area chart", icon: "📊", cat: "DIAGRAM" },
  { type: "toggle", label: "Toggle", desc: "Collapsible accordion", icon: "▶", cat: "LAYOUT" },
  { type: "steps", label: "Steps", desc: "Numbered step sequence", icon: "①", cat: "LAYOUT" },
  { type: "tabs", label: "Tabs", desc: "Tabbed content panels", icon: "⊟", cat: "LAYOUT" },
  { type: "columns", label: "2 Columns", desc: "Side-by-side layout", icon: "⊞", cat: "LAYOUT" },
  { type: "table", label: "Table", desc: "Editable data table", icon: "▦", cat: "LAYOUT" },
];

export function makeBlock(type) {
  const defaults = {
    paragraph: { content: "" },
    lead: { content: "" },
    h1: { content: "" },
    h2: { content: "" },
    h3: { content: "" },
    bullet: { items: [""] },
    numbered: { items: [""] },
    quote: { content: "" },
    divider: {},
    code: {
      lang: "typescript",
      title: "example.ts",
      content: `// TypeScript Example\nconst greet = (name: string): string => {\n  return \`Hello, \${name}!\`;\n};\nconsole.log(greet("Scribe"));`,
    },
    math: { content: "E = mc²" },
    "callout-insight": { content: "This is an important insight." },
    "callout-warning": { content: "Watch out for this potential issue." },
    "callout-danger": { content: "This approach is dangerous in production." },
    "callout-success": { content: "Great job! This is recommended." },
    "callout-info": { content: "Additional context and information." },
    image: { url: "", caption: "", align: "center" },
    youtube: { url: "", videoId: "" },
    techstack: { items: ["C#", ".NET 9", "PostgreSQL", "Docker", "Redis"] },
    mermaid: {
      code: `graph TD\n  A[Start] --> B{Decision}\n  B -->|Yes| C[Success]\n  B -->|No| D[Retry]\n  D --> B`,
      title: "System Flow",
    },
    chart: {
      chartType: "bar",
      title: "Performance Metrics",
      data: [
        { name: "Q1", value: 420 },
        { name: "Q2", value: 580 },
        { name: "Q3", value: 720 },
        { name: "Q4", value: 890 },
      ],
    },
    toggle: {
      title: "Click to expand",
      content: "Hidden content revealed on click.",
      open: false,
    },
    steps: {
      items: [
        "Install dependencies",
        "Configure environment",
        "Write your first block",
        "Deploy to production",
        "Monitor analytics",
      ],
    },
    tabs: {
      tabs: [
        { label: "Tab 1", content: "Content for the first tab." },
        { label: "Tab 2", content: "Content for the second tab." },
        { label: "Tab 3", content: "Content for the third tab." },
      ],
      active: 0,
    },
    columns: {
      left: "Left column content. Edit me.",
      right: "Right column content. Edit me.",
    },
    table: {
      headers: ["Feature", "Scribe", "Notion", "Hashnode"],
      rows: [
        ["Mermaid Diagrams", "✅", "✅", "❌"],
        ["API-First", "✅", "⚠️", "⚠️"],
        ["Webhooks", "✅", "❌", "⚠️"],
      ],
    },
  };

  return {
    id: Date.now() + Math.random(),
    type,
    ...(defaults[type] || {}),
  };
}
