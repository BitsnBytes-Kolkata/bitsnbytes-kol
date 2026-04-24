export interface TeamMember {
  name: string
  role: string
  superpowers: string[]
  achievements: string[]
  talkToMeWhen: string[]
  department: "Leadership" | "Engineering" | "Design" | "Community" | "Content" | "Operations"
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Shoryavardhaan Gupta",
    role: "Kolkata Fork Lead",
    superpowers: ["Community Building", "Event Operations", "Teen Leadership", "Builder Culture"],
    achievements: [
      "Founding the Kolkata fork of BitsnBytes — city of joy, city of builders",
      "Driving the Kolkata fork's identity with an electric blue, bold AMPed energy",
      "Building a high-agency teen builder community in Kolkata"
    ],
    talkToMeWhen: [
      "You want to join or collaborate with the Kolkata chapter",
      "You have ideas for hackathons or build nights in Kolkata",
      "You want to talk about growing the teen tech culture in West Bengal"
    ],
    department: "Leadership"
  },
  {
    name: "Yash Singh",
    role: "Co-Founder & Organisation Lead",
    superpowers: ["Full-Stack Engineering", "Mathematics (IOQM)", "AI / LLM Intelligence", "Game Dev (GoDOT)", "Three.js & Creative Coding"],
    achievements: [
      "Founder of the Kolkata fork of BitsnBytes (gobitsnbytes.org), leading 100+ active members in student-led tech culture",
      "Created Codiva: A 5-star rated VS Code extension that gamifies coding for thousands of users",
      "National Qualifier for the Indian Mathematics Olympiad (IOQM)",
      "Built Alem (AI notes app <25MB) and MailAF (AI cold outreach automation)",
      "Educator at STEMist Kolkata, teaching Computer Science to underprivileged students with talent",
      "Lead Organizer for Scrapyard Kolkata and Galactic Local Mentor at NASA Space Apps Challenge"
    ],
    talkToMeWhen: [
      "You want to discuss community building or scaling high-agency movements",
      "You need help with VS Code extensions, Three.js, or AI-powered outreach workflows",
      "You want to talk about deep mathematical problem solving or competitive programming",
      "You're interested in hardware experiments like LiDAR-based fitness apps or Flipper Zero clones"
    ],
    department: "Leadership"
  },
  {
    name: "Aadrika Maurya",
    role: "Co-Founder & Chief Creative Strategist",
    superpowers: ["Neuroscience Research", "Creative Strategy", "Brand Development", "Regional Management", "Design Direction"],
    achievements: [
      "RSI India Alumni who conducted neuroscience research on EEG signals and attention pattern modeling",
      "Regional Manager for CodeDay Kanpur, empowering local student developers",
      "Leading creative strategy and cross-city collaboration initiatives for teen builders",
      "Designed the complete visual identity and campaign strategy for India-wide movements"
    ],
    talkToMeWhen: [
      "You need input on complex design systems or branding strategy",
      "You want to discuss neuroscience, cognitive modeling, or research-driven design",
      "You are looking for insights on regional event management and scaling communities"
    ],
    department: "Design"
  },
  {
    name: "Akshat Kushwaha",
    role: "Co-Founder & Technical Lead",
    superpowers: ["Production-Grade Engineering", "LLMOps & RAG Architecture", "Agentic Workflows", "Next.js 16 / React 19", "System Design"],
    achievements: [
      "AI-native systems engineer; lead architect for the entire Kolkata fork of BitsnBytes production-grade tech infrastructure",
      "Designed high-performance efficient retrieval systems for complex AI workflows",
      "Developed reliable long-running autonomous execution stacks for complex tool orchestration",
      "Chapter Lead @ STEMist Education, founding builder-focused STEM culture at Boys High School, Prayagraj",
      "Project Lead for the Kolkata fork of BitsnBytes Platform, turning community operations into durable infrastructure"
    ],
    talkToMeWhen: [
      "You care about the edge cases where AI systems usually break and want to build for real constraints",
      "You're building complex agentic workflows, LLMOps pipelines, or local-first AI software",
      "You want to discuss how technical execution and systems thinking overlap to ship meaningful product",
      "You want to close the gap between ambition and the first build for young developers"
    ],
    department: "Engineering"
  },
  {
    name: "Devaansh Pathak",
    role: "Founding Member & Backend Lead",
    superpowers: ["Backend Architecture", "Database Systems", "Partnership Economics"],
    achievements: [
      "Co-Architected the high-performance backend systems for the Kolkata fork of BitsnBytes platform",
      "Executed partnerships that delivered genuine ROI for sponsors across multiple cities"
    ],
    talkToMeWhen: [
      "You are designing scalable database schemas or backend APIs",
      "You want to talk about how we treat participants like high-agency builders",
      "You're interested in the economics of sustainable tech communities"
    ],
    department: "Engineering"
  },
  {
    name: "Maryam Fatima",
    role: "Social Media & Promotions Head",
    superpowers: ["Visual Communication", "Brand Consistency", "Impact Storytelling", "Social Strategy"],
    achievements: [
      "Generating 10k+ impressions for club events through strategic storytelling",
      "Maintains the premium Kolkata fork of BitsnBytes brand identity across all social channels",
      "Orchestrated promotions for GitHub Copilot Dev Days and multiple CodeDay hackathons"
    ],
    talkToMeWhen: [
      "You need high-impact visuals for a campaign or real-world product launch",
      "You want to ensure visual consistency for a student-led project",
      "You have questions regarding premium social media presence"
    ],
    department: "Design"
  },
  {
    name: "Sristhi Singh",
    role: "Operations & Communications Head",
    superpowers: ["Process Optimization", "Resource Coordination", "Logistics Management", "Internal Communication"],
    achievements: [
      "Engineered the internal communication workflows for our 100+ active members",
      "Coordinated logistics for NASA Space Apps and multiple city-wide transitions",
      "Optimized the project lifecycle from workshop to tangible product launch"
    ],
    talkToMeWhen: [
      "You need help navigating internal operations or resource allocation",
      "You want to optimize the transition from idea to shipped product",
      "You need assistance coordinating cross-department city-wide hackathons"
    ],
    department: "Operations"
  }
]

export function findExperts(query: string): TeamMember[] {
  const lowerQuery = query.toLowerCase()
  if (!lowerQuery) return TEAM_MEMBERS

  return TEAM_MEMBERS.filter(
    (member) =>
      member.name.toLowerCase().includes(lowerQuery) ||
      member.role.toLowerCase().includes(lowerQuery) ||
      member.superpowers.some((s) => s.toLowerCase().includes(lowerQuery)) ||
      member.achievements.some((a) => a.toLowerCase().includes(lowerQuery)) ||
      member.talkToMeWhen.some((t) => t.toLowerCase().includes(lowerQuery))
  )
}

export function recommendRoles(skills: string[], interests: string[]): string {
  const userKeywords = [...skills, ...interests].map((k) => k.toLowerCase())
  const recommendations: string[] = []

  if (userKeywords.some((k) => k.includes("design") || k.includes("ui") || k.includes("art") || k.includes("drawing") || k.includes("brand"))) {
    recommendations.push("Design & Content Team (Talk to Aadrika or Maryam)")
  }
  if (
    userKeywords.some(
      (k) => k.includes("code") || k.includes("dev") || k.includes("web") || k.includes("python") || k.includes("js") || k.includes("ai") || k.includes("cloud")
    )
  ) {
    recommendations.push("Engineering Team (Talk to Akshat Kushwaha or Devansh)")
  }
  if (
    userKeywords.some(
      (k) => k.includes("people") || k.includes("event") || k.includes("manage") || k.includes("lead") || k.includes("operations")
    )
  ) {
    recommendations.push("Community, Operations & Leadership (Talk to Yash or Srishti)")
  }

  if (recommendations.length === 0) {
    return "General Member - join our Discord to explore different tracks!"
  }

  return recommendations.join(", ")
}



