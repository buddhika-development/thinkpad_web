"use client";

import { useActionState } from "react";

import { Field } from "@/components/composites/Field";

import { type AuthState, signUpWithPassword } from "../api/auth-actions";
import { SubmitButton } from "./SubmitButton";

export function RegisterForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(
    signUpWithPassword,
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
        autoComplete="new-password"
        placeholder="At least 8 characters"
        minLength={8}
        required
      />
      {state?.error && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}
      {state?.message && (
        <p className="text-sm text-green-600 dark:text-green-400">
          {state.message}
        </p>
      )}
      <SubmitButton className="w-full" pendingLabel="Creating account…">
        Create account
      </SubmitButton>
    </form>
  );
}
