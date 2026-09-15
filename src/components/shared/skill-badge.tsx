"use client";

import { motion } from "motion/react";
import { scaleIn } from "@/lib/motion";

interface SkillBadgeProps {
  name: string;
}

export function SkillBadge({ name }: SkillBadgeProps) {
  return (
    <motion.span
      variants={scaleIn}
      className="inline-flex items-center rounded-full bg-accent-subtle px-4 py-2 text-base font-medium text-primary"
    >
      {name}
    </motion.span>
  );
}
