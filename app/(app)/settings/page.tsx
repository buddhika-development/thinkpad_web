import type { Metadata } from "next";

import { Card } from "@/components/composites/Card";
import { getCurrentUser } from "@/features/auth";
import { CanvasStyleSelector, ThemeSelector } from "@/features/settings";

export const metadata: Metadata = { title: "Settings" };

/**
 * Settings — renders at `/settings` inside the authenticated shell. Appearance
 * and canvas style sync to the user's Supabase profile; account info shown here.
 */
export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
      <h1 className="text-foreground mb-8 text-2xl font-semibold tracking-tight">
        Settings
      </h1>

      <div className="flex flex-col gap-5">
        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-foreground text-base font-semibold">
              Appearance
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Choose your theme. It&apos;s saved to your account and follows you
              across devices.
            </p>
          </div>
          <ThemeSelector />
        </Card>

        <Card className="p-6">
          <div className="mb-4">
            <h2 className="text-foreground text-base font-semibold">
              Writing canvas
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              The paper style for your scratch pad and rewrite panes.
            </p>
          </div>
          <CanvasStyleSelector />
        </Card>

        <Card className="p-6">
          <h2 className="text-foreground text-base font-semibold">Account</h2>
          <dl className="border-border mt-4 flex items-center justify-between border-t pt-4">
            <dt className="text-muted-foreground text-sm">Email</dt>
            <dd className="text-foreground text-sm font-medium">
              {user?.email}
            </dd>
          </dl>
        </Card>
      </div>
    </main>
  );
}
