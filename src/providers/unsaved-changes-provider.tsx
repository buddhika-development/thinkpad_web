"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { Modal } from "@/components/composites/Modal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

type UnsavedChangesContextValue = {
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
  registerSaveHandler: (handler: (() => Promise<void>) | null) => void;
  /** Returns true if navigation was intercepted due to unsaved changes. */
  interceptNavigation: (targetHref: string) => boolean;
};

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(
  null,
);

export function UnsavedChangesProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isDirty, setIsDirty] = useState(false);
  const [saveHandler, setSaveHandlerState] = useState<
    (() => Promise<void>) | null
  >(null);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const registerSaveHandler = useCallback(
    (handler: (() => Promise<void>) | null) => {
      setSaveHandlerState(() => handler);
    },
    [],
  );

  const interceptNavigation = useCallback(
    (targetHref: string): boolean => {
      if (!isDirty) return false;
      setPendingHref(targetHref);
      setModalOpen(true);
      return true;
    },
    [isDirty],
  );

  const handleCancel = () => {
    setModalOpen(false);
    setPendingHref(null);
  };

  const handleDiscardAndLeave = () => {
    setIsDirty(false);
    setModalOpen(false);
    if (pendingHref) {
      const target = pendingHref;
      setPendingHref(null);
      router.push(target);
    }
  };

  const handleSaveAndLeave = async () => {
    if (saveHandler) {
      try {
        setIsSaving(true);
        await saveHandler();
      } catch {
        // Error already handled or toasted inside handler
      } finally {
        setIsSaving(false);
      }
    }

    setIsDirty(false);
    setModalOpen(false);
    if (pendingHref) {
      const target = pendingHref;
      setPendingHref(null);
      router.push(target);
    }
  };

  const value = useMemo(
    () => ({
      isDirty,
      setIsDirty,
      registerSaveHandler,
      interceptNavigation,
    }),
    [isDirty, registerSaveHandler, interceptNavigation],
  );

  return (
    <UnsavedChangesContext.Provider value={value}>
      {children}

      <Modal
        open={modalOpen}
        onClose={handleCancel}
        title="Unsaved Changes"
      >
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            You have unsaved changes in your note. Would you like to save your work before leaving? Your changes will be lost if you leave without saving.
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleDiscardAndLeave}
              disabled={isSaving}
              className="text-red-600 dark:text-red-400 hover:bg-red-500/10"
            >
              Discard & Leave
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSaveAndLeave}
              disabled={isSaving}
            >
              {isSaving ? (
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
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChanges(): UnsavedChangesContextValue {
  const ctx = useContext(UnsavedChangesContext);
  if (!ctx) {
    throw new Error(
      "useUnsavedChanges must be used within UnsavedChangesProvider",
    );
  }
  return ctx;
}
