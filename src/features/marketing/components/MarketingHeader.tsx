"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { buttonStyles } from "@/components/ui/Button";
import { MenuIcon, XIcon, SparklesIcon } from "@/components/ui/icons";
import { routes } from "@/config/routes";
import { ThemeToggle } from "@/features/settings";

interface MarketingHeaderProps {
  onScrollToDemo?: () => void;
}

export function MarketingHeader({ onScrollToDemo }: MarketingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 shrink-0 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href={routes.home}
            className="group flex items-center gap-2.5 font-bold tracking-tight text-foreground transition"
          >
            <div className="border-border/80 bg-card shadow-soft relative flex size-9 items-center justify-center rounded-xl border p-1 transition-transform group-hover:scale-105">
              <Image
                src="/thinkpad.png"
                alt="ThinkPad Logo"
                width={32}
                height={32}
                className="size-7 object-contain"
              />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Think<span className="text-accent">Pad</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              onClick={onScrollToDemo}
              className="text-muted-foreground hover:bg-muted/60 hover:text-foreground rounded-lg px-3 py-1.5 text-sm font-medium transition"
            >
              Interactive Demo
            </button>
            <a
              href="#features"
              className="text-muted-foreground hover:bg-muted/60 hover:text-foreground rounded-lg px-3 py-1.5 text-sm font-medium transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-muted-foreground hover:bg-muted/60 hover:text-foreground rounded-lg px-3 py-1.5 text-sm font-medium transition"
            >
              How it works
            </a>
          </nav>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          
          <Link
            href={routes.login}
            className="text-muted-foreground hover:bg-muted hover:text-foreground hidden rounded-lg px-3.5 py-1.5 text-sm font-medium transition sm:inline-flex"
          >
            Log in
          </Link>

          <Link
            href={routes.register}
            className={`${buttonStyles("primary")} hidden sm:inline-flex items-center gap-1.5 shadow-sm text-sm`}
          >
            <SparklesIcon className="size-4 text-amber-400" />
            Get Started Free
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
            className="border-border text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring inline-flex size-9 items-center justify-center rounded-lg border transition md:hidden"
          >
            {mobileMenuOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="border-border bg-card/95 shadow-pop absolute inset-x-0 top-full flex flex-col gap-2 border-b p-4 backdrop-blur-lg md:hidden">
          <button
            type="button"
            onClick={() => {
              onScrollToDemo?.();
              setMobileMenuOpen(false);
            }}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg px-3 py-2 text-left text-sm font-medium"
          >
            Interactive Demo
          </button>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg px-3 py-2 text-left text-sm font-medium"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg px-3 py-2 text-left text-sm font-medium"
          >
            How it works
          </a>
          <div className="border-border my-1 border-t pt-2 flex flex-col gap-2">
            <Link
              href={routes.login}
              className="text-muted-foreground hover:bg-muted rounded-lg px-3 py-2 text-center text-sm font-medium"
            >
              Log in
            </Link>
            <Link
              href={routes.register}
              className={`${buttonStyles("primary")} justify-center py-2 text-sm`}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
