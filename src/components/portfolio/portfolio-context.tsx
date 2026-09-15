"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

export type SectionId = "about" | "projects" | "experience" | "contact";

type PortfolioState =
  | { phase: "landing" }
  | { phase: "menu" }
  | { phase: "section"; activeSection: SectionId };

interface PortfolioContextValue {
  state: PortfolioState;
  showMenu: () => void;
  selectSection: (id: SectionId) => void;
  goHome: () => void;
}

const INTRO_SEEN_KEY = "portfolio-intro-seen";

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PortfolioState>({ phase: "landing" });

  // On mount, skip landing if the user has already seen it this session.
  // sessionStorage is only readable after hydration, so this has to be an effect.
  useEffect(() => {
    if (sessionStorage.getItem(INTRO_SEEN_KEY)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ phase: "menu" });
    }
  }, []);

  const showMenu = useCallback(() => {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    setState({ phase: "menu" });
  }, []);

  const selectSection = useCallback((id: SectionId) => {
    setState({ phase: "section", activeSection: id });
  }, []);

  const goHome = useCallback(() => {
    // Go straight to menu since they've already seen the intro
    setState({ phase: "menu" });
  }, []);

  return (
    <PortfolioContext.Provider value={{ state, showMenu, selectSection, goHome }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider");
  return ctx;
}
