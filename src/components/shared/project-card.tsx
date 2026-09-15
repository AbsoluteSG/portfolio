"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  index: number;
  featured?: boolean;
}

const externalProps = (href: string) => (href.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" });

export function ProjectCard({ project, index, featured = false }: ProjectCardProps) {
  const detailHref = project.page;
  const liveLabel = project.liveUrl?.includes("steampowered") ? "Steam" : project.liveUrl?.startsWith("/") ? "Site" : "Live";

  const image = (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-muted ${featured ? "aspect-[4/3] md:aspect-auto md:h-full" : "aspect-video"}`}>
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes={featured ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 50vw"}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
    </div>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 3) * 0.08 }}
      className={`group ${featured ? "grid gap-6 md:grid-cols-[1.35fr_1fr] md:gap-10" : ""}`}
    >
      {detailHref ? <Link href={detailHref} className="block">{image}</Link> : image}

      <div className={featured ? "flex flex-col justify-center" : "mt-5"}>
        <h3 className={`font-display ${featured ? "text-4xl md:text-5xl" : "text-3xl"}`}>
          {detailHref ? <Link href={detailHref} className="hover:text-primary">{project.title}</Link> : project.title}
        </h3>
        <p className={`mt-3 leading-relaxed text-muted-foreground ${featured ? "text-lg" : "text-base"}`}>{project.description}</p>
        <p className="mt-4 text-sm text-muted-foreground/80">{project.tags.join(" · ")}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
          {detailHref && (
            <Link href={detailHref} className="inline-flex items-center gap-1 underline-offset-4 hover:underline">
              Visit <ArrowUpRight className="size-4" />
            </Link>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} {...externalProps(project.liveUrl)} className="inline-flex items-center gap-1 underline-offset-4 hover:underline">
              {liveLabel} <ArrowUpRight className="size-4" />
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline-offset-4 hover:underline">
              <Github className="size-4" /> Code
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
