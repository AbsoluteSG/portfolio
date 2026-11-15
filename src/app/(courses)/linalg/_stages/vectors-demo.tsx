"use client";

import { W, H, BG_PATH, Arrow } from "./plane";
import { Demo, useBeats, Seg, Dot, mix, phase } from "./demo";

const v: [number, number] = [3, 1];
const w: [number, number] = [1, 2];
const add: [number, number] = [v[0] + w[0], v[1] + w[1]];
const combo: [number, number] = [2 * v[0] - w[0], 2 * v[1] - w[1]];

const LABELS = ["vectors", "scaling", "tip to tail", "parallelogram", "2v − w"];

/** Addition and scalar multiplication, performed rather than described. */
export function VectorsDemo() {
  const { step, t, playing, setPlaying, goTo, reset } = useBeats(LABELS.length);

  // Each step draws itself from t, so scrubbing backwards and forwards is consistent.
  const grow = (a: [number, number], k: number): [number, number] => [a[0] * k, a[1] * k];

  const scaleK = step === 1 ? mix(1, 2, t) : 1;
  const tailK = step === 2 ? t : step > 2 ? 1 : 0;
  const paraK = step === 3 ? t : step > 3 ? 1 : 0;
  const comboK = step === 4 ? t : 0;

  const captions = [
    <>Two vectors in <strong>ℝ²</strong>: <span className="la-i">v</span> = (3, 1) and <span className="la-j">w</span> = (1, 2). Every entry is a coordinate, and the arrow runs from the origin to that point.</>,
    <>Scalar multiplication stretches. <strong>2v = (6, 2)</strong> — each entry doubles, the direction is untouched. A negative scalar would flip it end for end.</>,
    <>Addition is <strong>tip to tail</strong>: slide <span className="la-j">w</span> so it starts at the tip of <span className="la-i">v</span>. Where it lands is <span className="la-v">v + w</span> = (4, 3) — exactly the entry-by-entry sum.</>,
    <>The order doesn&apos;t matter. Sliding <span className="la-i">v</span> along <span className="la-j">w</span> instead reaches the same corner, so <strong>v + w = w + v</strong>, and the two routes close a parallelogram.</>,
    <>Combining both operations: <strong>2v − w</strong> scales <span className="la-i">v</span> by 2, then adds <span className="la-j">−w</span> — the reversed <span className="la-j">w</span>. Result: (5, 0).</>,
  ];

  return (
    <Demo
      label="Vector addition and scalar multiplication, animated"
      labels={LABELS}
      step={step}
      t={t}
      playing={playing}
      onPlay={() => setPlaying((p) => !p)}
      onStep={goTo}
      onReset={reset}
      caption={captions[step]}
    >
      <svg className="la-plane" viewBox={`${-W / 2 - 40} ${-H / 2} ${W} ${H}`} role="img" aria-label={LABELS[step]}>
        <path className="bg" d={BG_PATH} />
        <path className="bg-axis" d={`M${-W} 0L${W} 0M0 ${-H}L0 ${H}`} />

        {/* the sum's parallelogram, drawn faintly once both routes are shown */}
        {paraK > 0 && (
          <polygon
            points={`0,0 ${v[0] * 40},${-v[1] * 40} ${add[0] * 40},${-add[1] * 40} ${w[0] * 40},${-w[1] * 40}`}
            fill="var(--la-v)"
            fillOpacity={0.1 * paraK}
            stroke="none"
          />
        )}

        {/* w slid to v's tip, and — on the next step — v slid to w's tip */}
        {tailK > 0 && <Seg from={v} to={[v[0] + w[0] * tailK, v[1] + w[1] * tailK]} color="var(--la-j)" opacity={0.85} />}
        {paraK > 0 && <Seg from={w} to={[w[0] + v[0] * paraK, w[1] + v[1] * paraK]} color="var(--la-i)" opacity={0.85 * paraK} />}

        {/* the resultant */}
        {tailK >= 1 && step < 4 && <Arrow to={add} color="var(--la-v)" label="v+w" />}

        {/* step 5: 2v, then −w laid on its tip */}
        {step === 4 && (
          <>
            <Seg from={[0, 0]} to={grow(v, mix(1, 2, phase(comboK, 0, 0.45)))} color="var(--la-i)" width={2.5} />
            {comboK > 0.45 && (
              <Seg
                from={[2 * v[0], 2 * v[1]]}
                to={[2 * v[0] - w[0] * phase(comboK, 0.45, 0.85), 2 * v[1] - w[1] * phase(comboK, 0.45, 0.85)]}
                color="var(--la-j)"
              />
            )}
            {comboK > 0.85 && <Arrow to={combo} color="var(--la-v)" label="2v−w" />}
            {comboK > 0.85 && <Dot at={combo} color="var(--la-v)" />}
          </>
        )}

        {step !== 4 && (
          <>
            <Seg from={[0, 0]} to={grow(v, scaleK)} color="var(--la-i)" label={step === 1 ? "2v" : "v"} />
            <Arrow to={w} color="var(--la-j)" label="w" />
          </>
        )}
        {step === 4 && <Arrow to={w} color="var(--la-j)" width={1.4} label="w" />}
      </svg>
    </Demo>
  );
}
