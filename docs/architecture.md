# Architecture & conventions

This document records how the codebase is organized and the conventions that
keep it maintainable. It is the reference for both short-term velocity and
long-term health. (Deeper, dated decision records go under `docs/adr/`.)

## Folder architecture — feature-first

- **`app/` is routing only.** A route file wires a page together; it holds no
  business logic. Route groups (`(marketing)`, `(auth)`, `(app)`) organize
  pages without affecting the URL.
- **`src/features/<name>/` is the heart of the app.** Each feature owns its
  `components/`, `hooks/`, `api/`, and types, and exposes a single public
  surface via `index.ts`. Outside code imports **only** from that barrel —
  never reach into a feature's internals. This boundary is what prevents the
  codebase from turning into spaghetti as it grows.
- **Promote to shared only on the second use.** Something moves to
  `src/components/ui` or `src/lib` when a _second_ feature needs it — avoid
  premature "shared" folders.

## Naming conventions

| Kind               | Convention       | Example            |
| ------------------ | ---------------- | ------------------ |
| React components   | `PascalCase.tsx` | `LoginForm.tsx`    |
| Hooks              | `useX.ts`        | `useSession.ts`    |
| Utils / config     | `kebab-case.ts`  | `format-date.ts`   |
| Types / interfaces | `PascalCase`     | `type UserProfile` |

- One component per file; filename matches the component name.
- Prefer **named exports** everywhere. Default exports are used only for
  `app/` route files, which Next.js requires.

## State management

- **Server state** (data from the backend) → React Server Components +
  TanStack Query on the client. Do not store server data in a global store.
- **Client / UI state** (session, ephemeral UI) → Zustand stores in
  `src/store/` (global) or a feature's own `store`/hooks (local).

## Comments & documentation

- Comments explain **why**, not **what**. Code says what it does.
- Use TSDoc (`/** */`) on the _public_ API of exported components/functions.
- Non-obvious domain logic gets a short note or a feature-level README.

## TypeScript

- `strict` is on, plus `noUncheckedIndexedAccess`.
- Import app code via the `@/*` alias, which resolves to `src/*`.
