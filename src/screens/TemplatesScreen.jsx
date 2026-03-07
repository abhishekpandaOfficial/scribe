import { useMemo, useState } from "react";
import { TEMPLATES } from "../data/mockData";
import { Btn } from "../components/ui";

function inferKind(template) {
  const text = `${template.name} ${template.category}`.toLowerCase();
  if (text.includes("series") || text.includes("curriculum") || text.includes("chapter")) {
    return "series";
  }
  if (text.includes("guide") || text.includes("course") || text.includes("interview") || text.includes("tutorial")) {
    return "playlist";
  }
  if (text.includes("journal") || text.includes("release") || text.includes("announcement") || text.includes("retrospective")) {
    return "blog";
  }
  return "article";
}

function TemplatePreviewCard({ template, large = false }) {
  const kind = inferKind(template);
  const size = large ? { height: 160, title: 10 } : { height: 110, title: 8 };

  const headerColor = `${template.color}35`;
  const bodyColor = "var(--bg4)";

  return (
    <div style={{ background: "var(--bg3)", borderBottom: "1px solid var(--border)", padding: "16px 18px", height: size.height, display: "flex", flexDirection: "column", gap: 6, overflow: "hidden" }}>
      <div style={{ width: kind === "article" ? "86%" : kind === "blog" ? "70%" : kind === "series" ? "64%" : "58%", height: size.title, background: headerColor, borderRadius: 4, borderLeft: `3px solid ${template.color}` }} />

      {kind === "article" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>{[90, 80, 75, 62].map((w, i) => <div key={i} style={{ width: `${w}%`, height: 5, background: bodyColor, borderRadius: 3 }} />)}</div>
          <div style={{ display: "flex", gap: 5 }}>
            <div style={{ flex: 1, height: 22, background: bodyColor, borderRadius: 6, borderLeft: `2px solid ${template.color}` }} />
            <div style={{ flex: 1, height: 22, background: bodyColor, borderRadius: 6 }} />
          </div>
        </>
      )}

      {kind === "blog" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            <div style={{ height: 42, borderRadius: 8, background: bodyColor }} />
            <div style={{ height: 42, borderRadius: 8, background: bodyColor }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>{[85, 76, 58].map((w, i) => <div key={i} style={{ width: `${w}%`, height: 5, background: bodyColor, borderRadius: 3 }} />)}</div>
        </>
      )}

      {kind === "series" && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>{[26, 20, 14].map((s, i) => <div key={i} style={{ width: s, height: s, borderRadius: "50%", background: i === 0 ? `${template.color}55` : bodyColor }} />)}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>{[68, 82, 74, 54].map((w, i) => <div key={i} style={{ width: `${w}%`, height: 5, background: bodyColor, borderRadius: 3 }} />)}</div>
        </>
      )}

      {kind === "playlist" && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[1, 2, 3].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: `${template.color}40` }} />
                <div style={{ flex: 1, height: 5, background: bodyColor, borderRadius: 3 }} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function TemplatesScreen({ setScreen, toast, onSelectTemplate }) {
  const [cat, setCat] = useState("All");
  const [kind, setKind] = useState("All");
  const [search, setSearch] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const cats = ["All", "Tutorial", "Deep Dive", "Series Intro", "Architecture", "Retrospective", "Interview Prep", "Announcement"];
  const kinds = ["All", "article", "blog", "series", "playlist"];

  const filtered = useMemo(() => {
    return TEMPLATES.filter((template) => {
      const matchCat = cat === "All" || template.category === cat;
      const matchKind = kind === "All" || inferKind(template) === kind;
      const text = `${template.name} ${template.desc} ${template.category}`.toLowerCase();
      const matchSearch = !search || text.includes(search.toLowerCase());
      return matchCat && matchKind && matchSearch;
    });
  }, [cat, kind, search]);

  const useTemplate = (template) => {
    onSelectTemplate?.(template);
    toast("Template loaded. Customize and start writing.");
    setPreviewTemplate(null);
    setScreen("editor");
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
      <div style={{ padding: "28px 32px", borderBottom: "1px solid var(--border)" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "var(--text)", letterSpacing: "-0.5px", marginBottom: 6 }}>Start with a template</h1>
        <p style={{ color: "var(--text2)", fontSize: 14 }}>Pick a structure, preview it, then open editor with pre-filled blocks.</p>
      </div>

      <div style={{ padding: "20px 32px" }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          <input placeholder="Search templates..." value={search} onChange={(event) => setSearch(event.target.value)} style={{ width: 250, padding: "8px 12px", fontSize: 13 }} />

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {cats.map((item) => (
              <button key={item} onClick={() => setCat(item)} style={{ padding: "5px 12px", borderRadius: 16, background: cat === item ? "var(--bg5)" : "var(--bg2)", border: cat === item ? "1px solid var(--border3)" : "1px solid var(--border)", color: cat === item ? "var(--text)" : "var(--text2)", fontSize: 12, fontFamily: "var(--font-mono)", transition: "all .13s" }}>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 24 }}>
          {kinds.map((item) => (
            <button key={item} onClick={() => setKind(item)} style={{ padding: "4px 10px", borderRadius: 10, background: kind === item ? "rgba(0,204,248,.12)" : "transparent", border: kind === item ? "1px solid rgba(0,204,248,.3)" : "1px solid var(--border)", color: kind === item ? "var(--accent)" : "var(--text3)", fontSize: 11, fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
              {item}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {filtered.map((template) => (
            <div
              key={template.id}
              style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", transition: "all .13s", cursor: "pointer" }}
              onClick={() => setPreviewTemplate(template)}
              onMouseEnter={(event) => {
                event.currentTarget.style.borderColor = template.color;
                event.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.borderColor = "var(--border)";
                event.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <TemplatePreviewCard template={template} />
              <div style={{ padding: "16px 18px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 8 }}>{template.name}</h3>
                <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10, color: template.color, background: `${template.color}15`, border: `1px solid ${template.color}30`, borderRadius: 4, padding: "1px 7px", fontFamily: "var(--font-mono)" }}>{template.category}</span>
                  <span style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>{inferKind(template)}</span>
                  <span style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>{template.blocks} blocks</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.55, marginBottom: 12 }}>{template.desc}</p>
                <Btn variant="outline" size="sm" style={{ width: "100%", justifyContent: "center" }}>
                  Preview template
                </Btn>
              </div>
            </div>
          ))}
        </div>
      </div>

      {previewTemplate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 250, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ width: "min(860px, 100%)", background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 0 }}>
              <TemplatePreviewCard template={previewTemplate} large />
              <div style={{ padding: 18 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--text)", marginBottom: 8 }}>{previewTemplate.name}</h3>
                <p style={{ color: "var(--text2)", lineHeight: 1.7, fontSize: 14, marginBottom: 14 }}>{previewTemplate.desc}</p>
                <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10, color: previewTemplate.color, background: `${previewTemplate.color}18`, border: `1px solid ${previewTemplate.color}30`, borderRadius: 4, padding: "2px 8px", fontFamily: "var(--font-mono)" }}>{previewTemplate.category}</span>
                  <span style={{ fontSize: 10, color: "var(--text3)", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 8px", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>{inferKind(previewTemplate)}</span>
                  <span style={{ fontSize: 10, color: "var(--text3)", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 8px", fontFamily: "var(--font-mono)" }}>{previewTemplate.blocks} blocks</span>
                </div>
                <div style={{ color: "var(--text3)", fontSize: 12, marginBottom: 18 }}>
                  Opens editor with a pre-built structure. You can customize every block before publishing.
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Btn variant="ghost" onClick={() => setPreviewTemplate(null)} style={{ flex: 1, justifyContent: "center" }}>Close</Btn>
                  <Btn variant="primary" onClick={() => useTemplate(previewTemplate)} style={{ flex: 1, justifyContent: "center" }}>Use this template</Btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
