"use client";

import { W, H, BG_PATH, Arrow } from "./plane";
import { Demo, useBeats, Seg, Dot, phase } from "./demo";

const v1: [number, number] = [3, 1];
const v2: [number, number] = [1, 2];
const v3: [number, number] = [5, 0]; // = 2v₁ − v₂, so {v₁, v₂, v₃} is dependent

const LABELS = ["three vectors", "chase v₃", "it lands", "back to zero", "the relation"];

/** Dependence made visible: a nonzero combination of the vectors that returns to the origin. */
export function IndependenceDemo() {
  const { step, t, playing, setPlaying, goTo, reset } = useBeats(LABELS.length, 1.5);

  // Step 2: build 2v₁ − v₂ tip to tail and watch it arrive at v₃.
  const a = step === 1 ? phase(t, 0, 0.5) : step >= 2 ? 1 : 0;
  const b = step === 1 ? phase(t, 0.5, 1) : step >= 2 ? 1 : 0;
  const mid: [number, number] = [2 * v1[0] * a, 2 * v1[1] * a];
  const tip: [number, number] = [2 * v1[0] - v2[0] * b, 2 * v1[1] - v2[1] * b];

  // Step 4: the same combination minus v₃, closing the loop at the origin.
  const close = step === 3 ? t : step > 3 ? 1 : 0;
  const closed: [number, number] = [tip[0] - v3[0] * close, tip[1] - v3[1] * close];

  const captions = [
    <>Three vectors in ℝ²: <span className="la-i">v₁</span> = (3, 1), <span className="la-j">v₂</span> = (1, 2), <span className="la-v">v₃</span> = (5, 0). Independence asks whether any of them is reachable from the others.</>,
    <>Chase <span className="la-v">v₃</span> using only the first two: take <strong>2v₁</strong>, then add <strong>−v₂</strong> tip to tail.</>,
    <>It <strong>lands exactly on v₃</strong>. So <span className="la-v">v₃</span> = 2v₁ − v₂ — the third vector was already inside Span&#123;v₁, v₂&#125; and adds no new direction.</>,
    <>Move that relation to one side. Following <strong>2v₁ − v₂ − v₃</strong> returns to where it started: a nonzero set of weights producing the <strong>zero vector</strong>.</>,
    <>That closed loop is the definition: <strong>2v₁ − v₂ − v₃ = 0</strong> with weights not all zero, so the set is <strong>linearly dependent</strong>. Three vectors in ℝ² always are — there is never room for a third direction.</>,
  ];

  return (
    <Demo
      label="Linear dependence shown as a combination returning to the origin"
      labels={LABELS}
      step={step}
      t={t}
      playing={playing}
      onPlay={() => setPlaying((p) => !p)}
      onStep={goTo}
      onReset={reset}
      caption={captions[step]}
    >
      <svg className="la-plane" viewBox={`${-W / 2 - 60} ${-H / 2} ${W} ${H}`} role="img" aria-label={LABELS[step]}>
        <path className="bg" d={BG_PATH} />
        <path className="bg-axis" d={`M${-W} 0L${W} 0M0 ${-H}L0 ${H}`} />

        {step >= 1 && a > 0 && <Seg from={[0, 0]} to={mid} color="var(--la-i)" label={a >= 1 ? "2v₁" : undefined} />}
        {step >= 1 && b > 0 && <Seg from={mid} to={tip} color="var(--la-j)" label={b >= 1 ? "−v₂" : undefined} />}
        {step === 3 && close > 0 && <Seg from={tip} to={closed} color="var(--la-v)" label={close >= 1 ? "−v₃" : undefined} />}

        {step === 2 && <Dot at={v3} color="var(--la-v)" r={7} />}
        {step >= 3 && close >= 1 && <Dot at={[0, 0]} color="var(--la-green)" r={7} />}

        <Arrow to={v1} color="var(--la-i)" label="v₁" width={step >= 1 ? 1.5 : 2.5} />
        <Arrow to={v2} color="var(--la-j)" label="v₂" width={step >= 1 ? 1.5 : 2.5} />
        {step < 3 && <Arrow to={v3} color="var(--la-v)" label="v₃" />}
      </svg>
    </Demo>
  );
}
