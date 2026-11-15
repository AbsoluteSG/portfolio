"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animate } from "motion/react";
import { Play, RotateCcw } from "lucide-react";
import { type Mat, type Vec, I, W, H, EASE, apply, lerp, fmt, px, Cell, Arrow, gridPaths, BG_PATH, toUnits } from "./plane";

const PRESETS: { name: string; m: Mat }[] = [
  { name: "Identity", m: [1, 0, 0, 1] },
  { name: "Rotate 90°", m: [0, 1, -1, 0] },
  { name: "Rotate 45°", m: [0.71, 0.71, -0.71, 0.71] },
  { name: "Shear", m: [1, 0, 1, 1] },
  { name: "Scale", m: [2, 0, 0, 0.5] },
  { name: "Reflect", m: [0, 1, 1, 0] },
  { name: "Squish to a line", m: [2, 1, 1, 0.5] },
];


export function TransformationStage() {
  const [target, setTarget] = useState<Mat>([1, 0, 1, 1]); // what the matrix panel shows
  const [disp, setDisp] = useState<Mat>([1, 0, 1, 1]);     // what the plane shows (tweens toward target)
  const [t, setT] = useState(1);                            // apply-from-identity progress
  const [v, setV] = useState<Vec>([2, 1]);
  const [showV, setShowV] = useState(true);
  const [epoch, setEpoch] = useState(0);                    // bumps on discrete matrix changes → numbers fade
  const svgRef = useRef<SVGSVGElement>(null);
  const anim = useRef<{ stop: () => void } | null>(null);

  const stopAnim = () => { anim.current?.stop(); anim.current = null; };

  /** Tween the plane from wherever it is to `m`. */
  const tweenTo = useCallback((m: Mat, duration = 1.1) => {
    stopAnim();
    const from = disp;
    anim.current = animate(0, 1, {
      duration,
      ease: EASE,
      onUpdate: (k) => setDisp(lerp(from, m, k)),
      onComplete: () => { setDisp(m); setT(1); },
    });
  }, [disp]);

  const setMatrix = (m: Mat, discrete = true) => {
    setTarget(m);
    if (discrete) { setEpoch((e) => e + 1); tweenTo(m); }
    else { stopAnim(); setDisp(m); setT(1); }
  };

  /** Replay: snap to identity, then tween to the target, like manim's ApplyMatrix. */
  const replay = () => {
    stopAnim();
    setDisp(I);
    setT(0);
    anim.current = animate(0, 1, {
      duration: 1.8,
      delay: 0.25,
      ease: EASE,
      onUpdate: (k) => { setDisp(lerp(I, target, k)); setT(k); },
    });
  };
  const scrub = (k: number) => { stopAnim(); setT(k); setDisp(lerp(I, target, k)); };

  useEffect(() => () => stopAnim(), []);

  // ── Dragging basis tips and v ──
  const drag = (what: "i" | "j" | "v") => (e: React.PointerEvent<SVGElement>) => {
    e.preventDefault();
    stopAnim();
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      const [x, y] = toUnits(svgRef.current!, ev);
      const snap = (n: number) => Math.round(n * 4) / 4;
      if (what === "v") setV([snap(x), snap(y)]);
      else {
        const m: Mat = what === "i" ? [snap(x), snap(y), target[2], target[3]] : [target[0], target[1], snap(x), snap(y)];
        setMatrix(m, false);
      }
    };
    const up = () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  };

  const grid = useMemo(() => gridPaths(disp), [disp]);

  const iHat: Vec = [disp[0], disp[1]];
  const jHat: Vec = [disp[2], disp[3]];
  const Av = apply(disp, v);
  const activePreset = PRESETS.find((p) => p.m.every((x, i) => Math.abs(x - target[i]) < 1e-9))?.name;

  const onKey = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    if (e.key === " ") { e.preventDefault(); replay(); }
  };

  return (
    <div className="la-lt" tabIndex={0} onKeyDown={onKey} aria-label="A 2 by 2 matrix and the plane it transforms">
      <svg ref={svgRef} className="la-plane" viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`} role="img" aria-label="The plane, before and after the transformation">
        <path className="bg" d={BG_PATH} />
        <path className="bg-axis" d={`M${-W} 0L${W} 0M0 ${-H}L0 ${H}`} />
        <path className="fg" d={grid.minor} />
        <path className="fg-axis" d={grid.axes} />

        {showV && (
          <g>
            <Arrow to={v} color="var(--la-ink-faint)" width={1.5} />
            <Arrow to={Av} color="var(--la-v)" label="v" />
          </g>
        )}
        <Arrow to={iHat} color="var(--la-i)" label="î" />
        <Arrow to={jHat} color="var(--la-j)" label="ĵ" />

        {/* drag handles */}
        <circle className="handle" cx={px(iHat)[0]} cy={px(iHat)[1]} r={14} onPointerDown={drag("i")} />
        <circle className="handle" cx={px(jHat)[0]} cy={px(jHat)[1]} r={14} onPointerDown={drag("j")} />
        {showV && <circle className="handle" cx={px(v)[0]} cy={px(v)[1]} r={14} onPointerDown={drag("v")} />}
      </svg>

      <div className="la-lt-side">
        <div className="la-mat2">
          <div className="la-bracket" style={{ marginLeft: 0 }} aria-hidden />
          <div className="la-mat2-cells">
            <Cell value={target[0]} epoch={epoch} className="la-i" onCommit={(n) => setMatrix([n, target[1], target[2], target[3]])} />
            <Cell value={target[2]} epoch={epoch} className="la-j" onCommit={(n) => setMatrix([target[0], target[1], n, target[3]])} />
            <Cell value={target[1]} epoch={epoch} className="la-i" onCommit={(n) => setMatrix([target[0], n, target[2], target[3]])} />
            <Cell value={target[3]} epoch={epoch} className="la-j" onCommit={(n) => setMatrix([target[0], target[1], target[2], n])} />
          </div>
          <div className="la-bracket la-bracket-r" aria-hidden />
        </div>
        <p className="la-mono text-center text-[0.68rem] tracking-wider text-[var(--la-ink-faint)] uppercase">
          <span className="la-i">column 1 · where î lands</span>
          <br />
          <span className="la-j">column 2 · where ĵ lands</span>
        </p>

        <div className="la-lt-readout" aria-live="polite">
          {showV ? (
            <>
              <span className="la-v">v</span> = {fmt(v[0])}·<span className="la-i">î</span> + {fmt(v[1])}·<span className="la-j">ĵ</span>
              <br />
              A<span className="la-v">v</span> = {fmt(v[0])}·<span className="la-i">({fmt(iHat[0])}, {fmt(iHat[1])})</span> + {fmt(v[1])}·<span className="la-j">({fmt(jHat[0])}, {fmt(jHat[1])})</span>
              <br />
              = <span className="la-v">({fmt(Av[0])}, {fmt(Av[1])})</span>
            </>
          ) : (
            <span className="text-[var(--la-ink-faint)]">Drag î or ĵ. Edit the matrix. Press apply to watch it happen.</span>
          )}
        </div>

        <div className="la-chips" role="group" aria-label="Presets">
          {PRESETS.map((p) => (
            <button key={p.name} type="button" className="la-chipbtn" aria-pressed={activePreset === p.name} onClick={() => setMatrix(p.m)}>{p.name}</button>
          ))}
        </div>

        <div className="la-lt-controls">
          <button type="button" className="la-ctl la-ctl-primary" onClick={replay} aria-label="Apply from identity" title="Apply from identity (space)"><Play className="size-4" /></button>
          <label className="flex min-w-0 flex-1 items-center gap-2">
            <input type="range" min={0} max={1} step={0.005} value={t} onChange={(e) => scrub(Number(e.target.value))} className="la-range" aria-label="Transformation progress" />
            <span className="la-mono w-8 shrink-0 text-right text-xs text-[var(--la-ink-soft)]">{t.toFixed(2)}</span>
          </label>
          <button type="button" className="la-chipbtn" aria-pressed={showV} onClick={() => setShowV((s) => !s)}>vector</button>
          <button type="button" className="la-ctl" onClick={() => { setV([2, 1]); setMatrix([1, 0, 1, 1]); }} aria-label="Reset" title="Reset"><RotateCcw className="size-4" /></button>
        </div>
      </div>
    </div>
  );
}
