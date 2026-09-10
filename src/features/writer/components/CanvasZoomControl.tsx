const TEXT_MIN = 0.875;
const TEXT_MAX = 1.75;
const STEP = 0.125;

type CanvasZoomControlProps = {
  value: number;
  onChange: (value: number) => void;
};

function clamp(n: number): number {
  return Math.min(TEXT_MAX, Math.max(TEXT_MIN, Math.round(n * 1000) / 1000));
}

/**
 * Viewing control: shrink/enlarge the canvas text. Sits at the top-right of the
 * writing canvas. The percentage is relative to the 1rem base.
 */
export function CanvasZoomControl({ value, onChange }: CanvasZoomControlProps) {
  const pct = Math.round(value * 100);

  return (
    <div className="border-border bg-card/90 shadow-soft flex items-center gap-0.5 rounded-full border p-1 backdrop-blur">
      <button
        type="button"
        aria-label="Smaller text"
        onClick={() => onChange(clamp(value - STEP))}
        disabled={value <= TEXT_MIN}
        className="text-muted-foreground hover:bg-muted hover:text-foreground grid size-7 place-items-center rounded-full transition disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <span className="text-sm font-semibold">A</span>
      </button>
      <span className="text-muted-foreground w-11 text-center text-xs font-medium tabular-nums">
        {pct}%
      </span>
      <button
        type="button"
        aria-label="Larger text"
        onClick={() => onChange(clamp(value + STEP))}
        disabled={value >= TEXT_MAX}
        className="text-muted-foreground hover:bg-muted hover:text-foreground grid size-7 place-items-center rounded-full transition disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <span className="text-base font-semibold">A</span>
      </button>
    </div>
  );
}
