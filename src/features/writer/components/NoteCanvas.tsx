import type { CSSProperties, ReactNode } from "react";

import type { CanvasStyle } from "@/features/settings";

/**
 * Shared paper look for both the editor and the viewer canvases. Full-bleed
 * (no border/radius) so the writing surface fills the screen. `pt-14` keeps the
 * first line clear of the floating top-corner controls (zoom / status pill).
 */
const SURFACE =
  "note-canvas h-full w-full overflow-auto bg-card px-7 pt-14 pb-24 text-foreground";

function surfaceVars(textSize: number): CSSProperties {
  // `--canvas-text` drives font-size, line spacing, and pattern density;
  // `--canvas-top` aligns the ruled/dotted pattern with the top text padding.
  return {
    "--canvas-text": `${textSize}rem`,
    "--canvas-top": "3.5rem",
  } as CSSProperties;
}

type NoteEditorProps = {
  value: string;
  onChange: (value: string) => void;
  pattern: CanvasStyle;
  textSize: number;
  placeholder?: string;
};

/** Editable notebook canvas — a transparent textarea over the paper pattern. */
export function NoteEditor({
  value,
  onChange,
  pattern,
  textSize,
  placeholder,
}: NoteEditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      spellCheck
      data-pattern={pattern}
      style={surfaceVars(textSize)}
      className={`${SURFACE} placeholder:text-muted-foreground resize-none outline-none`}
    />
  );
}

type NoteViewerProps = {
  pattern: CanvasStyle;
  textSize: number;
  children: ReactNode;
};

/** Read-only notebook canvas — renders content on the same paper pattern. */
export function NoteViewer({ pattern, textSize, children }: NoteViewerProps) {
  return (
    <div
      data-pattern={pattern}
      style={surfaceVars(textSize)}
      className={SURFACE}
    >
      {children}
    </div>
  );
}
