"use client";

import { AnimatePresence, motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  Code2,
  Gamepad2,
  Wrench,
  Cpu,
  Binary,
  Terminal,
  Braces,
  Hash,
  Rocket,
  Trophy,
  Sword,
  Shield,
  Zap,
  Star,
  Flame,
  Award,
  TrendingUp,
  BarChart3,
  Target,
  Crown,
  Medal,
  ChevronUp,
  ArrowBigUp,
  MessageCircle,
  Mail,
  Send,
  Radio,
  Wifi,
  Globe,
  Phone,
  AtSign,
  BookOpen,
  PenTool,
  FileText,
  Newspaper,
  ScrollText,
  Quote,
  Feather,
  Bookmark,
} from "lucide-react";

interface IconConfig {
  Icon: LucideIcon;
  x: number;
  y: number;
  size: number;
  delay: number;
  floatDuration: number;
}

// Positions avoid the center (30-70%) where the wheel sits
const SECTION_ICONS: IconConfig[][] = [
  // 0: ABOUT — code & dev symbols
  [
    { Icon: Code2, x: 8, y: 12, size: 40, delay: 0, floatDuration: 4 },
    { Icon: Gamepad2, x: 88, y: 8, size: 44, delay: 0.05, floatDuration: 3.5 },
    { Icon: Wrench, x: 5, y: 45, size: 36, delay: 0.1, floatDuration: 4.5 },
    { Icon: Cpu, x: 92, y: 40, size: 38, delay: 0.15, floatDuration: 3.8 },
    { Icon: Binary, x: 12, y: 82, size: 34, delay: 0.2, floatDuration: 4.2 },
    { Icon: Terminal, x: 85, y: 85, size: 42, delay: 0.25, floatDuration: 3.6 },
    { Icon: Braces, x: 20, y: 15, size: 32, delay: 0.3, floatDuration: 4.8 },
    { Icon: Hash, x: 80, y: 18, size: 30, delay: 0.35, floatDuration: 3.2 },
  ],
  // 1: PROJECTS — game/achievement icons
  [
    { Icon: Rocket, x: 6, y: 10, size: 44, delay: 0, floatDuration: 3.5 },
    { Icon: Trophy, x: 90, y: 12, size: 40, delay: 0.05, floatDuration: 4.2 },
    { Icon: Sword, x: 8, y: 50, size: 38, delay: 0.1, floatDuration: 3.8 },
    { Icon: Shield, x: 90, y: 48, size: 42, delay: 0.15, floatDuration: 4.5 },
    { Icon: Zap, x: 15, y: 85, size: 36, delay: 0.2, floatDuration: 3.2 },
    { Icon: Star, x: 85, y: 82, size: 34, delay: 0.25, floatDuration: 4.8 },
    { Icon: Flame, x: 22, y: 20, size: 32, delay: 0.3, floatDuration: 3.6 },
    { Icon: Trophy, x: 78, y: 88, size: 30, delay: 0.35, floatDuration: 4 },
  ],
  // 2: EXPERIENCE — XP / level-up icons
  [
    { Icon: Award, x: 7, y: 8, size: 44, delay: 0, floatDuration: 4 },
    { Icon: TrendingUp, x: 88, y: 10, size: 40, delay: 0.05, floatDuration: 3.6 },
    { Icon: BarChart3, x: 5, y: 42, size: 38, delay: 0.1, floatDuration: 4.4 },
    { Icon: Target, x: 92, y: 45, size: 36, delay: 0.15, floatDuration: 3.8 },
    { Icon: Crown, x: 10, y: 88, size: 42, delay: 0.2, floatDuration: 4.2 },
    { Icon: Medal, x: 87, y: 85, size: 34, delay: 0.25, floatDuration: 3.4 },
    { Icon: ChevronUp, x: 18, y: 18, size: 32, delay: 0.3, floatDuration: 4.6 },
    { Icon: ArrowBigUp, x: 82, y: 20, size: 36, delay: 0.35, floatDuration: 3.2 },
  ],
  // 3: CONTACT — communication icons
  [
    { Icon: MessageCircle, x: 8, y: 12, size: 42, delay: 0, floatDuration: 3.8 },
    { Icon: Mail, x: 90, y: 8, size: 40, delay: 0.05, floatDuration: 4.2 },
    { Icon: Send, x: 6, y: 48, size: 36, delay: 0.1, floatDuration: 3.5 },
    { Icon: Radio, x: 92, y: 42, size: 38, delay: 0.15, floatDuration: 4.5 },
    { Icon: Wifi, x: 12, y: 84, size: 34, delay: 0.2, floatDuration: 4 },
    { Icon: Globe, x: 86, y: 88, size: 44, delay: 0.25, floatDuration: 3.6 },
    { Icon: Phone, x: 20, y: 20, size: 30, delay: 0.3, floatDuration: 4.8 },
    { Icon: AtSign, x: 80, y: 16, size: 32, delay: 0.35, floatDuration: 3.2 },
  ],
  // 4: BLOG — writing/reading icons
  [
    { Icon: BookOpen, x: 7, y: 10, size: 44, delay: 0, floatDuration: 4.2 },
    { Icon: PenTool, x: 88, y: 12, size: 38, delay: 0.05, floatDuration: 3.5 },
    { Icon: FileText, x: 5, y: 46, size: 36, delay: 0.1, floatDuration: 4 },
    { Icon: Newspaper, x: 92, y: 44, size: 40, delay: 0.15, floatDuration: 3.8 },
    { Icon: ScrollText, x: 10, y: 86, size: 42, delay: 0.2, floatDuration: 4.5 },
    { Icon: Quote, x: 85, y: 84, size: 34, delay: 0.25, floatDuration: 3.4 },
    { Icon: Feather, x: 18, y: 16, size: 32, delay: 0.3, floatDuration: 4.6 },
    { Icon: Bookmark, x: 82, y: 18, size: 30, delay: 0.35, floatDuration: 3.2 },
  ],
];

function FloatingIcon({ config }: { config: IconConfig }) {
  const { Icon, x, y, size, delay, floatDuration } = config;

  return (
    <motion.div
      className="absolute text-muted-foreground pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, y: 20, scale: 0.7 }}
      animate={{
        opacity: [0, 0.15, 0.1, 0.15],
        y: [20, -8, 0, -8],
        scale: 1,
      }}
      exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.25 } }}
      transition={{
        opacity: { duration: floatDuration, repeat: Infinity, repeatType: "reverse", delay },
        y: { duration: floatDuration, repeat: Infinity, repeatType: "reverse", delay, ease: "easeInOut" },
        scale: { duration: 0.4, delay, ease: "easeOut" },
      }}
    >
      <Icon size={size} strokeWidth={1.5} />
    </motion.div>
  );
}

export function BackgroundPreview({ hoveredIdx }: { hoveredIdx: number | null }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 hidden md:block">
      <AnimatePresence mode="wait">
        {hoveredIdx !== null && (
          <motion.div
            key={hoveredIdx}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {SECTION_ICONS[hoveredIdx].map((config, i) => (
              <FloatingIcon key={i} config={config} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
