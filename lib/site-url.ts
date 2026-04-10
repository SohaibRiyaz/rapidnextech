/**
 * Single origin for canonical URLs (sitemap, robots, metadata helpers).
 * Strips trailing slashes so `${origin}/path` never becomes `//path`.
 */
export function getSiteOrigin(): string {
  const raw = (process.env.NEXT_PUBLIC_BASE_URL || "https://rapidnextech.com").trim()
  if (!raw) return "https://rapidnextech.com"
  try {
    const u = new URL(raw)
    return `${u.protocol}//${u.host}`
  } catch {
    const noTrail = raw.replace(/\/+$/, "")
    return noTrail || "https://rapidnextech.com"
  }
}

/** Absolute URL for a site path; `path` may be `/about` or `about`. Home: `""` or `"/"`. */
export function absoluteSiteUrl(path: string): string {
  const origin = getSiteOrigin()
  const p = path.replace(/^\/+|\/+$/g, "")
  if (!p) return origin
  return `${origin}/${p}`
}
