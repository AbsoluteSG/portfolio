"use client";

import { useState } from "react";
import { Demo, useBeats } from "./demo";

/** The augmented matrix at each stage. The parameter entry stays symbolic; everything else is a number. */
const STAGES: { rows: (string | number)[][]; note: string; changed: number[] }[] = [
  {
    rows: [[1, 1, 5, 1], [1, 2, -4, -1], [6, 13, "k", -7]],
    note: "The matrix as given. Only one entry involves k, and elimination will carry it along.",
    changed: [],
  },
  {
    rows: [[1, 1, 5, 1], [0, 1, -9, -2], [0, 7, "k−30", -13]],
    note: "R₂ → R₂ − R₁ and R₃ → R₃ − 6R₁. The k entry becomes k − 30; treat it as an ordinary number you cannot evaluate yet.",
    changed: [1, 2],
  },
  {
    rows: [[1, 1, 5, 1], [0, 1, -9, -2], [0, 0, "k+33", 1]],
    note: "R₃ → R₃ − 7R₂ clears column 2. The last row now reads (k + 33)·x₃ = 1.",
    changed: [2],
  },
  {
    rows: [[1, 1, 5, 1], [0, 1, -9, -2], [0, 0, "k+33", 1]],
    note: "Everything hinges on whether that coefficient is zero.",
    changed: [2],
  },
];

const LABELS = ["as given", "clear column 1", "clear column 2", "decide"];
const CRITICAL = -33;

/** Elimination with a parameter carried through, and a slider for the value that breaks it. */
export function ParameterDemo() {
  const { step, t, playing, setPlaying, goTo, reset } = useBeats(LABELS.length, 1.1);
  const [k, setK] = useState(0);

  const dead = k === CRITICAL;
  const stage = STAGES[step];

  /** The coefficient the whole problem turns on. The verdict always reports this one, whatever step is showing. */
  const pivot = k + 33;

  const captions = [
    <>A parameter problem. You cannot reduce differently because of <strong>k</strong> — you reduce exactly as always and watch where k ends up.</>,
    <>Clearing the first column is unaffected: no operation divides by the unknown entry, so <strong>k</strong> just rides along.</>,
    <>Now the whole question sits in one row: <strong>(k + 33)·x₃ = 1</strong>. A single equation in one unknown, with a coefficient you control.</>,
    dead ? (
      <>At <strong>k = −33</strong> that coefficient is zero and the row reads <strong>0 = 1</strong>. Impossible — the system has <strong>no solution</strong>.</>
    ) : (
      <>With k + 33 = <strong>{pivot}</strong> ≠ 0 you can divide: x₃ = 1/{pivot}, and back-substitution gives one answer. <strong>Unique solution</strong>. Drag k to −33 to break it.</>
    ),
  ];

  const aside = (
    <div className="la-param">
      <label className="la-param-slider">
        <span className="la-mono text-xs text-[var(--la-ink-faint)]">k</span>
        <input
          type="range" min={-40} max={10} step={1} value={k}
          onChange={(e) => setK(Number(e.target.value))}
          className="la-range" aria-label="The parameter k"
        />
        <span className={`la-param-k ${dead ? "is-dead" : ""}`}>{k}</span>
      </label>
      <div className={`la-param-verdict ${dead ? "is-dead" : ""}`} aria-live="polite">
        <span className="la-mono">k + 33 = {pivot >= 0 ? pivot : `−${Math.abs(pivot)}`}</span>
        <strong>{dead ? "0 = 1 · no solution" : "pivot survives · unique"}</strong>
      </div>
      <p className="la-param-hint">
        The row never gives <em>infinitely many</em> here: that needs <strong>0 = 0</strong>, and this row&apos;s
        right-hand side is stuck at 1.
      </p>
    </div>
  );

  return (
    <Demo
      label="Elimination carrying a parameter, and the value that removes the pivot"
      labels={LABELS}
      step={step}
      t={t}
      playing={playing}
      onPlay={() => setPlaying((p) => !p)}
      onStep={goTo}
      onReset={reset}
      caption={captions[step]}
      aside={aside}
    >
      <div className="la-param-matrix" style={{ opacity: 0.35 + 0.65 * t }}>
        <div className="la-bracket" style={{ marginLeft: 0 }} aria-hidden />
        <div>
          {stage.rows.map((row, r) => (
            <div key={r} className={`la-param-row ${stage.changed.includes(r) ? "is-changed" : ""} ${step === 3 && r === 2 && dead ? "is-dead" : ""}`}>
              {row.map((cell, c) => (
                <span
                  key={c}
                  className={`la-param-cell ${c === 3 ? "la-cell-aug" : ""} ${typeof cell === "string" ? "is-symbolic" : ""}`}
                >
                  {step === 3 && dead && r === 2 && c === 2 ? "0" : typeof cell === "number" && cell < 0 ? `−${Math.abs(cell)}` : cell}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="la-bracket la-bracket-r" aria-hidden />
      </div>
      <p className="la-param-note">{stage.note}</p>
    </Demo>
  );
}
