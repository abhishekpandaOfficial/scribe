const THEME_STORAGE_KEY = "scribe-theme";
const THEMES = {
  dark: "dark",
  light: "light",
};

function getSystemTheme() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return THEMES.dark;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches ? THEMES.light : THEMES.dark;
}

export function loadTheme() {
  if (typeof window === "undefined") {
    return THEMES.dark;
  }

  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === THEMES.dark || saved === THEMES.light) {
    return saved;
  }

  return getSystemTheme();
}

export function applyTheme(theme) {
  if (typeof document === "undefined") {
    return;
  }

  const next = theme === THEMES.light ? THEMES.light : THEMES.dark;
  document.documentElement.setAttribute("data-theme", next);
  document.documentElement.style.colorScheme = next;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  }
}

export function toggleTheme(theme) {
  return theme === THEMES.light ? THEMES.dark : THEMES.light;
}

export { THEMES };
