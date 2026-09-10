import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { routes } from "@/config/routes";

import { getSupabaseEnv } from "./env";

/** Path prefixes that require an authenticated user. */
const PROTECTED_PREFIXES = [routes.dashboard, routes.writer, routes.settings];

/**
 * Refreshes the Supabase session cookie on every request and performs an
 * optimistic auth guard. Called from the root `proxy.ts`.
 *
 * Important (per Supabase SSR docs): do not run logic between
 * `createServerClient` and `getUser()`, and always return the `response`
 * object so refreshed cookies reach the browser — copying them onto any
 * redirect response, or the session desyncs.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const { url, anonKey } = getSupabaseEnv();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isAuthPage = pathname === routes.login || pathname === routes.register;

  if (!user && isProtected) {
    return redirectWithSession(request, response, routes.login);
  }
  if (user && isAuthPage) {
    return redirectWithSession(request, response, routes.dashboard);
  }

  return response;
}

/** Redirects while preserving the refreshed session cookies. */
function redirectWithSession(
  request: NextRequest,
  response: NextResponse,
  pathname: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const redirect = NextResponse.redirect(url);
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}
