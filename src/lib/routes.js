export const SCREEN_TO_PATH = {
  landing: "/",
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  editor: "/editor",
  templates: "/templates",
  settings: "/settings",
  analytics: "/analytics",
  blog: "/blog",
  post: "/post",
  apidocs: "/apidocs",
};

export const PATH_TO_SCREEN = Object.fromEntries(
  Object.entries(SCREEN_TO_PATH).map(([screen, path]) => [path, screen])
);

export const PROTECTED_SCREENS = new Set([
  "dashboard",
  "editor",
  "templates",
  "settings",
  "analytics",
  "apidocs",
]);

export const FULLSCREEN_SCREENS = new Set([
  "landing",
  "login",
  "signup",
  "blog",
  "post",
]);

export function getPathFromScreen(screen) {
  return SCREEN_TO_PATH[screen] || SCREEN_TO_PATH.landing;
}

export function getScreenFromPath(pathname) {
  if (pathname.startsWith("/post/")) {
    return "post";
  }

  if (PATH_TO_SCREEN[pathname]) {
    return PATH_TO_SCREEN[pathname];
  }
  return "landing";
}
