"use client";

import { useMemo, useState } from "react";
import {
  MessageSquareQuote,
  ShieldCheck,
  Star,
} from "lucide-react";

import Avatar from "@/components/common/Avatar";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import DashboardIntro from "@/components/common/DashboardIntro";
import EmptyState from "@/components/common/EmptyState";
import Pagination from "@/components/common/Pagination";
import Select from "@/components/common/Select";
import StarRating from "@/components/common/StarRating";
import { useManagedProviderServices } from "@/components/provider/provider-service-data";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardReviews } from "@/hooks/usePortalData";
import { usePagination } from "@/hooks/usePagination";
import { formatDate } from "@/utils/formatDate";

interface ReviewItem {
  id: string;
  serviceName: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

export default function ProviderReviews() {
  const { user } = useAuth();
  const { services } = useManagedProviderServices(user?.providerId);
  const { reviews } = useDashboardReviews();
  const [ratingFilter, setRatingFilter] = useState("all");

  const serviceNames = useMemo(
    () => new Map(services.map((service) => [service.id, service.title])),
    [services],
  );
  const serviceTitles = useMemo(
    () => new Set(services.map((service) => service.title)),
    [services],
  );

  const items = useMemo<ReviewItem[]>(() => {
    return reviews
      .filter(
        (review) =>
          serviceNames.has(review.serviceId) ||
          serviceTitles.has(review.serviceName.trim()),
      )
      .map<ReviewItem>((review) => ({
        id: review.id,
        serviceName: serviceNames.get(review.serviceId) ?? review.serviceName,
        author: review.author,
        location: review.location,
        rating: review.rating,
        title: review.title,
        body: review.body,
        date: review.date,
        verified: review.verified,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [reviews, serviceNames, serviceTitles]);

  const average = items.length
    ? items.reduce((sum, review) => sum + review.rating, 0) / items.length
    : 0;

  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: items.filter((review) => review.rating === stars).length,
  }));

  const filtered = useMemo(
    () =>
      ratingFilter === "all"
        ? items
        : items.filter((review) => review.rating === Number(ratingFilter)),
    [items, ratingFilter],
  );
  const { pageItems, page, totalPages, setPage } = usePagination(filtered, 6);

  return (
    <div className="space-y-8">
      <DashboardIntro
        title="Reviews"
        description="See what customers say about your services."
      />

      {items.length === 0 ? (
        <EmptyState
          icon={MessageSquareQuote}
          title="No reviews yet"
          description="Reviews for your services will appear here once customers leave feedback."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <section className="rounded-2xl border border-line bg-card p-6 text-center shadow-sm">
              <p className="text-5xl font-bold tracking-tight text-heading">
                {average.toFixed(1)}
              </p>
              <div className="mt-3 flex justify-center">
                <StarRating rating={average} />
              </div>
              <p className="mt-3 text-sm text-muted">
                Based on {items.length}{" "}
                {items.length === 1 ? "review" : "reviews"}
              </p>
            </section>

            <section className="rounded-2xl border border-line bg-card p-5 shadow-sm">
              <h3 className="text-sm font-bold text-heading">
                Rating breakdown
              </h3>
              <div className="mt-4 space-y-3">
                {distribution.map((row) => (
                  <div key={row.stars} className="flex items-center gap-3">
                    <span className="flex w-8 items-center gap-1 text-xs font-semibold text-heading">
                      {row.stars}
                      <Star
                        className="h-3 w-3 fill-highlight text-highlight"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <span
                        className="block h-full rounded-full bg-highlight"
                        style={{
                          width: `${items.length ? (row.count / items.length) * 100 : 0}%`,
                        }}
                      />
                    </span>
                    <span className="w-6 text-right text-xs text-muted">
                      {row.count}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          <div className="space-y-5">
            <div className="w-full sm:w-64">
              <Select
                label="Filter by rating"
                value={ratingFilter}
                onChange={(event) => setRatingFilter(event.target.value)}
              >
                <option value="all">All ratings</option>
                {[5, 4, 3, 2, 1].map((stars) => (
                  <option key={stars} value={stars}>
                    {stars} stars
                  </option>
                ))}
              </Select>
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon={MessageSquareQuote}
                title="No reviews with that rating"
                description="Choose a different rating to see more feedback."
                action={
                  <Button variant="outline" onClick={() => setRatingFilter("all")}>
                    Show all reviews
                  </Button>
                }
              />
            ) : (
              <>
                <div className="grid gap-5">
                  {pageItems.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-2xl border border-line bg-card p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={review.author} size="md" />
                          <div>
                            <p className="text-sm font-semibold text-heading">
                              {review.author}
                            </p>
                            <p className="mt-0.5 text-xs text-muted">
                              {review.location}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <StarRating rating={review.rating} />
                          <p className="mt-1 text-xs text-muted">
                            {formatDate(review.date)}
                          </p>
                        </div>
                      </div>

                      <h3 className="mt-4 font-bold text-heading">
                        {review.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-body">
                        {review.body}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="neutral">{review.serviceName}</Badge>
                          {review.verified ? (
                            <Badge variant="success">
                              <ShieldCheck
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                              />
                              Verified
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onChange={setPage}
                  className="mt-2"
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
