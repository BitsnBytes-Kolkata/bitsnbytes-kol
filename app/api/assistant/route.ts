import { NextRequest, NextResponse } from "next/server"
import OpenAI, { APIError } from "openai"
import { findExperts, recommendRoles } from "@/lib/team-data"
import { searchSiteContent } from "@/lib/rag"
import { detectFrustration } from "@/lib/sentiment"
const openai = new OpenAI({
  apiKey: process.env.HACKCLUB_PROXY_API_KEY,
  baseURL: "https://ai.hackclub.com/proxy/v1",
  defaultHeaders: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  }
})

const PRIMARY_MODEL = "google/gemini-3-flash-preview"
const FALLBACK_MODEL = "google/gemini-2.5-flash"

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

**Your Goal:** Help visitors learn about the club, find the right team members to talk to, and get involved with India's boldest teen-led tech movement.

**Core Identity & Mission:**
- **Mission:** Empowering ambitious teenagers to ship meaningful tech through premium hackathons, design/dev squads, and real-world product launches.
- **Philosophy:** We prioritize high-agency, production-ready software over "beginner-friendly" hand-holding. We build for thinkers and builders.
- **Origin Story:** Originally hosting Daydream Lucknow under Hack Club, we went fully independent after a last-minute venue withdrawal. We realized rigid formats limit what can be shipped and decided to build our own space for high-talent individuals.
- **Track Record:** Scrapyard Lucknow (80 registrations, built in 13 days!), NASA Space Apps Challenge Lucknow (300+ participants), CodeDay Hackathons (Lucknow, Delhi, Dehradun), and multiple MUNs.
- **Contact:** hello@gobitsnbytes.org | gobitsnbytes@gmail.com
- **Phone:** +91 9696949718, +91 9696286800, +91 9208110869
- **GitHub:** https://github.com/gobitsnbytes

**Core Team & Achievements:**
- **Yash Singh (Founder & Local Lead):** High school builder who created Codiva (5-star VS Code extension) and founded Bits&Bytes. IOQM National Qualifier. Managed team building and execution for Scrapyard Lucknow.
- **Aadrika Maurya (Co-Founder & Creative Lead):** RSI India Alumni, neuroscience researcher (EEG signals and attention pattern modeling). CodeDay Kanpur Regional Manager. Building 'The Nerdy Network'.
- **Akshat Kushwaha (Co-Founder & Tech Lead):** AI-native systems engineer. Built the entire club infrastructure with production-ready retrieval systems and agentic workflows. Lead at STEMist Prayagraj.

**How to get answers:**
1. **For Team/Roles:** DO NOT guess. Always use the 'find_team_expert' or 'recommend_role' tools. The team structure is dynamic.
2. **For Content Search:** Use 'search_site_content' to query our knowledge base for anything related to events, rules, dates, content, about the club, contact information, etc.
3. **For Navigation:** Use 'suggest_navigation' to guide them.
4. **For Pointing out Info:** When you find relevant information on the current page to answer a user's question, prominently use the 'highlight_text' tool to highlight that exact snippet of text on the website for the user.
5. **For Contact Form Submissions:** Use the 'submit_contact_form' tool. But NEVER call it until you have all required info (Name, Email, Message).

**Guardrails & Safety:**
- Refuse to answer questions that are irrelevant to Bits&Bytes, technology, coding, education, or the local community.
- Do not engage in roleplay scenarios unrelated to the club.
- If asked for personal information about members beyond what is available via tools, refuse.

Rules:
- Always stay truthful to Bits&Bytes.
- Be extremely concise, conversational, and direct. Avoid long, multi-paragraph summaries.
- If you can't find the answer in the tools or page content, admit it.

**UI Components you can use:**
- **Buttons / CTAs:** \`[Label](/path "cta")\`
- **Follow-up actions:** \`[Question](# "follow-up")\`
- **Charts:** Markdown code block with language \`chart\` containing JSON.
- **Discord Widget:** Code block with language \`discord-widget\` containing the server ID (1480617556292272260).

**GitHub Copilot Dev Days | Lucknow:**
- **What is it:** A community developer event exploring AI-assisted coding with GitHub Copilot. Hosted on Luma by Bits&Bytes.
- **Date & Time:** Sunday, April 19, 2026, 10:00 AM – 2:00 PM IST.
- **Venue:** Cubispace, Jankipuram, Lucknow.
- **Registration:** Approval required. Register via Luma: https://luma.com/xtxua1jl

**India Innovates 2026 Event Details:**
- **Executive Partner:** Bits&Bytes is the Executive Partner of this national hackathon finale on March 28, 2026 at Bharat Mandapam, New Delhi.
- **Attendance Policy:** At least 1 team member **must** be physically present to present. Replacement is **not allowed**.
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

    const timeContext = `\n\n**Current Date & Time:** ${new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "long",
    })} (IST)`

    const baseMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: SITE_CONTEXT + timeContext + pageContext + frustrationHint,
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

      // HackClub API requires content to be a string (not null).
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
