"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animate } from "motion/react";
import { Play, RotateCcw } from "lucide-react";
import { type Mat, type Vec, I, W, H, EASE, lerp, fmt, px, Cell, Arrow, gridPaths, BG_PATH, toUnits } from "./plane";

const PRESETS: { name: string; m: Mat }[] = [
  { name: "Identity", m: [1, 0, 0, 1] },
  { name: "Double the width", m: [2, 0, 0, 1] },
  { name: "Shear", m: [1, 0, 1, 1] },
  { name: "Rotate 90°", m: [0, 1, -1, 0] },
  { name: "Reflect", m: [0, 1, 1, 0] },
  { name: "Singular", m: [2, 1, 4, 2] },
  { name: "Shrink", m: [0.5, 0, 0, 0.5] },
];

const det = (m: Mat) => m[0] * m[3] - m[1] * m[2];
const DEFAULT: Mat = [3, 0, 1, 2];

/** The unit square, and the parallelogram it becomes. Its signed area is the determinant. */
export function DeterminantStage() {
  const [target, setTarget] = useState<Mat>(DEFAULT);
  const [disp, setDisp] = useState<Mat>(DEFAULT);
  const [t, setT] = useState(1);
  const [epoch, setEpoch] = useState(0);
  const [showDecomp, setShowDecomp] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const anim = useRef<{ stop: () => void } | null>(null);

  const stopAnim = () => { anim.current?.stop(); anim.current = null; };

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

  const drag = (what: "i" | "j") => (e: React.PointerEvent<SVGElement>) => {
    e.preventDefault();
    stopAnim();
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      const [x, y] = toUnits(svgRef.current!, ev);
      const snap = (n: number) => Math.round(n * 4) / 4;
      const m: Mat = what === "i" ? [snap(x), snap(y), target[2], target[3]] : [target[0], target[1], snap(x), snap(y)];
      setMatrix(m, false);
    };
    const up = () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  };

  const grid = useMemo(() => gridPaths(disp), [disp]);
  const iHat: Vec = [disp[0], disp[1]];
  const jHat: Vec = [disp[2], disp[3]];
  const d = det(disp);
  const dTarget = det(target);
  const flipped = d < -1e-9;
  const collapsed = Math.abs(d) < 5e-3;

  // The image of the unit square: 0 → î → î+ĵ → ĵ.
  const corners: Vec[] = [[0, 0], iHat, [iHat[0] + jHat[0], iHat[1] + jHat[1]], jHat];
  const poly = corners.map((c) => px(c).join(",")).join(" ");
  const centre = px([(iHat[0] + jHat[0]) / 2, (iHat[1] + jHat[1]) / 2]);

  const activePreset = PRESETS.find((p) => p.m.every((x, i) => Math.abs(x - target[i]) < 1e-9))?.name;

  const onKey = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    if (e.key === " ") { e.preventDefault(); replay(); }
  };

  return (
    <div className="la-lt" tabIndex={0} onKeyDown={onKey} aria-label="The unit square, and the area it covers after the transformation">
      <svg ref={svgRef} className="la-plane" viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`} role="img" aria-label="The unit square warped into a parallelogram">
        <path className="bg" d={BG_PATH} />
        <path className="bg-axis" d={`M${-W} 0L${W} 0M0 ${-H}L0 ${H}`} />
        <path className="fg" d={grid.minor} />
        <path className="fg-axis" d={grid.axes} />

        {/* where the square started */}
        <rect className="la-unitsq" x={0} y={-40} width={40} height={40} />

        <polygon className={`la-area ${flipped ? "la-area-flip" : ""}`} points={poly} />

        {/* base × height, as a rectangle of the same area sitting on î */}
        {showDecomp && !collapsed && (
          <g className="la-decomp">
            <line x1={px(jHat)[0]} y1={px(jHat)[1]} x2={px([jHat[0] + iHat[0] * 4, jHat[1] + iHat[1] * 4])[0]} y2={px([jHat[0] + iHat[0] * 4, jHat[1] + iHat[1] * 4])[1]} />
            <line x1={px([jHat[0] - iHat[0] * 4, jHat[1] - iHat[1] * 4])[0]} y1={px([jHat[0] - iHat[0] * 4, jHat[1] - iHat[1] * 4])[1]} x2={px(jHat)[0]} y2={px(jHat)[1]} />
          </g>
        )}

        <Arrow to={iHat} color="var(--la-i)" label="î" />
        <Arrow to={jHat} color="var(--la-j)" label="ĵ" />

        {!collapsed && (
          <text className="la-area-label" x={centre[0]} y={centre[1]} textAnchor="middle">
            {flipped ? "−" : ""}{fmt(Math.abs(d))}
          </text>
        )}

        <circle className="handle" cx={px(iHat)[0]} cy={px(iHat)[1]} r={14} onPointerDown={drag("i")} />
        <circle className="handle" cx={px(jHat)[0]} cy={px(jHat)[1]} r={14} onPointerDown={drag("j")} />
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

        <div className="la-det-readout" aria-live="polite">
          <span className="la-det-eq">
            det A = ad − bc = {fmt(target[0])}·{fmt(target[3])} − {fmt(target[2])}·{fmt(target[1])}
          </span>
          <span className={`la-det-value ${Math.abs(dTarget) < 5e-3 ? "la-det-zero" : dTarget < 0 ? "la-det-neg" : ""}`}>
            {fmt(dTarget)}
          </span>
          <span className="la-det-gloss">
            {Math.abs(dTarget) < 5e-3
              ? "the square is flattened — all area gone"
              : dTarget < 0
                ? `areas scale by ${fmt(Math.abs(dTarget))}, and the plane is flipped over`
                : `every area is scaled by ${fmt(dTarget)}`}
          </span>
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
          <button type="button" className="la-chipbtn" aria-pressed={showDecomp} onClick={() => setShowDecomp((s) => !s)}>base × height</button>
          <button type="button" className="la-ctl" onClick={() => setMatrix(DEFAULT)} aria-label="Reset" title="Reset"><RotateCcw className="size-4" /></button>
        </div>
      </div>
    </div>
  );
}
