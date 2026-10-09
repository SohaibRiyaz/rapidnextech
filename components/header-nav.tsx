"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { serviceCategories, servicesData } from "@/lib/services-data"

const topLinkClass = cn(
    navigationMenuTriggerStyle(),
    "bg-transparent px-3 text-foreground hover:bg-primary/10 hover:text-primary data-[active]:text-primary",
)

function TopLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <NavigationMenuItem>
            <Link href={href} legacyBehavior passHref>
                <NavigationMenuLink className={topLinkClass}>{children}</NavigationMenuLink>
            </Link>
        </NavigationMenuItem>
    )
}

export function HeaderNav() {
    return (
        <NavigationMenu>
            <NavigationMenuList className="gap-1">
                <TopLink href="/">AI Receptionist for Dentists</TopLink>
                <TopLink href="/#pricing">Pricing</TopLink>

                {/* Mega Menu: custom software services (former "What We Do") */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent px-3 text-foreground hover:bg-primary/10 hover:text-primary data-[active]:text-primary data-[state=open]:text-primary">
                        Software
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="w-[calc(100vw-6rem)] max-w-3xl p-5 bg-background/95 backdrop-blur-xl rounded-xl border border-border shadow-2xl">
                            <div className="grid grid-cols-3 gap-6">
                                {serviceCategories.map((category) => (
                                    <div key={category.title} className="space-y-2.5">
                                        <div className="border-b border-border/50 pb-2.5">
                                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-primary">
                                                {category.title}
                                            </h4>
                                        </div>
                                        <ul className="space-y-0.5">
                                            {category.services.map((slug) => {
                                                const service = servicesData[slug as keyof typeof servicesData]
                                                return (
                                                    <li key={slug}>
                                                        <Link href={`/services/${slug}`} legacyBehavior passHref>
                                                            <NavigationMenuLink asChild>
                                                                <a className="group flex items-center gap-2 rounded-md px-1.5 py-1.5 leading-none no-underline outline-none transition-colors hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring">
                                                                    <service.icon className="w-3.5 h-3.5 text-primary/70 group-hover:text-primary transition-colors shrink-0" />
                                                                    <span className="text-[13px] font-medium text-foreground group-hover:text-primary transition-colors whitespace-nowrap">{service.title}</span>
                                                                </a>
                                                            </NavigationMenuLink>
                                                        </Link>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap items-center gap-x-6 gap-y-2">
                                {[
                                    { href: "/software", label: "Custom software overview" },
                                    { href: "/services", label: "All services" },
                                    { href: "/case-studies", label: "Case studies" },
                                ].map((link) => (
                                    <Link key={link.href} href={link.href} legacyBehavior passHref>
                                        <NavigationMenuLink asChild>
                                            <a className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-ring rounded">
                                                {link.label} <ArrowRight className="w-3 h-3" />
                                            </a>
                                        </NavigationMenuLink>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <TopLink href="/about">About</TopLink>
                <TopLink href="/blog">Blog</TopLink>
            </NavigationMenuList>
        </NavigationMenu>
    )
}
