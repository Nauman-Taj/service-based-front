import { Quote, Star } from "lucide-react";

import Avatar from "@/components/common/Avatar";
import SectionHeading from "@/components/common/SectionHeading";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  const featured = testimonials.slice(0, 3);

  return (
    <section className="border-y border-line bg-card py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Reviews"
          title="What customers are saying"
          description="Real feedback from verified bookings across Multan."
          align="center"
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {featured.map((testimonial) => (
            <figure
              key={testimonial.id}
              className="flex h-full flex-col rounded-2xl border border-line bg-background p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={
                        index < testimonial.rating
                          ? "h-4 w-4 fill-primary text-primary"
                          : "h-4 w-4 text-line"
                      }
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <Quote className="h-6 w-6 text-primary/30" aria-hidden="true" />
              </div>

              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-body">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <Avatar name={testimonial.name} size="md" />
                <div>
                  <p className="text-sm font-semibold text-heading">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted">{testimonial.role}</p>
                  <p className="mt-0.5 text-xs font-medium text-primary">
                    {testimonial.service}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-muted">
          <Star
            className="h-4 w-4 fill-primary text-primary"
            aria-hidden="true"
          />
          Rated <span className="font-semibold text-heading">4.9 out of 5</span>{" "}
          from 1,900+ verified reviews
        </p>
      </div>
    </section>
  );
}
