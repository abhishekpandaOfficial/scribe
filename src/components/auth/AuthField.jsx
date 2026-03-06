export default function AuthField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  rightEl,
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: 12,
            color: "var(--text2)",
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
            marginBottom: 6,
          }}
        >
          {label}
        </label>
      )}

      <div style={{ position: "relative" }}>
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          style={
            error
              ? {
                  borderColor: "var(--red)",
                  boxShadow: "0 0 0 3px rgba(255,107,107,.1)",
                }
              : {}
          }
        />
        {rightEl && (
          <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>
            {rightEl}
          </div>
        )}
      </div>

      {error && (
        <p style={{ fontSize: 11, color: "var(--red)", marginTop: 5, fontFamily: "var(--font-mono)" }}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
}
