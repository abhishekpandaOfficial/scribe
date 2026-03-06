export default function SocialAuthButtons() {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
      {[["🔵", "Google"], ["⚫", "GitHub"]].map(([icon, label]) => (
        <button
          key={label}
          style={{
            flex: 1,
            padding: "9px 0",
            background: "var(--bg4)",
            border: "1px solid var(--border2)",
            borderRadius: 8,
            color: "var(--text)",
            fontSize: 12,
            fontFamily: "var(--font-body)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            transition: "all .13s",
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.borderColor = "var(--border3)";
            event.currentTarget.style.background = "var(--bg5)";
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.borderColor = "var(--border2)";
            event.currentTarget.style.background = "var(--bg4)";
          }}
        >
          <span>{icon}</span>
          Continue with {label}
        </button>
      ))}
    </div>
  );
}
