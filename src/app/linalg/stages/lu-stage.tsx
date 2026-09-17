"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Shuffle } from "lucide-react";
import { type Frac, frac, fmt } from "../lib/fraction";
import { type Matrix, describe, Rsub } from "../lib/elimination";
import { lu } from "../lib/lu";
import { type Tone, MatrixView, Slot, Sym } from "./bits";

const DEFAULT: number[][] = [
  [2, 1, 1],
  [4, -6, 0],
  [-2, 7, 2],
];
const toMatrix = (m: number[][]): Matrix => m.map((r) => r.map((x) => frac(x)));
const sub = (n: number) => String(n).replace(/\d/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[Number(d)]);

export function LUStage() {
  const [A, setA] = useState<Matrix>(() => toMatrix(DEFAULT));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const n = A.length;

  const res = useMemo(() => lu(A), [A]);
  const nSteps = res.steps.length;
  const LAST = nSteps + 1; // nSteps + 1 = the L reveal
  const goTo = useCallback((k: number) => setStep(Math.max(0, Math.min(LAST, k))), [LAST]);

  useEffect(() => {
    if (!playing) return;
    if (step >= LAST) { setPlaying(false); return; }
    const t = setTimeout(() => goTo(step + 1), 1700);
    return () => clearTimeout(t);
  }, [playing, step, LAST, goTo]);

  const fork = (next: Matrix) => { setA(next); setStep(0); setPlaying(false); };
  const onEdit = (r: number, c: number, v: Frac) => { const next = A.map((row) => row.slice()); next[r][c] = v; fork(next); };
  const resize = (d: number) => {
    const m = Math.max(2, Math.min(4, n + d));
    fork(Array.from({ length: m }, (_, r) => Array.from({ length: m }, (_, c) => A[r]?.[c] ?? frac(r === c ? 1 : 0))));
  };
  const shuffle = () => {
    const rnd = () => Math.floor(Math.random() * 9) - 4;
    fork(Array.from({ length: n }, () => Array.from({ length: n }, () => frac(rnd()))));
  };
  const onKey = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(step + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(step - 1); }
    if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
  };

  // ── What this step shows ──
  const cur = step > 0 && step <= nSteps ? res.steps[step - 1] : null;
  const working = step === 0 ? A : step <= nSteps ? res.steps[step - 1].matrix : res.U;
  const reveal = step === LAST;
  const isPerm = (i: number) => res.steps[i].op.kind === "swap";
  const Ename = (i: number) => (isPerm(i) ? `P${sub(i + 1)}` : `E${sub(i + 1)}`);

  // Formula strip: E₃E₂E₁A, then A = LU.
  const formula = reveal
    ? (res.swapped ? <>P A = L U</> : <>A = L U</>)
    : <>{Array.from({ length: step }, (_, i) => Ename(step - 1 - i)).join("")}A{step === nSteps && nSteps > 0 ? " = U" : ""}</>;

  const eTone = (i: number) => (r: number, c: number): Tone => {
    const op = res.steps[i].op;
    if (op.kind === "swap") return (r === op.i && c === op.j) || (r === op.j && c === op.i) ? "accent" : r === c ? undefined : "muted";
    if (op.kind === "add") return r === op.i && c === op.j ? "accent" : r === c ? undefined : "muted";
    return r === c ? undefined : "muted";
  };
  const workTone = (r: number, c: number): Tone => (cur?.changed.has(`${r},${c}`) ? "changed" : undefined);
  const lTone = (r: number, c: number): Tone => (r > c ? "accent" : r < c ? "muted" : undefined);
  const uTone = (r: number, c: number): Tone => (r > c ? "muted" : undefined);

  let caption: React.ReactNode;
  if (step === 0) caption = <><p className="la-display text-2xl md:text-3xl">Start with A.</p><p className="mt-1 text-sm text-[var(--la-ink-soft)]">Every move of elimination is itself a matrix. Click any number to change A, then step.</p></>;
  else if (cur) {
    const op = cur.op;
    const what = op.kind === "swap"
      ? <>{Ename(step - 1)} is the identity with rows {op.i + 1} and {op.j + 1} swapped. Multiplying by it swaps those rows.</>
      : op.kind === "add"
        ? <>{Ename(step - 1)} is the identity with <span className="text-[var(--la-amber)]">{fmt(op.k)}</span> in row {op.i + 1}, column {op.j + 1}. Multiplying by it adds {fmt(op.k)}·{Rsub(op.j)} to {Rsub(op.i)}.</>
        : null;
    caption = <><p className="la-display text-2xl md:text-3xl">{describe(op)}</p><p className="mt-1 text-sm text-[var(--la-ink-soft)]">{what}{step === nSteps && <> That&apos;s U: upper triangular.</>}</p></>;
  } else {
    caption = <>
      <p className="la-display text-2xl md:text-3xl">L is elimination, remembered.</p>
      <p className="mt-1 text-sm text-[var(--la-ink-soft)]">
        Each E undoes with its sign flipped, and E₁⁻¹E₂⁻¹⋯ multiplies out to L: ones on the diagonal, and below it,
        <span className="text-[var(--la-amber)]"> the multipliers</span> elimination used, with their signs flipped back.
        {res.swapped && <> A row swap was needed, so P records it and the factorisation is of PA.</>}
        {nSteps === 0 && <> No elimination was needed: A is already upper triangular, so L is the identity.</>}
      </p>
    </>;
  }

  return (
    <div className="la-elim" tabIndex={0} onKeyDown={onKey} aria-label="Elimination as elementary matrices, then A = LU">
      <div className="la-lu-formula la-display" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={reveal ? "lu" : step} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
            {formula}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="la-lu-scene">
        <AnimatePresence initial={false} mode="popLayout">
          {reveal && res.swapped && <Slot k="P"><MatrixView m={res.P} label="P" size="sm" /><Sym>·</Sym></Slot>}
          {reveal && res.swapped && <Slot k="A2"><MatrixView m={A} label="A" size="sm" /><Sym>=</Sym></Slot>}
          {reveal && <Slot k="L"><MatrixView m={res.L} label="L" tone={lTone} /><Sym>·</Sym></Slot>}
          {cur && <Slot k={`E${step}`}><MatrixView m={res.E[step - 1]} label={Ename(step - 1)} tone={eTone(step - 1)} /><Sym>·</Sym></Slot>}
        </AnimatePresence>

        <MatrixView
          m={working}
          label={step === 0 ? "A" : step < nSteps ? `${Ename(step - 1)}⋯A` : "U"}
          tone={reveal ? uTone : workTone}
          delay={cur ? 0.35 : 0}
          onEdit={step === 0 ? onEdit : undefined}
        />

        <AnimatePresence initial={false} mode="popLayout">
          {reveal && !res.swapped && <Slot k="eqA"><Sym>=</Sym><MatrixView m={A} label="A" tone={() => "muted"} /></Slot>}
        </AnimatePresence>
      </div>

      <div className="la-elim-caption" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={{ opacity: 0, y: 8, filter: "blur(2px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(2px)" }} transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}>
            {caption}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="la-elim-controls">
        <div className="flex items-center gap-1">
          <button type="button" className="la-ctl" onClick={() => goTo(0)} aria-label="Back to start" disabled={step === 0}><RotateCcw className="size-4" /></button>
          <button type="button" className="la-ctl" onClick={() => goTo(step - 1)} aria-label="Previous step" disabled={step === 0}><ChevronLeft className="size-4" /></button>
          <button type="button" className="la-ctl la-ctl-primary" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"} disabled={reveal}>
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <button type="button" className="la-ctl" onClick={() => goTo(step + 1)} aria-label="Next step" disabled={reveal}><ChevronRight className="size-4" /></button>
        </div>
        <label className="flex min-w-0 flex-[1_1_12rem] items-center gap-3">
          <input type="range" min={0} max={LAST} value={step} onChange={(e) => goTo(Number(e.target.value))} className="la-range" aria-label="Step" />
          <span className="la-mono w-12 shrink-0 text-right text-xs text-[var(--la-ink-soft)]">{step} / {LAST}</span>
        </label>
        <div className="la-mono ml-auto flex items-center gap-1 text-xs text-[var(--la-ink-soft)]">
          <button type="button" className="la-ctl" onClick={() => resize(-1)} disabled={n <= 2} aria-label="Smaller">−</button>
          <span>{n} × {n}</span>
          <button type="button" className="la-ctl" onClick={() => resize(1)} disabled={n >= 4} aria-label="Larger">+</button>
          <button type="button" className="la-ctl ml-2" onClick={shuffle} aria-label="Random matrix" title="Random matrix"><Shuffle className="size-4" /></button>
        </div>
      </div>
    </div>
  );
}
