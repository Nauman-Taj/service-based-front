import BookingTable from "@/components/booking/BookingTable";
import type { Booking } from "@/types/booking";

interface CustomerBookingTableProps {
  bookings: Booking[];
}

/** Customer-facing booking table using the shared responsive table. */
export default function CustomerBookingTable({
  bookings,
}: CustomerBookingTableProps) {
  return <BookingTable bookings={bookings} perspective="customer" />;
}
