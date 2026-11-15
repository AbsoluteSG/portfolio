import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { projects } from "@/data/projects";
import { chapters as algorithmChapters } from "./(courses)/algo/_course";
import { chapters as linearAlgebraChapters } from "./(courses)/linalg/_course";

/** Every public, indexable route. Planned course chapters are left out until they have content. */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteConfig.url}${path}`;

  const projectPages = projects
    .flatMap((p) => (p.page ? [p.page] : []))
    .concat("/projects/vrox")
    .map((path) => ({ url: url(path), changeFrequency: "monthly" as const, priority: 0.8 }));

  const coursePages = [
    { base: "/linalg", chapters: linearAlgebraChapters },
    { base: "/algo", chapters: algorithmChapters },
  ].flatMap(({ base, chapters }) => [
    { url: url(base), changeFrequency: "monthly" as const, priority: 0.6 },
    ...chapters
      .filter((c) => c.status !== "planned")
      .map((c) => ({ url: url(`${base}/${c.slug}`), changeFrequency: "monthly" as const, priority: 0.5 })),
  ]);

  return [
    { url: siteConfig.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...projectPages,
    ...coursePages,
  ];
}
