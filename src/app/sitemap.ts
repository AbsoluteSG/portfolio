import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = projects
    .filter((p) => p.page)
    .map((p) => ({ url: `${siteConfig.url}${p.page}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 }));
  return [{ url: siteConfig.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }, ...pages];
}
