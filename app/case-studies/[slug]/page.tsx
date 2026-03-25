import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PortfolioCMS } from "@/lib/supabase-cms"
import ProjectDetailClient from "./ProjectDetailClient"
import Script from "next/script"
import { slugify } from "@/lib/utils"

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

  const seoDescription = project.client_description
    ? `${project.client_description.substring(0, 160)}`
    : project.long_description || project.description || "Software case study by RapidNexTech"

  const url = `https://rapidnextech.com/case-studies/${params.slug}`
  const image = project.images?.[0]?.url || "https://rapidnextech.com/og-image.jpg"

  return {
    title: seoTitle,
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
  const url = `https://rapidnextech.com/case-studies/${params.slug}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CaseStudy",
    name: `${data.title} Case Study`,
    description: data.long_description || data.description,
    url,
    author: { "@type": "Organization", name: "RapidXTech" },
    publisher: {
      "@type": "Organization",
      name: "RapidXTech",
      logo: { "@type": "ImageObject", url: "https://rapidnextech.com/logo.png" },
    },
  }
  return (
    <>
      <ProjectDetailClient project={data} />
      <Script id="case-study-jsonld" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}
