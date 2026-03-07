import { useLocation } from "react-router-dom";
import { Btn } from "../components/ui";
import logoIcon from "../assets/scribe-logo-icon.svg";

export default function ScribeErrorScreen({ setScreen }) {
  const location = useLocation();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "min(680px, 100%)",
          border: "1px solid var(--border2)",
          borderRadius: 16,
          background: "var(--bg2)",
          padding: 28,
          textAlign: "center",
          boxShadow: "var(--hero-shadow-rest)",
        }}
      >
        <img src={logoIcon} alt="Scribe" style={{ width: 54, height: 54, borderRadius: 14, marginBottom: 14 }} />
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)", marginBottom: 8 }}>
          SCRIBE ERROR PAGE
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px,4vw,40px)",
            lineHeight: 1.15,
            color: "var(--text)",
            letterSpacing: "-0.6px",
            marginBottom: 10,
          }}
        >
          Route not found
        </h1>
        <p style={{ color: "var(--text2)", lineHeight: 1.7, marginBottom: 14 }}>
          The page you requested does not exist in this deployment or the route is invalid.
        </p>
        <code
          style={{
            display: "inline-block",
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            color: "var(--accent)",
            borderRadius: 8,
            fontSize: 12,
            fontFamily: "var(--font-mono)",
            padding: "6px 10px",
            marginBottom: 18,
          }}
        >
          {location.pathname}
        </code>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn variant="primary" onClick={() => setScreen("dashboard")}>
            Open dashboard
          </Btn>
          <Btn variant="ghost" onClick={() => setScreen("landing")}>
            Go home
          </Btn>
        </div>
      </div>
    </div>
  );
}
