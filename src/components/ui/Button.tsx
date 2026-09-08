import type { ComponentProps } from "react";

type ButtonVariant = "primary" | "outline";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-60";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-foreground text-background hover:opacity-90",
  outline:
    "border border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900",
};

/**
 * Shared button class string. Use on a real `<button>` (via {@link Button})
 * or on a `<Link>` when you need button-styled navigation — keeping one source
 * of truth for button styling instead of duplicating Tailwind classes.
 */
export function buttonStyles(
  variant: ButtonVariant = "primary",
  className = "",
) {
  return `${BASE} ${VARIANTS[variant]} ${className}`;
}

type ButtonProps = ComponentProps<"button"> & { variant?: ButtonVariant };

/** Raw button primitive — domain-agnostic, styling only. */
export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return <button className={buttonStyles(variant, className)} {...props} />;
}
