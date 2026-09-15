"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ArrowRight, ExternalLink, Github } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProjectCard } from "@/components/shared/project-card";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/data/projects";

export function Projects() {
  const featured = projects.find((p) => p.featured);
  const others = projects.filter((p) => !p.featured);
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="projects" className="bg-muted/30 py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          title="Projects"
          subtitle="A selection of things I've built"
        />

        {/* Featured Project */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="mb-14"
          >
            <p className="mb-4 text-sm font-semibold tracking-widest text-primary uppercase">
              Featured Project
            </p>
            <div className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-xl">
              <div
                className="cursor-pointer"
                onClick={() => setExpanded((v) => !v)}
              >
                <div className="grid md:grid-cols-2">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden bg-muted md:aspect-auto md:min-h-[460px]">
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center p-10 md:p-12">
                    <h3 className="text-3xl font-bold md:text-4xl lg:text-5xl">
                      {featured.title}
                    </h3>
                    <p className="mt-5 text-lg leading-relaxed text-muted-foreground md:text-xl">
                      {featured.description}
                    </p>

                    <div className="mt-7 flex flex-wrap gap-2">
                      {featured.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-base text-muted-foreground">
                      <motion.div
                        animate={{ rotate: expanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="size-5" />
                      </motion.div>
                      <span>
                        {expanded ? "Collapse" : "Learn more"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expandable dropdown */}
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border px-10 py-8 md:px-12 md:py-10">
                      <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
                        {featured.longDescription}
                      </p>

                      <div className="mt-8 flex flex-wrap items-center gap-3">
                        {featured.slug && (
                          <Link
                            href={`/blog/${featured.slug}`}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                          >
                            View Case Study
                            <ArrowRight className="size-5" />
                          </Link>
                        )}
                        {featured.github && (
                          <a
                            href={featured.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-base font-medium transition-colors hover:bg-muted"
                          >
                            <Github className="size-5" />
                            Source
                          </a>
                        )}
                        {featured.liveUrl && (
                          <a
                            href={featured.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-base font-medium transition-colors hover:bg-muted"
                          >
                            <ExternalLink className="size-5" />
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Other Projects */}
        {others.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {others.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
