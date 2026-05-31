"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Header from "@/components/Header"
import { Footer } from "@/components/Footer"
import { FloatingWhatsAppWidget } from "@/components/whatsapp/floating-whatsapp-widget"

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

    return (
        <>
            <Header />
            <main className="flex-grow" role="main">
                {children}
            </main>
            <Footer />
            {!isHomeServiceDemoRoute ? <FloatingWhatsAppWidget /> : null}
        </>
    )
}
