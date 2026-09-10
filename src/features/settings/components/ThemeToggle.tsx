"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "@/components/ui/icons";

import { useTheme } from "../hooks/useTheme";
import type { ThemePreference } from "../lib/theme";

const NEXT: Record<ThemePreference, ThemePreference> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const ICON = { light: SunIcon, dark: MoonIcon, system: MonitorIcon };
const LABEL = { light: "Light", dark: "Dark", system: "System" };

/** Compact header control that cycles Light → Dark → System. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon = ICON[theme];

  return (
    <button
      type="button"
      onClick={() => setTheme(NEXT[theme])}
      title={`Theme: ${LABEL[theme]} (click to change)`}
      aria-label={`Theme: ${LABEL[theme]}. Click to change.`}
      className="border-border text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded-lg border transition focus-visible:ring-2 focus-visible:outline-none"
    >
      <Icon className="size-4.5" />
    </button>
  );
}
