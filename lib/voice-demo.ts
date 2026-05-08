export const TRUSTED_VOICE_DEMO_ORIGIN = "https://try.rapidnextech.com"

export const VOICE_DEMO_PERSONA_BY_PAGE = {
  dental: "dental",
  medspa: "medspa",
} as const

export type VoiceDemoPageKey = keyof typeof VOICE_DEMO_PERSONA_BY_PAGE

export function getVoiceDemoEmbedUrl(pageKey: VoiceDemoPageKey) {
  const url = new URL("/embed", TRUSTED_VOICE_DEMO_ORIGIN)
  url.searchParams.set("persona", VOICE_DEMO_PERSONA_BY_PAGE[pageKey])
  return url.toString()
}
