import SectionHeading from "@/components/common/SectionHeading";
import ServiceCard from "@/components/services/ServiceCard";
import type { Service } from "@/types/service";

interface FeaturedServicesProps {
  services: Service[];
}

export default function FeaturedServices({
  services,
}: FeaturedServicesProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured services"
          title="Hand-picked services this week"
          description="Popular bookings with consistently excellent reviews and transparent pricing."
          action={{ label: "Browse all services", href: "/services" }}
        />

        {services.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted">
            No featured services right now. Browse the full catalogue to see
            everything available.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
