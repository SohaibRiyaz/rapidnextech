import type { MetadataRoute } from "next"
import { industrySolutions, servicesData } from "@/lib/services-data"
import { slugify } from "@/lib/utils"
import { absoluteSiteUrl, getSiteOrigin } from "@/lib/site-url"
import { unstable_noStore } from "next/cache"

function blogPostPath(post: { slug?: string | null; title?: string }): string | null {
  const s = post.slug?.trim()
  if (s) return s
  const t = post.title?.trim()
  if (!t) return null
  return slugify(t)
}

function caseStudyPath(project: { slug?: string | null; title?: string }): string | null {
  const s = project.slug?.trim()
  if (s) return s
  const t = project.title?.trim()
  if (!t) return null
  return slugify(t)
}

function dedupeByUrl(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seen = new Set<string>()
  return entries.filter((e) => {
    if (seen.has(e.url)) return false
    seen.add(e.url)
    return true
  })
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  unstable_noStore()
  const currentDate = new Date().toISOString()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: getSiteOrigin(),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: absoluteSiteUrl("/about"),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteSiteUrl("/case-studies"),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteSiteUrl("/services"),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteSiteUrl("/blog"),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteSiteUrl("/careers"),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteSiteUrl("/contact"),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteSiteUrl("/privacy-policy"),
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteSiteUrl("/terms-of-service"),
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  let blogPages: MetadataRoute.Sitemap = []
  let portfolioPages: MetadataRoute.Sitemap = []

  try {
    const { BlogCMS } = await import("@/lib/supabase-cms")
    const posts = await BlogCMS.getPublishedBlogPostsFresh()
    blogPages = posts
      .map((post) => {
        const pathSlug = blogPostPath(post)
        if (!pathSlug) return null
        return {
          url: absoluteSiteUrl(`/blog/${pathSlug}`),
          lastModified: post.updated_at || post.date || currentDate,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }
      })
      .filter(Boolean) as MetadataRoute.Sitemap
  } catch {
    blogPages = []
  }

  try {
    const { PortfolioCMS } = await import("@/lib/supabase-cms")
    const projects = await PortfolioCMS.getPublishedProjectsFresh()
    portfolioPages = projects
      .map((project: { slug?: string | null; title?: string; updated_at?: string }) => {
        const pathSlug = caseStudyPath(project)
        if (!pathSlug) return null
        return {
          url: absoluteSiteUrl(`/case-studies/${pathSlug}`),
          lastModified: project.updated_at || currentDate,
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }
      })
      .filter(Boolean) as MetadataRoute.Sitemap
  } catch {
    portfolioPages = []
  }

  const servicePages: MetadataRoute.Sitemap = Object.keys(servicesData).map((slug) => ({
    url: absoluteSiteUrl(`/services/${slug}`),
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const solutionPages: MetadataRoute.Sitemap = industrySolutions.map((solution) => ({
    url: absoluteSiteUrl(solution.href),
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return dedupeByUrl([
    ...staticPages,
    ...servicePages,
    ...solutionPages,
    ...blogPages,
    ...portfolioPages,
  ])
}
