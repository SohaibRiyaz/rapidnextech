"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Header from "@/components/Header"
import { Footer } from "@/components/Footer"
import { FloatingWhatsAppWidget } from "@/components/whatsapp/floating-whatsapp-widget"
import { siteConfig } from "@/lib/site-config"
import dynamic from "next/dynamic"

// Separate chunks: only downloaded on the software sales routes, so other pages' bundles don't grow.
const SoftwareAttribution = dynamic(() => import("@/components/software/attribution").then((m) => m.SoftwareAttribution))
const SoftwareHeader = dynamic(() => import("@/components/software/software-header").then((m) => m.SoftwareHeader))
const SoftwareFooter = dynamic(() => import("@/components/software/software-footer").then((m) => m.SoftwareFooter))

interface ConditionalLayoutProps {
    children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const pathname = usePathname()

    // Define routes where the main header and footer should NOT be displayed
    const isAdminRoute = pathname?.startsWith("/admin") || pathname === "/admin-login"
    const isHomeServiceDemoRoute =
        pathname === "/solutions/never-miss-a-call" || pathname === "/solutions/never-miss-a-medspa-call"

    if (isAdminRoute) {
        return <>{children}</>
    }

    // Custom-software sales pages (shared by outreach emails) get software-only navigation.
    // Every other route keeps the main header and footer below, unchanged.
    const isSoftwareSalesRoute =
        pathname?.startsWith("/software/industries") || pathname?.startsWith("/software/start-a-project")

    if (isSoftwareSalesRoute) {
        return (
            <>
                <SoftwareAttribution />
                <SoftwareHeader />
                <main className="flex-grow" role="main">
                    {children}
                </main>
                <SoftwareFooter />
            </>
        )
    }

    return (
        <>
            <Header />
            <main className="flex-grow" role="main">
                {children}
            </main>
            <Footer />
            {siteConfig.whatsappBadgeEnabled && !isHomeServiceDemoRoute ? <FloatingWhatsAppWidget /> : null}
        </>
    )
}
