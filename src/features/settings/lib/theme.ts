/**
 * Theme preference primitives shared by the settings store and the no-flash
 * inline script in the root layout. Framework-free and side-effect-safe on the
 * server (all DOM/storage access is guarded), so it can be imported anywhere.
 */

export type ThemePreference = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

/**
 * localStorage key for the theme preference. Exported so the root layout's
 * no-flash inline script reads the same key — one source of truth.
 */
export const THEME_STORAGE_KEY = "ai-typer-theme";

/** Narrows an unknown value to a valid theme preference. */
export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

/** Reads the saved preference from localStorage, defaulting to `system`. */
export function readStoredTheme(): ThemePreference {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemePreference(value)) return value;
  } catch {
    // localStorage unavailable (SSR / private mode) — fall through to default.
  }
  return "system";
}

/** Persists the preference to localStorage. */
export function writeStoredTheme(theme: ThemePreference): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore write failures (private mode, etc.).
  }
}

/** True when the OS currently prefers a dark color scheme. */
function systemPrefersDark(): boolean {
  return (
    typeof matchMedia === "function" &&
    matchMedia("(prefers-color-scheme: dark)").matches
  );
}

/** Resolves a preference (which may be `system`) to a concrete theme. */
function resolveTheme(theme: ThemePreference): ResolvedTheme {
  if (theme === "system") return systemPrefersDark() ? "dark" : "light";
  return theme;
}

/** Writes the resolved theme to the document root so the CSS tokens switch. */
export function applyTheme(theme: ThemePreference): void {
  document.documentElement.dataset.theme = resolveTheme(theme);
}
