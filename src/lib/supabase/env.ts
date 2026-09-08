/**
 * Reads and validates the public Supabase environment variables.
 * Throwing here surfaces a clear message instead of an opaque failure deep
 * inside the Supabase client when the `.env` keys are missing.
 */
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file.",
    );
  }

  return { url, anonKey };
}
