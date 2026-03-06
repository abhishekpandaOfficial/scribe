export default function AuthTabs({ tab, setTab }) {
  return (
    <div
      style={{
        display: "flex",
        background: "var(--bg3)",
        borderRadius: 10,
        padding: 3,
        marginBottom: 24,
        border: "1px solid var(--border)",
      }}
    >
      {["login", "signup"].map((item) => (
        <button
          key={item}
          onClick={() => setTab(item)}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 8,
            background: tab === item ? "var(--bg5)" : "transparent",
            color: tab === item ? "var(--text)" : "var(--text2)",
            fontSize: 13,
            fontFamily: "var(--font-body)",
            fontWeight: tab === item ? 600 : 400,
            border: tab === item ? "1px solid var(--border3)" : "none",
            transition: "all .13s",
          }}
        >
          {item === "login" ? "Log in" : "Sign up"}
        </button>
      ))}
    </div>
  );
}
