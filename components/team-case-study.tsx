"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { CometCard } from "@/components/ui/comet-card";
import { cn } from "@/lib/utils";
import { Github, Globe, Linkedin, User, type LucideIcon } from "lucide-react";

export interface CoreTeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  expertise?: string[];
  linkedin?: string;
  socials?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  accentColor?: string;
  imagePosition?: string;
  mobileImagePosition?: string;
  imageScale?: number;
  mobileImageScale?: number;
  isFounder?: boolean;
  isFeatured?: boolean;
}

export interface Volunteer {
  id: number;
  name: string;
  image: string;
  linkedin?: string;
  section: "Creatives" | "Tech" | "Outreach";
}

interface TeamCaseStudyProps {
  coreTeam: CoreTeamMember[];
  volunteers: Volunteer[];
}

const brandColors = ["#3E1E68", "#E45A92", "#5D2F77"];

function TeamCard({
  member,
  accentColor,
}: {
  member: CoreTeamMember;
  accentColor: string;
}) {
  const cardAccent = member.accentColor || accentColor;

  const imageStyle = {
    "--team-image-position": member.imagePosition ?? "center top",
    "--team-image-position-mobile":
      member.mobileImagePosition ?? "center 24%",
    "--team-image-scale": String(member.imageScale ?? 1),
    "--team-image-scale-mobile": String(member.mobileImageScale ?? 1),
  } as CSSProperties;

  const linkedinHref = member.socials?.linkedin ?? member.linkedin;

  const socialLinks = [
    linkedinHref && {
      href: linkedinHref,
      label: `${member.name}'s LinkedIn`,
      icon: Linkedin,
    },
    member.socials?.github && {
      href: member.socials.github,
      label: `${member.name}'s GitHub`,
      icon: Github,
    },
    member.socials?.website && {
      href: member.socials.website,
      label: `${member.name}'s website`,
      icon: Globe,
    },
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    icon: LucideIcon;
  }>;

  return (
    <CometCard className="w-full">
      <div
        className={cn(
          "relative flex cursor-pointer flex-col rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-transform transition-colors transition-opacity duration-700",
          // Use h-full so CSS grid can ensure equal, content-fitting heights across all cards
          "h-full",
          "md:backdrop-blur-lg",
          // Consistent neutral framing with subtle accent glow
          "border border-white/14 shadow-[0_20px_44px_rgba(2,6,23,0.45)]",
          // Founders get extra glow
          member.isFounder && "border-white/20",
          // Featured members (Aadrika) pop out even more
          member.isFeatured && "scale-[1.02] sm:scale-105 z-20 ring-1 ring-white/30",
        )}
        style={{
          background:
            "linear-gradient(180deg, rgba(15,23,42,0.86) 0%, rgba(10,15,30,0.94) 58%, rgba(7,10,22,0.98) 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl opacity-70"
          style={{
            background: `radial-gradient(120% 80% at 50% -10%, ${cardAccent}44 0%, ${cardAccent}10 45%, transparent 72%)`,
          }}
        />
        {/* Image section - larger for better portraits */}
        <div className="relative z-10 mx-1 sm:mx-2 h-[280px] sm:h-[280px] md:h-[320px] lg:h-[340px] flex-shrink-0">
          <div className="relative h-full w-full rounded-xl sm:rounded-2xl overflow-hidden">
            {/* Ambient glow background */}
            <div className="absolute inset-0 -z-10 scale-110 opacity-40 blur-2xl sm:blur-3xl">
              <Image
                src={member.image}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={60}
                className="object-cover [object-position:var(--team-image-position-mobile)] [transform:scale(var(--team-image-scale-mobile))] sm:[object-position:var(--team-image-position)] sm:[transform:scale(var(--team-image-scale))]"
                style={imageStyle}
              />
            </div>
            {/* Main image - keep it full-bleed on mobile with tuned focal points per portrait */}
            <div className="relative h-full w-full overflow-hidden rounded-xl sm:rounded-2xl border border-white/12 bg-black/20">
              <Image
                src={member.image}
                alt={member.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={90}
                className="object-cover [object-position:var(--team-image-position-mobile)] [transform:scale(var(--team-image-scale-mobile))] sm:[object-position:var(--team-image-position)] sm:[transform:scale(var(--team-image-scale))]"
                style={imageStyle}
              />
            </div>
          </div>
        </div>

        {/* Text content section - cleaner without tags */}
        <div className="relative z-10 flex-1 mt-2 sm:mt-3">
          <div className="absolute inset-0 -mx-3 -mb-3 sm:-mx-4 sm:-mb-4 rounded-b-xl sm:rounded-b-2xl bg-slate-950/72 backdrop-blur-md border-t border-white/10" />

          <div className="relative flex h-full flex-col p-3 sm:p-4 text-white z-10">
            {/* Header with role, name, and LinkedIn */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <span className="text-[0.6rem] sm:text-[0.7rem] font-black uppercase tracking-[0.1em] mb-1 block leading-normal"
                  style={{ color: cardAccent }}>
                  {member.role}
                </span>
                <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold tracking-tight leading-tight">
                  {member.name}
                </h3>
              </div>
              {socialLinks.length > 0 && (
                <div className="flex shrink-0 items-center gap-1.5">
                  {socialLinks.map(({ href, label, icon: Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-transform transition-colors transition-opacity hover:scale-110 hover:bg-white/20"
                      aria-label={label}
                      style={{ boxShadow: `0 0 0 1px ${cardAccent}33 inset` }}
                    >
                      <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Bio - cleaner and more readable */}
            <p className="text-xs sm:text-sm leading-relaxed text-white/84 font-medium">
              {member.bio}
            </p>
          </div>
        </div>
      </div>
    </CometCard>
  );
}

function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const [imageError, setImageError] = useState(false);
  const isPlaceholder = volunteer.image.includes("placeholder");

  return (
    <div className="group relative flex flex-col items-center w-24 sm:w-32">
      <div className="relative mb-2 sm:mb-3">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--brand-blue)] via-[var(--brand-red)] to-[var(--brand-blue-dark)] opacity-50 blur-lg group-hover:opacity-80 transition-opacity duration-300" />

        {/* Avatar container */}
        <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full border-2 border-white/20 bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-blue-dark)] group-hover:border-[var(--brand-red)]/50 transition-transform transition-colors transition-opacity duration-300 group-hover:scale-105">
          {isPlaceholder || imageError ? (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--brand-blue)]/80 to-[var(--brand-blue-dark)]/80">
              <User className="h-8 w-8 sm:h-10 sm:w-10 text-white/60" />
            </div>
          ) : (
            <Image
              src={volunteer.image}
              alt={volunteer.name}
              fill
              sizes="(max-width: 768px) 64px, (max-width: 1024px) 80px, 96px"
              quality={85}
              className="object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 text-center w-full">
        <h4 className="font-semibold text-sm sm:text-base text-white truncate w-full px-1">
          {volunteer.name}
        </h4>
        <span className="text-[0.6rem] sm:text-xs font-medium uppercase tracking-wider text-[var(--brand-red)]/80">
          Contributor
        </span>
        {/* Fixed height container for LinkedIn to keep grids aligned */}
        <div className="mt-1 h-7 flex items-center justify-center">
          {volunteer.linkedin ? (
            <a
              href={volunteer.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/10 transition-transform transition-colors transition-opacity hover:bg-white/20 hover:scale-110"
              aria-label={`${volunteer.name}'s LinkedIn`}
            >
              <Linkedin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function TeamCaseStudy({ coreTeam, volunteers }: TeamCaseStudyProps) {
  const sectionOrder: Volunteer["section"][] = ["Creatives", "Tech", "Outreach"];
  const sectionLabels: Record<Volunteer["section"], string> = {
    Creatives: "Creative Contributor",
    Tech: "Tech Contributor",
    Outreach: "Outreach Contributor",
  };

  return (
    <div className="flex flex-col gap-8 sm:gap-16">
      {/* Core Team - CSS Grid with explicit 2 rows for equal heights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        {coreTeam.map((member, index) => {
          const accentColor = brandColors[index % brandColors.length];

          return (
            <div key={member.id} className="h-full">
              <TeamCard member={member} accentColor={accentColor} />
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative bg-background px-4 sm:px-6">
          <span className="text-xs sm:text-sm font-medium uppercase tracking-widest text-[var(--brand-red)]/70">
            Contributors
          </span>
        </div>
      </div>

      {/* Volunteers Section - Grouped by function */}
      <div className="flex flex-col gap-8 sm:gap-10">
        {sectionOrder.map((section) => {
          const sectionVolunteers = volunteers.filter(
            (volunteer) => volunteer.section === section,
          );

          if (sectionVolunteers.length === 0) return null;

          return (
            <section key={section} className="space-y-4 sm:space-y-5">
              <h3 className="text-center text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-[var(--brand-red)]/90">
                {sectionLabels[section]}
              </h3>
              <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-10 md:gap-14 lg:gap-16">
                {sectionVolunteers.map((volunteer) => (
                  <VolunteerCard key={volunteer.id} volunteer={volunteer} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

