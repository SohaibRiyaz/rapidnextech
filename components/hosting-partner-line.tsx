import Image from "next/image"
import { siteConfig } from "@/lib/site-config"

/** Small, muted "Hosting partner" credit for the footers. Hidden when the config flag is off. */
export function HostingPartnerLine({ className = "" }: { className?: string }) {
  const partner = siteConfig.hostingPartner
  if (!partner.enabled) return null

  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-[32px] items-center gap-2 text-xs theme-text opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded ${className}`}
    >
      {/* The logo has a white background, so it sits on a white tile to stay legible in dark mode. */}
      <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded bg-white">
        <Image src={partner.logo} alt="" width={24} height={24} className="h-6 w-6 object-contain" />
      </span>
      <span>
        Hosting partner: {partner.name}
        <span className="sr-only"> (opens in a new tab)</span>
      </span>
    </a>
  )
}
