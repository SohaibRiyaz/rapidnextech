import type { Metadata } from "next"
import Script from "next/script"
import BlogClient from "./BlogClient"
import { BlogCMS } from "@/lib/supabase-cms"

export const metadata: Metadata = {
  title: { absolute: "Blog: AI Receptionists, Automation & Software | RapidNexTech" },
  description:
    "Articles on AI receptionists, patient call handling, practice automation and custom software development from the RapidNexTech team.",
  alternates: { canonical: "https://rapidnextech.com/blog" },
  openGraph: {
    title: "Blog: AI Receptionists, Automation & Software | RapidNexTech",
    description:
      "Articles on AI receptionists, patient call handling, practice automation and custom software development from the RapidNexTech team.",
    url: "https://rapidnextech.com/blog",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "RapidNexTech Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog: AI Receptionists, Automation & Software | RapidNexTech",
    description:
      "Articles on AI receptionists, patient call handling, practice automation and custom software development from the RapidNexTech team.",
    images: ["/og-image.png"],
  },
}

export default async function BlogPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "RapidNexTech Insights",
    url: "https://rapidnextech.com/blog",
    description:
      "Explore the latest insights on software development, AI, Next.js, and digital transformation.",
    publisher: {
      "@type": "Organization",
      name: "RapidNexTech",
      logo: {
        "@type": "ImageObject",
        url: "https://rapidnextech.com/logo.png",
      },
    },
  }

  // Server-side fetch so the blog index is prerendered with content,
  // avoiding an extra Supabase round trip in the browser.
  const posts = await BlogCMS.getPublishedBlogPosts()

  return (
    <>
      <BlogClient initialPosts={posts} />
      <Script
        id="blog-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
