"use client";

import { cn } from "@/lib/utils";

type PageBackgroundProps = {
  className?: string;
};

export function PageBackground({ className }: PageBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none fixed inset-0 z-0 overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-[#02060e]" />
      <div className="absolute inset-0 bg-[radial-gradient(85%_60%_at_50%_0%,rgba(37,99,235,0.22)_0%,rgba(37,99,235,0)_62%),radial-gradient(65%_50%_at_12%_100%,rgba(56,189,248,0.14)_0%,rgba(56,189,248,0)_70%),radial-gradient(65%_55%_at_100%_100%,rgba(99,140,255,0.12)_0%,rgba(99,140,255,0)_74%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute inset-0 opacity-10 bg-noise-texture" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/14" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/6" />
    </div>
  );
}

export default PageBackground;


