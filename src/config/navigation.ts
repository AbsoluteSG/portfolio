import { siteConfig } from "./site";

export interface NavLink {
  label: string;
  href: string;
}

/** Top navigation. Hash links scroll the home page; anything else is a route or a file. */
export const navLinks: NavLink[] = [
  { label: "Work", href: "/#projects" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
  { label: "Resume", href: siteConfig.resumePath },
];
