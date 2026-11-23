"use client";

import { useCallback, useMemo } from "react";

import { reviews as mockReviews } from "@/data/reviews";
import { getServiceById } from "@/data/services";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDashboardReviews } from "@/hooks/usePortalData";
import { PORTAL_KEYS, writeStore } from "@/lib/portal-store";
import type { DashboardReviewRecord, ReviewStatus } from "@/types/dashboard";

import type { AdminReviewRow } from "@/components/admin/ReviewsTable";

export const ADMIN_HIDDEN_REVIEWS_KEY = "quicker:admin-hidden-reviews";
const MOCK_COPY_PREFIX = "moderated-";
const EMPTY_HIDDEN: string[] = [];

/**
 * Moderation view over mock reviews and locally submitted reviews.
 *
 * A mock review is copied into the shared local review store the first time it
 * is moderated (with a distinct id), so `setReviewStatus` and `deleteReview`
 * become the single source of truth for that record. The original mock row is
 * hidden from this admin view once copied.
 */
export function useAdminReviewModeration() {
  const { reviews: localReviews, setReviewStatus, deleteReview } =
    useDashboardReviews();
  const [hiddenIds, setHiddenIds] = useLocalStorage<string[]>(
    ADMIN_HIDDEN_REVIEWS_KEY,
    EMPTY_HIDDEN,
  );

  const rows = useMemo<AdminReviewRow[]>(() => {
    const localRows: AdminReviewRow[] = localReviews.map((review) => ({
      ...review,
      source: "local",
    }));

    const mockRows: AdminReviewRow[] = mockReviews
      .filter((review) => !hiddenIds.includes(review.id))
      .map((review) => ({
        ...review,
        serviceName: getServiceById(review.serviceId)?.title ?? review.serviceId,
        status: "published" as ReviewStatus,
        source: "mock" as const,
      }));

    return [...localRows, ...mockRows].sort((a, b) =>
      b.date.localeCompare(a.date),
    );
  }, [localReviews, hiddenIds]);

  const hideMockReview = useCallback(
    (id: string) => {
      setHiddenIds((previous) =>
        previous.includes(id) ? previous : [...previous, id],
      );
    },
    [setHiddenIds],
  );

  const setStatus = useCallback(
    (row: AdminReviewRow, status: ReviewStatus) => {
      if (row.source === "local") {
        setReviewStatus(row.id, status);
        return;
      }

      const copyId = `${MOCK_COPY_PREFIX}${row.id}`;
      const existingCopy = localReviews.find((review) => review.id === copyId);
      const record: DashboardReviewRecord = {
        id: copyId,
        serviceId: row.serviceId,
        serviceName: row.serviceName,
        author: row.author,
        location: row.location,
        rating: row.rating,
        title: row.title,
        body: row.body,
        date: row.date,
        verified: row.verified,
        status,
      };

      writeStore(
        PORTAL_KEYS.reviews,
        existingCopy
          ? localReviews.map((review) =>
              review.id === copyId ? record : review,
            )
          : [record, ...localReviews],
      );
      hideMockReview(row.id);
    },
    [localReviews, setReviewStatus, hideMockReview],
  );

  const deleteRow = useCallback(
    (row: AdminReviewRow) => {
      if (row.source === "local") {
        deleteReview(row.id);
        return;
      }

      const copyId = `${MOCK_COPY_PREFIX}${row.id}`;
      if (localReviews.some((review) => review.id === copyId)) {
        deleteReview(copyId);
      }
      hideMockReview(row.id);
    },
    [localReviews, deleteReview, hideMockReview],
  );

  return { rows, setStatus, deleteRow };
}
