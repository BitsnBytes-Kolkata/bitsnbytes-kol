"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import dynamic from "next/dynamic";

const WebGLShader = dynamic(
  () => import("@/components/ui/web-gl-shader").then((mod) => mod.WebGLShader),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-purple)]/20 to-[var(--brand-pink)]/20" />
    ),
  },
);
import { Button } from "@/components/ui/button";
import { LiquidGlassBackdrop } from "@/components/ui/liquid-glass-effect";

const stats = [
  { value: "120+", label: "Active members" },
  { value: "60+", label: "Projects shipped" },
  { value: "10", label: "Partner schools" },
];

export const HeroFuturistic = () => {
  return (
    <section className="relative overflow-hidden rounded-b-[2rem] sm:rounded-b-[3rem] md:rounded-b-[3.5rem] text-white">
      <WebGLShader />
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 sm:gap-8 md:gap-12 px-4 pb-8 pt-16 sm:px-6 sm:pb-16 sm:pt-24 md:pb-20 md:pt-28 lg:flex-row lg:items-stretch lg:gap-16">
        {/* Left content card */}
        <div className="flex-1">
          <div className="relative isolate flex h-full flex-col gap-5 sm:gap-6 md:gap-8 rounded-2xl sm:rounded-3xl md:rounded-[32px] border border-white/30 bg-white/70 p-5 sm:p-6 md:p-8 text-foreground shadow-xl dark:border-white/10 dark:bg-white/10 dark:text-white">
            <LiquidGlassBackdrop radiusClassName="rounded-[inherit]" />

            {/* Teen-led badge */}
            <span className="relative z-10 inline-flex w-fit items-center gap-1.5 sm:gap-2 rounded-full border border-white/30 px-3 sm:px-4 py-1 text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-foreground/70 dark:text-white/80">
              <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              TEEN-LED
            </span>

            {/* Main content */}
            <div className="relative z-10 space-y-4 sm:space-y-5 md:space-y-6">
              <h1 className="font-display text-2xl font-bold leading-tight text-foreground dark:text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                India&apos;s boldest builders club for ambitious teens
              </h1>
              <p className="text-sm text-foreground/80 dark:text-white/70 sm:text-base md:text-lg lg:text-xl max-w-prose">
                We host premium hackathons, design/dev squads, and real-world
                launches—run entirely by students who want to ship things that
                matter.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="relative z-10 flex flex-col gap-2 sm:gap-3 sm:flex-row">
              <Button
                asChild
                className="h-11 sm:h-12 rounded-full bg-[var(--brand-pink)] text-sm sm:text-base font-semibold text-white shadow-[var(--glow-strong)] w-full sm:w-auto justify-center"
              >
                <Link href="/join">
                  Join the crew
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 sm:h-12 rounded-full border-white/40 bg-white/10 text-sm sm:text-base text-foreground hover:bg-white/20 dark:text-white w-full sm:w-auto justify-center"
              >
                <Link href="/impact">See what we&apos;ve built</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="relative z-10 grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 rounded-2xl sm:rounded-3xl border border-white/30 bg-white/30 p-4 sm:p-5 md:p-6 text-foreground shadow-lg backdrop-blur-3xl dark:border-white/10 dark:bg-white/5 dark:text-white">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="space-y-0.5 sm:space-y-1 text-center sm:text-left"
                >
                  <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-foreground/60 dark:text-white/60 leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right image card - hidden on mobile, shown on lg+ */}
        <div className="relative flex-1 hidden lg:block">
          <div className="relative isolate overflow-hidden rounded-[32px] border border-white/30 shadow-xl backdrop-blur-2xl dark:border-white/20 h-full">
            <Image
              src="/images/432a787b-bfde-4dd0-8c2a-cb994146a3b9-1-105-c.jpeg"
              alt="Scrapyard Lucknow teens building together"
              width={900}
              height={1000}
              className="h-full w-full object-cover min-h-[420px]"
              priority
            />
            <div className="absolute inset-0 bg-[var(--brand-purple)]/30" />
            <div className="absolute bottom-4 left-4 right-4 z-20 rounded-2xl border border-white/40 bg-white/80 px-4 py-3 sm:px-5 sm:py-4 shadow-2xl backdrop-blur-2xl dark:border-white/30 dark:bg-white/20">
              <div>
                <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[var(--brand-purple)] dark:text-white">
                  Archive highlight
                </p>
                <p className="font-display text-sm sm:text-base font-bold text-foreground dark:text-white">
                  Scrapyard Lucknow · 2024
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only image - smaller, inline */}
        <div className="relative lg:hidden">
          <div className="relative isolate overflow-hidden rounded-2xl sm:rounded-3xl border border-white/30 shadow-xl backdrop-blur-2xl dark:border-white/20">
            <Image
              src="/images/432a787b-bfde-4dd0-8c2a-cb994146a3b9-1-105-c.jpeg"
              alt="Scrapyard Lucknow teens building together"
              width={900}
              height={500}
              className="h-48 sm:h-56 md:h-64 w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[var(--brand-purple)]/30" />
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-20 rounded-xl sm:rounded-2xl border border-white/40 bg-white/80 px-3 py-2 sm:px-4 sm:py-3 shadow-2xl backdrop-blur-2xl dark:border-white/30 dark:bg-white/20">
              <div>
                <p className="text-[0.55rem] sm:text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-[var(--brand-purple)] dark:text-white">
                  Archive highlight
                </p>
                <p className="font-display text-xs sm:text-sm font-bold text-foreground dark:text-white">
                  Scrapyard Lucknow · 2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroFuturistic;
