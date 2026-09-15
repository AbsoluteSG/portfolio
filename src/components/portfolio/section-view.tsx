"use client";

import { motion } from "motion/react";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";
import { Sidebar } from "./sidebar";
import type { SectionId } from "./portfolio-context";

function SectionContent({ sectionId }: { sectionId: SectionId }) {
  switch (sectionId) {
    case "about":
      return <About />;
    case "projects":
      return <Projects />;
    case "experience":
      return <Experience />;
    case "contact":
      return <Contact />;
  }
}

export function SectionView({ sectionId }: { sectionId: SectionId }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-screen"
    >
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <motion.div
          key={sectionId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <SectionContent sectionId={sectionId} />
        </motion.div>
      </main>
    </motion.div>
  );
}
