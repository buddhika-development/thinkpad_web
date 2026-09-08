# Development workflows

Every feature in this project moves through **two flows**. Flow 1 decides _what_
and _why_; Flow 2 builds it _clean_. They chain into one feature lifecycle.

```
requirement → [ Flow 1: discuss & document ] → feature doc
                        ↓
              [ Flow 2: build & keep clean ] → code + updated big picture
```

---

## Flow 1 — Feature Kickoff & Documentation

**Purpose:** turn a raw requirement into an agreed approach + durable docs, so the
discussion survives the session (the docs are the project's cross-session memory).

**Trigger:** a new requirement → run `/feature <name>`.

1. **State the requirement** — you describe what you want.
2. **Discuss (planning pass, no code):** clarifying questions → approach option(s)
   → **pitfalls & edge cases** → **reuse check** (search the `ui`, `composites`,
   `lib` barrels and existing features) → architectural fit against
   [architecture.md](architecture.md).
3. **Align** on the approach.
4. **Capture** → write `docs/features/<name>.md` from
   [features/_template.md](features/_template.md).
5. **Record decisions** → add an ADR from [adr/_template.md](adr/_template.md)
   _only_ if a notable decision was made.

**Guardrails**

- No code is written in this flow.
- Docs stay at **decision/intent altitude** ("why", not line-by-line "how").
- The capture step is non-negotiable — it's what turns a transient chat into memory.

**Done when:** the approach is agreed **and** `docs/features/<name>.md` exists.

---

## Flow 2 — Implementation & Quality Loop

**Purpose:** build the feature and actively fight entropy (duplication, dead code,
complexity) instead of accumulating it.

**Trigger:** Flow 1 is done → run `/ship-feature <name>`.

```
1. IMPLEMENT   Build per the feature doc + CLAUDE.md rules.
               • Component tiers: ui (raw) → composites → feature
               • Reuse first: search barrels before writing anything new
               • Dependency direction: ui ← composites ← features
        ↓
2. VERIFY      lint · types · tests · dead-code · duplication   (deterministic)
        ↓
3. REVIEW      /code-review (correctness) + simplify (reuse, complexity, altitude)
        ↓
4. REFACTOR    extract repeats → utils/composites (rule of three),
        ↓      replace call-sites, delete dead code
5. RE-VERIFY   re-run 2 + 3 ── clean? ── no ──┐
        └──────────────────────── yes ─────────┘
        ↓
6. UPDATE      product-overview.md + feature doc Status; add ADR if a decision changed
```

**Guardrails / stop criteria**

- **Refactor only with a safety net** — types + tests must exist before aggressive
  extraction; otherwise keep refactors small.
- **Rule of three** — extract on the _third_ duplication, not the second.
- **Stopping rule** — loop steps 2–5 until no High/Medium findings remain, max 2 passes.

**Done when:** deterministic checks pass, no High/Medium review findings, and
`product-overview.md` + the feature status are updated.

---

## Flow 3 — Comprehension & Audit (supporting)

**Purpose:** understand what exists and why, and catch drift between code and docs. Not
a build flow — a read-only lens over the other two. Doubles as onboarding.

**Trigger:** `/explain [topic]` — omit the topic for a project overview; pass a
feature / file / decision for a deep-dive.

Every explanation uses a fixed five-slot contract — **WHAT** (from the code) · **WHY**
(cited to a doc, or marked ⚠️ undocumented — never fabricated) · **HOW IT FITS** ·
**WATCH OUT** · **SOURCES** — and reports two audit findings: **drift** (code
contradicting the docs/rules) and **gaps** (real decisions with no ADR). When it finds
a gap worth capturing, it offers to write the ADR/feature doc — feeding back into
Flow 1.

---

## Tooling behind the flows

Some steps are manual today and gain automated enforcement over time:

| Capability                                   | Used in         | Status     |
| -------------------------------------------- | --------------- | ---------- |
| `/feature`, `/ship-feature`, `/explain`      | all             | ✅ set up  |
| CLAUDE.md rules                              | both            | ✅ set up  |
| Feature docs + product overview              | both            | ✅ set up  |
| ESLint boundary rules (dependency direction) | Flow 2 verify   | ✅ set up  |
| `knip` (dead code) + `jscpd` (duplication)   | Flow 2 verify   | ✅ set up  |
| Prettier + import ordering                   | Flow 2 verify   | ✅ set up  |
| Vitest (refactor safety net)                 | Flow 2 refactor | ⬜ planned |
| Hooks (auto lint/type/test)                  | Flow 2          | ⬜ later   |
