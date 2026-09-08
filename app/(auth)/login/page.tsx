import type { Metadata } from "next";
import Link from "next/link";

import { routes } from "@/config/routes";
import { AuthCard, LoginForm, OAuthButtons } from "@/features/auth";

export const metadata: Metadata = { title: "Log in" };

/** Login page — renders at `/login`. */
export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <AuthCard
        title="Welcome back"
        subtitle="Sign in to continue to AI Typer"
        footer={
          <>
            Don&apos;t have an account?{" "}
            <Link
              href={routes.register}
              className="font-medium underline underline-offset-4"
            >
              Create one
            </Link>
          </>
        }
      >
        <OAuthButtons />
        <div className="my-6 flex items-center gap-3 text-xs text-zinc-500">
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          or continue with email
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <LoginForm />
      </AuthCard>
    </main>
  );
}
