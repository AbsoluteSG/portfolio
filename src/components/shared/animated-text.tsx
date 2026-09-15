"use client";

import { motion } from "motion/react";
import { staggerContainer, fadeInUp } from "@/lib/motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function AnimatedText({
  text,
  className,
  as: Tag = "h1",
}: AnimatedTextProps) {
  const words = text.split(" ");

  return (
    <Tag className={className}>
      <motion.span
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="inline"
      >
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            variants={fadeInUp}
            className="inline-block"
          >
            {word}
            {i < words.length - 1 && "\u00A0"}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
