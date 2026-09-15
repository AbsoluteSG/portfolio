"use client";

import { motion } from "motion/react";
import { GraduationCap } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SkillBadge } from "@/components/shared/skill-badge";
import { skills } from "@/data/skills";
import { staggerContainer } from "@/lib/motion";

const categories = [
  { key: "language" as const, label: "Languages" },
  { key: "gamedev" as const, label: "Game Development" },
  { key: "tool" as const, label: "Tools & Software" },
];

export function About() {
  return (
    <section id="about" className="py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          title="About Me"
          subtitle="A bit about who I am and what I work with"
        />

        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          {/* Bio */}
          <ScrollReveal>
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
              <p>
                I&apos;m a software engineer finishing my CS degree at CUNY (Dec 2026)
                and the founder of a small indie studio, Siphon Games. I&apos;ve shipped
                a commercial game on Steam, built a production payroll app that a
                tutoring business runs on every day, and I&apos;m leading engineering
                on No Dogs Allowed, a 2D cooking Metroidvania.
              </p>
              <p>
                What I like most is owning a system end to end — requirements, data
                model, the code, the deploy, and the tooling that keeps it healthy.
                My day-to-day languages are C# and TypeScript, with Rust and C++ for
                the low-level projects. I&apos;m looking for an entry-level software
                engineering role starting January 2027 (open to earlier).
              </p>

              <div className="flex items-center gap-4 pt-6">
                <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10">
                  <GraduationCap className="size-7 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground">
                    B.S. Computer Science
                  </p>
                  <p className="text-base text-muted-foreground">
                    CUNY College of Staten Island &middot; Expected Dec 2026
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Skills */}
          <div className="space-y-8">
            {categories.map((cat, catIndex) => (
              <ScrollReveal key={cat.key} delay={catIndex * 0.1}>
                <h3 className="mb-4 text-base font-semibold tracking-wider text-muted-foreground uppercase">
                  {cat.label}
                </h3>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="flex flex-wrap gap-2.5"
                >
                  {skills
                    .filter((s) => s.category === cat.key)
                    .map((skill) => (
                      <SkillBadge key={skill.name} name={skill.name} />
                    ))}
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
