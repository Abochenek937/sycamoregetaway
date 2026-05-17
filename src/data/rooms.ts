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
// Photos are organized by category (not by room) after the 2026-05-17 reorganization.
// Each room's `photos` array combines its bedroom shots + relevant property shots.
// First photo in each room's array is the HERO (room card + top of room page).

const PROPERTY_PHOTOS = {
  master:        ['/photos/master/01.jpeg','/photos/master/02.png','/photos/master/03.jpeg','/photos/master/04.jpeg','/photos/master/05.jpeg','/photos/master/06.jpeg','/photos/master/07.jpeg','/photos/master/08.jpeg','/photos/master/09.jpeg'],
  kitchenLiving: ['/photos/kitchen-living/01.jpeg','/photos/kitchen-living/02.jpeg','/photos/kitchen-living/04.jpeg','/photos/kitchen-living/05.jpeg','/photos/kitchen-living/06.jpeg','/photos/kitchen-living/07.jpeg','/photos/kitchen-living/08.jpeg','/photos/kitchen-living/09.jpeg','/photos/kitchen-living/10.jpeg','/photos/kitchen-living/11.jpeg','/photos/kitchen-living/12.jpeg','/photos/kitchen-living/13.jpeg','/photos/kitchen-living/14.jpeg'],
  pool:          ['/photos/back-porch-pool/01.jpeg','/photos/back-porch-pool/02.jpeg','/photos/back-porch-pool/03.jpeg','/photos/back-porch-pool/04.jpeg'],
  courtyard:     ['/photos/courtyard/01.jpeg'],
  sandy:         ['/photos/sandy/01.jpeg'],
  front:         ['/photos/front-of-house/01.jpeg','/photos/front-of-house/02.jpg'],
  bathroom:      ['/photos/bathroom/01.jpeg','/photos/bathroom/02.jpeg'],
};

const BEDROOMS = {
  buckeye: ['/photos/buckeye-bedroom/01.jpeg','/photos/buckeye-bedroom/02.jpeg','/photos/buckeye-bedroom/03.jpeg'],
  oak:     ['/photos/oak-bedroom/01.jpeg','/photos/oak-bedroom/02.jpeg','/photos/oak-bedroom/03.jpeg'],
  maple:   ['/photos/maple-bedroom/01.jpeg','/photos/maple-bedroom/02.jpeg','/photos/maple-bedroom/03.jpeg','/photos/maple-bedroom/04.jpeg'],
  willow:  ['/photos/willow-bedroom/01.jpg'], // closet shot — only Willow photo we have so far
};

// Compose each room's photo list: bedroom first (hero), then property scenes the guest can enjoy.
const PHOTOS: Record<string, string[]> = {
  // Sycamore hero: master/04.jpeg (Alex pick). Then the rest of the master + kitchen + bath.
  sycamore: ['/photos/master/04.jpeg', ...PROPERTY_PHOTOS.master.filter(p => p !== '/photos/master/04.jpeg'), ...PROPERTY_PHOTOS.kitchenLiving.slice(0, 3), ...PROPERTY_PHOTOS.bathroom],
  buckeye:  [...BEDROOMS.buckeye, ...PROPERTY_PHOTOS.kitchenLiving.slice(0, 3), ...PROPERTY_PHOTOS.pool.slice(0, 2), ...PROPERTY_PHOTOS.bathroom],
  oak:      [...BEDROOMS.oak,     ...PROPERTY_PHOTOS.kitchenLiving.slice(0, 3), ...PROPERTY_PHOTOS.pool.slice(0, 2), ...PROPERTY_PHOTOS.bathroom],
  maple:    [...BEDROOMS.maple,   ...PROPERTY_PHOTOS.kitchenLiving.slice(0, 3), ...PROPERTY_PHOTOS.pool.slice(0, 2), ...PROPERTY_PHOTOS.bathroom],
  // Willow now has 1 closet shot. Lead with that, then property amenities.
  willow:   [...BEDROOMS.willow, ...PROPERTY_PHOTOS.kitchenLiving.slice(0, 3), ...PROPERTY_PHOTOS.pool.slice(0, 2), ...PROPERTY_PHOTOS.bathroom],
};

export { PROPERTY_PHOTOS };

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
