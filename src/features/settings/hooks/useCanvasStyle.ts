"use client";

import { useCallback } from "react";

import { saveCanvasStyleToProfile } from "../api/settings-profile";
import type { CanvasStyle } from "../lib/canvas";
import { useSettingsStore } from "../store/settings-store";

type UseCanvasStyle = {
  canvasStyle: CanvasStyle;
  setCanvasStyle: (style: CanvasStyle) => void;
};

/**
 * Read/write the writing-canvas style. Updates the store immediately and
 * fire-and-forgets the profile sync.
 */
export function useCanvasStyle(): UseCanvasStyle {
  const canvasStyle = useSettingsStore((state) => state.canvasStyle);
  const setCanvasStyleStore = useSettingsStore((state) => state.setCanvasStyle);

  const setCanvasStyle = useCallback(
    (next: CanvasStyle) => {
      setCanvasStyleStore(next);
      void saveCanvasStyleToProfile(next).catch(() => {
        // Profile sync is best-effort; the local preference still holds.
      });
    },
    [setCanvasStyleStore],
  );

  return { canvasStyle, setCanvasStyle };
}
