import { CALLOUT_META } from "./editorHelpers";

function getYouTubeEmbed(url = "") {
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch?.[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch?.[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  return "";
}

export default function BlockPreviewRenderer({ block }) {
  if (["h1", "h2", "h3", "lead", "paragraph", "quote"].includes(block.type)) {
    const Tag = block.type === "h1" ? "h1" : block.type === "h2" ? "h2" : block.type === "h3" ? "h3" : "p";

    const text = block.content || "";
    if (!text.trim()) {
      return null;
    }

    if (block.type === "quote") {
      return (
        <blockquote
          style={{
            margin: "10px 0",
            borderLeft: "3px solid var(--accent)",
            paddingLeft: 12,
            color: "var(--text2)",
            fontStyle: "italic",
            lineHeight: 1.7,
          }}
        >
          {text}
        </blockquote>
      );
    }

    return (
      <Tag
        style={{
          margin: "10px 0",
          color: "var(--text)",
          lineHeight: block.type === "lead" ? 1.8 : 1.5,
          fontSize:
            block.type === "h1"
              ? 40
              : block.type === "h2"
              ? 30
              : block.type === "h3"
              ? 24
              : block.type === "lead"
              ? 19
              : 16,
          fontFamily: block.type.startsWith("h") ? "var(--font-display)" : "var(--font-body)",
          fontWeight: block.type === "lead" ? 500 : 700,
        }}
      >
        {text}
      </Tag>
    );
  }

  if (["bullet", "numbered", "steps", "techstack"].includes(block.type)) {
    const items = (block.items || []).filter((item) => item?.trim());
    if (!items.length) {
      return null;
    }

    if (block.type === "techstack") {
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "10px 0" }}>
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              style={{
                padding: "4px 9px",
                borderRadius: 999,
                border: "1px solid var(--border2)",
                background: "var(--bg3)",
                color: "var(--text2)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
              }}
            >
              {item}
            </span>
          ))}
        </div>
      );
    }

    const ListTag = block.type === "numbered" || block.type === "steps" ? "ol" : "ul";
    return (
      <ListTag style={{ margin: "10px 0 10px 20px", color: "var(--text2)", lineHeight: 1.7 }}>
        {items.map((item, index) => (
          <li key={`${item}-${index}`} style={{ marginBottom: 6 }}>
            {item}
          </li>
        ))}
      </ListTag>
    );
  }

  if (block.type === "divider") {
    return <hr style={{ border: 0, borderTop: "1px solid var(--border2)", margin: "16px 0" }} />;
  }

  if (block.type === "code") {
    return (
      <pre
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "14px 16px",
          overflowX: "auto",
          margin: "10px 0",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          lineHeight: 1.7,
          color: "var(--text2)",
        }}
      >
        {block.content || ""}
      </pre>
    );
  }

  if (block.type === "math") {
    return (
      <pre
        style={{
          margin: "10px 0",
          padding: "10px 12px",
          background: "var(--bg3)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          color: "var(--accent)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {block.content || ""}
      </pre>
    );
  }

  if (CALLOUT_META[block.type]) {
    const meta = CALLOUT_META[block.type];
    const text = block.content || "";
    if (!text.trim()) {
      return null;
    }

    return (
      <div
        style={{
          display: "flex",
          gap: 10,
          margin: "12px 0",
          padding: "12px",
          borderRadius: 10,
          border: `1px solid ${meta.border}`,
          background: meta.bg,
          color: "var(--text2)",
        }}
      >
        <span>{meta.icon}</span>
        <span>{text}</span>
      </div>
    );
  }

  if (block.type === "image") {
    if (!block.url) {
      return null;
    }

    return (
      <figure style={{ margin: "12px 0" }}>
        <img
          src={block.url}
          alt={block.caption || "Post image"}
          style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)" }}
        />
        {block.caption && (
          <figcaption style={{ marginTop: 8, color: "var(--text3)", fontSize: 12 }}>{block.caption}</figcaption>
        )}
      </figure>
    );
  }

  if (block.type === "youtube") {
    const embed = getYouTubeEmbed(block.url || "");
    if (!embed) {
      return null;
    }

    return (
      <div style={{ margin: "12px 0", aspectRatio: "16 / 9" }}>
        <iframe
          src={embed}
          title="YouTube preview"
          style={{ width: "100%", height: "100%", border: "1px solid var(--border)", borderRadius: 10 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (block.type === "mermaid") {
    return (
      <pre
        style={{
          margin: "10px 0",
          padding: "12px 14px",
          background: "var(--bg3)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          color: "var(--text2)",
          fontFamily: "var(--font-mono)",
          overflowX: "auto",
        }}
      >
        {block.code || ""}
      </pre>
    );
  }

  if (block.type === "chart") {
    const data = block.data || [];
    const max = Math.max(...data.map((row) => Number(row.value || 0)), 1);

    return (
      <div style={{ margin: "12px 0", display: "flex", flexDirection: "column", gap: 8 }}>
        {(data || []).map((row) => (
          <div key={row.name} style={{ display: "grid", gridTemplateColumns: "140px 1fr 60px", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>{row.name}</span>
            <div style={{ height: 8, background: "var(--bg3)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ width: `${(Number(row.value || 0) / max) * 100}%`, height: "100%", background: "var(--accent)" }} />
            </div>
            <span style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-mono)", textAlign: "right" }}>{row.value}</span>
          </div>
        ))}
      </div>
    );
  }

  if (block.type === "toggle") {
    return (
      <details style={{ margin: "12px 0", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", background: "var(--bg2)" }}>
        <summary style={{ cursor: "pointer", color: "var(--text)", fontWeight: 600 }}>{block.title || "Toggle"}</summary>
        <p style={{ marginTop: 10, color: "var(--text2)", lineHeight: 1.7 }}>{block.content || ""}</p>
      </details>
    );
  }

  if (block.type === "tabs") {
    const tabs = block.tabs || [];
    if (!tabs.length) {
      return null;
    }

    const active = tabs[block.active || 0] || tabs[0];
    return (
      <div style={{ margin: "12px 0", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--bg3)" }}>
          {tabs.map((tab, index) => (
            <div
              key={`${tab.label}-${index}`}
              style={{
                padding: "8px 12px",
                borderRight: index === tabs.length - 1 ? "none" : "1px solid var(--border)",
                color: tab.label === active.label ? "var(--text)" : "var(--text3)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
              }}
            >
              {tab.label}
            </div>
          ))}
        </div>
        <div style={{ padding: 12, color: "var(--text2)", lineHeight: 1.7 }}>{active.content || ""}</div>
      </div>
    );
  }

  if (block.type === "columns") {
    return (
      <div style={{ margin: "12px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: 10, background: "var(--bg2)", padding: 12, color: "var(--text2)" }}>{block.left || ""}</div>
        <div style={{ border: "1px solid var(--border)", borderRadius: 10, background: "var(--bg2)", padding: 12, color: "var(--text2)" }}>{block.right || ""}</div>
      </div>
    );
  }

  if (block.type === "table") {
    const headers = block.headers || [];
    const rows = block.rows || [];

    return (
      <div style={{ margin: "12px 0", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid var(--border)" }}>
          <thead>
            <tr style={{ background: "var(--bg3)" }}>
              {headers.map((header, index) => (
                <th key={`${header}-${index}`} style={{ padding: "8px 10px", borderBottom: "1px solid var(--border)", textAlign: "left", color: "var(--text3)", fontFamily: "var(--font-mono)", fontSize: 11 }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`} style={{ borderBottom: rowIndex === rows.length - 1 ? "none" : "1px solid var(--border)" }}>
                {row.map((cell, colIndex) => (
                  <td key={`cell-${rowIndex}-${colIndex}`} style={{ padding: "8px 10px", color: "var(--text2)", fontSize: 13 }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}
