"use client";

import { useMemo, useState } from "react";
import { Plus, Minus, Check, Copy } from "lucide-react";
import { type Frac, frac, fmt as fmtFrac, isZero, parseFrac } from "../lib/fraction";
import { type Matrix, eliminate, describe } from "../lib/elimination";
import { parametricForm, fmtTuple, vectorForm, sIndex } from "../lib/solution";
import { Num } from "./bits";

const PRESETS: { name: string; rows: number[][] }[] = [
  { name: "Unique", rows: [[1, 3, -4, -12], [0, -1, 4, 12], [0, 0, -3, -12]] },
  { name: "One free variable", rows: [[1, 0, 5, 2], [-2, 1, -6, -1], [0, 2, 8, 6]] },
  { name: "Two free variables", rows: [[1, 3, 0, 4, 0, 2], [2, 6, 1, 6, 0, 9], [-1, -3, 1, -6, 1, 6]] },
  { name: "No solution", rows: [[1, 2, 3, 4], [2, 5, 7, 10], [1, 3, 4, 7]] },
];

const toMatrix = (rows: number[][]): Matrix => rows.map((r) => r.map((n) => frac(n)));
const sub = (n: number) => String(n).replace(/\d/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[Number(d)]);

/** Type in a system; get the solution set in the form an answer box wants. */
export function SystemSolver() {
  const [m, setM] = useState<Matrix>(() => toMatrix(PRESETS[0].rows));
  const [showWork, setShowWork] = useState(false);
  const [copied, setCopied] = useState(false);

  const vars = m[0].length - 1;
  const { rref, steps, result } = useMemo(() => {
    const st = eliminate(m, "rref", 1);
    const r = st.length ? st[st.length - 1].matrix : m;
    return { rref: r, steps: st, result: parametricForm(r, vars) };
  }, [m, vars]);

  const edit = (r: number, c: number, v: Frac) =>
    setM((prev) => prev.map((row, i) => (i === r ? row.map((x, j) => (j === c ? v : x)) : row)));

  const resize = (dRows: number, dCols: number) =>
    setM((prev) => {
      const rows = Math.max(1, Math.min(5, prev.length + dRows));
      const cols = Math.max(2, Math.min(6, prev[0].length + dCols));
      return Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => prev[r]?.[c] ?? frac(0)),
      );
    });

  const answer = result.kind === "ok" ? fmtTuple(result) : "no solution";
  const copy = () => {
    navigator.clipboard?.writeText(answer.replace(/[₁₂₃₄₅₆₇₈₉]/g, (d) => String("₀₁₂₃₄₅₆₇₈₉".indexOf(d))).replace(/−/g, "-"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const vf = result.kind === "ok" && result.free.length ? vectorForm(result) : null;

  return (
    <section className="la-solver" aria-label="Solve a system and read off its solution set">
      <div className="la-solver-grid">
        <div>
          <p className="la-eyebrow">Augmented matrix · click to edit</p>
          <div className="la-solver-matrix">
            <div className="la-bracket" style={{ marginLeft: 0 }} aria-hidden />
            <div>
              {m.map((row, r) => (
                <div key={r} className="la-param-row">
                  {row.map((x, c) => (
                    <EditCell key={c} v={x} aug={c === vars} onCommit={(v) => edit(r, c, v)} label={`Row ${r + 1}, column ${c + 1}`} />
                  ))}
                </div>
              ))}
            </div>
            <div className="la-bracket la-bracket-r" aria-hidden />
          </div>

          <div className="la-param-tools">
            <div className="la-param-size">
              <span className="la-mono">{m.length} eq</span>
              <button type="button" className="la-ctl" onClick={() => resize(-1, 0)} disabled={m.length <= 1} aria-label="Remove an equation"><Minus className="size-3.5" /></button>
              <button type="button" className="la-ctl" onClick={() => resize(1, 0)} disabled={m.length >= 5} aria-label="Add an equation"><Plus className="size-3.5" /></button>
              <span className="la-mono">{vars} var</span>
              <button type="button" className="la-ctl" onClick={() => resize(0, -1)} disabled={vars <= 1} aria-label="Remove a variable"><Minus className="size-3.5" /></button>
              <button type="button" className="la-ctl" onClick={() => resize(0, 1)} disabled={vars >= 5} aria-label="Add a variable"><Plus className="size-3.5" /></button>
            </div>
          </div>

          <div className="la-chips" role="group" aria-label="Examples">
            {PRESETS.map((p) => (
              <button key={p.name} type="button" className="la-chipbtn" onClick={() => setM(toMatrix(p.rows))}>{p.name}</button>
            ))}
          </div>
        </div>

        <div className="la-solver-out">
          <p className="la-eyebrow">Reduced row echelon form</p>
          <div className="la-solver-matrix la-solver-rref">
            <div className="la-bracket" style={{ marginLeft: 0 }} aria-hidden />
            <div>
              {rref.map((row, r) => (
                <div key={r} className="la-param-row">
                  {row.map((x, c) => (
                    <span key={c} className={`la-param-cell ${c === vars ? "la-cell-aug" : ""}`}>
                      <Num v={x} tone={c === vars ? "accent" : undefined} />
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <div className="la-bracket la-bracket-r" aria-hidden />
          </div>

          {result.kind === "ok" && (
            <p className="la-solver-pivots">
              {result.free.length === 0
                ? "A pivot in every column — no free variables, so the solution is unique."
                : `Free ${result.free.length === 1 ? "variable" : "variables"}: ${result.free.map((c) => `x${sub(c + 1)}`).join(", ")} — one parameter each.`}
            </p>
          )}
        </div>
      </div>

      <div className={`la-solver-answer ${result.kind === "none" ? "is-none" : result.free.length ? "is-free" : "is-unique"}`}>
        <span className="la-eyebrow">Solution set</span>
        {result.kind === "none" ? (
          <p className="la-solver-tuple">
            No solution — row {result.row + 1} of the reduced matrix reads 0 = nonzero.
          </p>
        ) : (
          <>
            <p className="la-solver-tuple">
              ({m[0].slice(0, vars).map((_, i) => `x${sub(i + 1)}`).join(", ")}) = {fmtTuple(result)}
            </p>
            <button type="button" className="la-chipbtn la-solver-copy" onClick={copy} aria-label="Copy the answer">
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} {copied ? "copied" : "copy"}
            </button>
          </>
        )}
      </div>

      {vf && result.kind === "ok" && (
        <div className="la-solver-vector">
          <p className="la-eyebrow">Parametric vector form</p>
          <div className="la-solver-vecrow">
            <Column entries={vf.particular} />
            {vf.directions.map((d, i) => (
              <span key={i} className="la-solver-plus">
                + {sIndex(i)} <Column entries={d} />
              </span>
            ))}
          </div>
          <p className="la-solver-note">
            The first column is a particular solution; the rest span the solutions of the homogeneous system.
          </p>
        </div>
      )}

      <div className="la-solver-work">
        <button type="button" className="la-chipbtn" aria-pressed={showWork} onClick={() => setShowWork((s) => !s)}>
          {showWork ? "hide" : "show"} the {steps.length} row operation{steps.length === 1 ? "" : "s"}
        </button>
        {showWork && (
          <ol className="la-solver-steps">
            {steps.map((s, i) => <li key={i} className="la-op">{describe(s.op)}</li>)}
          </ol>
        )}
      </div>
    </section>
  );
}

function Column({ entries }: { entries: Frac[] }) {
  return (
    <span className="la-mx">
      <span className="la-mx-bracket" aria-hidden />
      <span className="la-mx-grid" style={{ gridTemplateColumns: "auto" }}>
        {entries.map((e, i) => (
          <span key={i} className="la-mx-cell">{fmtFrac(e).replace("-", "−")}</span>
        ))}
      </span>
      <span className="la-mx-bracket la-mx-bracket-r" aria-hidden />
    </span>
  );
}

function EditCell({ v, aug, onCommit, label }: { v: Frac; aug: boolean; onCommit: (v: Frac) => void; label: string }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const commit = () => {
    const parsed = parseFrac(text);
    if (parsed) onCommit(parsed);
    setEditing(false);
  };
  return (
    <span
      className={`la-param-cell is-editable ${aug ? "la-cell-aug" : ""} ${isZero(v) ? "is-faint" : ""}`}
      onClick={() => { if (!editing) { setText(fmtFrac(v)); setEditing(true); } }}
    >
      {editing ? (
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={(e) => e.target.select()}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
          aria-invalid={text !== "" && parseFrac(text) === null}
          aria-label={label}
          className="la-cell-input"
          style={{ width: "3rem" }}
        />
      ) : (
        fmtFrac(v).replace("-", "−")
      )}
    </span>
  );
}
