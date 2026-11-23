"use client";

import { useCallback, useMemo } from "react";

import { categories as mockCategories } from "@/data/categories";
import { services as mockServices } from "@/data/services";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { makeId } from "@/lib/portal-store";
import type { Category } from "@/types/category";

import {
  CATEGORY_ICON_MAP,
  type CategoryFormValues,
  type CategoryIconName,
} from "@/components/forms/CategoryForm";

export const ADMIN_CATEGORIES_KEY = "quicker:admin-categories";
export const ADMIN_CATEGORY_OVERRIDES_KEY = "quicker:admin-category-overrides";
export const ADMIN_CATEGORY_DELETIONS_KEY = "quicker:admin-category-deletions";

interface StoredCategory extends CategoryFormValues {
  id: string;
}

const EMPTY_CATEGORIES: StoredCategory[] = [];
const EMPTY_OVERRIDES: Record<string, StoredCategory> = {};
const EMPTY_DELETIONS: string[] = [];

function toCategory(stored: StoredCategory): Category {
  return {
    id: stored.id,
    name: stored.name,
    slug: stored.slug,
    description: stored.description,
    icon: CATEGORY_ICON_MAP[stored.icon as CategoryIconName],
    serviceCount: 0,
  };
}

/** Live category list built from mock data plus admin localStorage edits. */
export function useAdminCategories() {
  const [customCategories, setCustomCategories] = useLocalStorage<
    StoredCategory[]
  >(ADMIN_CATEGORIES_KEY, EMPTY_CATEGORIES);
  const [overrides, setOverrides] = useLocalStorage<
    Record<string, StoredCategory>
  >(ADMIN_CATEGORY_OVERRIDES_KEY, EMPTY_OVERRIDES);
  const [deletedIds, setDeletedIds] = useLocalStorage<string[]>(
    ADMIN_CATEGORY_DELETIONS_KEY,
    EMPTY_DELETIONS,
  );

  const categories = useMemo<Category[]>(() => {
    const base = mockCategories.map((category) => {
      const override = overrides[category.id];
      return override ? { ...category, ...toCategory(override) } : category;
    });

    return [...base, ...customCategories.map(toCategory)]
      .filter((category) => !deletedIds.includes(category.id))
      .map((category) => ({
        ...category,
        serviceCount: mockServices.filter(
          (service) => service.categorySlug === category.slug,
        ).length,
      }));
  }, [customCategories, overrides, deletedIds]);

  const saveCategory = useCallback(
    (values: CategoryFormValues, id?: string): string => {
      if (id && customCategories.some((category) => category.id === id)) {
        setCustomCategories((previous) =>
          previous.map((category) =>
            category.id === id ? { ...category, ...values } : category,
          ),
        );
        return id;
      }

      if (id && mockCategories.some((category) => category.id === id)) {
        setOverrides((previous) => ({
          ...previous,
          [id]: { ...values, id },
        }));
        return id;
      }

      const created: StoredCategory = { ...values, id: makeId("cat") };
      setCustomCategories((previous) => [created, ...previous]);
      return created.id;
    },
    [customCategories, setCustomCategories, setOverrides],
  );

  const deleteCategory = useCallback(
    (id: string) => {
      setDeletedIds((previous) =>
        previous.includes(id) ? previous : [...previous, id],
      );
    },
    [setDeletedIds],
  );

  return { categories, saveCategory, deleteCategory, deletedIds };
}
