import { useState } from "react";
import LocalhostBypassButton from "../components/LocalhostBypassButton";
import AuthField from "../components/auth/AuthField";
import AuthTabs from "../components/auth/AuthTabs";
import SocialAuthButtons from "../components/auth/SocialAuthButtons";
import { Btn } from "../components/ui";
import { authApi } from "../lib/apiClient";

export default function AuthScreen({ mode, setScreen, toast, onLocalBypass, onAuthSuccess }) {
  const [tab, setTab] = useState(mode === "signup" ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!email.includes("@")) {
      nextErrors.email = "Enter a valid email";
    }
    if (pass.length < 8) {
      nextErrors.pass = "Password must be 8+ chars";
    }
    if (tab === "signup") {
      if (!name.trim()) {
        nextErrors.name = "Name is required";
      }
      if (username.length < 3) {
        nextErrors.username = "Username must be 3+ chars";
      }
      if (pass !== confirmPass) {
        nextErrors.confirmPass = "Passwords don't match";
      }
    }
    return nextErrors;
  };

  const handleSubmit = async () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      const payload =
        tab === "login"
          ? await authApi.login({ email, password: pass })
          : await authApi.register({
              name,
              username,
              email,
              password: pass,
            });

      onAuthSuccess?.(payload);
      toast(tab === "login" ? "Welcome back! 👋" : "Account created! 🎉");
      setScreen("dashboard");
    } catch (error) {
      toast(error.message || "Authentication failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "15%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(0,204,248,.07) 0%,transparent 70%)",
          animation: "orb 15s ease infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "15%",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(176,138,255,.07) 0%,transparent 70%)",
          animation: "orb 20s ease infinite reverse",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border2)",
          borderRadius: 16,
          padding: 36,
          width: 420,
          position: "relative",
          zIndex: 1,
          animation: "fadeIn .3s ease",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "linear-gradient(135deg,var(--accent),var(--blue))",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 800,
              color: "#000",
              fontFamily: "var(--font-display)",
              marginBottom: 10,
            }}
          >
            S
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 20,
              color: "var(--text)",
              letterSpacing: "-0.5px",
            }}
          >
            scri·be
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)", marginTop: 3 }}>
            Developer-first publishing
          </div>
        </div>

        <AuthTabs tab={tab} setTab={setTab} />
        <SocialAuthButtons />

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: "var(--border2)" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text3)" }}>
            or continue with email
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--border2)" }} />
        </div>

        {tab === "signup" && (
          <AuthField
            label="Full name"
            value={name}
            onChange={setName}
            placeholder="Abhishek Panda"
            error={errors.name}
          />
        )}

        <AuthField
          label="Email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          error={errors.email}
        />

        {tab === "signup" && (
          <div>
            <AuthField
              label="Username"
              value={username}
              onChange={(value) => setUsername(value.toLowerCase())}
              placeholder="abhishekpanda"
              error={errors.username}
            />
            {username && (
              <p
                style={{
                  fontSize: 11,
                  color: "var(--accent)",
                  fontFamily: "var(--font-mono)",
                  marginTop: -10,
                  marginBottom: 12,
                }}
              >
                → scribe.dev/{username}
              </p>
            )}
          </div>
        )}

        <AuthField
          label="Password"
          value={pass}
          onChange={setPass}
          type={showPass ? "text" : "password"}
          placeholder={tab === "login" ? "Enter password" : "Min 8 characters"}
          error={errors.pass}
          rightEl={
            <button
              onClick={() => setShowPass((visible) => !visible)}
              style={{
                background: "none",
                color: "var(--text3)",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                border: "none",
              }}
            >
              {showPass ? "hide" : "show"}
            </button>
          }
        />

        {tab === "signup" && (
          <AuthField
            label="Confirm password"
            value={confirmPass}
            onChange={setConfirmPass}
            type="password"
            placeholder="Repeat password"
            error={errors.confirmPass}
          />
        )}

        {tab === "login" && (
          <div style={{ textAlign: "right", marginBottom: 16, marginTop: -8 }}>
            <button
              style={{
                background: "none",
                color: "var(--text3)",
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                border: "none",
              }}
            >
              Forgot password?
            </button>
          </div>
        )}

        {tab === "signup" && (
          <label
            style={{
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
              marginBottom: 16,
              fontSize: 12,
              color: "var(--text2)",
              cursor: "pointer",
            }}
          >
            <input type="checkbox" style={{ width: 14, height: 14, marginTop: 2 }} />I agree to
            <span style={{ color: "var(--accent)" }}>Terms</span> and
            <span style={{ color: "var(--accent)" }}>Privacy Policy</span>
          </label>
        )}

        <Btn
          variant="primary"
          onClick={handleSubmit}
          loading={loading}
          style={{ width: "100%", justifyContent: "center", padding: "11px 0" }}
        >
          {tab === "login" ? "Continue →" : "Create free account →"}
        </Btn>

        <div style={{ marginTop: 10 }}>
          <LocalhostBypassButton
            onBypass={async () => {
              const ok = await onLocalBypass?.();
              if (ok) {
                setScreen("dashboard");
              }
            }}
            style={{ width: "100%" }}
          />
        </div>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--text3)" }}>
          {tab === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setTab("signup")}
                style={{
                  background: "none",
                  color: "var(--accent)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  border: "none",
                }}
              >
                Sign up free
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setTab("login")}
                style={{
                  background: "none",
                  color: "var(--accent)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  border: "none",
                }}
              >
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
