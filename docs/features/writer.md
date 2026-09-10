# Feature: writer

> Written during Flow 1 (kickoff). Keep it at **decision/intent altitude** — the
> code is the source of truth for _how_; this doc is the source of truth for _why_.

- **Status:** 🟢 shipped <!-- 🔵 in progress · 🟢 shipped · 🟡 planned -->
- **Owner:** Buddhika Madusanka
- **Last updated:** 2026-09-09

> **Update (web-user-area):** the UI has since evolved from the two-textarea
> scratch pad below into an immersive split-view notebook **canvas** (editor +
> live-streamed result panes, zoom, custom-instructions dialog, retry). The
> streaming/data layer (`useRewriteContent` + SSE) is unchanged. See
> [web-user-area](web-user-area.md) for the canvas UI and settings integration.

## Requirement

A "scratch pad" workspace where a signed-in user can draft freely and have the
AI re-write it. Two input sections plus one action:

1. **Scratch pad** — a large free-writing area (`user_statement`).
2. **Custom instructions** — an expand/collapse area for optional guidance
   (`user_custom_instructions`).
3. **"Re-write the content"** button → calls the AI writer backend.

## Goals & non-goals

- **Goals:** capture the two inputs, POST them to the AI writer API with the
  user's auth token, and show the rewritten result **non-destructively** in a
  separate panel (original scratch pad preserved).
- **Non-goals:** history/persistence of drafts, streaming responses, multiple
  rewrite variants, rich-text editing.

## Approach

- New feature `src/features/writer/`, rendered at **`/writer`** inside the
  authenticated `(app)` shell.
- **Server call** streams over SSE, wrapped in a TanStack Query `useMutation`
  (the first server-data feature — wires the `QueryClientProvider` in the root
  layout). `isPending`/`isError`/final `data` come from the mutation; live
  tokens are pushed into local `streamedText` state for rendering.
  - `POST {NEXT_PUBLIC_API_BASE_URL}/api/v1/ai-writer/stream`
  - Headers: `Authorization: Bearer <supabase access token>` (read from the
    browser Supabase client's session), `Accept: text/event-stream`.
  - Body: `{ user_statement, user_custom_instructions }`.
  - **Response**: `text/event-stream` — each event is JSON: `data:
{"content":"…"}` deltas, ending with `data: [DONE]`. Deltas are appended and
    rendered live in a read-only result panel (Copy / "Use this" enabled once
    complete).
  - **Error**: sent mid-stream as `data: {"error":"…"}` with a 200 status
    (headers already flushed), or `{ message }` on a non-2xx. Both surface as an
    inline error and abandon the partial output.
- **Input state** is local component state (ephemeral form text — no global
  store needed). Collapse state of the instructions lives in its own component.

## Pitfalls & edge cases

- Response field `user_statement` is overloaded — it's both the request input
  and the success output. Keep the mapping explicit.
- Distinguish success vs. error by HTTP status, not body shape.
- Access token may be absent (session expired) — request still sends; backend
  decides. The `(app)` guard already blocks unauthenticated users.
- The API base URL is environment config (`NEXT_PUBLIC_API_BASE_URL`), not
  hardcoded, so it changes per environment.
- `/writer` is a new top-level path (not under `/dashboard`), so the proxy's
  protected-prefix list must include it, not only `/dashboard`.

## Reuse

- `Button` (ui), new `Textarea` (ui) primitive. Supabase browser client from
  `@/lib/supabase/client`. Route constant added to `@/config/routes`.

## Data & state

- **Server**: TanStack Query mutation to the AI writer endpoint (never cached in
  a global store).
- **UI/session**: scratch pad + instructions text (local `useState`); collapse
  toggle (local).

## Open questions

- Does the backend need any auth beyond the Bearer token (e.g. user id in body)?
- Should rewrites be persisted / shown as history later?

## Decisions

- Non-destructive result panel (keep original) over in-place replace, so the
  user can compare before adopting the rewrite. No ADR — revisit if the writer
  grows into a full editor.
