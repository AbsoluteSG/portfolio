"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Caption, Transport, useAutoplay, stageKeys } from "./bits";

/** One recorded moment of a run: the line about to execute (1-based) and everything the visual needs. */
export interface Frame<S> {
  line: number;
  state: S;
  /** What just happened, in one sentence. */
  note?: React.ReactNode;
  /** Named values to show in the strip under the code. */
  vars?: Record<string, string | number>;
}

/**
 * A stage driven by a trace. `code` is the program, `frames` is every line-execution in order,
 * `render` draws the state. Frame 0 is "nothing has run": code fully dim, visual at rest.
 */
export function CodeStage<S>({ code, frames, initial, render, intro, controls, onReset, speed = 900 }: {
  code: string[];
  frames: Frame<S>[];
  /** State before anything has run (frame 0). */
  initial: S;
  render: (state: S, frame: Frame<S> | null) => React.ReactNode;
  /** Caption shown before the first step. */
  intro: React.ReactNode;
  /** Extra controls (chips, sizes) placed in the transport row. */
  controls?: React.ReactNode;
  onReset?: () => void;
  speed?: number;
}) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const LAST = frames.length;
  const goTo = useCallback((k: number) => setStep(Math.max(0, Math.min(LAST, k))), [LAST]);
  useAutoplay(playing, step, LAST, goTo, setPlaying, speed);

  const frame = step > 0 ? frames[step - 1] : null;
  // Lines that have executed at least once so far: those are "revealed".
  const seen = useMemo(() => {
    const s = new Set<number>();
    for (let k = 0; k < step; k++) s.add(frames[k].line);
    return s;
  }, [frames, step]);

  return (
    <div className="al-stage al-codestage" tabIndex={0} onKeyDown={stageKeys(step, goTo, setPlaying)}>
      <div className="al-split">
        <pre className="al-code-panel" aria-label="Program">
          {code.map((text, i) => {
            const ln = i + 1;
            const current = frame?.line === ln;
            const revealed = seen.has(ln);
            return (
              <div key={ln} className={`al-line ${current ? "al-line-cur" : ""} ${revealed || current ? "" : "al-line-future"}`}>
                <span className="al-ln">{ln}</span>
                <code>{text || " "}</code>
                {current && <motion.span layoutId="al-cursor" className="al-cursor" aria-hidden />}
              </div>
            );
          })}
        </pre>
        <div className="al-visual">{render(frame ? frame.state : initial, frame)}</div>
      </div>

      <div className="al-vars">
        <AnimatePresence initial={false}>
          {frame?.vars && Object.entries(frame.vars).map(([k, v]) => (
            <motion.span key={k} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="al-var">
              <span className="al-var-k">{k}</span>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={String(v)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }} className="al-var-v">{v}</motion.span>
              </AnimatePresence>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <Caption k={step}>{frame ? frame.note ?? null : intro}</Caption>

      <Transport step={step} last={LAST} playing={playing} setPlaying={setPlaying} goTo={goTo} onReset={onReset ? () => { onReset(); setStep(0); setPlaying(false); } : undefined}>
        {controls}
      </Transport>
    </div>
  );
}
