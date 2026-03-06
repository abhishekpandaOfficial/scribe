import { Btn } from "../ui";
import { ChartBlockEl, CodeBlockEl, MermaidBlockEl, TableBlockEl } from "./BlockElements";
import { CALLOUT_META } from "./editorHelpers";
import SlashCommandTextarea from "./SlashCommandTextarea";

function ListEditor({ block, updateBlock, ordered = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {(block.items || []).map((item, index) => (
        <div key={`${block.id}-${index}`} style={{ display: "flex", gap: 8 }}>
          <span
            style={{
              width: 20,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text3)",
              marginTop: 7,
              flexShrink: 0,
            }}
          >
            {ordered ? `${index + 1}.` : "•"}
          </span>
          <input
            value={item}
            onChange={(event) => {
              const next = [...(block.items || [])];
              next[index] = event.target.value;
              updateBlock(block.id, { items: next });
            }}
            placeholder="List item"
            style={{ fontSize: 13 }}
          />
        </div>
      ))}
      <Btn
        variant="ghost"
        size="sm"
        onClick={() => updateBlock(block.id, { items: [...(block.items || []), ""] })}
      >
        + Item
      </Btn>
    </div>
  );
}

export default function BlockContentRenderer({ block, updateBlock, toast, insertBlockAfter }) {
  if (block.type === "code") {
    return <CodeBlockEl block={block} updateBlock={updateBlock} toast={toast} />;
  }

  if (block.type === "mermaid") {
    return <MermaidBlockEl block={block} updateBlock={updateBlock} />;
  }

  if (block.type === "chart") {
    return <ChartBlockEl block={block} updateBlock={updateBlock} />;
  }

  if (block.type === "table") {
    return <TableBlockEl block={block} updateBlock={updateBlock} />;
  }

  if (["paragraph", "lead", "h1", "h2", "h3", "quote"].includes(block.type)) {
    const sharedStyle = {
      width: "100%",
      border: "1px solid var(--border2)",
      background: "var(--bg3)",
      borderRadius: 8,
      padding: block.type === "lead" ? "12px 14px" : "10px 12px",
      color: "var(--text)",
      fontSize:
        block.type === "h1"
          ? 28
          : block.type === "h2"
          ? 24
          : block.type === "h3"
          ? 20
          : block.type === "lead"
          ? 17
          : 14,
      fontFamily: block.type.startsWith("h") ? "var(--font-display)" : "var(--font-body)",
      lineHeight: block.type === "lead" ? 1.7 : 1.6,
    };

    return (
      <SlashCommandTextarea
        value={block.content || ""}
        onChangeValue={(nextValue) => updateBlock(block.id, { content: nextValue })}
        onInsertBlock={(type, { replaceCurrent }) => insertBlockAfter?.(block.id, type, replaceCurrent)}
        rows={block.type === "paragraph" ? 4 : 2}
        style={sharedStyle}
        placeholder={`Write ${block.type}... (type / for blocks)`}
      />
    );
  }

  if (["bullet", "numbered", "steps", "techstack"].includes(block.type)) {
    return <ListEditor block={block} updateBlock={updateBlock} ordered={block.type === "numbered" || block.type === "steps"} />;
  }

  if (block.type === "divider") {
    return <hr style={{ border: 0, borderTop: "1px solid var(--border2)" }} />;
  }

  if (CALLOUT_META[block.type]) {
    const meta = CALLOUT_META[block.type];
    return (
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          padding: "10px 12px",
          borderRadius: 10,
          border: `1px solid ${meta.border}`,
          background: meta.bg,
        }}
      >
        <span style={{ fontSize: 16 }}>{meta.icon}</span>
        <SlashCommandTextarea
          value={block.content || ""}
          onChangeValue={(nextValue) => updateBlock(block.id, { content: nextValue })}
          onInsertBlock={(type, { replaceCurrent }) => insertBlockAfter?.(block.id, type, replaceCurrent)}
          rows={2}
          style={{
            border: "none",
            background: "transparent",
            boxShadow: "none",
            padding: 0,
            color: "var(--text2)",
            fontSize: 13,
          }}
          placeholder="Type / for blocks"
        />
      </div>
    );
  }

  if (block.type === "math") {
    return (
      <SlashCommandTextarea
        value={block.content || ""}
        onChangeValue={(nextValue) => updateBlock(block.id, { content: nextValue })}
        onInsertBlock={(type, { replaceCurrent }) => insertBlockAfter?.(block.id, type, replaceCurrent)}
        rows={3}
        style={{ fontFamily: "var(--font-mono)" }}
        placeholder="E = mc^2 (type / for blocks)"
      />
    );
  }

  if (block.type === "image") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input
          value={block.url || ""}
          onChange={(event) => updateBlock(block.id, { url: event.target.value })}
          placeholder="https://..."
        />
        <input
          value={block.caption || ""}
          onChange={(event) => updateBlock(block.id, { caption: event.target.value })}
          placeholder="Caption"
        />
      </div>
    );
  }

  if (block.type === "youtube") {
    return (
      <input
        value={block.url || ""}
        onChange={(event) => updateBlock(block.id, { url: event.target.value })}
        placeholder="https://www.youtube.com/watch?v=..."
      />
    );
  }

  if (block.type === "toggle") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input
          value={block.title || ""}
          onChange={(event) => updateBlock(block.id, { title: event.target.value })}
          placeholder="Toggle title"
        />
        <textarea
          value={block.content || ""}
          onChange={(event) => updateBlock(block.id, { content: event.target.value })}
          rows={3}
          placeholder="Toggle content"
        />
      </div>
    );
  }

  if (block.type === "tabs") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {(block.tabs || []).map((tab, index) => (
          <div key={`${block.id}-tab-${index}`} style={{ display: "flex", gap: 8 }}>
            <input
              value={tab.label}
              onChange={(event) => {
                const tabs = [...(block.tabs || [])];
                tabs[index] = { ...tabs[index], label: event.target.value };
                updateBlock(block.id, { tabs });
              }}
              style={{ maxWidth: 140 }}
            />
            <input
              value={tab.content}
              onChange={(event) => {
                const tabs = [...(block.tabs || [])];
                tabs[index] = { ...tabs[index], content: event.target.value };
                updateBlock(block.id, { tabs });
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (block.type === "columns") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <textarea
          value={block.left || ""}
          onChange={(event) => updateBlock(block.id, { left: event.target.value })}
          rows={4}
        />
        <textarea
          value={block.right || ""}
          onChange={(event) => updateBlock(block.id, { right: event.target.value })}
          rows={4}
        />
      </div>
    );
  }

  return (
    <SlashCommandTextarea
      value={block.content || ""}
      onChangeValue={(nextValue) => updateBlock(block.id, { content: nextValue })}
      onInsertBlock={(type, { replaceCurrent }) => insertBlockAfter?.(block.id, type, replaceCurrent)}
      rows={3}
      placeholder="Type / for blocks"
    />
  );
}
