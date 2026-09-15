export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  tags: string[];
  category: string;
  github?: string;
  liveUrl?: string;
  slug?: string;
  featured: boolean;
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

export interface Skill {
  name: string;
  category: "language" | "gamedev" | "tool" | "math";
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  name: string;
  url: string;
}
