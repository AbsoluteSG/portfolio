"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate } from "motion/react";
import { type Mat, type Vec, I, W, H, EASE, lerp, px, Arrow, gridPaths, BG_PATH } from "./plane";

/** The loop: identity, a shear, a rotation, a stretch, a collapse, and back. */
const TOUR: Mat[] = [
  I,
  [1, 0, 0.8, 1],
  [0.6, 0.8, -0.8, 0.6],
  [1.6, 0, 0, 0.6],
  [1.2, 0.6, 0.6, 0.3],
  [1, 0.3, -0.3, 1],
];

const HOLD = 1.5; // seconds parked on each matrix
const TWEEN = 1.6;

/** The landing page's ambient plane: the same grid the chapters use, warping through a few maps on a loop. */
const still = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Hero() {
  // Rendered on the server as the identity, so the markup matches; the tour starts on mount.
  const [m, setM] = useState<Mat>(TOUR[0]);
  const stop = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (still()) return;
    let i = 0;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const next = () => {
      if (cancelled) return;
      const from = TOUR[i % TOUR.length];
      const to = TOUR[(i + 1) % TOUR.length];
      i += 1;
      const controls = animate(0, 1, {
        duration: TWEEN,
        ease: EASE,
        onUpdate: (k) => setM(lerp(from, to, k)),
        onComplete: () => { timer = setTimeout(next, HOLD * 1000); },
      });
      stop.current = () => controls.stop();
    };
    timer = setTimeout(next, HOLD * 1000);
    return () => { cancelled = true; clearTimeout(timer); stop.current?.(); };
  }, []);

  const grid = useMemo(() => gridPaths(m), [m]);
  const iHat: Vec = [m[0], m[1]];
  const jHat: Vec = [m[2], m[3]];

  return (
    <svg
      className="la-hero"
      viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="A coordinate grid warping through a shear, a rotation and a stretch"
    >
      <path className="bg" d={BG_PATH} />
      <path className="bg-axis" d={`M${-W} 0L${W} 0M0 ${-H}L0 ${H}`} />
      <path className="fg" d={grid.minor} />
      <path className="fg-axis" d={grid.axes} />
      <Arrow to={iHat} color="var(--la-i)" width={3} />
      <Arrow to={jHat} color="var(--la-j)" width={3} />
      <circle cx={0} cy={0} r={3.5} fill="var(--la-ink)" />
      <text className="la-hero-coord" x={px(iHat)[0] + 10} y={px(iHat)[1] + 4}>î</text>
      <text className="la-hero-coord" x={px(jHat)[0] + 10} y={px(jHat)[1] + 4}>ĵ</text>
    </svg>
  );
}
