import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import BookingCard, {
  type BookingPerspective,
} from "@/components/customer/BookingCard";
import type { Booking } from "@/types/booking";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { bookingStatusMeta } from "@/utils/statusHelpers";

interface BookingTableProps {
  bookings: Booking[];
  perspective: BookingPerspective;
}

function detailHref(booking: Booking, perspective: BookingPerspective): string {
  if (perspective === "customer") {
    return `/customer/bookings/${booking.id}`;
  }
  if (perspective === "provider") {
    return `/provider/bookings/${booking.id}`;
  }
  return `/admin/bookings/${booking.id}`;
}

/** Responsive booking list: columns on desktop, compact cards on mobile. */
export default function BookingTable({
  bookings,
  perspective,
}: BookingTableProps) {
  const showCustomer = perspective !== "customer";
  const showProvider = perspective !== "provider";

  return (
    <>
      <div className="hidden rounded-2xl border border-line bg-card shadow-sm md:block">
        <div className="table-scroll">
          <table
            className={cn(
              "w-full border-collapse text-left text-sm",
              perspective === "admin" ? "min-w-[960px]" : "min-w-[720px]",
            )}
          >
            <thead className="bg-background text-xs font-semibold uppercase tracking-wide text-muted">
              <tr>
                <th scope="col" className="px-4 py-3.5">Service</th>
                <th scope="col" className="px-4 py-3.5">Date &amp; time</th>
                {showCustomer ? (
                  <th scope="col" className="px-4 py-3.5">Customer</th>
                ) : null}
                {showProvider ? (
                  <th scope="col" className="px-4 py-3.5">Provider</th>
                ) : null}
                <th scope="col" className="px-4 py-3.5">Status</th>
                <th scope="col" className="px-4 py-3.5 text-right">Price</th>
                <th scope="col" className="px-4 py-3.5"><span className="sr-only">Open</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {bookings.map((booking) => {
                const status = bookingStatusMeta(booking.status);
                return (
                  <tr
                    key={booking.id}
                    className="transition-colors hover:bg-background/60"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Image
                          src={booking.serviceImage}
                          alt=""
                          width={44}
                          height={44}
                          className="h-11 w-11 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <Link
                            href={detailHref(booking, perspective)}
                            className="block max-w-56 truncate font-semibold text-heading transition-colors hover:text-primary"
                          >
                            {booking.serviceName}
                          </Link>
                          <p className="mt-0.5 text-xs text-muted">
                            {booking.reference}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <p className="font-medium text-heading">
                        {formatDate(booking.date)}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {booking.timeSlot}
                      </p>
                    </td>
                    {showCustomer ? (
                      <td className="px-4 py-3.5">
                        <p className="max-w-40 truncate font-medium text-heading">
                          {booking.customerName}
                        </p>
                      </td>
                    ) : null}
                    {showProvider ? (
                      <td className="px-4 py-3.5">
                        <p className="max-w-40 truncate font-medium text-heading">
                          {booking.providerName}
                        </p>
                      </td>
                    ) : null}
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold",
                          status.className,
                        )}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-right font-bold text-heading">
                      {formatCurrency(booking.price)}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Link
                        href={detailHref(booking, perspective)}
                        aria-label={`Open booking ${booking.reference}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            perspective={perspective}
          />
        ))}
      </div>
    </>
  );
}
