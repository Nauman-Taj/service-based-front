"use client";

/** Admin category catalogue backed by the NestJS API. */

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  CATEGORY_ICON_MAP,
  type CategoryFormValues,
  type CategoryIconName,
} from "@/components/forms/CategoryForm";
import { useAuth } from "@/hooks/useAuth";
import {
  createCategoryRequest,
  deleteCategoryRequest,
  fetchAdminCategories,
  updateCategoryRequest,
  type ApiCategory,
  type CategoryIconKey,
  type CategoryRequest,
} from "@/lib/portal-api";
import type { Category } from "@/types/category";
import type { AdminEntityStatus } from "@/types/dashboard";

/** Legacy storage keys, kept only so older imports do not break. */
export const ADMIN_CATEGORIES_KEY = "quicker:admin-categories";
export const ADMIN_CATEGORY_OVERRIDES_KEY = "quicker:admin-category-overrides";
export const ADMIN_CATEGORY_DELETIONS_KEY = "quicker:admin-category-deletions";

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "The category request could not be completed. Please try again.";
}

function toCategory(record: ApiCategory): Category {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    description: record.description,
    icon:
      CATEGORY_ICON_MAP[record.icon as CategoryIconName] ??
      CATEGORY_ICON_MAP.Sparkles,
    serviceCount: record.serviceCount,
  };
}

function toStatus(record: ApiCategory): AdminEntityStatus {
  return record.enabled ? "active" : "suspended";
}

/** Live category list and status controls from `/categories/admin`. */
export function useAdminCategories() {
  const { user, status, getAccessToken } = useAuth();
  const [records, setRecords] = useState<ApiCategory[]>([]);
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
      const rows = await fetchAdminCategories(token);
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
    // Categories are fetched after the tab-local auth session is ready.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const categories = useMemo<Category[]>(
    () => records.map(toCategory),
    [records],
  );

  const statuses = useMemo<Record<string, AdminEntityStatus>>(() => {
    const map: Record<string, AdminEntityStatus> = {};
    records.forEach((record) => {
      map[record.id] = toStatus(record);
    });
    return map;
  }, [records]);

  const saveCategory = useCallback(
    async (values: CategoryFormValues, id?: string): Promise<string> => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to save this category.");
      }

      const payload: CategoryRequest = {
        name: values.name.trim(),
        slug: values.slug.trim().toLowerCase(),
        description: values.description.trim(),
        icon: values.icon as CategoryIconKey,
      };

      const saved = id
        ? await updateCategoryRequest(id, payload, token)
        : await createCategoryRequest(payload, token);

      setRecords((previous) =>
        id
          ? previous.map((record) => (record.id === id ? saved : record))
          : [saved, ...previous],
      );
      return saved.id;
    },
    [getAccessToken],
  );

  const deleteCategory = useCallback(
    async (id: string): Promise<void> => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to delete this category.");
      }

      await deleteCategoryRequest(id, token);
      setRecords((previous) => previous.filter((record) => record.id !== id));
    },
    [getAccessToken],
  );

  const setCategoryStatus = useCallback(
    async (id: string, nextStatus: AdminEntityStatus): Promise<void> => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to update this category.");
      }

      const saved = await updateCategoryRequest(
        id,
        { enabled: nextStatus === "active" },
        token,
      );
      setRecords((previous) =>
        previous.map((record) => (record.id === id ? saved : record)),
      );
    },
    [getAccessToken],
  );

  return {
    categories,
    statuses,
    loading,
    error,
    refresh,
    saveCategory,
    deleteCategory,
    setCategoryStatus,
  };
}
