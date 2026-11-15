import { ImageResponse } from "next/og"

/**
 * Social / WhatsApp / LinkedIn preview for /clinics, 1200×630. A route handler on the edge runtime
 * (rather than opengraph-image.tsx) so it also renders on Windows dev machines. Text only: no photos,
 * no logos of other companies.
 */
export const runtime = "edge"

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0b1220 0%, #10213f 55%, #0e3b4a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, color: "#7dd3fc" }}>
          <div style={{ display: "flex", width: 14, height: 14, borderRadius: 7, background: "#25d366" }} />
          For clinics in the UAE, Qatar, Saudi Arabia &amp; Egypt
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1 }}>
            Never lose a patient enquiry on WhatsApp or the phone again
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#cbd5e1" }}>
            AI receptionist · WhatsApp + voice notes · AI calling · English &amp; Arabic · 24/7
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28 }}>
          <div style={{ display: "flex", fontWeight: 700 }}>RapidNexTech</div>
          <div style={{ display: "flex", color: "#7dd3fc" }}>7-day free pilot · no card · no contract</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" },
    },
  )
}
