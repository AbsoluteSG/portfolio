export type ProjectCategory = "web" | "game" | "tool";

/** Where a project stands today. Shown on the card so readers can tell shipped work from prototypes. */
export type ProjectStatus = "shipped" | "in-production" | "in-development" | "prototype";

export interface Project {
  /** Stable kebab-case id; also used as the React key and the anchor on the home page. */
  id: string;
  title: string;
  /** One or two sentences for the card. */
  description: string;
  /** Technical summary used by structured data and anywhere a longer description fits. */
  longDescription?: string;
  /** Path under /public. */
  image: string;
  /** Alt text for the cover image; defaults to the title. */
  imageAlt?: string;
  tags: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  /** Year range shown on the card, e.g. "2023–2026". */
  period: string;
  github?: string;
  liveUrl?: string;
  /** Standalone landing page route under /projects. */
  page?: string;
  featured?: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  startDate: string;
  endDate: string | "Present";
  description: string[];
  technologies: string[];
}

export type SkillCategory = "language" | "gamedev" | "tool";

export interface Skill {
  name: string;
  category: SkillCategory;
}
