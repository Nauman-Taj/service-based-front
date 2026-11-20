import { BadgeCheck } from "lucide-react";

import Avatar from "@/components/common/Avatar";
import StarRating from "@/components/common/StarRating";
import { formatDate } from "@/utils/formatDate";
import type { Review } from "@/types/review";
import type { Service } from "@/types/service";

interface ServiceReviewsProps {
  service: Service;
  reviews: Review[];
}

export default function ServiceReviews({
  service,
  reviews,
}: ServiceReviewsProps) {
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter(
      (review) => Math.round(review.rating) === star,
    ).length;

    return {
      star,
      percent: reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0,
    };
  });

  return (
    <section aria-labelledby="reviews" className="border-t border-line pt-10">
      <h2
        id="reviews"
        className="text-xl font-bold tracking-tight text-heading sm:text-2xl"
      >
        Customer reviews
      </h2>
      <p className="mt-1 text-sm text-muted">
        {service.reviewCount} verified reviews &middot;{" "}
        {service.rating.toFixed(1)} average
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="h-fit rounded-2xl border border-line bg-card p-5">
          <p className="text-4xl font-bold text-heading">
            {service.rating.toFixed(1)}
          </p>
          <StarRating rating={service.rating} className="mt-2" />
          <p className="mt-2 text-xs text-muted">
            Based on {service.reviewCount} verified reviews
          </p>

          <div className="mt-4 space-y-2">
            {distribution.map((item) => (
              <div
                key={item.star}
                className="flex items-center gap-2 text-xs"
              >
                <span className="w-3 text-muted">{item.star}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-highlight"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <span className="w-9 text-right text-muted">
                  {item.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <ul className="space-y-5">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="rounded-2xl border border-line bg-card p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar name={review.author} size="md" />
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-heading">
                      {review.author}
                      {review.verified ? (
                        <BadgeCheck
                          className="h-4 w-4 text-primary"
                          aria-label="Verified booking"
                        />
                      ) : null}
                    </p>
                    <p className="text-xs text-muted">
                      {review.location} &middot; {formatDate(review.date)}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-heading">
                {review.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {review.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
