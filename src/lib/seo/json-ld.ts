import { siteConfig } from "@/config/site";
import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";

/**
 * schema.org structured data for the home page. Search engines use it to build the knowledge
 * panel for a person: name, job title, school, employer, profiles, and their creative work.
 */
export function buildHomeJsonLd() {
  const personId = `${siteConfig.url}/#person`;
  const absolute = (path: string) => (path.startsWith("http") ? path : `${siteConfig.url}${path}`);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: siteConfig.name,
        url: siteConfig.url,
        jobTitle: siteConfig.jobTitle,
        description: siteConfig.description,
        email: `mailto:${siteConfig.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: siteConfig.location.city,
          addressRegion: siteConfig.location.region,
          addressCountry: siteConfig.location.country,
        },
        alumniOf: { "@type": "CollegeOrUniversity", name: siteConfig.education.school },
        worksFor: { "@type": "Organization", name: siteConfig.studio.name },
        knowsAbout: skills.map((s) => s.name),
        sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
        hasOccupation: experiences.map((e) => ({ "@type": "Occupation", name: e.role, description: e.description[0] })),
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteConfig.url}/#profile`,
        url: siteConfig.url,
        mainEntity: { "@id": personId },
        hasPart: {
          "@type": "ItemList",
          name: "Projects",
          itemListElement: projects.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": p.category === "game" ? "VideoGame" : "SoftwareSourceCode",
              name: p.title,
              description: p.longDescription ?? p.description,
              url: absolute(p.page ?? `/#${p.id}`),
              image: absolute(p.image),
              keywords: p.tags.join(", "),
              author: { "@id": personId },
              ...(p.github ? { codeRepository: p.github } : {}),
            },
          })),
        },
      },
    ],
  };
}
