"use client";

import { ScrollReveal } from "./scroll-reveal";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <ScrollReveal className="mb-16 text-center md:mb-20">
      <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">{subtitle}</p>
      )}
    </ScrollReveal>
  );
}
