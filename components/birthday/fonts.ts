import { Anton, Caveat } from "next/font/google"

/** Display font for the huge gold titles. */
export const displayFont = Anton({ subsets: ["latin"], weight: "400", display: "swap", variable: "--bd-display" })

/** Handwritten captions. */
export const handFont = Caveat({ subsets: ["latin"], weight: ["500", "700"], display: "swap", variable: "--bd-hand" })
