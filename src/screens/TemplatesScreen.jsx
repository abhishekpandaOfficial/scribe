import { useState } from "react";
import { TEMPLATES } from "../data/mockData";
export default function TemplatesScreen({ setScreen, toast }) {
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
        <h1 style={{ fontFamily:"var(--font-display)", fontWeight:800, fontSize:26, color:"var(--text)", letterSpacing:"-0.5px", marginBottom:6 }}>Start with a template</h1>
        <p style={{ color:"var(--text2)", fontSize:14 }}>Professionally designed structures for every type of technical content.</p>
      </div>
      <div style={{ padding:"20px 32px" }}>
        <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap", alignItems:"center" }}>
          <input placeholder="Search templates…" value={search} onChange={e=>setSearch(e.target.value)} style={{ width:240, padding:"8px 12px", fontSize:13 }} />
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {cats.map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{ padding:"5px 12px", borderRadius:16, background:cat===c?"var(--bg5)":"var(--bg2)", border:cat===c?"1px solid var(--border3)":"1px solid var(--border)", color:cat===c?"var(--text)":"var(--text2)", fontSize:12, fontFamily:"var(--font-mono)", transition:"all .13s" }}>
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
                <h3 style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:15, color:"var(--text)", marginBottom:8 }}>{tmpl.name}</h3>
                <div style={{ display:"flex", gap:6, marginBottom:8 }}>
                  <span style={{ fontSize:10, color:tmpl.color, background:tmpl.color+"15", border:"1px solid "+tmpl.color+"30", borderRadius:4, padding:"1px 7px", fontFamily:"var(--font-mono)" }}>{tmpl.category}</span>
                  <span style={{ fontSize:10, color:"var(--text3)", fontFamily:"var(--font-mono)" }}>{tmpl.blocks} blocks</span>
                </div>
                <p style={{ fontSize:12, color:"var(--text2)", lineHeight:1.5, marginBottom:12 }}>{tmpl.desc}</p>
                <button className="use-btn" onClick={()=>{ toast("Template applied!"); setScreen("editor"); }} style={{ background:tmpl.color, color:"#000", border:"none", borderRadius:7, padding:"7px 14px", fontSize:12, fontFamily:"var(--font-mono)", fontWeight:600, opacity:0, transition:"opacity .15s", width:"100%", cursor:"pointer" }}>Use template →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
