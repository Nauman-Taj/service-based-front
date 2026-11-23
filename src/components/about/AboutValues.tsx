import SectionHeading from "@/components/common/SectionHeading";
import { aboutValues } from "@/data/about";

export default function AboutValues() {
  return (
    <section className="border-y border-line bg-card py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What we stand for"
          title="Four things we refuse to compromise on"
          description="These principles shape every provider we approve, every price we show and every booking we support."
          align="center"
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {aboutValues.map((value) => {
            const Icon = value.icon;

            return (
              <article
                key={value.title}
                className="flex h-full flex-col rounded-2xl border border-line bg-background p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-heading">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
