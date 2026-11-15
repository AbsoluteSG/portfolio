import { type Frac, add, div, isOne, isZero, mul, neg, ONE, eq } from "./fraction";

export type Matrix = Frac[][];

export type Op =
  | { kind: "swap"; i: number; j: number }
  | { kind: "scale"; i: number; k: Frac }
  | { kind: "add"; i: number; j: number; k: Frac }; // R_i ← R_i + k·R_j

export interface Step {
  op: Op;
  /** Matrix after the op. */
  matrix: Matrix;
  /** The pivot the op is working on. */
  pivot: [number, number];
  phase: "forward" | "back";
  /** Cells whose value changed, as "r,c". */
  changed: Set<string>;
  /** One line of explanation. */
  why: string;
}

export type Target = "ref" | "rref";

export const clone = (m: Matrix): Matrix => m.map((r) => r.slice());

export function applyOp(m: Matrix, op: Op): Matrix {
  const out = clone(m);
  if (op.kind === "swap") [out[op.i], out[op.j]] = [out[op.j], out[op.i]];
  else if (op.kind === "scale") out[op.i] = out[op.i].map((x) => mul(x, op.k));
  else out[op.i] = out[op.i].map((x, c) => add(x, mul(op.k, m[op.j][c])));
  return out;
}

const diff = (a: Matrix, b: Matrix) => {
  const s = new Set<string>();
  a.forEach((row, r) => row.forEach((x, c) => { if (!eq(x, b[r][c])) s.add(`${r},${c}`); }));
  return s;
};

const R = (i: number) => `R${i + 1}`;

/**
 * Gauss–Jordan, textbook style: forward phase reaches echelon form (first nonzero entry is the pivot,
 * swap up if needed, clear below); back phase makes each pivot 1 and clears above it.
 * `target` "ref" stops after the forward phase (row echelon form); "rref" continues to reduced form.
 * The REF steps are a prefix of the RREF steps, so a viewer can switch target without losing its place.
 * `augmented` = number of trailing columns that aren't variables (the | b part).
 */
export function eliminate(start: Matrix, target: Target = "rref", augmented = 1): Step[] {
  const steps: Step[] = [];
  let m = clone(start);
  const rows = m.length;
  const cols = rows ? m[0].length - augmented : 0;
  const push = (op: Op, pivot: [number, number], phase: Step["phase"], why: string) => {
    const next = applyOp(m, op);
    steps.push({ op, matrix: next, pivot, phase, changed: diff(m, next), why });
    m = next;
  };

  const pivots: [number, number][] = [];
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    let p = r;
    while (p < rows && isZero(m[p][c])) p++;
    if (p === rows) continue; // no pivot in this column
    if (p !== r) push({ kind: "swap", i: r, j: p }, [r, c], "forward", `${R(r)} has a zero in column ${c + 1}; ${R(p)} doesn't. Swap so the pivot is on top.`);
    for (let i = r + 1; i < rows; i++) {
      if (isZero(m[i][c])) continue;
      const k = neg(div(m[i][c], m[r][c]));
      push({ kind: "add", i, j: r, k }, [r, c], "forward", `Clear the entry below the pivot: subtract the right multiple of ${R(r)} from ${R(i)}.`);
    }
    pivots.push([r, c]);
    r++;
  }

  if (target === "ref") return steps;

  for (let idx = pivots.length - 1; idx >= 0; idx--) {
    const [pr, pc] = pivots[idx];
    if (!isOne(m[pr][pc])) push({ kind: "scale", i: pr, k: div(ONE, m[pr][pc]) }, [pr, pc], "back", `Scale ${R(pr)} so the pivot is 1.`);
    for (let i = pr - 1; i >= 0; i--) {
      if (isZero(m[i][pc])) continue;
      const k = neg(m[i][pc]);
      push({ kind: "add", i, j: pr, k }, [pr, pc], "back", `Clear the entry above the pivot: subtract the right multiple of ${R(pr)} from ${R(i)}.`);
    }
  }
  return steps;
}

const sub_ = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];
export const Rsub = (i: number) => `R${sub_[(i + 1) % 10]}`;

/** Coefficient for display: 2 → "2", -1 → "−", 1/2 → "½"-style "1/2". */
const coef = (k: Frac) => {
  const abs = { n: Math.abs(k.n), d: k.d };
  if (abs.n === abs.d) return "";
  return abs.d === 1 ? `${abs.n}` : `${abs.n}/${abs.d}`;
};

/** "R₂ ← R₂ − 2·R₁" */
export function describe(op: Op): string {
  if (op.kind === "swap") return `${Rsub(op.i)} ↔ ${Rsub(op.j)}`;
  if (op.kind === "scale") return `${Rsub(op.i)} ← ${coef(op.k) || "1"}·${Rsub(op.i)}`;
  const sign = op.k.n < 0 ? "−" : "+";
  const c = coef(op.k);
  return `${Rsub(op.i)} ← ${Rsub(op.i)} ${sign} ${c ? c + "·" : ""}${Rsub(op.j)}`;
}


export type Solution =
  | { kind: "unique"; x: Frac[] }
  | { kind: "none"; row: number }
  | { kind: "infinite"; free: number[] };

/** Read the solution off a reduced matrix with one augmented column. */
export function solve(rref: Matrix, vars: number): Solution {
  const pivotCols: number[] = [];
  for (let r = 0; r < rref.length; r++) {
    const c = rref[r].findIndex((x, i) => i < vars && !isZero(x));
    if (c === -1) {
      if (!isZero(rref[r][vars])) return { kind: "none", row: r };
      continue;
    }
    pivotCols.push(c);
  }
  if (pivotCols.length < vars) {
    const free = Array.from({ length: vars }, (_, c) => c).filter((c) => !pivotCols.includes(c));
    return { kind: "infinite", free };
  }
  const x: Frac[] = Array(vars);
  pivotCols.forEach((c, r) => { x[c] = rref[r][vars]; });
  return { kind: "unique", x };
}
