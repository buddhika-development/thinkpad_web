# Feature: auth

> Written during Flow 1 (kickoff). Keep it at **decision/intent altitude** — the
> code is the source of truth for _how_; this doc is the source of truth for _why_.

- **Status:** 🔵 in progress <!-- 🔵 in progress · 🟢 shipped · 🟡 planned -->
- **Owner:** Buddhika Madusanka
- **Last updated:** 2026-09-08

## Requirement

Users need to create an account and sign in so they can reach the authenticated
app area (`/dashboard`). The public landing page needs clear calls-to-action to
**Log in** and **Get started** (register). Sign-in supports three methods:
email + password, Google, and Facebook — all through **Supabase Auth**.

## Goals & non-goals

- **Goals:**
  - Email/password sign-up + sign-in.
  - Google and Facebook OAuth sign-in.
  - Server-verified sessions (cookie-based, SSR) with a route guard on `/dashboard`.
  - Home page CTAs to login/register.
- **Non-goals (explicitly out of scope):**
  - Password reset / magic links / MFA (future).
  - Role-based authorization (only authenticated vs. not for now).
  - Profile management UI.

## Approach

Supabase Auth via the `@supabase/ssr` package (the official App Router pattern),
adapted for **Next.js 16**:

- **Clients** live in `src/lib/supabase/`: a browser client, an async server
  client (server components / actions / route handlers), and a proxy helper.
- **Session refresh + optimistic guard** run in **`proxy.ts`** (repo root).
  Next.js 16 renamed `middleware` → `proxy`; the exported function is `proxy`.
- **Email/password + OAuth initiation + sign-out** are React Server Actions in
  `src/features/auth/api`. OAuth actions call `signInWithOAuth` and redirect to
  the provider; the provider returns to **`/callback`** (a Route Handler) which
  exchanges the code for a session (PKCE).
- **Client session state** is mirrored into a small Zustand store via an
  `AuthProvider` listening to `onAuthStateChange`, exposed through `useSession`.
- **Secure check**: the `(app)` layout re-verifies the user server-side with
  `supabase.auth.getUser()` and redirects to `/login` if absent — proxy is only
  the optimistic first pass.

## Pitfalls & edge cases

- **`middleware.ts` is deprecated in Next 16** → must be `proxy.ts`. Session
  cookies must be written on the returned response, and copied onto any redirect
  response, or the session silently desyncs.
- `cookies()` is **async** in Next 16 — the server client must `await` it, and
  its `setAll` must swallow the write error when called from a Server Component
  (only Actions/Route Handlers/proxy can persist cookies; proxy refreshes them).
- Do not run code between `createServerClient` and `getUser()` in the proxy.
- **Email confirmation**: if Supabase requires email confirmation, sign-up won't
  return a session — the form shows a "check your email" message instead of
  redirecting. Both paths handled.
- **Facebook** requires a privacy-policy URL + app review before non-test users
  can log in — external dependency, tracked as an open question.
- Layout auth checks don't re-run on client navigation (partial rendering), so
  the guard also lives in the proxy, not only the layout.

## Reuse

- New shared primitives: `src/components/ui/{Button,Input}` (domain-agnostic;
  also used by marketing CTAs). New composite: `src/components/composites/Field`
  (label + input + error). Route constants extended in `src/config/routes.ts`.

## Data & state

- **Server data**: the authenticated user is read server-side via the Supabase
  server client (no TanStack Query needed yet — deferred to the first
  server-data feature).
- **UI/session state**: current user mirrored in a Zustand store
  (`src/features/auth/store`) for reactive client UI (user menu, sign-out).
- **APIs consumed**: Supabase Auth (`signInWithPassword`, `signUp`,
  `signInWithOAuth`, `exchangeCodeForSession`, `getUser`, `signOut`).

## Open questions

- Is email confirmation ON or OFF in the Supabase project? (Affects sign-up UX.)
- Are Google + Facebook OAuth apps created and configured in the Supabase
  dashboard, with redirect URLs whitelisted? Facebook app review status?

## Decisions

- Supabase chosen as the auth provider (supersedes the earlier deferred
  "Auth.js vs backend JWT" note on the login page). No ADR yet — revisit if
  session strategy grows (refresh tokens, roles).
