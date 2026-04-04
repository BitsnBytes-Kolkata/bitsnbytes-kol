import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { prompt, modelChoice, aspectRatio } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const enhancedPrompt = prompt + " (High quality, clear, uncropped. If UI mockup: perfectly flat digital design, direct front-facing screen only, single device, completely filling the frame, no angled 3D floating phones, no messy borders)"

    if (modelChoice === "stable-diffusion-3") {
      const invokeUrl = "https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-3-medium"
      const payload = {
        prompt: enhancedPrompt,
        cfg_scale: 5,
        aspect_ratio: aspectRatio ?? "16:9",
        seed: 0,
        steps: 40,
        negative_prompt: "cropped, floating devices, angled perspective, multiple phones, messy, cluttered, out of frame, 3d render"
      }
      
      const res = await fetch(invokeUrl, {
        method: "post",
        body: JSON.stringify(payload),
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${process.env.NVIDIA_KEY}`,
          "Accept": "application/json"
        }
      })
      if (!res.ok) throw new Error("Status " + res.status)
      const data = await res.json()
      const b64 = data?.image || data?.artifacts?.[0]?.base64
      if (b64) {
        return NextResponse.json({ success: true, base64: `data:image/jpeg;base64,${b64}` })
      }
      throw new Error("Missing image payload from SD3")
      
    } else {
      // Gemini Flash Image Preview (Hack Club)
      const res = await fetch("https://ai.hackclub.com/proxy/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HACKCLUB_PROXY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.1-flash-image-preview",
          messages: [{ role: "user", content: enhancedPrompt }],
          modalities: ["image", "text"],
          image_config: { aspect_ratio: aspectRatio ?? "16:9" }
        }),
      })
      if (!res.ok) throw new Error("Status " + res.status)
      const data = await res.json()
      const imgUrl = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url
      if (imgUrl) {
        return NextResponse.json({ success: true, base64: imgUrl })
      }
      throw new Error("Missing image payload from Gemini")
    }
  } catch (err: any) {
    console.error("Image gen error in proxy:", err)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
