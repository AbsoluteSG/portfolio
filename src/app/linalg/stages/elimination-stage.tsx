"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, Reorder, useDragControls } from "motion/react";
import { ChevronLeft, ChevronRight, Eye, GripVertical, Pause, Play, RotateCcw, Shuffle, Sigma } from "lucide-react";
import { type Frac, frac, fmt, key, parseFrac, mul } from "../lib/fraction";
import { Num, Fraction } from "./bits";
import { type Matrix, type Step, type Target, eliminate, describe, solve, Rsub } from "../lib/elimination";

const ROW_H = 60; // px; fixed so the ghost row can be positioned without measuring
const DEFAULT: number[][] = [
  [0, 2, 1, -8],
  [1, -2, -3, 0],
  [-1, 1, 2, 3],
];
const toMatrix = (m: number[][]): Matrix => m.map((r) => r.map((x) => frac(x)));
let nextId = 0;
const newId = () => `r${nextId++}`;

interface CellProps {
  v: Frac;
  r: number;
  c: number;
  isPivot: boolean;
  changed: boolean;
  augmented: boolean;
  onEdit: (r: number, c: number, v: Frac) => void;
}

function Cell({ v, r, c, isPivot, changed, augmented, onEdit }: CellProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const invalid = editing && text !== "" && parseFrac(text) === null;

  const commit = () => {
    const parsed = parseFrac(text);
    if (parsed && key(parsed) !== key(v)) onEdit(r, c, parsed);
    setEditing(false);
  };

  return (
    <div
      className={`la-cell ${augmented ? "la-cell-aug" : ""} ${isPivot ? "la-cell-pivot" : ""}`}
      style={{ height: ROW_H }}
      onClick={() => { if (!editing) { setText(fmt(v)); setEditing(true); } }}
    >
      {editing ? (
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={(e) => e.target.select()}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
          aria-invalid={invalid}
          aria-label={`Row ${r + 1}, column ${c + 1}`}
          className="la-cell-input"
        />
      ) : (
        <Num v={v} delay={changed ? c * 0.05 : 0} tone={changed ? "changed" : undefined} />
      )}
    </div>
  );
}

function Row({ id, values, r, pivot, changed, vars, active, onEdit }: {
  id: string; values: Frac[]; r: number; pivot: [number, number] | null; changed: Set<string>; vars: number; active: boolean;
  onEdit: CellProps["onEdit"];
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={id}
      dragListener={false}
      dragControls={controls}
      className={`la-row-line ${active ? "la-row-active" : ""}`}
      style={{ height: ROW_H }}
      whileDrag={{ scale: 1.02, zIndex: 10, boxShadow: "0 12px 32px rgba(0,0,0,0.18)" }}
      layout
    >
      <button
        type="button"
        onPointerDown={(e) => controls.start(e)}
        className="la-grip"
        aria-label={`Drag to move row ${r + 1}`}
        title="Drag to swap rows"
      >
        <GripVertical className="size-4" />
      </button>
      <span className="la-mono la-rowlabel">{Rsub(r)}</span>
      {values.map((v, c) => (
        <Cell
          key={c}
          v={v}
          r={r}
          c={c}
          isPivot={!!pivot && pivot[0] === r && pivot[1] === c}
          changed={changed.has(`${r},${c}`)}
          augmented={c === vars}
          onEdit={onEdit}
        />
      ))}
    </Reorder.Item>
  );
}

export function EliminationStage() {
  const [source, setSource] = useState<Matrix>(() => toMatrix(DEFAULT));
  const [ids, setIds] = useState<string[]>(() => DEFAULT.map(newId));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [verbose, setVerbose] = useState(false);
  const [target, setTarget] = useState<Target>("rref");
  const [showResult, setShowResult] = useState(false);
  const dir = useRef<1 | -1>(1);
  useEffect(() => {
    try {
      setVerbose(localStorage.getItem("la:showWork") === "1");
      if (localStorage.getItem("la:target") === "ref") setTarget("ref");
      setShowResult(localStorage.getItem("la:showResult") === "1");
    } catch {}
  }, []);
  const toggleResult = () => {
    setShowResult((v) => {
      try { localStorage.setItem("la:showResult", v ? "0" : "1"); } catch {}
      return !v;
    });
  };
  const toggleVerbose = () => {
    setVerbose((v) => {
      try { localStorage.setItem("la:showWork", v ? "0" : "1"); } catch {}
      return !v;
    });
  };
  const vars = source[0].length - 1;

  const steps = useMemo(() => eliminate(source, target), [source, target]);
  const chooseTarget = (t: Target) => {
    setTarget(t);
    try { localStorage.setItem("la:target", t); } catch {}
    setPlaying(false);
  };
  // REF's steps are a prefix of RREF's, so switching target just clamps the position.
  useEffect(() => { setStep((s) => Math.min(s, steps.length)); }, [steps.length]);
  const current: Step | null = step > 0 ? steps[step - 1] : null;
  const finalMatrix = steps.length ? steps[steps.length - 1].matrix : source;
  const solution = useMemo(() => {
    const full = eliminate(source, "rref");
    return solve(full.length ? full[full.length - 1].matrix : source, vars);
  }, [source, vars]);
  const shown = current ? current.matrix : source;

  // Row identities at the current step: swap steps move ids so rows animate into their new slots.
  const idsNow = useMemo(() => {
    const out = ids.slice();
    for (let s = 0; s < step; s++) {
      const op = steps[s].op;
      if (op.kind === "swap") [out[op.i], out[op.j]] = [out[op.j], out[op.i]];
    }
    return out;
  }, [ids, steps, step]);

  const goTo = useCallback((n: number) => {
    setStep((s) => {
      const t = Math.max(0, Math.min(steps.length, n));
      dir.current = t >= s ? 1 : -1;
      return t;
    });
  }, [steps.length]);

  // Autoplay
  useEffect(() => {
    if (!playing) return;
    if (step >= steps.length) { setPlaying(false); return; }
    const t = setTimeout(() => goTo(step + 1), 1400);
    return () => clearTimeout(t);
  }, [playing, step, steps.length, goTo]);

  /** Editing or dragging forks the sim: whatever is on screen becomes the new starting matrix. */
  const fork = (next: Matrix, nextIds: string[]) => {
    setSource(next);
    setIds(nextIds);
    setStep(0);
    setPlaying(false);
  };
  const onEdit = (r: number, c: number, v: Frac) => {
    const next = shown.map((row) => row.slice());
    next[r][c] = v;
    fork(next, idsNow);
  };
  const onReorder = (order: string[]) => {
    const next = order.map((id) => shown[idsNow.indexOf(id)]);
    fork(next, order);
  };
  const resize = (dr: number, dc: number) => {
    const rows = Math.max(2, Math.min(4, shown.length + dr));
    const cols = Math.max(2, Math.min(4, vars + dc));
    const next: Matrix = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols + 1 }, (_, c) => {
        const srcC = c === cols ? vars : c; // keep the augmented column at the end
        return shown[r]?.[srcC] ?? frac(0);
      }),
    );
    fork(next, Array.from({ length: rows }, (_, r) => idsNow[r] ?? newId()));
  };
  const shuffle = () => {
    const rows = shown.length, cols = vars;
    const rnd = () => Math.floor(Math.random() * 9) - 4;
    const next: Matrix = Array.from({ length: rows }, () => Array.from({ length: cols + 1 }, () => frac(rnd())));
    fork(next, idsNow);
  };

  // Keyboard: arrows step, space plays.
  const onKey = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(step + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(step - 1); }
    if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
  };

  const op = current?.op ?? null;
  // Ghost row for an add step: k·R_j, drifting from R_j down onto R_i. R_j itself is untouched by the op.
  const before = step >= 2 ? steps[step - 2].matrix : source; // matrix the current op was applied to
  const addOp = !verbose && op && op.kind === "add" && dir.current === 1 ? op : null;
  const ghost = addOp ? { from: addOp.j, to: addOp.i, values: shown[addOp.j].map((x) => mul(x, addOp.k)), k: addOp.k } : null;
  const activeRow = op ? op.i : -1;
  const done = step === steps.length;

  return (
    <div className="la-elim" tabIndex={0} onKeyDown={onKey} aria-label="Gaussian elimination, step by step">
      {/* Matrix, and the worked arithmetic beside it when "show work" is on */}
      <div className="la-elim-scene">
      <div className="la-elim-matrix">
        <div className="la-bracket" aria-hidden />
        <div className="relative">
          <Reorder.Group axis="y" values={idsNow} onReorder={onReorder} className="relative">
            {idsNow.map((id, r) => (
              <Row
                key={id}
                id={id}
                r={r}
                values={shown[r]}
                pivot={current?.pivot ?? null}
                changed={current?.changed ?? new Set()}
                vars={vars}
                active={r === activeRow}
                onEdit={onEdit}
              />
            ))}
          </Reorder.Group>

          {/* Ghost: k·R_j drifting from its row onto R_i, then dissolving into the new values. */}
          <AnimatePresence>
            {ghost && (
              <motion.div
                key={`ghost-${step}`}
                className="la-ghost"
                style={{ height: ROW_H }}
                initial={{ top: ghost.from * ROW_H, opacity: 0 }}
                animate={{ top: [ghost.from * ROW_H, ghost.from * ROW_H, ghost.to * ROW_H], opacity: [0, 1, 0] }}
                transition={{ duration: 1.4, times: [0, 0.4, 1], ease: "easeInOut" }}
                exit={{ opacity: 0 }}
              >
                <span className="la-mono la-rowlabel text-[var(--la-amber)]">{describeK(ghost.k)}{Rsub(ghost.from)}</span>
                {ghost.values.map((v, c) => (
                  <span key={c} className={`la-cell text-[var(--la-amber)] ${c === vars ? "la-cell-aug" : ""}`} style={{ height: ROW_H }}>
                    <span className="la-num-display"><Fraction v={v} /></span>
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="la-bracket la-bracket-r" aria-hidden />
      </div>

      <AnimatePresence initial={false}>
        {(verbose && current) || showResult ? (
          <motion.div
            key="side"
            className="la-work-wrap"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {verbose && current ? (
                <motion.div key={`work-${step}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
                  <Work step={current} before={before} vars={vars} />
                </motion.div>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
                  <Result final={finalMatrix} vars={vars} target={target} solution={solution} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
      </div>

      {/* Caption */}
      <div className="la-elim-caption" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {current ? (
              <>
                <p className="la-display text-2xl md:text-3xl">{describe(current.op)}</p>
                <p className="mt-1 text-sm text-[var(--la-ink-soft)]">
                  <span className="la-mono text-[0.7rem] tracking-wider uppercase">{current.phase}</span> · {current.why}
                  {done && (target === "ref" ? " That's row echelon form." : " That's reduced row echelon form.")}
                </p>
              </>
            ) : (
              <>
                <p className="la-display text-2xl md:text-3xl">{steps.length ? "The augmented matrix." : "Already in reduced form."}</p>
                <p className="mt-1 text-sm text-[var(--la-ink-soft)]">Click any number to change it. Drag a row by its handle to swap. Then step through.</p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="la-elim-controls">
        <div className="flex items-center gap-1">
          <button type="button" className="la-ctl" onClick={() => goTo(0)} aria-label="Back to start" disabled={step === 0}><RotateCcw className="size-4" /></button>
          <button type="button" className="la-ctl" onClick={() => goTo(step - 1)} aria-label="Previous step" disabled={step === 0}><ChevronLeft className="size-4" /></button>
          <button type="button" className="la-ctl la-ctl-primary" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"} disabled={done}>
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <button type="button" className="la-ctl" onClick={() => goTo(step + 1)} aria-label="Next step" disabled={done}><ChevronRight className="size-4" /></button>
          <button type="button" className={`la-ctl ml-2 ${verbose ? "la-ctl-on" : ""}`} onClick={toggleVerbose} aria-pressed={verbose} aria-label="Show the work" title="Show the work"><Sigma className="size-4" /></button>
          <button type="button" className={`la-ctl ${showResult ? "la-ctl-on" : ""}`} onClick={toggleResult} aria-pressed={showResult} aria-label="Show the result" title="Show the result"><Eye className="size-4" /></button>
          <div className="la-seg ml-2" role="radiogroup" aria-label="Stop at">
            <button type="button" role="radio" aria-checked={target === "ref"} onClick={() => chooseTarget("ref")}>REF</button>
            <button type="button" role="radio" aria-checked={target === "rref"} onClick={() => chooseTarget("rref")}>RREF</button>
          </div>
        </div>
        <label className="flex min-w-0 flex-[1_1_12rem] items-center gap-3">
          <input type="range" min={0} max={steps.length} value={step} onChange={(e) => goTo(Number(e.target.value))} className="la-range" aria-label="Step" />
          <span className="la-mono w-12 shrink-0 text-right text-xs text-[var(--la-ink-soft)]">{step} / {steps.length}</span>
        </label>
        <div className="la-mono ml-auto flex items-center gap-1 text-xs text-[var(--la-ink-soft)]">
          <button type="button" className="la-ctl" onClick={() => resize(-1, 0)} disabled={shown.length <= 2} aria-label="Remove a row">−</button>
          <span>{shown.length} rows</span>
          <button type="button" className="la-ctl" onClick={() => resize(1, 0)} disabled={shown.length >= 4} aria-label="Add a row">+</button>
          <span className="mx-1 opacity-40">·</span>
          <button type="button" className="la-ctl" onClick={() => resize(0, -1)} disabled={vars <= 2} aria-label="Remove a variable">−</button>
          <span>{vars} vars</span>
          <button type="button" className="la-ctl" onClick={() => resize(0, 1)} disabled={vars >= 4} aria-label="Add a variable">+</button>
          <button type="button" className="la-ctl ml-2" onClick={shuffle} aria-label="Random system" title="Random system"><Shuffle className="size-4" /></button>
        </div>
      </div>
    </div>
  );
}

/** One line of the worked arithmetic. `delay` staggers the lines so they read top to bottom. */
function Line({ label, values, vars, tone, delay = 0 }: { label: React.ReactNode; values: Frac[]; vars: number; tone?: "changed" | "muted"; delay?: number }) {
  return (
    <div className="la-work-line" style={{ height: ROW_H * 0.8 }}>
      <motion.span className="la-mono la-work-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}>{label}</motion.span>
      {values.map((v, c) => (
        <span key={c} className={`la-work-cell ${c === vars ? "la-cell-aug" : ""}`}>
          <Num v={v} delay={delay + c * 0.04} tone={tone} />
        </span>
      ))}
    </div>
  );
}

/** Where the walkthrough ends up, and what it means for the system. */
function Result({ final, vars, target, solution }: { final: Matrix; vars: number; target: Target; solution: ReturnType<typeof solve> }) {
  const x = (i: number) => <>x<sub>{i + 1}</sub></>;
  return (
    <div className="la-work">
      <p className="la-mono la-work-title">→ {target === "ref" ? "row echelon form" : "reduced row echelon form"}</p>
      <div className="la-mini">
        <div className="la-bracket la-bracket-mini" aria-hidden />
        <div>
          {final.map((row, r) => (
            <div key={r} className="la-work-line" style={{ height: ROW_H * 0.7 }}>
              {row.map((v, c) => (
                <span key={c} className={`la-work-cell ${c === vars ? "la-cell-aug" : ""}`}>
                  <Num v={v} delay={r * 0.05 + c * 0.03} />
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="la-bracket la-bracket-r la-bracket-mini" aria-hidden />
      </div>
      <p className="la-work-solution">
        {solution.kind === "unique" && solution.x.map((v, i) => (
          <span key={i} className="la-work-sol">{x(i)} = <span className="la-num-display"><Fraction v={v} /></span></span>
        ))}
        {solution.kind === "none" && <>No solution: row {solution.row + 1} says 0 = something nonzero.</>}
        {solution.kind === "infinite" && <>Infinitely many solutions. Free: {solution.free.map((f, i) => <span key={f}>{i > 0 && ", "}{x(f)}</span>)}.</>}
      </p>
    </div>
  );
}

/** The arithmetic behind one step, laid out like long addition beside the matrix. */
function Work({ step, before, vars }: { step: Step; before: Matrix; vars: number }) {
  const { op, matrix: after } = step;

  if (op.kind === "swap") {
    return (
      <div className="la-work">
        <p className="la-mono text-xs text-[var(--la-ink-soft)]">Nothing to compute.</p>
        <p className="mt-2 text-sm text-[var(--la-ink-soft)]">{Rsub(op.i)} and {Rsub(op.j)} trade places. The equations are the same; only their order changed.</p>
      </div>
    );
  }
  if (op.kind === "scale") {
    const k = describeK(op.k).replace(/^\+/, "").replace(/·$/, "");
    return (
      <div className="la-work">
        <Line vars={vars} label={Rsub(op.i)} values={before[op.i]} tone="muted" />
        <div className="la-work-rule"><span className="la-mono la-work-op">× {k}</span></div>
        <Line vars={vars} label={`= ${Rsub(op.i)}`} values={after[op.i]} tone="changed" delay={0.3} />
      </div>
    );
  }
  return (
    <div className="la-work">
      <Line vars={vars} label={Rsub(op.i)} values={before[op.i]} tone="muted" />
      <Line vars={vars} label={<>{describeK(op.k)}{Rsub(op.j)}</>} values={before[op.j].map((x) => mul(x, op.k))} delay={0.15} />
      <div className="la-work-rule" />
      <Line vars={vars} label={`= ${Rsub(op.i)}`} values={after[op.i]} tone="changed" delay={0.4} />
    </div>
  );
}

/** "−2·" / "+½·" prefix for the ghost row label. */
function describeK(k: Frac): string {
  const sign = k.n < 0 ? "−" : "+";
  const a = Math.abs(k.n);
  if (a === k.d) return `${sign}`;
  return `${sign}${k.d === 1 ? a : `${a}/${k.d}`}·`;
}
