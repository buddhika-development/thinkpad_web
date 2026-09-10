import { createClient } from "@/lib/supabase/client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type RewriteRequest = {
  user_statement: string;
  user_custom_instructions: string;
  think_pad_id?: string;
  statement_id?: string;
  persistance?: boolean;
};

/** Final result once the stream completes — `user_statement` is the full text. */
export type RewriteResult = {
  user_statement: string;
};

/** SSE `[DONE]` sentinel that signals the end of the stream. */
const DONE = "[DONE]";

/**
 * Streams a re-write from the AI writer backend over Server-Sent Events.
 *
 * POSTs `{ user_statement, user_custom_instructions }` with the user's Supabase
 * Bearer token and reads a `text/event-stream` response, invoking `onDelta`
 * with each `data:` chunk as it arrives. Resolves with the accumulated text.
 */
export async function streamRewriteContent(
  body: RewriteRequest,
  onDelta: (delta: string) => void,
): Promise<RewriteResult> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const response = await fetch(`${API_BASE_URL}/api/v1/ai-writer/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      ...(session?.access_token && {
        Authorization: `Bearer ${session.access_token}`,
      }),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok || !response.body) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      data.message ?? "Couldn't re-write the content. Try again.",
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  // Returns true when the stream is complete ([DONE]). Each event payload is
  // JSON: `{ content }` for a delta, or `{ error }` sent mid-stream (with a 200
  // status, since headers are already flushed) — surfaced as a thrown error.
  const consume = (rawEvent: string): boolean => {
    const payload = parseEventData(rawEvent);
    if (payload === null) return false;
    if (payload === DONE) return true;

    let event: { content?: string; error?: string };
    try {
      event = JSON.parse(payload);
    } catch {
      return false; // ignore keep-alives / non-JSON comments
    }

    if (event.error) throw new Error(event.error);
    if (event.content) {
      full += event.content;
      onDelta(event.content);
    }
    return false;
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE events are delimited by a blank line; keep any trailing partial.
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const event of events) {
      if (consume(event)) return { user_statement: full };
    }
  }

  // Flush a final event that arrived without a trailing blank line.
  consume(buffer);
  return { user_statement: full };
}

/**
 * Extracts the payload from one SSE event. Concatenates multiple `data:` lines
 * per the spec and ignores comments/other fields. Returns null if no data.
 */
function parseEventData(rawEvent: string): string | null {
  const dataLines = rawEvent
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).replace(/^ /, ""));

  return dataLines.length > 0 ? dataLines.join("\n") : null;
}
