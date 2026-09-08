import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Deterministic import ordering (auto-fixable).
  {
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

  // ── Architecture boundaries ─────────────────────────────────────────────
  // Dependency direction:  ui (tier 1) ← composites (tier 2) ← features (tier 3)

  // Tier 1 (ui) imports nothing upward.
  {
    files: ["src/components/ui/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/components/composites", "@/components/composites/*"],
              message: "Tier 1 (ui) must not import Tier 2 (composites).",
            },
            {
              group: ["@/features", "@/features/*", "@/features/*/*"],
              message: "Tier 1 (ui) must not import features.",
            },
          ],
        },
      ],
    },
  },

  // Tier 2 (composites) may use ui, never features.
  {
    files: ["src/components/composites/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features", "@/features/*", "@/features/*/*"],
              message: "Tier 2 (composites) must not import features.",
            },
          ],
        },
      ],
    },
  },

  // Everyone else: import a feature only via its index.ts barrel, never its internals.
  {
    files: ["src/**"],
    ignores: ["src/components/ui/**", "src/components/composites/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/*"],
              message:
                "Import a feature only via its barrel (@/features/<name>), not its internals.",
            },
          ],
        },
      ],
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  // Keep Prettier the sole authority on formatting (must stay last).
  prettier,
]);

export default eslintConfig;
