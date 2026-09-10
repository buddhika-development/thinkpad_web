"use client";

import Link from "next/link";
import { useState } from "react";

import { Card } from "@/components/composites/Card";
import { Modal } from "@/components/composites/Modal";
import { Button } from "@/components/ui/Button";
import { PenIcon, XIcon } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/Spinner";
import { routes } from "@/config/routes";

import type { ThinkPad } from "../api/think-pad";
import { useDeleteThinkPad } from "../hooks/useThinkPads";

type ThinkPadCardProps = {
  thinkPad: ThinkPad;
};

export function ThinkPadCard({ thinkPad }: ThinkPadCardProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const deleteMutation = useDeleteThinkPad();

  const formattedDate = thinkPad.updatedAt || thinkPad.createdAt
    ? new Date(thinkPad.updatedAt || thinkPad.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteMutation.mutateAsync(thinkPad.id);
      setDeleteModalOpen(false);
    } catch {
      // Error handled in hook or query client
    }
  };

  return (
    <>
      <div className="relative group">
        <Link
          href={`${routes.writer}?think_pad_id=${thinkPad.id}`}
          className="block focus-visible:outline-none"
        >
          <Card className="group-hover:shadow-pop group-focus-visible:ring-ring flex h-full flex-col justify-between p-5 transition group-hover:-translate-y-0.5 group-focus-visible:ring-2">
            <div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="bg-accent-soft text-accent flex size-9 items-center justify-center rounded-xl">
                  <PenIcon className="size-4" />
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeleteModalOpen(true);
                  }}
                  className="text-muted-foreground hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 flex size-8 items-center justify-center rounded-lg opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                  title="Delete ThinkPad"
                  aria-label="Delete ThinkPad"
                >
                  <XIcon className="size-4" />
                </button>
              </div>

              <h3 className="text-foreground text-base font-semibold line-clamp-1">
                {thinkPad.thinkPadName}
              </h3>
              {thinkPad.description && (
                <p className="text-muted-foreground mt-1 text-xs line-clamp-2 leading-relaxed">
                  {thinkPad.description}
                </p>
              )}
            </div>

            {formattedDate && (
              <p className="text-muted-foreground/70 mt-4 text-[11px] font-medium">
                Updated {formattedDate}
              </p>
            )}
          </Card>
        </Link>
      </div>

      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete ThinkPad"
      >
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            Are you sure you want to delete &quot;{thinkPad.thinkPadName}&quot;? All associated statement history will be permanently deleted.
          </p>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <>
                  <Spinner className="size-4" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
