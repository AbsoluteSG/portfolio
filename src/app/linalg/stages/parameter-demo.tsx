"use client";

import { useMemo, useState } from "react";
import { Plus, Minus, Sigma } from "lucide-react";
import { frac, fmt as fmtFrac, eq as fEq, neg, isZero } from "../lib/fraction";
import {
  type LinMatrix, type Lin, type LinStep, parseLin, fmtLin, eliminateLin, criticalValues, classifyAt, linNum,
  lScale, LZERO,
} from "../lib/param";
import { CaseChain } from "./case-split";
import { Demo, useBeats } from "./demo";

const PRESETS: { name: string; rows: string[][] }[] = [
  { name: "No solution at k", rows: [["1", "1", "5", "1"], ["1", "2", "-4", "-1"], ["6", "13", "k", "-7"]] },
  { name: "Infinitely many", rows: [["1", "-2", "3"], ["2", "k", "6"]] },
  { name: "All three cases", rows: [["1", "-3", "1"], ["2", "k", "2"]] },
  { name: "Dependent columns", rows: [["1", "2", "3", "0"], ["2", "5", "7", "0"], ["-1", "0", "k", "0"]] },
];

const toMatrix = (rows: string[][]): LinMatrix => rows.map((r) => r.map((s) => parseLin(s) ?? linNum(0)));

/** Elimination with a parameter carried through — on any matrix you type in. */
export function ParameterDemo() {
  const [m, setM] = useState<LinMatrix>(() => toMatrix(PRESETS[0].rows));
  const [k, setK] = useState(0);

  const elim = useMemo(() => eliminateLin(m), [m]);
  const criticals = useMemo(() => criticalValues(elim), [elim]);
  const frames = useMemo(
    () => [{ matrix: m, op: "the matrix as given", detail: null as LinStep["detail"] | null }, ...elim.steps],
    [m, elim],
  );
  /** One more beat after the last operation: read the row that decides the answer. */
  const total = frames.length + 1;
  const decideStep = frames.length;
  const { step, t, playing, setPlaying, goTo, reset } = useBeats(total, 0.9);
  const [showWork, setShowWork] = useState(false);

  const deciding = step >= decideStep;
  const at = Math.min(step, frames.length - 1);
  const frame = frames[at];
  const kf = frac(k);
  const verdict = useMemo(() => classifyAt(m, kf), [m, kf]);
  const onCritical = criticals.some((c) => fEq(c, kf));

  const edit = (r: number, c: number, value: Lin) =>
    setM((prev) => prev.map((row, i) => (i === r ? row.map((x, j) => (j === c ? value : x)) : row)));

  const resize = (dRows: number, dCols: number) =>
    setM((prev) => {
      const rows = Math.max(2, Math.min(4, prev.length + dRows));
      const cols = Math.max(2, Math.min(5, prev[0].length + dCols));
      return Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => prev[r]?.[c] ?? linNum(0)),
      );
    });

  const vars = m[0].length - 1;

  /**
   * The row the answer turns on: the last one of the reduced matrix. Its first nonzero coefficient
   * is what may vanish; if every coefficient is already zero, the row is 0 = (right-hand side).
   */
  const decide = useMemo(() => {
    const row = elim.ref[elim.ref.length - 1];
    const idx = row.slice(0, vars).findIndex((x) => !isZero(x.c) || !isZero(x.b));
    return {
      coef: idx >= 0 ? row[idx] : LZERO,
      rhs: row[vars],
      varName: idx >= 0 ? `x${sub(idx + 1)}` : "x",
    };
  }, [elim, vars]);
  const verdictText =
    verdict.verdict === "none" ? "no solution"
      : verdict.verdict === "unique" ? "unique solution"
        : `infinitely many · ${verdict.free} free variable${verdict.free === 1 ? "" : "s"}`;

  const caption = deciding ? (
    <>
      Everything now rests on the last row. Pick a value for <strong>k</strong> on the right and read what the row
      becomes — the coefficient either survives, or it dies and leaves the right-hand side to decide.
    </>
  ) : elim.blockedAt !== null && at === frames.length - 1 ? (
    <>
      Elimination stops here: every remaining entry in column <strong>{elim.blockedAt + 1}</strong> contains the
      parameter, and pivoting would mean dividing by something that might be zero. Split into cases by hand from this
      point.
    </>
  ) : at === 0 ? (
    <>Type over any entry — numbers, fractions, or expressions in <strong>k</strong> like <strong>2k−1</strong>. The last column is the augmented one. Then step through.</>
  ) : (
    <>
      <strong>{frame.op}</strong>. The parameter just rides along: no operation divides by it, so every entry stays of
      the form <em>number + number·k</em>.
    </>
  );

  const aside = (
    <div className="la-param">
      <label className="la-param-slider">
        <span className="la-mono text-xs text-[var(--la-ink-faint)]">k</span>
        <input
          type="range" min={-40} max={40} step={1} value={k}
          onChange={(e) => setK(Number(e.target.value))}
          className="la-range" aria-label="The parameter k"
        />
        <span className={`la-param-k ${onCritical ? "is-dead" : ""}`}>{String(k).replace("-", "−")}</span>
      </label>

      <div className={`la-param-verdict ${verdict.verdict === "none" ? "is-dead" : verdict.verdict === "infinite" ? "is-many" : ""}`} aria-live="polite">
        <span className="la-mono">at k = {String(k).replace("-", "−")}</span>
        <strong>{verdictText}</strong>
      </div>

      <div className="la-param-crit">
        <p className="la-eyebrow">Critical values</p>
        {criticals.length === 0 ? (
          <p className="la-param-hint">None — the parameter never reaches a pivot, so the answer is the same for every k.</p>
        ) : (
          <div className="la-chips">
            {criticals.map((c) => {
              const n = c.n / c.d;
              return (
                <button key={fmtFrac(c)} type="button" className="la-chipbtn" aria-pressed={fEq(c, kf)} onClick={() => setK(n)}>
                  k = {fmtFrac(c).replace("-", "−")}
                </button>
              );
            })}
          </div>
        )}
        <p className="la-param-hint">Everywhere else the pivot survives and the count doesn&apos;t change.</p>
      </div>
    </div>
  );

  return (
    <Demo
      label="Elimination carrying a parameter, on a matrix you can edit"
      labels={[...frames.map((_, i) => (i === 0 ? "as given" : `step ${i}`)), "decide"]}
      step={step}
      t={t}
      playing={playing}
      onPlay={() => setPlaying((p) => !p)}
      onStep={goTo}
      onReset={reset}
      caption={caption}
      aside={aside}
    >
      <div className="la-param-matrix">
        <div className="la-bracket" style={{ marginLeft: 0 }} aria-hidden />
        <div>
          {(deciding ? elim.ref : frame.matrix).map((row, r) => (
            <div key={r} className={`la-param-row ${deciding && r === elim.ref.length - 1 ? "is-deciding" : ""}`}>
              {row.map((x, c) => (
                <ParamCell
                  key={c}
                  x={x}
                  aug={c === row.length - 1}
                  editable={!deciding && at === 0}
                  onCommit={(v) => edit(r, c, v)}
                  label={`Row ${r + 1}, column ${c + 1}`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="la-bracket la-bracket-r" aria-hidden />
      </div>

      {deciding && (
        <div className="la-param-decide">
          <CaseChain coef={decide.coef} rhs={decide.rhs} k={kf} varName={decide.varName} />
        </div>
      )}

      {showWork && !deciding && frame.detail && (
        <Work detail={frame.detail} before={frames[at - 1].matrix} after={frame.matrix} vars={vars} />
      )}

      <div className="la-param-tools">
        <div className="la-chips" role="group" aria-label="Presets">
          {PRESETS.map((p) => (
            <button key={p.name} type="button" className="la-chipbtn" onClick={() => { setM(toMatrix(p.rows)); reset(); setK(0); }}>
              {p.name}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`la-ctl ${showWork ? "la-ctl-on" : ""}`}
          aria-pressed={showWork}
          onClick={() => setShowWork((w) => !w)}
          aria-label="Show the work"
          title="Show the work"
        >
          <Sigma className="size-4" />
        </button>
        <div className="la-param-size">
          <span className="la-mono">{m.length} eq</span>
          <button type="button" className="la-ctl" onClick={() => resize(-1, 0)} disabled={m.length <= 2} aria-label="Remove an equation"><Minus className="size-3.5" /></button>
          <button type="button" className="la-ctl" onClick={() => resize(1, 0)} disabled={m.length >= 4} aria-label="Add an equation"><Plus className="size-3.5" /></button>
          <span className="la-mono">{vars} var</span>
          <button type="button" className="la-ctl" onClick={() => resize(0, -1)} disabled={vars <= 1} aria-label="Remove a variable"><Minus className="size-3.5" /></button>
          <button type="button" className="la-ctl" onClick={() => resize(0, 1)} disabled={vars >= 4} aria-label="Add a variable"><Plus className="size-3.5" /></button>
        </div>
      </div>
    </Demo>
  );
}

function ParamCell({ x, aug, editable, onCommit, label }: {
  x: Lin; aug: boolean; editable: boolean; onCommit: (v: Lin) => void; label: string;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const commit = () => {
    const parsed = parseLin(text);
    if (parsed) onCommit(parsed);
    setEditing(false);
  };
  const shown = fmtLin(x);
  return (
    <div
      className={`la-param-cell ${aug ? "la-cell-aug" : ""} ${x.b.n !== 0 ? "is-symbolic" : ""} ${editable ? "is-editable" : ""}`}
      onClick={() => { if (editable && !editing) { setText(fmtLin(x).replace(/−/g, "-").replace(/\s/g, "")); setEditing(true); } }}
    >
      {editing ? (
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={(e) => e.target.select()}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
          aria-invalid={text !== "" && parseLin(text) === null}
          aria-label={label}
          className="la-cell-input"
        />
      ) : (
        shown
      )}
    </div>
  );
}

const SUBS = "₀₁₂₃₄₅₆₇₈₉";
function sub(n: number) { return String(n).replace(/\d/g, (d) => SUBS[Number(d)]); }
const Rname = (i: number) => `R${sub(i + 1)}`;

/** One line of the worked arithmetic, with parameter entries kept symbolic. */
function WorkLine({ label, values, vars, tone, delay = 0 }: {
  label: React.ReactNode; values: Lin[]; vars: number; tone?: "muted" | "changed"; delay?: number;
}) {
  return (
    <div className="la-work-line">
      <span className="la-mono la-work-label">{label}</span>
      {values.map((v, c) => (
        <span
          key={c}
          className={`la-work-cell ${c === vars ? "la-cell-aug" : ""} ${v.b.n !== 0 ? "is-symbolic" : ""} ${tone === "muted" ? "is-muted" : tone === "changed" ? "is-changed" : ""}`}
          style={{ animationDelay: `${delay + c * 0.03}s` }}
        >
          {fmtLin(v)}
        </span>
      ))}
    </div>
  );
}

/** The arithmetic behind one step, laid out like long addition — as in the elimination stage. */
function Work({ detail, before, after, vars }: {
  detail: NonNullable<LinStep["detail"]>; before: LinMatrix; after: LinMatrix; vars: number;
}) {
  if (detail.kind === "swap") {
    return (
      <div className="la-work la-param-work">
        <p className="la-mono text-xs text-[var(--la-ink-soft)]">Nothing to compute.</p>
        <p className="mt-2 text-sm text-[var(--la-ink-soft)]">
          {Rname(detail.i)} and {Rname(detail.j)} trade places so the pivot is a number, not the parameter.
        </p>
      </div>
    );
  }
  const f = detail.f;
  const scaled = before[detail.j].map((x) => lScale(x, neg(f)));
  const sign = f.n < 0 ? "+" : "−";
  const mag = Math.abs(f.n) === f.d ? "" : `${Math.abs(f.n)}${f.d === 1 ? "" : `/${f.d}`}·`;
  return (
    <div className="la-work la-param-work">
      <WorkLine vars={vars} label={Rname(detail.i)} values={before[detail.i]} tone="muted" />
      <WorkLine vars={vars} label={<>{sign}{mag}{Rname(detail.j)}</>} values={scaled} delay={0.15} />
      <div className="la-work-rule" />
      <WorkLine vars={vars} label={`= ${Rname(detail.i)}`} values={after[detail.i]} tone="changed" delay={0.35} />
      <p className="la-param-work-note">
        Each column is added straight down. The parameter entry adds like any other — nothing is divided by it.
      </p>
    </div>
  );
}
