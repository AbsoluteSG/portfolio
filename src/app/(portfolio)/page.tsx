import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <About />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
