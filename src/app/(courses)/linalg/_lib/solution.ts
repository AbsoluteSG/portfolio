/** Reading a full solution set off an RREF: the value of every variable, in terms of the free ones. */
import { type Frac, ZERO, ONE, frac, neg, isZero, eq, fmt as fmtFrac } from "./fraction";
import { type Matrix } from "./elimination";

/** One variable's value: a constant plus a multiple of each free variable. */
export interface VarExpr {
  k: Frac;
  /** coefficient of the i-th free variable (same order as `free`) */
  terms: Frac[];
}

export type Parametric =
  | { kind: "none"; row: number }
  | { kind: "ok"; free: number[]; vars: VarExpr[] };

/** `rref` must already be reduced. One augmented column. */
export function parametricForm(rref: Matrix, vars: number): Parametric {
  const pivotOf: number[] = []; // pivot column of each row that has one
  for (let r = 0; r < rref.length; r++) {
    const c = rref[r].findIndex((x, i) => i < vars && !isZero(x));
    if (c === -1) {
      if (!isZero(rref[r][vars])) return { kind: "none", row: r };
      pivotOf.push(-1);
      continue;
    }
    pivotOf.push(c);
  }
  const pivotCols = pivotOf.filter((c) => c >= 0);
  const free = Array.from({ length: vars }, (_, c) => c).filter((c) => !pivotCols.includes(c));

  const out: VarExpr[] = Array.from({ length: vars }, () => ({ k: ZERO, terms: free.map(() => ZERO) }));

  // Each free variable is its own parameter.
  free.forEach((c, i) => {
    out[c] = { k: ZERO, terms: free.map((_, j) => (i === j ? ONE : ZERO)) };
  });

  // Each basic variable: x_p = rhs − Σ (entry in a free column)·s
  for (let r = 0; r < rref.length; r++) {
    const p = pivotOf[r];
    if (p < 0) continue;
    out[p] = {
      k: rref[r][vars],
      terms: free.map((c) => neg(rref[r][c])),
    };
  }
  return { kind: "ok", free, vars: out };
}

const SUB = "₀₁₂₃₄₅₆₇₈₉";
export const sIndex = (i: number) => `s${String(i + 1).replace(/\d/g, (d) => SUB[Number(d)])}`;
const minus = (s: string) => s.replace("-", "−");

/** "−8", "s₁", "−2 − 3s₁", "4 + s₁ − 2s₂" */
export function fmtVarExpr(e: VarExpr): string {
  const parts: string[] = [];
  const allZero = e.terms.every(isZero);
  if (!isZero(e.k) || allZero) parts.push(minus(fmtFrac(e.k)));
  e.terms.forEach((coeff, i) => {
    if (isZero(coeff)) return;
    const name = sIndex(i);
    const mag = eq(coeff, ONE) || eq(coeff, frac(-1)) ? name : `${fmtFrac(frac(Math.abs(coeff.n), coeff.d))}${name}`;
    if (parts.length === 0) parts.push(coeff.n < 0 ? `−${mag}` : mag);
    else parts.push(coeff.n < 0 ? `− ${mag}` : `+ ${mag}`);
  });
  return parts.join(" ");
}

/** "(x₁, x₂, x₃) = (−8, 4, 4)" — the shape homework answer boxes want. */
export function fmtTuple(p: Extract<Parametric, { kind: "ok" }>): string {
  return `(${p.vars.map((v) => fmtVarExpr(v)).join(", ")})`;
}

/** The particular solution, and one direction vector per free variable. */
export function vectorForm(p: Extract<Parametric, { kind: "ok" }>): { particular: Frac[]; directions: Frac[][] } {
  return {
    particular: p.vars.map((v) => v.k),
    directions: p.free.map((_, i) => p.vars.map((v) => v.terms[i])),
  };
}
