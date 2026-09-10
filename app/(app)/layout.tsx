import { redirect } from "next/navigation";

import { AppShellHeader } from "@/components/layout/AppShellHeader";
import { routes } from "@/config/routes";
import { AuthProvider, getCurrentUser, UserMenu } from "@/features/auth";
import { SettingsSyncProvider } from "@/features/settings";
import { ToastProvider } from "@/providers/toast-provider";
import { UnsavedChangesProvider } from "@/providers/unsaved-changes-provider";

/**
 * Authenticated app shell — wraps the logged-in product area (dashboard,
 * writer, settings). The server-side guard runs here (secure check);
 * `proxy.ts` provides the optimistic first pass. `AuthProvider` mirrors the
 * verified user into the client session store; `SettingsSyncProvider` adopts
 * their saved theme/canvas preferences; `ToastProvider` powers canvas feedback.
 */
export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();
  if (!user) redirect(routes.login);

  return (
    <AuthProvider initialUser={user}>
      <SettingsSyncProvider userId={user.id} userMetadata={user.user_metadata}>
        <ToastProvider>
          <UnsavedChangesProvider>
            <div className="flex flex-1 flex-col">
              <AppShellHeader userMenu={<UserMenu />} />
              {children}
            </div>
          </UnsavedChangesProvider>
        </ToastProvider>
      </SettingsSyncProvider>
    </AuthProvider>
  );
}
