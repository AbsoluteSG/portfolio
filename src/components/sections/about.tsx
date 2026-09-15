"use client";

import { SectionHeading } from "@/components/shared/section-heading";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { skills } from "@/data/skills";

const categories = [
  { key: "language" as const, label: "Languages" },
  { key: "gamedev" as const, label: "Games" },
  { key: "tool" as const, label: "Web & tools" },
];

export function About() {
  return (
    <section id="about" className="border-t border-border px-6 py-24 md:py-32 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="About" title="A bit about me." />

        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:gap-20">
          <ScrollReveal>
            <div className="space-y-5 text-lg leading-relaxed text-muted-foreground md:text-xl">
              <p>
                I&apos;m finishing a CS degree at CUNY College of Staten Island (December 2026) and I run
                a small indie studio, Siphon Games. I shipped a commercial game on Steam, built a
                bookkeeping app that a tutoring studio runs on every day, and I&apos;m leading
                engineering on No Dogs Allowed, a 2D cooking Metroidvania.
              </p>
              <p>
                What I like most is owning a system end to end: requirements, data model, the code, the
                deploy, and the tooling that keeps it healthy. Before any of this I spent a year and a
                half on a university help desk, which taught me to triage fast and write things down.
              </p>
              <p>
                I&apos;m looking for an entry-level software engineering role starting January 2027,
                open to earlier, remote, or relocation.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <dl className="space-y-6">
              {categories.map((cat) => (
                <div key={cat.key}>
                  <dt className="text-sm font-medium tracking-[0.18em] text-primary uppercase">{cat.label}</dt>
                  <dd className="mt-2 text-base leading-relaxed text-muted-foreground md:text-lg">
                    {skills.filter((s) => s.category === cat.key).map((s) => s.name).join(", ")}
                  </dd>
                </div>
              ))}
              <div>
                <dt className="text-sm font-medium tracking-[0.18em] text-primary uppercase">Education</dt>
                <dd className="mt-2 text-base leading-relaxed text-muted-foreground md:text-lg">
                  B.S. Computer Science, CUNY College of Staten Island, expected December 2026
                </dd>
              </div>
            </dl>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
