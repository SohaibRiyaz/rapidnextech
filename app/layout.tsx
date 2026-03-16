import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { ConditionalLayout } from "@/components/conditional-layout"
import NextTopLoader from "nextjs-toploader"
import { ThemeProvider } from "../components/theme-provider"
import { ThemeContextProvider } from "@/context/theme-context"
import { AuthProvider } from "@/context/auth-context"
import Script from "next/script"
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
})

// Enhanced SEO metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://rapidnextech.com"),
  title: {
    default: "RapidNexTech — Custom Software, SaaS & AI Automation",
    template: "%s | RapidNexTech",
  },
  description:
    "We build custom software, scalable SaaS platforms, and AI-powered automation systems that solve real business problems. From MVPs to enterprise scale.",
  keywords: [
    "custom software development",
    "SaaS development",
    "AI automation",
    "web application development",
    "mobile app development",
    "WhatsApp automation",
    "enterprise solutions",
    "React development",
    "Node.js development",
    "full-stack development",
    "digital transformation",
    "startup MVP development",
    "API development",
    "cloud solutions",
    "DevOps services",
  ],
  authors: [{ name: "RapidNexTech Team", url: "https://rapidnextech.com" }],
  creator: "RapidNexTech",
  publisher: "RapidNexTech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rapidnextech.com",
    siteName: "RapidNexTech",
    title: "RapidNexTech — Custom Software, SaaS & AI Automation",
    description:
      "We build custom software, scalable SaaS platforms, and AI-powered automation that solve real business problems.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RapidNexTech — Custom Software, SaaS & AI Automation",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RapidNexTech — Custom Software, SaaS & AI Automation",
    description:
      "We build custom software, scalable SaaS platforms, and AI-powered automation that solve real business problems.",
    images: ["/og-image.png"],
    creator: "@RapidNexTech",
    site: "@RapidNexTech",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification_token",
    yandex: "verification_token",
    yahoo: "verification_token",
    other: {
      me: ["mailto:contact@rapidnextech.com"],
    },
  },
  alternates: {
    canonical: "https://rapidnextech.com",
    languages: {
      "en-US": "https://rapidnextech.com",
    },
  },
  icons: {
    icon: "/favicon-32x32.png",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  category: "technology",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="light-mode" data-theme-color="blue">
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/grid.svg" as="image" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Theme and viewport handled by Next.js metadata implicitly, 
            but kept standard meta tags for safety/backwards-compat if preferred */}
        <meta name="theme-color" content="#1e3a8a" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e40af" media="(prefers-color-scheme: dark)" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
      </head>
      <body className={`${inter.className} ${spaceGrotesk.variable} theme-transition antialiased overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ThemeContextProvider>
            <AuthProvider>
              <div className="flex flex-col min-h-screen relative theme-bg theme-transition">
                <NextTopLoader color="#3b82f6" showSpinner={false} />
                <ConditionalLayout>
                  {children}
                </ConditionalLayout>
              </div>
            </AuthProvider>
          </ThemeContextProvider>
        </ThemeProvider>

        {/* Enhanced structured data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://rapidnextech.com/#organization",
              name: "RapidNexTech",
              url: "https://rapidnextech.com",
              logo: {
                "@type": "ImageObject",
                url: "https://rapidnextech.com/logo.png",
                width: 200,
                height: 60,
              },
              description:
                "Innovative software development company specializing in web development, mobile apps, and enterprise solutions.",
              foundingDate: "2020",
              address: {
                "@type": "PostalAddress",
                streetAddress: "38 Scotia Road",
                postalCode: "ST6 4EP",
                addressCountry: "GB",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+44 7311 133668",
                contactType: "customer service",
                availableLanguage: ["English"],
                areaServed: "Worldwide",
              },
              sameAs: [
                "https://twitter.com/RapidNexTech",
                "https://facebook.com/RapidNexTech",
                "https://github.com/RapidNexTech",
                "https://linkedin.com/company/RapidNexTech",
              ],
              serviceType: [
                "Software Development",
                "Web Development",
                "Mobile App Development",
                "UI/UX Design",
                "Enterprise Solutions",
              ],
            }),
          }}
        />

        {/* Website schema */}
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://rapidnextech.com/#website",
              url: "https://rapidnextech.com",
              name: "RapidNexTech",
              description: "Innovative software development company",
              publisher: {
                "@id": "https://rapidnextech.com/#organization",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://rapidnextech.com/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* Performance monitoring */}
        <Script
          id="performance-observer"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                  for (const entry of list.getEntries()) {
                    if (entry.entryType === 'largest-contentful-paint') {
                      console.log('LCP:', entry.startTime);
                    }
                    if (entry.entryType === 'first-input') {
                      console.log('FID:', entry.processingStart - entry.startTime);
                    }
                    if (entry.entryType === 'layout-shift') {
                      if (!entry.hadRecentInput) {
                        console.log('CLS:', entry.value);
                      }
                    }
                  }
                });
                observer.observe({entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']});
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
