"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";

import { MenuIcon, XIcon } from "@/components/ui/icons";
import { routes } from "@/config/routes";
import { ThemeToggle } from "@/features/settings";
import { useUnsavedChanges } from "@/providers/unsaved-changes-provider";

const NAV = [
  { href: routes.dashboard, label: "Dashboard" },
  { href: routes.writer, label: "Writer" },
  { href: routes.settings, label: "Settings" },
];

/**
 * Authenticated app-shell header: brand, primary nav, theme toggle, and user
 * menu. On desktop the nav is inline; below `md` it collapses into a hamburger
 * that toggles a dropdown. Client component (needs the open/close + active-link
 * state); `UserMenu` is passed in as a prop so this file never imports the
 * auth feature's server-only code into the client bundle.
 */
export function AppShellHeader({ userMenu }: { userMenu: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { interceptNavigation } = useUnsavedChanges();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (interceptNavigation(href)) {
      e.preventDefault();
      setOpen(false);
    }
  };

  const linkClass = (href: string) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      pathname === href
        ? "bg-muted text-foreground"
        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
    }`;

  return (
    <header className="border-border bg-background/80 sticky top-0 z-30 border-b backdrop-blur-md">
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle navigation"
            className="border-border text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded-lg border transition focus-visible:ring-2 focus-visible:outline-none md:hidden"
          >
            {open ? (
              <XIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </button>

          <Link
            href={routes.dashboard}
            onClick={(e) => handleLinkClick(e, routes.dashboard)}
            className="mr-2 flex items-center gap-2 font-semibold tracking-tight sm:mr-3"
          >
            <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg text-[13px] font-bold">
              T
            </span>
            ThinkPad
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                onClick={(e) => handleLinkClick(e, href)}
                className={linkClass(href)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {userMenu}
        </div>

        {open && (
          <nav className="animate-scale-in border-border bg-background shadow-pop absolute inset-x-0 top-full flex flex-col gap-1 border-b p-3 md:hidden">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                onClick={(e) => {
                  handleLinkClick(e, href);
                  setOpen(false);
                }}
                className={linkClass(href)}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
