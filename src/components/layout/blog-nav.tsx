import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function BlogNav() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-20 max-w-5xl items-center justify-between px-6 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
          Home
        </Link>
        <ThemeToggle />
      </nav>
    </header>
  );
}
