import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";

import type { Booking } from "@/types/booking";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { bookingStatusMeta } from "@/utils/statusHelpers";
import { cn } from "@/lib/utils";

export type BookingPerspective = "customer" | "provider" | "admin";

interface BookingCardProps {
  booking: Booking;
  perspective: BookingPerspective;
  className?: string;
}

/**
 * Compact booking row shared by the customer, provider and admin dashboards.
 * `perspective` decides which party is shown and where the row links to.
 */
export default function BookingCard({
  booking,
  perspective,
  className,
}: BookingCardProps) {
  const status = bookingStatusMeta(booking.status);
  const href =
    perspective === "customer"
      ? `/customer/bookings/${booking.id}`
      : perspective === "provider"
        ? `/provider/bookings/${booking.id}`
        : `/admin/bookings/${booking.id}`;
  const counterpart =
    perspective === "customer" ? booking.providerName : booking.customerName;
  const counterpartLabel =
    perspective === "customer" ? "Provider" : "Customer";

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 rounded-2xl border border-line bg-card p-4 shadow-sm transition-colors hover:border-primary/40",
        className,
      )}
    >
      <Image
        src={booking.serviceImage}
        alt=""
        width={64}
        height={64}
        className="hidden h-16 w-16 shrink-0 rounded-xl object-cover sm:block"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-heading">
            {booking.serviceName}
          </p>
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
              status.className,
            )}
          >
            {status.label}
          </span>
        </div>
        <p className="mt-1 truncate text-xs text-muted">
          {counterpartLabel}: {counterpart} · {booking.reference}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(booking.date)} · {booking.timeSlot}
          </span>
          <span className="hidden items-center gap-1 md:inline-flex">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="max-w-64 truncate">{booking.address}</span>
          </span>
        </div>
      </div>

      <p className="shrink-0 text-sm font-bold text-heading">
        {formatCurrency(booking.price)}
      </p>
    </Link>
  );
}
