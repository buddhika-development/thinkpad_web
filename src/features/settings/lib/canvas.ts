/**
 * Writing-canvas style preference. Framework-free so it can be read
 * synchronously at startup, like the theme preference.
 */

export type CanvasStyle = "blank" | "ruled" | "dotted";

const STORAGE_KEY = "ai-typer-canvas";

/** Narrows an unknown value to a valid canvas style. */
export function isCanvasStyle(value: unknown): value is CanvasStyle {
  return value === "blank" || value === "ruled" || value === "dotted";
}

/** Reads the saved canvas style, defaulting to `ruled` (notebook feel). */
export function readStoredCanvasStyle(): CanvasStyle {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (isCanvasStyle(value)) return value;
  } catch {
    // localStorage unavailable — fall through to the default.
  }
  return "ruled";
}

/** Persists the canvas style to localStorage. */
export function writeStoredCanvasStyle(style: CanvasStyle): void {
  try {
    localStorage.setItem(STORAGE_KEY, style);
  } catch {
    // Ignore write failures.
  }
}
