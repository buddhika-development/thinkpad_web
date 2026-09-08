import Link from "next/link";
import { redirect } from "next/navigation";

import { routes } from "@/config/routes";
import { AuthProvider, getCurrentUser, UserMenu } from "@/features/auth";

/**
 * Authenticated app shell — wraps the logged-in product area
 * (dashboard, settings, etc.). Server-side guard runs here (secure check);
 * `proxy.ts` provides the optimistic first pass. `AuthProvider` mirrors the
 * verified user into the client session store for the nav.
 */
export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();
  if (!user) redirect(routes.login);

  return (
    <AuthProvider initialUser={user}>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <Link
            href={routes.dashboard}
            className="font-semibold tracking-tight"
          >
            AI Typer
          </Link>
          <UserMenu />
        </header>
        {children}
      </div>
    </AuthProvider>
  );
}
