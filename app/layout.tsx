import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { ConditionalLayout } from "@/components/conditional-layout"
import NextTopLoader from "nextjs-toploader"
import { ThemeProvider } from "../components/theme-provider"
import { ThemeContextProvider } from "@/context/theme-context"
import { getSiteOrigin } from "@/lib/site-url"
import { jsonLd, organizationSchema, websiteSchema } from "@/lib/seo"

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

const siteOrigin = getSiteOrigin()
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim()

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "RapidNexTech — Custom Software, SaaS & AI Automation",
    template: "%s | RapidNexTech",
  },
  description:
    "We build custom software, scalable SaaS platforms, and AI-powered automation systems that solve real business problems. From MVPs to enterprise scale.",
  verification: {
    ...(googleVerification ? { google: googleVerification } : {}),
    ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
  },
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
  alternates: {
    canonical: siteOrigin,
    languages: {
      "en-US": siteOrigin,
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
            <div className="flex flex-col min-h-screen relative theme-bg theme-transition">
              <NextTopLoader color="#3b82f6" showSpinner={false} />
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </div>
          </ThemeContextProvider>
        </ThemeProvider>

        <script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(organizationSchema())}
        />
        <script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(websiteSchema())}
        />
      </body>
    </html>
  )
}
