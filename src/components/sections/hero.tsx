"use client";

import { motion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/constants";

const facts = ["Software engineer", "Brooklyn, NY", "B.S. CS, CUNY · Dec 2026"];

export function Hero() {
  return (
    <section id="hero" className="relative px-6 pt-36 pb-20 md:pt-44 md:pb-28 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-x-3 gap-y-1 text-sm font-medium tracking-[0.18em] text-primary uppercase"
        >
          {facts.map((f, i) => (
            <span key={f}>{i > 0 && <span className="mr-3 text-muted-foreground/60">·</span>}{f}</span>
          ))}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display mt-6 max-w-4xl text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem]"
        >
          I make games, and the software around them.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
        >
          I shipped Banana Clicker on Steam, run a small studio called Siphon Games, and built the
          bookkeeping app a tutoring studio uses every day. I write C# and TypeScript most days, Rust
          and C++ when the problem calls for it. I&apos;m looking for an entry-level engineering role
          from January 2027, earlier if it fits.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          <a href="#projects" className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary">
            See the work <ArrowDown className="size-4" />
          </a>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline">
            Resume <ArrowUpRight className="size-4" />
          </a>
          <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline">
            GitHub <ArrowUpRight className="size-4" />
          </a>
          <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline">
            LinkedIn <ArrowUpRight className="size-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
