import { NextRequest, NextResponse } from "next/server"
import OpenAI, { APIError } from "openai"
import { findExperts, recommendRoles } from "@/lib/team-data"
import { searchSiteContent } from "@/lib/rag"
import { detectFrustration } from "@/lib/sentiment"
const openai = new OpenAI({
  apiKey: process.env.OSM_API_KEY,
  baseURL: "https://api.osmapi.com/v1",
})

const PRIMARY_MODEL = "qwen3.5-397b-a17b"
const FALLBACK_MODEL = "qwen3.5-397b-a17b"

const SSE_HEADERS = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
}


type ClientMessage = {
  role: "user" | "assistant"
  content: string
}

type AssistantAction = { type: "navigate"; path: string } | { type: "highlight"; textSnippet: string }

const SITE_CONTEXT = `
You are the official AI assistant for Bits&Bytes, a teen-led code club based in Lucknow.

**Your Goal:** Help visitors learn about the club, find the right team members to talk to, and get involved.

**Core Identity (Do not hallucinate these):**
- **Mission:** Innovation, collaboration, and real-world impact through technology.
- **Activities:** Hackathons (e.g., Scrapyard Lucknow), workshops, and student mentorship.
- **Contact:** hello@gobitsnbytes.org
- **Contact:** contact@indiainnovates.org
- **GitHub:** https://github.com/gobitsnbytes

**How to get answers:**
1. **For Team/Roles:** DO NOT guess. Always use the 'find_team_expert' or 'recommend_role' tools. The team structure is dynamic.
2. **For Content Search:** Use 'search_site_content' to query our knowledge base for anything related to events, rules, dates, content, about the club, contact information, etc.
3. **For Code of Conduct Questions:** Use 'search_site_content' with a query like 'code of conduct rules' to find behavior expectations or reporting info.
4. **For Navigation:** Use 'suggest_navigation' to guide them.
5. **For Pointing out Info:** When you find relevant information on the current page to answer a user's question, prominently use the 'highlight_text' tool to highlight that exact snippet of text on the website for the user.
6. **For Contact Form Submissions:** Use the 'submit_contact_form' tool. But NEVER call it until you have all required info. Guide the user conversationally:
   - First ask for their **name**
   - Then their **email**
   - Then their **message** (what they want to tell the team)
   - Optionally ask for a **subject** line
   - Once you have name, email, and message, confirm with the user (e.g. "I'll send this to the team: [summary]. Should I go ahead?") before calling the tool.
   - After successful submission, confirm it was sent and tell them the team will follow up.

**Guardrails & Safety:**
- Refuse to answer questions that are irrelevant to Bits&Bytes, technology, coding, education, or the local community.
- If a user asks about general knowledge (e.g. "Who won the World Cup?", "How to bake a cake?"), politely redirect them:
  "I can only help with questions about Bits&Bytes, our events, or technology topics."
- Do not engage in roleplay scenarios unrelated to the club.
- Do not generate code for malicious purposes.
- If asked for personal information about members beyond what is available via tools (superpowers/roles), refuse.

Rules:
- Always stay truthful to Bits&Bytes.
- Be extremely concise, conversational, and direct. Avoid long, multi-paragraph summaries or filler text. Get straight to the point.
- Do not use 'suggest_navigation' and 'highlight_text' in the exact same response. If you navigate the user to a new page, wait for them to see it; do not highlight right away since the page will be loading.
- If you can't find the answer in the tools or page content, admit it:
  "I’m not sure about that based on the information publicly available on this site."

**UI Components you can use:**
- **Buttons / CTAs:** Use markdown links with the title "button" or "cta". Example: \`[Join Now](/join "cta")\`
- **Follow-up actions:** Use markdown links with the title "follow-up". This creates a clickable bubble for the user to quickly ask a follow up question. Example: \`[How do I register?](# "follow-up")\`
- **Section Hyperlinks:** Use markdown links starting with '#' to jump to sections on the page. Example: \`[Go to Rules](#rules)\`
- **Charts:** To show stats, output a markdown code block with the language \`chart\` containing a valid JSON array of objects with 'name' and 'value' properties. Example:
\`\`\`chart
[{"name": "2024", "value": 100}, {"name": "2025", "value": 300}]
\`\`\`
- **Discord Widget:** When someone asks for the India Innovates Discord server, community link, or any Discord/WhatsApp group for India Innovates, ALWAYS show the interactive Discord widget by outputting a code block with language \`discord-widget\` containing only the server ID. Example:
\`\`\`discord-widget
1480617556292272260
\`\`\`
Always prefer this over sharing a plain text link or WhatsApp link.

**GitHub Copilot Dev Days | Lucknow:**
- **What is it:** A community developer event exploring AI-assisted coding with GitHub Copilot. Hosted on Luma by Bits&Bytes. Community Partners: Coding Connoisseurs, Aryan Singh, and Notion Lucknow.
- **Date & Time:** Sunday, April 19, 2026, 10:00 AM – 2:00 PM IST.
- **Venue:** Cubispace, 2nd Floor, JSV Hyundai Building CP-53, near Engineering College Chauraha, Jankipuram, Lucknow, Uttar Pradesh 226021, India. Map link: https://www.google.com/maps/search/?api=1&query=26.9109169%2C80.9464606&query_place_id=ChIJSydGKnNXmTkRj475BfUXmeA
- **Registration:** Approval required. Register via Luma: https://luma.com/xtxua1jl
- **What participants will learn:** How GitHub Copilot works inside modern dev environments; practical approaches to integrating AI-assisted coding; techniques for writing prompts that produce better code suggestions; responsible and efficient use of AI in software development.
- **Code of Conduct:** All participants must follow the official GitHub event code of conduct: microsoft.com/en-us/events/code-of-conduct
- **Contact:** hello@gobitsnbytes.org
- **Important:** Bits&Bytes is the **Host** of this event.

**India Innovates 2026 Event Details:**
- **Selection Status (Evaluations Complete):** Evaluations are now officially **completed**. The current selection list is final and **no further reconsiderations or additions** will be made.
- **Result Statuses:**
  - **Shortlisted:** You are in Round 1. Check your inbox for next steps.
  - **No record found:** You are not selected for this round. Selection is now closed and final.
- **Participation & Attendance:**
  - **Capacity:** Shortlisted teams have confirmed spots at the finale.
  - **Attendance Policy:** At least 1 team member **must** be physically present at the venue to present. Teams can bring more members if desired. If no members show up, the team cannot present. **Important:** Team member replacement is **not allowed**, as the minimum attendance requirement has already been lowered to just one person.
  - **Certificates:** All members of teams that cleared Round 1 will receive e-certificates, including those who cannot attend the finale (email coming soon).
- **Finale Logistics (28 March 2026):**
  - **Timings:** Reporting at 9:30 AM; Closing at 7:00 PM.
  - **Venue:** Bharat Mandapam, New Delhi.
  - **What to bring:** Laptop, charger, and project needs. **Important:** Internet may be unreliable due to high density; participants should arrange their own hotspot or data.
  - **Food & Stay:** Food, travel, and accommodation are **not** provided or covered. Participants must make their own arrangements.
- **Presentations:**
  - **Format:** Direct presentations to judges, including officials from ministries and government bodies. No stalls or booths.
  - **Evaluation:** Only **functional prototypes** will be evaluated. Ensure your project is working properly before presenting.
- **Domains:** Urban Solutions, Digital Democracy, and Open Innovation (Cybersecurity is merged into Open Innovation).
- **Prizes:** Prize pool of INR 10 Lakh+. Top innovations may receive Paid Govt Apprenticeships or Full-Time Opportunities.
- **Communication:** For all queries, prefer Discord (Server ID 1480617556292272260).
`

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "submit_contact_form",
      description:
        "Submit the Bits&Bytes contact form on behalf of the visitor once you have their name, email, a subject, and a clear message.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "The visitor's full name" },
          email: { type: "string", description: "The visitor's email address" },
          subject: {
            type: "string",
            description: "Short subject line summarising why they are reaching out",
          },
          message: {
            type: "string",
            description: "The full message to send through the contact form",
          },
        },
        required: ["name", "email", "message"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "suggest_navigation",
      description:
        "Suggest navigating the visitor to a specific page of the Bits&Bytes site. Use when they ask to go somewhere (e.g. join, contact, impact).",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "The path to navigate to",
            enum: ["/", "/about", "/impact", "/join", "/contact", "/coc", "/events", "home", "about", "impact", "join", "contact", "coc", "events"],
          },
        },
        required: ["path"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_site_content",
      description:
        "Search the Bits&Bytes website knowledge base. USE THIS OFTEN when asked about dates, events, rules, the club, or specific facts. It searches semantically across all pages.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query, e.g., 'who are the founders', 'when is Copilot Dev Days', 'what are the rules'",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "highlight_text",
      description:
        "Highlight a specific piece of text on the current page to draw the user's attention to it. Use this whenever quoting or pointing out specific information that is currently visible on the page.",
      parameters: {
        type: "object",
        properties: {
          textSnippet: {
            type: "string",
            description: "The exact or partial text snippet to highlight on the page.",
          },
        },
        required: ["textSnippet"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "find_team_expert",
      description:
        "Find team members. Pass a specific topic (e.g. 'React') or pass an empty string '' to list the Core Team.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The topic/skill to search for, or empty string for all members.",
          },
        },
        required: ["query"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "recommend_role",
      description:
        "Recommend a role or team within Bits&Bytes based on the user's skills and interests.",
      parameters: {
        type: "object",
        properties: {
          skills: {
            type: "array",
            items: { type: "string" },
            description: "List of skills the user has (e.g. ['Python', 'drawing']).",
          },
          interests: {
            type: "array",
            items: { type: "string" },
            description: "List of interests the user has (e.g. ['AI', 'community']).",
          },
        },
        required: ["skills", "interests"],
      },
    },
  },
]

function mapClientMessagesToOpenAI(messages: ClientMessage[]): OpenAI.Chat.ChatCompletionMessageParam[] {
  return messages.map((m) => ({
    role: m.role,
    content: m.content,
  }))
}

function sectionToPath(section: string): string {
  const normalized = normalizePath(section)
  return normalized
}

function normalizePath(value?: string): string {
  const input = (value ?? "/").toString().trim().toLowerCase()
  if (input === "/" || input === "home") return "/"
  if (input === "/about" || input === "about") return "/about"
  if (input === "/impact" || input === "impact") return "/impact"
  if (input === "/join" || input === "join") return "/join"
  if (input === "/contact" || input === "contact") return "/contact"
  if (input === "/coc" || input === "coc") return "/coc"
  if (input === "/events" || input === "events") return "/events"
  return "/"
}

async function handleSubmitContactTool(args: any) {
  const name = (args?.name ?? "").toString().trim()
  const email = (args?.email ?? "").toString().trim()
  const subject = (args?.subject ?? "").toString().trim()
  const message = (args?.message ?? "").toString().trim()

  if (!name || !email || !message) {
    return {
      success: false,
      message: "Name, email, and message are required to submit the contact form.",
    }
  }

  try {
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.from("contacts").insert({
      name,
      email,
      subject: subject || "Contact via Bits&Bytes assistant",
      message,
      source: "assistant",
    })

    if (error) {
      console.error("Supabase contact insert error (assistant):", error)
      return {
        success: false,
        message: "Failed to submit the contact form. Please try again.",
      }
    }

    return {
      success: true,
      message: `Contact form submitted successfully for ${name} (${email}). The team will get back soon!`,
    }
  } catch (err) {
    console.error("Supabase contact insert exception (assistant):", err)
    return {
      success: false,
      message: "Something went wrong while submitting the contact form.",
    }
  }
}

// get_site_section removed in favor of semantic RAG search

export async function POST(req: NextRequest) {
  // ─── Rate limiting (10 requests per minute per IP) ───
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "anonymous"

  const { rateLimit } = await import("@/lib/rate-limit")
  const rl = rateLimit(ip, { maxRequests: 10, windowMs: 60_000 })

  if (!rl.allowed) {
    return NextResponse.json(
      { error: "You're sending messages too quickly. Please wait a moment and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    )
  }

  if (!process.env.OSM_API_KEY) {
    return NextResponse.json(
      { error: "OSM_API_KEY is not configured on the server." },
      { status: 500 }
    )
  }

  try {
    const body = await req.json()
    const clientMessages = (body?.messages ?? []) as ClientMessage[]
    const clientPathname = (body?.pathname ?? "/").toString()
    const sessionId = (body?.sessionId ?? "").toString()

    if (!Array.isArray(clientMessages) || clientMessages.length === 0) {
      return NextResponse.json({ error: "Messages array is required." }, { status: 400 })
    }

    // Build page-aware system context
    const PAGE_LABELS: Record<string, string> = {
      "/": "Home",
      "/about": "About",
      "/impact": "Impact",
      "/join": "Join",
      "/contact": "Contact",
      "/coc": "Code of Conduct",
      "/events": "Events",
    }
    const currentPageLabel = PAGE_LABELS[clientPathname] ?? clientPathname
    const pageContext = `\n\n**Current Page:** The user is currently viewing the "${currentPageLabel}" page (${clientPathname}). Tailor your answers to be relevant to the content on this page when appropriate. If they ask "what's on this page" or similar, describe what this page contains.`

    const lastUserMsg = clientMessages.filter(m => m.role === "user").pop()
    const isFrustrated = lastUserMsg ? detectFrustration(lastUserMsg.content) : false
    const frustrationHint = isFrustrated 
      ? "\n\n**CRITICAL OP NOTE:** The user seems frustrated or confused based on their recent message. Be extra empathetic, concise, and helpful. If their issue is technical or blocked, proactively offer to connect them with the team or ask if they'd like to use the contact form."
      : ""

    const baseMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: SITE_CONTEXT + pageContext + frustrationHint,
      },
      ...mapClientMessagesToOpenAI(clientMessages),
    ]

    const runCompletion = async (model: string, messages: OpenAI.Chat.ChatCompletionMessageParam[]) => {
      return openai.chat.completions.create({
        model,
        messages,
        tools,
        tool_choice: "auto",
        max_tokens: 1024,
      })
    }

    let modelUsed = PRIMARY_MODEL
    let currentMessages = [...baseMessages]
    let actionToClient: AssistantAction | undefined

    for (let i = 0; i < 5; i++) {
      let completion
      try {
        completion = await runCompletion(PRIMARY_MODEL, currentMessages)
      } catch (err) {
        const apiError = err as APIError
        const code = (apiError as any)?.code ?? (apiError as any)?.error?.code
        const status = (apiError as any)?.status
        const shouldFallback =
          code === "model_not_found" ||
          code === "unsupported_parameter" ||
          code === "unsupported_value" ||
          status === 403

        if (shouldFallback) {
          modelUsed = FALLBACK_MODEL
          completion = await runCompletion(FALLBACK_MODEL, currentMessages)
        } else {
          throw err
        }
      }

      const choice = completion.choices[0]
      const message = choice?.message
      const finishReason = choice?.finish_reason

      // If the model's output was truncated (hit token limit), skip tool parsing
      // and ask the model to answer directly without tools
      if (finishReason === "length" && message?.tool_calls && message.tool_calls.length > 0) {
        console.warn("[Assistant] Tool call truncated (finish_reason=length). Retrying without tools.")
        // Push a system hint to avoid tools and answer directly
        currentMessages.push({
          role: "system" as const,
          content: "Your previous response was truncated. Please answer the user's question directly and concisely WITHOUT using any tools.",
        })
        continue
      }

      if (!message?.tool_calls || message.tool_calls.length === 0) {
        break // No more tool calls required
      }

      // osmAPI requires content to be a string (not null).
      // When the model makes tool calls, the SDK sets content to null.
      currentMessages.push({
        ...message,
        content: message.content ?? "",
      })

      for (const toolCall of message.tool_calls) {
        const toolName = toolCall.function.name
        let toolArgs: any = {}
        try {
          toolArgs = toolCall.function.arguments ? JSON.parse(toolCall.function.arguments) : {}
        } catch (parseErr) {
          console.error(`[Assistant] Failed to parse tool args for "${toolName}":`, toolCall.function.arguments)
          // Attempt basic recovery: try to extract JSON from partial output
          const rawArgs = toolCall.function.arguments ?? ""
          try {
            // Try to close any unclosed braces and parse
            const repaired = rawArgs.replace(/,\s*$/, "") + (rawArgs.includes("{") && !rawArgs.endsWith("}") ? "}" : "")
            toolArgs = JSON.parse(repaired)
            console.log(`[Assistant] Recovered partial tool args for "${toolName}"`)
          } catch {
            toolArgs = {}
            // Tell the model the tool call failed so it can recover
            currentMessages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify({ success: false, error: `Tool arguments were malformed and could not be parsed. Please try answering the user directly without this tool, or retry with simpler arguments.` }),
            } as OpenAI.Chat.ChatCompletionToolMessageParam)
            continue
          }
        }

        let toolResult: any = null

        if (toolName === "submit_contact_form") {
          toolResult = await handleSubmitContactTool(toolArgs)
        } else if (toolName === "suggest_navigation") {
          const path = normalizePath(toolArgs?.path)
          toolResult = { success: true, path }
          actionToClient = { type: "navigate" as const, path }
        } else if (toolName === "search_site_content") {
          const results = await searchSiteContent(toolArgs?.query ?? "")
          toolResult = { success: true, results }
        } else if (toolName === "find_team_expert") {
          const query = (toolArgs?.query ?? "").toString()
          const experts = findExperts(query)
          toolResult = { query, experts }
        } else if (toolName === "recommend_role") {
          const skills = Array.isArray(toolArgs?.skills) ? toolArgs.skills : []
          const interests = Array.isArray(toolArgs?.interests) ? toolArgs.interests : []
          const recommendation = recommendRoles(skills, interests)
          toolResult = { skills, interests, recommendation }
        } else if (toolName === "highlight_text") {
          const textSnippet = (toolArgs?.textSnippet ?? "").toString()
          toolResult = { success: true, textSnippet }
          actionToClient = { type: "highlight" as const, textSnippet }
        } else {
          toolResult = { success: false, message: `Unknown tool: ${toolName}` }
        }

        currentMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        } as OpenAI.Chat.ChatCompletionToolMessageParam)
      }
    }

    try {
      return await streamAssistantResponse(modelUsed, currentMessages, actionToClient, {
        sessionId,
        pathname: clientPathname,
        ip,
      })
    } catch (streamErr) {
      console.error("Assistant stream error after tool call:", streamErr)
      return NextResponse.json(
        { error: "Failed to stream the assistant response." },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Assistant API error:", error)
    return NextResponse.json(
      { error: "Failed to generate a response from the assistant." },
      { status: 500 }
    )
  }
}

async function streamAssistantResponse(
  model: string,
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  action?: AssistantAction,
  sessionMeta?: { sessionId: string; pathname: string; ip: string }
) {
  const completion = await openai.chat.completions.create({
    model,
    messages,
    max_tokens: 600,
    stream: true,
  })

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
      }

      send({ type: "meta", model })

      try {
        let fullAssistantContent = ""

        for await (const part of completion) {
          const delta = part.choices[0]?.delta

          if (delta?.content) {
            fullAssistantContent += delta.content
            send({ type: "token", content: delta.content })
          }
        }

        send({ type: "done", action: action ?? null })

        // Save session after stream done
        if (sessionMeta?.sessionId) {
          try {
            const { createClient } = await import("@supabase/supabase-js")
            const supabase = createClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )

            const finalMessages = [...messages, { role: "assistant", content: fullAssistantContent }]

            // Insert/update chat session asynchronously
            supabase.from("chat_sessions").upsert({
              session_id: sessionMeta.sessionId,
              messages: finalMessages,
              pathname: sessionMeta.pathname,
              model: model,
              ip_hash: sessionMeta.ip,
              updated_at: new Date().toISOString()
            }, { onConflict: "session_id" }).then(({ error }) => {
              if (error) console.error("Failed to save chat_session:", error)
            })
          } catch (err) {
            console.error("Supabase import or upsert failed in stream:", err)
          }
        }

      } catch (error) {
        console.error("Streaming error:", error)
        send({ type: "error", message: "Failed to stream assistant response." })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: SSE_HEADERS,
  })
}
