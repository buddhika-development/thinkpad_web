"use client";

import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { ArrowDownIcon, PenIcon, RefreshIcon, SparklesIcon } from "@/components/ui/icons";
import { routes } from "@/config/routes";

import { useThinkPadDetails } from "../hooks/useThinkPadHistory";

type ThinkPadHeaderProps = {
  thinkPadId?: string | null;
  isDirty?: boolean;
  onBackToDashboard?: () => void;
  onOpenHistory?: () => void;
};

export function ThinkPadHeader({
  thinkPadId,
  isDirty = false,
  onBackToDashboard,
  onOpenHistory,
}: ThinkPadHeaderProps) {
  const { data, isLoading } = useThinkPadDetails(thinkPadId);
  const thinkPad = data?.data;

  const handleDashboardClick = (e: React.MouseEvent) => {
    if (onBackToDashboard) {
      e.preventDefault();
      onBackToDashboard();
    }
  };

  return (
    <div className="border-b border-border bg-card/60 backdrop-blur-sm px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href={routes.dashboard}
          onClick={handleDashboardClick}
          className="text-muted-foreground hover:text-foreground text-xs font-medium flex items-center gap-1.5 transition"
        >
          <ArrowDownIcon className="size-3.5 -rotate-270" />
          <span>Dashboard</span>
        </Link>
        <span className="text-border">/</span>

        {isLoading ? (
          <div className="h-5 w-32 bg-muted animate-pulse rounded" />
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-foreground text-sm font-semibold truncate">
              {thinkPadId ? thinkPad?.thinkPadName ?? "Saved ThinkPad" : "Temporary ThinkPad"}
            </h1>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                thinkPadId
                  ? "bg-primary/10 text-primary"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              }`}
            >
              {thinkPadId ? (
                <>
                  <PenIcon className="size-3" />
                  Saved
                </>
              ) : (
                <>
                  <SparklesIcon className="size-3" />
                  Temporary
                </>
              )}
            </span>

            {isDirty && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/15 text-amber-600 dark:text-amber-400 animate-pulse">
                <span className="size-1.5 rounded-full bg-amber-500" />
                Unsaved changes
              </span>
            )}
          </div>
        )}
      </div>

      {thinkPadId && onOpenHistory && (
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenHistory}
          className="h-8 gap-1.5 text-xs"
        >
          <RefreshIcon className="size-3.5" />
          <span>History</span>
        </Button>
      )}
    </div>
  );
}
