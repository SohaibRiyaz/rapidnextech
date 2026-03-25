import type { MetadataRoute } from "next"
import { BlogCMS, PortfolioCMS } from "@/lib/supabase-cms"
import { servicesData } from "@/lib/services-data"
import { slugify } from "@/lib/utils"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://rapidnextech.com"
  const currentDate = new Date().toISOString()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  // Dynamic pages (built-time fetch; safe fallbacks if Supabase is unavailable)
  let blogPages: MetadataRoute.Sitemap = []
  let portfolioPages: MetadataRoute.Sitemap = []

  try {
    const posts = await BlogCMS.getPublishedBlogPosts()
    blogPages = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updated_at || post.date || currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  } catch {
    blogPages = []
  }

  try {
    const projects = await PortfolioCMS.getPublishedProjects()
    portfolioPages = projects.map((project: any) => ({
      url: `${baseUrl}/case-studies/${slugify(project.slug || project.title || "")}`,
      lastModified: project.updated_at || currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  } catch {
    portfolioPages = []
  }

  const servicePages: MetadataRoute.Sitemap = Object.keys(servicesData).map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [...staticPages, ...servicePages, ...blogPages, ...portfolioPages]
}
