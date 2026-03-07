import { useState } from "react";
import { Badge, Btn } from "../components/ui";
import logoIcon from "../assets/scribe-logo-icon.svg";
export default function ApiDocsScreen() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [codeLang, setCodeLang] = useState("curl");
  const [expanded, setExpanded] = useState({});
  const sections = [
    { key:"getting-started", label:"Getting Started" },
    { key:"local-setup", label:"Local Setup" },
    { key:"webhook-guide", label:"Webhook Guide" },
    { key:"authentication", label:"Authentication" }, { key:"posts", label:"Posts" },
    { key:"series", label:"Series" }, { key:"media", label:"Media" },
    { key:"analytics", label:"Analytics" }, { key:"webhooks", label:"Webhooks" },
    { key:"errors", label:"Error Codes" },
  ];
  const methodColor = { GET:"var(--green)", POST:"var(--blue)", PATCH:"var(--orange)", DELETE:"var(--red)" };
  const allEndpoints = {
    posts:[
      { method:"GET", path:"/v1/posts", desc:"List all published posts", params:[["status","query","string","Filter: published|draft|scheduled"],["limit","query","number","Max results (default 20)"]] },
      { method:"GET", path:"/v1/posts/:slug", desc:"Get a single post by slug", params:[["slug","path","string","The post URL slug (required)"]] },
      { method:"POST", path:"/v1/posts", desc:"Create a new post", params:[["title","body","string","Post title (required)"],["status","body","string","draft|published|scheduled"]] },
      { method:"PATCH", path:"/v1/posts/:slug", desc:"Update an existing post", params:[["slug","path","string","Post slug to update"]] },
      { method:"DELETE", path:"/v1/posts/:slug", desc:"Delete a post (admin required)", params:[["slug","path","string","Post slug to delete"]] },
    ],
    series:[
      { method:"GET", path:"/v1/series", desc:"List all series", params:[["limit","query","number","Max results"]] },
      { method:"POST", path:"/v1/series", desc:"Create a new series", params:[["name","body","string","Series name (required)"]] },
    ],
    media:[
      { method:"POST", path:"/v1/media", desc:"Upload a media file", params:[["file","body","File","Media file (multipart/form-data)"]] },
      { method:"GET", path:"/v1/media", desc:"List all media in workspace", params:[["type","query","string","Filter by type"]] },
    ],
    analytics:[
      { method:"GET", path:"/v1/analytics/posts", desc:"Get post view analytics", params:[["period","query","string","7d|30d|90d"]] },
    ],
    webhooks:[
      { method:"POST", path:"/v1/webhooks/test/:id", desc:"Send a test payload", params:[["id","path","uuid","Webhook ID"]] },
    ],
  };
  const codeExamples = {
    curl:"curl -X GET 'https://api.scribe.dev/v1/posts' \\\n  -H 'x-api-key: sk_live_••••••3f2a'",
    node:"const res = await fetch(\n  'https://api.scribe.dev/v1/posts',\n  { headers: { 'x-api-key': 'sk_live_••••••3f2a' } }\n);\nconst { data } = await res.json();",
    python:"import requests\n\nr = requests.get(\n  'https://api.scribe.dev/v1/posts',\n  headers={'x-api-key': 'sk_live_••••••3f2a'}\n)\nposts = r.json()['data']",
    csharp:"var client = new HttpClient();\nclient.DefaultRequestHeaders.Add(\n  \"x-api-key\", \"sk_live_••••••3f2a\");\n\nvar posts = await client\n  .GetFromJsonAsync<PostsResponse>(\n    \"https://api.scribe.dev/v1/posts\"\n  );",
  };
  return (
    <div style={{ flex:1, display:"flex", overflow:"hidden", background:"var(--bg)" }}>
      <div style={{ width:220, background:"var(--bg2)", borderRight:"1px solid var(--border)", padding:"20px 12px", flexShrink:0, overflowY:"auto" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20, padding:"0 8px" }}>
          <img src={logoIcon} alt="Scribe" style={{ width: 22, height: 22, borderRadius: 5, display: "block" }} />
          <span style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:14, color:"var(--text)" }}>API Reference</span>
        </div>
        <div style={{ fontSize:9, color:"var(--text4)", fontFamily:"var(--font-mono)", letterSpacing:"1px", marginBottom:10, padding:"0 8px" }}>v1 · REST · JSON</div>
        {sections.map(s=>(<button key={s.key} onClick={()=>setActiveSection(s.key)} style={{ display:"block", width:"100%", padding:"8px 10px", borderRadius:7, background:activeSection===s.key?"var(--bg5)":"transparent", color:activeSection===s.key?"var(--text)":"var(--text2)", fontSize:13, fontFamily:"var(--font-body)", textAlign:"left", border:activeSection===s.key?"1px solid var(--border3)":"1px solid transparent", marginBottom:2, transition:"all .13s" }}>{s.label}</button>))}
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"32px 36px" }}>
        {activeSection==="getting-started" && (
          <div style={{ maxWidth:760 }}>
            <h1 style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:28, color:"var(--text)", marginBottom:8, letterSpacing:"-0.5px" }}>Getting Started</h1>
            <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.7, marginBottom:20 }}>
              Scribe has two modes: <strong style={{ color:"var(--text)" }}>API Cloud</strong> for managed scale and <strong style={{ color:"var(--text)" }}>Self-hosted Local</strong> for free local usage.
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
              <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:10, padding:14 }}>
                <div style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"var(--text)", marginBottom:6 }}>API Cloud</div>
                <ul style={{ margin:0, paddingLeft:16, color:"var(--text2)", fontSize:13, lineHeight:1.7 }}>
                  <li>Managed endpoint: <code style={{ fontFamily:"var(--font-mono)" }}>https://api.scribe.dev</code></li>
                  <li>Usage billing by monthly/yearly API plans</li>
                  <li>Built-in rate limits, analytics, and SLA tiers</li>
                </ul>
              </div>
              <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:10, padding:14 }}>
                <div style={{ fontFamily:"var(--font-display)", fontWeight:700, color:"var(--text)", marginBottom:6 }}>Self-hosted Local</div>
                <ul style={{ margin:0, paddingLeft:16, color:"var(--text2)", fontSize:13, lineHeight:1.7 }}>
                  <li>Run on localhost with no cloud subscription</li>
                  <li>Ideal for development and testing</li>
                  <li>Can still test webhooks using tunneling</li>
                </ul>
              </div>
            </div>
            <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:10, padding:16 }}>
              <div style={{ fontSize:11, color:"var(--text3)", fontFamily:"var(--font-mono)", marginBottom:8 }}>QUICK START FLOW</div>
              <ol style={{ margin:0, paddingLeft:18, color:"var(--text2)", fontSize:14, lineHeight:1.75 }}>
                <li>Create workspace and API key from Settings.</li>
                <li>Publish a post from dashboard/editor.</li>
                <li>Fetch with <code style={{ fontFamily:"var(--font-mono)" }}>GET /v1/posts</code> using <code style={{ fontFamily:"var(--font-mono)" }}>x-api-key</code>.</li>
                <li>Configure webhook endpoint for publish events.</li>
              </ol>
            </div>
          </div>
        )}
        {activeSection==="local-setup" && (
          <div style={{ maxWidth:760 }}>
            <h1 style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:28, color:"var(--text)", marginBottom:8, letterSpacing:"-0.5px" }}>Local Setup</h1>
            <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.7, marginBottom:18 }}>
              Run Scribe locally to develop content workflows without cloud billing.
            </p>
            <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden", marginBottom:16 }}>
              <div style={{ background:"var(--bg3)", borderBottom:"1px solid var(--border)", padding:"9px 12px", fontSize:11, color:"var(--text3)", fontFamily:"var(--font-mono)" }}>Terminal</div>
              <pre style={{ margin:0, padding:16, fontFamily:"var(--font-mono)", fontSize:12, color:"var(--text2)", lineHeight:1.75, overflowX:"auto" }}>{`git clone <your-repo-url>
cd scribe
npm install
npm run dev`}</pre>
            </div>
            <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden", marginBottom:18 }}>
              <div style={{ background:"var(--bg3)", borderBottom:"1px solid var(--border)", padding:"9px 12px", fontSize:11, color:"var(--text3)", fontFamily:"var(--font-mono)" }}>.env.local</div>
              <pre style={{ margin:0, padding:16, fontFamily:"var(--font-mono)", fontSize:12, color:"var(--text2)", lineHeight:1.75, overflowX:"auto" }}>{`VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SCRIBE_API_BASE=http://localhost:5173/api`}</pre>
            </div>
            <div style={{ background:"rgba(0,204,248,.04)", border:"1px solid rgba(0,204,248,.2)", borderRadius:10, padding:"12px 16px", display:"flex", gap:10 }}>
              <span>💡</span>
              <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.6 }}>
                Use local mode for development. Move to API Cloud only when you need production rate limits and managed scaling.
              </div>
            </div>
          </div>
        )}
        {activeSection==="webhook-guide" && (
          <div style={{ maxWidth:760 }}>
            <h1 style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:28, color:"var(--text)", marginBottom:8, letterSpacing:"-0.5px" }}>Webhook Guide</h1>
            <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.7, marginBottom:18 }}>
              Trigger automations when content is published, updated, or archived.
            </p>
            <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:16, marginBottom:12 }}>
              <div style={{ fontSize:11, color:"var(--text3)", fontFamily:"var(--font-mono)", marginBottom:8 }}>SETUP STEPS</div>
              <ol style={{ margin:0, paddingLeft:18, color:"var(--text2)", fontSize:14, lineHeight:1.75 }}>
                <li>Create endpoint in your service: <code style={{ fontFamily:"var(--font-mono)" }}>POST /webhooks/scribe</code>.</li>
                <li>Register webhook URL in Scribe settings.</li>
                <li>Store and verify the webhook signature secret.</li>
                <li>Send test payload from Docs → Webhooks endpoint.</li>
              </ol>
            </div>
            <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
              <div style={{ background:"var(--bg3)", borderBottom:"1px solid var(--border)", padding:"9px 12px", fontSize:11, color:"var(--text3)", fontFamily:"var(--font-mono)" }}>Node.js handler example</div>
              <pre style={{ margin:0, padding:16, fontFamily:"var(--font-mono)", fontSize:12, color:"var(--text2)", lineHeight:1.75, overflowX:"auto" }}>{`app.post('/webhooks/scribe', express.json(), (req, res) => {
  const event = req.body?.event;
  if (event === 'post.published') {
    // trigger deploy, cache purge, or social distribution
  }
  return res.status(200).json({ ok: true });
});`}</pre>
            </div>
          </div>
        )}
        {activeSection==="authentication" && (
          <div style={{ maxWidth:760 }}>
            <h1 style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:28, color:"var(--text)", marginBottom:8, letterSpacing:"-0.5px" }}>Authentication</h1>
            <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.7, marginBottom:24 }}>Include your API key in the <code style={{ fontFamily:"var(--font-mono)", fontSize:13, color:"var(--accent)", background:"rgba(0,204,248,.08)", padding:"1px 5px", borderRadius:3 }}>x-api-key</code> header on every request.</p>
            <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden", marginBottom:24 }}>
              <div style={{ background:"var(--bg3)", borderBottom:"1px solid var(--border)", padding:"10px 14px", display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ display:"flex", gap:4 }}>{["#ff6b6b","#ffaa44","#00e5a0"].map(c=><div key={c} style={{ width:8,height:8,borderRadius:"50%",background:c }} />)}</div>
                <div style={{ display:"flex", gap:4, marginLeft:8 }}>
                  {["curl","node","python","csharp"].map(l=>(<button key={l} onClick={()=>setCodeLang(l)} style={{ padding:"3px 8px", borderRadius:4, background:codeLang===l?"var(--bg5)":"transparent", color:codeLang===l?"var(--text)":"var(--text3)", fontSize:11, fontFamily:"var(--font-mono)", border:codeLang===l?"1px solid var(--border3)":"none" }}>{l}</button>))}
                </div>
              </div>
              <pre style={{ padding:16, fontFamily:"var(--font-mono)", fontSize:13, lineHeight:1.7, color:"var(--text2)", overflowX:"auto" }}>{codeExamples[codeLang]}</pre>
            </div>
            <div style={{ background:"rgba(0,204,248,.04)", border:"1px solid rgba(0,204,248,.2)", borderRadius:10, padding:"12px 16px", marginBottom:24, display:"flex", gap:10 }}>
              <span>ℹ️</span>
              <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.6 }}>Create keys in <strong style={{ color:"var(--text)" }}>Settings → API Keys</strong>. Never expose them in client-side code.</div>
            </div>
            <h2 style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:20, color:"var(--text)", marginBottom:16 }}>Rate Limits</h2>
            <table style={{ width:"100%", borderCollapse:"collapse", border:"1px solid var(--border)", borderRadius:10, overflow:"hidden" }}>
              <thead><tr style={{ background:"var(--bg2)" }}>{["Plan","Requests/min","Burst","API Keys"].map(h=><th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, color:"var(--text3)", fontFamily:"var(--font-mono)", borderBottom:"1px solid var(--border)" }}>{h}</th>)}</tr></thead>
              <tbody>{[["Free","100","150","3"],["Pro","1,000","1,500","20"],["Team","10,000","15,000","Unlimited"]].map(([plan,...vals])=>(<tr key={plan} style={{ borderBottom:"1px solid var(--border)" }}><td style={{ padding:"10px 14px" }}><Badge variant={plan==="Pro"?"pro":plan==="Team"?"advanced":"draft"}>{plan}</Badge></td>{vals.map((v,i)=><td key={i} style={{ padding:"10px 14px", fontFamily:"var(--font-mono)", fontSize:12, color:"var(--text2)" }}>{v}</td>)}</tr>))}</tbody>
            </table>
          </div>
        )}
        {["posts","series","media","analytics","webhooks"].includes(activeSection) && (
          <div style={{ maxWidth:760 }}>
            <h1 style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:28, color:"var(--text)", marginBottom:8, letterSpacing:"-0.5px", textTransform:"capitalize" }}>{activeSection}</h1>
            <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.7, marginBottom:24 }}>Manage your {activeSection} via the REST API. Write operations require appropriate API key permissions.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {(allEndpoints[activeSection]||[]).map((ep,i)=>{
                const isOpen = expanded[ep.path+ep.method];
                return (
                  <div key={i} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
                    <button onClick={()=>setExpanded(x=>({...x,[ep.path+ep.method]:!isOpen}))} style={{ width:"100%", padding:"14px 18px", borderBottom:isOpen?"1px solid var(--border)":"none", display:"flex", alignItems:"center", gap:12, background:"transparent", border:"none", cursor:"pointer", textAlign:"left" }}>
                      <span style={{ background:methodColor[ep.method]+"20", color:methodColor[ep.method], border:"1px solid "+methodColor[ep.method]+"40", borderRadius:5, padding:"3px 10px", fontFamily:"var(--font-mono)", fontSize:11, fontWeight:700, minWidth:52, textAlign:"center" }}>{ep.method}</span>
                      <code style={{ fontFamily:"var(--font-mono)", fontSize:14, color:"var(--text)", flex:1 }}>{ep.path}</code>
                      <span style={{ fontSize:13, color:"var(--text2)" }}>{ep.desc}</span>
                      <span style={{ color:"var(--text3)", fontSize:12, marginLeft:8 }}>{isOpen?"▲":"▼"}</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding:"16px 18px" }}>
                        <div style={{ fontSize:11, color:"var(--text3)", fontFamily:"var(--font-mono)", marginBottom:8 }}>PARAMETERS</div>
                        <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:16 }}>
                          <thead><tr style={{ background:"var(--bg3)" }}>{["Name","In","Type","Description"].map(h=><th key={h} style={{ padding:"7px 10px", textAlign:"left", fontSize:10, color:"var(--text3)", fontFamily:"var(--font-mono)", borderBottom:"1px solid var(--border)" }}>{h}</th>)}</tr></thead>
                          <tbody>{ep.params.map(([name,loc,type,desc])=>(<tr key={name} style={{ borderBottom:"1px solid var(--border)" }}><td style={{ padding:"8px 10px", fontFamily:"var(--font-mono)", fontSize:12, color:"var(--accent)" }}>{name}</td><td style={{ padding:"8px 10px", fontSize:11, color:"var(--text3)", fontFamily:"var(--font-mono)" }}>{loc}</td><td style={{ padding:"8px 10px", fontSize:11, color:"var(--purple)", fontFamily:"var(--font-mono)" }}>{type}</td><td style={{ padding:"8px 10px", fontSize:12, color:"var(--text2)" }}>{desc}</td></tr>))}</tbody>
                        </table>
                        <div style={{ background:"rgba(0,204,248,.04)", border:"1px solid rgba(0,204,248,.15)", borderRadius:8, padding:10, display:"flex", gap:10, alignItems:"center" }}>
                          <span style={{ fontSize:11, color:"var(--accent)", fontFamily:"var(--font-mono)", whiteSpace:"nowrap" }}>TRY IT</span>
                          <input placeholder="Paste your API key to test live…" style={{ flex:1, fontSize:12, padding:"5px 8px" }} />
                          <Btn variant="outline" size="sm">Send →</Btn>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {activeSection==="errors" && (
          <div style={{ maxWidth:760 }}>
            <h1 style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:28, color:"var(--text)", marginBottom:8, letterSpacing:"-0.5px" }}>Error Codes</h1>
            <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.7, marginBottom:24 }}>All errors return a consistent JSON shape with a code and description.</p>
            <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:10, overflow:"hidden", marginBottom:24 }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr style={{ background:"var(--bg3)" }}>{["HTTP","Code","Description"].map(h=><th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, color:"var(--text3)", fontFamily:"var(--font-mono)", borderBottom:"1px solid var(--border)" }}>{h}</th>)}</tr></thead>
                <tbody>{[["401","MISSING_AUTH","No API key provided"],["401","INVALID_KEY","API key is invalid or revoked"],["403","INSUFFICIENT_PERMISSIONS","Key lacks required permissions"],["404","NOT_FOUND","Resource not found"],["422","VALIDATION_ERROR","Request body failed validation"],["429","RATE_LIMIT_EXCEEDED","Too many requests — check Retry-After"],["500","INTERNAL_ERROR","Server error — contact support"]].map(([http,code,desc])=>(<tr key={code} style={{ borderBottom:"1px solid var(--border)" }}><td style={{ padding:"10px 14px", fontFamily:"var(--font-mono)", fontSize:12, color:parseInt(http)>=500?"var(--red)":parseInt(http)>=400?"var(--orange)":"var(--green)" }}>{http}</td><td style={{ padding:"10px 14px", fontFamily:"var(--font-mono)", fontSize:12, color:"var(--accent)" }}>{code}</td><td style={{ padding:"10px 14px", fontSize:13, color:"var(--text2)" }}>{desc}</td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────
