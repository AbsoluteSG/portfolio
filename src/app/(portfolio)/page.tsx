import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";
import { JsonLd } from "@/components/shared/json-ld";
import { buildHomeJsonLd } from "@/lib/seo/json-ld";

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildHomeJsonLd()} />
      <Hero />
      <Projects />
      <About />
      <Experience />
      <Contact />
    </>
  );
}
