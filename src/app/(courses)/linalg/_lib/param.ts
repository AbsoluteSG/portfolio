/**
 * Elimination on a matrix whose entries may contain one parameter.
 *
 * Every entry is linear in the parameter — c + b·k — and stays that way, because we only ever
 * pivot on entries that are free of it. That restriction is the same one you follow by hand:
 * never divide by an expression that might be zero.
 */
import { type Frac, frac, ZERO, add, sub, mul, div, neg, isZero, eq, fmt as fmtFrac, parseFrac } from "./fraction";
import { type Matrix, eliminate, solve } from "./elimination";

/** c + b·k */
export interface Lin {
  c: Frac;
  b: Frac;
}

export const lin = (c: Frac, b: Frac = ZERO): Lin => ({ c, b });
export const linNum = (n: number): Lin => lin(frac(n));
export const LZERO = lin(ZERO);

export const lAdd = (x: Lin, y: Lin): Lin => lin(add(x.c, y.c), add(x.b, y.b));
export const lSub = (x: Lin, y: Lin): Lin => lin(sub(x.c, y.c), sub(x.b, y.b));
/** Scaling is only ever by a parameter-free factor, so the result stays linear. */
export const lScale = (x: Lin, f: Frac): Lin => lin(mul(x.c, f), mul(x.b, f));
export const lIsZero = (x: Lin) => isZero(x.c) && isZero(x.b);
export const lIsConst = (x: Lin) => isZero(x.b);
export const lEq = (x: Lin, y: Lin) => eq(x.c, y.c) && eq(x.b, y.b);
/** The value of this entry when the parameter takes a given value. */
export const lAt = (x: Lin, k: Frac): Frac => add(x.c, mul(x.b, k));

export type LinMatrix = Lin[][];

/** "3", "-1/2", "k", "k+3", "2k-1", "-k", "4-2k" → Lin. Null for anything else. */
export function parseLin(s: string, symbol = "k"): Lin | null {
  const t = s.trim().replace(/\s+/g, "").replace(/−/g, "-").toLowerCase();
  if (t === "") return null;
  const sym = symbol.toLowerCase();
  if (!t.includes(sym)) {
    const f = parseFrac(t);
    return f ? lin(f) : null;
  }
  // Split into signed terms, e.g. "-2k+3" → ["-2k", "+3"].
  const terms = t.match(/[+-]?[^+-]+/g);
  if (!terms) return null;
  let c = ZERO;
  let b = ZERO;
  for (const raw of terms) {
    const sign = raw.startsWith("-") ? -1 : 1;
    const body = raw.replace(/^[+-]/, "");
    if (body.includes(sym)) {
      const coeff = body.replace(sym, "");
      if (coeff === "") {
        b = add(b, frac(sign));
      } else {
        const f = parseFrac(coeff);
        if (!f) return null;
        b = add(b, mul(f, frac(sign)));
      }
    } else {
      const f = parseFrac(body);
      if (!f) return null;
      c = add(c, mul(f, frac(sign)));
    }
  }
  return lin(c, b);
}

/** "k+33", "−2k", "3", "1/2 k − 1" — for display. */
export function fmtLin(x: Lin, symbol = "k"): string {
  const minus = (s: string) => s.replace("-", "−");
  if (isZero(x.b)) return minus(fmtFrac(x.c));
  const coeff = eq(x.b, frac(1)) ? symbol : eq(x.b, frac(-1)) ? `-${symbol}` : `${fmtFrac(x.b)}${symbol}`;
  if (isZero(x.c)) return minus(coeff);
  const sign = x.c.n < 0 ? "−" : "+";
  return `${minus(coeff)} ${sign} ${fmtFrac(frac(Math.abs(x.c.n), x.c.d))}`;
}

/** What a step did, in a form the work panel can lay out as arithmetic. */
export type LinOp =
  | { kind: "swap"; i: number; j: number }
  /** R_i → R_i − f·R_j */
  | { kind: "add"; i: number; j: number; f: Frac };

export interface LinStep {
  matrix: LinMatrix;
  /** e.g. "R₂ → R₂ − 2R₁" */
  op: string;
  detail: LinOp;
}

const SUB = "₀₁₂₃₄₅₆₇₈₉";
const rowName = (i: number) => `R${String(i + 1).replace(/\d/g, (d) => SUB[Number(d)])}`;
const coeffName = (f: Frac) => (eq(f, frac(1)) ? "" : eq(f, frac(-1)) ? "−" : fmtFrac(f).replace("-", "−"));

export interface LinElimination {
  steps: LinStep[];
  ref: LinMatrix;
  pivots: number[];
  /**
   * Set when the parameter reached a pivot position and elimination had to stop: dividing by it
   * would assume it is nonzero, which is exactly what the question is asking about.
   */
  blockedAt: number | null;
}

/** Forward elimination, pivoting only on parameter-free entries. `augmented` columns are excluded from pivoting. */
export function eliminateLin(start: LinMatrix, augmented = 1): LinElimination {
  const m = start.map((r) => r.slice());
  const rows = m.length;
  const cols = m[0].length - augmented;
  const steps: LinStep[] = [];
  const pivots: number[] = [];
  let r = 0;
  let blockedAt: number | null = null;

  for (let c = 0; c < cols && r < rows; c++) {
    // Prefer a pivot with no parameter in it — that is what keeps every later entry linear.
    let p = -1;
    for (let i = r; i < rows; i++) {
      if (!lIsZero(m[i][c]) && lIsConst(m[i][c])) { p = i; break; }
    }
    if (p === -1) {
      // Only parameter-bearing entries here. Pivoting would mean dividing by something that may be zero.
      if (m.slice(r).some((row) => !lIsZero(row[c]))) { blockedAt = c; break; }
      continue; // the whole column is zero: no pivot, move right
    }
    if (p !== r) {
      [m[r], m[p]] = [m[p], m[r]];
      steps.push({ matrix: m.map((x) => x.slice()), op: `${rowName(r)} ↔ ${rowName(p)}`, detail: { kind: "swap", i: r, j: p } });
    }
    for (let i = r + 1; i < rows; i++) {
      if (lIsZero(m[i][c])) continue;
      // The pivot is parameter-free, so this multiplier is an ordinary rational.
      const f = div(m[i][c].c, m[r][c].c);
      m[i] = m[i].map((x, j) => lSub(x, lScale(m[r][j], f)));
      const sign = f.n < 0 ? "+" : "−";
      const mag = coeffName(frac(Math.abs(f.n), f.d));
      steps.push({
        matrix: m.map((x) => x.slice()),
        op: `${rowName(i)} → ${rowName(i)} ${sign} ${mag}${rowName(r)}`,
        detail: { kind: "add", i, j: r, f },
      });
    }
    pivots.push(c);
    r++;
  }

  return { steps, ref: m, pivots, blockedAt };
}

export type Verdict = "unique" | "infinite" | "none";

/** The parameter values where the answer changes: the roots of every entry that still contains it. */
export function criticalValues(e: LinElimination, augmented = 1): Frac[] {
  const out: Frac[] = [];
  const cols = e.ref[0].length;
  for (const row of e.ref) {
    for (let c = 0; c < cols; c++) {
      const x = row[c];
      if (isZero(x.b)) continue;
      // c + b·k = 0
      const root = neg(div(x.c, x.b));
      if (!out.some((v) => eq(v, root))) out.push(root);
      break; // the leading parameter entry of the row is the one that matters
    }
  }
  // A row that is all zeros in the coefficients but parameterised on the right also flips the answer.
  for (const row of e.ref) {
    const coeffs = row.slice(0, cols - augmented);
    if (!coeffs.every(lIsZero)) continue;
    const rhs = row[cols - 1];
    if (isZero(rhs.b)) continue;
    const root = neg(div(rhs.c, rhs.b));
    if (!out.some((v) => eq(v, root))) out.push(root);
  }
  return out.sort((a, b) => a.n / a.d - b.n / b.d);
}

/** Substitute a value for the parameter and classify the resulting ordinary system exactly. */
export function classifyAt(start: LinMatrix, k: Frac, augmented = 1): { verdict: Verdict; free: number } {
  const numeric: Matrix = start.map((row) => row.map((x) => lAt(x, k)));
  const vars = numeric[0].length - augmented;
  const steps = eliminate(numeric, "rref", augmented);
  const rref = steps.length ? steps[steps.length - 1].matrix : numeric;
  const sol = solve(rref, vars);
  if (sol.kind === "none") return { verdict: "none", free: 0 };
  if (sol.kind === "unique") return { verdict: "unique", free: 0 };
  return { verdict: "infinite", free: sol.free.length };
}
