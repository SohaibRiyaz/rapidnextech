/**
 * Content model for one-off birthday pages at /birthday/[slug].
 * One file per person in content/birthdays/<slug>.ts, registered in ./index.ts.
 */

export type BirthdayImage = {
  src: string
  alt: string
  width: number
  height: number
  /** CSS object-position used when the photo is cropped, e.g. "50% 25%" to keep the face in frame. */
  objectPosition?: string
  /** Handwritten caption (gallery polaroids). */
  caption?: string
}

export type SquadPhoto = BirthdayImage & {
  /** Where the 👑 sits, as % of the image. The crown's base is anchored at this point (top of the head). */
  crown: { x: number; y: number }
}

export type BirthdayVideo = {
  src: string
  poster: string
  title: string
  width: number
  height: number
  /** "small" renders a narrower card. */
  size?: "regular" | "small"
}

export type SquadWish = { name: string; message: string }

export type BirthdayContent = {
  slug: string
  displayName: string
  /** Rotating ticker under the name. */
  nicknames: string[]
  age: number
  showAge: boolean
  /** ISO timestamp with offset. Before this the page shows a countdown (unless ?preview=1). */
  unlockAt: string
  fromLine: string
  /** International format without "+", used for wa.me links. */
  myWhatsApp: string
  treatItems: string[]
  squadWishes: SquadWish[]
  media: {
    hero: BirthdayImage
    then: BirthdayImage
    now: BirthdayImage
    graduate: BirthdayImage
    gallery: BirthdayImage[]
    squad: SquadPhoto[]
    /** In display order: the first is the throwback memory, the last is the "new crew" card. */
    videos: BirthdayVideo[]
  }
  share: { title: string; description: string; ogHeadline: string }
}
