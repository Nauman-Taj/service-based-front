/**
 * Frontend booking store.
 *
 * The mock bookings in `data/bookings.ts` stay the source of truth for demo
 * data. Requests created from the public site are stored in localStorage and
 * merged in here; status changes are kept as overrides so a reload cannot
 * mutate the static mock file.
 */

import { bookings as mockBookings } from "@/data/bookings";
import { getServiceById } from "@/data/services";
import {
  makeId,
  makeReference,
  PORTAL_KEYS,
  readStore,
  subscribeToStore,
  writeStore,
} from "@/lib/portal-store";
import type { Booking, BookingStatus } from "@/types/booking";

const LEGACY_REQUESTS_KEY = "quicker:service-requests";

interface LegacyRequest {
  reference?: string;
  serviceId?: string;
  serviceTitle?: string;
  providerName?: string;
  price?: number;
  name?: string;
  phone?: string;
  date?: string;
  time?: string;
  address?: string;
  notes?: string;
  createdAt?: string;
}

export interface CreateBookingInput {
  serviceId: string;
  customerId: string;
  customerName: string;
  date: string;
  timeSlot: string;
  address: string;
  notes?: string;
}

function sortByRecency(items: Booking[]): Booking[] {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function legacyToBooking(request: LegacyRequest, index: number): Booking | null {
  if (!request.serviceId || !request.date) {
    return null;
  }
  const service = getServiceById(request.serviceId);
  if (!service) {
    return null;
  }

  return {
    id: `legacy-${request.reference ?? index}`,
    reference: request.reference ?? makeReference(),
    serviceId: service.id,
    serviceName: request.serviceTitle ?? service.title,
    serviceImage: service.image,
    customerId: "guest",
    customerName: request.name ?? "Guest customer",
    providerId: service.providerId,
    providerName: request.providerName ?? service.providerName,
    date: request.date,
    timeSlot: request.time ?? "Flexible",
    address: request.address ?? "Address to be confirmed",
    status: "pending",
    price: request.price ?? service.price,
    createdAt: request.createdAt ?? new Date().toISOString(),
    notes: request.notes,
  };
}

/** All bookings: static demo records, stored requests and status overrides. */
export function getAllBookings(): Booking[] {
  if (typeof window === "undefined") {
    return sortByRecency(mockBookings);
  }

  const custom = readStore<Booking[]>(PORTAL_KEYS.bookings, []);
  const legacy = readStore<LegacyRequest[]>(LEGACY_REQUESTS_KEY, []);
  const statusOverrides = readStore<Record<string, BookingStatus>>(
    PORTAL_KEYS.bookingStatuses,
    {},
  );
  const legacyBookings = Array.isArray(legacy)
    ? legacy
        .map((request, index) => legacyToBooking(request, index))
        .filter((booking): booking is Booking => booking !== null)
    : [];

  const ids = new Set<string>();
  const merged = [...mockBookings, ...(Array.isArray(custom) ? custom : []), ...legacyBookings]
    .filter((booking) => {
      if (ids.has(booking.id)) {
        return false;
      }
      ids.add(booking.id);
      return true;
    })
    .map((booking) =>
      statusOverrides[booking.id]
        ? { ...booking, status: statusOverrides[booking.id] }
        : booking,
    );

  return sortByRecency(merged);
}

export function getBookingById(id: string): Booking | undefined {
  return getAllBookings().find((booking) => booking.id === id);
}

export function getBookingsByCustomerId(customerId: string): Booking[] {
  return getAllBookings().filter((booking) => booking.customerId === customerId);
}

export function getBookingsByProviderId(providerId: string): Booking[] {
  return getAllBookings().filter((booking) => booking.providerId === providerId);
}

export function createBooking(input: CreateBookingInput): Booking {
  const service = getServiceById(input.serviceId);
  const stored = readStore<Booking[]>(PORTAL_KEYS.bookings, []);
  const booking: Booking = {
    id: makeId("bk"),
    reference: makeReference(),
    serviceId: input.serviceId,
    serviceName: service?.title ?? "Service request",
    serviceImage: service?.image ?? "/images/services/deep-home-cleaning.jpg",
    customerId: input.customerId,
    customerName: input.customerName,
    providerId: service?.providerId ?? "",
    providerName: service?.providerName ?? "Quicker partner",
    date: input.date,
    timeSlot: input.timeSlot,
    address: input.address,
    status: "pending",
    price: service?.price ?? 0,
    createdAt: new Date().toISOString(),
    notes: input.notes,
  };

  writeStore(PORTAL_KEYS.bookings, [...(Array.isArray(stored) ? stored : []), booking]);
  return booking;
}

export function updateBookingStatus(id: string, status: BookingStatus): void {
  const overrides = readStore<Record<string, BookingStatus>>(
    PORTAL_KEYS.bookingStatuses,
    {},
  );
  writeStore(PORTAL_KEYS.bookingStatuses, { ...overrides, [id]: status });
}

export function subscribeToBookings(listener: () => void): () => void {
  const unsubscribeBookings = subscribeToStore(PORTAL_KEYS.bookings, listener);
  const unsubscribeStatuses = subscribeToStore(
    PORTAL_KEYS.bookingStatuses,
    listener,
  );
  const unsubscribeLegacy = subscribeToStore(LEGACY_REQUESTS_KEY, listener);
  return () => {
    unsubscribeBookings();
    unsubscribeStatuses();
    unsubscribeLegacy();
  };
}
