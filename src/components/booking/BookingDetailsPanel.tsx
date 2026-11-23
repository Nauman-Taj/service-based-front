import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  Clock,
  MapPin,
  MessageSquare,
  User,
} from "lucide-react";
import type { ReactNode } from "react";

import Avatar from "@/components/common/Avatar";
import type { Booking } from "@/types/booking";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";
import { bookingStatusMeta } from "@/utils/statusHelpers";

interface BookingDetailsPanelProps {
  booking: Booking;
  /** Role-specific status buttons, rendered in a footer row when provided. */
  actions?: ReactNode;
}

interface DetailItemProps {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}

function DetailItem({ icon: Icon, label, children }: DetailItemProps) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {label}
        </p>
        <div className="mt-1 text-sm text-heading">{children}</div>
      </div>
    </div>
  );
}

/** All booking information in one reusable card. */
export default function BookingDetailsPanel({
  booking,
  actions,
}: BookingDetailsPanelProps) {
  const status = bookingStatusMeta(booking.status);

  return (
    <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <Image
          src={booking.serviceImage}
          alt=""
          width={112}
          height={112}
          className="h-24 w-24 shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-heading">
              {booking.serviceName}
            </h3>
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                status.className,
              )}
            >
              {status.label}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            Reference <span className="font-semibold text-heading">{booking.reference}</span>
          </p>
          <Link
            href={`/services/${booking.serviceId}`}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            View service details
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Agreed total
          </p>
          <p className="mt-1 text-xl font-bold text-heading">
            {formatCurrency(booking.price)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 border-t border-line pt-5 sm:grid-cols-2">
        <DetailItem icon={CalendarDays} label="Service date">
          <p className="font-semibold">{formatDate(booking.date)}</p>
          <p className="mt-0.5 text-sm text-muted">{booking.timeSlot}</p>
        </DetailItem>
        <DetailItem icon={Clock} label="Requested on">
          <p className="font-semibold">{formatDate(booking.createdAt.slice(0, 10))}</p>
        </DetailItem>
        <DetailItem icon={MapPin} label="Service address">
          <p className="font-semibold leading-relaxed">{booking.address}</p>
        </DetailItem>
        <DetailItem icon={MessageSquare} label="Notes">
          {booking.notes ? (
            <p className="leading-relaxed">{booking.notes}</p>
          ) : (
            <p className="text-muted">No additional notes.</p>
          )}
        </DetailItem>
        <DetailItem icon={User} label="Customer">
          <div className="flex items-center gap-2">
            <Avatar name={booking.customerName} size="sm" />
            <span className="font-semibold">{booking.customerName}</span>
          </div>
        </DetailItem>
        <DetailItem icon={Briefcase} label="Service provider">
          <div className="flex items-center gap-2">
            <Avatar name={booking.providerName} size="sm" />
            <span className="font-semibold">{booking.providerName}</span>
          </div>
        </DetailItem>
      </div>

      {actions ? (
        <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-5">
          {actions}
        </div>
      ) : null}
    </section>
  );
}
