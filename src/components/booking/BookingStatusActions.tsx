"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";

import Button from "@/components/common/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { useBookings } from "@/hooks/useBookings";
import type { Booking, BookingStatus } from "@/types/booking";

export interface BookingStatusAction {
  label: string;
  status: BookingStatus;
  icon?: LucideIcon;
  variant?: "primary" | "outline";
  confirmTitle?: string;
  confirmDescription?: string;
  confirmLabel?: string;
  destructive?: boolean;
}

interface BookingStatusActionsProps {
  booking: Booking;
  actions: BookingStatusAction[];
}

/** Renders the status transitions allowed for the current role and booking. */
export default function BookingStatusActions({
  booking,
  actions,
}: BookingStatusActionsProps) {
  const { updateBookingStatus } = useBookings();
  const [pending, setPending] = useState<BookingStatusAction | null>(null);

  if (!actions.length) {
    return null;
  }

  function apply(action: BookingStatusAction) {
    updateBookingStatus(booking.id, action.status);
  }

  return (
    <>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={`${action.status}-${action.label}`}
            variant={action.variant ?? "primary"}
            size="sm"
            onClick={() => {
              if (action.confirmTitle) {
                setPending(action);
              } else {
                apply(action);
              }
            }}
          >
            {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
            {action.label}
          </Button>
        );
      })}

      <ConfirmDialog
        open={pending !== null}
        title={pending?.confirmTitle ?? "Update booking"}
        description={
          pending?.confirmDescription ??
          "Are you sure you want to update this booking?"
        }
        confirmLabel={pending?.confirmLabel ?? "Confirm"}
        destructive={pending?.destructive ?? false}
        onConfirm={() => {
          if (pending) {
            apply(pending);
          }
        }}
        onClose={() => setPending(null)}
      />
    </>
  );
}
