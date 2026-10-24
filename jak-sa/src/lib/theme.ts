export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/**
 * Applies the resolved theme to the document root. Called by the theme toggle
 * and by the pre-paint script (inlined as a string below) so the first paint
 * matches the stored preference and no light flash occurs.
 */
export function applyThemeToDocument(theme: Theme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.classList.toggle("dark", theme === "dark");
}

/**
 * Runs in <head> before first paint. Kept dependency-free and defensive:
 * storage can throw in privacy modes, in which case the system preference
 * (handled by CSS) still applies.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var key=${JSON.stringify(THEME_STORAGE_KEY)};var stored=null;try{stored=localStorage.getItem(key)}catch(e){}var theme=stored==="light"||stored==="dark"?stored:(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var root=document.documentElement;root.setAttribute("data-theme",theme);root.classList.toggle("dark",theme==="dark")}catch(e){}})();`;
