import type { Metadata } from "next";
import Link from "next/link";

import { routes } from "@/config/routes";
import { AuthCard, OAuthButtons, RegisterForm } from "@/features/auth";

export const metadata: Metadata = { title: "Create account" };

/** Registration page — renders at `/register`. */
export default function RegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <AuthCard
        title="Create your account"
        subtitle="Get started with AI Typer"
        footer={
          <>
            Already have an account?{" "}
            <Link
              href={routes.login}
              className="font-medium underline underline-offset-4"
            >
              Log in
            </Link>
          </>
        }
      >
        <OAuthButtons />
        <div className="my-6 flex items-center gap-3 text-xs text-zinc-500">
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
          or sign up with email
          <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <RegisterForm />
      </AuthCard>
    </main>
  );
}
