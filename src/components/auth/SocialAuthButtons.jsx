export default function SocialAuthButtons() {
  const providers = [
    {
      label: "Google",
      logo: (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#EA4335" d="M12 5.2c1.74 0 3.3.6 4.53 1.78l3.38-3.38C17.86 1.71 15.16.6 12 .6 7.3.6 3.25 3.3 1.28 7.2l3.94 3.05c.95-2.86 3.63-5.05 6.78-5.05z" />
          <path fill="#4285F4" d="M23.4 12.27c0-.83-.07-1.43-.23-2.08H12v4.43h6.54c-.13 1.1-.86 2.76-2.47 3.87l3.82 2.95c2.29-2.11 3.51-5.21 3.51-9.17z" />
          <path fill="#34A853" d="M5.22 13.75 1.28 16.8C3.23 20.67 7.29 23.4 12 23.4c3.16 0 5.84-1.04 7.8-2.83l-3.82-2.95c-1.02.71-2.39 1.22-3.98 1.22-3.1 0-5.74-2.1-6.78-5.09z" />
          <path fill="#FBBC05" d="M5.22 10.25c-.26-.79-.4-1.64-.4-2.53s.14-1.74.4-2.53L1.28 2.15A11.7 11.7 0 0 0 .6 7.72c0 1.89.44 3.67 1.23 5.2z" />
        </svg>
      ),
    },
    {
      label: "Apple",
      logo: (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M17.05 12.54c.03 2.87 2.52 3.82 2.55 3.83-.02.07-.4 1.38-1.32 2.73-.8 1.16-1.62 2.32-2.93 2.34-1.3.02-1.72-.78-3.2-.78-1.48 0-1.95.76-3.18.8-1.27.05-2.24-1.27-3.05-2.42-1.66-2.4-2.93-6.78-1.22-9.75.85-1.47 2.38-2.39 4.03-2.42 1.26-.02 2.44.85 3.2.85.76 0 2.2-1.06 3.7-.9.63.03 2.41.25 3.55 1.92-.09.06-2.12 1.24-2.13 3.8zM14.9 5.4c.67-.81 1.12-1.94 1-3.07-.96.04-2.1.64-2.79 1.45-.62.72-1.16 1.87-1.01 2.97 1.07.08 2.14-.54 2.8-1.35z"
          />
        </svg>
      ),
    },
    {
      label: "GitHub",
      logo: (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.8 9.6.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.5 1.1 3.1.9.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.2-4.6-5.2 0-1.2.4-2.2 1-3-.1-.3-.4-1.4.1-2.9 0 0 .9-.3 3 .9a9.7 9.7 0 0 1 5.4 0c2-1.2 2.9-.9 2.9-.9.6 1.5.2 2.6.1 2.9.7.8 1 1.8 1 3 0 4.1-2.4 4.9-4.7 5.2.4.3.8 1 .8 2v3c0 .3.2.6.7.5 4-1.3 6.8-5.1 6.8-9.6C22 6.6 17.5 2 12 2z"
          />
        </svg>
      ),
    },
    {
      label: "Microsoft",
      logo: (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#F25022" d="M2 2h9.5v9.5H2z" />
          <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5z" />
          <path fill="#00A4EF" d="M2 12.5h9.5V22H2z" />
          <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      logo: (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#0A66C2"
            d="M20.4 20.4h-3.5V15c0-1.3 0-3-1.8-3-1.8 0-2.1 1.4-2.1 2.9v5.5H9.5V9.1h3.3v1.5h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.2 2.4 4.2 5.5v6.1zM5.5 7.6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM7.2 20.4H3.7V9.1h3.5v11.3zM22 2H2C.9 2 0 2.9 0 4v16c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "nowrap", justifyContent: "space-between" }}>
      {providers.map(({ label, logo }) => (
        <button
          key={label}
          aria-label={`Continue with ${label}`}
          title={`Continue with ${label}`}
          style={{
            width: 42,
            height: 40,
            padding: 0,
            background: "var(--bg4)",
            border: "1px solid var(--border2)",
            borderRadius: 10,
            color: "var(--text)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
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
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{logo}</span>
        </button>
      ))}
    </div>
  );
}
