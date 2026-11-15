/** Data model shared by every course (linear algebra, algorithms): units of chapters, numbered in reading order. */

export type ChapterStatus = "ready" | "draft" | "planned";

export interface Chapter {
  slug: string;
  title: string;
  /** One sentence: the idea the chapter is built around. */
  hook: string;
  status: ChapterStatus;
}

export interface Unit {
  id: string;
  title: string;
  /** What the unit answers. */
  question: string;
  chapters: Chapter[];
}

export type IndexedChapter = Chapter & { unit: Unit; number: number };

export interface ChapterLookup {
  chapter: IndexedChapter;
  prev: IndexedChapter | null;
  next: IndexedChapter | null;
}

/** Flattens units into a numbered chapter list and returns a slug lookup with prev/next neighbours. */
export function indexCourse(units: Unit[]) {
  const chapters: IndexedChapter[] = units
    .flatMap((unit) => unit.chapters.map((chapter) => ({ ...chapter, unit })))
    .map((chapter, i) => ({ ...chapter, number: i + 1 }));

  function getChapter(slug: string): ChapterLookup | null {
    const i = chapters.findIndex((c) => c.slug === slug);
    if (i < 0) return null;
    return { chapter: chapters[i], prev: chapters[i - 1] ?? null, next: chapters[i + 1] ?? null };
  }

  return { chapters, getChapter };
}
