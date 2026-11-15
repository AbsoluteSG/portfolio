"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/** Column-major 2×2: [a c; b d] · (x, y) = (a·x + c·y, b·x + d·y). Column 1 is where î lands, column 2 where ĵ lands. */
export type Mat = [number, number, number, number];
export type Vec = [number, number];

export const I: Mat = [1, 0, 0, 1];
export const U = 40; // px per unit
export const W = 560, H = 400; // viewBox size
export const RANGE = 12; // how far the moving grid extends (units), so it still covers the view after a stretch
export const VIEW = 8;   // static grid extent (units)

export const EASE: [number, number, number, number] = [0.45, 0, 0.15, 1]; // manim's smooth()
export const apply = (m: Mat, [x, y]: Vec): Vec => [m[0] * x + m[2] * y, m[1] * x + m[3] * y];
export const lerp = (a: Mat, b: Mat, t: number): Mat => a.map((v, i) => v + (b[i] - v) * t) as Mat;
export const fmt = (n: number) => {
  const s = (Math.abs(n) < 0.005 ? 0 : n).toFixed(2).replace(/\.?0+$/, "");
  return s.replace("-", "−");
};
export const parse = (s: string) => {
  const t = s.trim().replace("−", "-");
  const m = t.match(/^(-?\d+)\/(\d+)$/);
  if (m) return Number(m[1]) / Number(m[2]);
  const n = Number(t);
  return t !== "" && Number.isFinite(n) ? n : null;
};
// Rounded, so server and client render byte-identical SVG (Math.cos/sin can differ in the last bit).
const r3 = (n: number) => Math.round(n * 1000) / 1000;
export const px = ([x, y]: Vec): Vec => [r3(x * U), r3(-y * U)];

/** A number that fades between discrete values but tracks continuous ones (drags) without re-mounting. */
export function Live({ value, epoch, className }: { value: number; epoch: number; className?: string }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={epoch}
        initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
        transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
        className={`la-num-display ${className ?? ""}`}
      >
        {fmt(value)}
      </motion.span>
    </AnimatePresence>
  );
}

export function Cell({ value, epoch, className, onCommit }: { value: number; epoch: number; className: string; onCommit: (n: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const commit = () => {
    const n = parse(text);
    if (n !== null && n !== value) onCommit(n);
    setEditing(false);
  };
  return (
    <div className="la-cell" onClick={() => { if (!editing) { setText(fmt(value).replace("−", "-")); setEditing(true); } }}>
      {editing ? (
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={(e) => e.target.select()}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
          aria-invalid={text !== "" && parse(text) === null}
          className="la-cell-input"
          style={{ width: "3.8rem" }}
        />
      ) : (
        <Live value={value} epoch={epoch} className={className} />
      )}
    </div>
  );
}

export function Arrow({ to, color, label, width = 2.5 }: { to: Vec; color: string; label?: string; width?: number }) {
  const [x, y] = px(to);
  const len = Math.hypot(x, y);
  const ang = (Math.atan2(y, x) * 180) / Math.PI;
  const head = Math.min(11, len * 0.5);
  return (
    <g>
      <line x1={0} y1={0} x2={x} y2={y} stroke={color} strokeWidth={width} strokeLinecap="round" />
      {len > 2 && (
        <polygon points={`${len},0 ${len - head},${-head * 0.42} ${len - head},${head * 0.42}`} fill={color} transform={`rotate(${ang})`} />
      )}
      {label && len > 14 && (
        <text x={x + (x / len) * 14 + 4} y={y + (y / len) * 14 + 5} fill={color}>{label}</text>
      )}
    </g>
  );
}


/** Path data for the moving grid under matrix `m`: minor lines, and the two axes separately so they can be drawn heavier. */
export function gridPaths(m: Mat) {
  const seg: string[] = [];
  for (let k = -RANGE; k <= RANGE; k++) {
    if (k === 0) continue;
    const [x1, y1] = px(apply(m, [k, -RANGE])), [x2, y2] = px(apply(m, [k, RANGE]));
    const [x3, y3] = px(apply(m, [-RANGE, k])), [x4, y4] = px(apply(m, [RANGE, k]));
    seg.push(`M${x1} ${y1}L${x2} ${y2}M${x3} ${y3}L${x4} ${y4}`);
  }
  const [ax1, ay1] = px(apply(m, [-RANGE, 0])), [ax2, ay2] = px(apply(m, [RANGE, 0]));
  const [bx1, by1] = px(apply(m, [0, -RANGE])), [bx2, by2] = px(apply(m, [0, RANGE]));
  return { minor: seg.join(""), axes: `M${ax1} ${ay1}L${ax2} ${ay2}M${bx1} ${by1}L${bx2} ${by2}` };
}

/** The static background grid. */
export const BG_PATH = (() => {
  const seg: string[] = [];
  for (let k = -VIEW; k <= VIEW; k++) {
    if (k === 0) continue;
    seg.push(`M${k * U} ${-H}L${k * U} ${H}M${-W} ${-k * U}L${W} ${-k * U}`);
  }
  return seg.join("");
})();

/** Pointer position → plane units, for drags on the SVG. */
export function toUnits(svg: SVGSVGElement, e: { clientX: number; clientY: number }): Vec {
  const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM()!.inverse());
  return [pt.x / U, -pt.y / U];
}
