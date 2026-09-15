"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  index: number;
}

/** Image + title + description. Links to the write-up when the project has one. */
function CardBody({ project }: { project: Project }) {
  const detailHref = project.page ?? (project.slug ? `/blog/${project.slug}` : undefined);
  const body = (
    <>
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {detailHref && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
            <span className="rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-black opacity-0 transition-opacity group-hover:opacity-100">
              {project.page ? "Visit Site" : "Read More"}
            </span>
          </div>
        )}
      </div>

      <div className="px-7 pt-7 md:px-8 md:pt-8">
        <h3 className="text-2xl font-semibold">{project.title}</h3>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {project.description}
        </p>
      </div>
    </>
  );

  return detailHref ? (
    <Link href={detailHref} className="block">
      {body}
    </Link>
  ) : (
    <div>{body}</div>
  );
}

/** Tags + external links. Kept outside the write-up link so anchors never nest. */
function CardFooter({ project }: { project: Project }) {
  return (
    <div className="px-7 pb-7 md:px-8 md:pb-8">
      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-sm">
            {tag}
          </Badge>
        ))}
      </div>

      {(project.github || project.liveUrl) && (
        <div className="mt-5 flex items-center gap-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label={`${project.title} on GitHub`}
            >
              <Github className="size-5" />
              Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label={`${project.title} live`}
            >
              <ExternalLink className="size-5" />
              {project.liveUrl.includes("steampowered") ? "Steam" : "Live"}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-xl"
    >
      <CardBody project={project} />
      <CardFooter project={project} />
    </motion.div>
  );
}
