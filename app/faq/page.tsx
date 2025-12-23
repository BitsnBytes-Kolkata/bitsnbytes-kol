"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronDown, ArrowRight } from "lucide-react";

import { PageSection } from "@/components/page-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  // Joining
  {
    category: "Joining",
    question: "Who can join Bits&Bytes?",
    answer:
      "Bits&Bytes is open to all students aged 13-19 who are passionate about technology, coding, design, or building things. You don't need any prior experience—just enthusiasm to learn and grow with our community.",
  },
  {
    category: "Joining",
    question: "Is there a membership fee?",
    answer:
      "No! Bits&Bytes is completely free to join. We believe tech education should be accessible to everyone. All our workshops, resources, and community access are provided at no cost.",
  },
  {
    category: "Joining",
    question: "I'm not from Lucknow. Can I still join?",
    answer:
      "Absolutely! While Bits&Bytes was founded in Lucknow, we now have members from across India. Most of our activities happen online through Discord, so you can participate from anywhere. We occasionally host in-person events in various cities too.",
  },
  {
    category: "Joining",
    question: "How long does the application take to be reviewed?",
    answer:
      "We review applications weekly, and you'll typically hear back within 7 days. If accepted, you'll receive a Discord invite and onboarding materials to get you started with the community.",
  },

  // Experience & Skills
  {
    category: "Experience",
    question: "Do I need to know how to code to join?",
    answer:
      "Not at all! We welcome complete beginners. Our mentorship program pairs newcomers with experienced members who guide them through their first projects. We have resources for all skill levels, from 'Hello World' to advanced AI projects.",
  },
  {
    category: "Experience",
    question: "I'm interested in design, not coding. Is there a place for me?",
    answer:
      "Yes! We value designers as much as developers. Our projects need UI/UX designers, graphic designers, and creative thinkers. Many of our most successful projects are the result of designer-developer collaboration.",
  },
  {
    category: "Experience",
    question: "What programming languages/technologies do you work with?",
    answer:
      "We work with a wide range of technologies including JavaScript/TypeScript, Python, React, Next.js, Node.js, and more. We also explore AI/ML, mobile development with React Native, and emerging technologies. Members are encouraged to learn whatever interests them most.",
  },

  // Time Commitment
  {
    category: "Time",
    question: "How much time do I need to commit?",
    answer:
      "We recommend 2-4 hours per week, but it's flexible based on your schedule. Some weeks you might attend a workshop, others you might work on a project asynchronously. During hackathons, expect more intensive time blocks (usually 24-48 hours over a weekend).",
  },
  {
    category: "Time",
    question: "Can I participate if I have a busy school schedule?",
    answer:
      "Definitely! Many of our members balance school, extracurriculars, and Bits&Bytes. Our Discord is always active, so you can catch up on discussions and participate at times that work for you. We understand academics come first.",
  },
  {
    category: "Time",
    question: "What's the minimum participation required?",
    answer:
      "We ask members to participate in at least one project or event per quarter and stay somewhat active in Discord discussions. This ensures everyone contributes to and benefits from the community.",
  },

  // Projects & Activities
  {
    category: "Projects",
    question: "What kind of projects do members work on?",
    answer:
      "Our members build web apps, mobile apps, AI tools, games, design systems, and more. Projects range from personal portfolio pieces to team collaborations that serve real users. We've shipped event platforms, study tools, community bots, and creative experiments.",
  },
  {
    category: "Projects",
    question: "Can I bring my own project idea?",
    answer:
      "Absolutely! We encourage members to pitch their ideas during our 'Pitch Nights.' If your idea gets traction, you can form a team and start building with mentorship support. Some of our best projects started as member ideas.",
  },
  {
    category: "Projects",
    question: "How do hackathons work?",
    answer:
      "Our hackathons are typically 24-48 hour events where teams build projects from scratch around a theme. You can participate solo or in teams of 2-4. We provide mentors, workshops during the event, and prizes for top projects. Scrapyard Lucknow is our flagship annual hackathon.",
  },

  // Community
  {
    category: "Community",
    question: "What's the community like?",
    answer:
      "We're a supportive, inclusive community of 120+ teen builders. Our Discord is active with code help, project discussions, memes, and general chat. We prioritize a safe, welcoming environment where everyone can learn without judgment.",
  },
  {
    category: "Community",
    question: "Is there mentorship available?",
    answer:
      "Yes! We pair newer members with experienced mentors who provide one-on-one guidance. We also have office hours for technical questions and regular code reviews. Our alumni network includes members now at top tech companies and universities.",
  },
  {
    category: "Community",
    question: "How do I get help when I'm stuck on something?",
    answer:
      "Post in our Discord help channels! Our community is quick to respond, and there's usually someone who's faced a similar problem. We also have scheduled office hours with mentors for more in-depth help.",
  },

  // Parents
  {
    category: "Parents",
    question: "Is Bits&Bytes safe for my child?",
    answer:
      "Absolutely. We have a strict Code of Conduct, active moderation, and verification processes. All community interactions happen in moderated Discord channels. We take safety seriously and have zero tolerance for bullying or inappropriate behavior.",
  },
  {
    category: "Parents",
    question: "How can parents stay informed about activities?",
    answer:
      "Parents can request to receive our monthly newsletter summarizing upcoming events and community highlights. For major events like hackathons, we send detailed information including schedules, supervision details, and contact information.",
  },
];

const categories = [...new Set(faqs.map((faq) => faq.category))];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFaqs = activeCategory
    ? faqs.filter((faq) => faq.category === activeCategory)
    : faqs;

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden text-white">
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-12 md:py-20">
          <div className="relative border-2 border-[var(--brand-pink)]/30 rounded-[32px] md:rounded-[40px] p-1.5 md:p-2 backdrop-blur-sm bg-black/10">
            <div className="relative border-2 border-[var(--brand-pink)]/50 rounded-[28px] md:rounded-[36px] py-8 px-4 sm:px-10 overflow-hidden bg-black/40 backdrop-blur-xl">
              <div className="absolute inset-0 bg-[var(--brand-purple)]/20" />
              <div className="relative z-10 space-y-4 text-center">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/70">
                  FAQ
                </p>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight font-extrabold text-white">
                  Frequently asked questions
                </h1>
                <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
                  Everything you need to know about joining and participating in
                  Bits&Bytes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 bg-transparent">
        {/* Category Filter */}
        <PageSection>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                activeCategory === null
                  ? "bg-[var(--brand-pink)] text-white shadow-[var(--glow-soft)]"
                  : "border border-white/20 bg-white/5 text-muted-foreground hover:border-white/40 hover:text-foreground",
              )}
            >
              All Questions
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                  activeCategory === category
                    ? "bg-[var(--brand-pink)] text-white shadow-[var(--glow-soft)]"
                    : "border border-white/20 bg-white/5 text-muted-foreground hover:border-white/40 hover:text-foreground",
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="mx-auto max-w-3xl space-y-4">
            {filteredFaqs.map((faq, index) => {
              const globalIndex = faqs.indexOf(faq);
              const isOpen = openItems.has(globalIndex);

              return (
                <div
                  key={globalIndex}
                  className="glass-card relative isolate overflow-hidden shadow-xl transition-all duration-300 hover:shadow-[var(--glow-strong)]"
                >
                  <button
                    onClick={() => toggleItem(globalIndex)}
                    className="flex w-full items-start justify-between gap-4 p-6 text-left"
                  >
                    <div className="flex-1">
                      <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">
                        {faq.category}
                      </span>
                      <h3 className="font-display text-lg font-bold text-foreground dark:text-white">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-[var(--brand-pink)] transition-transform duration-300",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </PageSection>

        {/* Still have questions CTA */}
        <PageSection align="center">
          <div className="glass-card p-8 md:p-12 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground dark:text-white">
              Still have questions?
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Can't find what you're looking for? Reach out to us directly and
              we'll get back to you within a couple of days.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                className="rounded-full bg-[var(--brand-pink)] px-8 py-6 text-base font-semibold text-white shadow-[var(--glow-strong)]"
              >
                <Link href="/contact">
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/40 bg-white/10 px-8 py-6 text-base hover:bg-white/20"
              >
                <Link href="/join">Apply to Join</Link>
              </Button>
            </div>
          </div>
        </PageSection>
      </main>
    </>
  );
}
