export type Room = {
  slug: string;
  name: string;          // e.g. "The Sycamore Suite"
  tree: string;          // e.g. "Sycamore"
  roomNumber: number;    // physical door number in the house
  bathType: 'private' | 'shared'; // for the calendar legend
  bed: string;           // e.g. "King bed"
  bath: string;          // e.g. "Private bath + walk-in closet"
  perks: string[];       // bullet highlights
  blurb: string;         // short paragraph
  airbnbUrl: string;     // public Airbnb listing URL
  nightly: number;       // listed nightly rate on Airbnb (USD, before guest service fee)
  photos: string[];      // /photos/<slug>/NN.jpeg paths (first is hero)
  featured?: boolean;    // surfaces the master on the homepage
};

// Photo file lists pulled from Airbnb listings. Filenames track what fetch-airbnb-photos.mjs produced.
const PHOTOS: Record<string, string[]> = {
  sycamore: ['/photos/sycamore/01.jpeg','/photos/sycamore/02.jpeg','/photos/sycamore/03.png','/photos/sycamore/04.jpeg','/photos/sycamore/05.jpeg','/photos/sycamore/06.jpeg','/photos/sycamore/07.jpeg','/photos/sycamore/08.jpeg','/photos/sycamore/09.jpeg','/photos/sycamore/10.jpeg','/photos/sycamore/11.jpeg','/photos/sycamore/12.jpeg'],
  buckeye:  ['/photos/buckeye/01.jpeg','/photos/buckeye/02.jpeg','/photos/buckeye/03.jpeg','/photos/buckeye/04.jpeg','/photos/buckeye/05.jpeg','/photos/buckeye/06.jpeg','/photos/buckeye/07.jpeg','/photos/buckeye/08.jpeg','/photos/buckeye/09.jpeg','/photos/buckeye/10.jpeg','/photos/buckeye/11.jpeg','/photos/buckeye/12.jpeg'],
  oak:      ['/photos/oak/01.jpeg','/photos/oak/02.jpeg','/photos/oak/03.jpeg','/photos/oak/04.jpeg','/photos/oak/05.jpeg','/photos/oak/06.jpeg','/photos/oak/07.jpg','/photos/oak/08.jpeg','/photos/oak/09.jpeg','/photos/oak/10.jpeg','/photos/oak/11.jpeg','/photos/oak/12.jpeg'],
  maple:    ['/photos/maple/01.jpeg','/photos/maple/02.jpeg','/photos/maple/03.jpeg','/photos/maple/04.jpeg','/photos/maple/05.jpeg','/photos/maple/06.jpeg','/photos/maple/07.jpeg','/photos/maple/08.jpeg','/photos/maple/09.jpeg','/photos/maple/10.jpeg','/photos/maple/11.jpeg','/photos/maple/12.jpeg'],
  willow:   ['/photos/willow/01.jpeg','/photos/willow/02.jpeg','/photos/willow/03.jpeg','/photos/willow/04.jpeg','/photos/willow/05.jpeg','/photos/willow/06.jpeg','/photos/willow/07.jpeg','/photos/willow/08.jpeg','/photos/willow/09.jpeg','/photos/willow/10.jpeg','/photos/willow/11.jpeg','/photos/willow/12.jpeg'],
};

export const ROOMS: Room[] = [
  {
    slug: "sycamore",
    name: "The Sycamore Suite",
    tree: "Sycamore",
    bed: "King bed",
    bath: "Private bathroom · walk-in closet · office desk",
    perks: ["Private en-suite", "Walk-in closet", "Work desk", "Smart TV", "Largest room"],
    blurb:
      "The master of the house. King bed, your own bathroom, a walk-in closet, a work desk, and a smart TV. Quiet wing of the U-shape, looking out toward the sycamores.",
    airbnbUrl: "https://www.airbnb.com/rooms/1111428921897172515",
    nightly: 44,
    photos: PHOTOS.sycamore,
    roomNumber: 4,
    bathType: 'private',
    featured: true,
  },
  {
    slug: "buckeye",
    name: "The Buckeye Room",
    tree: "Buckeye",
    bed: "King bed",
    bath: "Shared bathrooms (two in the house)",
    perks: ["King bed", "Work desk", "Smart TV", "Shared bathrooms", "Ohio through and through"],
    blurb:
      "Named for the state tree. King bed, work desk, and a smart TV. Steps from one of the two shared bathrooms — a favorite for Ohio State fans and homesick Buckeyes passing through Dayton.",
    airbnbUrl: "https://www.airbnb.com/rooms/1111425818356469330",
    nightly: 35,
    photos: PHOTOS.buckeye,
    roomNumber: 2,
    bathType: 'shared',
  },
  {
    slug: "oak",
    name: "The Oak Room",
    tree: "Oak",
    bed: "King bed",
    bath: "Shared bathrooms (two in the house)",
    perks: ["King bed", "Work desk", "Smart TV", "Shared bathrooms", "Steps from the kitchen"],
    blurb:
      "Solid, simple, well-rested. King bed, work desk, and a smart TV. Short walk to the shared kitchen and the inner deck.",
    airbnbUrl: "https://www.airbnb.com/rooms/560037966152727439",
    nightly: 35,
    photos: PHOTOS.oak,
    roomNumber: 3,
    bathType: 'shared',
  },
  {
    slug: "maple",
    name: "The Maple Room",
    tree: "Maple",
    bed: "King bed",
    bath: "Shared bathrooms (two in the house)",
    perks: ["King bed", "Smart TV", "Shared bathrooms", "Bright morning light"],
    blurb:
      "King bed with morning light filtering through the trees and a smart TV for the evening wind-down. Shares the second common bathroom with the Willow room.",
    // Public URL confirmed working when we scraped photos.
    airbnbUrl: "https://www.airbnb.com/rooms/1181878712778722851",
    nightly: 35,
    photos: PHOTOS.maple,
    roomNumber: 5,
    bathType: 'shared',
  },
  {
    slug: "willow",
    name: "The Willow Room",
    tree: "Willow",
    bed: "Queen bed",
    bath: "Shared bathrooms (two in the house)",
    perks: ["Queen bed", "Work desk", "Smart TV", "Shared bathrooms", "Cozy footprint"],
    blurb:
      "The cozy one. Queen bed, work desk, and a smart TV. A solid solo or couple's room with a calm corner-of-the-house feel.",
    airbnbUrl: "https://www.airbnb.com/rooms/759999645287941690",
    nightly: 35,
    photos: PHOTOS.willow,
    roomNumber: 1,
    bathType: 'shared',
  },
];

export const PROPERTY = {
  name: "Sycamore Getaway",
  tagline: "A quiet, modern house in the Dayton woods.",
  // Address intentionally omitted from public site — Airbnb policy + safety.
  // Guests get the address from Airbnb after booking.
  neighborhood: "Next to Jefferson High School, southwest Dayton",
  city: "Dayton, Ohio",
  acres: 6,
  effectiveAcres: 61, // 6 + neighboring 55
  bedrooms: 5,
  bathrooms: 3, // 2 shared + 1 private (master)
  minimumStay: 22, // nights
  nightlyFrom: 35, // USD, headline "from" rate (cheapest room)
  nightlyMaster: 44, // USD, master suite rate
  contactEmail: "hello@sycamoregetaway.com", // set up via Cloudflare Email Routing later
};
