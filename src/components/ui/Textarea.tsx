import type { ComponentProps } from "react";

/**
 * Raw multi-line text-input primitive — domain-agnostic, styling only.
 * Defaults to vertical resize; pass `className` to override.
 */
export function Textarea({
  className = "",
  ...props
}: ComponentProps<"textarea">) {
  return (
    <textarea
      className={`border-input bg-card text-foreground placeholder:text-muted-foreground focus:border-ring focus-visible:ring-ring/40 w-full resize-y rounded-xl border px-3.5 py-2.5 text-sm transition outline-none focus-visible:ring-2 ${className}`}
      {...props}
    />
  );
}
