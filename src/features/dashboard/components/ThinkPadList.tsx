"use client";

import { useState } from "react";

import { Card } from "@/components/composites/Card";
import { Button } from "@/components/ui/Button";
import { SparklesIcon } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/Spinner";

import { useThinkPadsList } from "../hooks/useThinkPads";
import { CreateThinkPadModal } from "./CreateThinkPadModal";
import { ThinkPadCard } from "./ThinkPadCard";

export function ThinkPadList() {
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useThinkPadsList(page, 10);

  const thinkPads = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <section className="mt-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-xl font-semibold tracking-tight">
            Your ThinkPads
          </h2>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Create a temporary scratchpad or manage your saved notebook containers.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setModalOpen(true)}
          className="gap-2 shadow-soft"
        >
          <SparklesIcon className="size-4" />
          <span>New ThinkPad</span>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* 1. Primary "Create New ThinkPad" card */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="group focus-visible:outline-none text-left h-full"
        >
          <Card className="border-dashed border-2 border-border group-hover:border-accent group-hover:bg-accent-soft/20 flex min-h-[160px] h-full flex-col items-center justify-center p-6 text-center transition group-hover:-translate-y-0.5 group-focus-visible:ring-2 group-focus-visible:ring-ring">
            <span className="bg-accent-soft text-accent mb-3 flex size-11 items-center justify-center rounded-2xl transition-transform group-hover:scale-110">
              <SparklesIcon className="size-5" />
            </span>
            <h3 className="text-foreground text-base font-semibold">
              Create New ThinkPad
            </h3>
            <p className="text-muted-foreground mt-1 text-xs">
              Start with a temporary scratchpad or saved notebook container.
            </p>
          </Card>
        </button>

        {/* 2. Loading state */}
        {isLoading && (
          <div className="col-span-1 sm:col-span-2 flex items-center justify-center min-h-[160px] p-6">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Spinner className="size-5" />
              Loading ThinkPads...
            </div>
          </div>
        )}

        {/* 3. Error state */}
        {isError && (
          <div className="border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 flex flex-col justify-center min-h-[160px] rounded-2xl border p-5 text-xs">
            <p className="font-semibold">Failed to load ThinkPads</p>
            <p className="mt-1">{error?.message ?? "An unexpected error occurred."}</p>
          </div>
        )}

        {/* 4. Loaded ThinkPads List */}
        {!isLoading &&
          !isError &&
          thinkPads.map((tp) => <ThinkPadCard key={tp.id} thinkPad={tp} />)}
      </div>

      {/* Pagination controls */}
      {pagination && pagination.total_pages > 1 && (
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
          <span>
            Page {pagination.current_page} of {pagination.total_pages} ({pagination.total_items} items)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.has_prev_page}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!pagination.has_next_page}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <CreateThinkPadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
