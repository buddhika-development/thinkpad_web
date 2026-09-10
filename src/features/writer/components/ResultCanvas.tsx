"use client";

import { type ReactNode, useState } from "react";

import { Fab } from "@/components/ui/Fab";
import {
  ArrowDownIcon,
  CheckIcon,
  CopyIcon,
  RefreshIcon,
} from "@/components/ui/icons";
import { Spinner } from "@/components/ui/Spinner";
import type { CanvasStyle } from "@/features/settings";
import { useToast } from "@/providers/toast-provider";

import { NoteViewer } from "./NoteCanvas";

export type ResultStatus = "streaming" | "done" | "error";

type ResultCanvasProps = {
  text: string;
  status: ResultStatus;
  errorMessage?: string;
  pattern: CanvasStyle;
  textSize: number;
  onUse: () => void;
  onRetry: () => void;
  onClose: () => void;
};

const PILL: Record<
  ResultStatus,
  { className: string; icon: ReactNode; label: string }
> = {
  streaming: {
    className: "bg-accent-soft text-accent",
    icon: <Spinner className="size-3.5" />,
    label: "Generating",
  },
  done: {
    className: "bg-success/15 text-success",
    icon: <CheckIcon className="size-3.5" />,
    label: "Done",
  },
  error: {
    className: "bg-destructive/15 text-destructive",
    icon: null,
    label: "Error",
  },
};

function StatusPill({ status }: { status: ResultStatus }) {
  const { className, icon, label } = PILL[status];
  return (
    <span
      className={`shadow-soft inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}

/** The rewrite output as its own notebook canvas with floating actions. */
export function ResultCanvas({
  text,
  status,
  errorMessage,
  pattern,
  textSize,
  onUse,
  onRetry,
  onClose,
}: ResultCanvasProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const canAct = status === "done" && text.length > 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast("Copied to clipboard");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Could not copy", "error");
    }
  };

  return (
    <div className="relative h-full min-h-0">
      <NoteViewer pattern={pattern} textSize={textSize}>
        {status === "error" ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
            <p className="text-destructive text-sm font-medium">
              Couldn&apos;t rewrite the text
            </p>
            <p className="text-muted-foreground max-w-xs text-sm">
              {errorMessage}
            </p>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">
            {text}
            {status === "streaming" && (
              <span className="bg-accent ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse align-middle" />
            )}
          </p>
        )}
      </NoteViewer>

      {/* Status (top-left) + collapse (top-right) */}
      <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between">
        <span className="pointer-events-auto">
          <StatusPill status={status} />
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close rewrite"
          title="Close rewrite"
          className="border-border bg-card/90 text-muted-foreground shadow-soft hover:text-foreground pointer-events-auto grid size-8 place-items-center rounded-full border backdrop-blur transition"
        >
          <span className="text-lg leading-none">×</span>
        </button>
      </div>

      {/* Floating actions (bottom-right) */}
      <div className="absolute right-5 bottom-5 flex items-center gap-2.5">
        <Fab
          variant="surface"
          icon={<RefreshIcon className="size-5" />}
          label={status === "error" ? "Try again" : "Regenerate"}
          onClick={onRetry}
        />
        {canAct && (
          <>
            <Fab
              variant="surface"
              icon={
                copied ? (
                  <CheckIcon className="size-5" />
                ) : (
                  <CopyIcon className="size-5" />
                )
              }
              label={copied ? "Copied" : "Copy"}
              onClick={handleCopy}
            />
            <Fab
              variant="primary"
              icon={<ArrowDownIcon className="size-5" />}
              label="Use this"
              onClick={onUse}
            />
          </>
        )}
      </div>
    </div>
  );
}
