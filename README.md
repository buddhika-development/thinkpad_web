# AI Typer — Web

Marketing/landing site and authenticated web area for **AI Typer**. Built with
Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Other scripts: `pnpm build`, `pnpm start`, `pnpm lint`.

## Project structure

Routing lives in `app/` and stays thin — route files only compose features.
All application code lives under `src/`, organized **feature-first**.

```
app/                      # ROUTING ONLY (thin — composes features)
├── (marketing)/          # public pages         → "/"
├── (auth)/login/         # login                → "/login"
├── (app)/dashboard/      # authenticated area   → "/dashboard"
├── layout.tsx            # root: fonts, metadata
├── globals.css           # Tailwind v4 theme
└── not-found.tsx

src/
├── features/             # domain black-boxes; import ONLY via each index.ts
│   ├── auth/             #   components/ hooks/ api/ + index.ts (public surface)
│   ├── marketing/
│   └── dashboard/
├── components/
│   ├── ui/               # design-system primitives (Button, Input, …)
│   └── layout/           # Navbar, Footer, Sidebar
├── lib/                  # framework-agnostic pure helpers
├── hooks/                # cross-feature hooks only
├── providers/            # React context providers (Query, Theme, …)
├── config/               # routes, site constants, env
├── store/                # global Zustand stores (UI/session state)
├── styles/
└── types/                # shared/global types
```

See [docs/architecture.md](docs/architecture.md) for the conventions and the
reasoning behind this layout.

> **Note:** This project uses a modified Next.js 16 — consult
> `node_modules/next/dist/docs/` before relying on older Next.js conventions.
