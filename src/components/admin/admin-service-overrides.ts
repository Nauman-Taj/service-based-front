"use client";

import { useCallback, useMemo } from "react";

import { services as mockServices } from "@/data/services";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Service } from "@/types/service";

export const ADMIN_SERVICE_OVERRIDES_KEY = "quicker:admin-service-overrides";
export const ADMIN_SERVICE_DELETIONS_KEY = "quicker:admin-service-deletions";

/** Editable fields only — the rest of a service stays mock-backed. */
export interface ServiceOverride {
  title: string;
  description: string;
  price: number;
  categorySlug: string;
  categoryName: string;
  featured: boolean;
}

const EMPTY_OVERRIDES: Record<string, ServiceOverride> = {};
const EMPTY_DELETIONS: string[] = [];

/**
 * Admin-only service edits. Mock services remain the base data while saved
 * overrides and deletions are merged in from localStorage for every admin
 * table and the service editor.
 */
export function useAdminServiceOverrides() {
  const [overrides, setOverrides] = useLocalStorage<
    Record<string, ServiceOverride>
  >(ADMIN_SERVICE_OVERRIDES_KEY, EMPTY_OVERRIDES);
  const [deletedIds, setDeletedIds] = useLocalStorage<string[]>(
    ADMIN_SERVICE_DELETIONS_KEY,
    EMPTY_DELETIONS,
  );

  const services = useMemo<Service[]>(
    () =>
      mockServices
        .filter((service) => !deletedIds.includes(service.id))
        .map((service) => ({
          ...service,
          ...(overrides[service.id] ?? {}),
        })),
    [overrides, deletedIds],
  );

  const getServiceById = useCallback(
    (id: string) => services.find((service) => service.id === id),
    [services],
  );

  const saveService = useCallback(
    (id: string, next: ServiceOverride) => {
      setOverrides((previous) => ({ ...previous, [id]: next }));
    },
    [setOverrides],
  );

  const deleteService = useCallback(
    (id: string) => {
      setDeletedIds((previous) =>
        previous.includes(id) ? previous : [...previous, id],
      );
    },
    [setDeletedIds],
  );

  const restoreService = useCallback(
    (id: string) => {
      setDeletedIds((previous) => previous.filter((item) => item !== id));
      setOverrides((previous) => {
        if (!(id in previous)) {
          return previous;
        }
        const next = { ...previous };
        delete next[id];
        return next;
      });
    },
    [setDeletedIds, setOverrides],
  );

  return {
    services,
    getServiceById,
    saveService,
    deleteService,
    restoreService,
    overrides,
    deletedIds,
  };
}
