# Product overview

> The living "big picture" of the web platform. Keep it **lean** — a map that links
> out to feature docs, not a giant essay. Update it whenever a feature lands
> (Flow 2, step 6).

## What this is

**AI Typer — Web** is the browser-facing platform for the AI Typer product. It has
two jobs:

1. **Marketing / landing** — public pages where users explore what the product is,
   how it works, and how to get it.
2. **Authenticated area** — where users log in and engage with the application.

It is one of three siblings in the product (`web`, `electron-app`, `backend
services`); this repo is **web only**.

## Feature map

| Feature   | Route(s)                           | Purpose                       | Status         | Doc                      |
| --------- | ---------------------------------- | ----------------------------- | -------------- | ------------------------ |
| Marketing | `/`                                | Public landing / product info | 🟡 scaffolded  | —                        |
| Auth      | `/login`, `/register`, `/callback` | Sign in / account access      | 🔵 in progress | [auth](features/auth.md) |
| Dashboard | `/dashboard`                       | Authenticated user area       | 🟡 scaffolded  | —                        |

Status legend: 🟡 scaffolded · 🟢 shipped · 🔵 in progress

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
Zustand (UI/session state) · TanStack Query (server state) · pnpm.

## How it's organized

Routing in `app/` (thin), application code in `src/` (feature-first). See
[architecture.md](architecture.md) for conventions and
[workflows.md](workflows.md) for how features are built.
