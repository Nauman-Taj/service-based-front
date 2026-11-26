/**
 * Local cache for bookings created in this browser.
 *
 * Bookings themselves live in the NestJS API. Guests cannot list their
 * bookings (there is no authenticated account), so the booking returned by
 * `POST /bookings` is cached here to power the public tracking pages. Signed-in
 * dashboards merge this cache with the API list, which keeps a just-created
 * booking visible even before the next list request completes.
 */

import { readStore, subscribeToStore, writeStore } from "@/lib/portal-store";
import type { Booking, BookingStatus } from "@/types/booking";

const BOOKING_CACHE_KEY = "quicker:api-bookings";

function sortByRecency(items: Booking[]): Booking[] {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function readCachedBookings(): Booking[] {
  const cached = readStore<Booking[]>(BOOKING_CACHE_KEY, []);
  return Array.isArray(cached) ? sortByRecency(cached) : [];
}

export function cacheBooking(booking: Booking): void {
  const current = readCachedBookings();
  const next = [
    booking,
    ...current.filter((item) => item.id !== booking.id),
  ];
  writeStore(BOOKING_CACHE_KEY, next);
}

export function cacheBookingStatus(id: string, status: BookingStatus): void {
  const current = readCachedBookings();
  if (!current.some((booking) => booking.id === id)) {
    return;
  }
  writeStore(
    BOOKING_CACHE_KEY,
    current.map((booking) =>
      booking.id === id ? { ...booking, status } : booking,
    ),
  );
}

/** API records win; cached guest bookings fill any gaps. */
export function mergeBookings(remote: Booking[], cached: Booking[]): Booking[] {
  const merged = new Map(remote.map((booking) => [booking.id, booking]));
  for (const booking of cached) {
    if (!merged.has(booking.id)) {
      merged.set(booking.id, booking);
    }
  }
  return sortByRecency(Array.from(merged.values()));
}

export function subscribeToBookingCache(listener: () => void): () => void {
  return subscribeToStore(BOOKING_CACHE_KEY, listener);
}
