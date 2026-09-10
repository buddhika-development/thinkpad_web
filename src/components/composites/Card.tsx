import type { ComponentProps } from "react";

/**
 * Surface container — a warm card with a soft border and elevation.
 * Domain-agnostic, so it lives in composites.
 */
export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`border-border bg-card shadow-soft rounded-2xl border ${className}`}
      {...props}
    />
  );
}
