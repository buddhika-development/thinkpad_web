"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "@/components/ui/icons";

import { useTheme } from "../hooks/useTheme";
import type { ThemePreference } from "../lib/theme";

const OPTIONS: { id: ThemePreference; label: string; Icon: typeof SunIcon }[] =
  [
    { id: "light", label: "Light", Icon: SunIcon },
    { id: "dark", label: "Dark", Icon: MoonIcon },
    { id: "system", label: "System", Icon: MonitorIcon },
  ];

/**
 * Segmented control for choosing the theme. Selection is applied instantly and
 * synced to the user's profile via `useTheme`.
 */
export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="border-border bg-muted/60 inline-flex gap-1 rounded-xl border p-1"
    >
      {OPTIONS.map(({ id, label, Icon }) => {
        const active = theme === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(id)}
            className={`focus-visible:ring-ring inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none ${
              active
                ? "bg-card text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="size-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
