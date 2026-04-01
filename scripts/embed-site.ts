import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env" })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.HACKCLUB_PROXY_API_KEY,
  baseURL: "https://ai.hackclub.com/proxy/v1",
  defaultHeaders: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  }
})

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
  console.log("Fetching existing embeddings...")
  const { data: existingEmbeddings, error: fetchError } = await supabase.from("site_embeddings").select("id, page, section, content")
  
  if (fetchError) {
    console.error("Failed to fetch existing embeddings:", fetchError)
    return
  }

  const existingMap = new Map()
  for (const item of existingEmbeddings) {
    existingMap.set(`${item.page}-${item.section}`, item)
  }

  console.log("Checking for updates and new content...")
  const processedKeys = new Set()

  for (const item of siteContent) {
    const key = `${item.page}-${item.section}`
    processedKeys.add(key)

    const existing = existingMap.get(key)
    if (existing && existing.content === item.content) {
      console.log(`Skipping ${key} - content unchanged.`)
      continue
    }

    console.log(`Embedding ${key}...`)
    try {
      const rawResponse = await fetch("https://ai.hackclub.com/proxy/v1/embeddings", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + process.env.HACKCLUB_PROXY_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/text-embedding-3-small",
          input: item.content.replace(/\n/g, " "),
          dimensions: 384,
        })
      })
      const response = await rawResponse.json()
      
      const embedding = response.data[0].embedding

      if (existing) {
        const { error } = await supabase.from("site_embeddings").update({
          content: item.content,
          embedding,
        }).eq("id", existing.id)
        if (error) console.error(`Failed to update ${key}:`, error)
        else console.log(`Success updated ${key}`)
      } else {
        const { error } = await supabase.from("site_embeddings").insert({
          page: item.page,
          section: item.section,
          content: item.content,
          embedding,
        })
        if (error) console.error(`Failed to insert ${key}:`, error)
        else console.log(`Success inserted ${key}`)
      }
    } catch (e) {
      console.error(`Local embedding failed for ${key}:`, e)
    }
  }

  // Delete removed items
  for (const [key, item] of existingMap.entries()) {
    if (!processedKeys.has(key)) {
      console.log(`Removing deleted content: ${key}`)
      await supabase.from("site_embeddings").delete().eq("id", item.id)
    }
  }

  console.log("Done embedding site.")
}

run()
