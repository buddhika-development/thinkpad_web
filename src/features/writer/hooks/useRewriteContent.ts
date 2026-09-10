import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

import {
  type RewriteRequest,
  streamRewriteContent,
} from "../api/rewrite-content";

/**
 * Drives the "Re-write the content" action over SSE.
 *
 * The stream runs inside a TanStack Query mutation (so `isPending` / `isError`
 * / final `data` behave as usual), while each token is pushed into
 * `streamedText` for live rendering. `streamedText` resets on each new run.
 */
export function useRewriteContent() {
  const [streamedText, setStreamedText] = useState("");

  const mutation = useMutation({
    mutationFn: (body: RewriteRequest) => {
      setStreamedText("");
      return streamRewriteContent(body, (delta) =>
        setStreamedText((prev) => prev + delta),
      );
    },
  });

  return { ...mutation, streamedText };
}
