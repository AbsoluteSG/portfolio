import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { chapters, getChapter } from "../course";
import { EliminationStage } from "../stages/elimination-stage";
import { TransformationStage } from "../stages/transformation-stage";
import { LUStage } from "../stages/lu-stage";
import { EigenStage } from "../stages/eigen-stage";
import { bodies } from "../content";

/** Each written chapter mounts its interactive here. */
const stages: Record<string, React.ComponentType> = {
  "gaussian-elimination": EliminationStage,
  "linear-transformations": TransformationStage,
  lu: LUStage,
  eigenvectors: EigenStage,
};

const BASE = "/linalg";
type Params = { params: Promise<{ chapter: string }> };

export function generateStaticParams() {
  return chapters.map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { chapter } = await params;
  const found = getChapter(chapter);
  return found ? { title: found.chapter.title, description: found.chapter.hook } : {};
}

export default async function ChapterPage({ params }: Params) {
  const { chapter: slug } = await params;
  const found = getChapter(slug);
  if (!found) notFound();
  const { chapter, prev, next } = found;
  const Stage = stages[chapter.slug];
  const Body = bodies[chapter.slug];

  return (
    <article className="px-6 py-12 md:px-12 md:py-16 lg:px-16">
      <header className="max-w-3xl">
        <p className="la-eyebrow">
          {chapter.unit.title} · Chapter {chapter.number}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="la-display text-4xl sm:text-5xl md:text-6xl">{chapter.title}</h1>
          {chapter.status !== "ready" && <span className="la-chip" data-status={chapter.status}>{chapter.status}</span>}
        </div>
        <p className="mt-5 text-lg leading-relaxed text-[var(--la-ink-soft)] md:text-xl">{chapter.hook}</p>
      </header>

      {Stage ? (
        <div className="la-stage mt-10 w-full max-w-5xl" data-live>
          <Stage />
        </div>
      ) : (
        <div className="la-stage mt-10 aspect-[16/9] w-full max-w-5xl md:aspect-[2/1]">
          <span className="la-mono absolute top-4 left-4 text-xs text-[var(--la-ink-faint)]">stage · {chapter.slug}</span>
        </div>
      )}

      <div className="la-prose mt-10">
        {Body ? (
          <Body />
        ) : (
          <p className="text-[var(--la-ink-soft)]">
            {chapter.status === "planned" ? "This chapter isn't written yet." : "Draft in progress."}
          </p>
        )}
      </div>

      <nav aria-label="Chapter navigation" className="mt-16 flex max-w-5xl flex-wrap justify-between gap-4 border-t border-[var(--la-line)] pt-8">
        {prev ? (
          <Link href={`${BASE}/${prev.slug}`} className="la-btn">
            <ArrowLeft className="size-4" /> {prev.title}
          </Link>
        ) : (
          <Link href={BASE} className="la-btn">
            <ArrowLeft className="size-4" /> Course overview
          </Link>
        )}
        {next && (
          <Link href={`${BASE}/${next.slug}`} className="la-btn la-btn-primary">
            {next.title} <ArrowRight className="size-4" />
          </Link>
        )}
      </nav>
    </article>
  );
}
