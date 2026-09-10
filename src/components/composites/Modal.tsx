"use client";

import { type ReactNode, useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Footer actions, right-aligned. */
  footer?: ReactNode;
};

/**
 * Lightweight centered modal with a dimmed backdrop. Closes on Escape or a
 * backdrop click. Domain-agnostic, so it lives in composites.
 */
export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="bg-foreground/25 absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="animate-scale-in border-border bg-card shadow-pop relative w-full max-w-lg rounded-2xl border p-6">
        {title && (
          <h2 className="text-foreground mb-4 text-lg font-semibold tracking-tight">
            {title}
          </h2>
        )}
        {children}
        {footer && (
          <div className="mt-6 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
