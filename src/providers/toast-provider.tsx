"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import { AlertIcon, CheckIcon } from "@/components/ui/icons";

type ToastVariant = "success" | "error";
type Toast = { id: number; message: string; variant: ToastVariant };

type ToastContextValue = {
  toast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Minimal, self-contained toast system for transient feedback (copy, errors).
 * Renders a bottom-center stack; toasts auto-dismiss after ~2.4s.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const toast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      const id = nextId.current++;
      setToasts((prev) => [...prev, { id, message, variant }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2400);
    },
    [],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4">
        {toasts.map(({ id, message, variant }) => (
          <div
            key={id}
            className="animate-in border-border bg-card text-foreground shadow-pop pointer-events-auto flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium"
            role="status"
          >
            <span
              className={
                variant === "success" ? "text-success" : "text-destructive"
              }
            >
              {variant === "success" ? (
                <CheckIcon className="size-4.5" />
              ) : (
                <AlertIcon className="size-4.5" />
              )}
            </span>
            {message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Access the toast dispatcher. Must be used within `ToastProvider`. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
