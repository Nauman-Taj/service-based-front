"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import {
  addBlockedDateRequest,
  addFavorite,
  createProviderService,
  createReview,
  deleteProviderService,
  deleteReview as deleteReviewRequest,
  fetchAdminContacts,
  fetchAdminReviews,
  fetchAllReviews,
  fetchAvailability,
  fetchFavorites,
  fetchMyReviews,
  fetchProfile,
  fetchProviderServices,
  fetchSettings,
  removeBlockedDateRequest,
  removeFavorite,
  saveAvailabilityRulesRequest,
  saveProfileRequest,
  saveSettingsRequest,
  setContactStatusRequest,
  setReviewStatusRequest,
  updateProviderService,
  updateReview as updateReviewRequest,
} from "@/lib/portal-api";
import type { ContactMessage, ContactStatus } from "@/types/contact";
import {
  defaultAccountSettings,
  emptyUserProfile,
  type AccountSettingsRecord,
  type AvailabilityRule,
  type BlockedDateRecord,
  type DashboardReviewRecord,
  type FavoriteRecord,
  type ProviderServiceRecord,
  type UserProfileRecord,
} from "@/types/dashboard";

export const DEFAULT_AVAILABILITY: AvailabilityRule[] = [
  { day: 1, enabled: true, slots: ["09:00 – 12:00", "14:00 – 18:00"] },
  { day: 2, enabled: true, slots: ["09:00 – 12:00", "14:00 – 18:00"] },
  { day: 3, enabled: true, slots: ["09:00 – 12:00", "14:00 – 18:00"] },
  { day: 4, enabled: true, slots: ["09:00 – 12:00", "14:00 – 18:00"] },
  { day: 5, enabled: true, slots: ["09:00 – 12:00", "14:00 – 18:00"] },
  { day: 6, enabled: true, slots: ["10:00 – 14:00"] },
  { day: 0, enabled: false, slots: [] },
];

function apiErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useUserProfile(userId: string | undefined) {
  const { user, status, getAccessToken } = useAuth();
  const [profile, setProfile] = useState<UserProfileRecord>(emptyUserProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (status === "loading") {
      return;
    }
    if (!user || (userId && user.id !== userId)) {
      setProfile(emptyUserProfile);
      setLoading(false);
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const record = await fetchProfile(token);
      setProfile(record);
      setError(null);
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Could not load your profile."));
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, status, user, userId]);

  useEffect(() => {
    // The session lives in sessionStorage, so loading starts after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const saveProfile = useCallback(
    async (next: UserProfileRecord): Promise<UserProfileRecord> => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to save your profile.");
      }
      const saved = await saveProfileRequest(next, token);
      setProfile(saved);
      setError(null);
      return saved;
    },
    [getAccessToken],
  );

  return { profile, saveProfile, loading, error, refresh };
}

export function useAccountSettings(userId: string | undefined) {
  const { user, status, getAccessToken } = useAuth();
  const [settings, setSettings] = useState<AccountSettingsRecord>(
    defaultAccountSettings,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (status === "loading") {
      return;
    }
    if (!user || (userId && user.id !== userId)) {
      setSettings(defaultAccountSettings);
      setLoading(false);
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const record = await fetchSettings(token);
      setSettings(record);
      setError(null);
    } catch (requestError) {
      setError(apiErrorMessage(requestError, "Could not load your settings."));
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, status, user, userId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const saveSettings = useCallback(
    async (next: AccountSettingsRecord): Promise<AccountSettingsRecord> => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to save your settings.");
      }
      const saved = await saveSettingsRequest(next, token);
      setSettings(saved);
      setError(null);
      return saved;
    },
    [getAccessToken],
  );

  return { settings, saveSettings, loading, error, refresh };
}

export function useFavorites() {
  const { user, status, getAccessToken } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (status === "loading") {
        return;
      }
      if (!user) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      const token = await getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const records = await fetchFavorites(token);
        if (!cancelled) {
          setFavorites(records);
        }
      } catch {
        if (!cancelled) {
          setFavorites([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [getAccessToken, status, user]);

  const toggleFavorite = useCallback(
    async (serviceId: string) => {
      const token = await getAccessToken();
      if (!token) {
        return;
      }

      const existing = favorites.find(
        (item) => item.serviceId === serviceId,
      );

      if (existing) {
        setFavorites((previous) =>
          previous.filter((item) => item.serviceId !== serviceId),
        );
        try {
          await removeFavorite(serviceId, token);
        } catch {
          setFavorites((previous) => [existing, ...previous]);
        }
        return;
      }

      const optimistic: FavoriteRecord = {
        id: `pending-${serviceId}`,
        serviceId,
        createdAt: new Date().toISOString(),
      };
      setFavorites((previous) => [optimistic, ...previous]);
      try {
        const created = await addFavorite(serviceId, token);
        setFavorites((previous) =>
          previous.map((item) =>
            item.id === optimistic.id ? created : item,
          ),
        );
      } catch {
        setFavorites((previous) =>
          previous.filter((item) => item.id !== optimistic.id),
        );
      }
    },
    [favorites, getAccessToken],
  );

  const isFavorite = useCallback(
    (serviceId: string) => favorites.some((item) => item.serviceId === serviceId),
    [favorites],
  );

  return { favorites, loading, toggleFavorite, isFavorite };
}

export function useDashboardReviews() {
  const { user, status, getAccessToken } = useAuth();
  const [reviews, setReviews] = useState<DashboardReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (status === "loading") {
      return;
    }
    if (!user) {
      setReviews([]);
      setLoading(false);
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      let rows: DashboardReviewRecord[];
      if (user.role === "admin") {
        rows = await fetchAdminReviews(token);
      } else if (user.role === "customer") {
        rows = await fetchMyReviews(token);
      } else {
        rows = (await fetchAllReviews(token)).filter(
          (review) => review.status === "published",
        );
      }
      setReviews(rows);
      setError(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not load reviews.",
      );
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, status, user]);

  useEffect(() => {
    // Reviews require the tab-local session, so the request runs after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const addReview = useCallback(
    async (
      review: Omit<DashboardReviewRecord, "id" | "date" | "status">,
    ): Promise<DashboardReviewRecord> => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to submit a review.");
      }
      const created = await createReview(
        {
          serviceId: review.serviceId,
          bookingId: review.bookingId,
          rating: review.rating,
          title: review.title,
          body: review.body,
        },
        token,
      );
      setReviews((previous) => [created, ...previous]);
      return created;
    },
    [getAccessToken],
  );

  const editReview = useCallback(
    async (
      id: string,
      values: Pick<DashboardReviewRecord, "rating" | "title" | "body">,
    ): Promise<DashboardReviewRecord> => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to update this review.");
      }
      const updated = await updateReviewRequest(
        id,
        {
          rating: values.rating,
          title: values.title,
          body: values.body,
        },
        token,
      );
      setReviews((previous) =>
        previous.map((review) => (review.id === id ? updated : review)),
      );
      return updated;
    },
    [getAccessToken],
  );

  const setReviewStatus = useCallback(
    async (id: string, nextStatus: DashboardReviewRecord["status"]) => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to moderate reviews.");
      }
      const updated = await setReviewStatusRequest(id, nextStatus, token);
      setReviews((previous) =>
        previous.map((review) => (review.id === id ? updated : review)),
      );
    },
    [getAccessToken],
  );

  const deleteReview = useCallback(
    async (id: string) => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to delete this review.");
      }
      await deleteReviewRequest(id, token);
      setReviews((previous) =>
        previous.filter((review) => review.id !== id),
      );
    },
    [getAccessToken],
  );

  return {
    reviews,
    loading,
    error,
    refresh,
    addReview,
    updateReview: editReview,
    setReviewStatus,
    deleteReview,
  };
}

/** Admin-only inbox over the contact messages stored by the API. */
export function useAdminContacts() {
  const { user, status, getAccessToken } = useAuth();
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (status === "loading") {
      return;
    }
    if (!user || user.role !== "admin") {
      setContacts([]);
      setLoading(false);
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const rows = await fetchAdminContacts(token);
      setContacts(rows);
      setError(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not load contact messages.",
      );
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, status, user]);

  useEffect(() => {
    // The admin session is tab-local, so the request runs after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const setStatus = useCallback(
    async (id: string, nextStatus: ContactStatus) => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to update contact messages.");
      }
      const updated = await setContactStatusRequest(id, nextStatus, token);
      setContacts((previous) =>
        previous.map((message) => (message.id === id ? updated : message)),
      );
      return updated;
    },
    [getAccessToken],
  );

  return { contacts, loading, error, refresh, setStatus };
}

export function useProviderServices(providerId: string | undefined) {
  const { user, status, getAccessToken } = useAuth();
  const [services, setServices] = useState<ProviderServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (status === "loading") {
      return;
    }
    if (!user || user.role !== "provider" || !providerId) {
      setServices([]);
      setLoading(false);
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const rows = await fetchProviderServices(token);
      setServices(rows);
      setError(null);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not load your services.",
      );
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, providerId, status, user]);

  useEffect(() => {
    // Provider services are scoped to the tab-local access token.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const saveService = useCallback(
    async (service: ProviderServiceRecord): Promise<ProviderServiceRecord> => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to save this service.");
      }

      const payload = {
        title: service.title,
        description: service.description,
        categorySlug: service.categorySlug,
        price: service.price,
        priceUnit: service.priceUnit,
        image: service.image,
        tags: service.tags,
        includes: service.includes,
        featured: service.featured,
        status: service.status,
      };

      const exists = services.some((item) => item.id === service.id);
      const saved = exists
        ? await updateProviderService(service.id, payload, token)
        : await createProviderService(payload, token);

      setServices((previous) => {
        const rest = previous.filter(
          (item) => item.id !== service.id && item.id !== saved.id,
        );
        return [saved, ...rest].sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt),
        );
      });
      return saved;
    },
    [getAccessToken, services],
  );

  const deleteService = useCallback(
    async (id: string) => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to delete this service.");
      }
      await deleteProviderService(id, token);
      setServices((previous) =>
        previous.filter((service) => service.id !== id),
      );
    },
    [getAccessToken],
  );

  return {
    services,
    loading,
    error,
    refresh,
    saveService,
    deleteService,
  };
}

export function useAvailability(providerId: string | undefined) {
  const { user, status, getAccessToken } = useAuth();
  const [rules, setRules] = useState<AvailabilityRule[]>(DEFAULT_AVAILABILITY);
  const [blocked, setBlocked] = useState<BlockedDateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (status === "loading") {
      return;
    }
    if (
      !user ||
      user.role !== "provider" ||
      (providerId && user.providerId && user.providerId !== providerId)
    ) {
      setRules(DEFAULT_AVAILABILITY);
      setBlocked([]);
      setLoading(false);
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await fetchAvailability(token);
      setRules(data.rules);
      setBlocked(data.blockedDates);
      setError(null);
    } catch (requestError) {
      setError(
        apiErrorMessage(requestError, "Could not load your availability."),
      );
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, providerId, status, user]);

  useEffect(() => {
    // Availability is scoped to the tab-local provider session.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const saveRules = useCallback(
    async (next: AvailabilityRule[]): Promise<AvailabilityRule[]> => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to save your availability.");
      }
      const data = await saveAvailabilityRulesRequest(next, token);
      setRules(data.rules);
      setBlocked(data.blockedDates);
      setError(null);
      return data.rules;
    },
    [getAccessToken],
  );

  const addBlockedDate = useCallback(
    async (date: string, reason: string): Promise<BlockedDateRecord> => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to block a date.");
      }
      const created = await addBlockedDateRequest(date, reason, token);
      setBlocked((previous) =>
        [...previous.filter((item) => item.date !== created.date), created].sort(
          (a, b) => a.date.localeCompare(b.date),
        ),
      );
      setError(null);
      return created;
    },
    [getAccessToken],
  );

  const removeBlockedDate = useCallback(
    async (id: string): Promise<void> => {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("Sign in again to unblock a date.");
      }
      await removeBlockedDateRequest(id, token);
      setBlocked((previous) => previous.filter((item) => item.id !== id));
      setError(null);
    },
    [getAccessToken],
  );

  return {
    rules,
    saveRules,
    blocked,
    addBlockedDate,
    removeBlockedDate,
    loading,
    error,
    refresh,
  };
}
