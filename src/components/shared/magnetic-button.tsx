"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  as?: "a" | "button";
  href?: string;
}

export function MagneticButton({
  children,
  className,
  as = "button",
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Component = as === "a" ? motion.a : motion.button;
  // Anything that leaves the SPA (http(s) or a file like /resume.pdf) opens in a new tab.
  const external = !!href && (/^https?:\/\//.test(href) || /\.[a-z0-9]{2,4}$/i.test(href));
  const linkProps = as === "a" && external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <Component href={href} className={className} {...linkProps}>
        {children}
      </Component>
    </motion.div>
  );
}
