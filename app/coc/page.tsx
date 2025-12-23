"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Heart,
  Users,
  MessageCircle,
  Shield,
  AlertTriangle,
  Mail,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { PageSection } from "@/components/page-section";
import { Button } from "@/components/ui/button";

const WebGLShader = dynamic(
  () =>
    import("@/components/ui/web-gl-shader").then((mod) => ({
      default: mod.WebGLShader,
    })),
  {
    loading: () => null,
    ssr: false,
  },
);

const values = [
  {
    icon: Heart,
    title: "Be Warm & Welcoming",
    description:
      "Make people feel at home. New members shouldn't feel like they walked into the wrong classroom.",
  },
  {
    icon: Users,
    title: "Be Patient & Chill",
    description:
      "Everyone learns differently. Everyone speaks differently. Take a breath before replying.",
  },
  {
    icon: MessageCircle,
    title: "Respect is Non-Negotiable",
    description:
      "We'll disagree sometimes, and that's fine. Just don't make it personal. The goal isn't to \"win,\" it's to learn.",
  },
  {
    icon: Sparkles,
    title: "Build Together",
    description:
      'Instead of "this sucks," try "here\'s how we can make this cooler." No unnecessary sniping or derailing.',
  },
];

const notAllowed = [
  "Harassment or discrimination of any kind",
  "Bullying or intentionally isolating someone",
  "Unwanted romantic or sexual advances",
  "Sharing explicit or inappropriate content",
  "Spamming, trolling, or derailing discussions",
  "Misusing club funds or resources",
  "Doxxing or sharing private information",
];

const strikes = [
  {
    number: "1",
    title: "First Strike",
    description: "Formal warning. May include an apology request.",
    color: "bg-yellow-500",
  },
  {
    number: "2",
    title: "Second Strike",
    description: "Temporary ban from events and community spaces.",
    color: "bg-orange-500",
  },
  {
    number: "3",
    title: "Third Strike",
    description: "Permanent removal from the Bits&Bytes community.",
    color: "bg-red-500",
  },
];

const appliesTo = [
  "All offline meetups, workshops, and events",
  "Discord, WhatsApp, and other official online spaces",
  "Any club-affiliated projects or collaborations",
  "Social media interactions under the Bits&Bytes name",
];

export default function CodeOfConduct() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[45vh] sm:min-h-[50vh] flex items-center justify-center overflow-hidden text-white">
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 md:py-16">
          <div className="relative border-2 border-[var(--brand-pink)]/30 rounded-2xl sm:rounded-[32px] md:rounded-[40px] p-1 sm:p-1.5 md:p-2 backdrop-blur-sm bg-black/10">
            <div className="relative border-2 border-[var(--brand-pink)]/50 rounded-xl sm:rounded-[28px] md:rounded-[36px] py-8 sm:py-10 md:py-12 px-4 sm:px-8 md:px-10 overflow-hidden bg-black/40 backdrop-blur-xl">
              <div className="absolute inset-0 bg-[var(--brand-purple)]/20" />
              <div className="relative z-10 space-y-4 sm:space-y-6 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-pink)]/60 bg-black/40 px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.35em] font-semibold text-white/90 backdrop-blur-md">
                  <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  Community Guidelines
                </span>
                <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-extrabold text-white tracking-tight">
                  Code of Conduct
                </h1>
                <div className="inline-block bg-[var(--brand-pink)] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base md:text-lg font-bold shadow-[0_0_30px_rgba(228,90,146,0.5)]">
                  TL;DR: Be nice. Be cool. Don't cause chaos.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 bg-transparent">
        {/* What We Stand For */}
        <PageSection
          align="center"
          eyebrow="Our Promise"
          title="What we stand for"
          description="Bits&Bytes is home for builders, dreamers, designers, and that one person who always knows the shortcut keys."
        >
          <div className="mx-auto max-w-3xl">
            <div className="glass-card relative isolate overflow-hidden p-5 sm:p-6 md:p-8 text-center shadow-xl">
              <p className="text-sm sm:text-base md:text-lg text-foreground/90 dark:text-white/90 leading-relaxed">
                We want this place to feel friendly, safe, and welcoming for
                everyone, no matter who they are or where they come from. This
                document ensures that the vibe stays positive and everyone feels
                secure, respected, and free to create the next big thing.
              </p>
            </div>
          </div>
        </PageSection>

        {/* Values */}
        <PageSection
          align="center"
          eyebrow="Values"
          title="The energy we expect"
          description="Here's the vibe we need from everyone who joins our world."
        >
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="glass-card relative isolate overflow-hidden p-4 sm:p-6 text-left shadow-xl hover:shadow-[var(--glow-strong)] transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-[var(--brand-pink)]/10 text-[var(--brand-pink)]">
                    <value.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-base sm:text-lg font-bold text-foreground dark:text-white">
                      {value.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PageSection>

        {/* Where This Applies */}
        <PageSection
          align="center"
          eyebrow="Scope"
          title="Where this applies"
          description="If it has the Bits&Bytes name on it, this code covers it."
        >
          <div className="mx-auto max-w-2xl">
            <div className="glass-card relative isolate overflow-hidden p-4 sm:p-6 md:p-8 shadow-xl">
              <ul className="space-y-3 sm:space-y-4">
                {appliesTo.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-foreground dark:text-white"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0 rounded-full bg-[var(--brand-pink)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PageSection>

        {/* Not Allowed */}
        <PageSection
          align="center"
          eyebrow="Boundaries"
          title="Things we don't allow"
          description="Straightforward list of nope. Don't be harmful, creepy, or chaotic."
        >
          <div className="mx-auto max-w-2xl">
            <div className="glass-card relative isolate overflow-hidden p-4 sm:p-6 md:p-8 shadow-xl border-2 border-red-500/20">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-red-500/10">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-red-500">
                  Zero Tolerance
                </span>
              </div>
              <ul className="space-y-2 sm:space-y-3">
                {notAllowed.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-foreground/80 dark:text-white/80"
                  >
                    <span className="text-red-500 shrink-0">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PageSection>

        {/* Consequences */}
        <PageSection
          align="center"
          eyebrow="Accountability"
          title="What happens if you break the rules"
          description="We follow a simple three-strike system to keep things fair."
        >
          <div className="mx-auto max-w-3xl">
            <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
              {strikes.map((strike, index) => (
                <div
                  key={strike.number}
                  className="glass-card relative isolate overflow-hidden p-4 sm:p-6 text-center shadow-xl hover:shadow-[var(--glow-strong)] transition-all duration-300"
                >
                  <div
                    className={`mx-auto mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full ${strike.color} text-white font-bold text-lg sm:text-xl`}
                  >
                    {strike.number}
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-foreground dark:text-white">
                    {strike.title}
                  </h3>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                    {strike.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 sm:mt-6 glass-card relative isolate overflow-hidden p-4 sm:p-6 shadow-xl">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground dark:text-white">
                  Important:
                </strong>{" "}
                For serious violations, the team may take immediate action
                without warning. The Bits&Bytes staff has sole discretion in
                determining what constitutes a violation. Decisions are made to
                maintain a safe, welcoming community.
              </p>
            </div>
          </div>
        </PageSection>

        {/* Reporting */}
        <PageSection
          align="center"
          eyebrow="Speak Up"
          title="Reporting problems"
          description="If something's wrong, don't ignore it. Tell us."
        >
          <div className="mx-auto max-w-2xl">
            <div className="glass-card relative isolate overflow-hidden p-5 sm:p-6 md:p-8 shadow-xl">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-[var(--brand-pink)]/10 border border-[var(--brand-pink)]/20">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-pink)] text-white">
                    <Mail className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-sm text-muted-foreground">Email us at</p>
                    <a
                      href="mailto:hello@gobitsnbytes.org"
                      className="text-lg sm:text-xl font-bold text-[var(--brand-pink)] hover:underline"
                    >
                      hello@gobitsnbytes.org
                    </a>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground text-center">
                  Or message any team member privately. Share context or
                  screenshots if possible. Your report stays{" "}
                  <strong className="text-foreground dark:text-white">
                    100% confidential
                  </strong>
                  . We'll handle things calmly and fairly.
                </p>
              </div>
            </div>
          </div>
        </PageSection>

        {/* Final CTA */}
        <PageSection align="center">
          <div className="glass-card relative isolate overflow-hidden p-6 sm:p-8 md:p-12 text-center shadow-xl bg-gradient-to-br from-[var(--brand-pink)]/20 to-[var(--brand-purple)]/20">
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground dark:text-white leading-relaxed max-w-2xl mx-auto">
              "Bits&Bytes exists to be a positive, creative, exciting space.
              <br className="hidden sm:block" />
              <span className="text-[var(--brand-pink)]">
                {" "}
                Help us keep it that way.
              </span>
              "
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button
                asChild
                className="rounded-full bg-[var(--brand-pink)] px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold text-white shadow-[var(--glow-strong)] w-full sm:w-auto"
              >
                <Link href="/join">
                  Join the Community
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/40 bg-white/10 px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base hover:bg-white/20 w-full sm:w-auto"
              >
                <Link href="/contact">Contact the Team</Link>
              </Button>
            </div>
          </div>
        </PageSection>
      </main>
    </>
  );
}
