import type { Metadata } from "next"
import { BlogCMS } from "@/lib/supabase-cms"
import { CommentSection } from "@/components/blog/comment-section"
import { SocialShare } from "@/components/blog/social-share"
import { RelatedPosts } from "@/components/blog/related-posts"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { slugify } from "@/lib/utils"
import { absoluteSiteUrl } from "@/lib/site-url"

type Props = {
  params: { slug: string }
}

export const dynamicParams = true // Allow visiting newly created posts without a rebuild

// Generate static params for all published blog posts
export async function generateStaticParams() {
  const posts = await BlogCMS.getPublishedBlogPosts()
  return posts.map((post) => ({
    slug: slugify(post.slug || post.title),
  }))
}

// Update the metadata function
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await BlogCMS.getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found | RapidNexTech",
    }
  }

  const fullUrl = absoluteSiteUrl(`/blog/${params.slug}`)

  const seoTitle = post.seo_title || post.title
  const baseDescription = (post.seo_description || post.excerpt || "").replace(/\s+/g, " ").trim()
  const buildMetaDescription = (description: string, title: string) => {
    let value = description
    if (!value) {
      value = `${title} - Practical insights on automation, software, and growth from RapidNexTech.`
    } else if (!value.toLowerCase().includes(title.toLowerCase()) && value.length < 140) {
      value = `${value} - ${title}`
    }
    if (value.length > 160) {
      value = `${value.slice(0, 157).trimEnd()}...`
    }
    return value
  }
  const seoDescription = buildMetaDescription(baseDescription, post.title)

  return {
    title: post.seo_title ? post.seo_title : `${post.title} | RapidNexTech Blog`,
    description: seoDescription,
    keywords: post.tags?.join(', '),
    authors: [{ name: post.author }],
    creator: post.author,
    publisher: 'RapidNexTech',
    robots: {
      index: post.is_published,
      follow: post.is_published,
      googleBot: {
        index: post.is_published,
        follow: post.is_published,
      },
    },
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: fullUrl,
      siteName: 'RapidNexTech Blog',
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated_at,
      authors: [post.author],
      tags: post.tags,
      images: post.images?.[0]?.url
        ? [
          {
            url: post.images[0].url,
            width: 1200,
            height: 630,
            alt: post.images[0].alt || seoTitle,
            type: 'image/jpeg',
          },
        ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      site: '@RapidNexTech',
      creator: '@RapidNexTech',
      title: seoTitle,
      description: seoDescription,
      images: post.images?.[0]?.url ? [
        {
          url: post.images[0].url,
          alt: post.images[0].alt || seoTitle,
        }
      ] : [],
    },
    other: {
      'article:author': post.author,
      'article:published_time': post.date,
      'article:modified_time': post.updated_at,
      'article:section': 'Technology',
      'article:tag': post.tags?.join(','),
    },
  }
}


import BlogPostClient from "./BlogPostClient"

export default async function BlogPostPage({ params }: Props) {
  const post = await BlogCMS.getBlogPostBySlug(params.slug)

  if (!post) {
    return (
      <div className="min-h-screen theme-bg theme-transition flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold theme-text mb-4">Post Not Found</h1>
          <p className="theme-text opacity-70 mb-8">The blog post you're looking for doesn't exist.</p>
          <a href="/blog" className="inline-flex items-center theme-text hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Blog
          </a>
        </div>
      </div>
    )
  }

  const fullUrl = absoluteSiteUrl(`/blog/${params.slug}`)

  // Fetch related posts (optimized to fetch only metadata)
  const relatedPosts = await BlogCMS.getRelatedBlogPosts(post.id, 3)

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.seo_title || post.title,
            description: post.seo_description || post.excerpt,
            image: post.images?.[0]?.url || absoluteSiteUrl("/og-image.jpg"),
            datePublished: post.date,
            dateModified: post.updated_at,
            author: {
              "@type": "Person",
              name: post.author,
              url: absoluteSiteUrl("/about")
            },
            publisher: {
              "@type": "Organization",
              name: "RapidNexTech",
              logo: {
                "@type": "ImageObject",
                url: absoluteSiteUrl("/logo.png")
              }
            },
            url: fullUrl,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": fullUrl
            },
            keywords: post.tags?.join(', '),
            articleSection: "Technology",
            inLanguage: "en-US",
            isFamilyFriendly: true
          })
        }}
      />

      <BlogPostClient
        post={post}
        relatedPosts={relatedPosts}
        fullUrl={fullUrl}
      />
    </>
  )
}
