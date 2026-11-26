"use client";

import { useCallback, useMemo } from "react";

import type { AdminReviewRow } from "@/components/admin/ReviewsTable";
import { useDashboardReviews } from "@/hooks/usePortalData";
import type { ReviewStatus } from "@/types/dashboard";

/** Admin moderation view over the reviews returned by the NestJS API. */
export function useAdminReviewModeration() {
  const {
    reviews,
    loading,
    error,
    setReviewStatus,
    deleteReview,
  } = useDashboardReviews();

  const rows = useMemo<AdminReviewRow[]>(
    () =>
      reviews
        .map((review) => ({ ...review }))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [reviews],
  );

  const setStatus = useCallback(
    async (row: AdminReviewRow, status: ReviewStatus) => {
      await setReviewStatus(row.id, status);
    },
    [setReviewStatus],
  );

  const deleteRow = useCallback(
    async (row: AdminReviewRow) => {
      await deleteReview(row.id);
    },
    [deleteReview],
  );

  return { rows, loading, error, setStatus, deleteRow };
}
