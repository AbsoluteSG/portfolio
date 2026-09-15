import { Github, Linkedin, Mail } from "lucide-react";
import { socialLinks } from "@/data/social-links";
import { siteConfig } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Email: Mail,
};

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div>
            <p className="font-display text-2xl">{siteConfig.name}</p>
            <p className="text-sm text-muted-foreground">{siteConfig.title}</p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.name];
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={link.name}
                >
                  {Icon && <Icon className="size-5" />}
                </a>
              );
            })}
          </div>
        </div>

        <Separator className="my-6" />

        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
