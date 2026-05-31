import { servicesData } from "@/lib/services-data"
import { ServiceHero } from "@/components/services/service-hero"
import { BlockRenderer } from "@/components/services/block-renderer"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { absoluteSiteUrl } from "@/lib/site-url"
import { breadcrumbSchema, faqSchema, jsonLd, serviceSchema } from "@/lib/seo"

// 1. Static Generation of ALL 9 Service Pages
export async function generateStaticParams() {
    return Object.keys(servicesData).map((slug) => ({
        slug: slug,
    }))
}

// 2. SEO Metadata Generation
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const service = servicesData[params.slug]
    if (!service) return {}
    const canonical = absoluteSiteUrl(`/services/${params.slug}`)

    return {
        title: {
            absolute: `${service.title} | RapidNexTech Services`,
        },
        description: service.shortDescription,
        alternates: { canonical },
        openGraph: {
            title: `${service.title} | RapidNexTech Services`,
            description: service.shortDescription,
            url: canonical,
            type: "website",
            images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${service.title} by RapidNexTech` }],
        },
        twitter: {
            card: "summary_large_image",
            title: `${service.title} | RapidNexTech Services`,
            description: service.shortDescription,
            images: ["/og-image.png"],
        },
    }
}

// 3. Page Component
export default function ServicePage({ params }: { params: { slug: string } }) {
    const service = servicesData[params.slug]

    if (!service) {
        notFound()
    }

    const Icon = service.icon
    const faqBlock = service.contentBlocks.find((block) => block.type === "faq")
    const faqItems = faqBlock?.type === "faq" ? faqBlock.data.items : []
    const pagePath = `/services/${params.slug}`

    return (
        <main className="min-h-screen bg-background text-foreground">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={jsonLd([
                    breadcrumbSchema([
                        { name: "Home", path: "/" },
                        { name: "Services", path: "/services" },
                        { name: service.title, path: pagePath },
                    ]),
                    serviceSchema({
                        name: service.title,
                        description: service.shortDescription,
                        path: pagePath,
                    }),
                    ...(faqItems.length ? [faqSchema(faqItems)] : []),
                ])}
            />
            {/* Hero Section */}
            <ServiceHero
                title={service.title}
                subtitle={service.subtitle}
                description={service.shortDescription}
                iconElement={<Icon className="w-10 h-10 md:w-12 md:h-12 text-primary" />}
            />

            {/* Modular Content Blocks */}
            <div className="space-y-0">
                {service.contentBlocks.map((block, index) => (
                    <BlockRenderer key={index} block={block} />
                ))}
            </div>

            {/* Final CTA Floating Card */}
            <section className="py-20 px-6">
                <div className="container mx-auto">
                    <div className="bg-gradient-to-br from-primary via-primary/90 to-purple-600 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-primary/20">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                            <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-white/10 rounded-full blur-[100px]" />
                            <div className="absolute bottom-[-50%] right-[-20%] w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[80px]" />
                        </div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">Ready to scale your vision?</h2>
                            <p className="text-xl text-white/90 mb-10 leading-relaxed font-medium">
                                Let's build something extraordinary together.
                            </p>
                            <a
                                href="/contact"
                                className="inline-flex h-14 items-center justify-center rounded-full bg-white text-primary px-10 text-lg font-bold shadow-lg transition-transform hover:scale-105 hover:bg-gray-50"
                            >
                                Book a Free Consultation
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
