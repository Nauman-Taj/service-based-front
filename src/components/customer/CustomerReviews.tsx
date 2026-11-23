"use client";

import { useState, type FormEvent } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  MessageSquare,
  PenLine,
  Star,
  Trash2,
} from "lucide-react";

import Avatar from "@/components/common/Avatar";
import Badge from "@/components/common/Badge";
import Button, { ButtonLink } from "@/components/common/Button";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";
import Input from "@/components/common/Input";
import Modal from "@/components/common/Modal";
import Select from "@/components/common/Select";
import StatCard from "@/components/common/StatCard";
import Textarea from "@/components/common/Textarea";
import { reviews as demoReviews } from "@/data/reviews";
import { getServiceById, services } from "@/data/services";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";
import { useDashboardReviews, useUserProfile } from "@/hooks/usePortalData";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types/booking";
import type { DashboardReviewRecord } from "@/types/dashboard";
import { formatDate } from "@/utils/formatDate";

interface ReviewFormState {
  target: string;
  rating: number;
  title: string;
  body: string;
}

type ReviewFormErrors = Partial<Record<keyof ReviewFormState, string>>;

const EMPTY_FORM: ReviewFormState = {
  target: "",
  rating: 0,
  title: "",
  body: "",
};

const statusMeta = {
  published: { label: "Published", variant: "success" },
  pending: { label: "Pending", variant: "gold" },
  rejected: { label: "Rejected", variant: "neutral" },
} as const;

function RatingPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          role="radio"
          aria-checked={value === rating}
          aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
          onClick={() => onChange(rating)}
          className="rounded-full p-1 transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              "h-6 w-6",
              rating <= value
                ? "fill-highlight text-highlight"
                : "text-line",
            )}
            aria-hidden="true"
          />
        </button>
      ))}
      <span className="ml-2 text-xs text-muted">
        {value > 0 ? `${value} out of 5` : "Not rated yet"}
      </span>
    </div>
  );
}

function resolveTargetLabel(target: string, bookings: Booking[]): string {
  const [kind, id] = target.split(":");
  if (kind === "booking") {
    const booking = bookings.find((item) => item.id === id);
    return booking
      ? `${booking.serviceName} - ${formatDate(booking.date)}`
      : "Selected booking";
  }
  return getServiceById(id)?.title ?? "Selected service";
}

/** Customer review list with a write/edit dialog and delete confirmation. */
export default function CustomerReviews() {
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.id);
  const { bookings } = useBookings();
  const { reviews, addReview, deleteReview } = useDashboardReviews();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ReviewFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<ReviewFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<DashboardReviewRecord | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const userName = (user?.name ?? "").trim().toLowerCase();

  const completedBookings = bookings.filter(
    (booking) =>
      booking.customerId === user?.id && booking.status === "completed",
  );

  // Locally saved reviews are editable; demo reviews are display-only.
  // Prefer the owner id when present, falling back to legacy author-only records.
  const localReviews = reviews.filter((review) =>
    review.userId
      ? review.userId === user?.id
      : review.author.trim().toLowerCase() === userName,
  );
  const localIds = new Set(localReviews.map((review) => review.id));

  const demoReviewsForUser = demoReviews
    .filter((review) => review.author.trim().toLowerCase() === userName)
    .map<DashboardReviewRecord>((review) => ({
      id: review.id,
      serviceId: review.serviceId,
      serviceName: getServiceById(review.serviceId)?.title ?? "Service",
      author: review.author,
      location: review.location,
      rating: review.rating,
      title: review.title,
      body: review.body,
      date: review.date,
      verified: review.verified,
      status: "published",
    }));

  const allReviews = [...localReviews, ...demoReviewsForUser].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const averageRating = allReviews.length
    ? allReviews.reduce((total, review) => total + review.rating, 0) /
      allReviews.length
    : 0;
  const publishedCount = allReviews.filter(
    (review) => review.status === "published",
  ).length;
  const pendingCount = allReviews.filter(
    (review) => review.status === "pending",
  ).length;

  const bookingOptions = completedBookings.map((booking) => ({
    value: `booking:${booking.id}`,
    label: `${booking.serviceName} - ${formatDate(booking.date)} (${booking.reference})`,
  }));
  const serviceOptions = services.map((service) => ({
    value: `service:${service.id}`,
    label: service.title,
  }));
  const allOptions = [...bookingOptions, ...serviceOptions];
  const targetExists = allOptions.some((option) => option.value === form.target);

  function updateField<K extends keyof ReviewFormState>(
    field: K,
    value: ReviewFormState[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function openNew() {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      target: bookingOptions[0]?.value ?? serviceOptions[0]?.value ?? "",
    });
    setErrors({});
    setNotice(null);
    setDialogOpen(true);
  }

  function openEdit(review: DashboardReviewRecord) {
    setEditingId(review.id);
    setForm({
      target: review.bookingId
        ? `booking:${review.bookingId}`
        : `service:${review.serviceId}`,
      rating: review.rating,
      title: review.title,
      body: review.body,
    });
    setErrors({});
    setNotice(null);
    setDialogOpen(true);
  }

  function validate(): ReviewFormErrors {
    const nextErrors: ReviewFormErrors = {};
    if (!form.target) {
      nextErrors.target = "Choose a booking or service.";
    }
    if (form.rating < 1) {
      nextErrors.rating = "Select a star rating.";
    }
    if (form.title.trim().length < 3) {
      nextErrors.title = "Add a title of at least 3 characters.";
    }
    if (form.body.trim().length < 10) {
      nextErrors.body = "Write at least 10 characters about your experience.";
    } else if (form.body.trim().length > 1000) {
      nextErrors.body = "Keep your review under 1000 characters.";
    }
    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const [kind, id] = form.target.split(":");
    let serviceId: string | undefined;
    let serviceName: string | undefined;
    let bookingId: string | undefined;
    let verified = false;

    if (kind === "booking") {
      const booking = bookings.find((item) => item.id === id);
      if (booking) {
        serviceId = booking.serviceId;
        serviceName = booking.serviceName;
        bookingId = booking.id;
        verified = booking.status === "completed";
      }
    } else {
      const service = getServiceById(id);
      if (service) {
        serviceId = service.id;
        serviceName = service.title;
      }
    }

    if (!serviceId || !serviceName) {
      setErrors({
        target: "That option is no longer available. Choose another one.",
      });
      return;
    }

    setSubmitting(true);
    await new Promise<void>((resolve) => window.setTimeout(resolve, 300));
    if (editingId) {
      deleteReview(editingId);
    }
    addReview({
      userId: user?.id,
      serviceId,
      serviceName,
      bookingId,
      author: user?.name ?? "Customer",
      location: profile.location?.trim() || "Multan",
      rating: form.rating,
      title: form.title.trim(),
      body: form.body.trim(),
      verified,
    });
    setSubmitting(false);
    setDialogOpen(false);
    setNotice(
      editingId
        ? "Your review has been updated."
        : "Thanks for sharing your review.",
    );
  }

  function confirmDelete() {
    if (!deleting) {
      return;
    }
    deleteReview(deleting.id);
    setNotice("Your review has been deleted.");
    setDeleting(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-heading">Your reviews</h3>
          <p className="mt-1 text-sm text-muted">
            Feedback you have shared about services and completed bookings.
          </p>
        </div>
        <Button onClick={openNew}>
          <PenLine className="h-4 w-4" aria-hidden="true" />
          Write a review
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Average rating"
          value={averageRating.toFixed(1)}
          icon={Star}
          hint="Across your reviews"
        />
        <StatCard
          label="Total reviews"
          value={String(allReviews.length)}
          icon={MessageSquare}
        />
        <StatCard
          label="Published"
          value={String(publishedCount)}
          icon={BadgeCheck}
          hint={pendingCount ? `${pendingCount} pending` : "All up to date"}
        />
      </div>

      {notice ? (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          {notice}
        </div>
      ) : null}

      {allReviews.length > 0 ? (
        <div className="space-y-4">
          {allReviews.map((review) => {
            const meta = statusMeta[review.status];
            const editable = localIds.has(review.id);

            return (
              <article
                key={review.id}
                className="rounded-2xl border border-line bg-card p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={review.author} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-heading">
                        {review.author}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {review.location || "Quicker customer"} ·{" "}
                        {formatDate(review.date)}
                      </p>
                    </div>
                  </div>
                  <Badge variant={meta.variant}>{meta.label}</Badge>
                </div>

                <div className="mt-4">
                  <StarRatingDisplay rating={review.rating} />
                  <h4 className="mt-2 text-sm font-bold text-heading">
                    {review.title}
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-body">
                    {review.body}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-muted">
                      {review.serviceName}
                    </span>
                    {review.verified ? (
                      <Badge variant="success">
                        <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                        Verified booking
                      </Badge>
                    ) : null}
                    {editable ? null : (
                      <Badge variant="neutral">Demo review</Badge>
                    )}
                  </div>
                  {editable ? (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(review)}
                      >
                        <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleting(review)}
                        aria-label={`Delete review: ${review.title}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No reviews yet"
          description="Complete a booking and share your experience, or write a review for any service you have used."
          action={
            <ButtonLink href="/customer/bookings" size="sm">
              View my bookings
            </ButtonLink>
          }
        />
      )}

      <Modal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editingId ? "Edit review" : "Write a review"}
        description={
          editingId
            ? "Update your rating and feedback."
            : "Tell other customers about a service you have used."
        }
        className="max-w-xl"
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Select
            label="Booking or service"
            value={form.target}
            disabled={Boolean(editingId)}
            onChange={(event) => updateField("target", event.target.value)}
            error={errors.target}
          >
            {!form.target ? (
              <option value="">Choose a booking or service</option>
            ) : null}
            {bookingOptions.length > 0 ? (
              <optgroup label="Completed bookings">
                {bookingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ) : null}
            <optgroup label="Services">
              {serviceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </optgroup>
            {form.target && !targetExists ? (
              <option value={form.target}>
                {resolveTargetLabel(form.target, bookings)}
              </option>
            ) : null}
          </Select>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Rating
            </p>
            <div className="mt-2">
              <RatingPicker
                value={form.rating}
                onChange={(rating) => updateField("rating", rating)}
              />
            </div>
            {errors.rating ? (
              <p role="alert" className="mt-1.5 text-xs text-red-600">
                {errors.rating}
              </p>
            ) : null}
          </div>

          <Input
            label="Review title"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            error={errors.title}
            placeholder="Sum up your experience"
            maxLength={120}
          />
          <Textarea
            label="Your review"
            value={form.body}
            onChange={(event) => updateField("body", event.target.value)}
            error={errors.body}
            placeholder="What went well? What could be better?"
            rows={4}
            maxLength={1000}
          />

          <div className="flex flex-wrap justify-end gap-3 border-t border-line pt-4">
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Saving…"
                : editingId
                  ? "Save changes"
                  : "Submit review"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete review"
        description="This removes your review from this browser. You can write a new one at any time."
        confirmLabel="Delete review"
        destructive
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}

/** Static star display used inside each review card. */
function StarRatingDisplay({ rating }: { rating: number }) {
  return (
    <span
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`Rated ${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
            star <= rating ? "fill-highlight text-highlight" : "text-line",
          )}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
