import Link from "next/link";

import { buttonStyles } from "@/components/ui/Button";
import { routes } from "@/config/routes";

/**
 * Landing page — public entry point. Renders at `/`.
 * Marketing sections will be composed here from `@/features/marketing`.
 */
export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          ThinkPad
        </h1>
        <p className="mx-auto max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          Type smarter with ThinkPad. Create an account to get started, or sign in to
          pick up where you left off.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href={routes.register} className={buttonStyles("primary")}>
          Get started
        </Link>
        <Link href={routes.login} className={buttonStyles("outline")}>
          Log in
        </Link>
      </div>
    </main>
  );
}
