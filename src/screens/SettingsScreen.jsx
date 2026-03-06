import { useEffect, useState } from "react";
import { authApi, settingsApi } from "../lib/apiClient";
import { Avatar, Badge, Btn } from "../components/ui";

export default function SettingsScreen({ token, user, toast, onProfileUpdate }) {
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    website: user?.website || "",
    twitter: user?.twitter || "",
    github: user?.github || "",
  });

  const [domain, setDomain] = useState("");
  const [dnsStep, setDnsStep] = useState(0);

  const [apiKeys, setApiKeys] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [loadingHooks, setLoadingHooks] = useState(false);

  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState(null);

  const [showWHModal, setShowWHModal] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: "",
    url: "",
    events: ["post.published"],
  });

  const navItems = [
    { key: "profile", icon: "👤", label: "Profile" },
    { key: "domain", icon: "🌐", label: "Domain & Publishing" },
    { key: "api", icon: "🔌", label: "API Keys" },
    { key: "webhooks", icon: "🔄", label: "Webhooks" },
    { key: "billing", icon: "💳", label: "Billing" },
    { key: "security", icon: "🔐", label: "Security" },
    { key: "team", icon: "👥", label: "Team" },
  ];

  const loadKeys = async () => {
    if (!token) return;
    try {
      setLoadingKeys(true);
      const response = await settingsApi.keys(token);
      setApiKeys(response.data || []);
    } catch (error) {
      toast(error.message || "Failed to load API keys", "error");
    } finally {
      setLoadingKeys(false);
    }
  };

  const loadWebhooks = async () => {
    if (!token) return;
    try {
      setLoadingHooks(true);
      const response = await settingsApi.webhooks(token);
      setWebhooks(response.data || []);
    } catch (error) {
      toast(error.message || "Failed to load webhooks", "error");
    } finally {
      setLoadingHooks(false);
    }
  };

  useEffect(() => {
    setProfile({
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
      website: user?.website || "",
      twitter: user?.twitter || "",
      github: user?.github || "",
    });
  }, [user]);

  useEffect(() => {
    loadKeys();
    loadWebhooks();
  }, [token]);

  const saveProfile = async () => {
    if (!token) return;
    try {
      const response = await authApi.updateProfile(token, profile);
      onProfileUpdate?.(response.user);
      toast("Profile saved ✓");
    } catch (error) {
      toast(error.message || "Failed to update profile", "error");
    }
  };

  const createKey = async () => {
    if (!token) return;
    try {
      const response = await settingsApi.createKey(token, {
        name: newKeyName || "New Key",
        permissions: ["read"],
      });
      setCreatedKey(response.apiKey);
      setApiKeys((prev) => [response.data, ...prev]);
      toast("API key created");
    } catch (error) {
      toast(error.message || "Failed to create API key", "error");
    }
  };

  const revokeKey = async (id) => {
    if (!token) return;
    try {
      await settingsApi.revokeKey(token, id);
      setApiKeys((prev) => prev.filter((item) => item.id !== id));
      toast("Key revoked", "info");
    } catch (error) {
      toast(error.message || "Failed to revoke key", "error");
    }
  };

  const addWebhook = async () => {
    if (!token) return;
    try {
      const response = await settingsApi.createWebhook(token, newWebhook);
      setWebhooks((prev) => [response.data, ...prev]);
      setShowWHModal(false);
      setNewWebhook({ name: "", url: "", events: ["post.published"] });
      toast("Webhook saved!");
    } catch (error) {
      toast(error.message || "Failed to create webhook", "error");
    }
  };

  const testWebhook = async (id) => {
    if (!token) return;
    try {
      const response = await settingsApi.testWebhook(token, id);
      setWebhooks((prev) => prev.map((item) => (item.id === id ? response.data : item)));
      toast("Test sent!");
    } catch (error) {
      toast(error.message || "Failed to test webhook", "error");
    }
  };

  const deleteWebhook = async (id) => {
    if (!token) return;
    try {
      await settingsApi.deleteWebhook(token, id);
      setWebhooks((prev) => prev.filter((item) => item.id !== id));
      toast("Webhook deleted", "info");
    } catch (error) {
      toast(error.message || "Failed to delete webhook", "error");
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden", background: "var(--bg)" }}>
      <div style={{ width: 220, background: "var(--bg2)", borderRight: "1px solid var(--border)", padding: "20px 12px", flexShrink: 0 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text)", padding: "0 8px", marginBottom: 14 }}>Settings</h2>
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 10px",
              borderRadius: 8,
              background: tab === item.key ? "var(--bg5)" : "transparent",
              color: tab === item.key ? "var(--text)" : "var(--text2)",
              width: "100%",
              textAlign: "left",
              fontSize: 13,
              fontFamily: "var(--font-body)",
              fontWeight: tab === item.key ? 600 : 400,
              border: tab === item.key ? "1px solid var(--border3)" : "1px solid transparent",
              marginBottom: 2,
              transition: "all .13s",
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "28px 36px" }}>
        {tab === "profile" && (
          <div style={{ maxWidth: 580 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text)", marginBottom: 24 }}>Profile</h2>
            <div style={{ display: "flex", gap: 20, marginBottom: 24, alignItems: "center" }}>
              <Avatar name={profile.name || "AP"} size="lg" />
              <div>
                <Btn variant="ghost" size="sm">Upload photo</Btn>
                <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 6, fontFamily: "var(--font-mono)" }}>JPG or PNG · Max 2MB</p>
              </div>
            </div>

            {[
              ["Display name", "name", "Abhishek Panda"],
              ["Username", "username", "abhishekpanda"],
              ["Email", "email", "you@example.com"],
              ["Website URL", "website", "https://yoursite.com"],
              ["Twitter / X", "twitter", "@handle"],
              ["GitHub", "github", "@username"],
            ].map(([label, key, placeholder]) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-mono)", fontWeight: 500, marginBottom: 5 }}>{label}</label>
                <input
                  value={profile[key] || ""}
                  onChange={(event) => setProfile((prev) => ({ ...prev, [key]: event.target.value }))}
                  placeholder={placeholder}
                  style={{ fontSize: 13 }}
                />
              </div>
            ))}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-mono)", fontWeight: 500, marginBottom: 5 }}>
                Bio <span style={{ color: "var(--text3)" }}>{(profile.bio || "").length}/200</span>
              </label>
              <textarea
                value={profile.bio || ""}
                onChange={(event) => setProfile((prev) => ({ ...prev, bio: event.target.value }))}
                rows={3}
                style={{ fontSize: 13, resize: "vertical" }}
                maxLength={200}
              />
            </div>
            <Btn variant="primary" onClick={saveProfile}>Save changes</Btn>
          </div>
        )}

        {tab === "domain" && (
          <div style={{ maxWidth: 580 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text)", marginBottom: 24 }}>Domain & Publishing</h2>
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent)" }}>{profile.username || "workspace"}.scribe.dev</p>
                <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 3 }}>Default subdomain</p>
              </div>
              <Badge variant="published">Active ✅</Badge>
            </div>

            <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 12, padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 4 }}>Connect your own domain</h3>
              <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 14 }}>SSL included, zero config.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <input value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="blog.abhishekpanda.com" style={{ flex: 1, fontSize: 13 }} />
                <Btn variant="primary" size="sm" onClick={() => {
                  if (!domain) return;
                  setDnsStep(1);
                  toast("Domain added! Configure DNS below.");
                }}>Connect →</Btn>
              </div>

              {dnsStep > 0 && (
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>
                    Add CNAME: <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}>{domain} → sites.scribe.dev</span>
                  </div>
                  <Btn variant="ghost" size="sm" onClick={() => toast("Checking DNS…")}>Check DNS status</Btn>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "api" && (
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text)", marginBottom: 4 }}>REST API Keys</h2>
                <p style={{ fontSize: 12, color: "var(--text2)" }}>Use these to fetch your content from any frontend.</p>
              </div>
              <Btn variant="primary" size="sm" onClick={() => setShowKeyModal(true)}>+ Create new API key</Btn>
            </div>

            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg3)" }}>
                    {["Name", "Key", "Permissions", "Last Used", "Expires", ""].map((heading) => (
                      <th key={heading} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)", borderBottom: "1px solid var(--border)" }}>{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((key) => (
                    <tr key={key.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{key.name}</td>
                      <td style={{ padding: "12px 14px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text2)" }}>{key.prefix}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", gap: 4 }}>
                          {key.perms.map((perm) => (
                            <Badge key={perm} variant="pro" style={{ fontSize: "9px" }}>{perm}</Badge>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>{key.lastUsed}</td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>{key.expires}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <button onClick={() => revokeKey(key.id)} style={{ background: "rgba(255,107,107,.1)", color: "var(--red)", border: "1px solid rgba(255,107,107,.2)", borderRadius: 5, fontSize: 11, fontFamily: "var(--font-mono)", padding: "3px 8px", cursor: "pointer" }}>Revoke</button>
                      </td>
                    </tr>
                  ))}
                  {!apiKeys.length && (
                    <tr>
                      <td colSpan={6} style={{ padding: 22, textAlign: "center", color: "var(--text3)", fontFamily: "var(--font-mono)" }}>{loadingKeys ? "Loading keys..." : "No API keys yet"}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {showKeyModal && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 800 }} onClick={() => {
                if (!createdKey) {
                  setShowKeyModal(false);
                }
              }}>
                <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 14, padding: 28, width: 420, animation: "fadeIn .2s ease" }} onClick={(event) => event.stopPropagation()}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text)", marginBottom: 20 }}>{createdKey ? "Your new API key" : "Create API Key"}</h3>
                  {createdKey ? (
                    <div>
                      <div style={{ background: "rgba(255,170,68,.07)", border: "1px solid rgba(255,170,68,.3)", borderRadius: 8, padding: 12, marginBottom: 14 }}>
                        <p style={{ fontSize: 11, color: "var(--orange)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>⚠ Copy now — won't be shown again</p>
                        <code style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--green)", wordBreak: "break-all" }}>{createdKey}</code>
                      </div>
                      <Btn variant="primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => {
                        setShowKeyModal(false);
                        setCreatedKey(null);
                        setNewKeyName("");
                      }}>Done</Btn>
                    </div>
                  ) : (
                    <div>
                      <div style={{ marginBottom: 14 }}>
                        <label style={{ display: "block", fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-mono)", marginBottom: 5 }}>NAME</label>
                        <input value={newKeyName} onChange={(event) => setNewKeyName(event.target.value)} placeholder="e.g. My Next.js site" style={{ fontSize: 13 }} />
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <Btn variant="ghost" onClick={() => setShowKeyModal(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</Btn>
                        <Btn variant="primary" onClick={createKey} style={{ flex: 1, justifyContent: "center" }}>Create key</Btn>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "webhooks" && (
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--text)", marginBottom: 4 }}>Webhooks</h2>
                <p style={{ fontSize: 12, color: "var(--text2)" }}>Notify your infrastructure when content changes.</p>
              </div>
              <Btn variant="primary" size="sm" onClick={() => setShowWHModal(true)}>+ Add Webhook</Btn>
            </div>

            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", marginBottom: 24 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg3)" }}>
                    {["Name", "URL", "Events", "Last Trigger", "Status", "Actions"].map((heading) => (
                      <th key={heading} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: "var(--text3)", fontFamily: "var(--font-mono)", borderBottom: "1px solid var(--border)" }}>{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {webhooks.map((hook) => (
                    <tr key={hook.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{hook.name}</td>
                      <td style={{ padding: "12px 14px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text3)", maxWidth: 190, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{hook.url}</td>
                      <td style={{ padding: "12px 14px" }}><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{hook.events.map((event) => <Badge key={event} variant="review" style={{ fontSize: "9px" }}>{event}</Badge>)}</div></td>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--text3)", fontFamily: "var(--font-mono)" }}>{hook.lastTrigger}</td>
                      <td style={{ padding: "12px 14px" }}><Badge variant={hook.status >= 200 && hook.status < 300 ? "published" : "draft"}>{hook.status ? `⚡ ${hook.status}` : "—"}</Badge></td>
                      <td style={{ padding: "12px 14px", display: "flex", gap: 6 }}>
                        <Btn variant="ghost" size="sm" onClick={() => testWebhook(hook.id)}>Test</Btn>
                        <Btn variant="danger" size="sm" onClick={() => deleteWebhook(hook.id)}>Delete</Btn>
                      </td>
                    </tr>
                  ))}
                  {!webhooks.length && (
                    <tr>
                      <td colSpan={6} style={{ padding: 22, textAlign: "center", color: "var(--text3)", fontFamily: "var(--font-mono)" }}>{loadingHooks ? "Loading webhooks..." : "No webhooks configured"}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {showWHModal && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 800 }} onClick={() => setShowWHModal(false)}>
                <div style={{ background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 14, padding: 28, width: 440, animation: "fadeIn .2s ease" }} onClick={(event) => event.stopPropagation()}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text)", marginBottom: 20 }}>Add Webhook</h3>

                  {["name", "url"].map((field) => (
                    <div key={field} style={{ marginBottom: 14 }}>
                      <label style={{ display: "block", fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-mono)", marginBottom: 5 }}>{field.toUpperCase()}</label>
                      <input
                        value={newWebhook[field]}
                        onChange={(event) => setNewWebhook((prev) => ({ ...prev, [field]: event.target.value }))}
                        placeholder={field === "name" ? "e.g. Vercel Rebuild" : "https://example.com/webhook"}
                        style={{ fontSize: 13 }}
                      />
                    </div>
                  ))}

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 12, color: "var(--text2)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>EVENTS</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      {["post.published", "post.updated", "post.deleted", "post.scheduled", "post.*", "webhook.test"].map((event) => (
                        <label key={event} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "var(--text2)", cursor: "pointer", fontFamily: "var(--font-mono)" }}>
                          <input
                            type="checkbox"
                            checked={newWebhook.events.includes(event)}
                            onChange={(e) => {
                              setNewWebhook((prev) => ({
                                ...prev,
                                events: e.target.checked
                                  ? [...prev.events, event]
                                  : prev.events.filter((item) => item !== event),
                              }));
                            }}
                          />
                          {event}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <Btn variant="ghost" onClick={() => setShowWHModal(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</Btn>
                    <Btn variant="primary" onClick={addWebhook} style={{ flex: 1, justifyContent: "center" }}>Save</Btn>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {(tab === "billing" || tab === "security" || tab === "team") && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: 12 }}>
            <span style={{ fontSize: 48 }}>{tab === "billing" ? "💳" : tab === "security" ? "🔐" : "👥"}</span>
            <span style={{ color: "var(--text2)", fontSize: 16, fontFamily: "var(--font-display)", fontWeight: 700, textTransform: "capitalize" }}>{tab}</span>
            <span style={{ color: "var(--text3)", fontSize: 12, fontFamily: "var(--font-mono)" }}>Coming soon in the production build.</span>
          </div>
        )}
      </div>
    </div>
  );
}
