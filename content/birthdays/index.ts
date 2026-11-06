import { hammad } from "./hammad"
import type { BirthdayContent } from "./types"

export type { BirthdayContent } from "./types"

/** Every birthday page. Add a content file and register it here. */
export const birthdays: BirthdayContent[] = [hammad]

export function getBirthday(slug: string) {
  return birthdays.find((b) => b.slug === slug)
}
