import { NextResponse } from "next/server"
import { InferenceClient } from "@huggingface/inference"
import { createClient } from "@supabase/supabase-js"

const MODEL_FALLBACKS = [
  "black-forest-labs/FLUX.1-dev",
  "black-forest-labs/FLUX.1-schnell",
  "stabilityai/stable-diffusion-xl-base-1.0",
]

const toSafeSlug = (value: string) =>
  value.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase() || "ai-blog"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : ""
    const slug = typeof body?.slug === "string" ? body.slug.trim() : "ai-blog"

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
    }

    const token = process.env.HUGGINGFACE_TOKEN || process.env.NEXT_PUBLIC_HUGGINGFACE_TOKEN
    if (!token) {
      return NextResponse.json({ error: "Hugging Face token missing on server" }, { status: 500 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Supabase service role key missing. Set SUPABASE_SERVICE_ROLE_KEY on the server." },
        { status: 500 }
      )
    }
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

    const client = new InferenceClient(token)

    let lastError: Error | null = null
    let imageBlob: Blob | null = null
    let modelUsed: string | null = null

    for (const model of MODEL_FALLBACKS) {
      try {
        const result = await client.textToImage({
          model,
          inputs: prompt,
          parameters: {
            width: 1152,
            height: 648,
            negative_prompt: "text, letters, words, typography, captions, numbers, UI copy, watermark, signature, gibberish text, random letters, signage",
          },
        })
        imageBlob = result
        modelUsed = model
        break
      } catch (error: any) {
        lastError = error instanceof Error ? error : new Error("Image generation failed.")
      }
    }

    if (!imageBlob) {
      return NextResponse.json(
        { error: lastError?.message || "Image generation failed on all models." },
        { status: 502 }
      )
    }

    const normalizedBlob = imageBlob.type ? imageBlob : imageBlob.slice(0, imageBlob.size, "image/png")
    const ext = normalizedBlob.type.includes("png")
      ? "png"
      : normalizedBlob.type.includes("webp")
        ? "webp"
        : "jpg"
    const safeSlug = toSafeSlug(slug)
    const fileName = `ai-${safeSlug}-${Date.now()}.${ext}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from("blog-images")
      .upload(fileName, normalizedBlob, {
        cacheControl: "31536000",
        upsert: false,
        contentType: normalizedBlob.type || "image/png",
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 403 })
    }

    const { data: publicUrlData } = supabaseAdmin.storage.from("blog-images").getPublicUrl(fileName)
    return NextResponse.json({ url: publicUrlData.publicUrl, model: modelUsed })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Unknown server error" }, { status: 500 })
  }
}
