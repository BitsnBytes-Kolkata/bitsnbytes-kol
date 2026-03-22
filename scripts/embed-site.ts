import { createClient } from "@supabase/supabase-js"
import { pipeline } from "@xenova/transformers"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const siteContent = [
  {
    page: "/",
    section: "hero",
    content: "Bits&Bytes is India's boldest teen-led hackathons & tech movements. We build, ship, and iterate. Currently hosting India Innovates 2026."
  },
  {
    page: "/about",
    section: "team",
    content: "Our team: Founder Yash (Leadership, Events), Co-founder Aadrika (Creative Strategist, Design), Co-founder Akshat Kushwaha (Technical Lead, Full-stack), Devansh (Backend), Maryam (Social Media), and Srishti (Operations)."
  },
  {
    page: "/events",
    section: "copilot",
    content: "GitHub Copilot Dev Days | Lucknow. April 19, 2026, 10 AM - 2 PM IST at Cubispace, Lucknow. Registration via Luma."
  },
  {
    page: "/events",
    section: "india-innovates",
    content: "India Innovates Hackathon 2026. Finale on March 28, 2026 at Bharat Mandapam, New Delhi. Domains: Urban Solutions, Digital Democracy, Open Innovation. Prize pool of INR 10 Lakh+. Bits&Bytes is the Executive Partner."
  },
  {
    page: "/join",
    section: "info",
    content: "Join Bits&Bytes by attending our workshops, joining Discord, or signing up on the official join page."
  }
]

async function run() {
  console.log("Loading local embedding model...")
  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
    quantized: true,
  })

  console.log("Generating embeddings and pushing to Supabase...")

  for (const item of siteContent) {
    console.log(`Embedding ${item.page} - ${item.section}...`)
    try {
      const output = await extractor(item.content.replace(/\n/g, " "), { pooling: "mean", normalize: true })
      const embedding = Array.from(output.data)

      const { error } = await supabase.from("site_embeddings").insert({
        page: item.page,
        section: item.section,
        content: item.content,
        embedding,
      })

      if (error) console.error("Failed to insert:", error)
      else console.log("Success")
    } catch (e) {
      console.error("Local embedding failed:", e)
    }
  }
  console.log("Done embedding site.")
}

run()
