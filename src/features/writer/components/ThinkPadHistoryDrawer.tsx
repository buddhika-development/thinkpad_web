"use client";

import { Modal } from "@/components/composites/Modal";
import { Button } from "@/components/ui/Button";
import { CopyIcon, SparklesIcon } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/Spinner";

import { useThinkPadHistory } from "../hooks/useThinkPadHistory";

type ThinkPadHistoryDrawerProps = {
  thinkPadId: string;
  open: boolean;
  onClose: () => void;
  onSelectStatement: (statement: string) => void;
};

export function ThinkPadHistoryDrawer({
  thinkPadId,
  open,
  onClose,
  onSelectStatement,
}: ThinkPadHistoryDrawerProps) {
  const { data, isLoading, isError } = useThinkPadHistory(
    open ? thinkPadId : null,
    1,
    20,
  );

  const historyItems = data?.data ?? [];
  const thinkPadName = data?.think_pad?.think_pad_name;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Statement History - ${thinkPadName ?? "ThinkPad"}`}
    >
      <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
        {isLoading && (
          <div className="flex items-center justify-center py-8 text-muted-foreground text-sm gap-2">
            <Spinner className="size-5" />
            Loading history...
          </div>
        )}

        {isError && (
          <p className="text-red-500 text-xs py-4 text-center">
            Failed to load statement history for this ThinkPad.
          </p>
        )}

        {!isLoading && !isError && historyItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <SparklesIcon className="size-8 text-muted-foreground mb-2 opacity-50" />
            <p className="text-foreground text-sm font-semibold">
              No History Yet
            </p>
            <p className="text-muted-foreground text-xs max-w-xs mt-1">
              Re-write content using the AI button to automatically persist statements to this ThinkPad history.
            </p>
          </div>
        )}

        {!isLoading &&
          !isError &&
          historyItems.map((item) => {
            const date = new Date(item.createdAt).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={item.id}
                className="border-border bg-muted/40 flex flex-col gap-2 rounded-xl border p-3.5 text-xs transition hover:bg-muted/70"
              >
                <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                  <span>{date}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onSelectStatement(item.userStatement);
                      onClose();
                    }}
                    className="h-6 px-2 text-[11px] gap-1"
                  >
                    <CopyIcon className="size-3" />
                    Load Note
                  </Button>
                </div>

                <div>
                  <span className="text-muted-foreground font-medium text-[11px]">
                    User Note:
                  </span>
                  <p className="text-foreground mt-0.5 line-clamp-3 whitespace-pre-wrap font-mono text-[12px] bg-background/50 p-2 rounded-lg border border-border/50">
                    {item.userStatement}
                  </p>
                </div>

                {item.aiOptimizedStatement && (
                  <div>
                    <span className="text-accent font-medium text-[11px] flex items-center gap-1">
                      <SparklesIcon className="size-3" />
                      AI Optimization:
                    </span>
                    <p className="text-foreground mt-0.5 line-clamp-3 whitespace-pre-wrap font-mono text-[12px] bg-accent-soft/30 p-2 rounded-lg border border-accent/20">
                      {item.aiOptimizedStatement}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
