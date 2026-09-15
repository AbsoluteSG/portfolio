"use client";

import { PortfolioProvider } from "@/components/portfolio/portfolio-context";
import { PortfolioShell } from "@/components/portfolio/portfolio-shell";

export default function Home() {
  return (
    <PortfolioProvider>
      <PortfolioShell />
    </PortfolioProvider>
  );
}
