import SectionHeading from "@/components/common/SectionHeading";
import ServiceCard from "@/components/services/ServiceCard";
import { featuredServices } from "@/data/services";

export default function FeaturedServices() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured services"
          title="Hand-picked services this week"
          description="Popular bookings with consistently excellent reviews and transparent pricing."
          action={{ label: "Browse all services", href: "/services" }}
        />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
