import { createClient } from "@/lib/supabase/server";

/**
 * Returns the server-verified authenticated user (or null). Safe for guards
 * and shell UI: `getUser()` revalidates the token with Supabase rather than
 * trusting the raw cookie.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
