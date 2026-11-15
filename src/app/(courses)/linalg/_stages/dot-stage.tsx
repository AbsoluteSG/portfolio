"use client";

import { useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { type Vec, W, H, fmt, px, Arrow, BG_PATH, toUnits } from "./plane";

const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1];
const norm = (a: Vec) => Math.hypot(a[0], a[1]);
const scale = ([x, y]: Vec, k: number): Vec => [x * k, y * k];

const PRESETS: { name: string; v: Vec; w: Vec }[] = [
  { name: "Acute", v: [4, 1], w: [2, 3] },
  { name: "Perpendicular", v: [3, 2], w: [-2, 3] },
  { name: "Obtuse", v: [3, 2], w: [-3, 1] },
  { name: "Same direction", v: [3, 2], w: [1.5, 1] },
  { name: "Unit", v: [1, 0], w: [2, 3] },
];

/** Two draggable vectors: their dot product, the angle between them, and the projection of w onto v. */
export function DotStage() {
  const [v, setV] = useState<Vec>([4, 1]);
  const [w, setW] = useState<Vec>([2, 3]);
  const [showProj, setShowProj] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  const drag = (what: "v" | "w") => (e: React.PointerEvent<SVGElement>) => {
    e.preventDefault();
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => {
      const [x, y] = toUnits(svgRef.current!, ev);
      const snap = (n: number) => Math.round(n * 4) / 4;
      (what === "v" ? setV : setW)([snap(x), snap(y)]);
    };
    const up = () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  };

  const d = dot(v, w);
  const lv = norm(v), lw = norm(w);
  const cos = lv > 1e-9 && lw > 1e-9 ? Math.max(-1, Math.min(1, d / (lv * lw))) : 0;
  const angle = (Math.acos(cos) * 180) / Math.PI;
  const perp = Math.abs(d) < 5e-3;

  /** proj_v(w) = (w·v / v·v) v — the shadow w casts on v's line. */
  const k = lv > 1e-9 ? d / (lv * lv) : 0;
  const proj = scale(v, k);

  // v's line, long enough to read as a line rather than an arrow.
  const line = useMemo(() => {
    if (lv < 1e-9) return null;
    const [ux, uy] = scale(v, 14 / lv);
    const a = px([-ux, -uy]), b = px([ux, uy]);
    return `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;
  }, [v, lv]);

  const activePreset = PRESETS.find((p) => p.v[0] === v[0] && p.v[1] === v[1] && p.w[0] === w[0] && p.w[1] === w[1])?.name;

  return (
    <div className="la-lt" aria-label="Two vectors, their dot product and the projection between them">
      <svg ref={svgRef} className="la-plane" viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`} role="img" aria-label="Two draggable vectors on the plane">
        <path className="bg" d={BG_PATH} />
        <path className="bg-axis" d={`M${-W} 0L${W} 0M0 ${-H}L0 ${H}`} />
        {showProj && line && <path className="la-projline" d={line} />}

        {showProj && lv > 1e-9 && (
          <g>
            {/* the dropped perpendicular, and the shadow itself */}
            <line className="la-drop" x1={px(w)[0]} y1={px(w)[1]} x2={px(proj)[0]} y2={px(proj)[1]} />
            <line className="la-shadow" x1={0} y1={0} x2={px(proj)[0]} y2={px(proj)[1]} />
          </g>
        )}

        {perp && lv > 1e-9 && lw > 1e-9 && (
          <RightAngle v={v} w={w} />
        )}

        <Arrow to={v} color="var(--la-i)" label="v" />
        <Arrow to={w} color="var(--la-j)" label="w" />

        <circle className="handle" cx={px(v)[0]} cy={px(v)[1]} r={14} onPointerDown={drag("v")} />
        <circle className="handle" cx={px(w)[0]} cy={px(w)[1]} r={14} onPointerDown={drag("w")} />
      </svg>

      <div className="la-lt-side">
        <div className="la-dot-readout" aria-live="polite">
          <div className="la-dot-eq">
            <span className="la-i">v</span> · <span className="la-j">w</span> = {fmt(v[0])}·{fmt(w[0])} + {fmt(v[1])}·{fmt(w[1])}
          </div>
          <div className={`la-dot-value ${perp ? "la-det-zero" : d < 0 ? "la-det-neg" : ""}`}>{fmt(d)}</div>
          <div className="la-dot-gloss">
            {perp ? "zero — the two are perpendicular" : d < 0 ? "negative — they point more apart than together" : "positive — they point the same way, broadly"}
          </div>
          <dl className="la-dot-stats">
            <div><dt>|<span className="la-i">v</span>|</dt><dd>{fmt(lv)}</dd></div>
            <div><dt>|<span className="la-j">w</span>|</dt><dd>{fmt(lw)}</dd></div>
            <div><dt>cos θ</dt><dd>{fmt(cos)}</dd></div>
            <div><dt>θ</dt><dd>{fmt(angle)}°</dd></div>
          </dl>
          {showProj && (
            <div className="la-dot-proj">
              proj<sub>v</sub><span className="la-j">w</span> = {fmt(k)}<span className="la-i">v</span> = ({fmt(proj[0])}, {fmt(proj[1])})
            </div>
          )}
        </div>

        <div className="la-chips" role="group" aria-label="Presets">
          {PRESETS.map((p) => (
            <button key={p.name} type="button" className="la-chipbtn" aria-pressed={activePreset === p.name} onClick={() => { setV(p.v); setW(p.w); }}>{p.name}</button>
          ))}
        </div>

        <div className="la-lt-controls">
          <button type="button" className="la-chipbtn" aria-pressed={showProj} onClick={() => setShowProj((s) => !s)}>projection</button>
          <button type="button" className="la-ctl" onClick={() => { setV([4, 1]); setW([2, 3]); }} aria-label="Reset" title="Reset"><RotateCcw className="size-4" /></button>
        </div>
      </div>
    </div>
  );
}

/** The corner marker drawn where v and w meet at 90°, sized in plane units. */
function RightAngle({ v, w }: { v: Vec; w: Vec }) {
  const s = 0.45; // units along each side
  const uv = scale(v, s / norm(v));
  const uw = scale(w, s / norm(w));
  const p = (a: Vec) => px(a).join(",");
  return <polyline className="la-rightangle" points={`${p(uv)} ${p([uv[0] + uw[0], uv[1] + uw[1]])} ${p(uw)}`} />;
}
