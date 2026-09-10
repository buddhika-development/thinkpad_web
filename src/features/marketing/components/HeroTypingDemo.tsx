"use client";

import { useEffect, useState, useMemo } from "react";
import { SparklesIcon, RefreshIcon, CheckIcon, PenIcon } from "@/components/ui/icons";

export interface PresetSample {
  id: string;
  label: string;
  rawText: string;
  errors: { text: string; type: "typo" | "grammar"; fix: string; reason: string }[];
  arrangedText: string;
}

const PRESETS: PresetSample[] = [
  {
    id: "pizza",
    label: "Buddhika's Note (Pizza)",
    rawText: "me buddhika. i lov cooked peeza each every today",
    errors: [
      { text: "me buddhika", type: "grammar", fix: "I am Buddhika", reason: "Grammar & capitalization" },
      { text: "lov", type: "typo", fix: "love", reason: "Spelling typo" },
      { text: "peeza", type: "typo", fix: "pizza", reason: "Spelling typo" },
      { text: "each every today", type: "grammar", fix: "each and every day", reason: "Phrasing alignment" }
    ],
    arrangedText: "I am Buddhika, I love cooked pizza each and every day."
  },
  {
    id: "braindump",
    label: "Messy Brain Dump",
    rawText: "i thinck we need to postpone launch untill next week, bugs are everywhere in auth flow",
    errors: [
      { text: "i thinck", type: "typo", fix: "I think", reason: "Capitalization & typo" },
      { text: "untill", type: "typo", fix: "until", reason: "Spelling typo" },
      { text: "bugs are everywhere in auth flow", type: "grammar", fix: "there are bugs in the authentication flow", reason: "Grammar alignment" }
    ],
    arrangedText: "I think we need to postpone launching until next week because there are bugs in the authentication flow."
  },
  {
    id: "meeting",
    label: "Raw Meeting Notes",
    rawText: "client want pdf export by friday but db migration carry risk if we rush it",
    errors: [
      { text: "client want", type: "grammar", fix: "The client wants", reason: "Subject-verb agreement" },
      { text: "by friday", type: "grammar", fix: "by Friday", reason: "Capitalization" },
      { text: "carry risk", type: "grammar", fix: "carries risk", reason: "Subject-verb agreement" }
    ],
    arrangedText: "The client wants PDF export by Friday, but database migration carries risk if we rush it."
  }
];

type Phase = "typing" | "analyzing" | "streaming" | "done";

export function HeroTypingDemo() {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [typedCount, setTypedCount] = useState(0);
  const [streamedCount, setStreamedCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pattern, setPattern] = useState<"ruled" | "dotted" | "blank">("ruled");
  const [mobilePane, setMobilePane] = useState<"raw" | "arranged">("raw");

  const currentPreset = (PRESETS[activePresetIndex] ?? PRESETS[0])!;

  // Reset counters when switching preset
  const handleSelectPreset = (index: number) => {
    setActivePresetIndex(index);
    setPhase("typing");
    setTypedCount(0);
    setStreamedCount(0);
    setMobilePane("raw");
  };

  const handleRestart = () => {
    setPhase("typing");
    setTypedCount(0);
    setStreamedCount(0);
    setMobilePane("raw");
  };

  // State machine loop
  useEffect(() => {
    if (isPaused) return;

    if (phase === "typing") {
      if (typedCount < currentPreset.rawText.length) {
        const timeout = setTimeout(() => {
          setTypedCount((prev) => prev + 1);
        }, Math.floor(Math.random() * 25) + 20);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setPhase("analyzing");
        }, 500);
        return () => clearTimeout(timeout);
      }
    }

    if (phase === "analyzing") {
      const timeout = setTimeout(() => {
        setPhase("streaming");
        setMobilePane("arranged"); // Auto-switch to arranged view on mobile when streaming begins
      }, 1200);
      return () => clearTimeout(timeout);
    }

    if (phase === "streaming") {
      if (streamedCount < currentPreset.arrangedText.length) {
        const timeout = setTimeout(() => {
          setStreamedCount((prev) => prev + 1);
        }, 18);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setPhase("done");
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }

    if (phase === "done") {
      const timeout = setTimeout(() => {
        const nextIndex = (activePresetIndex + 1) % PRESETS.length;
        setActivePresetIndex(nextIndex);
        setPhase("typing");
        setTypedCount(0);
        setStreamedCount(0);
        setMobilePane("raw");
      }, 4500);
      return () => clearTimeout(timeout);
    }
  }, [phase, typedCount, streamedCount, isPaused, currentPreset, activePresetIndex]);

  // Render raw notes with squiggly error underlines during analysis
  const renderedRawText = useMemo(() => {
    const textSoFar = currentPreset.rawText.slice(0, typedCount);
    if (phase === "typing") {
      return <span>{textSoFar}</span>;
    }

    let nodes: React.ReactNode[] = [];
    let remaining = textSoFar;
    let keyIdx = 0;

    currentPreset.errors.forEach((err) => {
      const idx = remaining.indexOf(err.text);
      if (idx !== -1) {
        const before = remaining.slice(0, idx);
        if (before) nodes.push(<span key={keyIdx++}>{before}</span>);

        const errClass =
          err.type === "typo"
            ? "error-squiggly text-red-600 dark:text-red-400 font-medium bg-red-500/10 px-1 py-0.5 rounded"
            : "grammar-squiggly text-amber-700 dark:text-amber-300 font-medium bg-amber-500/10 px-1 py-0.5 rounded";

        nodes.push(
          <span key={keyIdx++} className={errClass} title={err.reason}>
            {err.text}
          </span>
        );
        remaining = remaining.slice(idx + err.text.length);
      }
    });

    if (remaining) nodes.push(<span key={keyIdx++}>{remaining}</span>);
    return <>{nodes}</>;
  }, [currentPreset, typedCount, phase]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-3">

      {/* Realistic App Window Shell */}
      <div className="relative rounded-2xl border border-border/80 bg-card shadow-pop overflow-hidden flex flex-col min-h-[300px] sm:min-h-[340px] md:min-h-[360px]">

        {/* App Header Bar */}
        <div className="relative z-10 flex items-center justify-between px-4 sm:px-5 py-3 border-b border-border/60 bg-muted/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-red-400/80" />
              <span className="size-2.5 rounded-full bg-amber-400/80" />
              <span className="size-2.5 rounded-full bg-emerald-400/80" />
            </div>

            <span className="text-xs sm:text-sm font-mono font-semibold text-foreground flex items-center gap-2 pl-3 border-l border-border/60">
              <PenIcon className="size-4 text-accent" />
              My Thoughts.thinkpad
            </span>
          </div>

          {/* Pattern & Mobile Tab Controls */}
          <div className="flex items-center gap-2">
            {/* Mobile Pane Switcher Toggle */}
            <div className="flex md:hidden items-center bg-background/80 rounded-lg border border-border/60 p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setMobilePane("raw")}
                className={`px-2.5 py-1 rounded transition ${mobilePane === "raw" ? "bg-accent text-accent-foreground font-bold" : "text-muted-foreground"}`}
              >
                1. You Think
              </button>
              <button
                type="button"
                onClick={() => setMobilePane("arranged")}
                className={`px-2.5 py-1 rounded transition ${mobilePane === "arranged" ? "bg-emerald-600 text-white font-bold" : "text-muted-foreground"}`}
              >
                2. We Arrange
              </button>
            </div>

            {/* Pattern Switcher (Desktop & Mobile) */}
            <div className="hidden sm:flex items-center gap-1 bg-background/80 rounded-lg border border-border/60 p-0.5 text-xs font-mono text-muted-foreground">
              <button
                type="button"
                onClick={() => setPattern("ruled")}
                className={`px-2.5 py-1 rounded ${pattern === "ruled" ? "bg-muted text-foreground font-bold" : ""}`}
              >
                Ruled
              </button>
              <button
                type="button"
                onClick={() => setPattern("dotted")}
                className={`px-2.5 py-1 rounded ${pattern === "dotted" ? "bg-muted text-foreground font-bold" : ""}`}
              >
                Dotted
              </button>
              <button
                type="button"
                onClick={() => setPattern("blank")}
                className={`px-2.5 py-1 rounded ${pattern === "blank" ? "bg-muted text-foreground font-bold" : ""}`}
              >
                Blank
              </button>
            </div>

            <div className="hidden xs:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-semibold shadow-sm">
              <SparklesIcon className="size-3.5 animate-pulse" />
              <span>Arrange Note</span>
            </div>
          </div>
        </div>

        {/* Workspace Panes Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/60 flex-1 min-h-[240px]">

          {/* Left Pane: Raw Unorganized Notes Canvas (YOU THINK) */}
          <div className={`relative p-5 sm:p-6 md:p-7 flex flex-col justify-between bg-card ${mobilePane === "arranged" ? "hidden md:flex" : "flex"} ${pattern === "ruled" ? "paper-ruled-lines" : pattern === "dotted" ? "paper-grid-bg" : ""}`}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-xs sm:text-sm font-sans font-bold tracking-tight text-muted-foreground uppercase flex items-center gap-2">
                  <PenIcon className="size-3.5 text-amber-600 dark:text-amber-400" />
                  Raw Note-Taking (You Think)
                </span>
                {phase === "typing" && (
                  <span className="text-xs font-mono text-amber-600 dark:text-amber-400 animate-pulse">
                    Typing thoughts...
                  </span>
                )}
                {phase === "analyzing" && (
                  <span className="text-xs font-mono text-red-500 font-medium">
                    Detecting typos & grammar...
                  </span>
                )}
              </div>

              {/* Raw Editor Text */}
              <p className="font-mono text-sm sm:text-base md:text-lg leading-relaxed text-foreground/90 min-h-[110px]">
                {renderedRawText}
                {phase === "typing" && (
                  <span className="inline-block w-2 h-4 ml-0.5 bg-accent animate-cursor-blink align-middle" />
                )}
              </p>
            </div>

            <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>Raw Draft</span>
              <span>100% Your Authentic Voice</span>
            </div>
          </div>

          {/* Right Pane: ThinkPad Arranged Output Canvas (WE ARRANGE) */}
          <div className={`relative p-5 sm:p-6 md:p-7 flex flex-col justify-between bg-muted/20 ${mobilePane === "raw" ? "hidden md:flex" : "flex"}`}>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <span className="text-xs sm:text-sm font-sans font-bold tracking-tight text-emerald-700 dark:text-emerald-400 uppercase flex items-center gap-2">
                  <SparklesIcon className="size-3.5 text-emerald-500" />
                  ThinkPad Arranged (We Arrange)
                </span>
                {phase === "streaming" && (
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 animate-pulse">
                    Streaming response...
                  </span>
                )}
                {phase === "done" && (
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckIcon className="size-3.5" /> Arranged
                  </span>
                )}
              </div>

              {/* Streamed Result Text */}
              {(phase === "typing" || phase === "analyzing") && (
                <div className="flex flex-col items-center justify-center min-h-[110px] text-center text-muted-foreground/60 text-xs sm:text-sm font-sans gap-2">
                  <SparklesIcon className="size-5 text-muted-foreground/40 animate-pulse" />
                  <span>Waiting for notes... ThinkPad will arrange your prose without rewriting your voice.</span>
                </div>
              )}

              {(phase === "streaming" || phase === "done") && (
                <div className="p-3.5 sm:p-4 rounded-xl bg-card border border-emerald-500/30 shadow-soft font-mono text-sm sm:text-base md:text-lg text-foreground leading-relaxed animate-scale-in min-h-[110px]">
                  {currentPreset.arrangedText.slice(0, streamedCount)}
                  {phase === "streaming" && (
                    <span className="inline-block w-2 h-4 ml-0.5 bg-emerald-500 animate-cursor-blink align-middle" />
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-mono">
              <span className="flex items-center gap-1.5">
                <CheckIcon className="size-3.5 text-emerald-500" /> Grammar & Spelling Fixed
              </span>
              <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Meaning Preserved
              </span>
            </div>

          </div>

        </div>

        {/* Footer App Ticker */}
        <div className="relative z-10 px-5 py-2.5 border-t border-border/60 bg-muted/40 flex items-center justify-between text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="text-foreground font-semibold">&quot;You think, we arrange.&quot;</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Zero AI Over-Writing</span>
          </div>

          <div className="flex items-center gap-1 text-accent font-sans font-medium">
            <span>ThinkPad Engine v1.0</span>
          </div>
        </div>

      </div>

      {/* Sample Presets & Play/Pause Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        {/* <div className="flex items-center gap-1.5 overflow-x-auto p-1 max-w-full bg-muted/60 rounded-xl border border-border/60 backdrop-blur-sm no-scrollbar">
          {PRESETS.map((p, i) => {
            const isActive = i === activePresetIndex;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(i)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${isActive
                  ? "bg-card text-foreground shadow-soft border border-border/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                  }`}
              >
                {p.label}
              </button>
            );
          })}
        </div> */}

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={() => setIsPaused((v) => !v)}
            className="text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted border border-border/60 rounded-lg px-3 py-1.5 transition flex items-center gap-1.5 shadow-sm"
          >
            {isPaused ? "▶ Play Demo" : "❚❚ Pause Demo"}
          </button>
          <button
            type="button"
            onClick={handleRestart}
            className="text-xs font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted border border-border/60 rounded-lg p-2 transition shadow-sm"
            title="Restart animation"
          >
            <RefreshIcon className="size-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
