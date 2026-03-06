export function Btn({ variant = "primary", size = "md", onClick, children, loading, style = {}, ...rest }) {
  const sizeStyles = {
    sm: { padding: "5px 12px", fontSize: "11px" },
    md: { padding: "8px 16px", fontSize: "12px" },
    lg: { padding: "11px 22px", fontSize: "13px" },
  };

  const variantStyles = {
    primary: { background: "var(--accent)", color: "#000" },
    ghost: {
      background: "transparent",
      color: "var(--text2)",
      border: "1px solid var(--border2)",
    },
    danger: {
      background: "rgba(255,107,107,.12)",
      color: "var(--red)",
      border: "1px solid rgba(255,107,107,.25)",
    },
    outline: {
      background: "transparent",
      color: "var(--accent)",
      border: "1px solid var(--border3)",
    },
    subtle: {
      background: "var(--bg4)",
      color: "var(--text)",
      border: "1px solid var(--border2)",
    },
  };

  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "var(--font-mono)",
        fontWeight: 600,
        borderRadius: "8px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        transition: "all .13s",
        whiteSpace: "nowrap",
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.opacity = ".82";
        event.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.opacity = "1";
        event.currentTarget.style.transform = "translateY(0)";
      }}
      {...rest}
    >
      {loading && (
        <span
          style={{
            width: 12,
            height: 12,
            border: "2px solid currentColor",
            borderTopColor: "transparent",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin .7s linear infinite",
          }}
        />
      )}
      {children}
    </button>
  );
}

export function Badge({ variant = "draft", children, style = {} }) {
  const colors = {
    draft: { bg: "rgba(255,170,68,.12)", color: "var(--orange)", border: "rgba(255,170,68,.25)" },
    published: { bg: "rgba(0,229,160,.1)", color: "var(--green)", border: "rgba(0,229,160,.2)" },
    review: { bg: "rgba(90,171,255,.1)", color: "var(--blue)", border: "rgba(90,171,255,.2)" },
    scheduled: {
      bg: "rgba(255,209,102,.1)",
      color: "var(--yellow)",
      border: "rgba(255,209,102,.2)",
    },
    basic: { bg: "rgba(0,229,160,.1)", color: "var(--green)", border: "rgba(0,229,160,.2)" },
    intermediate: { bg: "rgba(90,171,255,.1)", color: "var(--blue)", border: "rgba(90,171,255,.2)" },
    advanced: { bg: "rgba(176,138,255,.1)", color: "var(--purple)", border: "rgba(176,138,255,.2)" },
    architect: { bg: "rgba(255,107,107,.1)", color: "var(--red)", border: "rgba(255,107,107,.2)" },
    pro: { bg: "rgba(0,204,248,.12)", color: "var(--accent)", border: "rgba(0,204,248,.25)" },
  };

  const current = colors[variant] || colors.draft;

  return (
    <span
      style={{
        background: current.bg,
        color: current.color,
        border: `1px solid ${current.border}`,
        borderRadius: "5px",
        padding: "2px 7px",
        fontSize: "10px",
        fontFamily: "var(--font-mono)",
        fontWeight: 600,
        letterSpacing: ".3px",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Avatar({ name = "AP", size = "md" }) {
  const dimension = { sm: 28, md: 36, lg: 48 }[size];
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      style={{
        width: dimension,
        height: dimension,
        borderRadius: "50%",
        background: "linear-gradient(135deg,var(--accent),var(--purple))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: dimension * 0.32,
        fontWeight: 700,
        fontFamily: "var(--font-display)",
        color: "#000",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

export function Toast({ message, type = "success", onClose }) {
  const icons = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };
  const colors = {
    success: "var(--green)",
    error: "var(--red)",
    info: "var(--blue)",
    warning: "var(--orange)",
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        background: "var(--bg3)",
        border: "1px solid var(--border2)",
        borderLeft: `3px solid ${colors[type]}`,
        borderRadius: "10px",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        minWidth: 260,
        animation: "slideDown .2s ease",
        boxShadow: "0 8px 32px rgba(0,0,0,.4)",
      }}
    >
      <span style={{ color: colors[type], fontSize: 14, fontWeight: 700 }}>{icons[type]}</span>
      <span style={{ color: "var(--text)", fontSize: 13 }}>{message}</span>
      <button onClick={onClose} style={{ marginLeft: "auto", background: "none", color: "var(--text3)", fontSize: 16 }}>
        ×
      </button>
    </div>
  );
}
