"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Field } from "@/components/composites/Field";
import { Modal } from "@/components/composites/Modal";
import { Button } from "@/components/ui/Button";
import { PenIcon, SparklesIcon } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/Spinner";
import { Textarea } from "@/components/ui/Textarea";
import { routes } from "@/config/routes";

import { useCreateThinkPad } from "../hooks/useThinkPads";

type CreateThinkPadModalProps = {
  open: boolean;
  onClose: () => void;
};

type Step = "select" | "form";

export function CreateThinkPadModal({
  open,
  onClose,
}: CreateThinkPadModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("select");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createThinkPadMutation = useCreateThinkPad();

  const handleClose = () => {
    setStep("select");
    setName("");
    setDescription("");
    setError(null);
    onClose();
  };

  const handleSelectTemporary = () => {
    handleClose();
    router.push(routes.writer);
  };

  const handleSelectSaved = () => {
    setStep("form");
  };

  const handleSubmitSaved = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("ThinkPad name is required.");
      return;
    }
    setError(null);

    try {
      const response = await createThinkPadMutation.mutateAsync({
        think_pad_name: name.trim(),
        description: description.trim() || undefined,
      });

      handleClose();
      if (response?.data?.id) {
        router.push(`${routes.writer}?think_pad_id=${response.data.id}`);
      } else {
        router.push(routes.writer);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create ThinkPad";
      setError(msg);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={step === "select" ? "Create New ThinkPad" : "New Saved ThinkPad"}
    >
      {step === "select" && (
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground -mt-2 text-sm">
            Select how you would like to start your writing session.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* Temporary ThinkPad option */}
            <button
              type="button"
              onClick={handleSelectTemporary}
              className="group border-border hover:border-accent hover:bg-accent-soft/30 flex flex-col items-start rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="bg-accent-soft text-accent mb-3 flex size-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105">
                <SparklesIcon className="size-5" />
              </span>
              <h3 className="text-foreground text-sm font-semibold">
                Temporary ThinkPad
              </h3>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                Quick scratchpad for one-off note taking. Notes are not saved to
                the backend history.
              </p>
            </button>

            {/* Saved ThinkPad option */}
            <button
              type="button"
              onClick={handleSelectSaved}
              className="group border-border hover:border-primary hover:bg-accent-soft/30 flex flex-col items-start rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="bg-primary/10 text-primary mb-3 flex size-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105">
                <PenIcon className="size-5" />
              </span>
              <h3 className="text-foreground text-sm font-semibold">
                Saved ThinkPad
              </h3>
              <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                Persistent container. Keeps a complete statement edit history
                and syncs to your account.
              </p>
            </button>
          </div>
        </div>
      )}

      {step === "form" && (
        <form onSubmit={handleSubmitSaved} className="flex flex-col gap-4">
          <p className="text-muted-foreground -mt-2 text-sm">
            Give your ThinkPad a name and optional description to keep your notes organized.
          </p>

          {error && (
            <div className="bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl p-3 text-xs">
              {error}
            </div>
          )}

          <Field
            label="ThinkPad Name *"
            name="think_pad_name"
            placeholder="e.g. Project Strategy Notes"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Add details or context for this notebook container..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="mt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep("select")}
              disabled={createThinkPadMutation.isPending}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createThinkPadMutation.isPending || !name.trim()}
            >
              {createThinkPadMutation.isPending ? (
                <>
                  <Spinner className="size-4" />
                  Creating...
                </>
              ) : (
                "Create ThinkPad"
              )}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
