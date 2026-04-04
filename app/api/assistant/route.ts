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

type AssistantAction = { type: "navigate"; path: string } | { type: "highlight"; textSnippet: string } | { type: "generate_image"; prompt: string; modelChoice: string; aspectRatio: string }

const SITE_CONTEXT = `
You are the official AI assistant for Bits&Bytes.

You must follow these operating rules:
1. Your only source of factual truth is tool output and current page content. Do not rely on memory for facts.
2. For any factual question about events, founders, team, rules, dates, contact info, history, or club details, call search_site_content first.
3. For team/person matching, call find_team_expert and/or recommend_role. Do not guess.
4. For navigation requests, call suggest_navigation.
5. When the answer references text visible on the current page, call highlight_text with the exact snippet.
6. For contact submissions, call submit_contact_form only after collecting required fields: name, email, message.
7. If the user asks for an image or mockup, call generate_image. Never output raw tool JSON.

Response style:
- Be concise, direct, and helpful.
- If tools do not return enough information, clearly say you could not verify the answer.

Safety:
- Refuse requests unrelated to Bits&Bytes, technology, coding, education, or local community support.
- Do not provide private personal details not present in tool output.

**UI Components you can use:**
- **Buttons / CTAs:** \`[Label](/path "cta")\`
- **Follow-up actions:** \`[Question](# "follow-up")\`
- **Charts:** Markdown code block with language \`chart\` containing JSON.
- **Community Link:** Use this WhatsApp invite when users ask to join the community: https://chat.whatsapp.com/DvAIRLgEEBxISR8bsb9kVg
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
  {
    type: "function",
    function: {
      name: "generate_image",
      description:
        "Generate an image for the user (e.g. for mockups, banners, ideas). Use this when user asks for an image, graphic, or UI. This tool returns a markdown string with the image.",
      parameters: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description: "A highly detailed prompt for the image generation model.",
          },
          model_choice: {
            type: "string",
            description: "Either 'stable-diffusion-3' (for art/steampunk/quality) or 'gemini-3.1' (for simple, extremely fast mockups).",
            enum: ["stable-diffusion-3", "gemini-3.1"]
          },
          aspect_ratio: {
            type: "string",
            description: "Aspect ratio, e.g. '16:9', '1:1', or '9:16'.",
            enum: ["1:1", "16:9", "9:16"]
          }
        },
        required: ["prompt", "model_choice", "aspect_ratio"],
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

async function handleImageGenTool(args: any) {
  const prompt = (args?.prompt ?? "").toString().trim()
  const modelChoice = args?.model_choice === "gemini-3.1" ? "gemini-3.1" : "stable-diffusion-3"
  const aspectRatio = args?.aspect_ratio ?? "16:9"

  if (!prompt) {
    return { action: null, result: { success: false, message: "A prompt is required." } }
  }

  // Instead of waiting 10s here, we instruct the UI to show an aesthetic animation
  // and trigger the separate API route to actually generate the image.
  return {
    action: { type: "generate_image", prompt, modelChoice, aspectRatio },
    result: { success: true, message: "Image generation triggered. Tell the user it's being generated right now in the chat interface." }
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
        } else if (toolName === "generate_image") {
          const res = await handleImageGenTool(toolArgs)
          toolResult = res.result
          if (res.action) actionToClient = res.action as any
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
