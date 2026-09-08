"use client";

import { useActionState } from "react";

import { Field } from "@/components/composites/Field";

import { type AuthState, signInWithPassword } from "../api/auth-actions";
import { SubmitButton } from "./SubmitButton";

export function LoginForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(
    signInWithPassword,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        required
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      {state?.error && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}
      <SubmitButton className="w-full" pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
