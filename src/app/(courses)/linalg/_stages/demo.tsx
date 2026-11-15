"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate } from "motion/react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { EASE } from "./plane";

/**
 * Playback for a stepped demonstration, manim-style: each step tweens a progress
 * value from 0 to 1, and the scene reads that value to draw the in-between state.
 */
export function useBeats(count: number, duration = 1.4) {
  const [step, setStep] = useState(0);
  const [t, setT] = useState(1);
  const [playing, setPlaying] = useState(false);
  const anim = useRef<{ stop: () => void } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    anim.current?.stop();
    anim.current = null;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  /** Animate into `k`, coming from the step before it. */
  const run = useCallback((k: number) => {
    stop();
    setStep(k);
    setT(0);
    anim.current = animate(0, 1, { duration, ease: EASE, onUpdate: setT, onComplete: () => setT(1) });
  }, [duration, stop]);

  const goTo = useCallback((k: number) => {
    const next = Math.max(0, Math.min(count - 1, k));
    if (next === 0) { stop(); setStep(0); setT(1); return; }
    run(next);
  }, [count, run, stop]);

  const reset = useCallback(() => { stop(); setPlaying(false); setStep(0); setT(1); }, [stop]);

  // Autoplay: once a step has settled, hold briefly, then advance — stopping at the end.
  const atEnd = step >= count - 1;
  useEffect(() => {
    if (!playing || t < 1) return;
    timer.current = setTimeout(() => {
      if (atEnd) setPlaying(false);
      else run(step + 1);
    }, 750);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [playing, step, t, atEnd, run]);

  useEffect(() => () => stop(), [stop]);

  return { step, t, playing, setPlaying, goTo, reset, run, stop };
}

/** The frame around a demonstration: the scene, a caption, and transport controls. */
export function Demo({ label, labels, step, t, playing, onPlay, onStep, onReset, caption, children, aside }: {
  label: string;
  labels: string[];
  step: number;
  t: number;
  playing: boolean;
  onPlay: () => void;
  onStep: (k: number) => void;
  onReset: () => void;
  caption: React.ReactNode;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  const onKey = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    if (e.key === " ") { e.preventDefault(); onPlay(); }
    if (e.key === "ArrowRight") { e.preventDefault(); onStep(step + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); onStep(step - 1); }
  };

  return (
    <div className="la-demo" tabIndex={0} onKeyDown={onKey} aria-label={label}>
      <ol className="la-crumbs" aria-label="Steps">
        {labels.map((l, i) => (
          <li key={l}>
            <button type="button" className="la-crumb" aria-current={i === step ? "step" : undefined} onClick={() => onStep(i)}>
              {l}
            </button>
          </li>
        ))}
      </ol>

      <div className="la-demo-body" data-aside={aside ? "" : undefined}>
        <div className="la-demo-scene">{children}</div>
        {aside && <div className="la-demo-aside">{aside}</div>}
      </div>

      <p className="la-demo-caption" aria-live="polite">{caption}</p>

      <div className="la-demo-controls">
        <button type="button" className="la-ctl" onClick={() => onStep(step - 1)} disabled={step === 0} aria-label="Previous step">
          <ChevronLeft className="size-4" />
        </button>
        <button type="button" className="la-ctl la-ctl-primary" onClick={onPlay} aria-label={playing ? "Pause" : "Play"}>
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
        <button type="button" className="la-ctl" onClick={() => onStep(step + 1)} disabled={step === labels.length - 1} aria-label="Next step">
          <ChevronRight className="size-4" />
        </button>
        <div className="la-demo-progress" aria-hidden>
          <span style={{ width: `${((step + t) / labels.length) * 100}%` }} />
        </div>
        <span className="la-mono text-xs text-[var(--la-ink-faint)]">{step + 1} / {labels.length}</span>
        <button type="button" className="la-ctl" onClick={onReset} aria-label="Reset"><RotateCcw className="size-4" /></button>
      </div>
    </div>
  );
}

/** Linear interpolation, and the eased 0→1 a step is currently at. */
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
/** Clamp a step's progress into the window [from, to] of its own timeline. */
export const phase = (t: number, from: number, to: number) => Math.max(0, Math.min(1, (t - from) / (to - from)));

/** An arrow from one point to another, both in plane units. Arrow in plane.tsx only draws from the origin. */
export function Seg({ from, to, color, label, width = 2.5, dashed, opacity = 1 }: {
  from: [number, number]; to: [number, number]; color: string; label?: string; width?: number; dashed?: boolean; opacity?: number;
}) {
  const U = 40;
  const r3 = (n: number) => Math.round(n * 1000) / 1000;
  const [x1, y1] = [r3(from[0] * U), r3(-from[1] * U)];
  const [x2, y2] = [r3(to[0] * U), r3(-to[1] * U)];
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const head = Math.min(11, len * 0.5);
  return (
    <g opacity={opacity}>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={width} strokeLinecap="round"
        strokeDasharray={dashed ? "5 5" : undefined}
      />
      {len > 2 && !dashed && (
        <polygon
          points={`${len},0 ${len - head},${-head * 0.42} ${len - head},${head * 0.42}`}
          fill={color}
          transform={`translate(${x1} ${y1}) rotate(${ang})`}
        />
      )}
      {label && len > 12 && (
        <text x={x1 + dx / 2 + (dy / len) * 14} y={y1 + dy / 2 - (dx / len) * 14 + 5} fill={color} textAnchor="middle">
          {label}
        </text>
      )}
    </g>
  );
}

/** A dot at a point in plane units. */
export const Dot = ({ at, color, r = 4, opacity = 1 }: { at: [number, number]; color: string; r?: number; opacity?: number }) => (
  <circle cx={at[0] * 40} cy={-at[1] * 40} r={r} fill={color} opacity={opacity} />
);
