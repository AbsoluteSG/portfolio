"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { SectionHeading } from "@/components/shared/section-heading";
import { TimelineItem } from "@/components/shared/timeline-item";
import { experiences } from "@/data/experience";

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          title="Experience"
          subtitle="Where I've worked and what I've done"
        />

        <div ref={containerRef} className="relative">
          {/* Animated timeline line (desktop only) */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border md:block">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-primary"
            />
          </div>

          <div className="space-y-16">
            {experiences.map((exp, index) => (
              <TimelineItem key={exp.id} experience={exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
