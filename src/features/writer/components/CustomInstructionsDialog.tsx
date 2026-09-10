"use client";

import { useState } from "react";

import { Modal } from "@/components/composites/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

type CustomInstructionsDialogProps = {
  open: boolean;
  value: string;
  onClose: () => void;
  onSave: (value: string) => void;
};

/**
 * Popup for entering custom rewrite instructions. Rendered only while open, so
 * the inner form mounts fresh each time — seeding its draft from the committed
 * value without an effect. "Cancel" discards the draft; "Save" commits it.
 */
export function CustomInstructionsDialog({
  open,
  value,
  onClose,
  onSave,
}: CustomInstructionsDialogProps) {
  if (!open) return null;
  return <InstructionsForm value={value} onClose={onClose} onSave={onSave} />;
}

function InstructionsForm({
  value,
  onClose,
  onSave,
}: Omit<CustomInstructionsDialogProps, "open">) {
  const [draft, setDraft] = useState(value);

  const handleSave = () => {
    onSave(draft.trim());
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Custom instructions"
      footer={
        <>
          {draft.trim() && (
            <Button
              variant="ghost"
              onClick={() => setDraft("")}
              className="mr-auto"
            >
              Clear
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </>
      }
    >
      <p className="text-muted-foreground mb-3 text-sm">
        Tell the AI how to rewrite your text — tone, length, audience, anything.
      </p>
      <Textarea
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="e.g. Make it more formal and concise, keep it under 100 words…"
        className="min-h-40"
      />
    </Modal>
  );
}
