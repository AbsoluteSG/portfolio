"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Menu } from "lucide-react";
import { useState } from "react";
import { navLinks } from "@/data/navigation";
import { useActiveSection } from "@/hooks/use-active-section";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sectionIds = ["about", "projects", "experience", "contact"];

export function Navbar() {
  const scrolled = useScrollProgress(50);
  const activeSection = useActiveSection(sectionIds);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/50 bg-background/80 backdrop-blur-lg"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isSection = link.href.startsWith("#");
            const sectionId = link.href.replace("#", "");
            const isActive = isSection && activeSection === sectionId;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="size-9 md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </nav>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  );
}
