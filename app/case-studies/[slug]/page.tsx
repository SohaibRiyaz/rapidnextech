import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PortfolioCMS } from "@/lib/supabase-cms"
import ProjectDetailClient from "./ProjectDetailClient"
import Script from "next/script"
import { slugify } from "@/lib/utils"
import { absoluteSiteUrl } from "@/lib/site-url"
import { breadcrumbSchema, jsonLd } from "@/lib/seo"

// Generate static params for all published projects
export const dynamicParams = true

export async function generateStaticParams() {
  const projects = await PortfolioCMS.getPublishedProjects()
  return projects.map((project) => ({
    slug: slugify(project.slug || project.title),
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await PortfolioCMS.getProjectBySlug(params.slug)
  if (!project) return { title: "Case Study | RapidNexTech" }

  const seoTitle = project.business_outcome
    ? `${project.title}: ${project.business_outcome} | RapidNexTech`
    : `${project.title} Case Study | RapidNexTech`

  const baseDescription = project.client_description
    ? `${project.client_description.substring(0, 160)}`
    : project.long_description || project.description || ""
  const buildMetaDescription = (description: string, title: string) => {
    let value = description.replace(/\s+/g, " ").trim()
    if (!value) {
      value = `${title} case study - Results and delivery highlights from RapidNexTech.`
    } else if (!value.toLowerCase().includes(title.toLowerCase()) && value.length < 140) {
      value = `${value} - ${title}`
    }
    if (value.length > 160) {
      value = `${value.slice(0, 157).trimEnd()}...`
    }
    return value
  }
  const seoDescription = buildMetaDescription(baseDescription, project.title)

  const url = absoluteSiteUrl(`/case-studies/${params.slug}`)
  const image = project.images?.[0]?.url || absoluteSiteUrl("/og-image.jpg")

  return {
    title: {
      absolute: seoTitle,
    },
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: "article",
      url,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [image],
    },
    alternates: { canonical: url },
  }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const data = await PortfolioCMS.getProjectBySlug(params.slug)
  if (!data) return notFound()
  const url = absoluteSiteUrl(`/case-studies/${params.slug}`)
  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "CaseStudy",
    name: `${data.title} Case Study`,
    description: data.long_description || data.description,
    url,
    author: { "@type": "Organization", name: "RapidNexTech" },
    publisher: {
      "@type": "Organization",
      name: "RapidNexTech",
      logo: { "@type": "ImageObject", url: absoluteSiteUrl("/logo.png") },
    },
  }
  const breadcrumb = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Case Studies", path: "/case-studies" },
    { name: data.title, path: `/case-studies/${params.slug}` },
  ])
  return (
    <>
      <ProjectDetailClient project={data} />
      <Script id="case-study-jsonld" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={jsonLd([caseStudySchema, breadcrumb])} />
    </>
  )
}
