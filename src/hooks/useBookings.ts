"use client";

/**
 * Bookings for the current tab.
 *
 * Signed-in customers, providers and admins read the NestJS API; guests read
 * only the bookings cached in this browser after a public request. Status
 * changes go through the API and are reflected immediately in every dashboard.
 */

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import {
  cacheBooking,
  cacheBookingStatus,
  mergeBookings,
  readCachedBookings,
  subscribeToBookingCache,
} from "@/lib/booking-store";
import {
  createCustomerBooking,
  createGuestBooking,
  fetchAllBookings,
  fetchMyBookings,
  updateBookingStatusRequest,
} from "@/lib/portal-api";
import type { Booking, BookingStatus } from "@/types/booking";

export interface CreateBookingInput {
  serviceId: string;
  customerId: string;
  customerName: string;
  date: string;
  timeSlot: string;
  address: string;
  notes?: string;
}

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

export function useBookings() {
  const { user, status, getAccessToken } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cachedBookings, setCachedBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (status === "loading") {
      return;
    }

    const cached = readCachedBookings();
    setCachedBookings(cached);

    if (!user) {
      setBookings(cached);
      setLoading(false);
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      setBookings(cached);
      setLoading(false);
      return;
    }

    try {
      const remote =
        user.role === "admin"
          ? await fetchAllBookings(token)
          : await fetchMyBookings(token);
      setBookings(mergeBookings(remote, cached));
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
      setBookings(cached);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, status, user]);

  useEffect(() => {
    // Bookings are fetched after hydration because the tab-local auth session
    // is only readable in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    return subscribeToBookingCache(() => {
      const cached = readCachedBookings();
      setCachedBookings(cached);
      setBookings((previous) => mergeBookings(previous, cached));
    });
  }, [refresh]);

  const create = useCallback(
    async (input: CreateBookingInput): Promise<Booking> => {
      const request = {
        serviceId: input.serviceId,
        customerName: input.customerName,
        date: input.date,
        timeSlot: input.timeSlot,
        address: input.address,
        notes: input.notes,
      };

      const token =
        user?.role === "customer" ? await getAccessToken() : null;
      const booking = token
        ? await createCustomerBooking(request, token)
        : await createGuestBooking(request);

      cacheBooking(booking);
      setCachedBookings(readCachedBookings());
      setBookings((previous) => mergeBookings(previous, [booking]));
      return booking;
    },
    [getAccessToken, user],
  );

  const setStatus = useCallback(
    async (id: string, nextStatus: BookingStatus): Promise<Booking> => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to update this booking.");
      }

      const updated = await updateBookingStatusRequest(
        id,
        nextStatus,
        token,
      );
      cacheBookingStatus(id, updated.status);
      setBookings((previous) =>
        previous.map((booking) => (booking.id === id ? updated : booking)),
      );
      return updated;
    },
    [getAccessToken],
  );

  const getBookingById = useCallback(
    (id: string) => bookings.find((booking) => booking.id === id),
    [bookings],
  );

  return {
    bookings,
    cachedBookings,
    loading,
    error,
    refresh,
    createBooking: create,
    updateBookingStatus: setStatus,
    getBookingById,
  };
}
