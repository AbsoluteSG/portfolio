"use client";

import { motion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { externalLinkProps } from "@/lib/links";

const facts = [siteConfig.jobTitle, "Brooklyn, NY", "B.S. CS, CUNY · Dec 2026"];

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
          Software engineer. I make games, and the software around them.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
        >
          I run a small studio, Siphon Games: I shipped Banana Clicker on Steam and rebuilt it with an
          online backend, wrote our game launcher in Rust, and built the bookkeeping app a tutoring
          studio uses every day. TypeScript, C# and Rust most days; Java and Python when the problem
          calls for it. I&apos;m looking for an entry-level software engineering role: full-time from
          January 2027, and internship or part-time work now.
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
          <a href={siteConfig.resumePath} {...externalLinkProps(siteConfig.resumePath)} className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline">
            Resume <ArrowUpRight className="size-4" />
          </a>
          <a href={siteConfig.links.github} {...externalLinkProps(siteConfig.links.github)} className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline">
            GitHub <ArrowUpRight className="size-4" />
          </a>
          <a href={siteConfig.links.linkedin} {...externalLinkProps(siteConfig.links.linkedin)} className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline">
            LinkedIn <ArrowUpRight className="size-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
