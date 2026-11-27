import SectionHeading from "@/components/common/SectionHeading";
import CategoryCard from "@/components/services/CategoryCard";
import type { Category } from "@/types/category";

interface CategoriesSectionProps {
  categories: Category[];
}

export default function CategoriesSection({
  categories,
}: CategoriesSectionProps) {
  return (
    <section className="border-y border-line bg-card py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Browse by category"
          title="Popular services, on demand"
          description="From everyday upkeep to one-off projects, find the right specialist for the job."
          action={{ label: "View all services", href: "/services" }}
        />

        {categories.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted">
            Categories will appear here as soon as they are published.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
