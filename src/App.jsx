import { useCallback, useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import ThemeToggleButton from "./components/ThemeToggleButton";
import { Toast } from "./components/ui";
import useToast from "./hooks/useToast";
import { authApi, postsApi } from "./lib/apiClient";
import { clearSession, loadSession, saveSession } from "./lib/session";
import { applyTheme, loadTheme as loadStoredTheme, toggleTheme } from "./lib/theme";
import AuthScreen from "./screens/AuthScreen";
import LandingScreen from "./screens/LandingScreen";
import DashboardScreen from "./screens/DashboardScreen";
import EditorScreen from "./screens/EditorScreen";
import TemplatesScreen from "./screens/TemplatesScreen";
import SettingsScreen from "./screens/SettingsScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import BlogScreen from "./screens/BlogScreen";
import PostScreen from "./screens/PostScreen";
import ApiDocsScreen from "./screens/ApiDocsScreen";
import GlobalStyle from "./styles/GlobalStyle";

function formatRelative(iso) {
  if (!iso) {
    return "just now";
  }

  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
}

function toUiPost(post) {
  return {
    ...post,
    updated: formatRelative(post.updatedAt || post.updated_at),
    tags: post.tags || [],
    readTime: post.readTime || post.read_time || "5 min",
  };
}

export default function App() {
  const [theme, setTheme] = useState(loadStoredTheme);
  const [screen, setScreen] = useState("landing");
  const [editPost, setEditPost] = useState(null);
  const [session, setSession] = useState(loadSession());
  const [posts, setPosts] = useState([]);
  const [booting, setBooting] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const { toasts, show: showToast, remove: removeToast } = useToast();

  const isProtected = ["dashboard", "editor", "templates", "settings", "analytics", "apidocs"].includes(screen);
  const isFullScreen = ["landing", "login", "signup", "blog", "post"].includes(screen);

  const token = session?.token || null;
  const currentUser = session?.user || null;

  const toast = useCallback((message, type = "success") => showToast(message, type), [showToast]);

  const refreshPosts = useCallback(async () => {
    if (!token) {
      setPosts([]);
      return;
    }

    setLoadingPosts(true);
    try {
      const response = await postsApi.list(token, "all");
      setPosts((response.data || []).map(toUiPost));
    } catch (error) {
      toast(error.message || "Failed to load posts", "error");
    } finally {
      setLoadingPosts(false);
    }
  }, [token, toast]);

  useEffect(() => {
    let alive = true;

    const hydrate = async () => {
      const existing = loadSession();
      if (!existing?.token) {
        if (alive) setBooting(false);
        return;
      }

      try {
        const me = await authApi.me(existing.token);
        if (!alive) return;
        const next = { token: existing.token, user: me.user };
        setSession(next);
        saveSession(next);
      } catch {
        clearSession();
        if (alive) {
          setSession(null);
        }
      } finally {
        if (alive) setBooting(false);
      }
    };

    hydrate();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!token) {
      setPosts([]);
      return;
    }
    refreshPosts();
  }, [token, refreshPosts]);

  useEffect(() => {
    if (isProtected && !token && !booting) {
      setScreen("login");
    }
  }, [isProtected, token, booting]);

  useEffect(() => {
    if (token && screen === "landing") {
      setScreen("dashboard");
    }
  }, [token, screen]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleAuthSuccess = useCallback(
    (payload) => {
      const next = {
        token: payload.token,
        user: payload.user,
      };
      setSession(next);
      saveSession(next);
      setScreen("dashboard");
      toast("Signed in successfully", "success");
    },
    [toast]
  );

  const handleLogout = () => {
    clearSession();
    setSession(null);
    setPosts([]);
    setEditPost(null);
    setScreen("login");
    toast("Signed out", "info");
  };

  const apiContext = useMemo(
    () => ({
      token,
      user: currentUser,
      posts,
      setPosts,
      refreshPosts,
      loadingPosts,
    }),
    [token, currentUser, posts, refreshPosts, loadingPosts]
  );

  if (booting) {
    return (
      <>
        <GlobalStyle />
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg)",
            color: "var(--text2)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Booting Scribe…
        </div>
        <ThemeToggleButton theme={theme} onToggle={() => setTheme((current) => toggleTheme(current))} />
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
        {isProtected && token && (
          <Sidebar screen={screen} setScreen={setScreen} user={currentUser} onLogout={handleLogout} />
        )}

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            overflow: isFullScreen ? "visible" : "hidden",
          }}
        >
          {screen === "landing" && <LandingScreen setScreen={setScreen} />}
          {screen === "login" && (
            <AuthScreen
              mode="login"
              setScreen={setScreen}
              toast={(msg, type) => toast(msg, type || "success")}
              onAuthSuccess={handleAuthSuccess}
            />
          )}
          {screen === "signup" && (
            <AuthScreen
              mode="signup"
              setScreen={setScreen}
              toast={(msg, type) => toast(msg, type || "success")}
              onAuthSuccess={handleAuthSuccess}
            />
          )}
          {screen === "dashboard" && (
            <DashboardScreen
              setScreen={setScreen}
              setEditPost={setEditPost}
              toast={(msg, type) => toast(msg, type || "success")}
              posts={apiContext.posts}
              user={apiContext.user}
              loading={apiContext.loadingPosts}
              refreshPosts={apiContext.refreshPosts}
            />
          )}
          {screen === "editor" && (
            <EditorScreen
              post={editPost}
              setScreen={setScreen}
              toast={(msg, type) => toast(msg, type || "success")}
              token={apiContext.token}
              onPostSaved={(saved) => {
                setEditPost(toUiPost(saved));
                refreshPosts();
              }}
              onPostDeleted={() => {
                setEditPost(null);
                refreshPosts();
                setScreen("dashboard");
              }}
            />
          )}
          {screen === "templates" && <TemplatesScreen setScreen={setScreen} toast={(msg) => toast(msg, "success")} />}
          {screen === "settings" && (
            <SettingsScreen
              token={apiContext.token}
              user={apiContext.user}
              toast={(msg, type) => toast(msg, type || "success")}
              onProfileUpdate={(user) => {
                const next = { token: apiContext.token, user };
                setSession(next);
                saveSession(next);
              }}
            />
          )}
          {screen === "analytics" && (
            <AnalyticsScreen
              token={apiContext.token}
              toast={(msg, type) => toast(msg, type || "info")}
            />
          )}
          {screen === "blog" && (
            <BlogScreen
              setScreen={setScreen}
              posts={apiContext.posts}
              user={apiContext.user}
              setEditPost={setEditPost}
            />
          )}
          {screen === "post" && (
            <PostScreen post={editPost} setScreen={setScreen} user={apiContext.user} />
          )}
          {screen === "apidocs" && <ApiDocsScreen />}
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {toasts.map((item) => (
          <Toast key={item.id} message={item.message} type={item.type} onClose={() => removeToast(item.id)} />
        ))}
      </div>
      <ThemeToggleButton theme={theme} onToggle={() => setTheme((current) => toggleTheme(current))} />
    </>
  );
}
