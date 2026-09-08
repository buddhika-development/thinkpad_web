import type { User } from "@supabase/supabase-js";
import { create } from "zustand";

type SessionState = {
  user: User | null;
  setUser: (user: User | null) => void;
};

/**
 * Client-side mirror of the authenticated user. Populated by `AuthProvider`
 * from the server-verified user and kept in sync via `onAuthStateChange`.
 * UI/session state only — the server client remains the source of truth.
 */
export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
