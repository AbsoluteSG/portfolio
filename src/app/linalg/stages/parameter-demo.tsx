"use client";

import { useMemo, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { frac, fmt as fmtFrac, eq as fEq } from "../lib/fraction";
import {
  type LinMatrix, type Lin, parseLin, fmtLin, eliminateLin, criticalValues, classifyAt, linNum,
} from "../lib/param";
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
  const frames = useMemo(() => [{ matrix: m, op: "the matrix as given" }, ...elim.steps], [m, elim]);
  const { step, t, playing, setPlaying, goTo, reset } = useBeats(frames.length, 0.9);

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
  const verdictText =
    verdict.verdict === "none" ? "no solution"
      : verdict.verdict === "unique" ? "unique solution"
        : `infinitely many · ${verdict.free} free variable${verdict.free === 1 ? "" : "s"}`;

  const caption = elim.blockedAt !== null && at === frames.length - 1 ? (
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
      labels={frames.map((_, i) => (i === 0 ? "as given" : `step ${i}`))}
      step={at}
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
          {frame.matrix.map((row, r) => (
            <div key={r} className="la-param-row">
              {row.map((x, c) => (
                <ParamCell
                  key={c}
                  x={x}
                  aug={c === row.length - 1}
                  editable={at === 0}
                  onCommit={(v) => edit(r, c, v)}
                  label={`Row ${r + 1}, column ${c + 1}`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="la-bracket la-bracket-r" aria-hidden />
      </div>

      <div className="la-param-tools">
        <div className="la-chips" role="group" aria-label="Presets">
          {PRESETS.map((p) => (
            <button key={p.name} type="button" className="la-chipbtn" onClick={() => { setM(toMatrix(p.rows)); reset(); setK(0); }}>
              {p.name}
            </button>
          ))}
        </div>
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
