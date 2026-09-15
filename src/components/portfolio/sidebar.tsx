"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { FileText, Home } from "lucide-react";
import { usePortfolio, type SectionId } from "./portfolio-context";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

const sidebarItems: { id: SectionId | "blog"; label: string }[] = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

export function Sidebar() {
  const { state, selectSection, goHome } = usePortfolio();
  const router = useRouter();
  const activeSection = state.phase === "section" ? state.activeSection : null;

  const handleClick = (id: SectionId | "blog") => {
    if (id === "blog") {
      router.push("/blog");
    } else {
      selectSection(id);
    }
  };

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        initial={{ x: -240, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="sticky top-0 hidden h-screen w-72 flex-shrink-0 flex-col border-r border-border bg-background md:flex lg:w-80"
      >
        <div className="flex flex-1 flex-col px-5 py-8 lg:px-6">
          {/* Home button */}
          <button
            onClick={goHome}
            className="mb-10 flex items-center gap-3 rounded-lg px-4 py-3.5 text-lg font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Home className="size-6" />
            Home
          </button>

          {/* Nav items */}
          <nav className="flex flex-1 flex-col gap-2">
            {sidebarItems.map((item) => {
              const isActive = item.id === activeSection;
              return (
                <button
                  key={item.id}
                  onClick={() => handleClick(item.id)}
                  className={cn(
                    "relative flex items-center rounded-lg px-4 py-3.5 text-lg font-medium transition-colors text-left",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Resume + theme toggle */}
          <div className="mt-auto space-y-4 pt-6">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              <FileText className="size-4" />
              Resume
            </a>
            <ThemeToggle />
          </div>
        </div>
      </motion.aside>

      {/* Mobile bottom nav */}
      <motion.nav
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background/95 backdrop-blur-sm p-1 md:hidden"
      >
        <button
          onClick={goHome}
          className="flex flex-col items-center gap-0.5 rounded-lg p-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Home className="size-4" />
          <span>Home</span>
        </button>
        {sidebarItems.map((item) => {
          const isActive = item.id === activeSection;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg p-2 text-xs transition-colors",
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 rounded-lg p-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <FileText className="size-4" />
          <span>Resume</span>
        </a>
      </motion.nav>
    </>
  );
}
