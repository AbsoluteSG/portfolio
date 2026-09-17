/** Exact rationals, so elimination shows 1/3 instead of 0.333…. Small integers only; no bigint needed for a textbook matrix. */
export interface Frac {
  n: number;
  d: number; // always > 0
}

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

export function frac(n: number, d = 1): Frac {
  if (d === 0) throw new Error("division by zero");
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d) || 1;
  return { n: n / g, d: d / g };
}

export const ZERO = frac(0);
export const ONE = frac(1);

export const add = (a: Frac, b: Frac) => frac(a.n * b.d + b.n * a.d, a.d * b.d);
export const sub = (a: Frac, b: Frac) => frac(a.n * b.d - b.n * a.d, a.d * b.d);
export const mul = (a: Frac, b: Frac) => frac(a.n * b.n, a.d * b.d);
export const div = (a: Frac, b: Frac) => frac(a.n * b.d, a.d * b.n);
export const neg = (a: Frac) => frac(-a.n, a.d);
export const isZero = (a: Frac) => a.n === 0;
export const isOne = (a: Frac) => a.n === 1 && a.d === 1;
export const eq = (a: Frac, b: Frac) => a.n === b.n && a.d === b.d;

/** "3", "-1/2", "0.25" → Frac. Returns null for anything else. */
export function parseFrac(s: string): Frac | null {
  const t = s.trim().replace(/\s+/g, "");
  if (t === "") return null;
  let m = t.match(/^(-?\d+)\/(-?\d+)$/);
  if (m) return Number(m[2]) === 0 ? null : frac(Number(m[1]), Number(m[2]));
  m = t.match(/^(-?)(\d*)\.(\d{1,6})$/);
  if (m) {
    const sign = m[1] === "-" ? -1 : 1;
    const whole = Number(m[2] || "0");
    const scale = 10 ** m[3].length;
    return frac(sign * (whole * scale + Number(m[3])), scale);
  }
  m = t.match(/^-?\d+$/);
  if (m) return frac(Number(t));
  return null;
}

export const fmt = (a: Frac) => (a.d === 1 ? String(a.n) : `${a.n}/${a.d}`);
export const key = (a: Frac) => `${a.n}/${a.d}`;
