"use client";

import type { CSSProperties } from "react";

import { useCanvasStyle } from "../hooks/useCanvasStyle";
import type { CanvasStyle } from "../lib/canvas";

const OPTIONS: { id: CanvasStyle; label: string; hint: string }[] = [
  { id: "blank", label: "Blank", hint: "Plain paper" },
  { id: "ruled", label: "Ruled", hint: "Lined like a notebook" },
  { id: "dotted", label: "Dotted", hint: "Dot grid" },
];

/** Preview swatch of the paper pattern shown in each option. */
function PatternSwatch({ style }: { style: CanvasStyle }) {
  return (
    <span
      className="note-canvas border-border bg-card block h-14 w-full rounded-lg border"
      data-pattern={style}
      style={
        {
          "--canvas-text": "0.7rem",
          "--canvas-top": "0.5rem",
          "--canvas-left": "0.5rem",
        } as CSSProperties
      }
    />
  );
}

/** Choose the writing-canvas paper style. Saved to the user's profile. */
export function CanvasStyleSelector() {
  const { canvasStyle, setCanvasStyle } = useCanvasStyle();

  return (
    <div
      role="radiogroup"
      aria-label="Canvas style"
      className="grid grid-cols-3 gap-3"
    >
      {OPTIONS.map(({ id, label, hint }) => {
        const active = canvasStyle === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setCanvasStyle(id)}
            className={`focus-visible:ring-ring flex flex-col gap-2 rounded-xl border p-2.5 text-left transition focus-visible:ring-2 focus-visible:outline-none ${
              active
                ? "border-accent bg-accent-soft"
                : "border-border hover:border-muted-foreground/40"
            }`}
          >
            <PatternSwatch style={id} />
            <span>
              <span className="text-foreground block text-sm font-medium">
                {label}
              </span>
              <span className="text-muted-foreground block text-xs">
                {hint}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
