import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Rendered under the card, e.g. a link to the other auth page. */
  footer?: ReactNode;
};

/** Shared chrome for the login and register pages. */
export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-zinc-200 p-8 dark:border-zinc-800">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
      {footer && (
        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          {footer}
        </p>
      )}
    </div>
  );
}
