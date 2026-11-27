import SectionHeading from "@/components/common/SectionHeading";
import ProviderCard from "@/components/services/ProviderCard";
import type { Provider } from "@/types/provider";

interface FeaturedProvidersProps {
  providers: Provider[];
}

export default function FeaturedProviders({
  providers,
}: FeaturedProvidersProps) {
  const featured = providers.slice(0, 4);

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Meet the pros"
          title="Featured service providers"
          description="Independent professionals and small teams with outstanding track records."
          action={{ label: "See all services", href: "/services" }}
        />

        {featured.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted">
            Provider profiles will appear here as professionals join Quicker.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {featured.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
