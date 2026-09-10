import { createClient } from "@/lib/supabase/client";

import { type CanvasStyle, isCanvasStyle } from "../lib/canvas";
import { isThemePreference, type ThemePreference } from "../lib/theme";

type ProfileSettings = { theme?: ThemePreference; canvasStyle?: CanvasStyle };

/**
 * Merges settings into the user's Supabase profile metadata so they follow the
 * account across devices. No-op when signed out — local preferences still apply.
 */
async function saveToProfile(patch: ProfileSettings): Promise<void> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return;

  await supabase.auth.updateUser({ data: patch });
}

export function saveThemeToProfile(theme: ThemePreference): Promise<void> {
  return saveToProfile({ theme });
}

export function saveCanvasStyleToProfile(
  canvasStyle: CanvasStyle,
): Promise<void> {
  return saveToProfile({ canvasStyle });
}

/** Reads a valid theme preference from Supabase user metadata, if present. */
export function themeFromUserMetadata(
  metadata: unknown,
): ThemePreference | null {
  const value = (metadata as { theme?: unknown } | null)?.theme;
  return isThemePreference(value) ? value : null;
}

/** Reads a valid canvas style from Supabase user metadata, if present. */
export function canvasStyleFromUserMetadata(
  metadata: unknown,
): CanvasStyle | null {
  const value = (metadata as { canvasStyle?: unknown } | null)?.canvasStyle;
  return isCanvasStyle(value) ? value : null;
}
