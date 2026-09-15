"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDown, FileText, Mail } from "lucide-react";
import { AnimatedText } from "@/components/shared/animated-text";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { siteConfig } from "@/lib/constants";

const descriptors = ["full-stack web apps", "gameplay systems", "multiplayer servers", "developer tools"];

export function Hero() {
  const [descriptorIndex, setDescriptorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDescriptorIndex((prev) => (prev + 1) % descriptors.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      {/* Background gradient orb */}
      <motion.div
        className="pointer-events-none absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl"
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-40 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl"
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-4 text-sm font-medium tracking-widest text-primary uppercase"
        >
          {siteConfig.title}
        </motion.p>

        <AnimatedText
          text={`Hi, I'm ${siteConfig.name}`}
          className="text-5xl font-bold tracking-tight md:text-7xl"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-6 text-xl text-muted-foreground md:text-2xl"
        >
          <span>I build </span>
          <span className="relative inline-block w-52 text-left md:w-64">
            <AnimatePresence mode="wait">
              <motion.span
                key={descriptorIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute left-0 font-medium text-foreground"
              >
                {descriptors[descriptorIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <MagneticButton
            as="a"
            href="#projects"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View My Work
            <ArrowDown className="size-4" />
          </MagneticButton>

          <MagneticButton
            as="a"
            href="#contact"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Get In Touch
            <Mail className="size-4" />
          </MagneticButton>

          <MagneticButton
            as="a"
            href="/resume.pdf"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Resume
            <FileText className="size-4" />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
