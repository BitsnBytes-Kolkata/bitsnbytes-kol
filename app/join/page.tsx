"use client";

import dynamic from "next/dynamic";
import { PageSection } from "@/components/page-section";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  Rocket,
  Heart,
  Zap,
} from "lucide-react";

// Lazy load WebGL shader
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

import Script from "next/script";

const benefits = [
  {
    icon: Users,
    title: "Join a tight-knit crew",
    description:
      "Connect with 200+ ambitious teen builders across India who share your passion for tech.",
  },
  {
    icon: Rocket,
    title: "Ship real projects",
    description:
      "Work on portfolio-ready projects with mentorship at every stage—from idea to deployment.",
  },
  {
    icon: Zap,
    title: "Attend exclusive events",
    description:
      "Get priority access to hackathons, workshops, and networking events with industry pros.",
  },
  {
    icon: Heart,
    title: "Grow together",
    description:
      "Pair programming, code reviews, and study groups help everyone level up faster.",
  },
];

const expectations = [
  "Be a student (ages 13-19) passionate about tech",
  "Commit 2-4 hours per week for activities",
  "Join our Discord and stay active in discussions",
  "Participate in at least one project or event per quarter",
  "Support fellow members and maintain a positive attitude",
];

const faqs = [
  {
    question: "Do I need coding experience to join?",
    answer:
      "Not at all! We welcome beginners and pair them with experienced mentors. What matters most is your enthusiasm to learn and build.",
  },
  {
    question: "How much time do I need to commit?",
    answer:
      "We recommend 2-4 hours per week, but it's flexible. Some weeks you might attend a workshop, others you might work on a project async.",
  },
  {
    question: "Is there a membership fee?",
    answer:
      "Bits&Bytes is completely free to join. We believe tech education should be accessible to all students.",
  },
  {
    question: "I'm not from Lucknow. Can I still join?",
    answer:
      "Absolutely! While we started in Lucknow, we now have members across India. Most activities happen online via Discord.",
  },
];

export default function Join() {
  return (
    <>
      <Script src="https://tally.so/widgets/embed.js" strategy="lazyOnload" />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] sm:min-h-[50vh] flex items-center justify-center overflow-hidden text-white">
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12 md:py-24">
          <div className="relative border-2 border-[var(--brand-pink)]/30 rounded-2xl sm:rounded-[32px] md:rounded-[40px] p-1 sm:p-1.5 md:p-2 backdrop-blur-sm bg-black/10">
            <div className="relative border-2 border-[var(--brand-pink)]/50 rounded-xl sm:rounded-[28px] md:rounded-[36px] py-6 sm:py-8 px-4 sm:px-10 overflow-hidden bg-black/40 backdrop-blur-xl">
              <div className="absolute inset-0 bg-[var(--brand-purple)]/20" />
              <div className="relative z-10 space-y-4 text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-pink)]/60 bg-black/40 px-4 py-1.5 text-xs uppercase tracking-[0.35em] font-semibold text-white/90 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand-pink)] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand-pink)]" />
                  </span>
                  Applications Open
                </span>
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight font-extrabold text-white">
                  Join the crew
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto">
                  Tell us how you want to build with the Bits&Bytes club. We'll
                  connect you with squads, mentors, and live projects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 bg-transparent">
        {/* Main CTA Section */}
        <PageSection align="center">
          <div className="mx-auto w-full max-w-3xl space-y-6 sm:space-y-8">
            <div className="glass-card relative isolate overflow-hidden p-5 sm:p-8 md:p-12 text-center shadow-xl">
              <div className="space-y-4 sm:space-y-6">
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span>Takes less than 2 minutes</span>
                </div>

                <Button
                  data-tally-open="n02RGZ"
                  data-tally-layout="modal"
                  data-tally-width="700"
                  data-tally-align-left="1"
                  data-tally-hide-title="1"
                  data-tally-overlay="1"
                  className="group rounded-full bg-[var(--brand-pink)] px-8 sm:px-12 py-5 sm:py-7 text-base sm:text-lg font-semibold text-white shadow-[var(--glow-strong)] transition-all hover:scale-105 hover:shadow-[0_20px_80px_rgba(228,90,146,0.5)] w-full sm:w-auto"
                >
                  Apply to Join
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </Button>

                <p className="text-xs sm:text-sm text-muted-foreground">
                  We review applications weekly · You'll hear back within 7 days
                </p>
              </div>
            </div>
          </div>
        </PageSection>

        {/* Benefits Section */}
        <PageSection
          align="center"
          eyebrow="Why Join"
          title="What you'll get as a member"
          description="Being part of Bits&Bytes means more than just a Discord invite. Here's what awaits you."
        >
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="glass-card relative isolate overflow-hidden p-4 sm:p-6 text-left text-foreground shadow-xl hover:shadow-[var(--glow-strong)] dark:text-white transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-[var(--brand-pink)]/10 text-[var(--brand-pink)]">
                    <benefit.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-base sm:text-lg font-bold">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PageSection>

        {/* Expectations Section */}
        <PageSection
          align="center"
          eyebrow="Expectations"
          title="What we look for"
          description="We want to make sure Bits&Bytes is the right fit for you."
        >
          <div className="mx-auto max-w-2xl">
            <div className="glass-card relative isolate overflow-hidden p-4 sm:p-6 md:p-8 shadow-xl">
              <ul className="space-y-3 sm:space-y-4">
                {expectations.map((expectation, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-foreground dark:text-white"
                  >
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-[var(--brand-pink)] mt-0.5" />
                    <span>{expectation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PageSection>

        {/* FAQ Section */}
        <PageSection
          align="center"
          eyebrow="FAQ"
          title="Common questions"
          description="Everything you need to know before applying."
        >
          <div className="mx-auto max-w-3xl space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="glass-card relative isolate overflow-hidden p-4 sm:p-6 text-left shadow-xl hover:shadow-[var(--glow-strong)] transition-all duration-300"
              >
                <h3 className="font-display text-base sm:text-lg font-bold text-foreground dark:text-white">
                  {faq.question}
                </h3>
                <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </PageSection>

        {/* Final CTA */}
        <PageSection align="center">
          <div className="mx-auto max-w-2xl text-center space-y-4 sm:space-y-6">
            <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground dark:text-white">
              Ready to start building?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground px-4 sm:px-0">
              Join 200+ teen builders who are shipping real projects and growing
              together.
            </p>
            <Button
              data-tally-open="n02RGZ"
              data-tally-layout="modal"
              data-tally-width="700"
              data-tally-align-left="1"
              data-tally-hide-title="1"
              data-tally-overlay="1"
              className="group rounded-full bg-[var(--brand-pink)] px-8 sm:px-10 py-5 sm:py-6 text-sm sm:text-base font-semibold text-white shadow-[var(--glow-strong)] transition-all hover:scale-105 w-full sm:w-auto"
            >
              Apply Now
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Questions? Reach us at{" "}
              <a
                href="mailto:hello@gobitsnbytes.org"
                className="text-[var(--brand-pink)] font-medium underline-offset-2 hover:underline"
              >
                hello@gobitsnbytes.org
              </a>
            </p>
          </div>
        </PageSection>
      </main>
    </>
  );
}
