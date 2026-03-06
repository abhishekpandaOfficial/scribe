import { useState, useEffect, useRef, useCallback } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=JetBrains+Mono:wght@300;400;500;600&family=Instrument+Sans:wght@400;500;600&display=swap');
    :root {
      --bg:#07090e;--bg2:#0c1018;--bg3:#111820;--bg4:#172030;--bg5:#1d2840;
      --border:#182236;--border2:#243550;--border3:#2e4468;
      --text:#d8e8f8;--text2:#7a9ab8;--text3:#3e5a7a;--text4:#1e3050;
      --accent:#00ccf8;--a2:#0090c0;--green:#00e5a0;--blue:#5aabff;
      --purple:#b08aff;--red:#ff6b6b;--orange:#ffaa44;--yellow:#ffd166;--pink:#f472b6;
    }
    *{box-sizing:border-box;margin:0;padding:0;}
    html,body,#root{height:100%;background:var(--bg);}
    body{color:var(--text);font-family:'Instrument Sans',sans-serif;font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased;}
    ::-webkit-scrollbar{width:3px;height:3px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px;}
    button{cursor:pointer;border:none;outline:none;font-family:'JetBrains Mono',monospace;}
    input,textarea,select{background:var(--bg4);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-family:'Instrument Sans',sans-serif;font-size:14px;padding:9px 12px;outline:none;width:100%;transition:border-color .13s,box-shadow .13s;}
    input:focus,textarea:focus,select:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,200,248,.12);}
    input::placeholder,textarea::placeholder{color:var(--text4);}
    a{color:var(--accent);text-decoration:none;}
    [contenteditable]:focus{outline:none;}
    @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes slideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
    @keyframes orb{0%,100%{transform:scale(1) translate(0,0)}33%{transform:scale(1.08) translate(20px,-15px)}66%{transform:scale(.95) translate(-15px,20px)}}
    .fadeIn{animation:fadeIn .3s ease forwards}
    .slideDown{animation:slideDown .2s ease forwards}
  `}</style>
);

// ─── MOCK DATA ─────────────────────────────────────────────────
const MOCK_POSTS = [
  {id:"1",title:"The async/await State Machine",series:"C# Mastery",chapter:22,status:"published",views:4821,updated:"2 days ago",tags:["CLR","async","performance"],difficulty:"advanced",slug:"async-await-state-machine",readTime:"7 min",excerpt:"Deep dive into how the C# compiler transforms async/await into an IAsyncStateMachine struct..."},
  {id:"2",title:"Zero-Allocation Patterns in .NET 9",series:"C# Mastery",chapter:21,status:"published",views:3204,updated:"5 days ago",tags:["performance",".NET 9","Span"],difficulty:"architect",slug:"zero-allocation-patterns",readTime:"9 min",excerpt:"Using Span<T>, Memory<T>, and ref structs to eliminate GC pressure in hot paths..."},
  {id:"3",title:"Microservices with .NET Aspire",series:"Cloud Architecture",chapter:1,status:"draft",views:0,updated:"1 hour ago",tags:["microservices","Aspire","Docker"],difficulty:"intermediate",slug:"microservices-dotnet-aspire",readTime:"6 min",excerpt:"Building distributed systems with the new .NET Aspire orchestration framework..."},
  {id:"4",title:"EF Core Performance Pitfalls",series:"C# Mastery",chapter:20,status:"review",views:1820,updated:"1 week ago",tags:["EF Core","SQL","ORM"],difficulty:"advanced",slug:"ef-core-performance",readTime:"8 min",excerpt:"N+1 queries, cartesian explosion, and how to write efficient LINQ queries..."},
  {id:"5",title:"Kubernetes Networking Deep Dive",series:"Cloud Architecture",chapter:3,status:"scheduled",views:0,updated:"3 days ago",tags:["K8s","networking","CNI"],difficulty:"architect",slug:"kubernetes-networking",readTime:"12 min",excerpt:"Understanding pod-to-pod communication, service meshes, and Ingress controllers..."},
  {id:"6",title:"Building a gRPC Service in C# 13",series:"C# Mastery",chapter:19,status:"published",views:2190,updated:"2 weeks ago",tags:["gRPC","Protobuf","streaming"],difficulty:"intermediate",slug:"grpc-service-csharp",readTime:"7 min",excerpt:"Complete guide to gRPC with bidirectional streaming using the latest C# features..."},
];

const CHART_DATA = Array.from({length:30},(_,i)=>({day:`Mar ${i+1}`,views:Math.floor(800+Math.random()*2400+Math.sin(i*.4)*600)}));
const TOP_POSTS_DATA = MOCK_POSTS.filter(p=>p.views>0).map(p=>({name:p.title.split(' ').slice(0,3).join(' ')+'…',views:p.views}));
const TRAFFIC_DATA = [{name:"Direct",value:38},{name:"Google",value:31},{name:"Twitter",value:15},{name:"GitHub",value:10},{name:"Other",value:6}];
const PIE_COLORS = ["#00ccf8","#5aabff","#b08aff","#00e5a0","#ffaa44"];
const MOCK_USER = {name:"Abhishek Panda",username:"abhishekpanda",plan:"Pro",email:"abhishek@abhishekpanda.com",avatar:"AP",bio:"Senior .NET Engineer · Writing about performance, architecture, and real-world C#. 22K readers.",website:"https://abhishekpanda.com",twitter:"@AbhishekPanda",github:"@abhishek-panda"};

const TEMPLATES = [
  {id:1,name:"Technical Deep Dive",category:"Deep Dive",blocks:14,desc:"Lead + H2s + code blocks + callouts + tech stack",color:"var(--accent)"},
  {id:2,name:"Tutorial / How-To",category:"Tutorial",blocks:11,desc:"Steps-based, code examples, warning callouts",color:"var(--green)"},
  {id:3,name:"Series Introduction",category:"Series Intro",blocks:9,desc:"Hero-style opener, curriculum overview, what you'll learn",color:"var(--blue)"},
  {id:4,name:"Architecture Decision",category:"Architecture",blocks:12,desc:"ADR format: Context → Decision → Consequences",color:"var(--purple)"},
  {id:5,name:"Performance Analysis",category:"Deep Dive",blocks:15,desc:"Benchmark chart + code blocks + comparison table",color:"var(--orange)"},
  {id:6,name:"Bug Post-Mortem",category:"Retrospective",blocks:10,desc:"Timeline steps + danger callouts + root cause",color:"var(--red)"},
  {id:7,name:"Library Comparison",category:"Deep Dive",blocks:13,desc:"Comparison tables + pros/cons + recommendation",color:"var(--yellow)"},
  {id:8,name:"Weekly Dev Journal",category:"Retrospective",blocks:8,desc:"What I learned, built, and what's next",color:"var(--pink)"},
  {id:9,name:"Interview Prep Guide",category:"Interview Prep",blocks:16,desc:"Q&A format with interview question callouts",color:"var(--blue)"},
  {id:10,name:"API Reference",category:"Architecture",blocks:12,desc:"Endpoint table + code examples per endpoint",color:"var(--accent)"},
  {id:11,name:"Release Notes / Changelog",category:"Announcement",blocks:7,desc:"Success callouts for features, warning for breaking changes",color:"var(--green)"},
  {id:12,name:"Book / Course Review",category:"Tutorial",blocks:9,desc:"Rating, chapters, key takeaways, recommendation",color:"var(--purple)"},
];

const BLOCK_TYPES = [
  {type:"paragraph",label:"Paragraph",desc:"Plain text block",icon:"¶",cat:"TEXT"},
  {type:"lead",label:"Lead",desc:"Large intro paragraph",icon:"L",cat:"TEXT"},
  {type:"h1",label:"Heading 1",desc:"Large section title",icon:"H1",cat:"TEXT"},
  {type:"h2",label:"Heading 2",desc:"Section heading",icon:"H2",cat:"TEXT"},
  {type:"h3",label:"Heading 3",desc:"Subsection heading",icon:"H3",cat:"TEXT"},
  {type:"bullet",label:"Bullet List",desc:"Unordered list",icon:"•",cat:"TEXT"},
  {type:"numbered",label:"Numbered List",desc:"Ordered list",icon:"1.",cat:"TEXT"},
  {type:"quote",label:"Quote",desc:"Blockquote",icon:"❝",cat:"TEXT"},
  {type:"divider",label:"Divider",desc:"Horizontal rule",icon:"─",cat:"TEXT"},
  {type:"code",label:"Code Block",desc:"Syntax-highlighted code",icon:"</>",cat:"CODE"},
  {type:"math",label:"Math / LaTeX",desc:"Mathematical equations",icon:"∑",cat:"CODE"},
  {type:"callout-insight",label:"Insight",desc:"Cyan info callout",icon:"💡",cat:"CALLOUT"},
  {type:"callout-warning",label:"Warning",desc:"Orange warning callout",icon:"⚠️",cat:"CALLOUT"},
  {type:"callout-danger",label:"Danger",desc:"Red danger callout",icon:"🚨",cat:"CALLOUT"},
  {type:"callout-success",label:"Success",desc:"Green success callout",icon:"✅",cat:"CALLOUT"},
  {type:"callout-info",label:"Info",desc:"Blue info callout",icon:"ℹ️",cat:"CALLOUT"},
  {type:"image",label:"Image",desc:"Image with caption",icon:"🖼",cat:"MEDIA"},
  {type:"youtube",label:"YouTube",desc:"Embedded video",icon:"▶",cat:"MEDIA"},
  {type:"techstack",label:"Tech Stack",desc:"Technology badge row",icon:"⚙",cat:"MEDIA"},
  {type:"mermaid",label:"Mermaid Diagram",desc:"Flowchart, sequence, ER",icon:"◇",cat:"DIAGRAM"},
  {type:"chart",label:"Chart",desc:"Bar, line, or area chart",icon:"📊",cat:"DIAGRAM"},
  {type:"toggle",label:"Toggle",desc:"Collapsible accordion",icon:"▶",cat:"LAYOUT"},
  {type:"steps",label:"Steps",desc:"Numbered step sequence",icon:"①",cat:"LAYOUT"},
  {type:"tabs",label:"Tabs",desc:"Tabbed content panels",icon:"⊟",cat:"LAYOUT"},
  {type:"columns",label:"2 Columns",desc:"Side-by-side layout",icon:"⊞",cat:"LAYOUT"},
  {type:"table",label:"Table",desc:"Editable data table",icon:"▦",cat:"LAYOUT"},
];

function makeBlock(type) {
  const d = {
    paragraph:{content:""},lead:{content:""},h1:{content:""},h2:{content:""},h3:{content:""},
    bullet:{items:[""]},numbered:{items:[""]},quote:{content:""},divider:{},
    code:{lang:"typescript",title:"example.ts",content:`// TypeScript Example\nconst greet = (name: string): string => {\n  return \`Hello, \${name}!\`;\n};\nconsole.log(greet("Scribe"));`},
    math:{content:"E = mc²"},
    "callout-insight":{content:"This is an important insight."},
    "callout-warning":{content:"Watch out for this potential issue."},
    "callout-danger":{content:"This approach is dangerous in production."},
    "callout-success":{content:"Great job! This is recommended."},
    "callout-info":{content:"Additional context and information."},
    image:{url:"",caption:"",align:"center"},
    youtube:{url:"",videoId:""},
    techstack:{items:["C#",".NET 9","PostgreSQL","Docker","Redis"]},
    mermaid:{code:`graph TD\n  A[Start] --> B{Decision}\n  B -->|Yes| C[Success]\n  B -->|No| D[Retry]\n  D --> B`,title:"System Flow"},
    chart:{chartType:"bar",title:"Performance Metrics",data:[{name:"Q1",value:420},{name:"Q2",value:580},{name:"Q3",value:720},{name:"Q4",value:890}]},
    toggle:{title:"Click to expand",content:"Hidden content revealed on click.",open:false},
    steps:{items:["Install dependencies","Configure environment","Write your first block","Deploy to production","Monitor analytics"]},
    tabs:{tabs:[{label:"Tab 1",content:"Content for the first tab."},{label:"Tab 2",content:"Content for the second tab."},{label:"Tab 3",content:"Content for the third tab."}],active:0},
    columns:{left:"Left column content. Edit me.",right:"Right column content. Edit me."},
    table:{headers:["Feature","Scribe","Notion","Hashnode"],rows:[["Mermaid Diagrams","✅","✅","❌"],["API-First","✅","⚠️","⚠️"],["Webhooks","✅","❌","⚠️"]]},
  };
  return {id:Date.now()+Math.random(),type,...(d[type]||{})};
}

// ─── SHARED COMPONENTS ─────────────────────────────────────────
function Btn({variant="primary",size="md",onClick,children,loading,style={}}) {
  const sz={sm:{padding:"5px 12px",fontSize:"11px"},md:{padding:"8px 16px",fontSize:"12px"},lg:{padding:"11px 22px",fontSize:"13px"}};
  const vars={
    primary:{background:"var(--accent)",color:"#000"},
    ghost:{background:"transparent",color:"var(--text2)",border:"1px solid var(--border2)"},
    danger:{background:"rgba(255,107,107,.12)",color:"var(--red)",border:"1px solid rgba(255,107,107,.25)"},
    outline:{background:"transparent",color:"var(--accent)",border:"1px solid var(--border3)"},
    subtle:{background:"var(--bg4)",color:"var(--text)",border:"1px solid var(--border2)"},
  };
  return (
    <button onClick={onClick} style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,borderRadius:"8px",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"6px",transition:"all .13s",whiteSpace:"nowrap",...sz[size],...vars[variant],...style}}
      onMouseEnter={e=>{e.currentTarget.style.opacity=".82";e.currentTarget.style.transform="translateY(-1px)";}}
      onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)";}}>
      {loading&&<span style={{width:12,height:12,border:"2px solid currentColor",borderTopColor:"transparent",borderRadius:"50%",display:"inline-block",animation:"spin .7s linear infinite"}}/>}
      {children}
    </button>
  );
}

function Badge({variant="draft",children,style={}}) {
  const c={
    draft:{bg:"rgba(255,170,68,.12)",color:"var(--orange)",border:"rgba(255,170,68,.25)"},
    published:{bg:"rgba(0,229,160,.1)",color:"var(--green)",border:"rgba(0,229,160,.2)"},
    review:{bg:"rgba(90,171,255,.1)",color:"var(--blue)",border:"rgba(90,171,255,.2)"},
    scheduled:{bg:"rgba(255,209,102,.1)",color:"var(--yellow)",border:"rgba(255,209,102,.2)"},
    basic:{bg:"rgba(0,229,160,.1)",color:"var(--green)",border:"rgba(0,229,160,.2)"},
    intermediate:{bg:"rgba(90,171,255,.1)",color:"var(--blue)",border:"rgba(90,171,255,.2)"},
    advanced:{bg:"rgba(176,138,255,.1)",color:"var(--purple)",border:"rgba(176,138,255,.2)"},
    architect:{bg:"rgba(255,107,107,.1)",color:"var(--red)",border:"rgba(255,107,107,.2)"},
    pro:{bg:"rgba(0,204,248,.12)",color:"var(--accent)",border:"rgba(0,204,248,.25)"},
  }[variant]||{bg:"rgba(255,170,68,.12)",color:"var(--orange)",border:"rgba(255,170,68,.25)"};
  return <span style={{background:c.bg,color:c.color,border:`1px solid ${c.border}`,borderRadius:"5px",padding:"2px 7px",fontSize:"10px",fontFamily:"'JetBrains Mono',monospace",fontWeight:600,letterSpacing:".3px",...style}}>{children}</span>;
}

function Avatar({name="AP",size="md"}) {
  const sz={sm:28,md:36,lg:48}[size];
  const initials=name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  return <div style={{width:sz,height:sz,borderRadius:"50%",background:"linear-gradient(135deg,var(--accent),var(--purple))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:sz*0.32,fontWeight:700,fontFamily:"'Syne',sans-serif",color:"#000",flexShrink:0}}>{initials}</div>;
}

function Toast({message,type="success",onClose}) {
  const icons={success:"✓",error:"✕",info:"ℹ",warning:"⚠"};
  const colors={success:"var(--green)",error:"var(--red)",info:"var(--blue)",warning:"var(--orange)"};
  return (
    <div style={{position:"fixed",bottom:24,right:24,zIndex:1000,background:"var(--bg3)",border:`1px solid var(--border2)`,borderLeft:`3px solid ${colors[type]}`,borderRadius:"10px",padding:"12px 16px",display:"flex",alignItems:"center",gap:10,minWidth:260,animation:"slideDown .2s ease",boxShadow:"0 8px 32px rgba(0,0,0,.4)"}}>
      <span style={{color:colors[type],fontSize:14,fontWeight:700}}>{icons[type]}</span>
      <span style={{color:"var(--text)",fontSize:13}}>{message}</span>
      <button onClick={onClose} style={{marginLeft:"auto",background:"none",color:"var(--text3)",fontSize:16}}>×</button>
    </div>
  );
}

function useToast() {
  const [toasts,setToasts]=useState([]);
  const show=(message,type="success")=>{const id=Date.now();setToasts(t=>[...t,{id,message,type}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3000);};
  const remove=(id)=>setToasts(t=>t.filter(x=>x.id!==id));
  return {toasts,show,remove};
}

function Sidebar({screen,setScreen}) {
  const nav=[
    {key:"dashboard",icon:"📝",label:"Posts",badge:"24"},
    {key:"templates",icon:"📋",label:"Templates"},
    {key:"settings",icon:"🔌",label:"API & Webhooks"},
    {key:"analytics",icon:"📊",label:"Analytics"},
    {key:"blog",icon:"🌐",label:"My Blog"},
    {key:"settings",icon:"⚙️",label:"Settings"},
    {key:"apidocs",icon:"📚",label:"API Docs"},
  ];
  return (
    <div style={{width:220,background:"var(--bg2)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",flexShrink:0,height:"100vh",position:"sticky",top:0}}>
      <div style={{padding:"18px 16px 14px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setScreen("dashboard")}>
        <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,var(--accent),var(--blue))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#000",fontFamily:"'Syne',sans-serif"}}>S</div>
        <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:16,color:"var(--text)",letterSpacing:"-0.5px"}}>scri·be</span>
        <Badge variant="pro" style={{marginLeft:"auto",fontSize:"9px"}}>PRO</Badge>
      </div>
      <nav style={{flex:1,padding:"10px 8px",display:"flex",flexDirection:"column",gap:2,overflowY:"auto"}}>
        {nav.map((item,i)=>{
          const active=screen===item.key;
          return (
            <button key={i} onClick={()=>setScreen(item.key)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:8,background:active?"var(--bg5)":"transparent",color:active?"var(--text)":"var(--text2)",fontSize:13,fontFamily:"'Instrument Sans',sans-serif",fontWeight:active?600:400,border:active?"1px solid var(--border3)":"1px solid transparent",textAlign:"left",transition:"all .13s"}}
              onMouseEnter={e=>{if(!active){e.currentTarget.style.background="var(--bg4)";e.currentTarget.style.color="var(--text)";}}}
              onMouseLeave={e=>{if(!active){e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--text2)";}}}
            >
              <span style={{fontSize:16}}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge&&<span style={{marginLeft:"auto",background:"var(--bg4)",color:"var(--text3)",fontSize:10,fontFamily:"'JetBrains Mono',monospace",padding:"1px 6px",borderRadius:10,border:"1px solid var(--border2)"}}>{item.badge}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{padding:"12px 16px",borderTop:"1px solid var(--border)",display:"flex",alignItems:"center",gap:10}}>
        <Avatar name={MOCK_USER.name} size="sm"/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12,fontWeight:600,color:"var(--text)",fontFamily:"'Instrument Sans',sans-serif",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{MOCK_USER.name}</div>
          <div style={{fontSize:10,color:"var(--text3)",fontFamily:"'JetBrains Mono',monospace"}}>@{MOCK_USER.username}</div>
        </div>
        <button onClick={()=>setScreen("settings")} style={{background:"none",color:"var(--text3)",fontSize:16}}>⚙</button>
      </div>
    </div>
  );
}


// ─── LANDING PAGE ──────────────────────────────────────────────
function LandingScreen({setScreen}) {
  const features=[
    {icon:"🧱",title:"22 Block Types",desc:"Code, Mermaid diagrams, charts, callouts, tables, toggles, steps, embeds, tech stack pills, and more."},
    {icon:"🔌",title:"API-First",desc:"Consume your content from any Next.js, Astro, or Gatsby site. REST + webhooks + ISR support."},
    {icon:"🌐",title:"Custom Domains",desc:"Publish at blog.yoursite.com or yourname.scribe.dev. SSL included, zero config."},
    {icon:"📊",title:"Series & Curriculum",desc:"Build structured learning paths with chapters, difficulty levels, and progress tracking."},
    {icon:"🔐",title:"Auth & Monetization",desc:"Member-only posts, paid subscriber tiers, Stripe integration built in."},
    {icon:"🔄",title:"Live Webhooks",desc:"Auto-trigger your frontend rebuild on publish, update, or delete. Perfect for ISR/SSG pipelines."},
  ];
  return (
    <div style={{background:"var(--bg)",minHeight:"100vh",fontFamily:"'Instrument Sans',sans-serif"}}>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(7,9,14,.88)",backdropFilter:"blur(12px)",borderBottom:"1px solid var(--border)",padding:"0 48px",display:"flex",alignItems:"center",height:60,gap:32}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:28,height:28,borderRadius:7,background:"linear-gradient(135deg,var(--accent),var(--blue))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#000",fontFamily:"'Syne',sans-serif"}}>S</div>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17,color:"var(--text)",letterSpacing:"-0.5px"}}>scri·be</span>
        </div>
        <div style={{display:"flex",gap:24,marginLeft:16}}>
          {["Features","Pricing","Docs","Blog"].map(item=>(
            <button key={item} style={{background:"none",color:"var(--text2)",fontSize:13,fontFamily:"'Instrument Sans',sans-serif",padding:"4px 0",border:"none"}}
              onMouseEnter={e=>e.currentTarget.style.color="var(--text)"}
              onMouseLeave={e=>e.currentTarget.style.color="var(--text2)"}>{item}</button>
          ))}
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:10}}>
          <Btn variant="ghost" size="sm" onClick={()=>setScreen("login")}>Log in</Btn>
          <Btn variant="primary" size="sm" onClick={()=>setScreen("signup")}>Start free →</Btn>
        </div>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",paddingTop:60,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#07090e 0%,#0a1520 40%,#071018 70%,#07090e 100%)",backgroundSize:"400% 400%",animation:"gradientShift 12s ease infinite"}}/>
        <div style={{position:"absolute",top:"15%",right:"8%",width:480,height:480,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,204,248,.08) 0%,transparent 70%)",animation:"orb 14s ease infinite",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"10%",left:"5%",width:360,height:360,borderRadius:"50%",background:"radial-gradient(circle,rgba(176,138,255,.06) 0%,transparent 70%)",animation:"orb 18s ease infinite reverse",pointerEvents:"none"}}/>
        <div style={{position:"absolute",inset:0,opacity:.04,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,pointerEvents:"none"}}/>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 48px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center",position:"relative",zIndex:1,width:"100%"}}>
          <div className="fadeIn">
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(0,204,248,.08)",border:"1px solid rgba(0,204,248,.2)",borderRadius:20,padding:"4px 12px",marginBottom:24}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"var(--green)",animation:"pulse 2s infinite"}}/>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"var(--accent)"}}>v1.0 · Now in open beta</span>
            </div>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:52,lineHeight:1.12,letterSpacing:"-2px",color:"var(--text)",marginBottom:20}}>
              Write technical<br/>
              <span style={{background:"linear-gradient(90deg,var(--accent),var(--blue))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>content that</span><br/>
              actually converts.
            </h1>
            <p style={{fontSize:18,color:"var(--text2)",lineHeight:1.7,marginBottom:32,maxWidth:480}}>
              The block editor built for developers. Code blocks, Mermaid diagrams, series-based curriculum, API-first publishing. Your blog. Your domain. Your readers.
            </p>
            <div style={{display:"flex",gap:12,marginBottom:20}}>
              <Btn variant="primary" size="lg" onClick={()=>setScreen("signup")}>Start writing free →</Btn>
              <Btn variant="ghost" size="lg" onClick={()=>setScreen("dashboard")}>See live demo</Btn>
            </div>
            <p style={{fontSize:12,color:"var(--text3)",fontFamily:"'JetBrains Mono',monospace"}}>No credit card · Free plan forever · Custom domain on Pro</p>
          </div>
          {/* Editor mockup */}
          <div style={{background:"var(--bg2)",border:"1px solid var(--border2)",borderRadius:16,overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,.5)",animation:"fadeIn .6s .2s ease both"}}>
            <div style={{background:"var(--bg3)",borderBottom:"1px solid var(--border)",padding:"10px 16px",display:"flex",alignItems:"center",gap:8}}>
              {["#ff6b6b","#ffaa44","#00e5a0"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
              <span style={{marginLeft:12,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"var(--text3)"}}>async-await-state-machine.md</span>
              <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"var(--green)",animation:"pulse 2s infinite"}}/>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"var(--green)"}}>saved</span>
              </div>
            </div>
            <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",gap:14}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:"var(--text)",letterSpacing:"-0.5px"}}>The async/await State Machine</div>
              <div style={{background:"rgba(0,204,248,.05)",border:"1px solid rgba(0,204,248,.2)",borderRadius:10,padding:"10px 14px",display:"flex",gap:10}}>
                <span style={{fontSize:15}}>💡</span>
                <span style={{color:"var(--text2)",fontSize:13,lineHeight:1.6}}>The C# compiler transforms async/await into a state machine struct implementing IAsyncStateMachine.</span>
              </div>
              <div style={{background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:10,overflow:"hidden"}}>
                <div style={{background:"var(--bg4)",borderBottom:"1px solid var(--border2)",padding:"6px 12px",display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"var(--accent)",background:"rgba(0,204,248,.1)",padding:"2px 7px",borderRadius:4}}>csharp</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"var(--text3)"}}>AsyncExample.cs</span>
                </div>
                <pre style={{padding:"12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,lineHeight:1.7,color:"var(--text2)",overflow:"hidden"}}>
{`public async Task<string> FetchAsync() {
  await Task.Delay(100);
  return "data";
}`}
                </pre>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {[".NET 9","C#","CLR","async","performance"].map(t=>(
                  <span key={t} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"var(--text3)",background:"var(--bg4)",border:"1px solid var(--border2)",padding:"2px 8px",borderRadius:5}}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{position:"absolute",bottom:32,left:0,right:0,textAlign:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"var(--text3)"}}>
          Trusted by <span style={{color:"var(--text2)"}}>2,400+</span> technical bloggers · <span style={{color:"var(--text2)"}}>18,000+</span> posts published · <span style={{color:"var(--text2)"}}>4.2M</span> monthly readers
        </div>
      </section>

      {/* FEATURES */}
      <section style={{padding:"80px 48px",maxWidth:1200,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:52}}>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:36,color:"var(--text)",letterSpacing:"-1px",marginBottom:12}}>Everything a technical blogger needs</h2>
          <p style={{color:"var(--text2)",fontSize:16}}>Built from the ground up for developers, engineers, and architects.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
          {features.map((f,i)=>(
            <div key={i} style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:14,padding:24,transition:"all .13s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--border3)";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.transform="translateY(0)";}}>
              <span style={{fontSize:28,display:"block",marginBottom:14}}>{f.icon}</span>
              <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17,color:"var(--text)",marginBottom:8}}>{f.title}</h3>
              <p style={{color:"var(--text2)",fontSize:13,lineHeight:1.7}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API PREVIEW */}
      <section style={{padding:"60px 48px",background:"var(--bg2)",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:64,alignItems:"center"}}>
          <div>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:34,color:"var(--text)",letterSpacing:"-1px",marginBottom:14}}>Your content, anywhere you want it</h2>
            <p style={{color:"var(--text2)",fontSize:15,lineHeight:1.7,marginBottom:24}}>Consume your blog posts from any frontend. Clean JSON, predictable schemas, ISR-ready.</p>
            <Btn variant="outline" onClick={()=>setScreen("apidocs")}>View API docs →</Btn>
          </div>
          <div style={{background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:14,overflow:"hidden"}}>
            <div style={{background:"var(--bg4)",borderBottom:"1px solid var(--border2)",padding:"8px 14px",display:"flex",alignItems:"center",gap:8}}>
              {["#ff6b6b","#ffaa44","#00e5a0"].map(c=><div key={c} style={{width:8,height:8,borderRadius:"50%",background:c}}/>)}
              <span style={{marginLeft:8,fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"var(--text3)"}}>fetch-posts.ts</span>
            </div>
            <pre style={{padding:"20px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,lineHeight:1.8,color:"var(--text2)",overflowX:"auto"}}>{`// Fetch all published posts
const res = await fetch(
  'https://api.scribe.dev/v1/posts',
  { headers: { 'x-api-key': 'sk_live_...' } }
);

// Returns clean JSON — ready for Next.js ISR
export async function getStaticProps() {
  const { data } = await res.json();
  return { props: { posts: data }, revalidate: 60 };
}`}</pre>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{padding:"80px 48px",background:"var(--bg)"}}>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:36,color:"var(--text)",letterSpacing:"-1px",textAlign:"center",marginBottom:12}}>Simple, transparent pricing</h2>
        <p style={{textAlign:"center",color:"var(--text2)",marginBottom:52,fontSize:15}}>Start free. Upgrade when you're ready.</p>
        <div style={{maxWidth:1000,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1.1fr 1fr",gap:20}}>
          {[
            {name:"Free",price:"$0",color:"var(--border2)",features:["1 workspace","5 published posts","scribe.dev subdomain","REST API access","3 API keys"]},
            {name:"Pro",price:"$12",color:"var(--accent)",popular:true,features:["Unlimited posts","Custom domain","Unlimited webhooks","Analytics dashboard","Remove Scribe branding","20 API keys","Priority support"]},
            {name:"Team",price:"$39",color:"var(--purple)",features:["Everything in Pro","5 team members","Shared workspace","SSO / GitHub login","Dedicated API rate limits","SLA guarantee"]},
          ].map((plan,i)=>(
            <div key={i} style={{background:"var(--bg3)",border:`1px solid ${plan.color}`,borderRadius:16,padding:28,position:"relative",transition:"transform .13s"}}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              {plan.popular&&<div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:"var(--accent)",color:"#000",fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,padding:"3px 12px",borderRadius:10}}>Most Popular</div>}
              <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:18,color:plan.color,marginBottom:8}}>{plan.name}</h3>
              <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:20}}>
                <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:36,color:"var(--text)"}}>{plan.price}</span>
                <span style={{color:"var(--text3)",fontSize:13}}>/month</span>
              </div>
              <ul style={{listStyle:"none",marginBottom:24,display:"flex",flexDirection:"column",gap:8}}>
                {plan.features.map((f,j)=>(
                  <li key={j} style={{display:"flex",gap:8,alignItems:"flex-start",fontSize:13,color:"var(--text2)"}}>
                    <span style={{color:"var(--green)",fontSize:12,marginTop:2}}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Btn variant={plan.popular?"primary":plan.name==="Team"?"outline":"ghost"} style={{width:"100%",justifyContent:"center"}} onClick={()=>setScreen("signup")}>
                {plan.name==="Free"?"Start free →":"Get started →"}
              </Btn>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"40px 48px",borderTop:"1px solid var(--border)"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:24,height:24,borderRadius:6,background:"linear-gradient(135deg,var(--accent),var(--blue))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#000",fontFamily:"'Syne',sans-serif"}}>S</div>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:"var(--text)"}}>scri·be</span>
          </div>
          <div style={{display:"flex",gap:24}}>
            {["Product","Docs","Pricing","Blog","GitHub"].map(l=>(
              <button key={l} style={{background:"none",color:"var(--text3)",fontSize:12,fontFamily:"'Instrument Sans',sans-serif",border:"none"}}
                onMouseEnter={e=>e.currentTarget.style.color="var(--text2)"}
                onMouseLeave={e=>e.currentTarget.style.color="var(--text3)"}>{l}</button>
            ))}
          </div>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"var(--text3)"}}>© 2026 Scribe · Built by Abhishek Panda · MIT License</p>
        </div>
      </footer>
    </div>
  );
}


// ─── AUTH SCREEN ────────────────────────────────────────────────
function AuthScreen({mode,setScreen,toast}) {
  const [tab,setTab]=useState(mode==="signup"?"signup":"login");
  const [email,setEmail]=useState("");const [pass,setPass]=useState("");
  const [name,setName]=useState("");const [username,setUsername]=useState("");
  const [confirmPass,setConfirmPass]=useState("");const [errors,setErrors]=useState({});
  const [loading,setLoading]=useState(false);const [showPass,setShowPass]=useState(false);

  const validate=()=>{
    const e={};
    if(!email.includes("@"))e.email="Enter a valid email";
    if(pass.length<8)e.pass="Password must be 8+ chars";
    if(tab==="signup"){
      if(!name.trim())e.name="Name is required";
      if(username.length<3)e.username="Username must be 3+ chars";
      if(pass!==confirmPass)e.confirmPass="Passwords don't match";
    }
    return e;
  };

  const handleSubmit=()=>{
    const e=validate();setErrors(e);
    if(Object.keys(e).length>0)return;
    setLoading(true);
    setTimeout(()=>{setLoading(false);toast(tab==="login"?"Welcome back! 👋":"Account created! 🎉");setScreen("dashboard");},1200);
  };

  const Field=({label,value,onChange,type="text",placeholder,error,rightEl})=>(
    <div style={{marginBottom:16}}>
      {label&&<label style={{display:"block",fontSize:12,color:"var(--text2)",fontFamily:"'JetBrains Mono',monospace",fontWeight:500,marginBottom:6}}>{label}</label>}
      <div style={{position:"relative"}}>
        <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
          style={error?{borderColor:"var(--red)",boxShadow:"0 0 0 3px rgba(255,107,107,.1)"}:{}}/>
        {rightEl&&<div style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)"}}>{rightEl}</div>}
      </div>
      {error&&<p style={{fontSize:11,color:"var(--red)",marginTop:5,fontFamily:"'JetBrains Mono',monospace"}}>⚠ {error}</p>}
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)`,backgroundSize:"40px 40px",opacity:.4}}/>
      <div style={{position:"absolute",top:"20%",left:"15%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,204,248,.07) 0%,transparent 70%)",animation:"orb 15s ease infinite",pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"20%",right:"15%",width:250,height:250,borderRadius:"50%",background:"radial-gradient(circle,rgba(176,138,255,.07) 0%,transparent 70%)",animation:"orb 20s ease infinite reverse",pointerEvents:"none"}}/>
      <div style={{background:"var(--bg2)",border:"1px solid var(--border2)",borderRadius:16,padding:36,width:420,position:"relative",zIndex:1,animation:"fadeIn .3s ease"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,var(--accent),var(--blue))",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:"#000",fontFamily:"'Syne',sans-serif",marginBottom:10}}>S</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:20,color:"var(--text)",letterSpacing:"-0.5px"}}>scri·be</div>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"var(--text3)",marginTop:3}}>Developer-first publishing</div>
        </div>
        <div style={{display:"flex",background:"var(--bg3)",borderRadius:10,padding:3,marginBottom:24,border:"1px solid var(--border)"}}>
          {["login","signup"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{flex:1,padding:"8px 0",borderRadius:8,background:tab===t?"var(--bg5)":"transparent",color:tab===t?"var(--text)":"var(--text2)",fontSize:13,fontFamily:"'Instrument Sans',sans-serif",fontWeight:tab===t?600:400,border:tab===t?"1px solid var(--border3)":"none",transition:"all .13s"}}>
              {t==="login"?"Log in":"Sign up"}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:10,marginBottom:16}}>
          {[["🔵","Google"],["⚫","GitHub"]].map(([ic,lbl])=>(
            <button key={lbl} style={{flex:1,padding:"9px 0",background:"var(--bg4)",border:"1px solid var(--border2)",borderRadius:8,color:"var(--text)",fontSize:12,fontFamily:"'Instrument Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:7,transition:"all .13s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--border3)";e.currentTarget.style.background="var(--bg5)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.background="var(--bg4)";}}
            ><span>{ic}</span>Continue with {lbl}</button>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{flex:1,height:1,background:"var(--border2)"}}/>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"var(--text3)"}}>or continue with email</span>
          <div style={{flex:1,height:1,background:"var(--border2)"}}/>
        </div>
        {tab==="signup"&&<Field label="Full name" value={name} onChange={setName} placeholder="Abhishek Panda" error={errors.name}/>}
        <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" error={errors.email}/>
        {tab==="signup"&&(
          <div>
            <Field label="Username" value={username} onChange={v=>setUsername(v.toLowerCase())} placeholder="abhishekpanda" error={errors.username}/>
            {username&&<p style={{fontSize:11,color:"var(--accent)",fontFamily:"'JetBrains Mono',monospace",marginTop:-10,marginBottom:12}}>→ scribe.dev/{username}</p>}
          </div>
        )}
        <Field label="Password" value={pass} onChange={setPass} type={showPass?"text":"password"} placeholder={tab==="login"?"Enter password":"Min 8 characters"} error={errors.pass}
          rightEl={<button onClick={()=>setShowPass(v=>!v)} style={{background:"none",color:"var(--text3)",fontSize:11,fontFamily:"'JetBrains Mono',monospace",border:"none"}}>{showPass?"hide":"show"}</button>}/>
        {tab==="signup"&&<Field label="Confirm password" value={confirmPass} onChange={setConfirmPass} type="password" placeholder="Repeat password" error={errors.confirmPass}/>}
        {tab==="login"&&<div style={{textAlign:"right",marginBottom:16,marginTop:-8}}><button style={{background:"none",color:"var(--text3)",fontSize:12,fontFamily:"'JetBrains Mono',monospace",border:"none"}}>Forgot password?</button></div>}
        {tab==="signup"&&(
          <label style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:16,fontSize:12,color:"var(--text2)",cursor:"pointer"}}>
            <input type="checkbox" style={{width:14,height:14,marginTop:2}}/>
            I agree to <span style={{color:"var(--accent)"}}>Terms</span> and <span style={{color:"var(--accent)"}}>Privacy Policy</span>
          </label>
        )}
        <Btn variant="primary" onClick={handleSubmit} loading={loading} style={{width:"100%",justifyContent:"center",padding:"11px 0"}}>
          {tab==="login"?"Continue →":"Create free account →"}
        </Btn>
        <p style={{textAlign:"center",marginTop:16,fontSize:12,color:"var(--text3)"}}>
          {tab==="login"?<>Don't have an account? <button onClick={()=>setTab("signup")} style={{background:"none",color:"var(--accent)",fontFamily:"'JetBrains Mono',monospace",fontSize:12,border:"none"}}>Sign up free</button></>:<>Already have an account? <button onClick={()=>setTab("login")} style={{background:"none",color:"var(--accent)",fontFamily:"'JetBrains Mono',monospace",fontSize:12,border:"none"}}>Log in</button></>}
        </p>
      </div>
    </div>
  );
}

// ─── DASHBOARD ─────────────────────────────────────────────────
function DashboardScreen({setScreen,setEditPost,toast}) {
  const [filter,setFilter]=useState("all");const [search,setSearch]=useState("");
  const kpis=[
    {label:"Total Posts",val:"24",delta:"↑ 3 this week",color:"var(--accent)"},
    {label:"Total Views",val:"48,291",delta:"↑ 12% this month",color:"var(--green)"},
    {label:"Subscribers",val:"847",delta:"↑ 23 new",color:"var(--blue)"},
    {label:"API Calls",val:"12,400",delta:"this month",color:"var(--purple)"},
  ];
  const filters=["all","published","draft","scheduled","review"];
  const filtered=MOCK_POSTS.filter(p=>{
    const matchStatus=filter==="all"||p.status===filter;
    const matchSearch=!search||p.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus&&matchSearch;
  });
  return (
    <div style={{flex:1,overflowY:"auto",background:"var(--bg)"}}>
      <div style={{padding:"28px 32px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:22,color:"var(--text)"}}>Good morning, Abhishek 👋</h1>
          <p style={{color:"var(--text3)",fontSize:12,fontFamily:"'JetBrains Mono',monospace",marginTop:3}}>abhishekpanda.scribe.dev · Pro Plan</p>
        </div>
        <Btn variant="primary" onClick={()=>{setEditPost(null);setScreen("editor");toast("New post created!");}}>+ New Post</Btn>
      </div>
      <div style={{padding:"24px 32px"}}>
        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:28}}>
          {kpis.map((k,i)=>(
            <div key={i} style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:12,padding:"18px 20px",transition:"all .13s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--border3)";e.currentTarget.style.transform="translateY(-1px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.transform="translateY(0)";}}>
              <div style={{fontSize:22,fontFamily:"'Syne',sans-serif",fontWeight:800,color:"var(--text)",marginBottom:4}}>{k.val}</div>
              <div style={{fontSize:12,color:"var(--text2)",marginBottom:6}}>{k.label}</div>
              <div style={{fontSize:11,color:k.color,fontFamily:"'JetBrains Mono',monospace"}}>{k.delta}</div>
            </div>
          ))}
        </div>
        {/* Chart */}
        <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:12,padding:"20px 24px",marginBottom:24}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:"var(--text)"}}>Views — Last 30 Days</h3>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"var(--text3)"}}>48,291 total views</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={CHART_DATA} margin={{top:0,right:0,bottom:0,left:0}}>
              <defs><linearGradient id="vg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00ccf8" stopOpacity={0.25}/><stop offset="100%" stopColor="#00ccf8" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="day" tick={{fill:"#3e5a7a",fontSize:10,fontFamily:"'JetBrains Mono',monospace"}} tickLine={false} axisLine={false} interval={4}/>
              <YAxis hide/>
              <Tooltip contentStyle={{background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:8,color:"var(--text)",fontFamily:"'JetBrains Mono',monospace",fontSize:12}}/>
              <Area type="monotone" dataKey="views" stroke="#00ccf8" strokeWidth={2} fill="url(#vg)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Posts table */}
        <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:12,overflow:"hidden"}}>
          <div style={{padding:"16px 20px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:15,color:"var(--text)",marginRight:8}}>Posts</h3>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {filters.map(f=>(
                <button key={f} onClick={()=>setFilter(f)} style={{padding:"4px 10px",borderRadius:6,background:filter===f?"var(--bg5)":"transparent",color:filter===f?"var(--text)":"var(--text2)",fontSize:12,fontFamily:"'JetBrains Mono',monospace",border:filter===f?"1px solid var(--border3)":"1px solid transparent",transition:"all .13s",textTransform:"capitalize"}}>
                  {f}
                </button>
              ))}
            </div>
            <input placeholder="Search posts…" value={search} onChange={e=>setSearch(e.target.value)} style={{marginLeft:"auto",width:200,padding:"6px 10px",fontSize:12}}/>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{background:"var(--bg3)"}}>
                {["Title","Series","Status","Views","Updated","Actions"].map(h=>(
                  <th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:11,color:"var(--text3)",fontFamily:"'JetBrains Mono',monospace",fontWeight:600,borderBottom:"1px solid var(--border)"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p)=>(
                <tr key={p.id} style={{borderBottom:"1px solid var(--border)",transition:"background .13s",cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--bg3)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"12px 16px"}} onClick={()=>{setEditPost(p);setScreen("editor");}}>
                    <div style={{fontWeight:500,fontSize:13,color:"var(--text)",marginBottom:2}}>{p.title}</div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      {p.tags.slice(0,2).map(t=><span key={t} style={{fontSize:10,color:"var(--text3)",fontFamily:"'JetBrains Mono',monospace",background:"var(--bg4)",padding:"1px 5px",borderRadius:3}}>{t}</span>)}
                    </div>
                  </td>
                  <td style={{padding:"12px 16px"}}><span style={{fontSize:11,color:"var(--text2)",fontFamily:"'JetBrains Mono',monospace"}}>📚 {p.series}</span></td>
                  <td style={{padding:"12px 16px"}}><Badge variant={p.status}>{p.status}</Badge></td>
                  <td style={{padding:"12px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:13,color:"var(--text2)",fontFamily:"'JetBrains Mono',monospace"}}>{p.views>0?p.views.toLocaleString():"—"}</span>
                      {p.views>0&&<div style={{width:40,height:3,background:"var(--bg4)",borderRadius:2}}><div style={{width:`${Math.min(100,p.views/60)}%`,height:"100%",background:"var(--accent)",borderRadius:2}}/></div>}
                    </div>
                  </td>
                  <td style={{padding:"12px 16px",fontSize:11,color:"var(--text3)",fontFamily:"'JetBrains Mono',monospace"}}>{p.updated}</td>
                  <td style={{padding:"12px 16px"}}>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>{setEditPost(p);setScreen("editor");}} style={{background:"none",color:"var(--accent)",fontSize:11,fontFamily:"'JetBrains Mono',monospace",border:"none"}}>Edit</button>
                      <button onClick={()=>setScreen("post")} style={{background:"none",color:"var(--text3)",fontSize:11,fontFamily:"'JetBrains Mono',monospace",border:"none"}}>Preview</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// ─── EDITOR SUB-COMPONENTS ────────────────────────────────────
function CodeBlockEl({block,updateBlock,toast}) {
  const [copied,setCopied]=useState(false);
  const copyCode=()=>{navigator.clipboard?.writeText(block.content||"").catch(()=>{});setCopied(true);toast("Code copied!");setTimeout(()=>setCopied(false),1800);};
  const hl=(code)=>{
    if(!code)return "";
    return code.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/(\/\/[^\n]*)/g,'<span style="color:#546e7a;font-style:italic">$1</span>')
      .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,'<span style="color:#c3e88d">$1</span>')
      .replace(/\b(const|let|var|function|async|await|return|import|export|from|class|interface|type|extends|implements|new|this|if|else|for|while|try|catch|public|private|protected|override|static|readonly|abstract|void|null|undefined|true|false)\b/g,'<span style="color:#c792ea">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g,'<span style="color:#f78c6c">$1</span>')
      .replace(/\b([A-Z][a-zA-Z0-9]+)\b/g,'<span style="color:#00ccf8">$1</span>');
  };
  return (
    <div style={{background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:11,overflow:"hidden",margin:"4px 0"}}>
      <div style={{background:"var(--bg4)",borderBottom:"1px solid var(--border2)",padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}>
        <div style={{display:"flex",gap:5}}>{["#ff6b6b","#ffaa44","#00e5a0"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}</div>
        <select value={block.lang||"typescript"} onChange={e=>updateBlock(block.id,{lang:e.target.value})} style={{background:"rgba(0,204,248,.1)",color:"var(--accent)",border:"none",fontSize:10,fontFamily:"'JetBrains Mono',monospace",fontWeight:600,padding:"2px 6px",borderRadius:4,width:"auto",boxShadow:"none"}}>
          {["typescript","javascript","csharp","python","sql","bash","go","rust","yaml","json"].map(l=><option key={l} value={l}>{l}</option>)}
        </select>
        <input value={block.title||""} onChange={e=>updateBlock(block.id,{title:e.target.value})} style={{background:"transparent",border:"none",color:"var(--text3)",fontSize:11,fontFamily:"'JetBrains Mono',monospace",padding:0,width:120,boxShadow:"none"}} placeholder="filename…"/>
        <button onClick={copyCode} style={{marginLeft:"auto",background:"var(--bg5)",border:"1px solid var(--border2)",borderRadius:5,color:copied?"var(--green)":"var(--text2)",fontSize:11,fontFamily:"'JetBrains Mono',monospace",padding:"3px 8px"}}>{copied?"✓ Copied":"Copy"}</button>
      </div>
      <div style={{position:"relative"}}>
        <pre style={{padding:"14px 16px",fontFamily:"'JetBrains Mono',monospace",fontSize:13,lineHeight:1.76,color:"var(--text2)",overflow:"auto",minHeight:80}} dangerouslySetInnerHTML={{__html:hl(block.content||"")}}/>
        <div contentEditable suppressContentEditableWarning onInput={e=>updateBlock(block.id,{content:e.target.innerText})} style={{position:"absolute",inset:0,padding:"14px 16px",fontFamily:"'JetBrains Mono',monospace",fontSize:13,lineHeight:1.76,color:"transparent",caretColor:"var(--text)",outline:"none",overflow:"auto",whiteSpace:"pre"}}>{block.content||""}</div>
      </div>
    </div>
  );
}

function MermaidBlockEl({block,updateBlock}) {
  const [editing,setEditing]=useState(false);const ref=useRef(null);
  useEffect(()=>{
    if(!editing&&window.mermaid&&ref.current){
      ref.current.innerHTML="";
      const id=`mmd-${block.id.toString().replace(/\./g,"")}`;
      ref.current.innerHTML=`<div id="${id}">${block.code}</div>`;
      try{window.mermaid.init(undefined,`#${id}`);}catch(e){ref.current.innerHTML=`<span style="color:var(--red);font-size:12px;font-family:'JetBrains Mono',monospace">Parse error: ${e.message||"invalid syntax"}</span>`;}
    }
  },[block.code,editing]);
  useEffect(()=>{
    if(!window.mermaid){
      const s=document.createElement("script");
      s.src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.6.1/mermaid.min.js";
      s.onload=()=>{window.mermaid.initialize({startOnLoad:false,theme:"dark",themeVariables:{primaryColor:"#0d1117",primaryTextColor:"#d8e8f8",primaryBorderColor:"#00ccf8",lineColor:"#00ccf8",secondaryColor:"#172030",edgeLabelBackground:"#0c1018"}});};
      document.head.appendChild(s);
    }
  },[]);
  return (
    <div style={{background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:11,overflow:"hidden",margin:"4px 0"}}>
      <div style={{background:"var(--bg4)",borderBottom:"1px solid var(--border2)",padding:"7px 12px",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"var(--purple)",fontWeight:700,background:"rgba(176,138,255,.1)",padding:"2px 7px",borderRadius:4}}>◇ MERMAID</span>
        <input value={block.title||"Diagram"} onChange={e=>updateBlock(block.id,{title:e.target.value})} style={{background:"transparent",border:"none",color:"var(--text3)",fontSize:11,fontFamily:"'JetBrains Mono',monospace",padding:0,width:120,boxShadow:"none"}}/>
        <button onClick={()=>setEditing(e=>!e)} style={{marginLeft:"auto",background:"none",color:"var(--accent)",fontSize:11,fontFamily:"'JetBrains Mono',monospace",border:"1px solid rgba(0,204,248,.2)",borderRadius:5,padding:"3px 8px"}}>{editing?"✓ Render":"✏ Edit"}</button>
      </div>
      {editing?(
        <textarea value={block.code||""} onChange={e=>updateBlock(block.id,{code:e.target.value})} rows={8} style={{background:"var(--bg3)",border:"none",borderRadius:0,fontFamily:"'JetBrains Mono',monospace",fontSize:12,lineHeight:1.6,color:"var(--text2)",resize:"vertical",padding:"12px 16px"}}/>
      ):(
        <div ref={ref} style={{padding:"20px",minHeight:120,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text2)",fontSize:13}}>
          {!window.mermaid&&<span style={{color:"var(--text3)",fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>⟳ Loading Mermaid…</span>}
        </div>
      )}
    </div>
  );
}

function ChartBlockEl({block,updateBlock}) {
  const [ct,setCt]=useState(block.chartType||"bar");
  return (
    <div style={{background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:11,overflow:"hidden",margin:"4px 0"}}>
      <div style={{background:"var(--bg4)",borderBottom:"1px solid var(--border2)",padding:"7px 12px",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"var(--blue)",fontWeight:700,background:"rgba(90,171,255,.1)",padding:"2px 7px",borderRadius:4}}>📊 CHART</span>
        <input value={block.title||""} onChange={e=>updateBlock(block.id,{title:e.target.value})} style={{background:"transparent",border:"none",color:"var(--text3)",fontSize:11,fontFamily:"'JetBrains Mono',monospace",padding:0,width:140,boxShadow:"none"}} placeholder="Chart title…"/>
        <div style={{marginLeft:"auto",display:"flex",gap:4}}>
          {["bar","line","area"].map(t=>(
            <button key={t} onClick={()=>{setCt(t);updateBlock(block.id,{chartType:t});}} style={{padding:"3px 8px",borderRadius:5,background:ct===t?"var(--bg5)":"transparent",color:ct===t?"var(--text)":"var(--text3)",fontSize:10,fontFamily:"'JetBrains Mono',monospace",border:ct===t?"1px solid var(--border3)":"none"}}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{padding:"16px",background:"var(--bg3)"}}>
        <ResponsiveContainer width="100%" height={180}>
          {ct==="area"?(
            <AreaChart data={block.data||[]} margin={{top:0,right:0,bottom:0,left:0}}>
              <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00ccf8" stopOpacity={0.3}/><stop offset="100%" stopColor="#00ccf8" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="name" tick={{fill:"#3e5a7a",fontSize:10,fontFamily:"'JetBrains Mono',monospace"}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:12}}/>
              <Area type="monotone" dataKey="value" stroke="#00ccf8" strokeWidth={2} fill="url(#cg)"/>
            </AreaChart>
          ):ct==="line"?(
            <LineChart data={block.data||[]} margin={{top:0,right:0,bottom:0,left:0}}>
              <XAxis dataKey="name" tick={{fill:"#3e5a7a",fontSize:10,fontFamily:"'JetBrains Mono',monospace"}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:12}}/>
              <Line type="monotone" dataKey="value" stroke="#00ccf8" strokeWidth={2} dot={{fill:"#00ccf8",r:4}}/>
            </LineChart>
          ):(
            <BarChart data={block.data||[]} margin={{top:0,right:0,bottom:0,left:0}}>
              <XAxis dataKey="name" tick={{fill:"#3e5a7a",fontSize:10,fontFamily:"'JetBrains Mono',monospace"}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:12}}/>
              <Bar dataKey="value" fill="#00ccf8" radius={[4,4,0,0]}/>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TableBlockEl({block,updateBlock}) {
  const {headers=[],rows=[]}=block;
  const addRow=()=>updateBlock(block.id,{rows:[...rows,Array(headers.length).fill("")]});
  const addCol=()=>updateBlock(block.id,{headers:[...headers,"Column"],rows:rows.map(r=>[...r,""])});
  const updateCell=(ri,ci,val)=>{const nr=[...rows];nr[ri]=[...nr[ri]];nr[ri][ci]=val;updateBlock(block.id,{rows:nr});};
  return (
    <div style={{margin:"4px 0",border:"1px solid var(--border2)",borderRadius:10,overflow:"hidden"}}>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{headers.map((h,ci)=>(
            <th key={ci} style={{padding:"8px 12px",textAlign:"left",background:"var(--bg4)",borderBottom:"1px solid var(--border2)",fontSize:12,fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:"var(--text2)"}}>
              <div contentEditable suppressContentEditableWarning onInput={e=>{const nh=[...headers];nh[ci]=e.target.innerText;updateBlock(block.id,{headers:nh});}} style={{outline:"none",minWidth:60}}>{h}</div>
            </th>
          ))}</tr></thead>
          <tbody>{rows.map((row,ri)=>(
            <tr key={ri} style={{borderBottom:"1px solid var(--border)"}}>
              {row.map((cell,ci)=>(
                <td key={ci} style={{padding:"8px 12px",fontSize:13,color:"var(--text2)"}}>
                  <div contentEditable suppressContentEditableWarning onInput={e=>updateCell(ri,ci,e.target.innerText)} style={{outline:"none",minWidth:60}}>{cell}</div>
                </td>
              ))}
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div style={{display:"flex",gap:8,padding:"8px 12px",borderTop:"1px solid var(--border)",background:"var(--bg3)"}}>
        <button onClick={addRow} style={{background:"none",color:"var(--text3)",fontSize:11,fontFamily:"'JetBrains Mono',monospace",border:"1px solid var(--border2)",borderRadius:5,padding:"3px 8px"}}>+ Row</button>
        <button onClick={addCol} style={{background:"none",color:"var(--text3)",fontSize:11,fontFamily:"'JetBrains Mono',monospace",border:"1px solid var(--border2)",borderRadius:5,padding:"3px 8px"}}>+ Column</button>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────
// SCREEN 5 — TEMPLATES
// ─────────────────────────────────────────────────────────────
function TemplatesScreen({ setScreen, toast }) {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const cats = ["All","Tutorial","Deep Dive","Series Intro","Architecture","Retrospective","Interview Prep","Announcement"];
  const filtered = TEMPLATES.filter(t => {
    const matchCat = cat === "All" || t.category === cat;
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  return (
    <div style={{ flex:1, overflowY:"auto", background:"var(--bg)" }}>
      <div style={{ padding:"28px 32px", borderBottom:"1px solid var(--border)" }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:26, color:"var(--text)", letterSpacing:"-0.5px", marginBottom:6 }}>Start with a template</h1>
        <p style={{ color:"var(--text2)", fontSize:14 }}>Professionally designed structures for every type of technical content.</p>
      </div>
      <div style={{ padding:"20px 32px" }}>
        <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap", alignItems:"center" }}>
          <input placeholder="Search templates…" value={search} onChange={e=>setSearch(e.target.value)} style={{ width:240, padding:"8px 12px", fontSize:13 }} />
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {cats.map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{ padding:"5px 12px", borderRadius:16, background:cat===c?"var(--bg5)":"var(--bg2)", border:cat===c?"1px solid var(--border3)":"1px solid var(--border)", color:cat===c?"var(--text)":"var(--text2)", fontSize:12, fontFamily:"'JetBrains Mono',monospace", transition:"all .13s" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
          {filtered.map(tmpl=>(
            <div key={tmpl.id} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:14, overflow:"hidden", transition:"all .13s", cursor:"pointer" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=tmpl.color; e.currentTarget.style.transform="translateY(-2px)"; const btn=e.currentTarget.querySelector(".use-btn"); if(btn)btn.style.opacity="1"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="translateY(0)"; const btn=e.currentTarget.querySelector(".use-btn"); if(btn)btn.style.opacity="0"; }}>
              <div style={{ background:"var(--bg3)", borderBottom:"1px solid var(--border)", padding:"16px 18px", height:110, display:"flex", flexDirection:"column", gap:6, overflow:"hidden" }}>
                <div style={{ width:"85%", height:8, background:tmpl.color+"30", borderRadius:4, borderLeft:"3px solid "+tmpl.color }} />
                <div style={{ display:"flex", flexDirection:"column", gap:5 }}>{[90,70,80,60].map((w,i)=><div key={i} style={{ width:w+"%", height:5, background:"var(--bg4)", borderRadius:3 }} />)}</div>
                <div style={{ display:"flex", gap:5 }}>
                  <div style={{ flex:1, height:22, background:"var(--bg4)", borderRadius:6, borderLeft:"2px solid "+tmpl.color }} />
                  <div style={{ flex:1, height:22, background:"var(--bg4)", borderRadius:6 }} />
                </div>
              </div>
              <div style={{ padding:"16px 18px" }}>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:"var(--text)", marginBottom:8 }}>{tmpl.name}</h3>
                <div style={{ display:"flex", gap:6, marginBottom:8 }}>
                  <span style={{ fontSize:10, color:tmpl.color, background:tmpl.color+"15", border:"1px solid "+tmpl.color+"30", borderRadius:4, padding:"1px 7px", fontFamily:"'JetBrains Mono',monospace" }}>{tmpl.category}</span>
                  <span style={{ fontSize:10, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace" }}>{tmpl.blocks} blocks</span>
                </div>
                <p style={{ fontSize:12, color:"var(--text2)", lineHeight:1.5, marginBottom:12 }}>{tmpl.desc}</p>
                <button className="use-btn" onClick={()=>{ toast("Template applied!"); setScreen("editor"); }} style={{ background:tmpl.color, color:"#000", border:"none", borderRadius:7, padding:"7px 14px", fontSize:12, fontFamily:"'JetBrains Mono',monospace", fontWeight:600, opacity:0, transition:"opacity .15s", width:"100%", cursor:"pointer" }}>Use template →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 6 — SETTINGS
// ─────────────────────────────────────────────────────────────
function SettingsScreen({ toast }) {
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState({ ...MOCK_USER });
  const [domain, setDomain] = useState("");
  const [dnsStep, setDnsStep] = useState(0);
  const [apiKeys, setApiKeys] = useState([
    { id:1, name:"abhishekpanda.com", prefix:"sk_live_••••••3f2a", perms:["read"], lastUsed:"2 min ago", expires:"Never" },
    { id:2, name:"Vercel ISR", prefix:"sk_live_••••••8c1b", perms:["read","write"], lastUsed:"1 hour ago", expires:"2027-01-01" },
    { id:3, name:"Local dev", prefix:"sk_live_••••••4e9d", perms:["admin"], lastUsed:"3 days ago", expires:"Never" },
  ]);
  const [webhooks] = useState([
    { id:1, name:"Vercel Rebuild", url:"https://api.vercel.com/v1/dep...", events:["post.published"], lastTrigger:"5 min ago", status:200 },
    { id:2, name:"Slack Notify", url:"https://hooks.slack.com/servic...", events:["post.*"], lastTrigger:"1 hour ago", status:200 },
    { id:3, name:"CDN Purge", url:"https://api.cloudflare.com/...", events:["post.updated"], lastTrigger:"2 days ago", status:429 },
  ]);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showWHModal, setShowWHModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState(null);

  const navItems = [
    { key:"profile", icon:"👤", label:"Profile" },
    { key:"domain", icon:"🌐", label:"Domain & Publishing" },
    { key:"api", icon:"🔌", label:"API Keys" },
    { key:"webhooks", icon:"🔄", label:"Webhooks" },
    { key:"billing", icon:"💳", label:"Billing" },
    { key:"security", icon:"🔐", label:"Security" },
    { key:"team", icon:"👥", label:"Team" },
  ];

  const createKey = () => {
    const key = "sk_live_"+Math.random().toString(36).slice(2,18);
    setCreatedKey(key);
    setApiKeys(ks=>[...ks, { id:Date.now(), name:newKeyName||"New Key", prefix:key.slice(0,-4)+"••••", perms:["read"], lastUsed:"Never", expires:"Never" }]);
  };

  return (
    <div style={{ flex:1, display:"flex", overflow:"hidden", background:"var(--bg)" }}>
      <div style={{ width:220, background:"var(--bg2)", borderRight:"1px solid var(--border)", padding:"20px 12px", flexShrink:0 }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, color:"var(--text)", padding:"0 8px", marginBottom:14 }}>Settings</h2>
        {navItems.map(item=>(
          <button key={item.key} onClick={()=>setTab(item.key)} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:8, background:tab===item.key?"var(--bg5)":"transparent", color:tab===item.key?"var(--text)":"var(--text2)", width:"100%", textAlign:"left", fontSize:13, fontFamily:"'Instrument Sans',sans-serif", fontWeight:tab===item.key?600:400, border:tab===item.key?"1px solid var(--border3)":"1px solid transparent", marginBottom:2, transition:"all .13s" }}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"28px 36px" }}>
        {tab==="profile" && (
          <div style={{ maxWidth:580 }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, color:"var(--text)", marginBottom:24 }}>Profile</h2>
            <div style={{ display:"flex", gap:20, marginBottom:24, alignItems:"center" }}>
              <Avatar name={profile.name} size="lg" />
              <div><Btn variant="ghost" size="sm">Upload photo</Btn><p style={{ fontSize:11, color:"var(--text3)", marginTop:6, fontFamily:"'JetBrains Mono',monospace" }}>JPG or PNG · Max 2MB</p></div>
            </div>
            {[
              { label:"Display name", key:"name", placeholder:"Abhishek Panda" },
              { label:"Username", key:"username", placeholder:"abhishekpanda", hint:"scribe.dev/"+profile.username },
              { label:"Email", key:"email", placeholder:"you@example.com" },
              { label:"Website URL", key:"website", placeholder:"https://yoursite.com" },
              { label:"Twitter / X", key:"twitter", placeholder:"@handle" },
              { label:"GitHub", key:"github", placeholder:"@username" },
            ].map(({ label, key, placeholder, hint })=>(
              <div key={key} style={{ marginBottom:16 }}>
                <label style={{ display:"block", fontSize:12, color:"var(--text2)", fontFamily:"'JetBrains Mono',monospace", fontWeight:500, marginBottom:5 }}>{label}</label>
                <input value={profile[key]||""} onChange={e=>setProfile(p=>({...p,[key]:e.target.value}))} placeholder={placeholder} style={{ fontSize:13 }} />
                {hint && <p style={{ fontSize:11, color:"var(--accent)", fontFamily:"'JetBrains Mono',monospace", marginTop:4 }}>→ {hint}</p>}
              </div>
            ))}
            <div style={{ marginBottom:20 }}>
              <label style={{ display:"block", fontSize:12, color:"var(--text2)", fontFamily:"'JetBrains Mono',monospace", fontWeight:500, marginBottom:5 }}>Bio <span style={{ color:"var(--text3)" }}>{(profile.bio||"").length}/200</span></label>
              <textarea value={profile.bio||""} onChange={e=>setProfile(p=>({...p,bio:e.target.value}))} rows={3} style={{ fontSize:13, resize:"vertical" }} maxLength={200} />
            </div>
            <Btn variant="primary" onClick={()=>toast("Profile saved ✓")}>Save changes</Btn>
          </div>
        )}
        {tab==="domain" && (
          <div style={{ maxWidth:580 }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, color:"var(--text)", marginBottom:24 }}>Domain & Publishing</h2>
            <div style={{ background:"var(--bg2)", border:"1px solid var(--border2)", borderRadius:12, padding:"16px 20px", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:"var(--accent)" }}>abhishekpanda.scribe.dev</p>
                <p style={{ fontSize:11, color:"var(--text3)", marginTop:3 }}>Default subdomain</p>
              </div>
              <Badge variant="published">Active ✅</Badge>
            </div>
            <div style={{ background:"var(--bg2)", border:"1px solid var(--border2)", borderRadius:12, padding:20, marginBottom:20 }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:"var(--text)", marginBottom:4 }}>Connect your own domain</h3>
              <p style={{ fontSize:12, color:"var(--text2)", marginBottom:14 }}>SSL included, zero config.</p>
              <div style={{ display:"flex", gap:10 }}>
                <input value={domain} onChange={e=>setDomain(e.target.value)} placeholder="blog.abhishekpanda.com" style={{ flex:1, fontSize:13 }} />
                <Btn variant="primary" size="sm" onClick={()=>{ if(domain){setDnsStep(1); toast("Domain added! Configure DNS below.");}}}>Connect →</Btn>
              </div>
              {dnsStep > 0 && (
                <div style={{ marginTop:20, display:"flex", flexDirection:"column", gap:14 }}>
                  {[
                    { label:"Add DNS record", done:true, content:<span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"var(--accent)" }}>CNAME {domain} → sites.scribe.dev</span> },
                    { label:"SSL Certificate", badge:"⏳ Provisioning", content:"Let's Encrypt · auto-renewal · usually <5 min" },
                    { label:"Domain verified", badge:"⏳ Waiting", content:<Btn variant="ghost" size="sm" onClick={()=>toast("Checking DNS…")}>Check DNS status</Btn> },
                  ].map((step,i)=>(
                    <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                      <div style={{ width:24, height:24, borderRadius:"50%", border:"2px solid "+(step.done?"var(--green)":"var(--border3)"), background:step.done?"rgba(0,229,160,.1)":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
                        <span style={{ fontSize:11, color:step.done?"var(--green)":"var(--text3)" }}>{step.done?"✓":i+1}</span>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", gap:8, marginBottom:4, alignItems:"center" }}>
                          <span style={{ fontSize:13, color:"var(--text)", fontWeight:500 }}>Step {i+1}: {step.label}</span>
                          {step.done && <Badge variant="published">Done ✅</Badge>}
                          {step.badge && <Badge variant="scheduled">{step.badge}</Badge>}
                        </div>
                        <div style={{ fontSize:12, color:"var(--text2)" }}>{step.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ marginBottom:20 }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:"var(--text)", marginBottom:12 }}>Blog Appearance</h3>
              <label style={{ display:"block", fontSize:12, color:"var(--text2)", fontFamily:"'JetBrains Mono',monospace", fontWeight:500, marginBottom:8 }}>Accent color</label>
              <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                {["#00ccf8","#b08aff","#00e5a0","#5aabff","#ff6b6b","#ffaa44","#f472b6","#ffd166"].map(c=>(
                  <div key={c} style={{ width:28, height:28, borderRadius:"50%", background:c, cursor:"pointer", border:"2px solid transparent", transition:"border-color .13s" }}
                    onMouseEnter={e=>e.currentTarget.style.border="2px solid white"}
                    onMouseLeave={e=>e.currentTarget.style.border="2px solid transparent"} />
                ))}
              </div>
            </div>
            <Btn variant="primary" onClick={()=>toast("Settings saved ✓")}>Save settings</Btn>
          </div>
        )}
        {tab==="api" && (
          <div style={{ maxWidth:700 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
              <div>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, color:"var(--text)", marginBottom:4 }}>REST API Keys</h2>
                <p style={{ fontSize:12, color:"var(--text2)" }}>Use these to fetch your content from any frontend.</p>
              </div>
              <Btn variant="primary" size="sm" onClick={()=>setShowKeyModal(true)}>+ Create new API key</Btn>
            </div>
            <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:10, marginBottom:20, padding:"12px 16px", display:"flex", gap:24 }}>
              <div><div style={{ fontSize:11, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace", marginBottom:3 }}>Base URL</div><div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"var(--accent)" }}>https://api.scribe.dev/v1</div></div>
              <div><div style={{ fontSize:11, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace", marginBottom:3 }}>Workspace</div><div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"var(--text)" }}>abhishekpanda</div></div>
            </div>
            <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:10, overflow:"hidden", marginBottom:20 }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr style={{ background:"var(--bg3)" }}>
                  {["Name","Key","Permissions","Last Used","Expires",""].map((h,i)=><th key={i} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace", borderBottom:"1px solid var(--border)" }}>{h}</th>)}
                </tr></thead>
                <tbody>{apiKeys.map(k=>(
                  <tr key={k.id} style={{ borderBottom:"1px solid var(--border)" }}>
                    <td style={{ padding:"12px 14px", fontSize:13, color:"var(--text)", fontWeight:500 }}>{k.name}</td>
                    <td style={{ padding:"12px 14px", fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"var(--text2)" }}>{k.prefix}</td>
                    <td style={{ padding:"12px 14px" }}><div style={{ display:"flex", gap:4 }}>{k.perms.map(p=><Badge key={p} variant="pro" style={{ fontSize:"9px" }}>{p}</Badge>)}</div></td>
                    <td style={{ padding:"12px 14px", fontSize:12, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace" }}>{k.lastUsed}</td>
                    <td style={{ padding:"12px 14px", fontSize:12, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace" }}>{k.expires}</td>
                    <td style={{ padding:"12px 14px" }}><button onClick={()=>{ setApiKeys(ks=>ks.filter(x=>x.id!==k.id)); toast("Key revoked"); }} style={{ background:"rgba(255,107,107,.1)", color:"var(--red)", border:"1px solid rgba(255,107,107,.2)", borderRadius:5, fontSize:11, fontFamily:"'JetBrains Mono',monospace", padding:"3px 8px", cursor:"pointer" }}>Revoke</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            {showKeyModal && (
              <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:800 }} onClick={()=>{ if(!createdKey)setShowKeyModal(false); }}>
                <div style={{ background:"var(--bg2)", border:"1px solid var(--border2)", borderRadius:14, padding:28, width:420, animation:"fadeIn .2s ease" }} onClick={e=>e.stopPropagation()}>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, color:"var(--text)", marginBottom:20 }}>{createdKey?"Your new API key":"Create API Key"}</h3>
                  {createdKey ? (
                    <div>
                      <div style={{ background:"rgba(255,170,68,.07)", border:"1px solid rgba(255,170,68,.3)", borderRadius:8, padding:12, marginBottom:14 }}>
                        <p style={{ fontSize:11, color:"var(--orange)", fontFamily:"'JetBrains Mono',monospace", marginBottom:8 }}>⚠ Copy now — won't be shown again</p>
                        <code style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"var(--green)", wordBreak:"break-all" }}>{createdKey}</code>
                      </div>
                      <Btn variant="primary" style={{ width:"100%", justifyContent:"center" }} onClick={()=>{ setShowKeyModal(false); setCreatedKey(null); setNewKeyName(""); }}>Done</Btn>
                    </div>
                  ) : (
                    <div>
                      <div style={{ marginBottom:14 }}>
                        <label style={{ display:"block", fontSize:12, color:"var(--text2)", fontFamily:"'JetBrains Mono',monospace", marginBottom:5 }}>NAME</label>
                        <input value={newKeyName} onChange={e=>setNewKeyName(e.target.value)} placeholder="e.g. My Next.js site" style={{ fontSize:13 }} />
                      </div>
                      <div style={{ marginBottom:20 }}>
                        <label style={{ display:"block", fontSize:12, color:"var(--text2)", fontFamily:"'JetBrains Mono',monospace", marginBottom:8 }}>PERMISSIONS</label>
                        <div style={{ display:"flex", gap:12 }}>{["read","write","admin"].map(p=>(<label key={p} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"var(--text2)", cursor:"pointer" }}><input type="checkbox" defaultChecked={p==="read"} /> {p}</label>))}</div>
                      </div>
                      <div style={{ display:"flex", gap:10 }}>
                        <Btn variant="ghost" onClick={()=>setShowKeyModal(false)} style={{ flex:1, justifyContent:"center" }}>Cancel</Btn>
                        <Btn variant="primary" onClick={createKey} style={{ flex:1, justifyContent:"center" }}>Create key</Btn>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {tab==="webhooks" && (
          <div style={{ maxWidth:700 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
              <div>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, color:"var(--text)", marginBottom:4 }}>Webhooks</h2>
                <p style={{ fontSize:12, color:"var(--text2)" }}>Automatically notify your infrastructure when content changes.</p>
              </div>
              <Btn variant="primary" size="sm" onClick={()=>setShowWHModal(true)}>+ Add Webhook</Btn>
            </div>
            <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:10, overflow:"hidden", marginBottom:24 }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr style={{ background:"var(--bg3)" }}>{["Name","URL","Events","Last Trigger","Status"].map(h=><th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace", borderBottom:"1px solid var(--border)" }}>{h}</th>)}</tr></thead>
                <tbody>{webhooks.map(w=>(
                  <tr key={w.id} style={{ borderBottom:"1px solid var(--border)" }}>
                    <td style={{ padding:"12px 14px", fontSize:13, color:"var(--text)", fontWeight:500 }}>{w.name}</td>
                    <td style={{ padding:"12px 14px", fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"var(--text3)", maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{w.url}</td>
                    <td style={{ padding:"12px 14px" }}><div style={{ display:"flex", gap:4 }}>{w.events.map(e=><Badge key={e} variant="review" style={{ fontSize:"9px" }}>{e}</Badge>)}</div></td>
                    <td style={{ padding:"12px 14px", fontSize:12, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace" }}>{w.lastTrigger}</td>
                    <td style={{ padding:"12px 14px" }}><Badge variant={w.status===200?"published":"draft"}>{w.status===200?"✅ 200":"⚠️ "+w.status}</Badge></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            {showWHModal && (
              <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:800 }} onClick={()=>setShowWHModal(false)}>
                <div style={{ background:"var(--bg2)", border:"1px solid var(--border2)", borderRadius:14, padding:28, width:440, animation:"fadeIn .2s ease" }} onClick={e=>e.stopPropagation()}>
                  <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, color:"var(--text)", marginBottom:20 }}>Add Webhook</h3>
                  {[["Webhook name","e.g. Vercel Rebuild"],["Endpoint URL","https://api.vercel.com/..."]].map(([label,ph])=>(
                    <div key={label} style={{ marginBottom:14 }}>
                      <label style={{ display:"block", fontSize:12, color:"var(--text2)", fontFamily:"'JetBrains Mono',monospace", marginBottom:5 }}>{label.toUpperCase()}</label>
                      <input placeholder={ph} style={{ fontSize:13 }} />
                    </div>
                  ))}
                  <div style={{ marginBottom:16 }}>
                    <label style={{ display:"block", fontSize:12, color:"var(--text2)", fontFamily:"'JetBrains Mono',monospace", marginBottom:8 }}>EVENTS</label>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                      {["post.published","post.updated","post.deleted","post.scheduled","series.created","media.uploaded"].map(ev=>(
                        <label key={ev} style={{ display:"flex", alignItems:"center", gap:7, fontSize:12, color:"var(--text2)", cursor:"pointer", fontFamily:"'JetBrains Mono',monospace" }}><input type="checkbox" /> {ev}</label>
                      ))}
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:10 }}>
                    <Btn variant="ghost" onClick={()=>setShowWHModal(false)} style={{ flex:1, justifyContent:"center" }}>Cancel</Btn>
                    <Btn variant="ghost" style={{ flex:1, justifyContent:"center" }} onClick={()=>toast("Test sent!")}>Test</Btn>
                    <Btn variant="primary" onClick={()=>{ setShowWHModal(false); toast("Webhook saved!"); }} style={{ flex:1, justifyContent:"center" }}>Save</Btn>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {(tab==="billing"||tab==="security"||tab==="team") && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 20px", gap:12 }}>
            <span style={{ fontSize:48 }}>{tab==="billing"?"💳":tab==="security"?"🔐":"👥"}</span>
            <span style={{ color:"var(--text2)", fontSize:16, fontFamily:"'Syne',sans-serif", fontWeight:700, textTransform:"capitalize" }}>{tab}</span>
            <span style={{ color:"var(--text3)", fontSize:12, fontFamily:"'JetBrains Mono',monospace" }}>Coming soon in the production build.</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 7 — PUBLIC BLOG
// ─────────────────────────────────────────────────────────────
function BlogScreen({ setScreen }) {
  const seriesList = [
    { name:"C# Mastery", icon:"🎯", chapters:24, desc:"Deep dive into C# patterns, performance, CLR internals.", progress:75, color:"var(--accent)" },
    { name:"Cloud Architecture", icon:"☁️", chapters:12, desc:"Microservices, K8s, distributed systems with .NET.", progress:30, color:"var(--blue)" },
    { name:"Frontend Mastery", icon:"⚡", chapters:8, desc:"Modern React, Next.js, TypeScript and performance.", progress:0, color:"var(--purple)" },
  ];
  const published = MOCK_POSTS.filter(p=>p.status==="published");
  return (
    <div style={{ background:"var(--bg)", minHeight:"100vh" }}>
      <nav style={{ position:"sticky", top:0, zIndex:100, background:"rgba(7,9,14,.9)", backdropFilter:"blur(12px)", borderBottom:"1px solid var(--border)", padding:"0 48px", display:"flex", alignItems:"center", height:56, gap:32 }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:17, color:"var(--text)" }}>Abhishek Panda</h1>
        <div style={{ display:"flex", gap:20, marginLeft:24 }}>
          {["Series","About"].map(item=>(<button key={item} style={{ background:"none", color:"var(--text2)", fontSize:13, fontFamily:"'Instrument Sans',sans-serif", border:"none", cursor:"pointer" }} onMouseEnter={e=>e.currentTarget.style.color="var(--text)"} onMouseLeave={e=>e.currentTarget.style.color="var(--text2)"}>{item}</button>))}
        </div>
        <Btn variant="primary" size="sm" style={{ marginLeft:"auto" }}>Subscribe →</Btn>
      </nav>
      <section style={{ padding:"56px 48px 40px", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ display:"flex", gap:32, alignItems:"flex-start", marginBottom:8 }}>
          <Avatar name={MOCK_USER.name} size="lg" />
          <div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:38, color:"var(--text)", letterSpacing:"-1px", marginBottom:8 }}>{MOCK_USER.name}</h1>
            <p style={{ fontSize:15, color:"var(--text2)", lineHeight:1.7, maxWidth:540, marginBottom:16 }}>{MOCK_USER.bio}</p>
            <div style={{ display:"flex", gap:20, marginBottom:16 }}>
              {[["24","posts"],["2,400+","readers"],["3","series"]].map(([n,l])=>(<div key={l}><span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, color:"var(--text)" }}>{n}</span> <span style={{ color:"var(--text3)", fontSize:13 }}>{l}</span></div>))}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              {[["GitHub",MOCK_USER.github],["Twitter",MOCK_USER.twitter],["Website",MOCK_USER.website]].map(([platform])=>(<a key={platform} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"var(--text2)", background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:6, padding:"4px 10px" }}>{platform}</a>))}
            </div>
          </div>
        </div>
      </section>
      <section style={{ padding:"0 48px 48px", maxWidth:1100, margin:"0 auto" }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, color:"var(--text)", letterSpacing:"-0.5px", marginBottom:18 }}>Series</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:48 }}>
          {seriesList.map((s,i)=>(
            <div key={i} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:14, padding:22, cursor:"pointer", transition:"all .13s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor=s.color; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="translateY(0)"; }}>
              <span style={{ fontSize:26, display:"block", marginBottom:12 }}>{s.icon}</span>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:"var(--text)", marginBottom:6 }}>{s.name}</h3>
              <p style={{ fontSize:12, color:"var(--text2)", lineHeight:1.6, marginBottom:12 }}>{s.desc}</p>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"var(--text3)" }}>{s.chapters} chapters</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:s.color }}>{s.progress}% read</span>
              </div>
              <div style={{ height:3, background:"var(--bg4)", borderRadius:2 }}><div style={{ width:s.progress+"%", height:"100%", background:s.color, borderRadius:2 }} /></div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, color:"var(--text)", letterSpacing:"-0.5px" }}>Recent Posts</h2>
        </div>
        {published[0] && (
          <div onClick={()=>setScreen("post")} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:16, padding:28, marginBottom:18, cursor:"pointer", transition:"all .13s" }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--border3)"; e.currentTarget.style.transform="translateY(-2px)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="translateY(0)"; }}>
            <div style={{ display:"flex", gap:10, marginBottom:12, flexWrap:"wrap" }}>
              <Badge variant="published">✨ Featured</Badge>
              <span style={{ fontSize:12, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace" }}>📚 {published[0].series} · Ch.{published[0].chapter}</span>
              <Badge variant={published[0].difficulty}>{published[0].difficulty}</Badge>
              <span style={{ fontSize:12, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace" }}>~{published[0].readTime}</span>
            </div>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24, color:"var(--text)", letterSpacing:"-0.5px", marginBottom:10 }}>{published[0].title}</h3>
            <p style={{ color:"var(--text2)", fontSize:14, lineHeight:1.7, marginBottom:14 }}>{published[0].excerpt}</p>
            <div style={{ display:"flex", gap:6 }}>{published[0].tags.map(t=><span key={t} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"var(--text3)", background:"var(--bg3)", border:"1px solid var(--border)", padding:"2px 7px", borderRadius:4 }}>{t}</span>)}</div>
          </div>
        )}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {published.slice(1).map(p=>(
            <div key={p.id} onClick={()=>setScreen("post")} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:14, padding:20, cursor:"pointer", transition:"all .13s" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--border3)"; e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.transform="translateY(0)"; }}>
              <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                <span style={{ fontSize:11, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace" }}>📚 {p.series}</span>
                <Badge variant={p.difficulty}>{p.difficulty}</Badge>
              </div>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16, color:"var(--text)", marginBottom:8, lineHeight:1.4 }}>{p.title}</h3>
              <p style={{ color:"var(--text2)", fontSize:12, lineHeight:1.6, marginBottom:12 }}>{p.excerpt.slice(0,100)}…</p>
              <div style={{ display:"flex", gap:10 }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"var(--text3)" }}>~{p.readTime}</span>
                <span style={{ color:"var(--text4)" }}>·</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"var(--text3)" }}>{p.views.toLocaleString()} views</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 8 — PUBLIC POST VIEW
// ─────────────────────────────────────────────────────────────
function PostScreen({ post, setScreen }) {
  const p = post || MOCK_POSTS[0];
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(()=>{
    const onScroll = () => { const el=document.documentElement; setScrollProgress(Math.min(100,(el.scrollTop/(el.scrollHeight-el.clientHeight))*100||0)); };
    window.addEventListener("scroll", onScroll);
    return ()=>window.removeEventListener("scroll", onScroll);
  }, []);
  const headings = ["Understanding the State Machine","The Compiler Transformation","Execution Flow","Performance Implications","Conclusion"];
  return (
    <div style={{ background:"var(--bg)", minHeight:"100vh" }}>
      <div style={{ position:"fixed", top:0, left:0, height:2, background:"var(--accent)", width:scrollProgress+"%", zIndex:1000, transition:"width .1s" }} />
      <nav style={{ position:"sticky", top:0, zIndex:100, background:"rgba(7,9,14,.9)", backdropFilter:"blur(12px)", borderBottom:"1px solid var(--border)", padding:"0 48px", display:"flex", alignItems:"center", height:54, gap:16 }}>
        <button onClick={()=>setScreen("blog")} style={{ background:"none", color:"var(--text2)", fontSize:13, fontFamily:"'Instrument Sans',sans-serif", border:"none", cursor:"pointer" }}>← Abhishek Panda</button>
        <span style={{ color:"var(--border2)" }}>·</span>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"var(--text3)" }}>📚 {p.series} · Ch.{p.chapter}</span>
        <Btn variant="ghost" size="sm" style={{ marginLeft:"auto" }}>Subscribe</Btn>
      </nav>
      <div style={{ maxWidth:1160, margin:"0 auto", padding:"40px 32px", display:"grid", gridTemplateColumns:"220px 1fr 220px", gap:40 }}>
        <div style={{ position:"sticky", top:72, height:"fit-content" }}>
          <div style={{ fontSize:10, color:"var(--text4)", fontFamily:"'JetBrains Mono',monospace", fontWeight:600, letterSpacing:"1px", marginBottom:10 }}>TABLE OF CONTENTS</div>
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {headings.map((h,i)=>(
              <button key={i} style={{ textAlign:"left", background:i===1?"rgba(0,204,248,.06)":"transparent", color:i===1?"var(--accent)":"var(--text2)", fontSize:12, fontFamily:"'Instrument Sans',sans-serif", padding:"5px 8px", borderLeft:i===1?"2px solid var(--accent)":"2px solid transparent", border:"none", cursor:"pointer", lineHeight:1.4 }}>{h}</button>
            ))}
          </div>
          <div style={{ marginTop:24, borderTop:"1px solid var(--border)", paddingTop:16 }}>
            <div style={{ fontSize:10, color:"var(--text4)", fontFamily:"'JetBrains Mono',monospace", marginBottom:8 }}>SERIES NAV</div>
            <button style={{ width:"100%", textAlign:"left", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:8, padding:"9px 10px", fontSize:11, color:"var(--text2)", fontFamily:"'Instrument Sans',sans-serif", cursor:"pointer", marginBottom:6 }}>← Ch.21 Zero-Allocation Patterns</button>
            <button style={{ width:"100%", textAlign:"right", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:8, padding:"9px 10px", fontSize:11, color:"var(--text2)", fontFamily:"'Instrument Sans',sans-serif", cursor:"pointer" }}>Ch.23 ValueTask Deep Dive →</button>
          </div>
        </div>
        <article style={{ minWidth:0 }}>
          <div style={{ marginBottom:28 }}>
            <div style={{ display:"flex", gap:10, marginBottom:12, flexWrap:"wrap" }}>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"var(--text3)" }}>📚 {p.series} · Ch.{p.chapter}</span>
              <Badge variant={p.difficulty}>{p.difficulty}</Badge>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"var(--text3)" }}>~{p.readTime}</span>
            </div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:34, color:"var(--text)", letterSpacing:"-1px", lineHeight:1.2, marginBottom:16 }}>{p.title}</h1>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
              <Avatar name={MOCK_USER.name} size="sm" />
              <div>
                <div style={{ fontSize:13, color:"var(--text)", fontWeight:600 }}>{MOCK_USER.name}</div>
                <div style={{ fontSize:11, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace" }}>Mar 6, 2026 · {p.views.toLocaleString()} views</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>{(p.tags||[]).map(t=><span key={t} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"var(--text3)", background:"var(--bg3)", border:"1px solid var(--border)", padding:"2px 7px", borderRadius:4 }}>{t}</span>)}</div>
            <div style={{ display:"flex", gap:6 }}>{[".NET 9","C#","CLR","async"].map(t=>(<span key={t} style={{ display:"inline-flex", alignItems:"center", gap:5, background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:5, padding:"3px 9px", fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"var(--text2)" }}><span style={{ width:6, height:6, borderRadius:"50%", background:"var(--accent)" }} />{t}</span>))}</div>
          </div>
          <div style={{ fontSize:15, lineHeight:1.85, color:"var(--text2)" }}>
            <p style={{ marginBottom:20, fontSize:17, fontWeight:500, color:"var(--text)", lineHeight:1.7 }}>The C# compiler performs a fascinating transformation when it encounters async/await keywords. Rather than generating threading code directly, it rewrites your method into a state machine struct implementing IAsyncStateMachine.</p>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:22, color:"var(--text)", letterSpacing:"-0.3px", margin:"28px 0 14px", borderBottom:"1px solid var(--border)", paddingBottom:8 }}>Understanding the State Machine</h2>
            <p style={{ marginBottom:16 }}>When you write an async method, the compiler generates a complete state machine that tracks exactly where execution should resume when each awaited task completes.</p>
            <div style={{ background:"rgba(0,204,248,.05)", border:"1px solid rgba(0,204,248,.2)", borderRadius:10, padding:"12px 14px", marginBottom:20, display:"flex", gap:12 }}>
              <span style={{ fontSize:16, flexShrink:0 }}>💡</span>
              <span style={{ fontSize:14, lineHeight:1.7 }}>Every async method becomes a struct implementing IAsyncStateMachine. This means zero heap allocation for the state machine itself.</span>
            </div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:22, color:"var(--text)", letterSpacing:"-0.3px", margin:"28px 0 14px", borderBottom:"1px solid var(--border)", paddingBottom:8 }}>Performance Implications</h2>
            <p style={{ marginBottom:16 }}>Understanding this transformation reveals why certain async patterns are more efficient. When an async method completes synchronously, no state machine heap allocation occurs at all.</p>
            <div style={{ background:"rgba(255,170,68,.05)", border:"1px solid rgba(255,170,68,.2)", borderRadius:10, padding:"12px 14px", marginBottom:20, display:"flex", gap:12 }}>
              <span style={{ fontSize:16, flexShrink:0 }}>⚠️</span>
              <span style={{ fontSize:14, lineHeight:1.7 }}>Avoid async methods in hot paths that always complete synchronously. Use ValueTask for these cases to eliminate the allocation entirely.</span>
            </div>
          </div>
          <div style={{ borderTop:"1px solid var(--border)", paddingTop:28, marginTop:40 }}>
            <div style={{ display:"flex", gap:16, marginBottom:28 }}>
              <button style={{ flex:1, padding:"13px", background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:10, color:"var(--text2)", fontSize:13, fontFamily:"'Instrument Sans',sans-serif", cursor:"pointer", textAlign:"left" }}>← Ch.21: Zero-Allocation Patterns</button>
              <button style={{ flex:1, padding:"13px", background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:10, color:"var(--text2)", fontSize:13, fontFamily:"'Instrument Sans',sans-serif", cursor:"pointer", textAlign:"right" }}>Ch.23: ValueTask Deep Dive →</button>
            </div>
            <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:14, padding:24, display:"flex", gap:20 }}>
              <Avatar name={MOCK_USER.name} size="lg" />
              <div>
                <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:17, color:"var(--text)", marginBottom:6 }}>{MOCK_USER.name}</h3>
                <p style={{ fontSize:13, color:"var(--text2)", lineHeight:1.6, marginBottom:12 }}>{MOCK_USER.bio}</p>
                <div style={{ display:"flex", gap:10 }}><Btn variant="outline" size="sm">Follow</Btn><Btn variant="primary" size="sm">Subscribe to series</Btn></div>
              </div>
            </div>
          </div>
        </article>
        <div style={{ position:"sticky", top:72, height:"fit-content", display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:16, textAlign:"center" }}>
            <svg width={72} height={72} viewBox="0 0 72 72">
              <circle cx={36} cy={36} r={28} fill="none" stroke="var(--border2)" strokeWidth={5} />
              <circle cx={36} cy={36} r={28} fill="none" stroke="var(--accent)" strokeWidth={5} strokeLinecap="round" strokeDasharray={2*Math.PI*28} strokeDashoffset={2*Math.PI*28*(1-scrollProgress/100)} transform="rotate(-90 36 36)" style={{ transition:"stroke-dashoffset .15s" }} />
              <text x={36} y={36} textAnchor="middle" dominantBaseline="central" fill="var(--text)" fontFamily="'Syne',sans-serif" fontWeight={700} fontSize={14}>{Math.round(scrollProgress)}%</text>
            </svg>
            <div style={{ fontSize:11, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace", marginTop:6 }}>read</div>
          </div>
          <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:14 }}>
            <Btn variant="primary" style={{ width:"100%", justifyContent:"center", marginBottom:8 }}>Subscribe to series</Btn>
          </div>
          <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:14 }}>
            <p style={{ fontSize:11, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace", marginBottom:10 }}>SHARE</p>
            <div style={{ display:"flex", gap:6 }}>
              {["Twitter","LinkedIn","Copy"].map(s=>(<button key={s} style={{ flex:1, padding:"6px 0", background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:6, color:"var(--text2)", fontSize:10, fontFamily:"'JetBrains Mono',monospace", cursor:"pointer" }} onMouseEnter={e=>e.currentTarget.style.background="var(--bg4)"} onMouseLeave={e=>e.currentTarget.style.background="var(--bg3)"}>{s}</button>))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 9 — ANALYTICS
// ─────────────────────────────────────────────────────────────
function AnalyticsScreen() {
  const kpis = [
    { label:"Total Views (30d)", val:"48,291", delta:"↑ 12%", color:"var(--accent)" },
    { label:"Unique Visitors", val:"23,405", delta:"↑ 8%", color:"var(--green)" },
    { label:"Avg Read Time", val:"6.2 min", delta:"↑ 0.4 min", color:"var(--blue)" },
    { label:"Subscribers", val:"847", delta:"↑ 23 new", color:"var(--purple)" },
  ];
  return (
    <div style={{ flex:1, overflowY:"auto", background:"var(--bg)", padding:"28px 32px" }}>
      <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24, color:"var(--text)", letterSpacing:"-0.5px", marginBottom:24 }}>Analytics</h1>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
        {kpis.map((k,i)=>(
          <div key={i} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:"18px 20px" }}>
            <div style={{ fontSize:22, fontFamily:"'Syne',sans-serif", fontWeight:800, color:"var(--text)", marginBottom:4 }}>{k.val}</div>
            <div style={{ fontSize:12, color:"var(--text2)", marginBottom:6 }}>{k.label}</div>
            <div style={{ fontSize:11, color:k.color, fontFamily:"'JetBrains Mono',monospace" }}>{k.delta}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20, marginBottom:20 }}>
        <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:20 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:"var(--text)", marginBottom:16 }}>Views over time (30 days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={CHART_DATA}>
              <defs><linearGradient id="aviz" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00ccf8" stopOpacity={0.3}/><stop offset="100%" stopColor="#00ccf8" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="day" tick={{fill:"#3e5a7a",fontSize:10,fontFamily:"'JetBrains Mono',monospace"}} tickLine={false} axisLine={false} interval={6} />
              <Tooltip contentStyle={{background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"var(--text)"}} />
              <Area type="monotone" dataKey="views" stroke="#00ccf8" strokeWidth={2} fill="url(#aviz)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:20 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:"var(--text)", marginBottom:16 }}>Traffic sources</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={TRAFFIC_DATA} cx="50%" cy="50%" outerRadius={68} dataKey="value" paddingAngle={2}>
                {TRAFFIC_DATA.map((_,i)=><Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"var(--text)"}} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", flexDirection:"column", gap:5, marginTop:8 }}>
            {TRAFFIC_DATA.map((d,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:"var(--text2)" }}>
                <div style={{ width:8, height:8, borderRadius:2, background:PIE_COLORS[i], flexShrink:0 }} />
                <span style={{ flex:1 }}>{d.name}</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"var(--text3)" }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:20 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:"var(--text)", marginBottom:16 }}>Top Posts</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={TOP_POSTS_DATA} layout="vertical">
              <XAxis type="number" tick={{fill:"#3e5a7a",fontSize:10,fontFamily:"'JetBrains Mono',monospace"}} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{fill:"#7a9ab8",fontSize:10}} axisLine={false} tickLine={false} width={100} />
              <Tooltip contentStyle={{background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:8,fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"var(--text)"}} />
              <Bar dataKey="views" fill="#00ccf8" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:20 }}>
          <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:"var(--text)", marginBottom:14 }}>Geo Distribution</h3>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr>{["Country","Visitors","Share"].map(h=><th key={h} style={{ padding:"6px 8px", textAlign:"left", fontSize:10, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace", borderBottom:"1px solid var(--border)" }}>{h}</th>)}</tr></thead>
            <tbody>{[["🇮🇳 India","8,203","35%"],["🇺🇸 USA","6,102","26%"],["🇬🇧 UK","2,808","12%"],["🇩🇪 Germany","1,404","6%"],["🇨🇦 Canada","1,170","5%"]].map(([c,v,s])=>(<tr key={c} style={{ borderBottom:"1px solid var(--border)" }}><td style={{ padding:"8px", fontSize:12, color:"var(--text2)" }}>{c}</td><td style={{ padding:"8px", fontSize:12, color:"var(--text2)", fontFamily:"'JetBrains Mono',monospace" }}>{v}</td><td style={{ padding:"8px", fontSize:12, color:"var(--accent)", fontFamily:"'JetBrains Mono',monospace" }}>{s}</td></tr>))}</tbody>
          </table>
        </div>
      </div>
      <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
        <div style={{ padding:"14px 18px", borderBottom:"1px solid var(--border)" }}><h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, color:"var(--text)" }}>Posts Performance</h3></div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:"var(--bg3)" }}>{["Title","Views","Avg Read%","Subscribers","Published","Series"].map(h=><th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace", borderBottom:"1px solid var(--border)" }}>{h}</th>)}</tr></thead>
          <tbody>{MOCK_POSTS.filter(p=>p.views>0).map(p=>(<tr key={p.id} style={{ borderBottom:"1px solid var(--border)" }}><td style={{ padding:"12px 14px", fontSize:13, color:"var(--text)", fontWeight:500 }}>{p.title}</td><td style={{ padding:"12px 14px", fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"var(--text2)" }}>{p.views.toLocaleString()}</td><td style={{ padding:"12px 14px", fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"var(--green)" }}>{40+p.views%35}%</td><td style={{ padding:"12px 14px", fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"var(--text2)" }}>{Math.floor(p.views/8)}</td><td style={{ padding:"12px 14px", fontSize:11, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace" }}>Mar 2026</td><td style={{ padding:"12px 14px", fontSize:12, color:"var(--text2)" }}>{p.series}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN 10 — API DOCS
// ─────────────────────────────────────────────────────────────
function ApiDocsScreen() {
  const [activeSection, setActiveSection] = useState("authentication");
  const [codeLang, setCodeLang] = useState("curl");
  const [expanded, setExpanded] = useState({});
  const sections = [
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
          <div style={{ width:22, height:22, borderRadius:5, background:"linear-gradient(135deg,var(--accent),var(--blue))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:"#000", fontFamily:"'Syne',sans-serif" }}>S</div>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, color:"var(--text)" }}>API Reference</span>
        </div>
        <div style={{ fontSize:9, color:"var(--text4)", fontFamily:"'JetBrains Mono',monospace", letterSpacing:"1px", marginBottom:10, padding:"0 8px" }}>v1 · REST · JSON</div>
        {sections.map(s=>(<button key={s.key} onClick={()=>setActiveSection(s.key)} style={{ display:"block", width:"100%", padding:"8px 10px", borderRadius:7, background:activeSection===s.key?"var(--bg5)":"transparent", color:activeSection===s.key?"var(--text)":"var(--text2)", fontSize:13, fontFamily:"'Instrument Sans',sans-serif", textAlign:"left", border:activeSection===s.key?"1px solid var(--border3)":"1px solid transparent", marginBottom:2, transition:"all .13s" }}>{s.label}</button>))}
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"32px 36px" }}>
        {activeSection==="authentication" && (
          <div style={{ maxWidth:760 }}>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28, color:"var(--text)", marginBottom:8, letterSpacing:"-0.5px" }}>Authentication</h1>
            <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.7, marginBottom:24 }}>Include your API key in the <code style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:"var(--accent)", background:"rgba(0,204,248,.08)", padding:"1px 5px", borderRadius:3 }}>x-api-key</code> header on every request.</p>
            <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden", marginBottom:24 }}>
              <div style={{ background:"var(--bg3)", borderBottom:"1px solid var(--border)", padding:"10px 14px", display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ display:"flex", gap:4 }}>{["#ff6b6b","#ffaa44","#00e5a0"].map(c=><div key={c} style={{ width:8,height:8,borderRadius:"50%",background:c }} />)}</div>
                <div style={{ display:"flex", gap:4, marginLeft:8 }}>
                  {["curl","node","python","csharp"].map(l=>(<button key={l} onClick={()=>setCodeLang(l)} style={{ padding:"3px 8px", borderRadius:4, background:codeLang===l?"var(--bg5)":"transparent", color:codeLang===l?"var(--text)":"var(--text3)", fontSize:11, fontFamily:"'JetBrains Mono',monospace", border:codeLang===l?"1px solid var(--border3)":"none" }}>{l}</button>))}
                </div>
              </div>
              <pre style={{ padding:16, fontFamily:"'JetBrains Mono',monospace", fontSize:13, lineHeight:1.7, color:"var(--text2)", overflowX:"auto" }}>{codeExamples[codeLang]}</pre>
            </div>
            <div style={{ background:"rgba(0,204,248,.04)", border:"1px solid rgba(0,204,248,.2)", borderRadius:10, padding:"12px 16px", marginBottom:24, display:"flex", gap:10 }}>
              <span>ℹ️</span>
              <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.6 }}>Create keys in <strong style={{ color:"var(--text)" }}>Settings → API Keys</strong>. Never expose them in client-side code.</div>
            </div>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, color:"var(--text)", marginBottom:16 }}>Rate Limits</h2>
            <table style={{ width:"100%", borderCollapse:"collapse", border:"1px solid var(--border)", borderRadius:10, overflow:"hidden" }}>
              <thead><tr style={{ background:"var(--bg2)" }}>{["Plan","Requests/min","Burst","API Keys"].map(h=><th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace", borderBottom:"1px solid var(--border)" }}>{h}</th>)}</tr></thead>
              <tbody>{[["Free","100","150","3"],["Pro","1,000","1,500","20"],["Team","10,000","15,000","Unlimited"]].map(([plan,...vals])=>(<tr key={plan} style={{ borderBottom:"1px solid var(--border)" }}><td style={{ padding:"10px 14px" }}><Badge variant={plan==="Pro"?"pro":plan==="Team"?"advanced":"draft"}>{plan}</Badge></td>{vals.map((v,i)=><td key={i} style={{ padding:"10px 14px", fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"var(--text2)" }}>{v}</td>)}</tr>))}</tbody>
            </table>
          </div>
        )}
        {["posts","series","media","analytics","webhooks"].includes(activeSection) && (
          <div style={{ maxWidth:760 }}>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28, color:"var(--text)", marginBottom:8, letterSpacing:"-0.5px", textTransform:"capitalize" }}>{activeSection}</h1>
            <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.7, marginBottom:24 }}>Manage your {activeSection} via the REST API. Write operations require appropriate API key permissions.</p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {(allEndpoints[activeSection]||[]).map((ep,i)=>{
                const isOpen = expanded[ep.path+ep.method];
                return (
                  <div key={i} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
                    <button onClick={()=>setExpanded(x=>({...x,[ep.path+ep.method]:!isOpen}))} style={{ width:"100%", padding:"14px 18px", borderBottom:isOpen?"1px solid var(--border)":"none", display:"flex", alignItems:"center", gap:12, background:"transparent", border:"none", cursor:"pointer", textAlign:"left" }}>
                      <span style={{ background:methodColor[ep.method]+"20", color:methodColor[ep.method], border:"1px solid "+methodColor[ep.method]+"40", borderRadius:5, padding:"3px 10px", fontFamily:"'JetBrains Mono',monospace", fontSize:11, fontWeight:700, minWidth:52, textAlign:"center" }}>{ep.method}</span>
                      <code style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, color:"var(--text)", flex:1 }}>{ep.path}</code>
                      <span style={{ fontSize:13, color:"var(--text2)" }}>{ep.desc}</span>
                      <span style={{ color:"var(--text3)", fontSize:12, marginLeft:8 }}>{isOpen?"▲":"▼"}</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding:"16px 18px" }}>
                        <div style={{ fontSize:11, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace", marginBottom:8 }}>PARAMETERS</div>
                        <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:16 }}>
                          <thead><tr style={{ background:"var(--bg3)" }}>{["Name","In","Type","Description"].map(h=><th key={h} style={{ padding:"7px 10px", textAlign:"left", fontSize:10, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace", borderBottom:"1px solid var(--border)" }}>{h}</th>)}</tr></thead>
                          <tbody>{ep.params.map(([name,loc,type,desc])=>(<tr key={name} style={{ borderBottom:"1px solid var(--border)" }}><td style={{ padding:"8px 10px", fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"var(--accent)" }}>{name}</td><td style={{ padding:"8px 10px", fontSize:11, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace" }}>{loc}</td><td style={{ padding:"8px 10px", fontSize:11, color:"var(--purple)", fontFamily:"'JetBrains Mono',monospace" }}>{type}</td><td style={{ padding:"8px 10px", fontSize:12, color:"var(--text2)" }}>{desc}</td></tr>))}</tbody>
                        </table>
                        <div style={{ background:"rgba(0,204,248,.04)", border:"1px solid rgba(0,204,248,.15)", borderRadius:8, padding:10, display:"flex", gap:10, alignItems:"center" }}>
                          <span style={{ fontSize:11, color:"var(--accent)", fontFamily:"'JetBrains Mono',monospace", whiteSpace:"nowrap" }}>TRY IT</span>
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
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:28, color:"var(--text)", marginBottom:8, letterSpacing:"-0.5px" }}>Error Codes</h1>
            <p style={{ color:"var(--text2)", fontSize:15, lineHeight:1.7, marginBottom:24 }}>All errors return a consistent JSON shape with a code and description.</p>
            <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:10, overflow:"hidden", marginBottom:24 }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr style={{ background:"var(--bg3)" }}>{["HTTP","Code","Description"].map(h=><th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, color:"var(--text3)", fontFamily:"'JetBrains Mono',monospace", borderBottom:"1px solid var(--border)" }}>{h}</th>)}</tr></thead>
                <tbody>{[["401","MISSING_AUTH","No API key provided"],["401","INVALID_KEY","API key is invalid or revoked"],["403","INSUFFICIENT_PERMISSIONS","Key lacks required permissions"],["404","NOT_FOUND","Resource not found"],["422","VALIDATION_ERROR","Request body failed validation"],["429","RATE_LIMIT_EXCEEDED","Too many requests — check Retry-After"],["500","INTERNAL_ERROR","Server error — contact support"]].map(([http,code,desc])=>(<tr key={code} style={{ borderBottom:"1px solid var(--border)" }}><td style={{ padding:"10px 14px", fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:parseInt(http)>=500?"var(--red)":parseInt(http)>=400?"var(--orange)":"var(--green)" }}>{http}</td><td style={{ padding:"10px 14px", fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"var(--accent)" }}>{code}</td><td style={{ padding:"10px 14px", fontSize:13, color:"var(--text2)" }}>{desc}</td></tr>))}</tbody>
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
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [editPost, setEditPost] = useState(null);
  const { toasts, show: showToast, remove: removeToast } = useToast();
  const isProtected = ["dashboard","editor","templates","settings","analytics","apidocs"].includes(screen);
  const isFullScreen = ["landing","login","signup","blog","post"].includes(screen);
  return (
    <>
      <GlobalStyle />
      <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg)" }}>
        {isProtected && <Sidebar screen={screen} setScreen={setScreen} />}
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:isFullScreen?"visible":"hidden" }}>
          {screen==="landing" && <LandingScreen setScreen={setScreen} />}
          {screen==="login" && <AuthScreen mode="login" setScreen={setScreen} toast={msg=>showToast(msg,"success")} />}
          {screen==="signup" && <AuthScreen mode="signup" setScreen={setScreen} toast={msg=>showToast(msg,"success")} />}
          {screen==="dashboard" && <DashboardScreen setScreen={setScreen} setEditPost={setEditPost} toast={msg=>showToast(msg,"success")} />}
          {screen==="editor" && <EditorScreen post={editPost} setScreen={setScreen} toast={msg=>showToast(msg,"success")} />}
          {screen==="templates" && <TemplatesScreen setScreen={setScreen} toast={msg=>showToast(msg,"success")} />}
          {screen==="settings" && <SettingsScreen toast={msg=>showToast(msg,"success")} />}
          {screen==="analytics" && <AnalyticsScreen />}
          {screen==="blog" && <BlogScreen setScreen={setScreen} />}
          {screen==="post" && <PostScreen post={editPost} setScreen={setScreen} />}
          {screen==="apidocs" && <ApiDocsScreen />}
        </div>
      </div>
      <div style={{ position:"fixed", bottom:24, right:24, zIndex:1000, display:"flex", flexDirection:"column", gap:8 }}>
        {toasts.map(t=>(<Toast key={t.id} message={t.message} type={t.type} onClose={()=>removeToast(t.id)} />))}
      </div>
    </>
  );
}
