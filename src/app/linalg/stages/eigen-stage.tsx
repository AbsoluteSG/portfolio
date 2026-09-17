"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Shuffle } from "lucide-react";
import { type Frac, frac, fmt, add, sub, mul, div, neg, isZero, eq, ZERO, ONE } from "../lib/fraction";
import { type Matrix, eliminate } from "../lib/elimination";
import { matmul } from "../lib/lu";
import { type Tone, MatrixView, Fraction } from "./bits";

const DEFAULT: number[][] = [
  [3, 1],
  [0, 2],
];
const PRESETS: { name: string; m: number[][] }[] = [
  { name: "Triangular", m: [[3, 1], [0, 2]] },
  { name: "Symmetric", m: [[2, 1], [1, 2]] },
  { name: "Reflection", m: [[0, 1], [1, 0]] },
  { name: "Projection", m: [[1, 0], [0, 0]] },
  { name: "Shear", m: [[1, 1], [0, 1]] },
  { name: "Rotation", m: [[0, -1], [1, 0]] },
  { name: "Irrational", m: [[1, 1], [1, 0]] },
];
const toMatrix = (m: number[][]): Matrix => m.map((r) => r.map((x) => frac(x)));

/** √(n/d) as a Frac when both are perfect squares; otherwise null. */
function sqrtFrac(x: Frac): Frac | null {
  if (x.n < 0) return null;
  const rn = Math.round(Math.sqrt(x.n)), rd = Math.round(Math.sqrt(x.d));
  return rn * rn === x.n && rd * rd === x.d ? frac(rn, rd) : null;
}
const toNum = (x: Frac) => x.n / x.d;
const fnum = (n: number) => (Math.abs(n) < 0.005 ? "0" : n.toFixed(2).replace(/\.?0+$/, "")).replace("-", "−");

/** The whole worked problem for a 2×2. */
function analyse(A: Matrix) {
  const [[a, c], [b, d]] = A; // A = [a c; b d]
  const tr = add(a, d);
  const det = sub(mul(a, d), mul(b, c));
  const disc = sub(mul(tr, tr), mul(frac(4), det));
  if (disc.n < 0) return { kind: "complex" as const, tr, det, disc, re: toNum(tr) / 2, im: Math.sqrt(-toNum(disc)) / 2 };
  const root = sqrtFrac(disc);
  if (!root) {
    const r = Math.sqrt(toNum(disc));
    const l = [(toNum(tr) + r) / 2, (toNum(tr) - r) / 2];
    // v ⟂ the first row of A − λI: (a − λ, c) → v = (c, λ − a), or (1, 0) if that row vanished.
    const vs = l.map((lam) => (Math.abs(toNum(a) - lam) > 1e-9 || !isZero(c) ? [toNum(c), lam - toNum(a)] : [1, 0]));
    return { kind: "irrational" as const, tr, det, disc, r, lambdas: l, vs };
  }
  const lambdas = [div(add(tr, root), frac(2)), div(sub(tr, root), frac(2))];
  const repeated = eq(lambdas[0], lambdas[1]);
  const per = (root === null ? [] : repeated ? [lambdas[0]] : lambdas).map((lam) => {
    const M: Matrix = [[sub(a, lam), c], [b, sub(d, lam)]];
    const steps = eliminate(M, "ref", 0);
    const R = steps.length ? steps[steps.length - 1].matrix : M;
    const [p, q] = R[0];
    // p·x + q·y = 0 on the surviving row.
    let v: Frac[], how: string;
    if (!isZero(p)) { v = [neg(q), p]; how = `Set y = ${fmt(p)}; then ${fmt(p)}·x = ${fmt(neg(q))}·${fmt(p)}, so x = ${fmt(neg(q))}.`; if (isZero(q)) { v = [ZERO, ONE]; how = `${fmt(p)}·x = 0 forces x = 0; y is free. Take y = 1.`; } }
    else if (!isZero(q)) { v = [ONE, ZERO]; how = `${fmt(q)}·y = 0 forces y = 0; x is free. Take x = 1.`; }
    else { v = [ONE, ZERO]; how = "Both rows vanished: every vector is an eigenvector. Take (1, 0) and (0, 1)."; }
    const Av = matmul(A, v.map((x) => [x])).map((r) => r[0]);
    return { lam, M, steps, R, v, how, Av, whole: isZero(p) && isZero(q) };
  });
  return { kind: "real" as const, tr, det, disc, root, lambdas, repeated, per };
}

/** Cells of A − λI written symbolically. */
function SymMatrix({ A }: { A: Matrix }) {
  const cell = (v: Frac, diag: boolean) => (
    <div className="la-cell la-mv-cell la-mv-static" style={{ width: diag ? "5.2rem" : undefined }}>
      <span className="la-num-display"><Fraction v={v} />{diag && <span className="la-lam">&nbsp;− λ</span>}</span>
    </div>
  );
  return (
    <div className="la-mv">
      <div className="la-mv-label">A − λI</div>
      <div className="la-mv-body">
        <div className="la-bracket" style={{ marginLeft: 0 }} aria-hidden />
        <div>
          <div className="la-mv-row">{cell(A[0][0], true)}{cell(A[0][1], false)}</div>
          <div className="la-mv-row">{cell(A[1][0], false)}{cell(A[1][1], true)}</div>
        </div>
        <div className="la-bracket la-bracket-r" aria-hidden />
      </div>
    </div>
  );
}

const F = ({ v }: { v: Frac }) => <span className="la-inline-frac"><Fraction v={v} /></span>;
const paren = (v: Frac) => (v.n < 0 || v.d !== 1 ? <>(<F v={v} />)</> : <F v={v} />);
const signed = (v: Frac) => <>{v.n < 0 ? " − " : " + "}<F v={frac(Math.abs(v.n), v.d)} /></>; // " − 5" or " + 6"
const Eq = ({ children }: { children: React.ReactNode }) => <div className="la-eq">{children}</div>;
const Vec = ({ v, tone }: { v: (Frac | number)[]; tone?: Tone }) => (
  <span className={`la-vec ${tone === "accent" ? "la-e1" : tone === "changed" ? "la-e2" : ""}`}>
    ({v.map((x, i) => <span key={i}>{i > 0 && ", "}{typeof x === "number" ? fnum(x) : <F v={x} />}</span>)})
  </span>
);

export function EigenStage() {
  const [A, setA] = useState<Matrix>(() => toMatrix(DEFAULT));
  const [stepRaw, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const R = useMemo(() => analyse(A), [A]);

  // Build the frames for this matrix. Each is a scene + a caption.
  const frames = useMemo(() => {
    const [[a, c], [b, d]] = A;
    const out: { scene: React.ReactNode; title: React.ReactNode; why: React.ReactNode; label: string }[] = [];
    const push = (label: string, title: React.ReactNode, why: React.ReactNode, scene: React.ReactNode) => out.push({ label, title, why, scene });

    push("setup", <>Find v with Av = λv.</>, <>An eigenvector keeps its direction; λ is how much it stretches. Move everything to one side: (A − λI)v = 0. A nonzero v exists only if A − λI squashes something to zero, i.e. it&apos;s singular.</>,
      <MatrixView m={A} label="A" onEdit={(r, cc, v) => { const n = A.map((row) => row.slice()); n[r][cc] = v; setA(n); setStep(0); }} />);

    push("A − λI", <>Subtract λ from the diagonal.</>, <>That&apos;s A − λI. We need its determinant to be zero.</>, <SymMatrix A={A} />);

    push("det", <>det(A − λI) = 0</>, <>For a 2×2, the determinant is (top-left)(bottom-right) − (top-right)(bottom-left).</>,
      <Eq>({paren(a)} − λ)({paren(d)} − λ) − {paren(c)}·{paren(b)} = 0</Eq>);

    push("expand", <>The characteristic polynomial.</>, <>Multiply out. The λ coefficient is always −(trace), the constant is always det A. For a 2×2 you can write this line down directly.</>,
      <Eq>λ<sup>2</sup>{signed(neg(R.tr))}λ{signed(R.det)} = 0<span className="la-eq-note">tr A = <F v={R.tr} /> · det A = <F v={R.det} /> · discriminant tr² − 4·det = <F v={R.disc} /></span></Eq>);

    if (R.kind === "complex") {
      push("roots", <>No real roots.</>, <>The discriminant is negative, so λ = {fnum(R.re)} ± {fnum(R.im)}i. Over the reals there are no eigenvectors: this matrix turns every direction. (Rotations do this.)</>,
        <Eq>λ = <F v={R.tr} />/2 ± √(<F v={R.disc} />)/2 = {fnum(R.re)} ± {fnum(R.im)}i</Eq>);
      return out;
    }
    if (R.kind === "irrational") {
      push("roots", <>Two real roots, not rational.</>, <>Quadratic formula. Irrational eigenvalues are fine; the method is identical, the arithmetic just gets ugly.</>,
        <Eq>λ = (<F v={R.tr} /> ± √<F v={R.disc} />)/2<span className="la-eq-note">λ₁ ≈ <span className="la-e1">{fnum(R.lambdas[0])}</span> · λ₂ ≈ <span className="la-e2">{fnum(R.lambdas[1])}</span></span></Eq>);
      push("vectors", <>Eigenvectors, numerically.</>, <>For each λ, a vector perpendicular to the first row of A − λI is in its null space: (a − λ, c) ⟂ (c, λ − a).</>,
        <Eq><span className="la-e1">v₁ ≈ <Vec v={R.vs[0]} /></span><br /><span className="la-e2">v₂ ≈ <Vec v={R.vs[1]} /></span></Eq>);
      return out;
    }

    const { lambdas, repeated, per, root } = R;
    push("roots", repeated ? <>One root, twice.</> : <>Two roots.</>,
      repeated
        ? <>The discriminant is zero, so the polynomial is a perfect square: (λ − <F v={lambdas[0]} />)² = 0.</>
        : <>The discriminant <F v={R.disc} /> is a perfect square, so this factors: (λ − <F v={lambdas[0]} />)(λ − <F v={lambdas[1]} />) = 0.</>,
      <Eq>
        λ = (<F v={R.tr} /> ± <F v={root} />)/2
        <span className="la-eq-note">λ₁ = <span className="la-e1"><F v={lambdas[0]} /></span>{!repeated && <> · λ₂ = <span className="la-e2"><F v={lambdas[1]} /></span></>}</span>
      </Eq>);

    per.forEach((p, i) => {
      const cls = i === 0 ? "la-e1" : "la-e2";
      const tone: Tone = i === 0 ? "accent" : "changed";
      const lamLabel = <>λ{repeated ? "" : i === 0 ? "₁" : "₂"} = <F v={p.lam} /></>;
      push(`λ${i + 1}: A − λI`, <span className={cls}>Plug in {lamLabel}.</span>, <>Now A − λI is a matrix of plain numbers. Its null space is the eigenspace: solve (A − λI)v = 0 by row reduction.</>,
        <div className="la-lu-scene"><MatrixView m={p.M} label={<>A − <F v={p.lam} />I</>} /></div>);
      push(`λ${i + 1}: reduce`, <span className={cls}>Row reduce.</span>,
        <>{p.steps.length ? <>{p.steps.length === 1 ? "One row operation" : `${p.steps.length} row operations`} and the second row is all zeros. It has to be: we chose λ precisely so that this matrix is singular.</> : <>Already reduced: the second row is zero. That&apos;s what choosing λ from the characteristic equation guarantees.</>}</>,
        <div className="la-lu-scene">
          <MatrixView m={p.M} label={<>A − <F v={p.lam} />I</>} tone={() => "muted"} size="sm" />
          <span className="la-lu-sym">→</span>
          <MatrixView m={p.R} label="reduced" tone={(r) => (r === 1 ? "muted" : undefined)} delay={0.3} />
        </div>);
      push(`λ${i + 1}: read off`, <span className={cls}>Read off the eigenvector.</span>, <>The surviving row says <F v={p.R[0][0]} />·x{signed(p.R[0][1])}·y = 0. One equation, two unknowns: one of them is free. {p.how}</>,
        <Eq><span className={cls}>v{repeated ? "" : i === 0 ? "₁" : "₂"} = <Vec v={p.v} /></span>{p.whole && <span className="la-eq-note">A = λI: everything is an eigenvector, so the eigenspace is the whole plane.</span>}</Eq>);
      push(`λ${i + 1}: check`, <span className={cls}>Check: Av = λv.</span>, <>Multiply it out. If the result isn&apos;t a multiple of v, something upstream went wrong.</>,
        <Eq>A·<Vec v={p.v} /> = <Vec v={p.Av} tone={tone} /> = <F v={p.lam} />·<Vec v={p.v} /> ✓</Eq>);
    });

    if (repeated && per[0] && !per[0].whole) {
      push("defective", <>Only one direction.</>, <>A repeated eigenvalue with a single eigenvector line. There&apos;s no second independent eigenvector, so this matrix can&apos;t be diagonalised. Shears are the classic case.</>,
        <Eq><span className="la-e1">v = <Vec v={per[0].v} /></span>, and that&apos;s all.</Eq>);
    } else {
      const [p1, p2] = per.length === 2 ? per : [per[0], { ...per[0], v: [ZERO, ONE], lam: per[0].lam }];
      push("use", <>What they&apos;re for.</>, <>Write any vector as c₁v₁ + c₂v₂. Then A acts on each piece by plain scaling, so Aᵏx = c₁λ₁ᵏv₁ + c₂λ₂ᵏv₂: a thousand multiplications become a thousand powers of two numbers. That&apos;s diagonalisation, next chapter.</>,
        <Eq>A(c₁<span className="la-e1"><Vec v={p1.v} /></span> + c₂<span className="la-e2"><Vec v={p2.v} /></span>) = c₁·<span className="la-e1"><F v={p1.lam} /></span><span className="la-e1"><Vec v={p1.v} /></span> + c₂·<span className="la-e2"><F v={p2.lam} /></span><span className="la-e2"><Vec v={p2.v} /></span></Eq>);
    }
    return out;
  }, [A, R]);

  const LAST = frames.length - 1;
  const step = Math.min(stepRaw, LAST);
  const goTo = useCallback((k: number) => {
    const t = Math.max(0, Math.min(LAST, k));
    setStep(t);
    if (t >= LAST) setPlaying(false);
  }, [LAST]);
  useEffect(() => {
    if (!playing || step >= LAST) return;
    const t = setTimeout(() => goTo(step + 1), 2400);
    return () => clearTimeout(t);
  }, [playing, step, LAST, goTo]);

  const load = (m: number[][]) => { setA(toMatrix(m)); setStep(0); setPlaying(false); };
  const shuffle = () => { const r = () => Math.floor(Math.random() * 7) - 3; load([[r(), r()], [r(), r()]]); };
  const activePreset = PRESETS.find((p) => p.m.every((row, r) => row.every((x, cc) => eq(frac(x), A[r][cc]))))?.name;
  const f = frames[Math.min(step, LAST)];

  return (
    <div className="la-elim" tabIndex={0} onKeyDown={(e) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(step + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(step - 1); }
      if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
    }} aria-label="Finding eigenvalues and eigenvectors, step by step">
      {/* Breadcrumb of the procedure */}
      <ol className="la-crumbs" aria-label="Steps">
        {frames.map((fr, i) => (
          <li key={i}><button type="button" className="la-crumb" aria-current={i === step ? "step" : undefined} onClick={() => goTo(i)}>{fr.label}</button></li>
        ))}
      </ol>

      <div className="la-eig-scene">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={step} initial={{ opacity: 0, y: 10, filter: "blur(2px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, filter: "blur(2px)" }} transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }} className="la-eig-frame">
            {f.scene}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="la-elim-caption" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <p className="la-display text-2xl md:text-3xl">{f.title}</p>
            <p className="mx-auto mt-1 max-w-xl text-sm text-[var(--la-ink-soft)]">{f.why}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="la-chips" role="group" aria-label="Examples">
        {PRESETS.map((p) => <button key={p.name} type="button" className="la-chipbtn" aria-pressed={activePreset === p.name} onClick={() => load(p.m)}>{p.name}</button>)}
      </div>

      <div className="la-elim-controls">
        <div className="flex items-center gap-1">
          <button type="button" className="la-ctl" onClick={() => goTo(0)} aria-label="Back to start" disabled={step === 0}><RotateCcw className="size-4" /></button>
          <button type="button" className="la-ctl" onClick={() => goTo(step - 1)} aria-label="Previous step" disabled={step === 0}><ChevronLeft className="size-4" /></button>
          <button type="button" className="la-ctl la-ctl-primary" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"} disabled={step === LAST}>
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <button type="button" className="la-ctl" onClick={() => goTo(step + 1)} aria-label="Next step" disabled={step === LAST}><ChevronRight className="size-4" /></button>
        </div>
        <label className="flex min-w-0 flex-[1_1_12rem] items-center gap-3">
          <input type="range" min={0} max={LAST} value={step} onChange={(e) => goTo(Number(e.target.value))} className="la-range" aria-label="Step" />
          <span className="la-mono w-12 shrink-0 text-right text-xs text-[var(--la-ink-soft)]">{step} / {LAST}</span>
        </label>
        <button type="button" className="la-ctl ml-auto" onClick={shuffle} aria-label="Random matrix" title="Random matrix"><Shuffle className="size-4" /></button>
      </div>
    </div>
  );
}
