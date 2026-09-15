"use client";

import { AnimatePresence, LayoutGroup } from "motion/react";
import { usePortfolio } from "./portfolio-context";
import { LandingScreen } from "./landing-screen";
import { RadialMenu } from "./radial-menu";
import { SectionView } from "./section-view";

export function PortfolioShell() {
  const { state } = usePortfolio();

  return (
    <LayoutGroup>
      <div className="relative min-h-screen">
        <AnimatePresence mode="wait">
          {state.phase === "landing" && <LandingScreen key="landing" />}
          {state.phase === "menu" && <RadialMenu key="menu" />}
          {state.phase === "section" && (
            <SectionView
              key={`section-${state.activeSection}`}
              sectionId={state.activeSection}
            />
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
