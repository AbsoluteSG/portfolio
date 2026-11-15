import { Github, Linkedin, Mail, type LucideIcon } from "lucide-react";
import type { SocialLinkId } from "@/config/site";

const icons: Record<SocialLinkId, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
};

export function SocialIcon({ id, className }: { id: SocialLinkId; className?: string }) {
  const Icon = icons[id];
  return <Icon className={className} aria-hidden />;
}
