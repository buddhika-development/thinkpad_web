"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";

import { Modal } from "@/components/composites/Modal";
import { Button } from "@/components/ui/Button";
import { Fab } from "@/components/ui/Fab";
import { EyeIcon, PenIcon, SaveIcon, SparklesIcon } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/Spinner";
import { routes } from "@/config/routes";
import { useSaveNote } from "@/features/dashboard";
import { useCanvasStyle } from "@/features/settings";
import { useToast } from "@/providers/toast-provider";
import { useUnsavedChanges } from "@/providers/unsaved-changes-provider";

import type { RewriteRequest } from "../api/rewrite-content";
import { useRewriteContent } from "../hooks/useRewriteContent";
import { useThinkPadLatestContent } from "../hooks/useThinkPadHistory";
import { CanvasZoomControl } from "./CanvasZoomControl";
import { CustomInstructionsDialog } from "./CustomInstructionsDialog";
import { NoteEditor } from "./NoteCanvas";
import { ResultCanvas, type ResultStatus } from "./ResultCanvas";
import { ThinkPadHeader } from "./ThinkPadHeader";
import { ThinkPadHistoryDrawer } from "./ThinkPadHistoryDrawer";

const MIN_SPLIT = 30;
const MAX_SPLIT = 72;

/**
 * Immersive writing workspace. The editor is a full-bleed notebook canvas with
 * floating actions. Once a rewrite starts:
 * - **Desktop (`md`+):** the view splits into editor + streamed-result panes
 *   with a draggable divider.
 * - **Mobile:** the result appears as a full-screen overlay with a close button;
 *   closing it keeps the result and reveals a "Show result" button to reopen.
 */
export function WriterWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const thinkPadId = searchParams.get("think_pad_id");
  const { toast } = useToast();
  const { setIsDirty: setGlobalIsDirty, registerSaveHandler } = useUnsavedChanges();

  const { canvasStyle } = useCanvasStyle();
  const [statement, setStatement] = useState("");
  const [statementId, setStatementId] = useState<string | null>(null);
  const [instructions, setInstructions] = useState("");
  const [textSize, setTextSize] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false);
  const [splitPct, setSplitPct] = useState(52);
  const [dragging, setDragging] = useState(false);
  // Mobile only: whether the result overlay has been dismissed (kept, not reset).
  const [resultDismissed, setResultDismissed] = useState(false);

  const lastRequest = useRef<RewriteRequest | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [savedStatement, setSavedStatement] = useState<string>("");
  const [prevLoadedId, setPrevLoadedId] = useState<string | null>(null);

  const rewrite = useRewriteContent();
  const saveNoteMutation = useSaveNote();
  const { data: latestContent } = useThinkPadLatestContent(thinkPadId);

  // Auto-populate initial note content when opening a saved ThinkPad
  if (
    thinkPadId &&
    latestContent?.userStatement &&
    prevLoadedId !== thinkPadId
  ) {
    setPrevLoadedId(thinkPadId);
    setStatement(latestContent.userStatement);
    setSavedStatement(latestContent.userStatement);
    if (latestContent.id) {
      setStatementId(latestContent.id);
    }
  }

  const isDirty =
    statement.trim().length > 0 &&
    statement.trim() !== savedStatement.trim();

  // Sync isDirty state with global navigation interceptor
  useEffect(() => {
    setGlobalIsDirty(isDirty);
    return () => setGlobalIsDirty(false);
  }, [isDirty, setGlobalIsDirty]);

  // Warn on browser tab reload or close when there are unsaved changes
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  const handleSaveNote = useCallback(async () => {
    if (!statement.trim()) return;
    try {
      const res = await saveNoteMutation.mutateAsync({
        user_statement: statement,
        think_pad_id: thinkPadId ?? undefined,
        statement_id: statementId ?? undefined,
      });

      if (res?.data?.id) {
        setStatementId(res.data.id);
      }
      setSavedStatement(statement);
      toast("Note saved successfully");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save note";
      toast(msg, "error");
    }
  }, [statement, thinkPadId, statementId, saveNoteMutation, toast]);

  // Register save handler for global unsaved changes modal
  useEffect(() => {
    registerSaveHandler(handleSaveNote);
    return () => registerSaveHandler(null);
  }, [registerSaveHandler, handleSaveNote]);

  const handleBackToDashboard = () => {
    if (isDirty) {
      setUnsavedModalOpen(true);
    } else {
      router.push(routes.dashboard);
    }
  };

  const handleSaveAndLeave = async () => {
    await handleSaveNote();
    setUnsavedModalOpen(false);
    router.push(routes.dashboard);
  };

  const handleDiscardAndLeave = () => {
    setUnsavedModalOpen(false);
    router.push(routes.dashboard);
  };

  const runRewrite = (body: RewriteRequest) => {
    lastRequest.current = body;
    setResultDismissed(false);
    rewrite.mutate(body);
  };

  const handleRewrite = () =>
    runRewrite({
      user_statement: statement,
      user_custom_instructions: instructions,
      think_pad_id: thinkPadId ?? undefined,
      statement_id: statementId ?? undefined,
      persistance: Boolean(thinkPadId),
    });

  const handleRetry = () =>
    runRewrite(
      lastRequest.current ?? {
        user_statement: statement,
        user_custom_instructions: instructions,
        think_pad_id: thinkPadId ?? undefined,
        statement_id: statementId ?? undefined,
        persistance: Boolean(thinkPadId),
      },
    );

  const handleApplyGeneratedText = (generatedText: string) => {
    setStatement(generatedText);
    toast("Applied generated content to main editor");
  };

  // While dragging the divider, track the pointer on `window` (so it keeps
  // resizing even if the cursor leaves the handle) and lock text selection.
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPct(Math.min(MAX_SPLIT, Math.max(MIN_SPLIT, pct)));
    };
    const onUp = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [dragging]);

  const resultText = rewrite.data?.user_statement ?? rewrite.streamedText;
  const status: ResultStatus | "idle" = rewrite.isPending
    ? "streaming"
    : rewrite.isError
      ? "error"
      : rewrite.isSuccess
        ? "done"
        : "idle";
  const split = status !== "idle";
  const canRewrite = statement.trim().length > 0 && !rewrite.isPending;

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <ThinkPadHeader
        thinkPadId={thinkPadId}
        isDirty={isDirty}
        onBackToDashboard={handleBackToDashboard}
        onOpenHistory={() => setHistoryOpen(true)}
      />

      <div
        ref={containerRef}
        className="relative flex min-h-0 flex-1"
        style={{ "--split": `${splitPct}%` } as CSSProperties}
      >
        {/* Editor canvas — full width on mobile; split width on desktop. */}
        <section
          className={`relative min-h-0 w-full ${
            split ? "md:w-[var(--split)] md:shrink-0" : "md:w-full"
          }`}
        >
          <NoteEditor
            value={statement}
            onChange={setStatement}
            pattern={canvasStyle}
            textSize={textSize}
            placeholder="Start writing… your notes stay exactly as you type them."
          />

          {/* Viewing controls (top-right) */}
          <div className="absolute top-4 right-4">
            <CanvasZoomControl value={textSize} onChange={setTextSize} />
          </div>

          {/* Floating actions (bottom-right) */}
          <div className="absolute right-5 bottom-5 flex items-center gap-2.5">
            <Fab
              variant="surface"
              icon={
                saveNoteMutation.isPending ? (
                  <Spinner className="size-5" />
                ) : (
                  <SaveIcon className="size-5" />
                )
              }
              label={saveNoteMutation.isPending ? "Saving..." : "Save note"}
              onClick={handleSaveNote}
              disabled={!statement.trim() || saveNoteMutation.isPending}
            />
            <Fab
              variant="surface"
              icon={<PenIcon className="size-5" />}
              label={
                instructions.trim()
                  ? "Edit instructions"
                  : "Custom instructions"
              }
              active={instructions.trim().length > 0}
              onClick={() => setDialogOpen(true)}
            />
            <Fab
              variant="primary"
              icon={
                rewrite.isPending ? (
                  <Spinner className="size-5" />
                ) : (
                  <SparklesIcon className="size-5" />
                )
              }
              label={rewrite.isPending ? "Re-writing…" : "Re-write content"}
              onClick={handleRewrite}
              disabled={!canRewrite}
            />
          </div>
        </section>

        {/* Draggable divider (desktop only) */}
        {split && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize panes"
            onPointerDown={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            className="group/divider relative hidden w-3 shrink-0 cursor-col-resize items-center justify-center md:flex"
          >
            <span className="bg-border group-hover/divider:bg-accent h-16 w-1 rounded-full transition" />
          </div>
        )}

        {/* Result pane (desktop split) */}
        {split && (
          <section className="relative hidden min-h-0 md:block md:flex-1">
            <ResultCanvas
              text={resultText}
              status={status}
              errorMessage={rewrite.error?.message}
              pattern={canvasStyle}
              textSize={textSize}
              onUse={() => handleApplyGeneratedText(resultText)}
              onRetry={handleRetry}
              onClose={() => rewrite.reset()}
            />
          </section>
        )}
      </div>

      {/* Result overlay (mobile) — full-screen; close keeps the result. */}
      {split && !resultDismissed && (
        <div className="animate-scale-in fixed inset-0 z-40 md:hidden">
          <ResultCanvas
            text={resultText}
            status={status}
            errorMessage={rewrite.error?.message}
            pattern={canvasStyle}
            textSize={textSize}
            onUse={() => {
              handleApplyGeneratedText(resultText);
              setResultDismissed(true);
            }}
            onRetry={handleRetry}
            onClose={() => setResultDismissed(true)}
          />
        </div>
      )}

      {/* Reopen button (mobile) — appears once the overlay is dismissed. */}
      {split && resultDismissed && (
        <Fab
          variant="primary"
          icon={<EyeIcon className="size-5 text-white" />}
          label="Show result"
          onClick={() => setResultDismissed(false)}
          className="fixed bottom-5 left-4 z-30 md:hidden"
        />
      )}

      <CustomInstructionsDialog
        open={dialogOpen}
        value={instructions}
        onClose={() => setDialogOpen(false)}
        onSave={setInstructions}
      />

      {thinkPadId && (
        <ThinkPadHistoryDrawer
          thinkPadId={thinkPadId}
          open={historyOpen}
          onClose={() => setHistoryOpen(false)}
          onSelectStatement={(text) => {
            setStatement(text);
            toast("Loaded note into editor");
          }}
        />
      )}

      {/* Unsaved Changes Confirmation Modal */}
      <Modal
        open={unsavedModalOpen}
        onClose={() => setUnsavedModalOpen(false)}
        title="Unsaved Changes"
      >
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            You have unsaved changes in your note. Would you like to save your work before leaving?
          </p>

          <div className="flex flex-wrap items-center justify-end gap-2 mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setUnsavedModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleDiscardAndLeave}
              className="text-red-600 dark:text-red-400 hover:bg-red-500/10"
            >
              Discard & Leave
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSaveAndLeave}
              disabled={saveNoteMutation.isPending}
            >
              {saveNoteMutation.isPending ? (
                <>
                  <Spinner className="size-4" />
                  Saving...
                </>
              ) : (
                "Save & Leave"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </main>
  );
}
