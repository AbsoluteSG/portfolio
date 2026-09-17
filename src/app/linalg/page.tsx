import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { units, chapters } from "./course";

const BASE = "/linalg";

export default function LinalgHome() {
  const ready = chapters.filter((c) => c.status !== "planned").length;
  const start = chapters.find((c) => c.status !== "planned") ?? chapters[0];

  return (
    <div className="px-6 py-14 md:px-12 md:py-20 lg:px-16">
      <div className="max-w-3xl">
        <p className="la-eyebrow">A course, in {chapters.length} chapters</p>
        <h1 className="la-display mt-4 text-5xl sm:text-6xl md:text-7xl">Linear algebra, seen.</h1>
        <p className="mt-6 text-lg leading-relaxed text-[var(--la-ink-soft)] md:text-xl">
          Every matrix on these pages is live. Drag a number and the plane moves. The same grid carries you from
          elimination to eigenvectors, so the ideas stay connected instead of arriving as separate formulas.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href={`${BASE}/${start.slug}`} className="la-btn la-btn-primary">
            Start with chapter {start.number} <ArrowRight className="size-4" />
          </Link>
          <span className="la-mono text-xs text-[var(--la-ink-faint)]">{ready} of {chapters.length} chapters written</span>
        </div>
      </div>

      <div className="la-stage mt-14 aspect-[16/7] w-full max-w-5xl" aria-hidden />

      <ol className="mt-16 grid max-w-5xl gap-5 md:grid-cols-2">
        {units.map((unit, ui) => (
          <li key={unit.id} className="la-unit p-6">
            <p className="la-eyebrow">Unit {ui + 1}</p>
            <h2 className="la-display mt-2 text-2xl">{unit.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--la-ink-soft)]">{unit.question}</p>
            <ul className="mt-5 space-y-1.5">
              {unit.chapters.map((ch) => {
                const n = chapters.find((c) => c.slug === ch.slug)!.number;
                return (
                  <li key={ch.slug}>
                    <Link href={`${BASE}/${ch.slug}`} className="group flex items-baseline gap-3 text-sm">
                      <span className="la-num w-5 shrink-0">{String(n).padStart(2, "0")}</span>
                      <span className="group-hover:text-[var(--la-blue)]">{ch.title}</span>
                      <span className="la-dot ml-auto" data-status={ch.status} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
