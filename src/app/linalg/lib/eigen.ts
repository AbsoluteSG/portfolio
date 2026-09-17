/** Real eigen-analysis of a 2×2, column-major [a, b, c, d] = [[a, c], [b, d]]. */
export type Mat2 = [number, number, number, number];
export type Vec2 = [number, number];

export interface EigenPair {
  lambda: number;
  /** A direction vector, scaled so its largest component is ±1. */
  v: Vec2;
}

export type Eigen =
  | { kind: "real"; tr: number; det: number; disc: number; pairs: [EigenPair, EigenPair] }
  | { kind: "repeated"; tr: number; det: number; disc: number; lambda: number; pair: EigenPair | null; whole: boolean }
  | { kind: "complex"; tr: number; det: number; disc: number; re: number; im: number };

const EPS = 1e-9;
const nice = (v: Vec2): Vec2 => {
  const m = Math.max(Math.abs(v[0]), Math.abs(v[1]));
  if (m < EPS) return [0, 0];
  const s = v[0] < -EPS || (Math.abs(v[0]) < EPS && v[1] < 0) ? -m : m; // first nonzero component positive
  return [v[0] / s, v[1] / s];
};

/** A nonzero solution of (A − λI)v = 0, or null if A − λI = 0 (every vector works). */
export function eigenvector([a, b, c, d]: Mat2, lambda: number): Vec2 | null {
  // Rows of A − λI: (a−λ, c) and (b, d−λ). A vector perpendicular to a nonzero row is in the null space.
  if (Math.abs(a - lambda) > EPS || Math.abs(c) > EPS) return nice([c, lambda - a]);
  if (Math.abs(b) > EPS || Math.abs(d - lambda) > EPS) return nice([lambda - d, b]);
  return null;
}

export function eigen(m: Mat2): Eigen {
  const [a, b, c, d] = m;
  const tr = a + d;
  const det = a * d - b * c;
  const disc = tr * tr - 4 * det;
  if (disc < -EPS) return { kind: "complex", tr, det, disc, re: tr / 2, im: Math.sqrt(-disc) / 2 };
  if (Math.abs(disc) <= EPS) {
    const lambda = tr / 2;
    const v = eigenvector(m, lambda);
    return { kind: "repeated", tr, det, disc: 0, lambda, pair: v ? { lambda, v } : null, whole: v === null };
  }
  const r = Math.sqrt(disc);
  const l1 = (tr + r) / 2, l2 = (tr - r) / 2;
  return { kind: "real", tr, det, disc, pairs: [{ lambda: l1, v: eigenvector(m, l1)! }, { lambda: l2, v: eigenvector(m, l2)! }] };
}
