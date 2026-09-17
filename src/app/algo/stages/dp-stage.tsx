"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Cells, Code } from "./bits";
import { CodeStage, type Frame } from "./code-stage";

const COIN_SETS: { label: string; coins: number[] }[] = [
  { label: "1 · 3 · 4", coins: [1, 3, 4] },
  { label: "1 · 5 · 10 · 25", coins: [1, 5, 10, 25] },
  { label: "2 · 5", coins: [2, 5] },
];
const INF = 1e9;

const CODE = [
  "vector<int> table(target + 1, INF);",
  "table[0] = 0;",
  "for (int i = 1; i <= target; i++) {",
  "    for (int c : coins) {",
  "        if (c > i) continue;",
  "        if (table[i - c] + 1 < table[i]) {",
  "            table[i] = table[i - c] + 1;",
  "        }",
  "    }",
  "}",
];

interface S {
  table: (number | null)[];
  i: number | null;        // cell being filled
  from: number | null;     // cell being looked at (i - c)
  c: number | null;
  improved: boolean;       // this frame wrote table[i]
  done: boolean;
}

function trace(coins: number[], target: number): Frame<S>[] {
  const frames: Frame<S>[] = [];
  const table: number[] = [];
  const fmt = (v: number) => (v >= INF ? "∞" : v);
  const push = (line: number, s: Partial<S>, note: React.ReactNode, vars?: Frame<S>["vars"]) =>
    frames.push({ line, state: { table: table.slice(), i: null, from: null, c: null, improved: false, done: false, ...s }, note, vars });

  for (let k = 0; k <= target; k++) table.push(INF);
  push(1, {}, <>Start every amount at <b>∞</b>: &quot;no known way yet&quot;.</>, { target });
  table[0] = 0;
  push(2, { i: 0, improved: true }, <>Amount 0 needs zero coins. This is the seed every other cell is built from.</>, { "table[0]": 0 });
  for (let i = 1; i <= target; i++) {
    push(3, { i }, <>Fill amount <b>{i}</b>. Everything to its left is already final.</>, { i, "table[i]": "∞" });
    for (const c of coins) {
      if (c > i) {
        push(5, { i, c }, <>Coin {c} is bigger than {i}; it can&apos;t be part of this amount. Skip it.</>, { i, c });
        continue;
      }
      const cand = table[i - c] + 1;
      const better = cand < table[i];
      push(6, { i, c, from: i - c }, better
        ? <>Spend a <b>{c}</b> and you need <Code>table[{i - c}]</Code> = {fmt(table[i - c])} more coins: {fmt(table[i - c])} + 1 = <b>{fmt(cand)}</b>, better than {fmt(table[i])}.</>
        : <>Spend a <b>{c}</b>: <Code>table[{i - c}]</Code> + 1 = {fmt(cand)}. Not better than {fmt(table[i])}, so leave it.</>,
        { i, c, "table[i-c]+1": fmt(cand), "table[i]": fmt(table[i]) });
      if (better) {
        table[i] = cand;
        push(7, { i, c, from: i - c, improved: true }, <><Code>table[{i}]</Code> ← {cand}. Best so far for amount {i}.</>, { i, c, "table[i]": cand });
      }
    }
  }
  push(3, { done: true }, <>Loop over. Every cell holds the fewest coins for that amount; <Code>table[{target}]</Code> = <b>{fmt(table[target])}</b>. Work done: <Code>target × coins</Code> lookups, each O(1).</>, { i: target + 1, [`table[${target}]`]: fmt(table[target]) });
  return frames;
}

export function DPStage() {
  const [coins, setCoins] = useState<number[]>(COIN_SETS[0].coins);
  const [target, setTarget] = useState(8);
  const [key, setKey] = useState(0);
  const frames = useMemo(() => trace(coins, target), [coins, target]);
  const restart = (cs: number[], t: number) => { setCoins(cs); setTarget(t); setKey((k) => k + 1); };

  return (
    <CodeStage<S>
      key={key}
      code={CODE}
      frames={frames}
      initial={{ table: Array(target + 1).fill(null), i: null, from: null, c: null, improved: false, done: false }}
      speed={750}
      intro={<>Fewest coins to make each amount from 0 to {target}. The program on the left fills the table one cell at a time; each inner iteration is one coin tried. Step with →.</>}
      onReset={() => restart(COIN_SETS[0].coins, 8)}
      controls={
        <div className="al-picks">
          <span className="al-picks-label">coins</span>
          {COIN_SETS.map((s) => (
            <button key={s.label} type="button" className="la-chipbtn" aria-pressed={s.coins === coins} onClick={() => restart(s.coins, target)}>{s.label}</button>
          ))}
          <span className="al-picks-label">target</span>
          <span className="la-seg" role="group" aria-label="Target amount">
            <button type="button" onClick={() => restart(coins, target - 1)} disabled={target <= 4}>−</button>
            <button type="button" onClick={() => restart(coins, target + 1)} disabled={target >= 12}>+</button>
          </span>
        </div>
      }
      render={(s) => <Picture s={s} />}
    />
  );
}

function Picture({ s }: { s: S }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [box, setBox] = useState<{ cells: DOMRect[]; origin: DOMRect } | null>(null);
  const n = s.table.length;
  useLayoutEffect(() => {
    const measure = () => {
      const origin = sceneRef.current?.getBoundingClientRect();
      if (!origin) return;
      setBox({ origin, cells: refs.current.slice(0, n).map((el) => el!.getBoundingClientRect()) });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [n, s.i, s.from]);
  const cx = (r: DOMRect) => r.left + r.width / 2 - (box?.origin.left ?? 0);
  const top = (r: DOMRect) => r.top - (box?.origin.top ?? 0);

  const shown = s.table.map((v) => (v === null ? null : v >= INF ? "∞" : v));
  return (
    <div className="al-scene" ref={sceneRef} style={{ paddingTop: "2.4rem" }}>
      <Cells
        label="fewest coins, by amount"
        values={shown}
        cellRef={(k, el) => { refs.current[k] = el; }}
        tone={(k) => (s.improved && k === s.i ? "changed" : s.done ? "good" : undefined)}
        marks={(k) => {
          if (s.done) return "";
          if (k === s.i) return s.improved ? "al-cell-dst al-cell-best" : "al-cell-dst";
          if (k === s.from) return "al-cell-src";
          return s.i !== null && k > s.i ? "al-cell-dim" : "";
        }}
      />
      {box && s.i !== null && s.from !== null && (
        <svg className="al-arcs">
          <path className={s.improved ? "arc-best" : "arc-src"} d={`M ${cx(box.cells[s.from])} ${top(box.cells[s.from]) - 4} C ${cx(box.cells[s.from])} ${top(box.cells[s.from]) - 34}, ${cx(box.cells[s.i])} ${top(box.cells[s.i]) - 34}, ${cx(box.cells[s.i])} ${top(box.cells[s.i]) - 4}`} />
        </svg>
      )}
    </div>
  );
}
