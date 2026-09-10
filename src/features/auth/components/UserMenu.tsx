"use client";

import { signOut } from "../api/auth-actions";
import { useSession } from "../hooks/useSession";
import { SubmitButton } from "./SubmitButton";

/** Shows the signed-in user's email and a sign-out action. */
export function UserMenu() {
  const { user } = useSession();

  return (
    <div className="flex items-center gap-3">
      {user?.email && (
        <span className="text-muted-foreground hidden max-w-[12rem] truncate text-sm sm:inline">
          {user.email}
        </span>
      )}
      <form action={signOut}>
        <SubmitButton variant="outline" pendingLabel="Signing out…">
          Sign out
        </SubmitButton>
      </form>
    </div>
  );
}
