import { create } from "zustand";

import { type CanvasStyle, writeStoredCanvasStyle } from "../lib/canvas";
import {
  applyTheme,
  type ThemePreference,
  writeStoredTheme,
} from "../lib/theme";

type SettingsState = {
  theme: ThemePreference;
  canvasStyle: CanvasStyle;
  /** Persists the theme locally and applies it to the document. */
  setTheme: (theme: ThemePreference) => void;
  /** Alias of `setTheme` for adopting an external value (profile sync). */
  hydrateTheme: (theme: ThemePreference) => void;
  /** Persists the writing-canvas style locally. */
  setCanvasStyle: (style: CanvasStyle) => void;
  /** Alias of `setCanvasStyle` for adopting an external value (profile sync). */
  hydrateCanvasStyle: (style: CanvasStyle) => void;
};

/**
 * UI/settings state (theme + writing-canvas style). Starts at fixed defaults so
 * the server and the client's first render agree (no hydration mismatch); the
 * real stored/profile preferences are applied on mount by `SettingsSyncProvider`.
 * The page theme never flashes — the no-flash inline script paints it before
 * React runs, independent of this store.
 *
 * `set*` and `hydrate*` share one implementation; the only difference — firing
 * the best-effort profile write-back — lives in the `useTheme`/`useCanvasStyle`
 * hooks, so `hydrate*` (used by the profile sync) deliberately skips it.
 */
export const useSettingsStore = create<SettingsState>((set) => {
  const setTheme = (theme: ThemePreference) => {
    writeStoredTheme(theme);
    applyTheme(theme);
    set({ theme });
  };
  const setCanvasStyle = (canvasStyle: CanvasStyle) => {
    writeStoredCanvasStyle(canvasStyle);
    set({ canvasStyle });
  };

  return {
    theme: "system",
    canvasStyle: "ruled",
    setTheme,
    hydrateTheme: setTheme,
    setCanvasStyle,
    hydrateCanvasStyle: setCanvasStyle,
  };
});
