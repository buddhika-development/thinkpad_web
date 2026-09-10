---
description: Build a feature through the implement → verify → review → refactor loop (Flow 2)
argument-hint: <feature-name>
---

Run **Flow 2 — Implementation & Quality Loop** for: **$ARGUMENTS**

**Prerequisite:** `docs/features/$ARGUMENTS.md` must exist (from `/feature`). If it is
missing, stop and tell me to run `/feature $ARGUMENTS` first.

Follow [docs/workflows.md](docs/workflows.md) "Flow 2" and the rules in
[CLAUDE.md](../../CLAUDE.md):

1. **Implement** per the feature doc. Respect the component tiers
   (ui → composites → feature), **reuse first** (search barrels before writing), and the
   dependency direction (`ui` ← `composites` ← `features`).
2. **Verify (deterministic):** run `pnpm verify` (lint + typecheck + duplication) and
   `pnpm knip` (dead code). Confirm `pnpm build` still passes. (Add tests here once
   Vitest is set up.)
3. **Review:** run `/code-review` for correctness, then apply the `simplify` skill for
   reuse, complexity, and altitude cleanups.
4. **Refactor** per the findings — extract repeats to `lib`/`composites` (rule of three),
   replace call-sites, delete dead code.
5. **Re-verify:** repeat steps 2–3 until no High/Medium findings remain (max 2 passes).
6. **Update the big picture:** update `docs/product-overview.md` (feature-map status)
   and the feature doc's Status; add an ADR if a decision changed.

Report what changed at each step. Do not consider the feature done until step 6 is
complete.
