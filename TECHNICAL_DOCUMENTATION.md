# Bits & Bytes Kolkata Technical Documentation

## 1. Project Overview

**Purpose:** Official website and platform for Bits & Bytes Kolkata, a teen-led code club based in Kolkata, India. Serves as a community hub and event platform.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Supabase (PostgreSQL), Vercel.

**Core Architecture:** Server-side rendered Next.js application with static site generation for audience pages and client-side React components for interactivity.

**Key Features:** Team member profiles, event listings, contact/sponsor lead capture.

**Scale:** 1500+ active members, served via Vercel with production source maps disabled.

---

## 2. Directory Structure

```
.
├── app/                              # Next.js App Router
│   ├── layout.tsx                   # Root layout (fonts, metadata, theme)
│   ├── page.tsx                     # Home page (hero + stats)
│   ├── manifest.ts                  # PWA manifest config
│   ├── globals.css                  # Tailwind + global styles
│   ├── api/
│   │   ├── join/route.ts           # Submit join requests → Supabase
│   │   ├── contact/                # Contact form submissions
│   │   └── discord/                # Discord OAuth integration
│   ├── about/, contact/, events/, etc/  # Content pages + layouts
│   └── demo/                        # Feature-specific pages
├── components/
│   ├── ui/                         # Shadcn/radix-ui components (40+ files)
│   ├── navigation.tsx              # Top nav + mobile menu
│   ├── footer.tsx                  # Site footer
│   ├── hero.tsx                    # Landing hero section
│   ├── page-background.tsx         # Animated WebGL background
│   ├── team-globe.tsx              # Three.js globe visualization
│   └── theme-provider.tsx          # next-themes wrapper
├── lib/
│   ├── supabase.ts                 # Supabase client init
│   ├── team-data.ts                # Team members + role matching logic
│   ├── theme.ts                    # Theme utilities (dark mode)
│   └── utils.ts                    # cn() classname merger
├── public/
│   ├── images/                     # Optimized AVIF/WebP
│   ├── partners/                   # Sponsor logos
│   ├── team/                       # Team member photos
│   ├── llms.txt                    # AI model registry
│   ├── sitemap.xml                 # SEO sitemap
│   └── globe.json                  # Three.js globe data
├── comic/                          # Comic/sticker generation
│   ├── compile_pdf.py              # PDF spreads from PNG panels
│   ├── nybble_gen.py               # Comic strip generator
│   └── panels/, panels_v2/         # Generated comic frames
├── scripts/
│   └── embed-site.ts               # Batch embed site content for RAG
├── types/
│   └── svg.d.ts                    # SVG module declarations
├── package.json                    # Dependencies + pnpm config
├── tsconfig.json                   # TypeScript config (strict mode)
├── next.config.mjs                 # Build-time git info injection
├── postcss.config.mjs              # Tailwind + PostCSS setup
├── components.json                 # Shadcn CLI config
├── vercel.json                     # Vercel deployment config
└── .env.example                    # Environment template
```

---

## 3. Setup & Installation

### Prerequisites
- Node.js 20+ (recommended pnpm 9+)
- Supabase project with tables: `join_requests`, `contacts`, `sponsor_leads`
- Vercel account (deployment)

### Environment Variables
```bash
# .env.local (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
HACKCLUB_PROXY_API_KEY=your-hackclub-key
GOOGLE_SITE_VERIFICATION=your-verification-code
```

### Installation
```bash
# Install dependencies
pnpm install

# Run dev server (port 3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Production build (used by Vercel)
pnpm run build
```

### Database Setup (Supabase)
Required tables:

| Table | Columns | Purpose |
|-------|---------|---------|
| `join_requests` | `id`, `name`, `email`, `school`, `experience`, `interests`, `message`, `created_at` | Store member signup requests |
| `contacts` | `id`, `name`, `email`, `subject`, `message`, `source`, `created_at` | Store contact form submissions |
| `sponsor_leads` | `id`, `company_name`, `contact_name`, `email`, `sponsor_type`, `budget_range`, `goals`, `source`, `created_at` | Capture sponsorship inquiries |

---

## 4. Core Modules & Components

### 4.1 Team Data & Role Matching (`lib/team-data.ts`)

**Team Members:** core roles including Shoryavardhaan Gupta (Lead), Yash Singh (Founder), Aadrika Maurya (Creative), Akshat Kushwaha (Technical Lead), Devaansh Pathak (Backend), Maryam Fatima (Social Media), Sristhi Singh (Operations).

**Functions:**

| Function | Purpose | Output |
|----------|---------|--------|
| `findExperts(query)` | Search team by skill/topic | Matching members + their superpowers |
| `recommendRoles(skills, interests)` | Match user to club roles | Ranked department suggestions |

---

### 4.2 UI Component Library (`components/ui/`)

**45+ optimized Shadcn/Radix components** including:
- Forms: Input, Textarea, Select, Checkbox, Radio, OTP
- Layout: Card, Dialog, Tabs, Accordion, Dropdown
- Display: Table, Progress, Badge, Avatar
- Animations: GlassContainer, EvervaultCard, FlickeringFooter
- 3D: Globe, ThreeShaper (Three.js)
- Data viz: Carousel, Gallery, Dock

**Styling:** CSS Variables (Tailwind 4 + PostCSS), dark mode via `next-themes`.

---

## 5. Data Flow

```
User Form Submission (Join/Contact)
    ↓
[Supabase: insert into tables]
    ↓
Success/Error Response to Client
```

---

## 6. API Reference

### 6.1 `POST /api/join`

**Request:**
```json
{
  "name": "Priya Kumar",
  "email": "priya@example.com",
  "school": "Delhi Public School",
  "experience": "1-2 years",
  "interests": ["AI", "Web Dev"],
  "message": "I want to join!"
}
```

**Response:**
```json
{ "success": true }
```

**Status Codes:**
- `200`: Inserted into `join_requests`
- `400`: Missing name/email/message
- `502`: Supabase error
- `500`: Exception

---

### 6.2 `POST /api/join`

**Request:**
```json
{
  "name": "Priya Kumar",
  "email": "priya@example.com",
  "school": "Delhi Public School",
  "experience": "1-2 years",
  "interests": ["AI", "Web Dev"],
  "message": "I want to join!"
}
```

**Response:**
```json
{ "success": true }
```

**Status Codes:**
- `200`: Inserted into `join_requests`
- `400`: Missing name/email/message
- `502`: Supabase error
- `500`: Exception

---

### 6.3 Supabase Tables Schema

#### `join_requests`
```sql
id uuid primary key
name text not null
email text not null
school text
experience text
interests text
message text not null
created_at timestamp default now()
```

#### `contacts`
```sql
id uuid primary key
name text not null
email text not null
subject text
message text not null
source text (default: 'assistant' or 'form')
created_at timestamp default now()
```

#### `sponsor_leads`
```sql
id uuid primary key
company_name text not null
contact_name text not null
email text not null
sponsor_type text ('title', 'gold', 'silver', 'inkind')
budget_range text
goals text not null
source text (default: 'assistant')
created_at timestamp default now()
```

---

## 7. Configuration & Environment

### Build-Time Git Info Injection (`next.config.mjs`)

Automatically captures at build time:
- `NEXT_PUBLIC_GIT_COMMIT_HASH`
- `NEXT_PUBLIC_GIT_COMMIT_SHORT`
- `NEXT_PUBLIC_GIT_BRANCH`
- `NEXT_PUBLIC_GIT_COMMIT_MESSAGE`
- `NEXT_PUBLIC_GIT_COMMIT_DATE`
- `NEXT_PUBLIC_BUILD_TIME`

**Usage:** Available in browser via `process.env.NEXT_PUBLIC_*`.

### Security Headers (`next.config.mjs`)

| Header | Value |
|--------|-------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` (2 years) |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `Content-Security-Policy` | Complex; allows: HCaptcha, Tally, Discord, Vercel Analytics, Supabase |

### Image Optimization (`next.config.mjs`)

- Formats: AVIF, WebP (fallback: original)
- Remote patterns: All HTTPS domains allowed
- Vercel native optimization enabled

### TypeScript Config (`tsconfig.json`)

- **Target:** ES6
- **Mode:** Strict (strict: true, noEmit: true)
- **Module Resolution:** Bundler
- **Path Aliases:** `@/*` → root, `@public/*` → public/

### Tailwind Config (`postcss.config.mjs`)

**CSS Framework:** Tailwind CSS 4 with `@tailwindcss/postcss` plugin.

**Theme Colors (Figma System):**
- Primary: `#3E1E68` (purple)
- Secondary: Pink, Blue (accent)
- Dark mode theme: Black background + white text

---

## 8. Known Edge Cases & Gotchas

### 8.1 Vercel Serverless Instance Limitations

**Issue:** Functions may timeout if processing large payloads.

**Workaround:** Keep form submissions lightweight.

### 8.2 Supabase Anonymous Key Exposure

**Issue:** NEXT_PUBLIC_SUPABASE_ANON_KEY is publicly visible in browser.

**Mitigation:** 
- Supabase RLS (Row-Level Security) policies restrict writes to specific tables
- Verify RLS policies are correctly set before production

### 8.9 Team Member Photos

**Path Convention:** Team photos stored in `/public/team/{name-slug}.jpg`. If missing, component uses Shadcn Avatar fallback.

### 8.10 Timezone Handling

**Context Injection:** Assistant receives current time in IST (Asia/Kolkata). Useful for event eligibility checks.

**Locale:** Hardcoded to "en-IN" in assistant system context for Indian event references.

---

## 9. Deployment & CI/CD

### Vercel Deployment

```bash
# Automatic on git push to main
git push origin main
```

**Build Command:** `pnpm run build`
**Install Command:** `pnpm install`
**Dev Command:** `pnpm run dev` (local only)
**Start Command:** `pnpm start` (production)

**Environment:** Set in Vercel dashboard under Settings → Environment Variables.

**Git Integration:** main branch → production; other branches → preview.

### Health Checks

- **Homepage:** `GET /` (200 OK, renders HTML)
- **Supabase Connectivity:** Check NEXT_PUBLIC_SUPABASE_URL availability

### Monitoring

- Vercel Analytics: `@vercel/speed-insights` + `@vercel/analytics` integrated
- Error logs: Check Vercel function logs for form submission errors
- Lead capture: Query Supabase `join_requests` and `contacts` tables for analytics

---

## 10. Scripts & Utilities

Utility scripts for site maintenance and data management.

---

## 11. Component Examples

### Team Member Display

```typescript
import { TEAM_MEMBERS } from "@/lib/team-data"

TEAM_MEMBERS.map(member => (
  <TeamCard
    name={member.name}
    role={member.role}
    superpowers={member.superpowers}
    department={member.department}
  />
))
```

---

## 12. Performance Optimizations

| Technique | Implementation |
|-----------|-----------------|
| **Code Splitting** | Next.js dynamic imports for heavy components (WebGLShader, Testimonial) |
| **Image Format** | AVIF/WebP via Vercel Image Optimization API |
| **CSS-in-JS** | Tailwind purged at build time (no runtime overhead) |
| **Font Loading** | `display: swap` for Poppins, Space Grotesk, JetBrains Mono |
| **React Server Components** | App Router uses RSC by default (components.json: rsc: true) |
| **Production Source Maps** | Disabled (productionBrowserSourceMaps: false) |
| **Compression** | Gzip via Next.js compress: true |

**Vercel Speed Insights Target:**
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1

---

## 13. Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Supabase connection fails | Invalid URL/anon key | Verify NEXT_PUBLIC_SUPABASE_* in .env |
| Git info shows "unknown" | Git not available at build | Ensure .git directory exists during build |
| Dark mode not persisting | next-themes not initialized | Check ThemeProvider wraps app in layout.tsx |
| Form won't submit | RLS policy denies insert | Verify Supabase RLS allows anon writes to specific tables |

---

## 14. Version Info

| Tool | Version |
|------|---------|
| Node | 20+ (recommended) |
| pnpm | 9+ |
| Next.js | 16.1.1 |
| React | 19.2.0 |
| TypeScript | 5 |
| Tailwind CSS | 4.1.9 |
| Supabase JS | 2.99.3 |

**Last Updated:** March 18, 2026

---

## 15. Key Dependencies Graph

```
Next.js 16
├── React 19 + React DOM
├── Tailwind CSS 4
├── Radix UI (Button, Card, Dialog, etc.)
├── Framer Motion (animations)
├── GSAP (timeline animations)
├── Three.js + Three-Globe (3D)
├── Zod (form validation)
├── React Hook Form (forms)
├── Supabase JS (DB client)
├── HCaptcha (bot protection)
├── Recharts (charts)
└── Vercel Speed Insights (monitoring)
```

---

## 16. Future Roadmap Notes

- [ ] Global form submission rate limiter (Redis integration)
- [ ] Discord bot commands via `/api/discord` webhook
- [ ] Analytics dashboard (Supabase dashboards)
- [ ] Email notifications for leads (Resend.dev)



