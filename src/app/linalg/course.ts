/** The course, in the order it's taught: systems first, then vectors, maps, determinants, spaces, eigen, orthogonality, SVD. */

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
    id: "systems",
    title: "Solving systems",
    question: "Given a handful of equations, what values satisfy all of them at once?",
    chapters: [
      { slug: "systems-of-equations", title: "Systems of linear equations", hook: "Every equation is a line, a plane, or a hyperplane; a solution is where they all meet.", status: "planned" },
      { slug: "gaussian-elimination", title: "Gaussian elimination", hook: "Three moves that never change the answer, applied until the answer is obvious.", status: "ready" },
      { slug: "echelon-forms", title: "Echelon forms and pivots", hook: "The staircase shape that elimination leaves behind, and what its steps tell you.", status: "planned" },
      { slug: "solution-sets", title: "Solution sets", hook: "No solution, one solution, or infinitely many: how to tell, and how to write them down.", status: "planned" },
    ],
  },
  {
    id: "vectors",
    title: "Vectors",
    question: "What are the objects we're actually solving for?",
    chapters: [
      { slug: "vectors", title: "Vectors and arithmetic", hook: "Arrows you can add and stretch; the two operations everything else is built from.", status: "planned" },
      { slug: "span", title: "Linear combinations and span", hook: "Everywhere you can reach by stretching and adding a set of arrows.", status: "planned" },
      { slug: "matrix-equation", title: "The matrix equation Ax = b", hook: "A system of equations, a combination of columns, and a matrix times a vector are the same sentence.", status: "planned" },
      { slug: "linear-independence", title: "Linear independence", hook: "When does a new arrow actually add a new direction?", status: "planned" },
    ],
  },
  {
    id: "maps",
    title: "Matrices as maps",
    question: "What does a matrix do to the whole plane?",
    chapters: [
      { slug: "linear-transformations", title: "Linear transformations", hook: "A matrix is a rule for moving every point; the grid stays straight and evenly spaced.", status: "ready" },
      { slug: "composition", title: "Multiplication as composition", hook: "Do one warp, then another. The product is the single warp that does both. Order matters.", status: "planned" },
      { slug: "inverses", title: "Inverses", hook: "The warp that undoes a warp, and the matrices that can't be undone.", status: "planned" },
      { slug: "lu", title: "Elementary matrices and LU", hook: "Elimination itself is a sequence of matrices; multiply them and you've factored A.", status: "ready" },
    ],
  },
  {
    id: "determinants",
    title: "Determinants",
    question: "How much does a map stretch or squash space, and does it flip it?",
    chapters: [
      { slug: "determinant-as-area", title: "The determinant as area", hook: "Watch the unit square get warped; the determinant is the area it ends up with.", status: "ready" },
      { slug: "determinant-properties", title: "Properties and cofactors", hook: "Why row operations change the determinant the way they do, and how to compute it for anything.", status: "planned" },
    ],
  },
  {
    id: "spaces",
    title: "Vector spaces",
    question: "Which sets of vectors are closed under the two operations, and how big are they?",
    chapters: [
      { slug: "subspaces", title: "Subspaces", hook: "Lines and planes through the origin, and why the origin is non-negotiable.", status: "planned" },
      { slug: "null-and-column-space", title: "Null space and column space", hook: "What a matrix sends to zero, and everywhere it can reach.", status: "planned" },
      { slug: "basis-and-dimension", title: "Basis and dimension", hook: "The smallest set of arrows that reaches everything; how many there are is the dimension.", status: "planned" },
      { slug: "rank", title: "Rank and the four subspaces", hook: "One number that ties the row space, column space, and both null spaces together.", status: "planned" },
      { slug: "change-of-basis", title: "Change of basis", hook: "The same vector, written in a different language; the same map, in different coordinates.", status: "planned" },
    ],
  },
  {
    id: "eigen",
    title: "Eigenvalues and eigenvectors",
    question: "Which directions does a map leave alone, and what does it do along them?",
    chapters: [
      { slug: "eigenvectors", title: "Eigenvalues and eigenvectors", hook: "Under a warp, most arrows turn. A few only stretch. Those are the ones that explain the warp.", status: "ready" },
      { slug: "diagonalization", title: "Diagonalization", hook: "In the eigenvector basis, the map is just scaling. Every power of A becomes easy.", status: "planned" },
      { slug: "dynamics", title: "Powers, dynamics, Markov chains", hook: "Apply the same map a thousand times and see what survives.", status: "planned" },
    ],
  },
  {
    id: "orthogonality",
    title: "Orthogonality",
    question: "What does 'perpendicular' buy us, and how do we get it?",
    chapters: [
      { slug: "dot-product", title: "Dot product, length, angle", hook: "One operation that measures both how long an arrow is and how aligned two arrows are.", status: "planned" },
      { slug: "projections", title: "Orthogonal projections", hook: "The shadow one vector casts on another, and the closest point in a subspace.", status: "planned" },
      { slug: "gram-schmidt", title: "Gram–Schmidt and QR", hook: "Straighten a crooked basis one vector at a time.", status: "planned" },
      { slug: "least-squares", title: "Least squares", hook: "When Ax = b has no solution, find the x that misses by the least.", status: "planned" },
    ],
  },
  {
    id: "svd",
    title: "Symmetric matrices and the SVD",
    question: "What's the cleanest possible description of any matrix at all?",
    chapters: [
      { slug: "spectral-theorem", title: "Symmetric matrices", hook: "Symmetric matrices have perpendicular eigenvectors; the warp is a pure stretch along them.", status: "planned" },
      { slug: "quadratic-forms", title: "Quadratic forms", hook: "Ellipses, hyperbolas and saddles, read straight off the eigenvalues.", status: "planned" },
      { slug: "singular-value-decomposition", title: "Singular value decomposition", hook: "Every matrix is a rotation, a stretch, and a rotation. Every one.", status: "planned" },
    ],
  },
];

export const chapters: (Chapter & { unit: Unit; number: number })[] = units.flatMap((unit) =>
  unit.chapters.map((c) => ({ ...c, unit, number: 0 })),
).map((c, i) => ({ ...c, number: i + 1 }));

export function getChapter(slug: string) {
  const i = chapters.findIndex((c) => c.slug === slug);
  if (i < 0) return null;
  return { chapter: chapters[i], prev: chapters[i - 1] ?? null, next: chapters[i + 1] ?? null };
}
