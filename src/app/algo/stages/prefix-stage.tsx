"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Cells, Code } from "./bits";
import { CodeStage, type Frame } from "./code-stage";

const DEFAULT = [3, 1, 4, 1, 5, 9, 2, 6];
const L = 2, R = 5;   // the query the program answers at the end

const CODE = [
  "vector<long long> prefix(n + 1, 0);",
  "for (int i = 0; i < n; i++) {",
  "    prefix[i + 1] = prefix[i] + a[i];",
  "}",
  "",
  "// sum of a[l..r], inclusive",
  "long long sum = prefix[r + 1] - prefix[l];",
];

interface S {
  prefix: (number | null)[];
  /** index in `a` being read, and index in `prefix` being written */
  read: number | null;
  write: number | null;
  query: { l: number; r: number; sum: number } | null;
}

/** Run the program on `a` and record every line as it executes. */
function trace(a: number[]): Frame<S>[] {
  const n = a.length;
  const frames: Frame<S>[] = [];
  const prefix: (number | null)[] = Array(n + 1).fill(null);
  const snap = (): S["prefix"] => prefix.slice();
  const push = (line: number, extra: Partial<S>, note: React.ReactNode, vars?: Frame<S>["vars"]) =>
    frames.push({ line, state: { prefix: snap(), read: null, write: null, query: null, ...extra }, note, vars });

  prefix.fill(0);
  push(1, {}, <>Make room for <b>n + 1</b> cells, all zero. The extra cell is <Code>prefix[0]</Code>: the sum of nothing.</>, { n });
  for (let i = 0; i < n; i++) {
    push(2, { read: i }, <>Loop over <b>a</b>. This pass reads <Code>a[{i}]</Code>.</>, { n, i });
    prefix[i + 1] = (prefix[i] as number) + a[i];
    push(3, { read: i, write: i + 1 }, <><Code>prefix[{i + 1}]</Code> = <Code>prefix[{i}]</Code> + <Code>a[{i}]</Code> = {prefix[i]} + {a[i]} = <b>{prefix[i + 1]}</b>. One addition; the earlier cell already holds the running total.</>, { n, i, "prefix[i+1]": prefix[i + 1] as number });
  }
  push(2, {}, <><Code>i</Code> reached <Code>n</Code>; the loop ends. Every cell is filled, in one pass: <Code>O(n)</Code>.</>, { n, i: n });
  const sum = (prefix[R + 1] as number) - (prefix[L] as number);
  push(7, { query: { l: L, r: R, sum } }, <>Any range is now one subtraction. <Code>prefix[{R + 1}]</Code> holds everything up to and including <Code>a[{R}]</Code>; <Code>prefix[{L}]</Code> holds everything before <Code>a[{L}]</Code>. The difference is exactly <Code>a[{L}..{R}]</Code>.</>, { l: L, r: R, sum });
  return frames;
}

export function PrefixStage() {
  const [a, setA] = useState<number[]>(DEFAULT);
  const [key, setKey] = useState(0);            // bumps to remount the stage on new input
  const frames = useMemo(() => trace(a), [a]);
  const n = a.length;

  const fork = (next: number[]) => { setA(next); setKey((k) => k + 1); };
  const shuffle = () => fork(Array.from({ length: n }, () => Math.floor(Math.random() * 10)));
  const resize = (d: number) => {
    const m = Math.max(6, Math.min(10, n + d));
    fork(Array.from({ length: m }, (_, i) => a[i] ?? Math.floor(Math.random() * 10)));
  };

  return (
    <CodeStage<S>
      key={key}
      code={CODE}
      frames={frames}
      initial={{ prefix: Array(n + 1).fill(null), read: null, write: null, query: null }}
      speed={800}
      intro={<>The program on the left builds a prefix array, then answers one range query. Step through it with → and watch each line land on the right. Click a cell in <b>a</b> to change the input.</>}
      onReset={() => fork(DEFAULT)}
      controls={
        <>
          <span className="la-seg" role="group" aria-label="Array length">
            <button type="button" onClick={() => resize(-1)} disabled={n <= 6}>−</button>
            <button type="button" onClick={() => resize(1)} disabled={n >= 10}>+</button>
          </span>
          <button type="button" className="la-ctl" onClick={shuffle} aria-label="Random input" title="Random input">⇄</button>
        </>
      }
      render={(s) => <Picture a={a} s={s} onEdit={(i, v) => { const next = a.slice(); next[i] = v; fork(next); }} />}
    />
  );
}

function Picture({ a, s, onEdit }: { a: number[]; s: S; onEdit: (i: number, v: number) => void }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const aRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [box, setBox] = useState<{ a: DOMRect[]; p: DOMRect[]; origin: DOMRect } | null>(null);
  useLayoutEffect(() => {
    const measure = () => {
      const origin = sceneRef.current?.getBoundingClientRect();
      if (!origin) return;
      setBox({ origin, a: aRefs.current.slice(0, a.length).map((el) => el!.getBoundingClientRect()), p: pRefs.current.slice(0, a.length + 1).map((el) => el!.getBoundingClientRect()) });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [a.length, s.write, s.query]);
  const cx = (r: DOMRect) => r.left + r.width / 2 - (box?.origin.left ?? 0);
  const top = (r: DOMRect) => r.top - (box?.origin.top ?? 0);
  const bottom = (r: DOMRect) => r.bottom - (box?.origin.top ?? 0);

  const q = s.query;
  return (
    <div className="al-scene" ref={sceneRef}>
      <Cells
        label="a"
        values={a}
        onEdit={onEdit}
        cellRef={(i, el) => { aRefs.current[i] = el; }}
        marks={(i) => (q ? (i >= q.l && i <= q.r ? "al-cell-hi" : "al-cell-dim") : s.read === i ? "al-cell-src" : "")}
      />
      <Cells
        label="prefix"
        values={s.prefix}
        cellRef={(i, el) => { pRefs.current[i] = el; }}
        tone={(i) => (s.write === i ? "changed" : undefined)}
        marks={(i) => (q ? (i === q.l || i === q.r + 1 ? "al-cell-dst" : "al-cell-dim") : s.write === i ? "al-cell-dst" : s.write !== null && i === s.write - 1 ? "al-cell-src" : "")}
      />
      {box && s.write !== null && s.read !== null && (
        <svg className="al-arcs">
          {/* a[i] down into prefix[i+1] */}
          <path className="arc-src" d={`M ${cx(box.a[s.read])} ${bottom(box.a[s.read]) + 2} C ${cx(box.a[s.read])} ${(bottom(box.a[s.read]) + top(box.p[s.write])) / 2}, ${cx(box.p[s.write])} ${(bottom(box.a[s.read]) + top(box.p[s.write])) / 2}, ${cx(box.p[s.write])} ${top(box.p[s.write]) - 2}`} />
          {/* prefix[i] hopping over to prefix[i+1] */}
          <path className="arc-dst" d={`M ${cx(box.p[s.write - 1])} ${top(box.p[s.write - 1]) - 6} C ${cx(box.p[s.write - 1])} ${top(box.p[s.write - 1]) - 26}, ${cx(box.p[s.write])} ${top(box.p[s.write]) - 26}, ${cx(box.p[s.write])} ${top(box.p[s.write]) - 6}`} />
        </svg>
      )}
      {q && (
        <div className="al-formula">
          sum = prefix[{q.r + 1}] − prefix[{q.l}] = <span className="text-[var(--la-blue)]">{s.prefix[q.r + 1]}</span> − <span className="text-[var(--la-blue)]">{s.prefix[q.l]}</span> = <span className="text-[var(--la-green)]">{q.sum}</span>
        </div>
      )}
    </div>
  );
}
