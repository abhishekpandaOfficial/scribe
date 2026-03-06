export default function ThemeToggleButton({ theme, onToggle }) {
  const isLight = theme === "light";

  return (
    <button
      onClick={onToggle}
      type="button"
      style={{
        position: "fixed",
        left: 24,
        bottom: 24,
        zIndex: 1001,
        borderRadius: 999,
        border: "1px solid var(--border2)",
        background: "var(--bg2)",
        color: "var(--text)",
        boxShadow: "0 14px 35px rgba(0,0,0,.2)",
        padding: "8px 14px",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: ".3px",
        transition: "all .16s ease",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = "translateY(-1px)";
        event.currentTarget.style.borderColor = "var(--border3)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "translateY(0)";
        event.currentTarget.style.borderColor = "var(--border2)";
      }}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
    >
      <span aria-hidden="true" style={{ fontSize: 13 }}>
        {isLight ? "🌙" : "☀"}
      </span>
      <span>{isLight ? "Dark mode" : "Light mode"}</span>
    </button>
  );
}
