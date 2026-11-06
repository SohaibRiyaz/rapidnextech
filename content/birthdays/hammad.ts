import type { BirthdayContent } from "./types"

const base = "/birthday/hammad"

const hero = {
  src: `${base}/hero.webp`,
  alt: "Hammad in a black pinstripe suit at an event",
  width: 900,
  height: 1125,
  objectPosition: "50% 22%",
}

export const hammad: BirthdayContent = {
  slug: "hammad",
  displayName: "Hammad Bin Ashiq",
  nicknames: ["Hammad Ali", "Hammad Alee", "Hammad Bhatti", "Hammad Bin Ashiq"],
  age: 24,
  showAge: true,
  unlockAt: "2026-11-07T00:00:00+05:00",
  fromLine: "Sohaib & the OG squad",
  myWhatsApp: "923254848523",
  treatItems: [
    "Birthday biryani × whole OG squad",
    "Cold drinks (unlimited)",
    "Dessert (non-negotiable)",
    "Late fee: 24 years of pending treats",
  ],
  squadWishes: [],
  media: {
    hero,
    now: hero,
    then: {
      src: `${base}/then.webp`,
      alt: "Hammad in a teal checked shirt on a red motorbike",
      width: 900,
      height: 900,
      objectPosition: "55% 20%",
    },
    graduate: {
      src: `${base}/graduate.webp`,
      alt: "Hammad holding his degree in front of Hailey College of Commerce",
      width: 800,
      height: 1067,
      objectPosition: "50% 55%",
      caption: "Hailey College of Commerce",
    },
    gallery: [
      {
        src: `${base}/gallery-sunglasses.webp`,
        alt: "Hammad in sunglasses and a grey shalwar kameez",
        width: 700,
        height: 700,
        objectPosition: "45% 30%",
        caption: "Shades on, worries off 😎",
      },
      {
        src: `${base}/gallery-garden.webp`,
        alt: "Hammad in a brown kurta sitting on a garden chair",
        width: 700,
        height: 933,
        objectPosition: "55% 35%",
        caption: "Garden chair CEO 🌿",
      },
    ],
    squad: [
      {
        src: `${base}/squad-pink-tent.webp`,
        alt: "Five friends in front of a pink tent; Hammad is second from left in a black waistcoat",
        width: 1200,
        height: 1185,
        crown: { x: 34, y: 26 },
      },
      {
        src: `${base}/squad-night-event.webp`,
        alt: "Five friends at a night event under purple and white drapes; Hammad is on the far right in a black kurta",
        width: 1200,
        height: 900,
        crown: { x: 88, y: 24 },
      },
      {
        src: `${base}/squad-flowers.webp`,
        alt: "Two friends in front of pink bougainvillea; Hammad is on the right in a black waistcoat",
        width: 900,
        height: 1200,
        crown: { x: 70, y: 14 },
      },
    ],
    videos: [
      {
        src: `${base}/throwback-car.mp4`,
        poster: `${base}/throwback-car-poster.webp`,
        title: "Throwback: the car surprise",
        width: 576,
        height: 1024,
      },
      {
        src: `${base}/new-crew.mp4`,
        poster: `${base}/new-crew-poster.webp`,
        title: "The new crew 😄",
        width: 576,
        height: 1024,
        size: "small",
      },
    ],
  },
  share: {
    title: "Happy Birthday, Hammad 🎉",
    description: "Someone's calling… pick up 📞",
    ogHeadline: "Happy 24th Birthday, Hammad",
  },
}
