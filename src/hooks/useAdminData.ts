"use client";

/**
 * Admin dashboard data backed by the NestJS API.
 *
 * The hooks follow the same tab-local auth flow as the other portal hooks:
 * wait for auth hydration, bail without a user/access token, then map API
 * responses into the dashboard's existing TypeScript shapes.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import {
  fetchAdminCustomers,
  fetchAdminOverview,
  fetchAdminProviders,
  setCustomerStatusRequest,
  setProviderStatusRequest,
  setProviderVerificationRequest,
  type AdminCustomerRecord,
  type AdminOverviewRecord,
  type AdminProviderRecord,
} from "@/lib/portal-api";
import type { AdminEntityStatus } from "@/types/dashboard";

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "The request could not be completed. Please try again.";
}

function toStatuses(
  rows: Array<{ id: string; status: AdminEntityStatus }>,
): Record<string, AdminEntityStatus> {
  const statuses: Record<string, AdminEntityStatus> = {};
  rows.forEach((row) => {
    statuses[row.id] = row.status;
  });
  return statuses;
}

function toCounts<T extends { id: string }>(
  rows: T[],
  pick: (row: T) => number,
): Record<string, number> {
  const counts: Record<string, number> = {};
  rows.forEach((row) => {
    counts[row.id] = pick(row);
  });
  return counts;
}

export function useAdminOverview() {
  const { user, status, getAccessToken } = useAuth();
  const [overview, setOverview] = useState<AdminOverviewRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (status === "loading") {
      return;
    }
    if (!user) {
      setOverview(null);
      setLoading(false);
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const record = await fetchAdminOverview(token);
      setOverview(record);
      setError(null);
    } catch (requestError) {
      setOverview(null);
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, status, user]);

  useEffect(() => {
    // Admin data is fetched after hydration because the access token lives in
    // this tab's session storage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  return { overview, loading, error, refresh };
}

export function useAdminCustomers(search: string) {
  const { user, status, getAccessToken } = useAuth();
  const [customers, setCustomers] = useState<AdminCustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (status === "loading") {
      return;
    }
    if (!user) {
      setCustomers([]);
      setLoading(false);
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const rows = await fetchAdminCustomers(search, token);
      setCustomers(rows);
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, search, status, user]);

  useEffect(() => {
    // Search changes and auth hydration both refetch from the tab-local token.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const statuses = useMemo(() => toStatuses(customers), [customers]);
  const bookingCounts = useMemo(
    () => toCounts(customers, (customer) => customer.bookingCount),
    [customers],
  );

  const setCustomerStatus = useCallback(
    async (id: string, nextStatus: AdminEntityStatus) => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to update this customer.");
      }

      const result = await setCustomerStatusRequest(id, nextStatus, token);
      setCustomers((previous) =>
        previous.map((customer) =>
          customer.id === id ? { ...customer, status: result.status } : customer,
        ),
      );
    },
    [getAccessToken],
  );

  return {
    customers,
    loading,
    error,
    refresh,
    setCustomerStatus,
    bookingCounts,
    statuses,
  };
}

export function useAdminProviders(search: string) {
  const { user, status, getAccessToken } = useAuth();
  const [providers, setProviders] = useState<AdminProviderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (status === "loading") {
      return;
    }
    if (!user) {
      setProviders([]);
      setLoading(false);
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const rows = await fetchAdminProviders(search, token);
      setProviders(rows);
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
      setProviders([]);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, search, status, user]);

  useEffect(() => {
    // Search changes and auth hydration both refetch from the tab-local token.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const statuses = useMemo(() => toStatuses(providers), [providers]);
  const serviceCounts = useMemo(
    () => toCounts(providers, (provider) => provider.serviceCount),
    [providers],
  );

  const setProviderStatus = useCallback(
    async (id: string, nextStatus: AdminEntityStatus) => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to update this provider.");
      }

      const result = await setProviderStatusRequest(id, nextStatus, token);
      setProviders((previous) =>
        previous.map((provider) =>
          provider.id === id ? { ...provider, status: result.status } : provider,
        ),
      );
    },
    [getAccessToken],
  );

  const setProviderVerification = useCallback(
    async (id: string, verified: boolean) => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to verify this provider.");
      }

      const updated = await setProviderVerificationRequest(id, verified, token);
      setProviders((previous) =>
        previous.map((provider) => (provider.id === id ? updated : provider)),
      );
    },
    [getAccessToken],
  );

  return {
    providers,
    loading,
    error,
    refresh,
    setProviderStatus,
    setProviderVerification,
    statuses,
    serviceCounts,
  };
}
