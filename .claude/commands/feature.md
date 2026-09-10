---
description: Kick off a new feature — discuss the approach, then capture a feature doc (Flow 1)
argument-hint: <feature-name>
---

Run **Flow 1 — Feature Kickoff & Documentation** for: **$ARGUMENTS**

This is a discussion-and-documentation pass. **Do NOT write or modify any application
code in this command** — that is Flow 2 (`/ship-feature`). Follow
[docs/workflows.md](docs/workflows.md) "Flow 1".

Steps:

1. Ask me clarifying questions until the requirement is unambiguous.
2. Propose one or more approaches. For each, surface **pitfalls, edge cases, and
   risks**.
3. **Reuse check:** search `src/components/ui`, `src/components/composites`, `src/lib`,
   and existing features for anything already built that this feature can use. Report
   what's reusable.
4. Check the approach fits [docs/architecture.md](docs/architecture.md) (feature-first,
   component tiers, dependency direction, state rules).
5. Wait for me to approve an approach.
6. Once approved, write `docs/features/$ARGUMENTS.md` using
   [docs/features/_template.md](docs/features/_template.md) — filled with the
   requirement, approach, pitfalls, reuse, and state decisions we agreed on. Keep it at
   decision/intent altitude.
7. If a notable architectural decision was made, add an ADR from
   [docs/adr/_template.md](docs/adr/_template.md).

Stop after the feature doc is written. Do not implement — tell me to run
`/ship-feature $ARGUMENTS` when I'm ready to build.
