"use client";

import { Check, Trash2, X } from "lucide-react";

import Badge from "@/components/common/Badge";
import StarRating from "@/components/common/StarRating";
import { formatDate } from "@/utils/formatDate";
import type { ReviewStatus } from "@/types/dashboard";

export interface AdminReviewRow {
  id: string;
  serviceId: string;
  serviceName: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  status: ReviewStatus;
  source: "mock" | "local";
}

interface ReviewsTableProps {
  reviews: AdminReviewRow[];
  onApprove: (review: AdminReviewRow) => void;
  onReject: (review: AdminReviewRow) => void;
  onDelete: (review: AdminReviewRow) => void;
}

const statusLabels: Record<ReviewStatus, string> = {
  published: "Published",
  pending: "Pending",
  rejected: "Rejected",
};

/** Moderation table for mock and locally submitted reviews. */
export default function ReviewsTable({
  reviews,
  onApprove,
  onReject,
  onDelete,
}: ReviewsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-background text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-3 font-semibold">Review</th>
            <th className="px-5 py-3 font-semibold">Service</th>
            <th className="px-5 py-3 font-semibold">Rating</th>
            <th className="px-5 py-3 font-semibold">Submitted</th>
            <th className="px-5 py-3 font-semibold">Status</th>
            <th className="px-5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr
              key={review.id}
              className="border-b border-line align-top last:border-0 hover:bg-background"
            >
              <td className="max-w-sm px-5 py-4">
                <p className="font-semibold text-heading">{review.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                  {review.body}
                </p>
                <p className="mt-1.5 text-xs text-muted">
                  {review.author} &middot; {review.location}
                  {review.verified ? " · Verified" : ""}
                </p>
              </td>
              <td className="px-5 py-4 text-muted">{review.serviceName}</td>
              <td className="px-5 py-4">
                <StarRating rating={review.rating} starClassName="h-3.5 w-3.5" />
                <span className="mt-1 block text-xs text-muted">
                  {review.rating.toFixed(1)} / 5
                </span>
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-muted">
                {formatDate(review.date)}
              </td>
              <td className="px-5 py-4">
                <Badge
                  variant={
                    review.status === "published"
                      ? "success"
                      : review.status === "pending"
                        ? "gold"
                        : "neutral"
                  }
                >
                  {statusLabels[review.status]}
                </Badge>
                <span className="mt-1.5 block text-xs text-muted">
                  {review.source === "mock" ? "Marketplace data" : "Local"}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onApprove(review)}
                    disabled={review.status === "published"}
                    aria-label={`Approve review by ${review.author}`}
                    title="Approve"
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-heading transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => onReject(review)}
                    disabled={review.status === "rejected"}
                    aria-label={`Reject review by ${review.author}`}
                    title="Reject"
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-heading transition-colors hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(review)}
                    aria-label={`Delete review by ${review.author}`}
                    title="Delete"
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-muted transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
