"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { type Frac, key, fmt, parseFrac } from "../lib/fraction";
import type { Matrix } from "../lib/elimination";

/** A number that fades out and its replacement fades in, manim-style. */
export function Num({ v, delay = 0, tone }: { v: Frac; delay?: number; tone?: "changed" | "muted" | "accent" }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={key(v)}
        initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
        transition={{ duration: 0.32, delay, ease: [0.2, 0.7, 0.2, 1] }}
        className={`la-num-display ${tone === "changed" ? "text-[var(--la-blue)]" : tone === "muted" ? "text-[var(--la-ink-faint)]" : tone === "accent" ? "text-[var(--la-amber)]" : ""}`}
      >
        <Fraction v={v} />
      </motion.span>
    </AnimatePresence>
  );
}

export function Fraction({ v }: { v: Frac }) {
  const minus = v.n < 0 ? "−" : "";
  if (v.d === 1) return <>{minus}{Math.abs(v.n)}</>;
  return (
    <span className="la-frac">
      {minus}
      <span className="la-frac-stack"><span>{Math.abs(v.n)}</span><span>{v.d}</span></span>
    </span>
  );
}

export type Tone = "changed" | "muted" | "accent" | undefined;

/** A bracketed matrix. `tone(r, c)` colours cells; `onEdit` makes them editable. */
export function MatrixView({ m, label, tone, delay = 0, onEdit, size = "md" }: {
  m: Matrix; label?: React.ReactNode; tone?: (r: number, c: number) => Tone; delay?: number; onEdit?: (r: number, c: number, v: Frac) => void; size?: "md" | "sm";
}) {
  return (
    <div className="la-mv">
      {label && <div className="la-mv-label">{label}</div>}
      <div className={`la-mv-body ${size === "sm" ? "la-mv-sm" : ""}`}>
        <div className="la-bracket" style={{ marginLeft: 0 }} aria-hidden />
        <div>
          {m.map((row, r) => (
            <div key={r} className="la-mv-row">
              {row.map((v, c) => (
                <MatrixCell key={c} v={v} r={r} c={c} tone={tone?.(r, c)} delay={delay + r * 0.04 + c * 0.04} onEdit={onEdit} />
              ))}
            </div>
          ))}
        </div>
        <div className="la-bracket la-bracket-r" aria-hidden />
      </div>
    </div>
  );
}

function MatrixCell({ v, r, c, tone, delay, onEdit }: { v: Frac; r: number; c: number; tone: Tone; delay: number; onEdit?: (r: number, c: number, v: Frac) => void }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const commit = () => {
    const parsed = parseFrac(text);
    if (parsed && key(parsed) !== key(v)) onEdit?.(r, c, parsed);
    setEditing(false);
  };
  return (
    <div className={`la-cell la-mv-cell ${onEdit ? "" : "la-mv-static"}`} onClick={() => { if (onEdit && !editing) { setText(fmt(v)); setEditing(true); } }}>
      {editing ? (
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={(e) => e.target.select()}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
          aria-invalid={text !== "" && parseFrac(text) === null}
          aria-label={`Row ${r + 1}, column ${c + 1}`}
          className="la-cell-input"
        />
      ) : (
        <Num v={v} delay={delay} tone={tone} />
      )}
    </div>
  );
}

export const Slot = ({ children, k }: { children: React.ReactNode; k: string }) => (
  <motion.div
    key={k}
    className="la-lu-slot"
    initial={{ width: 0, opacity: 0 }}
    animate={{ width: "auto", opacity: 1 }}
    exit={{ width: 0, opacity: 0 }}
    transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
  >
    {children}
  </motion.div>
);

export const Sym = ({ children }: { children: React.ReactNode }) => <span className="la-lu-sym">{children}</span>;

