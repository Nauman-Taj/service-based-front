import { Check, ShieldCheck } from "lucide-react";

import SectionHeading from "@/components/common/SectionHeading";
import { aboutStory } from "@/data/about";

export default function AboutStory() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:px-8">
        <div>
          <SectionHeading
            eyebrow={aboutStory.eyebrow}
            title={aboutStory.title}
            description="A marketplace should make hiring help simpler, not add another layer of uncertainty."
          />

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
            {aboutStory.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-6 text-sm">
            <span className="font-semibold text-heading">2023</span>
            <span className="text-muted">Founded in Multan</span>
            <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-line sm:block" />
            <span className="font-semibold text-heading">8 categories</span>
            <span className="text-muted">One trusted local marketplace</span>
          </div>
        </div>

        <div className="rounded-3xl bg-heading p-8 text-white sm:p-10">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="mt-5 text-2xl font-bold">{aboutStory.promise.title}</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">
            {aboutStory.promise.description}
          </p>

          <ul className="mt-7 space-y-4">
            {aboutStory.promise.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm leading-relaxed">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                <span className="text-slate-100">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
