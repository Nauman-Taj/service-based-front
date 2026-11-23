"use client";

import { useEffect, useState } from "react";

/**
 * `useBookings()` starts from static mock data and syncs localStorage in an
 * effect. Detail views wait for that first sync so a locally created booking
 * is never briefly rendered as "not found".
 */
export function useBookingsReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, []);

  return ready;
}
