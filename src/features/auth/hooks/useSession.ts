import { useSessionStore } from "../store/session-store";

/**
 * Read the current client-side session. Backed by the Zustand session store
 * that `AuthProvider` keeps in sync with Supabase.
 */
export function useSession() {
  const user = useSessionStore((state) => state.user);
  return { user, isAuthenticated: user !== null };
}
