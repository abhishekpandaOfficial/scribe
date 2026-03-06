export default function BlockFrame({ block, children, onRemove, onMoveUp, onMoveDown }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 12,
        background: "var(--bg2)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "8px 12px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg3)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--text3)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {block.type}
        </span>

        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          <button
            onClick={onMoveUp}
            style={{
              background: "none",
              border: "1px solid var(--border2)",
              borderRadius: 4,
              color: "var(--text3)",
              padding: "2px 6px",
              fontSize: 10,
            }}
            title="Move up"
          >
            ↑
          </button>
          <button
            onClick={onMoveDown}
            style={{
              background: "none",
              border: "1px solid var(--border2)",
              borderRadius: 4,
              color: "var(--text3)",
              padding: "2px 6px",
              fontSize: 10,
            }}
            title="Move down"
          >
            ↓
          </button>
          <button
            onClick={onRemove}
            style={{
              background: "rgba(255,107,107,.1)",
              border: "1px solid rgba(255,107,107,.25)",
              borderRadius: 4,
              color: "var(--red)",
              padding: "2px 7px",
              fontSize: 10,
            }}
            title="Delete block"
          >
            ×
          </button>
        </div>
      </div>

      <div style={{ padding: 14 }}>{children}</div>
    </div>
  );
}
