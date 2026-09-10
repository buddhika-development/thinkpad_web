import type { Metadata } from "next";

import { MarketingHeader, HeroSection } from "@/features/marketing";

export const metadata: Metadata = {
  title: "ThinkPad — You Think, We Arrange.",
  description:
    "Give your thoughts space to breathe. ThinkPad fixes grammar, spelling, and alignment in real time while preserving 100% of your authentic voice.",
};

/**
 * Landing page — public entry point at `/`.
 * Formatted to fit 100vh / 100vw cleanly with tactile paper texture & realistic workspace simulation.
 */
export default function LandingPage() {
  return (
    <div className="flex flex-col flex-1 h-full w-full overflow-hidden justify-between">
      <MarketingHeader />
      <main className="flex-1 flex flex-col justify-center overflow-hidden">
        <HeroSection />
      </main>
    </div>
  );
}
