"use client";

import { useCallback } from "react";

import { saveThemeToProfile } from "../api/settings-profile";
import type { ThemePreference } from "../lib/theme";
import { useSettingsStore } from "../store/settings-store";

type UseTheme = {
  /** The user's preference (may be `system`). */
  theme: ThemePreference;
  /** Updates the preference locally and syncs it to the profile when signed in. */
  setTheme: (theme: ThemePreference) => void;
};

/**
 * Read/write the theme preference. Writes update the local store immediately
 * (instant UI) and fire-and-forget the profile sync.
 */
export function useTheme(): UseTheme {
  const theme = useSettingsStore((state) => state.theme);
  const setThemeStore = useSettingsStore((state) => state.setTheme);

  const setTheme = useCallback(
    (next: ThemePreference) => {
      setThemeStore(next);
      void saveThemeToProfile(next).catch(() => {
        // Profile sync is best-effort; the local preference still holds.
      });
    },
    [setThemeStore],
  );

  return { theme, setTheme };
}
