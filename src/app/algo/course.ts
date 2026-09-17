/** The course, in the order it's taught: counting tricks first, then windows, recursion, DP, graphs, then the tools around them. */

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

export const units: Unit[] = [
  {
    id: "precompute",
    title: "Precompute, then answer",
    question: "If the same question gets asked a thousand times, what can you work out once?",
    chapters: [
      { slug: "prefix-sums", title: "Prefix sums", hook: "Add everything up once, left to right. Any range is then one subtraction.", status: "draft" },
      { slug: "difference-arrays", title: "Difference arrays", hook: "Prefix sums run backwards: add to a whole range by touching two cells.", status: "planned" },
      { slug: "counting", title: "Counting with a map", hook: "Most 'find the pair' problems are 'have I seen the other half yet?'", status: "planned" },
    ],
  },
  {
    id: "windows",
    title: "Pointers and windows",
    question: "When does one pass over the data do the work of a nested loop?",
    chapters: [
      { slug: "two-pointers", title: "Two pointers", hook: "Walk in from both ends; every step throws away a whole family of answers.", status: "planned" },
      { slug: "sliding-window", title: "Sliding window", hook: "A range that only ever grows on the right and shrinks on the left visits each cell twice, total.", status: "planned" },
      { slug: "monotonic-stack", title: "Monotonic stack", hook: "Keep only what could still be an answer. The rest is popped the moment it's beaten.", status: "planned" },
    ],
  },
  {
    id: "recursion",
    title: "Recursion and memoization",
    question: "Why is the obvious recursive solution slow, and what's the one-line fix?",
    chapters: [
      { slug: "recursion-trees", title: "Recursion trees", hook: "Draw every call as a node. The shape of the tree is the running time.", status: "planned" },
      { slug: "memoization", title: "Memoization", hook: "The tree is full of repeats. Remember each answer and the tree collapses to a line.", status: "draft" },
      { slug: "top-down-bottom-up", title: "Top-down vs bottom-up", hook: "Memoized recursion and a filled-in table are the same algorithm read in opposite directions.", status: "planned" },
    ],
  },
  {
    id: "dp",
    title: "Dynamic programming",
    question: "How do you fill a table so every cell is one cheap step from cells you already have?",
    chapters: [
      { slug: "one-dimensional-dp", title: "1-D tables", hook: "Coins, stairs, and a table where each cell looks back a few steps.", status: "draft" },
      { slug: "grid-dp", title: "Grid tables", hook: "Paths through a grid, edit distance, and cells that look up and left.", status: "planned" },
      { slug: "knapsack", title: "Knapsack", hook: "Take it or leave it, for every item, for every capacity. The table is the decision.", status: "planned" },
      { slug: "reconstruction", title: "Reconstructing the answer", hook: "The table tells you the best score. Walking it backwards tells you the choices.", status: "planned" },
    ],
  },
  {
    id: "graphs",
    title: "Graphs",
    question: "What's reachable, what's closest, and what has to come first?",
    chapters: [
      { slug: "bfs", title: "Breadth-first search", hook: "Ripples in a pond. The first time a ripple reaches a cell is the shortest way there.", status: "planned" },
      { slug: "dfs", title: "Depth-first search", hook: "Go as deep as you can, back up one step, try the next door.", status: "planned" },
      { slug: "dijkstra", title: "Dijkstra", hook: "BFS, but the ripple is slower through heavier edges.", status: "planned" },
      { slug: "topological-sort", title: "Topological order", hook: "Tasks with prerequisites: peel off anything with no prerequisites left, repeat.", status: "planned" },
    ],
  },
  {
    id: "search-sort",
    title: "Searching and sorting",
    question: "How does 'sorted' turn a million checks into twenty?",
    chapters: [
      { slug: "binary-search", title: "Binary search", hook: "Halve the haystack every guess. Works on anything that goes from false to true.", status: "planned" },
      { slug: "merge-sort", title: "Merge sort", hook: "Sorting two sorted halves is one pass. Split until the halves are trivial.", status: "planned" },
      { slug: "heaps", title: "Heaps and top-k", hook: "A pile that always knows its smallest item, in log time.", status: "planned" },
    ],
  },
];

export const chapters: (Chapter & { unit: Unit; number: number })[] = units
  .flatMap((unit) => unit.chapters.map((c) => ({ ...c, unit, number: 0 })))
  .map((c, i) => ({ ...c, number: i + 1 }));

export function getChapter(slug: string) {
  const i = chapters.findIndex((c) => c.slug === slug);
  if (i < 0) return null;
  return { chapter: chapters[i], prev: chapters[i - 1] ?? null, next: chapters[i + 1] ?? null };
}
