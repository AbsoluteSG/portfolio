"use client";

import { useState } from "react";
import { PATTERNS, Playground, type Pattern } from "./playground";

export function Hero() {
  const [pattern, setPattern] = useState<Pattern>("spread");
  const [spin, setSpin] = useState(false);
  const [wave, setWave] = useState(false);
  const current = PATTERNS.find((p) => p.id === pattern)!;

  return (
    <div className="grid gap-4">
      <Playground pattern={pattern} spin={spin} wave={wave} />
      <div className="flex flex-wrap items-center gap-2">
        {PATTERNS.map((p) => (
          <button key={p.id} type="button" className="vx-btn" aria-pressed={pattern === p.id} onClick={() => setPattern(p.id)}>{p.label}</button>
        ))}
        <span className="vx-pixel mx-1 text-[0.5rem] text-[var(--vx-dim)]">+</span>
        <button type="button" className="vx-btn" aria-pressed={spin} onClick={() => setSpin((v) => !v)}>Spin</button>
        <button type="button" className="vx-btn" aria-pressed={wave} onClick={() => setWave((v) => !v)}>Wave</button>
      </div>
      <p className="vx-body text-[var(--vx-dim)]">
        <span className="text-[var(--vx-text)]">{current.label}:</span> {current.blurb}
        {pattern === "helix" && !wave && " With zero wave amplitude every strand draws on the same straight line — turn Wave on."}
        {pattern === "ring" && spin && " Ring + spin is the classic spiral."}
        {" "}Move the pointer to aim. Placeholder art; the projectile math is the real thing.
      </p>
    </div>
  );
}
