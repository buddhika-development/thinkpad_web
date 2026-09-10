"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { routes } from "@/config/routes";
import { createClient } from "@/lib/supabase/server";

/** Result surfaced back to a form via `useActionState`. */
export type AuthState = { error?: string; message?: string } | undefined;

type OAuthProvider = "google" | "facebook";

function readCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
}

/** Builds an absolute URL back to our OAuth/email callback route. */
async function callbackUrl() {
  const origin = (await headers()).get("origin") ?? "";
  return `${origin}${routes.callback}`;
}

export async function signInWithPassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  redirect(routes.dashboard);
}

export async function signUpWithPassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  if (!email || password.length < 8) {
    return { error: "Enter an email and a password of at least 8 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: await callbackUrl() },
  });
  if (error) return { error: error.message };

  // With email confirmation enabled, no session is returned yet.
  if (!data.session) {
    return { message: "Check your email to confirm your account." };
  }

  redirect(routes.dashboard);
}

export async function signInWithOAuth(formData: FormData) {
  const provider = String(formData.get("provider")) as OAuthProvider;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: await callbackUrl() },
  });
  if (error) redirect(`${routes.login}?error=oauth`);

  if (data.url) redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(routes.home);
}
