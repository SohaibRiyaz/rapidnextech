import { NextResponse, type NextRequest } from "next/server"

/** Countries that see the homepage strip pointing to /clinics. */
const GEO_BANNER_COUNTRIES = new Set(["AE", "QA", "SA", "KW", "BH", "OM", "EG"])
/** Read by components/geo-banner.tsx (same name there). Holds only a 2-letter country code. */
const GEO_COOKIE = "rnt_geo"

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const { pathname } = req.nextUrl

  // Homepage: tell the page (which stays static) whether to show the Gulf/Egypt strip.
  // Vercel sets x-vercel-ip-country; without it (local dev, other hosts) nothing is shown.
  if (pathname === "/") {
    const country = (req.headers.get("x-vercel-ip-country") || "").toUpperCase()
    if (GEO_BANNER_COUNTRIES.has(country)) {
      if (req.cookies.get(GEO_COOKIE)?.value !== country) {
        res.cookies.set(GEO_COOKIE, country, { path: "/", maxAge: 60 * 60 * 24, sameSite: "lax", secure: true })
      }
    } else if (req.cookies.has(GEO_COOKIE)) {
      res.cookies.delete(GEO_COOKIE)
    }
    return res
  }

  // Personalised outreach links (/software/industries/<slug>?for=<Company>) must never be indexed.
  // The pages are static, so the noindex is sent as a header; the canonical already points to the
  // clean URL.
  if (req.nextUrl.searchParams.has("for")) {
    res.headers.set("X-Robots-Tag", "noindex, follow")
  }
  return res
}

export const config = {
  matcher: ["/", "/software/industries/:path*"],
}
