"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/types";
import { projectStatusLabel } from "@/data/project-status";
import { externalLinkProps } from "@/lib/links";

interface ProjectCardProps {
  project: Project;
  /** Position in the list; staggers the entrance animation. */
  index: number;
  featured?: boolean;
}

const linkClass = "inline-flex items-center gap-1 underline-offset-4 hover:underline";

function liveLinkLabel(url: string) {
  if (url.includes("store.steampowered.com")) return "Steam";
  if (/\.(mp4|webm)$/i.test(url)) return "Trailer";
  return "Live";
}

export function ProjectCard({ project, index, featured = false }: ProjectCardProps) {
  const { page, liveUrl, github } = project;

  const cover = (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-muted ${featured ? "aspect-[4/3] md:aspect-auto md:h-full" : "aspect-video"}`}>
      <Image
        src={project.image}
        alt={project.imageAlt ?? project.title}
        fill
        sizes={featured ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 50vw"}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        priority={featured}
      />
    </div>
  );

  return (
    <motion.article
      id={project.id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 3) * 0.08 }}
      className={`group scroll-mt-24 ${featured ? "grid gap-6 md:grid-cols-[1.35fr_1fr] md:gap-10" : ""}`}
    >
      {page ? (
        <Link href={page} className="block" tabIndex={-1} aria-hidden>
          {cover}
        </Link>
      ) : (
        cover
      )}

      <div className={featured ? "flex flex-col justify-center" : "mt-5"}>
        <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
          {projectStatusLabel[project.status]} · {project.period}
        </p>
        <h3 className={`font-display mt-2 ${featured ? "text-4xl md:text-5xl" : "text-3xl"}`}>
          {page ? (
            <Link href={page} className="hover:text-primary">
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h3>
        <p className={`mt-3 leading-relaxed text-muted-foreground ${featured ? "text-lg" : "text-base"}`}>{project.description}</p>
        <p className="mt-4 text-sm text-muted-foreground/80">{project.tags.join(" · ")}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
          {page && (
            <Link href={page} className={linkClass}>
              Read more <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          )}
          {liveUrl && (
            <a href={liveUrl} {...externalLinkProps(liveUrl)} className={linkClass}>
              {liveLinkLabel(liveUrl)} <ArrowUpRight className="size-4" aria-hidden />
            </a>
          )}
          {github && (
            <a href={github} {...externalLinkProps(github)} className={linkClass}>
              <Github className="size-4" aria-hidden /> Code
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
