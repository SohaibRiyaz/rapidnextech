import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Quote } from "lucide-react"
import { siteConfig } from "@/lib/site-config"
import { softwareClientTestimonials } from "@/lib/software-testimonials"
import { SectionHeading } from "./section-heading"
import { card, sectionY, textLink } from "./styles"

function VideoTestimonial({ url }: { url: string }) {
  const isFile = /\.(mp4|webm|mov)(\?|$)/i.test(url)
  return (
    <div className={`${card} overflow-hidden`}>
      <div className="aspect-video w-full bg-muted">
        {isFile ? (
          <video controls preload="none" className="h-full w-full" src={url}>
            Your browser does not support the video element.
          </video>
        ) : (
          <iframe
            src={url}
            title="Video testimonial"
            loading="lazy"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        )}
      </div>
    </div>
  )
}

export function DentalBehindThis() {
  return (
    <section aria-labelledby="behind-title" className={`${sectionY} bg-muted/40`}>
      <div className="container mx-auto px-4 sm:px-6">
        <SectionHeading id="behind-title" eyebrow="Who's behind this" title="A small team you can actually talk to" />

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className={`${card} flex flex-col gap-6 p-6 sm:flex-row sm:items-start md:p-8`}>
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-border">
              <Image
                src="/muhammad-sohaib-riaz.jpg"
                alt="Muhammad Sohaib Riaz"
                fill
                sizes="112px"
                className="object-cover object-top"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-card-foreground">Muhammad Sohaib Riaz</h3>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Founder &amp; CEO, RapidNexTech</p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                RapidNexTech is a software engineering company. We build and run this AI receptionist ourselves, and
                our team sets up every pilot with you on a short screen-share, then tests it live before forwarding is
                turned on.
              </p>
              <Link href="/about" className={`${textLink} mt-3 text-sm`}>
                About RapidNexTech <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <p className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">From our custom-software clients.</span> These clients
              hired us to build software. They are not dental practices or AI receptionist customers.
            </p>
            {softwareClientTestimonials.map((t) => (
              <figure key={t.id} className={`${card} p-6`}>
                <Quote className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />
                <blockquote className="leading-relaxed text-card-foreground">&ldquo;{t.text}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold text-card-foreground">{t.name}</span>
                  <span className="text-muted-foreground">
                    , {t.position}, {t.company} · {t.category} client
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {siteConfig.videoTestimonialUrl ? (
          <div className="mx-auto mt-10 max-w-3xl">
            <VideoTestimonial url={siteConfig.videoTestimonialUrl} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
