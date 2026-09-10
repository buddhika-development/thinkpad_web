import type { Metadata } from "next";

import { WriterWorkspace } from "@/features/writer";

export const metadata: Metadata = { title: "Writer" };

/**
 * Writer canvas — renders at `/writer` inside the authenticated shell.
 * `WriterWorkspace` owns the full-height notebook layout.
 */
export default function WriterPage() {
  return <WriterWorkspace />;
}
