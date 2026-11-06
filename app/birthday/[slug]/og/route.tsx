import { ImageResponse } from "next/og"
import { getBirthday } from "@/content/birthdays"

/**
 * WhatsApp / social preview image, 1200×630. A route handler on the edge runtime (rather than
 * opengraph-image.tsx) so it also renders on Windows dev machines; the photo is fetched from this
 * deployment's own public/ folder.
 */
export const runtime = "edge"

const size = { width: 1200, height: 630 }

/** Anton as TTF from Google Fonts (satori can't read woff2). Falls back to the default font. */
async function loadAnton(text: string) {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Anton&text=${encodeURIComponent(text)}`)).text()
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1]
    if (!url) return null
    return await (await fetch(url)).arrayBuffer()
  } catch {
    return null
  }
}

function toBase64(buf: ArrayBuffer) {
  let binary = ""
  const bytes = new Uint8Array(buf)
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(binary)
}

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const b = getBirthday(params.slug)
  if (!b) return new Response("Not found", { status: 404 })
  const first = b.displayName.split(" ")[0]
  let photoSrc: string | null = null
  try {
    const res = await fetch(new URL(`/birthday/${b.slug}/og-hero.jpg`, req.url))
    if (res.ok) photoSrc = `data:image/jpeg;base64,${toBase64(await res.arrayBuffer())}`
  } catch {
    /* render without the photo */
  }
  const line1 = b.showAge ? `HAPPY ${b.age}TH BIRTHDAY,` : "HAPPY BIRTHDAY,"
  const line2 = `${first.toUpperCase()}`
  const anton = await loadAnton(`${line1}${line2}SOMEONE'S CALLING… PICK UP`)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0b0626",
          color: "white",
          fontFamily: anton ? "Anton" : "sans-serif",
          position: "relative",
        }}
      >

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 470, height: "100%", paddingLeft: 56 }}>
          <div
            style={{
              display: "flex",
              width: 380,
              height: 475,
              borderRadius: 36,
              overflow: "hidden",
              border: "6px solid #ffd86b",
              boxShadow: "0 0 80px rgba(255,216,107,0.45)",
              transform: "rotate(-3deg)",
            }}
          >
            {photoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoSrc} width={380} height={475} style={{ objectFit: "cover", objectPosition: "50% 20%" }} alt="" />
            ) : (
              <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", fontSize: 160, background: "#1a0b3d" }}>🎂</div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, paddingRight: 60, paddingLeft: 20 }}>
          <div style={{ display: "flex", fontSize: 30, letterSpacing: 6, color: "#ff8ac6" }}>SOMEONE&apos;S CALLING… PICK UP 📞</div>
          <div style={{ display: "flex", fontSize: 76, lineHeight: 1, marginTop: 18, color: "#ffd86b" }}>{line1}</div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 140, lineHeight: 1, marginTop: 6, color: "#fff3c4" }}>
            {line2}
            <span style={{ fontSize: 110, marginLeft: 20 }}>🎂</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      emoji: "twemoji",
      fonts: anton ? [{ name: "Anton", data: anton, weight: 400, style: "normal" }] : [],
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
    },
  )
}
