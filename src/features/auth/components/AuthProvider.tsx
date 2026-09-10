"use client";

import type { User } from "@supabase/supabase-js";
import { type ReactNode, useEffect } from "react";

import { createClient } from "@/lib/supabase/client";

import { useSessionStore } from "../store/session-store";

type AuthProviderProps = {
  /** Server-verified user, used to seed the store and avoid a flash. */
  initialUser: User | null;
  children: ReactNode;
};

/**
 * Seeds the session store from the server and subscribes to Supabase auth
 * changes (sign-in/out, token refresh, other tabs) so client UI stays current.
 */
export function AuthProvider({ initialUser, children }: AuthProviderProps) {
  const setUser = useSessionStore((state) => state.setUser);

  useEffect(() => {
    setUser(initialUser);

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [initialUser, setUser]);

  return children;
}
