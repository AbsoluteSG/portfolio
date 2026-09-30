"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { type Frac, frac, fmt as fmtFrac, div, isZero, eq as fEq, neg } from "../lib/fraction";
import { type Lin, parseLin, fmtLin, lAt } from "../lib/param";

/** The reading of a single row `coef · x = rhs` once k is fixed. */
type Reading = "unique" | "none" | "free";

const PRESETS: { coef: string; rhs: string; note: string }[] = [
  { coef: "k+4", rhs: "4", note: "a nonzero right side" },
  { coef: "k+4", rhs: "0", note: "a zero right side" },
  { coef: "k+33", rhs: "1", note: "the screenshot problem" },
  { coef: "2k-6", rhs: "k-3", note: "k on both sides" },
];

/**
 * The last row of an elimination, read one k at a time: substitute, see what the row becomes,
 * and say what that means. This is the step people skip.
 */
export function CaseSplit() {
  const [coef, setCoef] = useState<Lin>(() => parseLin("k+4")!);
  const [rhs, setRhs] = useState<Lin>(() => parseLin("4")!);
  const [k, setK] = useState<Frac>(frac(0));

  // The k that kills the coefficient, when there is one.
  const critical = isZero(coef.b) ? null : neg(div(coef.c, coef.b));

  const a = lAt(coef, k);  // the coefficient's value
  const b = lAt(rhs, k);   // the right side's value
  const dead = isZero(a);
  const reading: Reading = !dead ? "unique" : isZero(b) ? "free" : "none";

  const x = !dead ? div(b, a) : null;
  const num = (f: Frac) => fmtFrac(f).replace("-", "−");

  const meaning =
    reading === "unique"
      ? <>A real number times <em>x</em> equals a real number, so divide. <strong>x = {num(x!)}</strong> — one value, pinned down.</>
      : reading === "none"
        ? <>But <strong>0·x is zero for every x</strong>. Zero cannot equal {num(b)}, so no <em>x</em> exists. The row is a lie.</>
        : <>This is true for <strong>every</strong> x — a row that survived but says nothing. <em>x</em> is <strong>free</strong>.</>;

  const verdict =
    reading === "unique" ? "unique solution" : reading === "none" ? "no solution" : "infinitely many solutions";

  const kChips = critical
    ? [frac(0), critical, frac(critical.n / critical.d + 1)]
    : [frac(-2), frac(0), frac(2)];

  return (
    <section className="la-case" aria-label="Reading a row for a chosen value of k">
      <div className="la-case-row">
        <Field value={coef} onCommit={setCoef} label="the coefficient" />
        <span className="la-case-x">· x =</span>
        <Field value={rhs} onCommit={setRhs} label="the right-hand side" />
      </div>

      <div className="la-chips la-case-presets" role="group" aria-label="Example rows">
        {PRESETS.map((p) => (
          <button
            key={`${p.coef}=${p.rhs}`}
            type="button"
            className="la-chipbtn"
            aria-pressed={fmtLin(coef) === fmtLin(parseLin(p.coef)!) && fmtLin(rhs) === fmtLin(parseLin(p.rhs)!)}
            onClick={() => { setCoef(parseLin(p.coef)!); setRhs(parseLin(p.rhs)!); setK(frac(0)); }}
            title={p.note}
          >
            ({p.coef.replace("-", "−")})x = {p.rhs.replace("-", "−")}
          </button>
        ))}
      </div>

      <div className="la-case-pick">
        <span className="la-eyebrow">if k =</span>
        <div className="la-chips">
          {kChips.map((c) => (
            <button
              key={fmtFrac(c)}
              type="button"
              className={`la-chipbtn ${critical && fEq(c, critical) ? "is-critical" : ""}`}
              aria-pressed={fEq(c, k)}
              onClick={() => setK(c)}
            >
              {num(c)}
              {critical && fEq(c, critical) && <span className="la-case-star"> ★</span>}
            </button>
          ))}
        </div>
        <input
          type="number"
          className="la-case-input"
          value={k.d === 1 ? k.n : k.n / k.d}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (Number.isFinite(v)) setK(frac(Math.round(v * 12), 12));
          }}
          aria-label="A value for k"
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.ol
          key={`${fmtLin(coef)}|${fmtLin(rhs)}|${fmtFrac(k)}`}
          className="la-case-chain"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <li>
            <span className="la-case-step">substitute</span>
            <span className="la-case-math">
              ({fmtLin(coef)}) → <strong className={dead ? "is-dead" : ""}>{num(a)}</strong>
              {!isZero(rhs.b) && <>, ({fmtLin(rhs)}) → <strong>{num(b)}</strong></>}
            </span>
          </li>
          <li>
            <span className="la-case-step">the row reads</span>
            <span className={`la-case-math la-case-big ${dead ? "is-dead" : ""}`}>
              {num(a)}x = {num(b)}
              {dead && <span className="la-case-collapse"> → {num(frac(0))} = {num(b)}</span>}
            </span>
          </li>
          <li>
            <span className="la-case-step">meaning</span>
            <span className="la-case-math">{meaning}</span>
          </li>
        </motion.ol>
      </AnimatePresence>

      <div className={`la-case-verdict is-${reading}`} aria-live="polite">{verdict}</div>

      <p className="la-case-hint">
        {critical ? (
          <>
            Only <strong>k = {num(critical)}</strong> ★ makes the coefficient vanish — every other value behaves the
            same as each other. Edit either box above to try your own row.
          </>
        ) : (
          <>This coefficient has no k in it, so nothing changes with k. Put a k in the left box to see the split.</>
        )}
      </p>
    </section>
  );
}

function Field({ value, onCommit, label }: { value: Lin; onCommit: (v: Lin) => void; label: string }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const commit = () => {
    const parsed = parseLin(text);
    if (parsed) onCommit(parsed);
    setEditing(false);
  };
  return (
    <span
      className={`la-case-field ${value.b.n !== 0 ? "is-symbolic" : ""}`}
      onClick={() => { if (!editing) { setText(fmtLin(value).replace(/−/g, "-").replace(/\s/g, "")); setEditing(true); } }}
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
          style={{ width: "5rem" }}
        />
      ) : (
        <>({fmtLin(value)})</>
      )}
    </span>
  );
}

