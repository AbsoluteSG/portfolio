"use client";

import { ScrollReveal } from "./scroll-reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export function SectionHeading({ eyebrow, title, subtitle }: SectionHeadingProps) {
  return (
    <ScrollReveal className="mb-12 max-w-3xl md:mb-16">
      <p className="text-sm font-medium tracking-[0.18em] text-primary uppercase">{eyebrow}</p>
      <h2 className="font-display mt-3 text-4xl md:text-5xl lg:text-6xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-muted-foreground md:text-xl">{subtitle}</p>}
    </ScrollReveal>
  );
}
