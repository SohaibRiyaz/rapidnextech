import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { birthdays, getBirthday } from "@/content/birthdays"
import { BirthdayExperience } from "@/components/birthday/experience"

// Only slugs with a content file exist; anything else is a 404.
export const dynamicParams = false

export function generateStaticParams() {
  return birthdays.map((b) => ({ slug: b.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const b = getBirthday(params.slug)
  if (!b) return {}
  return {
    title: { absolute: b.share.title },
    description: b.share.description,
    // Private page: never indexed or followed. Open Graph tags still work for WhatsApp previews.
    // og.jpg is a JPEG snapshot of /birthday/<slug>/og (next/og only outputs PNG, ~500 KB with the photo,
    // and WhatsApp often skips preview images over ~300 KB). Regenerate it if the design changes.
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
    alternates: { canonical: null },
    openGraph: {
      title: b.share.title,
      description: b.share.description,
      type: "website",
      url: `/birthday/${b.slug}`,
      images: [{ url: `/birthday/${b.slug}/og.jpg`, width: 1200, height: 630, alt: b.share.ogHeadline }],
    },
    twitter: {
      card: "summary_large_image",
      title: b.share.title,
      description: b.share.description,
      images: [`/birthday/${b.slug}/og.jpg`],
    },
  }
}

export const viewport = {
  themeColor: "#07041a",
  viewportFit: "cover",
}

export default function BirthdayPage({ params }: { params: { slug: string } }) {
  const b = getBirthday(params.slug)
  if (!b) notFound()
  return <BirthdayExperience data={b} />
}
