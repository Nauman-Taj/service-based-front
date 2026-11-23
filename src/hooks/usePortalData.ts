"use client";

import { useCallback, useMemo } from "react";

import { services as mockServices } from "@/data/services";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { makeId, PORTAL_KEYS } from "@/lib/portal-store";
import {
  defaultAccountSettings,
  emptyUserProfile,
  type AccountSettingsRecord,
  type AdminEntityStatus,
  type AvailabilityRule,
  type BlockedDateRecord,
  type DashboardReviewRecord,
  type FavoriteRecord,
  type ProviderServiceRecord,
  type UserProfileRecord,
} from "@/types/dashboard";
import type { Service } from "@/types/service";

const EMPTY_PROFILES: Record<string, UserProfileRecord> = {};
const EMPTY_SETTINGS: Record<string, AccountSettingsRecord> = {};
const EMPTY_FAVORITES: Record<string, FavoriteRecord[]> = {};
const EMPTY_REVIEWS: DashboardReviewRecord[] = [];
const EMPTY_PROVIDER_SERVICES: Record<string, ProviderServiceRecord[]> = {};
const EMPTY_ADMIN_STATUSES: Record<string, AdminEntityStatus> = {};
const EMPTY_AVAILABILITY: Record<string, AvailabilityRule[]> = {};
const EMPTY_BLOCKED_DATES: Record<string, BlockedDateRecord[]> = {};
const EMPTY_DELETED_SERVICES: Record<string, string[]> = {};

export const DEFAULT_AVAILABILITY: AvailabilityRule[] = [
  { day: 1, enabled: true, slots: ["09:00 – 12:00", "14:00 – 18:00"] },
  { day: 2, enabled: true, slots: ["09:00 – 12:00", "14:00 – 18:00"] },
  { day: 3, enabled: true, slots: ["09:00 – 12:00", "14:00 – 18:00"] },
  { day: 4, enabled: true, slots: ["09:00 – 12:00", "14:00 – 18:00"] },
  { day: 5, enabled: true, slots: ["09:00 – 12:00", "14:00 – 18:00"] },
  { day: 6, enabled: true, slots: ["10:00 – 14:00"] },
  { day: 0, enabled: false, slots: [] },
];

export function useUserProfile(userId: string | undefined) {
  const key = userId ?? "anonymous";
  const [profiles, setProfiles] = useLocalStorage<Record<string, UserProfileRecord>>(
    PORTAL_KEYS.profiles,
    EMPTY_PROFILES,
  );

  const profile = profiles[key] ?? emptyUserProfile;

  const saveProfile = useCallback(
    (next: UserProfileRecord) => {
      setProfiles((previous) => ({ ...previous, [key]: next }));
    },
    [key, setProfiles],
  );

  return { profile, saveProfile };
}

export function useAccountSettings(userId: string | undefined) {
  const key = userId ?? "anonymous";
  const [settingsMap, setSettingsMap] = useLocalStorage<
    Record<string, AccountSettingsRecord>
  >(PORTAL_KEYS.settings, EMPTY_SETTINGS);

  const settings = settingsMap[key] ?? defaultAccountSettings;

  const saveSettings = useCallback(
    (next: AccountSettingsRecord) => {
      setSettingsMap((previous) => ({ ...previous, [key]: next }));
    },
    [key, setSettingsMap],
  );

  return { settings, saveSettings };
}

export function useFavorites(userId: string | undefined) {
  const key = userId ?? "anonymous";
  const [favoritesMap, setFavoritesMap] = useLocalStorage<
    Record<string, FavoriteRecord[]>
  >(PORTAL_KEYS.favorites, EMPTY_FAVORITES);

  const favorites = useMemo(
    () => favoritesMap[key] ?? [],
    [favoritesMap, key],
  );

  const toggleFavorite = useCallback(
    (serviceId: string) => {
      setFavoritesMap((previous) => {
        const current = previous[key] ?? [];
        const exists = current.some((item) => item.serviceId === serviceId);
        return {
          ...previous,
          [key]: exists
            ? current.filter((item) => item.serviceId !== serviceId)
            : [
                ...current,
                {
                  id: makeId("fav"),
                  serviceId,
                  createdAt: new Date().toISOString(),
                },
              ],
        };
      });
    },
    [key, setFavoritesMap],
  );

  const isFavorite = useCallback(
    (serviceId: string) => favorites.some((item) => item.serviceId === serviceId),
    [favorites],
  );

  return { favorites, toggleFavorite, isFavorite };
}

export function useDashboardReviews() {
  const [reviews, setReviews] = useLocalStorage<DashboardReviewRecord[]>(
    PORTAL_KEYS.reviews,
    EMPTY_REVIEWS,
  );

  const addReview = useCallback(
    (review: Omit<DashboardReviewRecord, "id" | "date" | "status">) => {
      setReviews((previous) => [
        {
          ...review,
          id: makeId("rev"),
          date: new Date().toISOString().slice(0, 10),
          status: "published",
        },
        ...previous,
      ]);
    },
    [setReviews],
  );

  const setReviewStatus = useCallback(
    (id: string, status: DashboardReviewRecord["status"]) => {
      setReviews((previous) =>
        previous.map((review) =>
          review.id === id ? { ...review, status } : review,
        ),
      );
    },
    [setReviews],
  );

  const deleteReview = useCallback(
    (id: string) => {
      setReviews((previous) => previous.filter((review) => review.id !== id));
    },
    [setReviews],
  );

  return { reviews, addReview, setReviewStatus, deleteReview };
}

function toProviderService(service: Service): ProviderServiceRecord {
  return {
    id: service.id,
    title: service.title,
    description: service.description,
    categorySlug: service.categorySlug,
    categoryName: service.categoryName,
    price: service.price,
    priceUnit: service.priceUnit,
    image: service.image,
    featured: service.featured,
    tags: service.tags,
    includes: service.includes,
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

export function useProviderServices(providerId: string | undefined) {
  const key = providerId ?? "anonymous";
  const [customMap, setCustomMap] = useLocalStorage<
    Record<string, ProviderServiceRecord[]>
  >(PORTAL_KEYS.providerServices, EMPTY_PROVIDER_SERVICES);
  const [deletedMap, setDeletedMap] = useLocalStorage<
    Record<string, string[]>
  >(PORTAL_KEYS.providerServiceDeletions, EMPTY_DELETED_SERVICES);

  const custom = useMemo(() => customMap[key] ?? [], [customMap, key]);
  const deleted = useMemo(() => deletedMap[key] ?? [], [deletedMap, key]);
  const customIds = useMemo(
    () => new Set(custom.map((service) => service.id)),
    [custom],
  );
  const deletedIds = useMemo(() => new Set(deleted), [deleted]);
  const base = useMemo(
    () =>
      mockServices
        .filter(
          (service) =>
            service.providerId === key &&
            !customIds.has(service.id) &&
            !deletedIds.has(service.id),
        )
        .map(toProviderService),
    [key, customIds, deletedIds],
  );
  const all = useMemo(
    () =>
      [...base, ...custom].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      ),
    [base, custom],
  );

  const saveService = useCallback(
    (service: ProviderServiceRecord) => {
      setCustomMap((previous) => {
        const current = previous[key] ?? [];
        const index = current.findIndex((item) => item.id === service.id);
        return {
          ...previous,
          [key]:
            index === -1
              ? [service, ...current]
              : current.map((item) => (item.id === service.id ? service : item)),
        };
      });
      setDeletedMap((previous) => ({
        ...previous,
        [key]: (previous[key] ?? []).filter((id) => id !== service.id),
      }));
    },
    [key, setCustomMap, setDeletedMap],
  );

  const deleteService = useCallback(
    (id: string) => {
      setCustomMap((previous) => ({
        ...previous,
        [key]: (previous[key] ?? []).filter((service) => service.id !== id),
      }));
      setDeletedMap((previous) => ({
        ...previous,
        [key]: Array.from(new Set([...(previous[key] ?? []), id])),
      }));
    },
    [key, setCustomMap, setDeletedMap],
  );

  return { services: all, saveService, deleteService };
}

export function useAvailability(providerId: string | undefined) {
  const key = providerId ?? "anonymous";
  const [rulesMap, setRulesMap] = useLocalStorage<
    Record<string, AvailabilityRule[]>
  >(PORTAL_KEYS.availability, EMPTY_AVAILABILITY);
  const [blockedMap, setBlockedMap] = useLocalStorage<
    Record<string, BlockedDateRecord[]>
  >(PORTAL_KEYS.blockedDates, EMPTY_BLOCKED_DATES);

  const rules = rulesMap[key] ?? DEFAULT_AVAILABILITY;
  const blocked = blockedMap[key] ?? [];

  const saveRules = useCallback(
    (next: AvailabilityRule[]) => {
      setRulesMap((previous) => ({ ...previous, [key]: next }));
    },
    [key, setRulesMap],
  );

  const addBlockedDate = useCallback(
    (date: string, reason: string) => {
      setBlockedMap((previous) => ({
        ...previous,
        [key]: [
          ...(previous[key] ?? []),
          { id: makeId("block"), date, reason },
        ],
      }));
    },
    [key, setBlockedMap],
  );

  const removeBlockedDate = useCallback(
    (id: string) => {
      setBlockedMap((previous) => ({
        ...previous,
        [key]: (previous[key] ?? []).filter((item) => item.id !== id),
      }));
    },
    [key, setBlockedMap],
  );

  return { rules, saveRules, blocked, addBlockedDate, removeBlockedDate };
}

export function useAdminStatuses() {
  const [statuses, setStatuses] = useLocalStorage<
    Record<string, AdminEntityStatus>
  >(PORTAL_KEYS.adminStatuses, EMPTY_ADMIN_STATUSES);

  const setStatus = useCallback(
    (id: string, status: AdminEntityStatus) => {
      setStatuses((previous) => ({ ...previous, [id]: status }));
    },
    [setStatuses],
  );

  return { statuses, setStatus };
}
