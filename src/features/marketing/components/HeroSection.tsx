"use client";

import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";
import { SparklesIcon, CheckIcon } from "@/components/ui/icons";
import { routes } from "@/config/routes";
import { HeroTypingDemo } from "./HeroTypingDemo";

export function HeroSection() {
  return (
    <section className="relative flex flex-1 flex-col items-center justify-start w-full max-w-5xl mx-auto gap-6 sm:gap-8 lg:gap-10 py-6 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 select-none">
      {/* Background paper texture & warm ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 opacity-30 dark:opacity-15 paper-ruled-lines"
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[450px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* TOP SECTION: Text Information & Slogan */}
      <div className="w-full flex flex-col items-center text-center gap-3 sm:gap-4 shrink-0">

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
          You think freely.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-accent to-amber-500">
            We arrange flawlessly.
          </span>
        </h1>

        {/* Core Philosophy Statement */}
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl px-2">
          Most people think best on paper or raw note pads, but uninhibited thoughts lack structure, alignment, and grammar. Standard AI rewrites your voice into generic robotic interpretations. <strong className="text-foreground font-semibold">ThinkPad clears your grammar, spelling, and alignment</strong> — without writing or thinking for you.
        </p>

        {/* Action CTAs & Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1">
          <Link
            href={routes.register}
            className={`${buttonStyles("primary")} px-6 sm:px-7 py-2.5 sm:py-3 text-sm sm:text-base shadow-pop group`}
          >
            <SparklesIcon className="size-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>Start Thinking Free</span>
          </Link>

          <Link
            href={routes.login}
            className={`${buttonStyles("outline")} px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base`}
          >
            Log In
          </Link>

          <div className="hidden sm:flex items-center gap-4 text-xs sm:text-sm font-medium text-muted-foreground pl-4 border-l border-border/60">
            <span className="flex items-center gap-1.5">
              <CheckIcon className="size-4 text-accent" /> 100% Authentic Voice
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon className="size-4 text-accent" /> Zero AI Over-Writing
            </span>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: Immersive Workspace Demo Card */}
      <div className="w-full">
        <HeroTypingDemo />
      </div>

    </section>
  );
}
