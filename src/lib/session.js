const KEY = "scribe_session_v1";

export function loadSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(KEY);
}
