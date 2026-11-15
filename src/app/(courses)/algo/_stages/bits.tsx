"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Shuffle } from "lucide-react";

export type Tone = "changed" | "muted" | "accent" | "good" | undefined;

const toneClass: Record<NonNullable<Tone>, string> = {
  changed: "text-[var(--la-blue)]",
  muted: "text-[var(--la-ink-faint)]",
  accent: "text-[var(--la-amber)]",
  good: "text-[var(--la-green)]",
};

/** A value that fades out and its replacement fades in. `k` decides when it counts as "replaced". */
export function Val({ k, children, delay = 0, tone, size = "md" }: { k: string | number; children: React.ReactNode; delay?: number; tone?: Tone; size?: "md" | "sm" }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={String(k)}
        initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
        transition={{ duration: 0.32, delay, ease: [0.2, 0.7, 0.2, 1] }}
        className={`la-num-display ${size === "sm" ? "al-val-sm" : ""} ${tone ? toneClass[tone] : ""}`}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
}

/** One row of boxed cells with an index rail underneath. */
export function Cells({
  label, values, tone, marks, onEdit, indexFrom = 0, size = "md", cellRef,
}: {
  label?: React.ReactNode;
  values: (number | string | null)[];
  tone?: (i: number) => Tone;
  /** Extra class per cell, e.g. "al-cell-hi" for a highlighted range. */
  marks?: (i: number) => string;
  onEdit?: (i: number, v: number) => void;
  indexFrom?: number;
  size?: "md" | "sm";
  cellRef?: (i: number, el: HTMLDivElement | null) => void;
}) {
  return (
    <div className={`al-cells ${size === "sm" ? "al-cells-sm" : ""}`}>
      {label && <div className="al-cells-label">{label}</div>}
      <div className="al-cells-row">
        {values.map((v, i) => (
          <div key={i} className="al-cells-col" ref={(el) => cellRef?.(i, el)}>
            <Cell v={v} i={i} tone={tone?.(i)} mark={marks?.(i) ?? ""} onEdit={onEdit} size={size} />
            <span className="al-idx">{i + indexFrom}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cell({ v, i, tone, mark, onEdit, size }: { v: number | string | null; i: number; tone: Tone; mark: string; onEdit?: (i: number, v: number) => void; size: "md" | "sm" }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const commit = () => {
    const n = Number(text.trim());
    if (text.trim() !== "" && Number.isFinite(n) && n !== v) onEdit?.(i, Math.round(n));
    setEditing(false);
  };
  return (
    <div className={`al-cell ${mark} ${onEdit ? "" : "al-cell-static"}`} onClick={() => { if (onEdit && !editing) { setText(String(v ?? "")); setEditing(true); } }}>
      {editing ? (
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={(e) => e.target.select()}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
          aria-label={`Index ${i}`}
          className="la-cell-input al-cell-input"
        />
      ) : (
        <Val k={v === null ? "·" : v} tone={v === null ? "muted" : tone} size={size}>{v === null ? "·" : v}</Val>
      )}
    </div>
  );
}

/** Caption under a stage; crossfades when the text changes. */
export function Caption({ k, children }: { k: string | number; children: React.ReactNode }) {
  return (
    <div className="al-caption">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={String(k)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Step transport shared by every stage: prev / play / next, a scrubber, reset, optional shuffle. */
export function Transport({ step, last, playing, setPlaying, goTo, onReset, onShuffle, children }: {
  step: number; last: number; playing: boolean; setPlaying: (f: (p: boolean) => boolean) => void; goTo: (k: number) => void; onReset?: () => void; onShuffle?: () => void; children?: React.ReactNode;
}) {
  return (
    <div className="la-elim-controls">
      <button type="button" className="la-ctl" onClick={() => goTo(step - 1)} disabled={step <= 0} aria-label="Previous step"><ChevronLeft className="size-4" /></button>
      <button type="button" className="la-ctl la-ctl-primary" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"}>{playing ? <Pause className="size-4" /> : <Play className="size-4" />}</button>
      <button type="button" className="la-ctl" onClick={() => goTo(step + 1)} disabled={step >= last} aria-label="Next step"><ChevronRight className="size-4" /></button>
      <input type="range" className="la-range" min={0} max={last} value={step} onChange={(e) => goTo(Number(e.target.value))} aria-label="Step" />
      <span className="la-mono text-xs text-[var(--la-ink-faint)]">{step} / {last}</span>
      {children}
      {onShuffle && <button type="button" className="la-ctl" onClick={onShuffle} aria-label="Random input" title="Random input"><Shuffle className="size-4" /></button>}
      {onReset && <button type="button" className="la-ctl" onClick={onReset} aria-label="Reset" title="Reset"><RotateCcw className="size-4" /></button>}
    </div>
  );
}

/** Auto-advance while playing; stops at `last`. */
export function useAutoplay(playing: boolean, step: number, last: number, goTo: (k: number) => void, setPlaying: (p: boolean) => void, ms = 1400) {
  useEffect(() => {
    if (!playing) return;
    if (step >= last) { setPlaying(false); return; }
    const t = setTimeout(() => goTo(step + 1), ms);
    return () => clearTimeout(t);
  }, [playing, step, last, goTo, setPlaying, ms]);
}

/** Arrow-key stepping for a focused stage. */
export function stageKeys(step: number, goTo: (k: number) => void, setPlaying: (f: (p: boolean) => boolean) => void) {
  return (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(step + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(step - 1); }
    if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
  };
}

/** Inline code token in captions. */
export const Code = ({ children }: { children: React.ReactNode }) => <code className="al-code">{children}</code>;
