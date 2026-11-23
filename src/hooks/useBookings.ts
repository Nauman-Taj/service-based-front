"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createBooking,
  getAllBookings,
  getBookingById,
  subscribeToBookings,
  updateBookingStatus,
  type CreateBookingInput,
} from "@/lib/booking-store";
import { bookings as mockBookings } from "@/data/bookings";
import type { Booking, BookingStatus } from "@/types/booking";

/** Reactive view of mock + locally created bookings. */
export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  const refresh = useCallback(() => {
    setBookings(getAllBookings());
  }, []);

  useEffect(() => {
    // Reading localStorage after mount is a sync with an external store.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    return subscribeToBookings(refresh);
  }, [refresh]);

  const create = useCallback(
    (input: CreateBookingInput): Booking => {
      const booking = createBooking(input);
      refresh();
      return booking;
    },
    [refresh],
  );

  const setStatus = useCallback(
    (id: string, status: BookingStatus) => {
      updateBookingStatus(id, status);
      refresh();
    },
    [refresh],
  );

  return {
    bookings,
    refresh,
    createBooking: create,
    updateBookingStatus: setStatus,
    getBookingById,
  };
}
