import { Avatar, Badge } from "./ui";
import logoIcon from "../assets/scribe-logo-icon.svg";

export default function Sidebar({ screen, setScreen, user, onLogout }) {
  const profile = user || {
    name: "Guest User",
    username: "guest",
  };
  const nav = [
    { key: "dashboard", icon: "📝", label: "Posts" },
    { key: "templates", icon: "📋", label: "Templates" },
    { key: "settings", icon: "🔌", label: "API & Webhooks" },
    { key: "analytics", icon: "📊", label: "Analytics" },
    { key: "blog", icon: "🌐", label: "My Blog" },
    { key: "settings", icon: "⚙️", label: "Settings" },
    { key: "apidocs", icon: "📚", label: "API Docs" },
  ];

  return (
    <div
      style={{
        width: 220,
        background: "var(--bg2)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div
        style={{
          padding: "18px 16px 14px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
        }}
        onClick={() => setScreen("dashboard")}
      >
        <img src={logoIcon} alt="Scribe" style={{ width: 30, height: 30, borderRadius: 8, display: "block" }} />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 16,
            color: "var(--text)",
            letterSpacing: "-0.5px",
          }}
        >
          SCRIBE
        </span>
        <Badge variant="pro" style={{ marginLeft: "auto", fontSize: "9px" }}>
          PRO
        </Badge>
      </div>

      <nav
        style={{
          flex: 1,
          padding: "10px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
        }}
      >
        {nav.map((item, index) => {
          const active = screen === item.key;
          return (
            <button
              key={`${item.label}-${index}`}
              onClick={() => setScreen(item.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 8,
                background: active ? "var(--bg5)" : "transparent",
                color: active ? "var(--text)" : "var(--text2)",
                fontSize: 13,
                fontFamily: "var(--font-body)",
                fontWeight: active ? 600 : 400,
                border: active
                  ? "1px solid var(--border3)"
                  : "1px solid transparent",
                textAlign: "left",
                transition: "all .13s",
              }}
              onMouseEnter={(event) => {
                if (active) {
                  return;
                }
                event.currentTarget.style.background = "var(--bg4)";
                event.currentTarget.style.color = "var(--text)";
              }}
              onMouseLeave={(event) => {
                if (active) {
                  return;
                }
                event.currentTarget.style.background = "transparent";
                event.currentTarget.style.color = "var(--text2)";
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: "var(--bg4)",
                    color: "var(--text3)",
                    fontSize: 10,
                    fontFamily: "var(--font-mono)",
                    padding: "1px 6px",
                    borderRadius: 10,
                    border: "1px solid var(--border2)",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Avatar name={profile.name} size="sm" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text)",
              fontFamily: "var(--font-body)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "var(--text3)",
              fontFamily: "var(--font-mono)",
            }}
          >
            @{profile.username}
          </div>
        </div>
        <button
          onClick={() => {
            if (onLogout) {
              onLogout();
              return;
            }
            setScreen("settings");
          }}
          style={{ background: "none", color: "var(--text3)", fontSize: 14 }}
          title={onLogout ? "Sign out" : "Settings"}
        >
          {onLogout ? "↩" : "⚙"}
        </button>
      </div>
    </div>
  );
}
