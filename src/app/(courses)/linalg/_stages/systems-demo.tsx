"use client";

import { W, H, BG_PATH } from "./plane";
import { Demo, useBeats, Dot, mix } from "./demo";

/** A line ax + by = c, clipped to the drawing area, in plane pixels. */
function linePath(a: number, b: number, c: number) {
  const R = 14; // units
  if (Math.abs(b) > 1e-9) {
    const y = (x: number) => (c - a * x) / b;
    return `M${-R * 40} ${-y(-R) * 40}L${R * 40} ${-y(R) * 40}`;
  }
  const x = c / a;
  return `M${x * 40} ${-R * 40}L${x * 40} ${R * 40}`;
}

const LABELS = ["one crossing", "no crossing", "same line", "the three cases"];

/** Two equations are two lines; the solution set is where they meet. */
export function SystemsDemo() {
  const { step, t, playing, setPlaying, goTo, reset } = useBeats(LABELS.length, 1.6);

  // Line 1 is fixed: x + 2y = 3. Line 2 morphs between the three cases.
  const l1 = { a: 1, b: 2, c: 3 };
  // unique: 2x − y = 1 (crosses at (1,1)) → parallel: 2x + 4y = 8 → identical: 2x + 4y = 6
  const start = step === 0 ? { a: 2, b: -1, c: 1 } : step === 1 ? { a: 2, b: -1, c: 1 } : { a: 2, b: 4, c: 8 };
  const end = step === 0 ? { a: 2, b: -1, c: 1 } : step === 1 ? { a: 2, b: 4, c: 8 } : { a: 2, b: 4, c: 6 };
  const k = step === 0 ? 1 : t;
  const l2 = step === 3
    ? { a: 2, b: 4, c: 6 }
    : { a: mix(start.a, end.a, k), b: mix(start.b, end.b, k), c: mix(start.c, end.c, k) };

  const det = l1.a * l2.b - l1.b * l2.a;
  const unique = Math.abs(det) > 1e-6;
  const cross: [number, number] | null = unique
    ? [(l2.b * l1.c - l1.b * l2.c) / det, (l1.a * l2.c - l2.a * l1.c) / det]
    : null;
  const sameLine = !unique && Math.abs(l1.a * l2.c - l2.a * l1.c) < 1e-6;

  const captions = [
    <>Each equation is a <strong>line</strong>. A solution satisfies both at once, so it is a point on both lines — here they cross once, at <strong>(1, 1)</strong>. One crossing, one solution.</>,
    <>Now the second line rotates until it is <strong>parallel</strong>. The crossing point races off to infinity and then there is none: the equations demand different things of the same combination. <strong>No solution</strong>.</>,
    <>Slide the parallel line until it lands <strong>on top</strong> of the first. Now every point of the line satisfies both equations — the second equation was just the first one doubled. <strong>Infinitely many</strong>.</>,
    <>Those are the only possibilities. Two straight lines cross once, never, or everywhere. There is no arrangement meeting in exactly two points, which is why a linear system never has exactly two solutions.</>,
  ];

  return (
    <Demo
      label="Two equations as two lines, and the three ways they can meet"
      labels={LABELS}
      step={step}
      t={t}
      playing={playing}
      onPlay={() => setPlaying((p) => !p)}
      onStep={goTo}
      onReset={reset}
      caption={captions[step]}
    >
      <svg className="la-plane" viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`} role="img" aria-label={LABELS[step]}>
        <path className="bg" d={BG_PATH} />
        <path className="bg-axis" d={`M${-W} 0L${W} 0M0 ${-H}L0 ${H}`} />
        <path className="la-line1" d={linePath(l1.a, l1.b, l1.c)} />
        <path
          className="la-line2"
          d={linePath(l2.a, l2.b, l2.c)}
          /* Coincident lines would hide each other, so dash the second when it lands on the first. */
          strokeDasharray={sameLine ? "10 9" : undefined}
        />
        {cross && Math.abs(cross[0]) < 13 && Math.abs(cross[1]) < 9 && (
          <>
            <Dot at={cross} color="var(--la-v)" r={6} />
            <text className="la-hero-coord" x={cross[0] * 40 + 12} y={-cross[1] * 40 - 10}>
              ({cross[0].toFixed(0)}, {cross[1].toFixed(0)})
            </text>
          </>
        )}
        {sameLine && (
          <text className="la-hero-coord" x={-40} y={-120} textAnchor="middle">every point solves both</text>
        )}
      </svg>
    </Demo>
  );
}
