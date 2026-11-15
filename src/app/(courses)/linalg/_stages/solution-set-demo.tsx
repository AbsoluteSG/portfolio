"use client";

import { W, H, BG_PATH } from "./plane";
import { Demo, useBeats, Seg, Dot, mix } from "./demo";

// x + 2y = 3. Direction of the homogeneous line: (−2, 1). Particular solution: (3, 0).
const d: [number, number] = [-2, 1];
const p: [number, number] = [3, 0];

const LABELS = ["the homogeneous set", "one solution", "the shift", "p + span"];

/** Every solution set is one particular solution plus the homogeneous set. */
export function SolutionSetDemo() {
  const { step, t, playing, setPlaying, goTo, reset } = useBeats(LABELS.length, 1.5);

  const R = 7;
  const homLine = (ox: number, oy: number, grow: number) =>
    `M${(ox - d[0] * R * grow) * 40} ${-(oy - d[1] * R * grow) * 40}L${(ox + d[0] * R * grow) * 40} ${-(oy + d[1] * R * grow) * 40}`;

  const growK = step === 0 ? t : 1;
  const shiftK = step === 2 ? t : step > 2 ? 1 : 0;
  const shift: [number, number] = [p[0] * shiftK, p[1] * shiftK];

  // Points sliding along each line, to read them as sets rather than decorations.
  const slide = mix(-2.2, 2.2, step === 3 ? t : 0.5);

  const captions = [
    <>First solve the <strong>homogeneous</strong> system <strong>x + 2y = 0</strong>. Its solutions are the multiples of (−2, 1) — a line through the <strong>origin</strong>, which is always a solution.</>,
    <>Now the real system, <strong>x + 2y = 3</strong>. Find any single solution you like: <strong>p = (3, 0)</strong> works. This is the <em>particular</em> solution.</>,
    <>Add <strong>p</strong> to every homogeneous solution. The whole line <strong>slides</strong> off the origin and lands on the solution set of x + 2y = 3.</>,
    <>So the answer is <strong>x = p + t·(−2, 1)</strong>: one particular solution plus the homogeneous span. Any point of the line could serve as p — the set is the same either way.</>,
  ];

  return (
    <Demo
      label="A solution set as a particular solution plus the homogeneous solutions"
      labels={LABELS}
      step={step}
      t={t}
      playing={playing}
      onPlay={() => setPlaying((p2) => !p2)}
      onStep={goTo}
      onReset={reset}
      caption={captions[step]}
    >
      <svg className="la-plane" viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`} role="img" aria-label={LABELS[step]}>
        <path className="bg" d={BG_PATH} />
        <path className="bg-axis" d={`M${-W} 0L${W} 0M0 ${-H}L0 ${H}`} />

        {/* the homogeneous line, always shown once drawn */}
        <path className="la-homline" d={homLine(0, 0, growK)} />
        <Dot at={[0, 0]} color="var(--la-ink-faint)" r={5} />

        {/* the shifted copy */}
        {shiftK > 0 && <path className="la-solline" d={homLine(shift[0], shift[1], 1)} style={{ opacity: shiftK }} />}

        {/* the shift itself */}
        {step === 2 && shiftK > 0.05 && <Seg from={[0, 0]} to={shift} color="var(--la-amber)" label="p" width={3} />}

        {step >= 1 && <Dot at={p} color="var(--la-amber)" r={6} />}

        {/* a point sliding along each line */}
        {step === 3 && (
          <>
            <Dot at={[d[0] * slide, d[1] * slide]} color="var(--la-ink-faint)" r={5} />
            <Dot at={[p[0] + d[0] * slide, p[1] + d[1] * slide]} color="var(--la-v)" r={5} />
            <Seg
              from={[d[0] * slide, d[1] * slide]}
              to={[p[0] + d[0] * slide, p[1] + d[1] * slide]}
              color="var(--la-amber)"
              dashed
              width={1.5}
            />
          </>
        )}
      </svg>
    </Demo>
  );
}
