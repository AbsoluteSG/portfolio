"use client";

import { useMemo, useState } from "react";
import { Code } from "./bits";
import { CodeStage, type Frame } from "./code-stage";

const CODE_MEMO = [
  "map<int, long long> cache;",
  "",
  "long long fib(int n) {",
  "    if (n <= 1) return n;",
  "    if (cache.count(n)) return cache[n];",
  "    long long v = fib(n - 1) + fib(n - 2);",
  "    cache[n] = v;",
  "    return v;",
  "}",
];
const CODE_PLAIN = [
  "",
  "",
  "long long fib(int n) {",
  "    if (n <= 1) return n;",
  "",
  "    long long v = fib(n - 1) + fib(n - 2);",
  "",
  "    return v;",
  "}",
];

interface Node { id: number; n: number; parent: number | null; depth: number; hit: boolean; value: number | null; }
interface S {
  nodes: Node[];          // every call made so far (values fill in as they return)
  active: number | null;  // call currently executing
  stack: number[];        // ids of calls on the stack, bottom → top
  cache: [number, number][];
  calls: number;
}

/** Execute fib(n) for real and record a frame at each line, exactly in the order a debugger would stop. */
function trace(n0: number, memo: boolean): Frame<S>[] {
  const frames: Frame<S>[] = [];
  const nodes: Node[] = [];
  const stack: number[] = [];
  const cache = new Map<number, number>();
  const snap = (active: number | null): S => ({
    nodes: nodes.map((x) => ({ ...x })), active, stack: stack.slice(), cache: [...cache.entries()].sort((a, b) => a[0] - b[0]), calls: nodes.length,
  });
  const push = (line: number, active: number | null, note: React.ReactNode, vars?: Frame<S>["vars"]) => frames.push({ line, state: snap(active), note, vars });
  const seenTimes = (k: number) => nodes.filter((x) => x.n === k).length;

  const fib = (n: number, parent: number | null, depth: number): number => {
    const id = nodes.length;
    nodes.push({ id, n, parent, depth, hit: false, value: null });
    stack.push(id);
    const nth = seenTimes(n);
    push(3, id, nth > 1 ? <>Enter <Code>fib({n})</Code>, for the <b>{ordinal(nth)}</b> time. {memo ? "" : "Nothing remembers the earlier answer, so it starts over."}</> : <>Enter <Code>fib({n})</Code>.</>, { n, depth });
    if (n <= 1) {
      nodes[id].value = n;
      push(4, id, <><Code>n</Code> is {n}: a base case. Return {n} without recursing.</>, { n, "return": n });
      stack.pop();
      return n;
    }
    push(4, id, <>{n} is not a base case, keep going.</>, { n });
    if (memo) {
      if (cache.has(n)) {
        const v = cache.get(n)!;
        nodes[id].hit = true; nodes[id].value = v;
        push(5, id, <><Code>fib({n})</Code> is <b>already in the cache</b>. Return {v} immediately; the whole subtree that would have grown here never happens.</>, { n, "return": v });
        stack.pop();
        return v;
      }
      push(5, id, <>Not in the cache yet. Compute it the normal way.</>, { n });
    }
    push(6, id, <>Recurse on the left: call <Code>fib({n - 1})</Code>.</>, { n });
    const a = fib(n - 1, id, depth + 1);
    push(6, id, <>Back in <Code>fib({n})</Code> with <Code>fib({n - 1})</Code> = {a}. Now the right: call <Code>fib({n - 2})</Code>.</>, { n, "fib(n-1)": a });
    const b = fib(n - 2, id, depth + 1);
    const v = a + b;
    nodes[id].value = v;
    push(6, id, <>Both halves are back: {a} + {b} = <b>{v}</b>.</>, { n, "fib(n-1)": a, "fib(n-2)": b, v });
    if (memo) {
      cache.set(n, v);
      push(7, id, <>Write it down: <Code>cache[{n}] = {v}</Code>. Any later call for {n} will find it on line 5.</>, { n, v });
    }
    push(8, id, <>Return {v}.</>, { n, "return": v });
    stack.pop();
    return v;
  };
  fib(n0, null, 0);
  const total = nodes.length;
  frames[frames.length - 1].note = memo
    ? <>Done: <Code>fib({n0})</Code> = {nodes[0].value} in <b>{total}</b> calls. Each distinct input was computed once; the tree collapsed to a line.</>
    : <>Done: <Code>fib({n0})</Code> = {nodes[0].value} in <b>{total}</b> calls. The same small inputs were recomputed over and over. Turn memoization on and run it again.</>;
  return frames;
}

/** Tidy tree layout over the *final* set of calls, so positions don't jump as calls appear. */
function layout(nodes: Node[]) {
  const children = new Map<number, number[]>();
  nodes.forEach((c) => { if (c.parent !== null) children.set(c.parent, [...(children.get(c.parent) ?? []), c.id]); });
  const x = new Map<number, number>();
  let next = 0;
  const place = (id: number): number => {
    const kids = children.get(id) ?? [];
    if (kids.length === 0) { x.set(id, next++); return next - 1; }
    const xs = kids.map(place);
    const mid = (xs[0] + xs[xs.length - 1]) / 2;
    x.set(id, mid);
    return mid;
  };
  place(0);
  return { x, width: next };
}

const N_OPTIONS = [4, 5, 6, 7];

export function MemoStage() {
  const [n, setN] = useState(6);
  const [memo, setMemo] = useState(false);
  const [key, setKey] = useState(0);
  const frames = useMemo(() => trace(n, memo), [n, memo]);
  const plain = useMemo(() => trace(n, false).length && trace(n, false)[trace(n, false).length - 1].state.calls, [n]);
  const final = frames[frames.length - 1].state.nodes;
  const { x, width } = useMemo(() => layout(final), [final]);
  const restart = (nn: number, mm: boolean) => { setN(nn); setMemo(mm); setKey((k) => k + 1); };

  const depth = Math.max(...final.map((c) => c.depth));
  const W = Math.max(480, width * 46 + 40), H = (depth + 1) * 62 + 36;
  const px = (id: number) => 20 + (x.get(id)! + 0.5) * ((W - 40) / Math.max(width, 1));
  const py = (c: Node) => 30 + c.depth * 62;

  return (
    <CodeStage<S>
      key={key}
      code={memo ? CODE_MEMO : CODE_PLAIN}
      frames={frames}
      initial={{ nodes: [], active: null, stack: [], cache: [], calls: 0 }}
      speed={memo ? 800 : 520}
      intro={memo
        ? <>Same function, three extra lines: a <Code>cache</Code>, a lookup before recursing, a store after. Step through and watch the tree on the right stop growing.</>
        : <>The plain recursive <Code>fib</Code>. Every call is a circle; the tree grows as the program runs. Count how many times <Code>fib(2)</Code> gets called.</>}
      onReset={() => restart(n, memo)}
      controls={
        <>
          <label className="al-toggle">
            <input type="checkbox" checked={memo} onChange={(e) => restart(n, e.target.checked)} /> memoize
          </label>
          <div className="al-picks">
            <span className="al-picks-label">fib of</span>
            {N_OPTIONS.map((k) => (
              <button key={k} type="button" className="la-chipbtn" aria-pressed={k === n} onClick={() => restart(k, memo)}>{k}</button>
            ))}
          </div>
        </>
      }
      render={(s) => (
        <div className="al-memo">
          <svg className="al-tree" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Call tree for fib(${n})`}>
            {final.map((c) => c.parent !== null && (
              <line key={`e${c.id}`} x1={px(c.parent)} y1={py(final[c.parent]) + 18} x2={px(c.id)} y2={py(c) - 18}
                className={s.nodes[c.id]?.hit ? "edge edge-skip" : "edge"} style={{ opacity: c.id < s.nodes.length ? undefined : 0.1 }} />
            ))}
            {final.map((c) => {
              const live = s.nodes[c.id];
              const made = !!live;
              const cls = !made ? "node node-future" : live.hit ? "node node-hit" : s.active === c.id ? "node node-active" : live.value !== null ? "node node-done" : "node node-active";
              return (
                <g key={c.id} transform={`translate(${px(c.id)} ${py(c)})`}>
                  <circle r={18} className={cls} />
                  <text className={made && live.hit ? "lbl-hit" : ""} y={made && live.value !== null && !live.hit ? -3 : 0}>{c.n}</text>
                  {made && live.value !== null && !live.hit && <text className="lbl-val" y={9}>= {live.value}</text>}
                  {made && live.hit && <text className="lbl-val lbl-hit" y={30}>cached</text>}
                </g>
              );
            })}
          </svg>
          <div className="al-memo-side">
            <div className="al-tally">
              <span><b>{s.calls}</b>calls so far</span>
              <span><b>{plain}</b>total, no memo</span>
            </div>
            <div>
              <div className="al-stack-title">call stack</div>
              <div className="al-stack">
                {s.stack.length === 0 ? <div className="al-stack-frame">empty</div> : s.stack.map((id) => <div key={id} className="al-stack-frame">fib({s.nodes[id].n})</div>)}
              </div>
            </div>
            {memo && (
              <div className="al-memo-cache">
                <div className="al-memo-cache-title">cache</div>
                {s.cache.length === 0 && <div className="al-memo-row"><span className="la-mono">empty</span></div>}
                {s.cache.map(([k, v]) => <div key={k} className="al-memo-row"><span>fib({k})</span><span>{v}</span></div>)}
              </div>
            )}
          </div>
        </div>
      )}
    />
  );
}

const ordinal = (k: number) => k === 1 ? "first" : k === 2 ? "second" : k === 3 ? "third" : `${k}th`;
