// Build-time loader: fetches all 5 iCal feeds and returns parsed availability.
// Called from .astro pages during `astro build`. Falls back to "live" empty data
// if a feed errors so the build doesn't break.

import { parseIcal, type RoomAvailability } from './ical';

const FEEDS: Record<string, string | undefined> = {
  sycamore: process.env.ICAL_SYCAMORE,
  buckeye:  process.env.ICAL_BUCKEYE,
  oak:      process.env.ICAL_OAK,
  maple:    process.env.ICAL_MAPLE,
  willow:   process.env.ICAL_WILLOW,
};

async function fetchOne(slug: string, url: string | undefined): Promise<RoomAvailability> {
  const now = new Date().toISOString();
  if (!url) {
    return { slug, bookings: [], fetchedAt: now, source: 'fallback' };
  }
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'sycamoregetaway-build/1.0' } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const text = await r.text();
    return { slug, bookings: parseIcal(text), fetchedAt: now, source: 'live' };
  } catch (e) {
    console.warn(`[availability] ${slug}: ${(e as Error).message} — using fallback`);
    return { slug, bookings: [], fetchedAt: now, source: 'fallback' };
  }
}

let cache: RoomAvailability[] | null = null;
let cacheKey = '';

export async function getAvailability(): Promise<RoomAvailability[]> {
  const key = Object.values(FEEDS).join('|');
  if (cache && cacheKey === key) return cache;
  const entries = await Promise.all(
    Object.entries(FEEDS).map(([slug, url]) => fetchOne(slug, url))
  );
  cache = entries;
  cacheKey = key;
  return entries;
}
