import { SectionHeading } from "@/components/shared/section-heading";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { SocialIcon } from "@/components/shared/social-icon";
import { socialLinks } from "@/config/site";
import { externalLinkProps } from "@/lib/links";
import { ContactForm } from "./contact-form";

export function Contact() {
  return (
    <section id="contact" className="border-t border-border px-6 py-24 md:py-32 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Contact" title="Get in touch." />

        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          <ScrollReveal>
            <div className="space-y-8">
              <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
                Hiring, or want to talk about any of the projects above? Email is fastest.
                I reply to everything.
              </p>

              <ul className="space-y-5">
                {socialLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      {...externalLinkProps(link.href)}
                      className="flex items-center gap-4 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <SocialIcon id={link.id} className="size-6" />
                      <span className="text-lg font-medium">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
