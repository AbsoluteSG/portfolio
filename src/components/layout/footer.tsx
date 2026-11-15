import { siteConfig, socialLinks } from "@/config/site";
import { externalLinkProps } from "@/lib/links";
import { SocialIcon } from "@/components/shared/social-icon";
import { Separator } from "@/components/ui/separator";

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
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                {...externalLinkProps(link.href)}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label={link.id === "email" ? "Email" : link.label}
              >
                <SocialIcon id={link.id} className="size-5" />
              </a>
            ))}
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
