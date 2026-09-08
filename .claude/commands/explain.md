---
description: Explain & audit what exists in the code + docs — what, why, and what to watch out for
argument-hint: "[topic | feature | path]  (omit for a project overview)"
---

Explain: **$ARGUMENTS**

You are running the **comprehension & audit flow**. This is **read-only** — do NOT
modify any code or docs (the one exception is offered explicitly in step 5).

## Scope

- If `$ARGUMENTS` is empty → give a **project overview**, grounded in
  [docs/product-overview.md](../../docs/product-overview.md),
  [docs/architecture.md](../../docs/architecture.md), and
  [docs/workflows.md](../../docs/workflows.md).
- If `$ARGUMENTS` names a feature / file / config / decision → give a **deep-dive**
  on just that, grounded in its code plus its doc (feature doc, ADR, etc.).

Match altitude to scope: no argument → the map; an argument → the detail.

## Grounding rules (critical — do not skip)

1. **`WHAT` comes from the code.** Read the actual files; report what is really there.
2. **`WHY` comes from the docs, not from guessing.** Look for the rationale in
   `docs/adr/`, the relevant `docs/features/*.md`, `docs/architecture.md`,
   `docs/workflows.md`, and `CLAUDE.md`. Cite the source.
3. **If the "why" is not documented anywhere, say so explicitly** — e.g.
   _"⚠️ Undocumented — no ADR or feature doc records this; the following is inferred
   from the code."_ **Never fabricate a rationale.** Honest "unknown" beats a
   confident guess.

## Output contract (use these exact slots)

For the overview, apply the slots at project altitude; for a deep-dive, apply them to
the target.

- **WHAT** — what exists / was done (from the code).
- **WHY** — the rationale, each point cited to its doc, or marked ⚠️ undocumented/inferred.
- **HOW IT FITS** — where it sits in the architecture; what depends on it / what it
  depends on.
- **WATCH OUT** — caveats, constraints, gotchas, and things not to break.
- **SOURCES** — the exact files and docs this explanation is grounded in.

## Audit (what makes this more than a narrator)

While explaining, actively check for and report:

- **Drift** — places where the code contradicts the docs/rules (e.g. an import that
  violates the dependency direction, server data in a global store, a feature imported
  by its internals instead of its barrel). List each mismatch.
- **Gaps** — real decisions with no ADR, or features with no doc. List what's missing.

## Close

If the audit surfaced a meaningful gap (an undocumented decision worth capturing),
**offer** to record it — an ADR from [docs/adr/_template.md](../../docs/adr/_template.md)
or a feature doc — but only create it if I say yes.
