import BookingTable from "@/components/booking/BookingTable";
import type { Booking } from "@/types/booking";

interface AdminBookingsTableProps {
  bookings: Booking[];
}

/** Admin-facing bookings table using the shared responsive table. */
export default function AdminBookingsTable({
  bookings,
}: AdminBookingsTableProps) {
  return <BookingTable bookings={bookings} perspective="admin" />;
}
