"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePortfolio, type SectionId } from "./portfolio-context";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BackgroundPreview } from "./background-preview";
import { siteConfig } from "@/lib/constants";

const menuItems: { id: SectionId | "blog"; label: string }[] = [
  { id: "about", label: "ABOUT" },
  { id: "projects", label: "PROJECTS" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "contact", label: "CONTACT" },
  { id: "blog", label: "BLOG" },
];

const RADIUS = 440;
const INNER_RADIUS = 130;
const SEGMENT_SPAN = 360 / menuItems.length;
const EXPLODE_OFFSET = 16;

function getItemAngle(index: number) {
  return index * SEGMENT_SPAN;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number
) {
  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
    "Z",
  ].join(" ");
}

function WheelSegment({
  item,
  index,
  hovered,
  onHover,
  onClick,
}: {
  item: (typeof menuItems)[number];
  index: number;
  hovered: boolean;
  onHover: (idx: number | null) => void;
  onClick: () => void;
}) {
  const cx = RADIUS;
  const cy = RADIUS;
  const midAngle = getItemAngle(index);
  const startAngle = midAngle - SEGMENT_SPAN / 2;
  const endAngle = midAngle + SEGMENT_SPAN / 2;

  const labelR = (RADIUS * 0.52 + INNER_RADIUS) / 1.55;
  const labelPos = polarToCartesian(cx, cy, labelR, midAngle);

  const path = describeArc(cx, cy, RADIUS - 4, INNER_RADIUS, startAngle, endAngle);

  // Compute explode translation along the segment's radial direction
  const rad = ((midAngle - 90) * Math.PI) / 180;
  const tx = hovered ? Math.cos(rad) * EXPLODE_OFFSET : 0;
  const ty = hovered ? Math.sin(rad) * EXPLODE_OFFSET : 0;

  return (
    <g
      style={{
        cursor: "pointer",
        transform: `translate(${tx}px, ${ty}px)`,
        transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
    >
      {/* Segment wedge */}
      <path
        d={path}
        fill={hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)"}
        stroke={hovered ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.12)"}
        strokeWidth={hovered ? 2 : 1}
        style={{ transition: "fill 0.2s, stroke 0.2s, stroke-width 0.2s" }}
      />

      {/* Highlight tick at outer edge */}
      {hovered && (
        <path
          d={describeArc(cx, cy, RADIUS - 4, RADIUS - 10, startAngle + 5, endAngle - 5)}
          fill="rgba(140,130,255,0.6)"
        />
      )}

      {/* Label */}
      <text
        x={labelPos.x}
        y={labelPos.y}
        textAnchor="middle"
        dominantBaseline="central"
        fill={hovered ? "#ffffff" : "rgba(255,255,255,0.7)"}
        fontSize={hovered ? 26 : 23}
        fontWeight={hovered ? 700 : 600}
        fontFamily="var(--font-sans), system-ui, sans-serif"
        letterSpacing="0.12em"
        style={{ transition: "fill 0.2s, font-size 0.2s", userSelect: "none" }}
      >
        {item.label}
      </text>
    </g>
  );
}

export function RadialMenu() {
  const { selectSection } = usePortfolio();
  const router = useRouter();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [dotPos, setDotPos] = useState({ x: RADIUS, y: RADIUS });
  const svgRef = useRef<SVGSVGElement>(null);

  const handleClick = (id: SectionId | "blog") => {
    if (id === "blog") {
      router.push("/blog");
    } else {
      selectSection(id);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = (RADIUS * 2) / rect.width;
    const scaleY = (RADIUS * 2) / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    const dx = mx - RADIUS;
    const dy = my - RADIUS;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxR = INNER_RADIUS - 8;

    if (dist <= maxR) {
      setDotPos({ x: mx, y: my });
    } else {
      const clampedX = RADIUS + (dx / dist) * maxR;
      const clampedY = RADIUS + (dy / dist) * maxR;
      setDotPos({ x: clampedX, y: clampedY });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const size = RADIUS * 2;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-screen flex-col items-center justify-center gap-6"
    >
      {/* Themed background icons */}
      <BackgroundPreview hoveredIdx={hoveredIdx} />

      {/* Theme toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Name + tagline above wheel */}
      <div className="hidden flex-col items-center gap-2 md:flex">
        <motion.h1
          layoutId="site-name"
          className="text-3xl font-bold tracking-tight lg:text-4xl"
        >
          {siteConfig.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm tracking-widest text-muted-foreground uppercase"
        >
          {siteConfig.title}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-4 text-sm text-muted-foreground"
        >
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-foreground hover:underline">Resume</a>
          <span aria-hidden>·</span>
          <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-foreground hover:underline">GitHub</a>
          <span aria-hidden>·</span>
          <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-foreground hover:underline">LinkedIn</a>
        </motion.div>
      </div>

      {/* Desktop: weapon wheel */}
      <motion.div
        className="relative hidden md:block"
        style={{
          width: "min(85vh, 85vmin, " + size + "px)",
          height: "min(85vh, 85vmin, " + size + "px)",
        }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`${-(EXPLODE_OFFSET + 2)} ${-(EXPLODE_OFFSET + 2)} ${size + (EXPLODE_OFFSET + 2) * 2} ${size + (EXPLODE_OFFSET + 2) * 2}`}
        >
          <defs>
            <radialGradient id="wheel-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.8)" />
              <stop offset="70%" stopColor="rgba(0,0,0,0.6)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background circle */}
          <circle
            cx={RADIUS}
            cy={RADIUS}
            r={RADIUS - 2}
            fill="url(#wheel-bg)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={2}
          />

          {/* Inner circle */}
          <circle
            cx={RADIUS}
            cy={RADIUS}
            r={INNER_RADIUS}
            fill="rgba(0,0,0,0.5)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1.5}
          />

          {/* Segments */}
          {menuItems.map((item, i) => (
            <WheelSegment
              key={item.id}
              item={item}
              index={i}
              hovered={hoveredIdx === i}
              onHover={setHoveredIdx}
              onClick={() => handleClick(item.id)}
            />
          ))}

          {/* Center crosshair lines */}
          <line
            x1={RADIUS - 16}
            y1={RADIUS}
            x2={RADIUS + 16}
            y2={RADIUS}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1}
          />
          <line
            x1={RADIUS}
            y1={RADIUS - 16}
            x2={RADIUS}
            y2={RADIUS + 16}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1}
          />

          {/* Mouse-following center dot */}
          <circle
            cx={dotPos.x}
            cy={dotPos.y}
            r={5}
            fill="rgba(140,130,255,0.9)"
            filter="url(#glow)"
            style={{ transition: "cx 0.05s, cy 0.05s" }}
          />

          {/* Hovered item label in center */}
          {hoveredIdx !== null && (
            <text
              x={RADIUS}
              y={RADIUS + 40}
              textAnchor="middle"
              fill="rgba(255,255,255,0.9)"
              fontSize={14}
              fontFamily="var(--font-sans), system-ui, sans-serif"
              letterSpacing="0.2em"
              fontWeight={500}
            >
              {"[ " + menuItems[hoveredIdx].label + " ]"}
            </text>
          )}
        </svg>
      </motion.div>

      {/* Mobile: vertical list with game HUD style */}
      <div className="flex flex-col gap-4 md:hidden">
        <div className="mb-2 text-center">
          <p className="text-2xl font-bold tracking-tight">{siteConfig.name}</p>
          <p className="mt-1 text-xs tracking-widest text-muted-foreground uppercase">{siteConfig.title}</p>
        </div>
        {menuItems.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClick(item.id)}
            className="relative overflow-hidden rounded-sm border border-white/10 bg-black/50 px-16 py-6 text-xl font-semibold tracking-[0.18em] text-white/80 backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            {item.label}
          </motion.button>
        ))}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm border border-white/10 bg-black/50 px-16 py-4 text-center text-sm tracking-[0.18em] text-white/70 uppercase backdrop-blur-sm hover:text-white"
        >
          Resume
        </a>
      </div>
    </motion.div>
  );
}
