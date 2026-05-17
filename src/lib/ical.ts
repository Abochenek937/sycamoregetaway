// Minimal iCal parser tailored to Airbnb's calendar export format.
// Each booking is a VEVENT with DTSTART;VALUE=DATE and DTEND;VALUE=DATE (exclusive).

export type Booking = {
  start: string;   // YYYY-MM-DD inclusive
  end: string;     // YYYY-MM-DD exclusive (iCal convention)
  summary: string; // "Reserved" or "Airbnb (Not available)"
};

export type RoomAvailability = {
  slug: string;
  bookings: Booking[];
  fetchedAt: string;
  source: 'live' | 'fallback';
};

function pad(n: number) { return String(n).padStart(2, '0'); }

function ymdFromIcal(raw: string): string {
  // "20260515" -> "2026-05-15"
  return `${raw.slice(0,4)}-${raw.slice(4,6)}-${raw.slice(6,8)}`;
}

export function parseIcal(text: string): Booking[] {
  const bookings: Booking[] = [];
  const blocks = text.split('BEGIN:VEVENT').slice(1);
  for (const blk of blocks) {
    const body = blk.split('END:VEVENT')[0];
    const start = body.match(/DTSTART(?:;VALUE=DATE)?:(\d{8})/)?.[1];
    const end = body.match(/DTEND(?:;VALUE=DATE)?:(\d{8})/)?.[1];
    const summary = (body.match(/SUMMARY:(.+)/)?.[1] || '').trim();
    if (start && end) {
      bookings.push({
        start: ymdFromIcal(start),
        end: ymdFromIcal(end),
        summary,
      });
    }
  }
  return bookings;
}

export function isDateBlocked(ymd: string, bookings: Booking[]): boolean {
  // DTEND in iCal is exclusive — a booking 06-01 -> 06-05 occupies 06-01..06-04.
  for (const b of bookings) {
    if (ymd >= b.start && ymd < b.end) return true;
  }
  return false;
}

export function* iterDates(startYmd: string, endYmd: string) {
  const d = new Date(startYmd + 'T00:00:00Z');
  const end = new Date(endYmd + 'T00:00:00Z');
  while (d <= end) {
    const y = d.getUTCFullYear();
    const m = pad(d.getUTCMonth() + 1);
    const da = pad(d.getUTCDate());
    yield `${y}-${m}-${da}`;
    d.setUTCDate(d.getUTCDate() + 1);
  }
}

export function todayYmd(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`;
}

export function addMonthsYmd(ymd: string, months: number): string {
  const d = new Date(ymd + 'T00:00:00Z');
  d.setUTCMonth(d.getUTCMonth() + months);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`;
}
