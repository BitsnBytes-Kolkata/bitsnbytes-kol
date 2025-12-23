"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { CometCard } from "@/components/ui/comet-card";
import { cn } from "@/lib/utils";
import { Linkedin } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  expertise?: string[];
  linkedin?: string;
  accentColor?: string;
  isFounder?: boolean;
}

interface TeamCaseStudyProps {
  members: TeamMember[];
}

const brandColors = [
  "bg-[var(--brand-purple)]",
  "bg-[var(--brand-pink)]",
  "bg-[var(--brand-plum)]",
];

function TeamCard({
  member,
  bgColor,
}: {
  member: TeamMember;
  bgColor: string;
}) {
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const extractDominantColor = (img: HTMLImageElement) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check if image has valid dimensions
    if (img.naturalWidth === 0 || img.naturalHeight === 0) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    try {
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let r = 0,
        g = 0,
        b = 0,
        count = 0;

      // Sample every 10th pixel for performance
      for (let i = 0; i < data.length; i += 40) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      setDominantColor(`rgb(${r}, ${g}, ${b})`);
    } catch (error) {
      console.error("Error extracting dominant color:", error);
    }
  };

  const cardBg =
    member.accentColor ||
    (bgColor.includes("purple")
      ? "var(--brand-purple)"
      : bgColor.includes("pink")
        ? "var(--brand-pink)"
        : "var(--brand-plum)");

  const getBackgroundStyle = () => {
    if (dominantColor) {
      return `radial-gradient(circle at 50% 30%, ${dominantColor}33, ${dominantColor}11 50%, transparent 80%), ${cardBg}`;
    }
    // Apply subtle gradient even without dominant color for consistency
    if (member.accentColor) {
      return `radial-gradient(circle at 50% 30%, ${member.accentColor}dd, ${member.accentColor}aa 50%, ${member.accentColor} 80%)`;
    }
    return undefined;
  };

  return (
    <CometCard className="w-full">
      <div
        className={cn(
          "relative flex h-full cursor-pointer flex-col items-stretch rounded-xl sm:rounded-2xl p-3 sm:p-4 backdrop-blur-xl transition-all duration-700",
          member.isFounder
            ? "border-2 border-[var(--brand-pink)]/50 shadow-[0_0_30px_rgba(228,90,146,0.3)]"
            : "border border-white/10",
          !member.accentColor && bgColor,
        )}
        style={{
          background: getBackgroundStyle(),
        }}
      >
        <div className="mx-1 sm:mx-2">
          <div className="relative mt-1 sm:mt-2 aspect-[3/4] w-full rounded-xl sm:rounded-2xl">
            {/* Ambient glow background - YouTube style */}
            <div className="absolute inset-0 -z-10 scale-105 opacity-50 blur-2xl sm:blur-3xl">
              <Image
                src={member.image}
                alt=""
                fill
                className="object-cover rounded-xl sm:rounded-2xl"
              />
            </div>
            {/* Main image */}
            <div className="relative h-full w-full overflow-hidden rounded-xl sm:rounded-2xl">
              <Image
                ref={imgRef}
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                onLoad={(e) => extractDominantColor(e.currentTarget)}
              />
            </div>
          </div>
        </div>
        <div className="mt-3 sm:mt-4 flex min-h-[160px] sm:min-h-[180px] md:min-h-[220px] flex-col gap-1.5 sm:gap-2 p-3 sm:p-4 text-white">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <span className="text-[0.55rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.25em] sm:tracking-[0.35em] opacity-70 line-clamp-1">
                {member.role}
              </span>
              <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold">
                {member.name}
              </h3>
            </div>
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white/20 hover:scale-110"
                aria-label={`${member.name}'s LinkedIn`}
              >
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
              </a>
            )}
          </div>
          <p className="mb-auto text-xs sm:text-sm leading-relaxed opacity-80 line-clamp-3 sm:line-clamp-4">
            {member.bio}
          </p>
          {member.expertise && member.expertise.length > 0 ? (
            <div className="mt-auto pt-2 sm:pt-4 flex flex-wrap gap-1.5 sm:gap-2">
              {member.expertise.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white/20 px-2 sm:px-3 py-0.5 sm:py-1 text-[0.55rem] sm:text-[0.65rem] font-semibold uppercase tracking-wide"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <div className="pt-2 sm:pt-4 h-6 sm:h-8" />
          )}
        </div>
      </div>
    </CometCard>
  );
}

export default function TeamCaseStudy({ members }: TeamCaseStudyProps) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
      {members.map((member, index) => {
        const bgColor = brandColors[index % brandColors.length];

        return (
          <div key={member.id} className="flex">
            <TeamCard member={member} bgColor={bgColor} />
          </div>
        );
      })}
    </div>
  );
}
