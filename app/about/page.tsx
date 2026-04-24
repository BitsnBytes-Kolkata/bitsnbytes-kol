"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { PageSection } from "@/components/page-section";
import { LoadingInline } from "@/components/loading-wrapper";
import {
  GlowingCard,
  GlowingCardTitle,
  GlowingCardDescription,
} from "@/components/ui/glowing-card";
import type {
  CoreTeamMember,
  Volunteer,
} from "@/components/team-case-study";

// Lazy load heavy components
const TeamCaseStudy = dynamic(() => import("@/components/team-case-study"), {
  loading: () => <LoadingInline />,
  ssr: true,
});

const aboutContent = {
  title: "About the Kolkata fork of BitsnBytes",
  description:
    "We are a teen-led code club dedicated to empowering high-agency individuals to ship production-grade technology through real-world product launches.",
  sections: [
    {
      title: "The Origin Story",
      description:
        "Originally hosting Daydream Kolkata under Hack Club, we faced a last-minute venue withdrawal. We decided to fork BitsnBytes to bypass rigid formats and deliver actual value to builders.",
    },
    {
      title: "High Agency Only",
      description:
        "We move away from 'beginner-friendly' formats that treat participants like they need hand-holding. We build for exceptionally talented individuals who want to ship real products.",
    },
    {
      title: "Ship Real Products",
      description:
        "Workshops and hack nights must convert into tangible outcomes. We focus on premium hackathons, dev squads, and real-world launches that are fully student-led.",
    },
    {
      title: "Production Grade",
      description:
        "We prioritize performance and stability. Our technical infrastructure is built with professional standards, removing barriers for the next generation of builders.",
    },
  ],
};

// Core Team - Top tier
const coreTeam: CoreTeamMember[] = [
  {
    id: 1,
    name: "Yash Singh",
    role: "Co-Founder & Organisation Lead",
    image: "/team/yash.jpeg",
    mobileImagePosition: "center 18%",
    bio: "High school student who builds things that matter—from VS Code extensions with thousands of users to hackathons with 400+ participants. IOQM National Qualifier and Educator at STEMist Kolkata, teaching underrepresented talent.",
    expertise: [
      "Mathematics (IOQM)",
      "Full-Stack Dev",
      "Three.js / Three.js",
      "AI / ML Scaling",
      "GoDOT Game Dev",
    ],
    socials: {
      linkedin: "https://www.linkedin.com/in/yash-vardhan-singh-a41540270/",
      github: "https://github.com/yashclouded",
      website: "https://yashvibe.codes/",
    },
    accentColor: "#0066B3", // Kolkata Blue
    isFounder: true,
  },
  {
    id: 2,
    name: "Aadrika Maurya",
    role: "Co-Founder & Chief Creative Strategist",
    image: "/team/aadrika.png",
    mobileImagePosition: "center 20%",
    isFeatured: true,
    bio: "RSI India Alumni who conducted neuroscience research on EEG signals and attention pattern modeling. Regional Manager for CodeDay Kanpur and a creative strategist for student-led initiatives.",
    expertise: [
      "Neuroscience (EEG)",
      "Creative Strategy",
      "Regional Management",
      "Brand Development",
    ],
    socials: {
      linkedin: "https://www.linkedin.com/in/aadrika-maurya/",
      github: "https://github.com/Aadrika08",
      website: "https://aadrikasportfolio.framer.website/",
    },
    accentColor: "#C5312E", // Kolkata Red
    isFounder: true,
  },
  {
    id: 3,
    name: "Akshat Kushwaha",
    role: "Co-Founder & Technical Lead",
    image: "/team/akshat.jpg",
    mobileImagePosition: "center 16%",
    mobileImageScale: 1.03,
    bio: "AI-native systems engineer who asks what happens when software fails—building production workflows and retrieval architectures that survive real constraints. Lead at STEMist Prayagraj, defining high-performance engineering culture.",
    expertise: [
      "LLMOps / RAG",
      "Agentic Frameworks",
      "Next.js 16 / React 19",
      "FastAPI / Python",
      "System Design",
    ],
    socials: {
      linkedin: "https://www.linkedin.com/in/akshat-singh-kushwaha/",
      github: "https://github.com/a3ro-dev",
      website: "https://a3ro.dev",
    },
    accentColor: "#FFD400", // Kolkata Yellow
    isFounder: true,
  },
  {
    id: 4,
    name: "Devaansh Pathak",
    role: "Founding Member & Backend Lead",
    image: "/team/devansh.jpeg",
    mobileImagePosition: "center 18%",
    bio: "Manages high-performance backend development and partnership economics.",
    expertise: [
      "Backend Architecture",
      "Database Systems",
      "Partnership Building",
      "Community Outreach",
    ],
    linkedin: "https://www.linkedin.com/in/devaanshpa/",
  },
  {
    id: 5,
    name: "Maryam Fatima",
    role: "Social Media & Promotions Head",
    image: "/team/maryam.jpeg",
    mobileImagePosition: "center 22%",
    bio: "Leading social strategy and impact storytelling. Generated 10k+ impressions for club events. Spearheads visual campaigns for major independent hackathons.",
    expertise: [
      "Impact Storytelling",
      "Visual Design",
      "Campaign Planning",
      "Brand Identity",
    ],
    linkedin: "https://www.linkedin.com/in/maryam-fatima-9719aa377/",
  },
  {
    id: 6,
    name: "Sristhi Singh",
    role: "Operations & Communications Head",
    image: "/team/srishti.jpeg",
    mobileImagePosition: "center 16%",
    bio: "Optimizing internal communication for 100+ members. Ensures smooth collaboration across design/dev squads and city-wide event transitions.",
    expertise: [
      "Process Optimization",
      "Resource Logistics",
      "Team Communications",
      "Project Coordination",
    ],
    linkedin: "https://www.linkedin.com/in/srishti-singh-ab6a1b391",
  },
];

// Volunteers - smaller cards section
const volunteers: Volunteer[] = [
  {
    id: 11,
    name: "Jaagruti",
    image: "/team/jaagruti.jpeg",
    section: "Creatives",
  },
  {
    id: 18,
    name: "Kavan",
    image: "/team/kavan.jpg",
    section: "Creatives",
  },
  {
    id: 16,
    name: "Vareesha",
    image: "/team/vareesha.jpg",
    linkedin: "https://www.linkedin.com/in/vareesha-mehdi-a669203ab/",
    section: "Creatives",
  },
  {
    id: 13,
    name: "Aishwary",
    image: "/team/aishwary.jpeg",
    linkedin: "https://www.linkedin.com/in/ashlovesnoodle",
    section: "Creatives",
  },
  {
    id: 5,
    name: "Saksham",
    image: "/team/saksham.jpeg",
    linkedin: "https://www.linkedin.com/in/sakshm/",
    section: "Tech",
  },
  {
    id: 7,
    name: "Areeb",
    image: "/team/areeb.png",
    linkedin: "https://www.linkedin.com/in/areeb-ahmad-066547315/",
    section: "Tech",
  },
  {
    id: 15,
    name: "Prakhar",
    image: "/team/prakhar.png",
    linkedin: "https://www.linkedin.com/in/prakharrdev/",
    section: "Tech",
  },
  {
    id: 14,
    name: "Adithya",
    image: "/team/adhitya.png", // Corrected image path and extension
    linkedin: "https://www.linkedin.com/in/adithya---k/",
    section: "Outreach",
  },
  {
    id: 8,
    name: "Atharva",
    image: "/team/atharva.jpg",
    linkedin: "https://www.linkedin.com/in/atharvaupadhyay/",
    section: "Outreach",
  },
  {
    id: 17,
    name: "Aanjaneya",
    image: "/team/aanjaneya.jpg",
    linkedin: "https://www.linkedin.com/in/aanjaneya-tripathi-0700a4346/",
    section: "Outreach",
  },
];

export default function About() {
  return (
    <>
      <main className="relative z-10 bg-transparent">
        <PageSection
          align="center"
          eyebrow="About"
          title={aboutContent.title}
          description={aboutContent.description}
          className="pt-24 md:pt-32"
        >
          <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-2 lg:gap-4">
            {aboutContent.sections.map((section, index) => {
              // Define grid areas for each card
              const gridAreas = [
                "md:[grid-area:1/1/2/7]",
                "md:[grid-area:1/7/2/13]",
                "md:[grid-area:2/1/3/7]",
                "md:[grid-area:2/7/3/13]",
              ];
              return (
                <li key={section.title} className={gridAreas[index]}>
                  <GlowingCard animationDelay={index * 0.05}>
                    <div className="space-y-3">
                      <GlowingCardTitle>{section.title}</GlowingCardTitle>
                      <GlowingCardDescription>
                        {section.description}
                      </GlowingCardDescription>
                    </div>
                  </GlowingCard>
                </li>
              );
            })}
          </ul>
        </PageSection>

        <PageSection
          align="center"
          eyebrow="Team"
          title="Meet the Agents"
          description="A tight crew of designers, engineers, club leads, and storytellers powering the Kolkata fork and teen-led tech movements across the city of joy."
        >
            <TeamCaseStudy coreTeam={coreTeam} volunteers={volunteers} />
          </Suspense>
          <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-muted-foreground px-4 sm:px-0">
            *Roles stay flexible as our team and club grow.
          </p>
        </PageSection>
      </main>
    </>
  );
}

