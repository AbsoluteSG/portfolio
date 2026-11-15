import { ZERO, ONE, add, mul, neg, frac } from "./fraction";
import { type Matrix, type Op, type Step, eliminate, clone } from "./elimination";

export const identity = (n: number): Matrix => Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => (r === c ? ONE : ZERO)));

export function matmul(a: Matrix, b: Matrix): Matrix {
  return a.map((row) => b[0].map((_, c) => row.reduce((acc, x, k) => add(acc, mul(x, b[k][c])), ZERO)));
}

/** The n×n matrix that performs `op` when multiplied on the left. */
export function elementary(op: Op, n: number): Matrix {
  const e = identity(n);
  if (op.kind === "swap") [e[op.i], e[op.j]] = [e[op.j], e[op.i]];
  else if (op.kind === "scale") e[op.i][op.i] = op.k;
  else e[op.i][op.j] = op.k;
  return e;
}

/** Undo `op`: swaps undo themselves, scaling by k is undone by 1/k, adding k·R_j is undone by subtracting it. */
export function elementaryInverse(op: Op, n: number): Matrix {
  if (op.kind === "swap") return elementary(op, n);
  if (op.kind === "scale") return elementary({ ...op, k: frac(op.k.d, op.k.n) }, n);
  return elementary({ ...op, k: neg(op.k) }, n);
}

export interface LU {
  /** Forward elimination only: swaps and row additions, no scaling. */
  steps: Step[];
  /** E_k for each step, in order. */
  E: Matrix[];
  U: Matrix;
  L: Matrix;
  /** Product of the row swaps, in order. Identity when none were needed. */
  P: Matrix;
  swapped: boolean;
}

/**
 * E_n ⋯ E_1 A = U, so A = E_1⁻¹ ⋯ E_n⁻¹ U. With no swaps that product is unit lower triangular: it's L.
 * With swaps, P·(E_1⁻¹ ⋯ E_n⁻¹) is lower triangular for P = the swaps composed in order, giving PA = LU.
 */
export function lu(A: Matrix): LU {
  const n = A.length;
  const steps = eliminate(A, "ref", 0);
  const E = steps.map((s) => elementary(s.op, n));
  const U = steps.length ? clone(steps[steps.length - 1].matrix) : clone(A);
  let M = identity(n);
  for (const s of steps) M = matmul(M, elementaryInverse(s.op, n));
  let P = identity(n);
  let swapped = false;
  for (const s of steps) {
    if (s.op.kind === "swap") { P = matmul(elementary(s.op, n), P); swapped = true; }
  }
  const L = matmul(P, M);
  return { steps, E, U, L, P, swapped };
}
