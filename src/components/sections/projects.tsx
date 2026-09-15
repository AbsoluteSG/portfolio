"use client";

import { SectionHeading } from "@/components/shared/section-heading";
import { ProjectCard } from "@/components/shared/project-card";
import { projects } from "@/data/projects";

export function Projects() {
  const featured = projects.find((p) => p.featured);
  const others = projects.filter((p) => p !== featured);

  return (
    <section id="projects" className="border-t border-border px-6 py-24 md:py-32 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Work" title="Shipped, and in progress." />

        {featured && (
          <div className="mb-20 md:mb-24">
            <ProjectCard project={featured} index={0} featured />
          </div>
        )}

        <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
          {others.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
