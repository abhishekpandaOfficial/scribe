export default function BlockLibraryPanel({ query, setQuery, groupedBlocks, addBlock }) {
  return (
    <div
      style={{
        width: 260,
        borderRight: "1px solid var(--border)",
        background: "var(--bg2)",
        padding: "16px 12px",
        overflowY: "auto",
        flexShrink: 0,
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 16,
          fontWeight: 700,
          color: "var(--text)",
          marginBottom: 12,
          padding: "0 6px",
        }}
      >
        Blocks
      </h3>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search blocks"
        style={{ marginBottom: 12, fontSize: 13 }}
      />

      {Object.entries(groupedBlocks).map(([group, items]) => (
        <div key={group} style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 10,
              color: "var(--text4)",
              fontFamily: "var(--font-mono)",
              letterSpacing: "1px",
              marginBottom: 6,
              padding: "0 6px",
            }}
          >
            {group}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {items.map((item) => (
              <button
                key={item.type}
                onClick={() => addBlock(item.type)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  textAlign: "left",
                  background: "var(--bg3)",
                  border: "1px solid var(--border)",
                  color: "var(--text2)",
                  borderRadius: 8,
                  padding: "7px 8px",
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                }}
              >
                <span style={{ width: 18, textAlign: "center" }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
