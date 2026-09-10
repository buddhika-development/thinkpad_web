@AGENTS.md

# Project working rules

How features are built in this project. Full detail: [docs/workflows.md](docs/workflows.md)
and [docs/architecture.md](docs/architecture.md).

## Before building a feature — Flow 1

- No feature starts without a discussion first. Run `/feature <name>`: agree the
  approach, pitfalls, and edge cases in a planning pass — **do not write code until the
  approach is agreed.**
- Capture the outcome in `docs/features/<name>.md` (from `docs/features/_template.md`).
  Keep docs at **decision/intent altitude** ("why"), not line-by-line "how".

## While building a feature — Flow 2

- **Reuse first.** Before writing any component or helper, search the barrels
  (`src/components/ui`, `src/components/composites`, `src/lib`) and existing features for
  something that already exists. Reuse it instead of duplicating.
- **Component tiers** — place UI by _domain-awareness_, not size:
  - `src/components/ui` — raw primitives (Button, Input); domain-agnostic, props-only,
    no data/state.
  - `src/components/composites` — combinations of primitives; still domain-agnostic.
  - `src/features/*/components` — feature components; know the domain, use hooks/data.
- **Dependency direction (never violate):** `ui` ← `composites` ← `features`. `ui` must
  never import from `composites` or `features`; `composites` never from `features`.
- **Feature boundaries:** import a feature only via its `index.ts` barrel; never reach
  into another feature's internals.
- **Rule of three:** extract a shared util/composite on the _third_ duplication, not the
  second. Avoid premature abstraction.
- **State:** server data → TanStack Query (never a global store); UI/session state →
  Zustand.

## Finishing a feature

- Run the review loop (`/code-review`, then the `simplify` skill) until no High/Medium
  findings remain (max 2 passes).
- Update `docs/product-overview.md` and the feature doc's Status when the feature lands.

## Naming & exports

- Components `PascalCase.tsx`; hooks `useX.ts`; utils/config `kebab-case.ts`.
- Prefer named exports; default exports only for `app/` route files (Next.js requires
  them).
