import type { Metadata } from "next";

import { getCurrentUser } from "@/features/auth";

export const metadata: Metadata = { title: "Dashboard" };

/**
 * Dashboard — renders at `/dashboard` inside the authenticated app shell.
 * Widgets will be composed from `@/features/dashboard`.
 */
export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Welcome{user?.email ? `, ${user.email}` : ""}
      </h1>
      <p className="max-w-sm text-zinc-600 dark:text-zinc-400">
        You&apos;re signed in. Dashboard widgets coming next.
      </p>
    </main>
  );
}
