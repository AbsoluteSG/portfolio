/**
 * Single source of truth for identity, URLs and contact details.
 * Everything that prints a name, link or email reads it from here.
 */
export const siteConfig = {
  name: "Alex Zaalishvili",
  title: "Software Engineer · Game Developer",
  jobTitle: "Software Engineer",
  description:
    "Software engineer and indie game developer in Brooklyn, NY. Shipped a commercial game on Steam and a production web app; B.S. Computer Science, CUNY, December 2026.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://alex-zaalishvili.vercel.app",
  locale: "en_US",
  location: { city: "Brooklyn", region: "NY", country: "US" },
  email: "alex.zvili01@gmail.com",
  resumePath: "/resume.pdf",
  links: {
    github: "https://github.com/AbsoluteSG",
    linkedin: "https://www.linkedin.com/in/alex-z01/",
  },
  studio: { name: "Siphon Games" },
  education: { school: "CUNY College of Staten Island", degree: "B.S. Computer Science", graduation: "December 2026" },
} as const;

export type SocialLinkId = "github" | "linkedin" | "email";

export interface SocialLink {
  id: SocialLinkId;
  label: string;
  href: string;
}

export const socialLinks: SocialLink[] = [
  { id: "github", label: "GitHub", href: siteConfig.links.github },
  { id: "linkedin", label: "LinkedIn", href: siteConfig.links.linkedin },
  { id: "email", label: siteConfig.email, href: `mailto:${siteConfig.email}` },
];
