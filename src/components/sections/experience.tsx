"use client";

import { SectionHeading } from "@/components/shared/section-heading";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { experiences } from "@/data/experience";

export function Experience() {
  return (
    <section id="experience" className="border-t border-border px-6 py-24 md:py-32 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Experience" title="Where I have worked." />

        <ol className="divide-y divide-border">
          {experiences.map((exp) => (
            <li key={exp.id}>
              <ScrollReveal className="grid gap-4 py-10 md:grid-cols-[220px_1fr] md:gap-10">
                <p className="text-sm font-medium text-muted-foreground md:pt-1.5">
                  {exp.startDate} — {exp.endDate}
                </p>
                <div>
                  <h3 className="font-display text-3xl">{exp.role}</h3>
                  <p className="mt-1 text-base font-medium text-primary">{exp.company}</p>
                  <ul className="mt-4 space-y-2 text-base leading-relaxed text-muted-foreground md:text-lg">
                    {exp.description.map((d, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-primary/60" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm text-muted-foreground/80">{exp.technologies.join(" · ")}</p>
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
