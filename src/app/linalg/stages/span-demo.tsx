"use client";

import { W, H, BG_PATH, Arrow } from "./plane";
import { Demo, useBeats, Seg, Dot, mix } from "./demo";

const v1: [number, number] = [2, 1];
const v2: [number, number] = [-1, 2];
const dep: [number, number] = [4, 2]; // 2·v1 — adds nothing

const LABELS = ["one vector", "its span", "a second", "the plane", "dependent"];

/** Span built up: the multiples of one vector, then every combination of two. */
export function SpanDemo() {
  const { step, t, playing, setPlaying, goTo, reset } = useBeats(LABELS.length, 1.5);

  const lineK = step === 1 ? t : step >= 1 ? 1 : 0;
  const fillK = step === 3 ? t : step > 3 ? 0 : 0;
  const depK = step === 4 ? t : 0;

  // A moving sample of the span, so the sweep reads as "every combination".
  const sweep = step === 1 ? mix(-3.2, 3.2, t) : 0;
  const samples: [number, number][] = [];
  if (step === 3) {
    const n = Math.floor(fillK * 9) + 1;
    for (let a = -2; a <= 2; a++) {
      for (let b = -2; b <= 2; b++) {
        if (Math.abs(a) + Math.abs(b) <= n) samples.push([a * v1[0] + b * v2[0], a * v1[1] + b * v2[1]]);
      }
    }
  }

  const captions = [
    <>Start with one vector, <span className="la-i">v₁</span> = (2, 1). On its own it reaches exactly one point.</>,
    <>Now allow every scalar multiple <strong>c·v₁</strong>. Stretching, shrinking and reversing traces out a <strong>line through the origin</strong> — that line is Span&#123;v₁&#125;. The origin is always on it, at c = 0.</>,
    <>Add <span className="la-j">v₂</span> = (−1, 2), which is <strong>not</strong> a multiple of <span className="la-i">v₁</span>: it points off the line, in a genuinely new direction.</>,
    <>Every combination <strong>a·v₁ + b·v₂</strong> is now reachable, and the points fill the whole plane. Two independent directions in ℝ² span <strong>ℝ²</strong>.</>,
    <>But if the second vector <em>is</em> a multiple — here (4, 2) = 2·v₁ — it lies on the line already. Adding it enlarges nothing, and the span collapses back to a <strong>line</strong>.</>,
  ];

  return (
    <Demo
      label="Span, built up from one vector to two"
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

        {/* the line of multiples of v1 */}
        {(lineK > 0 && step !== 3) && (
          <line
            className="la-spanline"
            x1={-v1[0] * 40 * 6 * lineK} y1={v1[1] * 40 * 6 * lineK}
            x2={v1[0] * 40 * 6 * lineK} y2={-v1[1] * 40 * 6 * lineK}
          />
        )}

        {/* the plane filling in */}
        {step === 3 && (
          <>
            <rect
              x={-W} y={-H} width={2 * W} height={2 * H}
              fill="var(--la-v)" opacity={0.07 * fillK}
            />
            {samples.map(([x, y], i) => <Dot key={i} at={[x, y]} color="var(--la-v)" r={3} opacity={0.8} />)}
          </>
        )}

        {/* the moving multiple, sweeping the line */}
        {step === 1 && (
          <>
            <Seg from={[0, 0]} to={[v1[0] * sweep, v1[1] * sweep]} color="var(--la-v)" width={3} />
            <Dot at={[v1[0] * sweep, v1[1] * sweep]} color="var(--la-v)" r={5} />
          </>
        )}

        {step === 4 && (
          <Seg from={[0, 0]} to={[dep[0] * depK, dep[1] * depK]} color="var(--la-j)" label={depK > 0.6 ? "2v₁" : undefined} width={3} />
        )}

        <Arrow to={v1} color="var(--la-i)" label="v₁" />
        {(step === 2 || step === 3) && <Arrow to={v2} color="var(--la-j)" label="v₂" />}
      </svg>
    </Demo>
  );
}
