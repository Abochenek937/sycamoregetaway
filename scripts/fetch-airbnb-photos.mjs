// Downloads photos from each Airbnb listing and saves them organized by room slug.
// Photos are owned by Alex (the host) — these are his uploads.
// Strategy:
//   1. Fetch each listing page HTML.
//   2. Extract all muscache.com image URLs.
//   3. Filter to photos that belong to that listing's host bucket
//      (URLs containing the listing ID or matching a hero ID pattern).
//   4. Download up to N per room, save as /public/photos/<slug>/01.jpg etc.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public', 'photos');

const ROOMS = [
  { slug: 'sycamore', url: 'https://www.airbnb.com/rooms/1111428921897172515', id: '1111428921897172515' },
  { slug: 'buckeye',  url: 'https://www.airbnb.com/rooms/1111425818356469330', id: '1111425818356469330' },
  { slug: 'oak',      url: 'https://www.airbnb.com/rooms/759999645287941690',  id: '759999645287941690'  },
  { slug: 'willow',   url: 'https://www.airbnb.com/rooms/560037966152727439',  id: '560037966152727439'  },
  { slug: 'maple',    url: 'https://www.airbnb.com/rooms/1181878712778722851', id: '1181878712778722851' },
];

const MAX_PER_ROOM = 12; // most-relevant images per room
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function scoreImage(url, listingId) {
  // Higher score = more relevant to this listing.
  if (url.includes('AirbnbPlatformAssets')) return -100; // platform UI icons
  if (url.includes('favicons')) return -100;
  if (url.includes(`Hosting-${listingId}`)) return 100;  // exact match for this room
  // Base64-encoded listing ID variants
  const b64 = Buffer.from(`StaySupplyListing:${listingId}`).toString('base64').replace(/=+$/, '');
  if (url.includes(b64.slice(0, 20))) return 95;
  // Property-wide hero (one specific bucket appears in all listings)
  if (url.includes('Hosting-560037966152727439')) return 50; // shared property photos
  // Generic listing IDs other than this one — lower priority
  if (/Hosting-\d+/.test(url)) return 10;
  return 5;
}

function cleanUrl(url) {
  // Strip query strings, get original-resolution image
  return url.split('?')[0];
}

async function fetchListingImages(room) {
  console.log(`\n=== ${room.slug} (listing ${room.id}) ===`);
  const r = await fetch(room.url, { headers: { 'User-Agent': UA } });
  const html = await r.text();
  const re = /https:\/\/a0\.muscache\.com\/im\/pictures\/[^"\\\s]+\.(?:jpg|jpeg|png|webp)/gi;
  const raw = [...html.matchAll(re)].map(m => m[0]);
  const unique = [...new Set(raw.map(cleanUrl))];
  const scored = unique
    .map(u => ({ url: u, score: scoreImage(u, room.id) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_PER_ROOM);
  console.log(`  found ${unique.length} unique images, keeping top ${scored.length}`);
  return scored.map(x => x.url);
}

async function downloadImage(url, dest) {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  const buf = Buffer.from(await r.arrayBuffer());
  await fs.writeFile(dest, buf);
  return buf.length;
}

async function main() {
  await fs.mkdir(publicDir, { recursive: true });
  const manifest = {};
  for (const room of ROOMS) {
    const urls = await fetchListingImages(room);
    const roomDir = path.join(publicDir, room.slug);
    await fs.mkdir(roomDir, { recursive: true });
    const saved = [];
    for (let i = 0; i < urls.length; i++) {
      const ext = urls[i].split('.').pop().split('?')[0] || 'jpg';
      const fname = String(i + 1).padStart(2, '0') + '.' + ext;
      const fp = path.join(roomDir, fname);
      try {
        const bytes = await downloadImage(urls[i], fp);
        saved.push({ file: `/photos/${room.slug}/${fname}`, bytes });
        process.stdout.write('.');
      } catch (e) {
        process.stdout.write('x');
      }
    }
    console.log(`  saved ${saved.length} files to public/photos/${room.slug}/`);
    manifest[room.slug] = saved;
  }
  await fs.writeFile(path.join(publicDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('\nManifest written to public/photos/manifest.json');
}

main().catch(e => { console.error(e); process.exit(1); });
