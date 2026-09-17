"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { units, chapters } from "./course";

const BASE = "/linalg";

/** Chapter navigation. A sticky column on desktop; a collapsible picker above the content on phones. */
export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = chapters.find((c) => pathname === `${BASE}/${c.slug}`);

  return (
    <aside className="la-side">
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-5 lg:py-5">
        <Link href={BASE} className="la-display text-xl leading-none hover:text-[var(--la-blue)]">
          Linear algebra
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="la-chapters"
            className="la-mono inline-flex items-center gap-1 rounded-md border border-[var(--la-line)] px-2 py-1 text-xs lg:hidden"
          >
            {current ? `Ch. ${current.number}` : "Chapters"} <ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      <nav id="la-chapters" aria-label="Chapters" className={`${open ? "block" : "hidden"} border-t border-[var(--la-line)] px-3 pb-6 lg:block lg:border-t-0 lg:px-4`}>
        {units.map((unit) => (
          <div key={unit.id} className="mt-5">
            <p className="la-eyebrow px-2">{unit.title}</p>
            <ul className="mt-1.5 space-y-0.5">
              {unit.chapters.map((ch) => {
                const n = chapters.find((c) => c.slug === ch.slug)!.number;
                const href = `${BASE}/${ch.slug}`;
                const active = pathname === href;
                return (
                  <li key={ch.slug}>
                    <Link href={href} className="la-row" aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>
                      <span className="la-num">{String(n).padStart(2, "0")}</span>
                      <span>{ch.title}</span>
                      <span className="la-dot" data-status={ch.status} aria-label={ch.status} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="mt-8 border-t border-[var(--la-line)] px-2 pt-4">
          <Link href="/" className="la-mono text-xs text-[var(--la-ink-soft)] hover:text-[var(--la-ink)]">
            ← alex-zaalishvili
          </Link>
        </div>
      </nav>
    </aside>
  );
}
