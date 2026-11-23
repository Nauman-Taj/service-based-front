import type { BookingStatus } from "@/types/booking";

interface StatusMeta {
  label: string;
  className: string;
}

const statusMeta: Record<BookingStatus, StatusMeta> = {
  pending: {
    label: "Pending",
    className: "bg-highlight/20 text-[#8a6203]",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-primary/10 text-primary",
  },
  "in-progress": {
    label: "In progress",
    className: "bg-sky-50 text-sky-700",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-slate-100 text-muted",
  },
};

export function bookingStatusMeta(status: BookingStatus): StatusMeta {
  return statusMeta[status];
}

/** Bookings that still need attention (not finished or cancelled). */
export function isUpcomingStatus(status: BookingStatus): boolean {
  return status === "pending" || status === "confirmed" || status === "in-progress";
}
