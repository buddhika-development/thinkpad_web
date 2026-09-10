import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/composites/Card";
import { PenIcon, SettingsIcon } from "@/components/ui/icons";
import { routes } from "@/config/routes";
import { getCurrentUser } from "@/features/auth";
import { ThinkPadList } from "@/features/dashboard";

export const metadata: Metadata = { title: "Dashboard" };

const CARDS = [
  {
    href: routes.writer,
    title: "Open the Writer",
    description: "Draft freely and stream an AI rewrite side-by-side.",
    Icon: PenIcon,
  },
  {
    href: routes.settings,
    title: "Settings",
    description: "Switch between light, dark, and system themes.",
    Icon: SettingsIcon,
  },
];

/**
 * Dashboard — renders at `/dashboard` inside the authenticated app shell.
 * Quick links into the product's surfaces and list of ThinkPads.
 */
export default async function DashboardPage() {
  const user = await getCurrentUser();
  const name = user?.email?.split("@")[0];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
      <div className="mb-8">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Welcome{name ? `, ${name}` : ""} 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Pick up where you left off.
        </p>
      </div>

      <ThinkPadList />

      <div className="mt-12 border-t border-border pt-8">
        <h2 className="text-foreground text-[15px] font-semibold mb-4">
          Quick Actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {CARDS.map(({ href, title, description, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group focus-visible:outline-none"
            >
              <Card className="group-hover:shadow-pop group-focus-visible:ring-ring h-full p-5 transition group-hover:-translate-y-0.5 group-focus-visible:ring-2">
                <span className="bg-accent-soft text-accent mb-3 flex size-10 items-center justify-center rounded-xl">
                  <Icon className="size-5" />
                </span>
                <h3 className="text-foreground text-base font-semibold">
                  {title}
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  {description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
