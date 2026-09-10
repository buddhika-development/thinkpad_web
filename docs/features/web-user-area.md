# Feature: web-user-area

> Written during Flow 1 (kickoff). Keep it at **decision/intent altitude** — the
> code is the source of truth for _how_; this doc is the source of truth for _why_.

- **Status:** 🟢 shipped <!-- 🔵 in progress · 🟢 shipped · 🟡 planned -->
- **Owner:** Buddhika Madusanka
- **Last updated:** 2026-09-09

## Requirement

The desktop app (`../electron-app`) has a fuller signed-in **user area** than the
web app currently does: a warm "paper" design system, theme + writing-canvas
settings, a real dashboard, and a rich split-view AI writer. We want the web
app's user area to deliver the **same interfaces and process flows** — not a
file-for-file port. The desktop app is the reference for _what the screens do
and how they feel_; each screen is (re)built the best **web-native** way for
Next.js 16 (SSR, cookie auth, App Router).

Scope is the authenticated `(app)` area only. The marketing home page redesign
is deferred and will be specified separately.

## Goals & non-goals

- **Goals:**
  - A shared **design system** (warm-paper tokens, `data-theme` light/dark,
    writing-canvas paper patterns, Inter font) that the user area renders
    against — the same visual language as desktop.
  - **App shell**: branded header, primary nav (Dashboard / Writer / Settings)
    with active state, theme toggle, user menu.
  - **Writer**: split-view canvas — a note editor on paper, a live-streaming
    result canvas beside it, text-zoom, custom-instructions dialog, and
    retry/copy/"use this" actions. Non-destructive (original preserved).
  - **Settings**: theme (light/dark/system) and canvas style (blank/ruled/
    dotted), persisted locally for instant apply **and** synced to the Supabase
    user profile so preferences follow the user across devices.
  - **Dashboard**: a welcoming entry point with quick links into Writer /
    Settings.
- **Non-goals:**
  - Copying electron's code, structure, or Electron-only seams (IPC,
    `window.api`, loopback OAuth server, `HashRouter`). Web auth already works.
  - Draft history/persistence, multiple rewrite variants, rich-text editing.
  - Marketing/home page changes (deferred).

## Approach

Build **bottom-up**, because each layer depends on the one below. Everything
stays feature-first behind `index.ts` barrels; shared UI lands in `ui` /
`composites` per the tiers.

1. **Design-system foundation (product-wide).** Replace the default
   `app/globals.css` with the warm-paper system: warm light/dark tokens exposed
   as Tailwind color utilities, a `data-theme`-driven `dark` variant (a saved
   preference beats OS), `.note-canvas` paper patterns, soft shadows and
   entrance animations. Swap the Geist font for **Inter** via `next/font`
   (self-hosted; no CSP/network concerns). _Adopted product-wide_ because it is
   the product's real design language and the deferred home redesign will build
   on the same tokens; marketing/auth inherit the warm look.

2. **Theme + canvas settings (web-adapted).** A small `settings` feature:
   framework-free helpers for reading/writing/applying theme + canvas style, a
   Zustand store seeded synchronously from `localStorage`, and `useTheme` /
   `useCanvasStyle` hooks. Theme writes `data-theme` on `<html>`. **No-flash
   seam (the one real SSR adaptation):** a tiny inline script in the root
   `<head>` stamps `data-theme` from `localStorage` before first paint. A
   sync provider hydrates preferences from the Supabase profile on sign-in and
   re-applies `system` on OS changes.

3. **Shared UI.** Add the primitives/composites the user area needs but the web
   repo lacks — a floating action button, a spinner, an icon set (`ui`), and
   Card + Modal (`composites`), plus a toast provider/hook. Built to fit the
   existing web primitives (Button/Input/Textarea/Field), not copied from
   desktop.

4. **App shell.** Rebuild `(app)/layout.tsx` as the branded shell: header with
   brand mark, nav links with active styling via `usePathname`, theme toggle,
   and the existing `UserMenu`. The current **server-side auth guard stays** —
   it is already the web-native equivalent of desktop's `<RequireAuth>`.

5. **Writer upgrade.** Rebuild `WriterWorkspace` as the split-view canvas:
   editor pane (note-on-paper `textarea`) + draggable divider + result canvas
   that streams tokens live, with zoom, a custom-instructions modal, and
   retry/copy/"use this". **Reuse the existing streaming layer unchanged**
   (`useRewriteContent` + `rewrite-content.ts` SSE against
   `/api/v1/ai-writer/stream`) — it is already correct and web-native.

6. **Settings page + Dashboard.** New `/settings` route composing Appearance /
   Canvas / Account cards; flesh out `/dashboard` with a greeting and quick-link
   cards into Writer / Settings.

## Pitfalls & edge cases

- **`data-theme` is global.** Rewiring the `dark` variant to `data-theme`
  (instead of OS media) restyles marketing + auth too. Intended (product-wide
  look), but flagged since the home page is mid-redesign.
- **SSR theme flash.** Without the inline `<head>` script the server renders one
  theme and the client flips on hydration. The script is mandatory, not optional.
- **Split-view divider** binds `pointermove`/`pointerup` on `window` and mutates
  `document.body` cursor/user-select — must be a client component with strict
  listener/style cleanup on unmount and pointer-up.
- **Profile sync is best-effort.** `updateUser({ data })` is fire-and-forget;
  `localStorage`/Zustand remain the source of truth for instant apply, so a
  failed/absent network sync never blocks the UI. No-op when signed out.
- **Non-destructive writer.** The result canvas never overwrites the editor;
  "Use this" is an explicit action. `user_statement` is overloaded (request
  input _and_ success output) — keep the mapping explicit.
- **Canvas CSS coupling.** The note editor/viewer and the canvas-style preview
  swatch all depend on the `.note-canvas` + `[data-pattern]` rules and
  `--canvas-*` variables living in `globals.css` — ship those before the
  components that rely on them.

## Reuse

- **Auth (whole flow) — reuse as-is:** cookie-based Supabase auth is already
  web-native here (`auth-actions`, `proxy-session` guard, `/callback` route,
  `getCurrentUser`, `AuthProvider`, `session-store`, `useSession`, `UserMenu`).
  No OAuth/IPC porting needed.
- **Streaming writer core — reuse as-is:** `useRewriteContent`,
  `rewrite-content.ts`, `query-provider`.
- **Primitives:** `Button`, `Input`, `Textarea` (`ui`); `Field` (`composites`);
  Supabase browser client (`@/lib/supabase/client`); `@/config/routes` (add a
  `settings` entry).
- **New shared bits** (added because ≥2 features use them): `Fab`, `Spinner`,
  `icons` (`ui`); `Card`, `Modal` (`composites`); toast provider/hook.

## Data & state

- **Server data → TanStack Query:** the AI rewrite mutation (SSE). Never cached
  in a global store.
- **UI/session state → Zustand:** theme + canvas style (`settings` store, seeded
  from `localStorage`); auth session mirror (existing `session-store`).
- **Cross-device persistence:** theme + canvas style mirrored to Supabase user
  profile metadata via `updateUser({ data })`, hydrated on sign-in.
- **Ephemeral local state:** editor text, instructions, zoom, divider position,
  dialog open — component `useState`/`useRef`.

## Open questions

- Does the AI writer backend need anything beyond the Bearer token (e.g. user id
  in body)? (Carried over from the writer doc.)
- Should rewrites eventually be persisted as history? (Out of scope now.)

## Decisions

- **Adopt the warm-paper design system product-wide** (not confined to `(app)`).
  It is the product's real design language; the deferred home redesign builds on
  it. No separate ADR — revisit if marketing needs a divergent system.
- **Theme via a small Zustand + localStorage + inline-script setup**, not
  `next-themes`, because canvas style and Supabase-profile sync already need a
  custom store and matching Zustand is simpler than layering a library on top.
- **Reproduce interfaces/flows, don't port files.** Each screen is rebuilt the
  best web-native way; desktop is the behavioral reference only.
