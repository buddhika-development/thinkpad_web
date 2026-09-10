import type { ComponentProps, ReactNode } from "react";

type FabVariant = "primary" | "surface";

const VARIANTS: Record<FabVariant, string> = {
  primary: "bg-primary text-primary-foreground",
  surface: "border border-border bg-card text-foreground",
};

type FabProps = ComponentProps<"button"> & {
  icon: ReactNode;
  /** Text revealed when the button is hovered or focused. */
  label: string;
  variant?: FabVariant;
  /** Draws an accent ring to signal an active/engaged state. */
  active?: boolean;
};

/**
 * Floating action button: a round icon button that expands into a labeled pill
 * on hover/focus. Domain-agnostic — used for the writer's canvas actions.
 */
export function Fab({
  icon,
  label,
  variant = "surface",
  active = false,
  className = "",
  ...props
}: FabProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`group/fab shadow-pop focus-visible:ring-ring focus-visible:ring-offset-background inline-flex h-12 items-center rounded-full transition-[box-shadow,transform] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-55 ${VARIANTS[variant]} ${active ? "ring-accent ring-offset-background ring-2 ring-offset-2" : ""} ${className}`}
      {...props}
    >
      <span className="grid size-12 shrink-0 place-items-center">{icon}</span>
      <span className="max-w-0 overflow-hidden pr-0 text-sm font-medium whitespace-nowrap opacity-0 transition-all duration-200 group-hover/fab:max-w-[14rem] group-hover/fab:pr-5 group-hover/fab:opacity-100 group-focus-visible/fab:max-w-[14rem] group-focus-visible/fab:pr-5 group-focus-visible/fab:opacity-100">
        {label}
      </span>
    </button>
  );
}
