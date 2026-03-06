const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8787";

async function request(path, { method = "GET", token, body, headers } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error || `Request failed: ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

export const authApi = {
  register(payload) {
    return request("/api/auth/register", { method: "POST", body: payload });
  },
  login(payload) {
    return request("/api/auth/login", { method: "POST", body: payload });
  },
  me(token) {
    return request("/api/auth/me", { token });
  },
  updateProfile(token, payload) {
    return request("/api/auth/profile", { method: "PATCH", token, body: payload });
  },
};

export const postsApi = {
  list(token, status = "all") {
    return request(`/api/posts?status=${encodeURIComponent(status)}`, { token });
  },
  create(token, payload) {
    return request("/api/posts", { method: "POST", token, body: payload });
  },
  update(token, id, payload) {
    return request(`/api/posts/${id}`, { method: "PATCH", token, body: payload });
  },
  remove(token, id) {
    return request(`/api/posts/${id}`, { method: "DELETE", token });
  },
};

export const settingsApi = {
  keys(token) {
    return request("/api/api-keys", { token });
  },
  createKey(token, payload) {
    return request("/api/api-keys", { method: "POST", token, body: payload });
  },
  revokeKey(token, id) {
    return request(`/api/api-keys/${id}`, { method: "DELETE", token });
  },
  webhooks(token) {
    return request("/api/webhooks", { token });
  },
  createWebhook(token, payload) {
    return request("/api/webhooks", { method: "POST", token, body: payload });
  },
  testWebhook(token, id) {
    return request(`/api/webhooks/${id}/test`, { method: "POST", token });
  },
  deleteWebhook(token, id) {
    return request(`/api/webhooks/${id}`, { method: "DELETE", token });
  },
};

export const analyticsApi = {
  overview(token) {
    return request("/api/analytics/overview", { token });
  },
};

export const publicApi = {
  profile(username) {
    return request(`/api/public/${encodeURIComponent(username)}/profile`);
  },
  posts(username) {
    return request(`/api/public/${encodeURIComponent(username)}/posts`);
  },
  post(username, slug) {
    return request(`/api/public/${encodeURIComponent(username)}/posts/${encodeURIComponent(slug)}`);
  },
};

export { API_URL };
