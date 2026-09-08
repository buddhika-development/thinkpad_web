import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseEnv } from "./env";

/**
 * Supabase client for Server Components, Server Actions, and Route Handlers.
 *
 * `cookies()` is async in Next.js 16, so this factory is async too. The
 * `setAll` write throws when called from a Server Component (which cannot
 * mutate cookies) — that's expected and safely ignored, because `proxy.ts`
 * refreshes the session cookies on every request.
 */
export async function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component — ignore; proxy handles the refresh.
        }
      },
    },
  });
}
