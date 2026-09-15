"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { slideInFromLeft, slideInFromRight } from "@/lib/motion";
import type { Experience } from "@/types";

interface TimelineItemProps {
  experience: Experience;
  index: number;
}

export function TimelineItem({ experience, index }: TimelineItemProps) {
  const isLeft = index % 2 === 0;

  return (
    <div className="relative grid grid-cols-[1fr] gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-12">
      {/* Left content (or empty on odd items) */}
      <div
        className={`${isLeft ? "md:text-right" : "md:order-3"} hidden md:block`}
      >
        {isLeft ? (
          <ScrollReveal variants={slideInFromLeft}>
            <TimelineContent experience={experience} />
          </ScrollReveal>
        ) : (
          <ScrollReveal variants={slideInFromRight}>
            <p className="pt-2 text-base font-medium text-muted-foreground md:text-lg">
              {experience.startDate} &mdash; {experience.endDate}
            </p>
          </ScrollReveal>
        )}
      </div>

      {/* Center dot */}
      <div className="relative hidden items-start justify-center md:flex">
        <div className="mt-3 size-4 rounded-full border-2 border-primary bg-background" />
      </div>

      {/* Right content (or empty on even items) */}
      <div className={`${isLeft ? "md:order-3" : ""} hidden md:block`}>
        {isLeft ? (
          <ScrollReveal variants={slideInFromRight}>
            <p className="pt-2 text-base font-medium text-muted-foreground md:text-lg">
              {experience.startDate} &mdash; {experience.endDate}
            </p>
          </ScrollReveal>
        ) : (
          <ScrollReveal variants={slideInFromLeft}>
            <TimelineContent experience={experience} />
          </ScrollReveal>
        )}
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        <ScrollReveal>
          <p className="mb-2 text-base font-medium text-muted-foreground">
            {experience.startDate} &mdash; {experience.endDate}
          </p>
          <TimelineContent experience={experience} />
        </ScrollReveal>
      </div>
    </div>
  );
}

function TimelineContent({ experience }: { experience: Experience }) {
  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-semibold md:text-3xl">{experience.role}</h3>
      {experience.companyUrl ? (
        <a
          href={experience.companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-medium text-primary hover:underline md:text-lg"
        >
          {experience.company}
        </a>
      ) : (
        <p className="text-base font-medium text-primary md:text-lg">{experience.company}</p>
      )}
      <ul className="space-y-2 text-base leading-relaxed text-muted-foreground md:text-lg">
        {experience.description.map((item, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
            {item}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 pt-2">
        {experience.technologies.map((tech) => (
          <Badge key={tech} variant="secondary" className="text-sm">
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  );
}
