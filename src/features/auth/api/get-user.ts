import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

/**
 * Returns the server-verified authenticated user (or null). Safe for guards
 * and shell UI: `getUser()` revalidates the token with Supabase rather than
 * trusting the raw cookie.
 *
 * Wrapped in React `cache()` so the layout guard and the pages it wraps share a
 * single Supabase round trip per request instead of revalidating repeatedly.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
