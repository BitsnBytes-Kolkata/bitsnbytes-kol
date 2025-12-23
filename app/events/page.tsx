"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { PageSection } from "@/components/page-section";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  Clock,
  ExternalLink,
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

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  type: "hackathon" | "workshop" | "meetup" | "talk";
  status: "upcoming" | "past";
  attendees?: number;
  image?: string;
  link?: string;
  highlights?: string[];
}

const events: Event[] = [
  {
    id: "scrapyard-lucknow-2025",
    title: "Scrapyard Lucknow 2025",
    description:
      "Our flagship hackathon returns! 48 hours of building, learning, and shipping. Open to all high school students across India.",
    date: "March 2025",
    time: "48 Hours",
    location: "Lucknow, India",
    type: "hackathon",
    status: "upcoming",
    link: "#",
  },
  {
    id: "ai-workshop-feb",
    title: "Intro to AI/ML for Teens",
    description:
      "Learn the fundamentals of machine learning and build your first AI model. No prior experience required.",
    date: "February 15, 2025",
    time: "2:00 PM IST",
    location: "Online (Discord)",
    type: "workshop",
    status: "upcoming",
  },
  {
    id: "web-dev-bootcamp",
    title: "Web Dev Bootcamp",
    description:
      "A 4-week intensive program covering HTML, CSS, JavaScript, and React. Build and deploy your portfolio site.",
    date: "January 20 - February 17, 2025",
    time: "Weekends",
    location: "Online (Discord)",
    type: "workshop",
    status: "upcoming",
  },
  {
    id: "scrapyard-lucknow-2024",
    title: "Scrapyard Lucknow 2024",
    description:
      "Our debut hackathon united 40+ coders, designers, filmmakers, and builders to tackle civic, education, and sustainability problems.",
    date: "December 2024",
    time: "24 Hours",
    location: "Lucknow, India",
    type: "hackathon",
    status: "past",
    attendees: 40,
    image: "/images/hero-img.jpeg",
    highlights: [
      "40+ participants from 10 schools",
      "12 projects submitted",
      "Industry mentors from top startups",
      "₹50,000 in prizes distributed",
    ],
  },
  {
    id: "git-github-workshop",
    title: "Git & GitHub Masterclass",
    description:
      "Master version control and collaboration workflows. Learn branching, pull requests, and open-source contribution.",
    date: "November 2024",
    time: "3 Hours",
    location: "Online (Discord)",
    type: "workshop",
    status: "past",
    attendees: 25,
  },
  {
    id: "design-thinking-workshop",
    title: "Design Thinking for Developers",
    description:
      "Learn how to approach problems like a designer. User research, prototyping, and iterating on feedback.",
    date: "October 2024",
    time: "2 Hours",
    location: "Online (Discord)",
    type: "workshop",
    status: "past",
    attendees: 18,
  },
  {
    id: "first-meetup",
    title: "Bits&Bytes Launch Meetup",
    description:
      "The official launch of Bits&Bytes India. We gathered to share our vision and build our founding community.",
    date: "September 2024",
    location: "Lucknow, India",
    type: "meetup",
    status: "past",
    attendees: 30,
    image: "/images/b653f79c-fcc9-49bb-a92a-4fc454659b3a-1-105-c.jpeg",
    highlights: [
      "30 founding members joined",
      "Set up Discord community",
      "Planned first hackathon",
      "Formed initial leadership team",
    ],
  },
];

const typeColors: Record<Event["type"], string> = {
  hackathon: "bg-[var(--brand-pink)]",
  workshop: "bg-[var(--brand-purple)]",
  meetup: "bg-emerald-500",
  talk: "bg-amber-500",
};

const typeLabels: Record<Event["type"], string> = {
  hackathon: "Hackathon",
  workshop: "Workshop",
  meetup: "Meetup",
  talk: "Tech Talk",
};

export default function Events() {
  const upcomingEvents = events.filter((e) => e.status === "upcoming");
  const pastEvents = events.filter((e) => e.status === "past");

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden text-white">
        <WebGLShader />
        <div className="relative z-10 w-full mx-auto max-w-5xl px-4 sm:px-6 py-12 md:py-24">
          <div className="relative border-2 border-[var(--brand-pink)]/30 rounded-[32px] md:rounded-[40px] p-1.5 md:p-2 backdrop-blur-sm bg-black/10">
            <div className="relative border-2 border-[var(--brand-pink)]/50 rounded-[28px] md:rounded-[36px] py-8 px-4 sm:px-10 overflow-hidden bg-black/40 backdrop-blur-xl">
              <div className="absolute inset-0 bg-[var(--brand-purple)]/20" />
              <div className="relative z-10 space-y-4 text-center">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-white/70">
                  Events
                </p>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl leading-tight font-extrabold text-white">
                  Hackathons, workshops & more
                </h1>
                <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
                  From intensive hackathons to hands-on workshops, we create
                  experiences that help teens build real skills and ship real
                  projects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 bg-transparent">
        {/* Upcoming Events */}
        <PageSection
          align="center"
          eyebrow="Coming Up"
          title="Upcoming events"
          description="Mark your calendar for these upcoming opportunities to learn and build."
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event, index) => (
              <div
                key={event.id}
                className="glass-card relative isolate overflow-hidden p-6 text-left shadow-xl hover:shadow-[var(--glow-strong)] transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Event type badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${typeColors[event.type]}`}
                  >
                    {typeLabels[event.type]}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Upcoming
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-foreground dark:text-white">
                  {event.title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {event.description}
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-foreground/80 dark:text-white/80">
                    <Calendar className="h-4 w-4 text-[var(--brand-pink)]" />
                    <span>{event.date}</span>
                    {event.time && (
                      <>
                        <span className="text-muted-foreground">·</span>
                        <Clock className="h-4 w-4 text-[var(--brand-pink)]" />
                        <span>{event.time}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/80 dark:text-white/80">
                    <MapPin className="h-4 w-4 text-[var(--brand-pink)]" />
                    <span>{event.location}</span>
                  </div>
                </div>

                {event.link && (
                  <div className="mt-4">
                    <Button
                      asChild
                      size="sm"
                      className="w-full rounded-full bg-[var(--brand-pink)] text-white"
                    >
                      <Link href={event.link}>
                        Register Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {upcomingEvents.length === 0 && (
            <div className="glass-card p-8 text-center">
              <p className="text-muted-foreground">
                No upcoming events at the moment. Check back soon or follow us
                on social media for announcements!
              </p>
            </div>
          )}
        </PageSection>

        {/* Past Events */}
        <PageSection
          align="center"
          eyebrow="Archive"
          title="Past events"
          description="A look back at the events that shaped our community."
        >
          <div className="space-y-8">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="glass-card relative isolate overflow-hidden shadow-xl hover:shadow-[var(--glow-strong)] transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image */}
                  {event.image && (
                    <div className="relative w-full lg:w-1/3 h-48 lg:h-auto">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 lg:bg-gradient-to-l" />
                    </div>
                  )}

                  {/* Content */}
                  <div className={`flex-1 p-6 ${!event.image ? "lg:p-8" : ""}`}>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${typeColors[event.type]}`}
                      >
                        {typeLabels[event.type]}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {event.date}
                      </span>
                      {event.attendees && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {event.attendees} attendees
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-2xl font-bold text-foreground dark:text-white">
                      {event.title}
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {event.description}
                    </p>

                    {event.highlights && event.highlights.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-pink)] mb-2">
                          Highlights
                        </p>
                        <ul className="grid gap-2 sm:grid-cols-2">
                          {event.highlights.map((highlight, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-foreground/80 dark:text-white/80"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-pink)]" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PageSection>

        {/* CTA */}
        <PageSection align="center">
          <div className="glass-card p-8 md:p-12 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground dark:text-white">
              Want to host an event with us?
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              We partner with schools, companies, and organizations to bring
              tech education to more teens. Let's create something amazing
              together.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                className="rounded-full bg-[var(--brand-pink)] px-8 py-6 text-base font-semibold text-white shadow-[var(--glow-strong)]"
              >
                <Link href="/contact">
                  Partner with us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/40 bg-white/10 px-8 py-6 text-base hover:bg-white/20"
              >
                <Link href="/join">
                  Join the club
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </PageSection>
      </main>
    </>
  );
}
