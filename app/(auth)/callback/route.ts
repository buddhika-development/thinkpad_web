import { NextResponse } from "next/server";

import { routes } from "@/config/routes";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth / email-confirmation callback. Supabase redirects here with a `code`
 * which we exchange (PKCE) for a session cookie, then forward the user on.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? routes.dashboard;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}${routes.login}?error=auth`);
}
