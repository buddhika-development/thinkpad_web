# ADR 0001: Frontend architecture foundation

- **Status:** accepted
- **Date:** 2026-08-28

## Context

The web app was a fresh Create Next App. Before building features we needed a
foundation that stays maintainable long-term — avoiding the duplication, dead
code, and complexity drift that accumulate when code is written task-by-task
without structure.

## Decision

- **Feature-first structure.** Routing lives in a thin `app/`; application code
  lives in `src/`, organized by feature. Each feature exposes a single public
  surface via its `index.ts` barrel; outside code imports only from that barrel.
- **Three component tiers**, placed by domain-awareness (not size):
  `src/components/ui` (raw primitives) → `src/components/composites`
  (domain-agnostic combinations) → `src/features/*/components` (feature UI).
- **Dependency direction:** `ui` ← `composites` ← `features` (never the reverse).
- **State:** server data via TanStack Query; UI/session state via Zustand.
- **Reuse via barrels.** Barrels (`src/lib`, `src/components/*`) act as always-true,
  code-derived registries; search them before writing new code. No hand-maintained
  registry (it would drift).
- **Rule of three:** extract a shared util/composite on the third duplication.

See [../architecture.md](../architecture.md) for the full conventions.

## Consequences

- Clear boundaries and enforceable rules (dependency direction is lintable).
- Some upfront ceremony (barrels, feature folders) for long-term maintainability.
- The tier system adds a small classification cost, mitigated by the
  domain-awareness rule + rule of three.

## Alternatives considered

- **Group-by-type** (`components/`, `hooks/`, `utils/` dumping grounds) — rejected;
  it scales poorly and encourages tangled cross-imports.
- **Redux Toolkit** for state — rejected in favor of Zustand + TanStack Query for
  less boilerplate and better high-frequency-update ergonomics.
