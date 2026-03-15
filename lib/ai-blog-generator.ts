import { slugify } from "./utils"

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
const WORD_COUNT_MIN = 1500
const WORD_COUNT_MAX = 1800
const IMAGE_COUNT = 3

async function generateAndUploadBlogImage(
  prompt: string,
  slug: string,
  index: number,
  total: number,
  onStatusUpdate?: (status: string) => void
): Promise<{ url: string }> {
  onStatusUpdate?.(`Generating image ${index + 1}/${total}...`)

  const response = await fetch("/api/ai-blog-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, slug }),
  })

  if (!response.ok) {
    let message = `Image generation failed (${response.status})`
    try {
      const err = await response.json()
      message = err?.error || message
    } catch {
      // ignore json parse errors
    }
    throw new Error(message)
  }

  const data = await response.json()
  if (!data?.url) {
    throw new Error("Image generation failed: missing URL from server.")
  }

  return { url: data.url }
}

interface GeneratedBlog {
  title: string
  slug: string
  excerpt: string
  content: string
  tags: string[]
  seo_title: string
  seo_description: string
  image_urls: string[]
  image_prompts: string[]
  primary_keyword: string
  secondary_keywords: string[]
  faqs: { question: string; answer: string }[]
  cta: { title: string; description: string; buttonText: string; buttonLink: string }
}

export type AIBlogConfig = {
  topic?: string
  primaryKeyword: string
  secondaryKeywords: string[]
  serviceUrl: string
  internalLinks: { anchor: string; url: string }[]
}

const SYSTEM_PROMPT = `You are the Senior Technical Content Writer for RapidNexTech, an innovative software development company specializing in web development, mobile apps, UI/UX design, and enterprise solutions.

Your job is to write a single, compelling, SEO-optimized blog post that will rank well on Google and provide genuine value to readers. The post must feel professional, authoritative, and modern.

FORMATTING RULES:
- Write the content body in clean Markdown (H2 ##, H3 ###, bold, lists, code blocks where relevant).
- The content MUST be between ${WORD_COUNT_MIN}-${WORD_COUNT_MAX} words.
- Use the primary keyword in: Title, first 100 words, one H2, meta description, slug, and conclusion.
- Target keyword density around 0.8% - 1.2%.
- Use short paragraphs (2-4 lines max) for readability.
- Include 3+ real industry statistics (response time, conversion rates, no-show rates, or messaging trends).
- Add 2-3 short featured-snippet answers (40-60 words) under relevant headings.
- Add a "Key Takeaways" or "TL;DR" bullet list near the end.
- Insert image markers in the content: [Image:0] after the intro, [Image:1] mid-article, [Image:2:right] later in the article.
- Image prompts must depict a realistic workplace/setting that matches the topic (e.g., clinic reception, real estate office).
- Naturally mention RapidNexTech once or twice as an authority but do NOT make it a sales pitch.
- End with a compelling conclusion paragraph that encourages readers to take action.

STRUCTURE (must follow this order):
1) Introduction (120-150 words)
2) H2: The Problem
3) H2: Why This Happens
4) H2: The Solution
5) H2: How It Works (step-by-step)
6) H2: Real Benefits (use numbers/outcomes)
7) H2: Conclusion (summary + soft CTA)

OUTPUT FORMAT:
Return ONLY a valid JSON object (no markdown fences, no extra text) with these exact keys:
{
  "title": "The blog post title (60-70 chars, compelling, includes primary keyword)",
  "excerpt": "A 150-160 character meta-description-style summary that hooks the reader",
  "content": "The full markdown body of the blog post (DO NOT include the title as H1)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "seo_title": "SEO-optimized title | RapidNexTech (max 60 chars)",
  "seo_description": "SEO meta description (max 160 chars)",
  "image_prompts": [
    "Prompt for image 0 (40-60 words). No readable text, no letters, no UI copy, no watermark, no signature. Logos allowed only as simple icon marks without words. If any screens appear, keep them blank or abstract.",
    "Prompt for image 1 (40-60 words). No readable text, no letters, no UI copy, no watermark, no signature. Logos allowed only as simple icon marks without words. If any screens appear, keep them blank or abstract.",
    "Prompt for image 2 (40-60 words). No readable text, no letters, no UI copy, no watermark, no signature. Logos allowed only as simple icon marks without words. If any screens appear, keep them blank or abstract."
  ],
  "primary_keyword": "Primary keyword used for SEO",
  "secondary_keywords": ["secondary 1", "secondary 2", "secondary 3"],
  "faqs": [
    { "question": "A relevant FAQ question?", "answer": "A concise, helpful answer (40-80 words)." },
    { "question": "Another FAQ?", "answer": "Another answer (40-80 words)." },
    { "question": "Third FAQ?", "answer": "Third answer (40-80 words)." },
    { "question": "Fourth FAQ?", "answer": "Fourth answer (40-80 words)." }
  ],
  "cta": {
    "title": "A compelling CTA title related to the blog topic (e.g., Ready to Build Your Next App?)",
    "description": "A short description encouraging the reader to take action, mentioning RapidNexTech's services.",
    "buttonText": "CTA button label (e.g., Schedule Free Consultation)",
    "buttonLink": "/contact"
  }
}`

export async function generateBlogPost(
  config: AIBlogConfig,
  onStatusUpdate?: (status: string) => void
): Promise<GeneratedBlog> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_GROQ_API_KEY is not configured. Please add it to your .env.local file.")
  }

  const trimmedTopic = config.topic?.trim()
  const primaryKeyword = config.primaryKeyword.trim()
  const secondaryKeywords = config.secondaryKeywords.map((k) => k.trim()).filter(Boolean)
  const serviceUrl = config.serviceUrl.trim()
  const internalLinks = config.internalLinks.filter((link) => link.anchor.trim() && link.url.trim())

  const userPrompt = `Write a blog post with these inputs:
Topic (optional): ${trimmedTopic || "Choose a relevant topic that matches the primary keyword"}
Primary keyword: ${primaryKeyword}
Secondary keywords: ${secondaryKeywords.join(", ") || "None"}
Audience: business owners / decision makers
Internal links to include (anchor text and URL):
${internalLinks.map((link) => `- ${link.anchor} -> ${link.url}`).join("\n") || "None"}
Primary service URL to mention in CTA and in-body link: ${serviceUrl}
`

  onStatusUpdate?.("Initiating AI creative engine...")

  const basePayload = {
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4096,
  }

  const callGroq = async (withResponseFormat: boolean) =>
    fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...basePayload,
        ...(withResponseFormat ? { response_format: { type: "json_object" } } : {}),
      }),
    })

  let response = await callGroq(true)
  let errorBody = ""

  if (!response.ok) {
    errorBody = await response.text()
    console.error("Groq API error:", errorBody)
    if (response.status === 400) {
      response = await callGroq(false)
      if (!response.ok) {
        const retryBody = await response.text()
        console.error("Groq API retry error:", retryBody)
        if (response.status === 401) {
          throw new Error("Groq API key is invalid or expired. Please generate a new key at https://console.groq.com/keys and update NEXT_PUBLIC_GROQ_API_KEY in .env.local, then restart the dev server.")
        }
        const trimmedRetry = retryBody?.toString().trim()
        throw new Error(`Groq API error (${response.status}): ${trimmedRetry || response.statusText}`)
      }
    } else {
      if (response.status === 401) {
        throw new Error("Groq API key is invalid or expired. Please generate a new key at https://console.groq.com/keys and update NEXT_PUBLIC_GROQ_API_KEY in .env.local, then restart the dev server.")
      }
      const trimmed = errorBody?.toString().trim()
      throw new Error(`Groq API error (${response.status}): ${trimmed || response.statusText}`)
    }
  }

  const data = await response.json()
  const rawContent = data.choices?.[0]?.message?.content

  if (!rawContent) {
    throw new Error("No content received from Groq API")
  }

  let parsed: any
  try {
    parsed = JSON.parse(rawContent)
  } catch (e) {
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0])
      } catch (innerError) {
        console.error("Failed to parse Groq response:", rawContent)
        throw new Error("AI returned invalid JSON. Please try again.")
      }
    } else {
      console.error("Failed to parse Groq response:", rawContent)
      throw new Error("AI returned invalid JSON. Please try again.")
    }
  }

  if (!parsed.title || !parsed.content || !parsed.excerpt) {
    throw new Error("AI response is missing required fields (title, content, or excerpt). Please try again.")
  }

  const slug = slugify(parsed.slug || parsed.title)

  onStatusUpdate?.("Optimizing structure for SEO...")

  const contentWithImages = ensureImageMarkers(parsed.content || "")
  const contentWithLinks = ensureInternalLinks(contentWithImages, internalLinks)
  const imagePrompts = Array.isArray(parsed.image_prompts) ? parsed.image_prompts : []
  const normalizedPrompts = buildImagePrompts(parsed.title || primaryKeyword, imagePrompts)

  const imageUrls: string[] = []
  for (let i = 0; i < IMAGE_COUNT; i += 1) {
    const result = await generateAndUploadBlogImage(normalizedPrompts[i], slug, i, IMAGE_COUNT, onStatusUpdate)
    imageUrls.push(result.url)
  }

  return {
    title: parsed.title,
    slug,
    excerpt: parsed.excerpt,
    content: contentWithLinks,
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    seo_title: parsed.seo_title || parsed.title,
    seo_description: parsed.seo_description || parsed.excerpt,
    image_urls: imageUrls,
    image_prompts: normalizedPrompts,
    primary_keyword: parsed.primary_keyword || primaryKeyword,
    secondary_keywords: Array.isArray(parsed.secondary_keywords) ? parsed.secondary_keywords : secondaryKeywords,
    faqs: Array.isArray(parsed.faqs) ? parsed.faqs : [],
    cta: parsed.cta || {
      title: "Ready to Build Something Amazing?",
      description: "Let RapidNexTech turn your vision into reality with cutting-edge software solutions.",
      buttonText: "Schedule Free Consultation",
      buttonLink: "/contact",
    },
  }
}

function buildImagePrompts(titleOrKeyword: string, prompts: string[]): string[] {
  const guard =
    "No readable text, no letters, no UI copy, no watermark, no signature. Logos allowed only as simple icon marks without words. If any screens appear, keep them blank or abstract."
  const sceneHint = deriveImageSceneHint(titleOrKeyword)
  const context = sceneHint ? ` ${sceneHint}` : ""
  const base = `Professional editorial image related to ${titleOrKeyword}.${context} Cinematic lighting, clean composition. ${guard}`
  const normalized = prompts
    .map((prompt) => `${prompt}`.trim())
    .filter(Boolean)
    .map((prompt) => `${prompt}${context} ${guard}`.trim())
  while (normalized.length < IMAGE_COUNT) normalized.push(base)
  return normalized.slice(0, IMAGE_COUNT)
}

function ensureImageMarkers(content: string): string {
  const hasAllMarkers = /\[Image:0\]/.test(content) && /\[Image:1\]/.test(content) && /\[Image:2:right\]/.test(content)
  if (hasAllMarkers) return content

  const sections = content.split(/\n##\s+/)
  const intro = sections.shift() || content
  let rebuilt = intro.trim()

  if (!/\[Image:0\]/.test(rebuilt)) {
    rebuilt += "\n\n[Image:0]\n"
  }

  if (sections.length > 0) {
    const firstSection = `## ${sections[0].trim()}`
    rebuilt += `\n\n${firstSection}`
  }

  if (!/\[Image:1\]/.test(content)) {
    const remaining = sections.slice(1)
    if (remaining.length >= 1) {
      const secondSection = `## ${remaining[0].trim()}`
      rebuilt += `\n\n${secondSection}\n\n[Image:1]\n`
      rebuilt += remaining.slice(1).map((section) => `\n\n## ${section.trim()}`).join("")
    }
  } else {
    rebuilt += sections.slice(1).map((section) => `\n\n## ${section.trim()}`).join("")
  }

  if (!/\[Image:2:right\]/.test(rebuilt)) {
    rebuilt += "\n\n[Image:2:right]\n"
  }

  return rebuilt.trim()
}

function ensureInternalLinks(
  content: string,
  links: { anchor: string; url: string }[]
): string {
  const validLinks = links.filter((link) => link.anchor.trim() && link.url.trim())
  if (validLinks.length === 0) return content

  const missingLinks = validLinks.filter((link) => {
    const urlPattern = new RegExp(link.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
    const anchorPattern = new RegExp(`\\[${link.anchor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\]`, "i")
    return !(urlPattern.test(content) || anchorPattern.test(content))
  })

  if (missingLinks.length === 0) return content

  const sections = content.split(/\n##\s+/)
  const intro = sections.shift() || content
  const rebuilt: string[] = [intro.trim()]

  const insertTargets = Math.max(1, Math.min(missingLinks.length, sections.length))
  const perSection = Math.ceil(missingLinks.length / insertTargets)
  let linkIndex = 0

  sections.forEach((section, idx) => {
    const sectionText = `## ${section.trim()}`
    rebuilt.push(sectionText)

    if (linkIndex < missingLinks.length && idx < insertTargets) {
      const slice = missingLinks.slice(linkIndex, linkIndex + perSection)
      linkIndex += slice.length
      const sentences = slice.map((link) => `Learn more about [${link.anchor}](${link.url}).`)
      rebuilt.push(sentences.join(" "))
    }
  })

  // If content had no H2 sections, append links after intro.
  if (sections.length === 0) {
    const sentences = missingLinks.map((link) => `Learn more about [${link.anchor}](${link.url}).`)
    rebuilt.push(sentences.join(" "))
  }

  return rebuilt.join("\n\n").trim()
}

function deriveImageSceneHint(text: string): string {
  const haystack = text.toLowerCase()
  const hints: Array<{ keywords: string[]; hint: string }> = [
    {
      keywords: ["aesthetic clinic", "aesthetic", "med spa", "cosmetic", "dermatology", "beauty clinic", "skin clinic"],
      hint: "Scene: modern aesthetic clinic reception or treatment room, clean medical interior, staff with tablet.",
    },
    {
      keywords: ["dental", "dentist", "orthodontic"],
      hint: "Scene: modern dental clinic reception or treatment room, clean sterile surfaces, patient chair.",
    },
    {
      keywords: ["real estate", "realtor", "property", "broker", "mortgage"],
      hint: "Scene: real estate office, agent with client, property brochures, handshake, desk with documents.",
    },
    {
      keywords: ["whatsapp", "messaging", "chatbot", "bot", "automation"],
      hint: "Scene: professional at desk using smartphone with messaging app, support workspace, blank chat bubbles.",
    },
    {
      keywords: ["booking", "appointment", "calendar"],
      hint: "Scene: reception desk with scheduling materials, clean modern office, laptop with abstract calendar.",
    },
    {
      keywords: ["saas", "software", "app", "platform", "development", "startup"],
      hint: "Scene: software team workspace, laptops with abstract UI, whiteboards without legible text.",
    },
    {
      keywords: ["ecommerce", "online store", "shopify", "retail"],
      hint: "Scene: ecommerce operations desk, packaging boxes, order slips without text, laptop with abstract UI.",
    },
    {
      keywords: ["finance", "fintech", "bank", "accounting", "crm"],
      hint: "Scene: finance office, clean desk, calculator, charts on screen with abstract shapes.",
    },
    {
      keywords: ["healthcare", "clinic", "medical"],
      hint: "Scene: healthcare clinic reception, appointment desk, clean clinical environment.",
    },
  ]

  for (const entry of hints) {
    if (entry.keywords.some((keyword) => haystack.includes(keyword))) {
      return entry.hint
    }
  }

  return "Scene: modern professional workplace related to the topic."
}
