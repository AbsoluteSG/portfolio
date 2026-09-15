"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { siteConfig } from "@/lib/constants";
import { usePortfolio } from "./portfolio-context";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function LandingScreen() {
  const { showMenu } = usePortfolio();
  const hasTriggered = useRef(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !hasTriggered.current &&
        (Math.abs(e.movementX) > 3 || Math.abs(e.movementY) > 3)
      ) {
        hasTriggered.current = true;
        showMenu();
      }
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [showMenu]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="flex min-h-screen items-center justify-center"
    >
      {/* Theme toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="text-center">
        <motion.h1
          layoutId="site-name"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl font-bold tracking-tight md:text-8xl lg:text-9xl"
        >
          {siteConfig.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-6 text-base tracking-widest text-muted-foreground uppercase md:text-lg"
        >
          {siteConfig.title}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-8 text-xs text-muted-foreground md:hidden"
        >
          Tap to explore
        </motion.p>
      </div>

      {/* Touch fallback for mobile */}
      <div
        className="absolute inset-0 md:hidden"
        onTouchStart={() => {
          if (!hasTriggered.current) {
            hasTriggered.current = true;
            showMenu();
          }
        }}
      />
    </motion.div>
  );
}
