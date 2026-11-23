"use client";

import BookingsManager from "@/components/booking/BookingsManager";
import { useBookings } from "@/hooks/useBookings";

/** Admin view of every booking with customer and provider filters. */
export default function AdminBookingsView() {
  const { bookings } = useBookings();

  return (
    <BookingsManager
      bookings={bookings}
      perspective="admin"
      title="Manage bookings"
      description="Monitor every request across the marketplace and update its status when needed."
      showPartyFilters
    />
  );
}
