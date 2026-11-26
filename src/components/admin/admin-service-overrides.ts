"use client";

/** Admin service catalogue backed by the NestJS API. */

import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import {
  deleteAdminServiceRequest,
  fetchAdminServices,
  setAdminServiceStatusRequest,
  updateAdminServiceRequest,
  type ApiService,
} from "@/lib/portal-api";
import type { AdminEntityStatus } from "@/types/dashboard";
import type { Service } from "@/types/service";

/** Legacy storage keys, kept only so older imports do not break. */
export const ADMIN_SERVICE_OVERRIDES_KEY = "quicker:admin-service-overrides";
export const ADMIN_SERVICE_DELETIONS_KEY = "quicker:admin-service-deletions";

/** Editable fields only; every other field comes from the API record. */
export interface ServiceOverride {
  title: string;
  description: string;
  price: number;
  categorySlug: string;
  categoryName: string;
  featured: boolean;
}

/** Frontend service shape with the API's status/creation fields preserved. */
export interface AdminServiceRecord extends Service {
  status: "active" | "paused";
  createdAt: string;
}

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "The service request could not be completed. Please try again.";
}

function toService(record: ApiService): AdminServiceRecord {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    categorySlug: record.categorySlug,
    categoryName: record.categoryName,
    providerId: record.providerId,
    providerName: record.providerName,
    price: record.price,
    priceUnit: record.priceUnit,
    rating: record.rating,
    reviewCount: record.reviewCount,
    image: record.image,
    featured: record.featured,
    tags: record.tags,
    includes: record.includes,
    status: record.status,
    createdAt: record.createdAt,
  };
}

/** Admin-only service table and editor state from `/services/admin`. */
export function useAdminServiceOverrides() {
  const { user, status, getAccessToken } = useAuth();
  const [records, setRecords] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (status === "loading") {
      return;
    }
    if (!user) {
      setRecords([]);
      setLoading(false);
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const rows = await fetchAdminServices(token);
      setRecords(rows);
      setError(null);
    } catch (requestError) {
      setError(errorMessage(requestError));
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, status, user]);

  useEffect(() => {
    // Services are fetched after the tab-local auth session is ready.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const services = useMemo<AdminServiceRecord[]>(
    () => records.map(toService),
    [records],
  );

  const statuses = useMemo<Record<string, AdminEntityStatus>>(() => {
    const map: Record<string, AdminEntityStatus> = {};
    records.forEach((record) => {
      map[record.id] = record.status === "active" ? "active" : "suspended";
    });
    return map;
  }, [records]);

  const getServiceById = useCallback(
    (id: string) => services.find((service) => service.id === id),
    [services],
  );

  const saveService = useCallback(
    async (id: string, next: ServiceOverride): Promise<void> => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to save this service.");
      }

      const saved = await updateAdminServiceRequest(
        id,
        {
          title: next.title.trim(),
          description: next.description.trim(),
          price: Math.round(next.price),
          categorySlug: next.categorySlug,
          featured: next.featured,
        },
        token,
      );
      setRecords((previous) =>
        previous.map((record) => (record.id === id ? saved : record)),
      );
    },
    [getAccessToken],
  );

  const deleteService = useCallback(
    async (id: string): Promise<void> => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to delete this service.");
      }

      await deleteAdminServiceRequest(id, token);
      setRecords((previous) => previous.filter((record) => record.id !== id));
    },
    [getAccessToken],
  );

  const setServiceStatus = useCallback(
    async (id: string, nextStatus: AdminEntityStatus): Promise<void> => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to update this service.");
      }

      const saved = await setAdminServiceStatusRequest(
        id,
        nextStatus === "active" ? "active" : "paused",
        token,
      );
      setRecords((previous) =>
        previous.map((record) => (record.id === id ? saved : record)),
      );
    },
    [getAccessToken],
  );

  return {
    services,
    statuses,
    loading,
    error,
    refresh,
    getServiceById,
    saveService,
    deleteService,
    setServiceStatus,
  };
}
