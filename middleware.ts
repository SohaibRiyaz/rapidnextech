import { NextResponse, type NextRequest } from "next/server"

/**
 * Personalised outreach links (/software/industries/<slug>?for=<Company>) must never be indexed.
 * The pages are static, so the noindex is sent as a header; the canonical already points to the
 * clean URL. Scoped by `matcher` to the industry pages only: no other route runs this.
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  if (req.nextUrl.searchParams.has("for")) {
    res.headers.set("X-Robots-Tag", "noindex, follow")
  }
  return res
}

export const config = {
  matcher: ["/software/industries/:path*"],
}
