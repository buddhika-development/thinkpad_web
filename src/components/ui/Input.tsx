import type { ComponentProps } from "react";

/**
 * Raw text-input primitive — domain-agnostic, styling only.
 */
export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return (
    <input
      className={`w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2.5 text-sm transition outline-none placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400 ${className}`}
      {...props}
    />
  );
}
