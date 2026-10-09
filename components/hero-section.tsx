"use client"

import Link from "next/link"
import { MeshGradient } from "./mesh-gradient"
import { TypewriterText } from "./typewriter-text"

export function HeroSection({ primaryHref = "/contact" }: { primaryHref?: string }) {
    return (
        <section className="min-h-screen relative flex items-center justify-center overflow-hidden pt-16 md:pt-24">
            {/* Lightweight CSS-only animated background */}
            <div className="absolute inset-0">
                <MeshGradient />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.08] pointer-events-none" />

                {/* Fade Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90 pointer-events-none" />
            </div>

            {/* Hero content */}
            <div className="relative z-10 text-center px-4 animate-fade-in-up">
                <div>
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent theme-gradient-text mb-6 theme-transition leading-tight flex items-center justify-center">
                        <TypewriterText
                            texts={[
                                "Custom Software That Solves Real Business Problems",
                                "Build Scalable Solutions That Drive Growth",
                                "Transform Ideas Into Production-Ready Apps",
                            ]}
                            typingSpeed={80}
                            deletingSpeed={40}
                            pauseDuration={3000}
                        />
                    </h1>
                    <p className="text-xl md:text-2xl theme-text mb-12 max-w-3xl mx-auto theme-transition opacity-70">
                        We help companies automate operations, launch products, and scale with confidence.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
                        <Link
                            href={primaryHref}
                            className="inline-flex items-center justify-center bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                        >
                            Discuss Your Project
                        </Link>
                        <Link
                            href="/case-studies"
                            className="inline-flex items-center justify-center border-2 border-primary bg-transparent text-primary w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl hover:bg-primary/5 active:scale-95 transition-all duration-200"
                        >
                            View Case Studies
                        </Link>
                    </div>

                    {/* Mobile Scroll Indicator */}
                    <div className="mt-6 md:hidden animate-float">
                        <span className="theme-text text-xs theme-transition opacity-60">Scroll to explore</span>
                    </div>
                </div>
            </div>

            {/* Desktop Scroll Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:block animate-float">
                <span className="theme-text text-sm theme-transition opacity-70">Scroll to explore</span>
            </div>
        </section>
    )
}
