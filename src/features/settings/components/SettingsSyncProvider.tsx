"use client";

import { type ReactNode, useEffect } from "react";

import {
  canvasStyleFromUserMetadata,
  themeFromUserMetadata,
} from "../api/settings-profile";
import { readStoredCanvasStyle } from "../lib/canvas";
import { applyTheme, readStoredTheme } from "../lib/theme";
import { useSettingsStore } from "../store/settings-store";

type SettingsSyncProviderProps = {
  /** Signed-in user's id — sync re-runs only when this identity changes. */
  userId?: string;
  /** Signed-in user's Supabase profile metadata (theme / canvasStyle). */
  userMetadata?: unknown;
  children: ReactNode;
};

/**
 * Keeps applied settings in sync with (a) the OS scheme while the theme
 * preference is `system`, and (b) the signed-in user's saved profile
 * (theme + canvas style). Initial theme paint is handled by the no-flash inline
 * script in the root layout. The user is passed in from the server layout so
 * this stays decoupled from the auth feature's server-only code.
 */
export function SettingsSyncProvider({
  userId,
  userMetadata,
  children,
}: SettingsSyncProviderProps) {
  const theme = useSettingsStore((state) => state.theme);
  const hydrateTheme = useSettingsStore((state) => state.hydrateTheme);
  const hydrateCanvasStyle = useSettingsStore(
    (state) => state.hydrateCanvasStyle,
  );

  // Adopt the locally-saved preferences once mounted. Deferred to an effect (vs.
  // seeding the store synchronously) so the store matches SSR during hydration.
  useEffect(() => {
    hydrateTheme(readStoredTheme());
    hydrateCanvasStyle(readStoredCanvasStyle());
  }, [hydrateTheme, hydrateCanvasStyle]);

  // Follow the OS when the theme preference is `system`.
  useEffect(() => {
    if (theme !== "system") return;
    const media = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  // When the signed-in identity changes, adopt the settings saved on their
  // account. Keyed on `userId` only, so a stale value can't revert mid-session.
  useEffect(() => {
    const profileTheme = themeFromUserMetadata(userMetadata);
    if (profileTheme && profileTheme !== theme) hydrateTheme(profileTheme);

    const profileCanvas = canvasStyleFromUserMetadata(userMetadata);
    if (profileCanvas) hydrateCanvasStyle(profileCanvas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return <>{children}</>;
}
