"use client";

import { W, H, BG_PATH, Arrow } from "./plane";
import { Demo, useBeats, Seg, Dot } from "./demo";

const a1: [number, number] = [1, 2];
const a2: [number, number] = [-1, 1];
const x = [2, 1];
const b: [number, number] = [x[0] * a1[0] + x[1] * a2[0], x[0] * a1[1] + x[1] * a2[1]]; // (1, 5)

const LABELS = ["the columns", "weight the first", "add the second", "that is Ax", "three notations"];

/** Ax is the combination of A's columns weighted by the entries of x. */
export function MatrixEquationDemo() {
  const { step, t, playing, setPlaying, goTo, reset } = useBeats(LABELS.length, 1.4);

  const k1 = step === 1 ? t : step >= 2 ? 1 : 0;
  const k2 = step === 2 ? t : step >= 3 ? 1 : 0;
  const scaled: [number, number] = [a1[0] * (1 + k1), a1[1] * (1 + k1)];
  const tip: [number, number] = [scaled[0] + a2[0] * k2, scaled[1] + a2[1] * k2];

  const captions = [
    <>The matrix <strong>A</strong> has columns <span className="la-i">a₁</span> = (1, 2) and <span className="la-j">a₂</span> = (−1, 1). Forget the rows — <strong>Ax</strong> is defined by the columns.</>,
    <>The first entry of <strong>x</strong> = (2, 1) is the weight on the first column: stretch <span className="la-i">a₁</span> to <strong>2a₁</strong>.</>,
    <>The second entry weights the second column. Lay <strong>1·a₂</strong> tip to tail on the end of 2a₁.</>,
    <>Where it lands is <strong>Ax</strong> = 2a₁ + 1·a₂ = <span className="la-v">(1, 5)</span>. Solving <strong>Ax = b</strong> runs this backwards: given the destination, find the weights.</>,
    <>So the same problem wears three outfits — matrix equation <strong>Ax = b</strong>, vector equation <strong>x₁a₁ + x₂a₂ = b</strong>, and the system with augmented matrix <strong>[ A | b ]</strong>. Row reduce whichever you are handed.</>,
  ];

  const aside = (
    <div className="la-demo-eqs">
      <div className={step >= 3 ? "is-on" : ""}>A x = b</div>
      <div className={step >= 4 ? "is-on" : ""}>x₁a₁ + x₂a₂ = b</div>
      <div className={step >= 4 ? "is-on" : ""}>[ A | b ]</div>
    </div>
  );

  return (
    <Demo
      label="Matrix times vector, as a combination of the columns"
      labels={LABELS}
      step={step}
      t={t}
      playing={playing}
      onPlay={() => setPlaying((p) => !p)}
      onStep={goTo}
      onReset={reset}
      caption={captions[step]}
      aside={aside}
    >
      <svg className="la-plane" viewBox={`${-W / 2} ${-H / 2 - 30} ${W} ${H}`} role="img" aria-label={LABELS[step]}>
        <path className="bg" d={BG_PATH} />
        <path className="bg-axis" d={`M${-W} 0L${W} 0M0 ${-H}L0 ${H}`} />

        {step >= 1 && <Seg from={[0, 0]} to={scaled} color="var(--la-i)" label={k1 >= 1 ? "2a₁" : undefined} width={3} />}
        {step >= 2 && k2 > 0 && <Seg from={scaled} to={tip} color="var(--la-j)" label={k2 >= 1 ? "a₂" : undefined} />}
        {step >= 3 && <Arrow to={b} color="var(--la-v)" label="Ax" />}
        {step >= 3 && <Dot at={b} color="var(--la-v)" r={6} />}

        <Arrow to={a1} color="var(--la-i)" label="a₁" width={step >= 1 ? 1.4 : 2.5} />
        <Arrow to={a2} color="var(--la-j)" label="a₂" width={step >= 2 ? 1.4 : 2.5} />
      </svg>
    </Demo>
  );
}
