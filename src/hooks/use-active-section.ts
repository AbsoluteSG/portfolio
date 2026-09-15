"use client";

import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observers = sectionIds.map((id) => {
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-50% 0px -50% 0px" },
      );
      observer.observe(element);
      return { observer, element };
    });

    return () => {
      observers.forEach((o) => o?.observer.disconnect());
    };
  }, [sectionIds]);

  return activeSection;
}
