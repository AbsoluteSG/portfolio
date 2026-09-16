/**
 * Concept UI for three mechanics that aren't in the shipped build yet.
 *
 * The panels are built from markup rather than screenshots: they stay sharp at
 * any size, reflow on phones, and can be edited as the designs change. Each one
 * is a <figure> whose chrome is hidden from assistive tech — the numbers inside
 * are set dressing, so the caption and the prose beside it carry the meaning.
 */

import { TIERS, type Tier } from "./tiers";

type ElementKind = "solar" | "tidal" | "ember" | "void";

const ELEMENTS: Record<ElementKind, { name: string; fill: string; ink: string }> = {
  solar: { name: "Solar", fill: "var(--bc-yellow)", ink: "var(--bc-ink)" },
  tidal: { name: "Tidal", fill: "var(--bc-sky)", ink: "var(--bc-ink)" },
  ember: { name: "Ember", fill: "var(--bc-coral)", ink: "var(--bc-white)" },
  void: { name: "Void", fill: "var(--bc-grape)", ink: "var(--bc-white)" },
};

function Glyph({ element }: { element: ElementKind }) {
  const common = { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true } as const;
  switch (element) {
    case "solar":
      return (
        <svg {...common} className="h-1/2 w-1/2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v3.5M12 19.5V23M1 12h3.5M19.5 12H23M4.2 4.2l2.5 2.5M17.3 17.3l2.5 2.5M19.8 4.2l-2.5 2.5M6.7 17.3l-2.5 2.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    case "tidal":
      return (
        <svg {...common} className="h-1/2 w-1/2" fill="none">
          <path d="M2 9c3.3-4 6.7-4 10 0s6.7 4 10 0M2 16c3.3-4 6.7-4 10 0s6.7 4 10 0" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      );
    case "ember":
      return (
        <svg {...common} className="h-1/2 w-1/2">
          <path d="M12 1.5c.6 4-2.1 5.3-4 8a7.6 7.6 0 1 0 12.2 1.9c-.5 1.4-1.6 2.3-2.8 2.3 1-3.9-1.6-9.4-5.4-12.2z" />
        </svg>
      );
    case "void":
      return (
        <svg {...common} className="h-1/2 w-1/2">
          <path d="M12 1.5 21 12l-9 10.5L3 12z" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------ */
/* 1 — Resonance Lab                                                   */
/* ------------------------------------------------------------------ */

type Node = { element?: ElementKind; locked?: boolean; right?: boolean; down?: boolean };

// A 5x5 board, indexed row-major. Two chains are live: a Solar run across row 1
// and a Tidal elbow down the left, plus two stranded artifacts for contrast.
const BOARD: Record<number, Node> = {
  0: { locked: true },
  4: { element: "ember" },
  6: { element: "solar", right: true },
  7: { element: "solar", right: true },
  8: { element: "solar" },
  10: { element: "tidal", down: true },
  15: { element: "tidal", right: true },
  16: { element: "tidal", right: true },
  17: { element: "tidal" },
  21: { element: "void" },
  24: { locked: true },
};

const CHAINS = [
  { element: "solar" as ElementKind, length: 3, effect: "+180% click power" },
  { element: "tidal" as ElementKind, length: 4, effect: "+240% idle rate" },
];

function ResonanceLab() {
  return (
    <div className="bc-window" aria-hidden>
      <div className="bc-window-bar">
        <span className="bc-window-title text-lg">Resonance Lab</span>
        <span className="bc-num rounded-md bg-[var(--bc-yellow)] px-2 py-0.5 text-xs font-extrabold text-[var(--bc-ink)]">
          GRID 5 × 5
        </span>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] sm:p-5">
        {/* The board */}
        <div className="grid aspect-square grid-cols-5 grid-rows-5 gap-2">
          {Array.from({ length: 25 }, (_, i) => {
            const node = BOARD[i];
            const el = node?.element ? ELEMENTS[node.element] : null;
            return (
              <div
                key={i}
                className="bc-slot flex items-center justify-center"
                style={{
                  background: el ? el.fill : node?.locked ? "var(--bc-navy-deep)" : "var(--bc-white)",
                  color: el ? el.ink : "var(--bc-white)",
                }}
              >
                {node?.element && <Glyph element={node.element} />}
                {node?.locked && (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-1/2 w-1/2 opacity-40" aria-hidden>
                    <path d="M7 10V7a5 5 0 0 1 10 0v3h1.5v11h-13V10zm2.5 0h5V7a2.5 2.5 0 0 0-5 0z" />
                  </svg>
                )}
                {/* Chain links bridge the 8px grid gap, so they read as wiring. */}
                {node?.right && (
                  <span
                    className="absolute top-1/2 -right-2 z-10 h-[14px] w-2 -translate-y-1/2 border-y-[3px] border-[var(--bc-ink)]"
                    style={{ background: el?.fill }}
                  />
                )}
                {node?.down && (
                  <span
                    className="absolute -bottom-2 left-1/2 z-10 h-2 w-[14px] -translate-x-1/2 border-x-[3px] border-[var(--bc-ink)]"
                    style={{ background: el?.fill }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Readouts */}
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-navy-deep)] px-3 py-3">
            <div className="text-[0.65rem] font-extrabold tracking-[0.16em] text-white/55 uppercase">
              Total resonance
            </div>
            <div className="bc-display bc-num mt-1 text-3xl text-[var(--bc-yellow)]">×4.2</div>
          </div>

          <ul className="flex flex-col gap-2">
            {CHAINS.map((c) => (
              <li
                key={c.element}
                className="rounded-xl border-[3px] border-[var(--bc-ink)] bg-white/10 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="bc-display text-sm" style={{ color: ELEMENTS[c.element].fill }}>
                    {ELEMENTS[c.element].name} chain
                  </span>
                  <span className="bc-num bc-display text-sm text-white">×{c.length}</span>
                </div>
                <div className="mt-0.5 text-xs font-bold text-white/70">{c.effect}</div>
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <div className="flex items-end justify-between">
              <span className="text-[0.65rem] font-extrabold tracking-[0.16em] text-white/55 uppercase">
                Stability
              </span>
              <span className="bc-num text-xs font-extrabold text-[var(--bc-coral-light)]">62%</span>
            </div>
            <div className="bc-meter mt-1 h-3.5">
              <span style={{ width: "62%", background: "var(--bc-coral)" }} />
            </div>
            <p className="mt-1.5 text-[0.7rem] font-bold text-white/50">Board overloads at 100%.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2 — Faction War                                                     */
/* ------------------------------------------------------------------ */

const GROVE = 58;

const TRACK = [
  { at: "2K", state: "claimed" as const },
  { at: "8K", state: "claimed" as const },
  { at: "20K", state: "claimed" as const },
  { at: "45K", state: "next" as const },
  { at: "100K", state: "locked" as const },
];

function FactionWar() {
  return (
    <div className="bc-window" aria-hidden>
      <div className="bc-window-bar">
        <span className="bc-window-title text-lg">Faction War</span>
        <span className="bc-num rounded-md bg-[var(--bc-coral)] px-2 py-0.5 text-xs font-extrabold text-white">
          ENDS 2D 14H
        </span>
      </div>

      <div className="p-4 sm:p-5">
        {/* The two sides */}
        <div className="flex items-stretch justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-sky)] text-[var(--bc-ink)]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
                <path d="M12 2c4 3.2 6.5 6.6 6.5 10.3A6.5 6.5 0 0 1 12 19a6.5 6.5 0 0 1-6.5-6.7C5.5 8.6 8 5.2 12 2zm0 4.6c-2 2-3.2 4-3.2 5.9a3.2 3.2 0 0 0 6.4 0c0-1.9-1.2-3.9-3.2-5.9z" />
              </svg>
            </span>
            <div>
              <div className="bc-display text-sm text-[var(--bc-sky)]">Grovekeepers</div>
              <div className="bc-num text-xs font-extrabold text-white/60">{GROVE}%</div>
            </div>
          </div>

          <div className="flex flex-row-reverse items-center gap-2.5 text-right">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-coral)] text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
                <path d="M12 1.6 3 6v6.4C3 17.6 6.8 21.6 12 22.4c5.2-.8 9-4.8 9-10V6zm0 4.6 5 2.4v3.8c0 3-2.1 5.6-5 6.3-2.9-.7-5-3.3-5-6.3V8.6z" />
              </svg>
            </span>
            <div>
              <div className="bc-display text-sm text-[var(--bc-coral-light)]">Banana Syndicate</div>
              <div className="bc-num text-xs font-extrabold text-white/60">{100 - GROVE}%</div>
            </div>
          </div>
        </div>

        {/* Tug of war */}
        <div className="relative mt-3">
          <div className="flex h-7 overflow-hidden rounded-full border-[3px] border-[var(--bc-ink)]">
            <span className="bg-[var(--bc-sky)]" style={{ width: `${GROVE}%` }} />
            <span className="flex-1 bg-[var(--bc-coral)]" />
          </div>
          {/* Where the line would sit at a dead heat. */}
          <span className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-[var(--bc-ink)]/45" />
          <span
            className="absolute -top-1.5 -bottom-1.5 w-[5px] -translate-x-1/2 rounded-full border-[3px] border-[var(--bc-ink)] bg-[var(--bc-yellow)]"
            style={{ left: `${GROVE}%` }}
          />
        </div>

        {/* Your standing */}
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-navy-deep)] px-3 py-2.5">
            <div className="text-[0.65rem] font-extrabold tracking-[0.16em] text-white/55 uppercase">
              You contributed
            </div>
            <div className="bc-display bc-num mt-0.5 text-2xl text-white">31.4K</div>
          </div>
          <div className="rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-navy-deep)] px-3 py-2.5">
            <div className="text-[0.65rem] font-extrabold tracking-[0.16em] text-white/55 uppercase">
              Rank 4
            </div>
            <div className="bc-display mt-0.5 text-2xl text-[var(--bc-sky)]">Grove Warden</div>
          </div>
        </div>

        {/* Reward track */}
        <div className="mt-4">
          <div className="text-[0.65rem] font-extrabold tracking-[0.16em] text-white/55 uppercase">
            War track
          </div>
          <div className="relative mt-2.5">
            <span className="absolute top-4 right-4 left-4 h-[3px] bg-white/20" />
            <ol className="relative flex justify-between">
              {TRACK.map((n) => (
                <li key={n.at} className="flex flex-col items-center gap-1">
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full border-[3px] border-[var(--bc-ink)] ${
                      n.state === "claimed"
                        ? "bg-[var(--bc-yellow)] text-[var(--bc-ink)]"
                        : n.state === "next"
                          ? "bg-white text-[var(--bc-ink)]"
                          : "bg-[var(--bc-navy-deep)] text-white/40"
                    }`}
                  >
                    {n.state === "claimed" ? (
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                        <path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : n.state === "next" ? (
                      <span className="bc-display text-xs">!</span>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
                        <path d="M7 10V7a5 5 0 0 1 10 0v3h1.5v11h-13V10zm2.5 0h5V7a2.5 2.5 0 0 0-5 0z" />
                      </svg>
                    )}
                  </span>
                  <span className="bc-num text-[0.7rem] font-extrabold text-white/60">{n.at}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3 — Contract Board                                                  */
/* ------------------------------------------------------------------ */

const CONTRACTS: { tier: Tier; title: string; objective: string; have: number; need: number; reward: string }[] = [
  {
    tier: "rare",
    title: "Peel Pressure",
    objective: "Land 500 clicks inside one Banana Storm",
    have: 341,
    need: 500,
    reward: "3× Dealer tokens",
  },
  {
    tier: "epic",
    title: "Sliced & Diced",
    objective: "Prestige twice without buying an upgrade",
    have: 1,
    need: 2,
    reward: "1× Epic artifact",
  },
  {
    tier: "legendary",
    title: "Breakfast of Champions",
    objective: "Bank 40 quadrillion bananas before the reset",
    have: 11,
    need: 40,
    reward: "1× Guaranteed pull",
  },
];

function ContractBoard() {
  return (
    <div className="bc-window" aria-hidden>
      <div className="bc-window-bar">
        <span className="bc-window-title text-lg">The Dealer&apos;s Contracts</span>
        <span className="bc-num rounded-md bg-[var(--bc-yellow)] px-2 py-0.5 text-xs font-extrabold text-[var(--bc-ink)]">
          RESETS 06:41:22
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <ul className="grid gap-3">
          {CONTRACTS.map((c) => {
            const pct = Math.round((c.have / c.need) * 100);
            const t = TIERS[c.tier];
            return (
              <li
                key={c.title}
                className="rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-navy-deep)] p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="bc-stamp" style={{ color: t.onDark }}>
                      {t.name}
                    </span>
                    <div className="bc-display mt-1.5 text-base text-white">{c.title}</div>
                    <p className="text-xs font-bold text-white/60">{c.objective}</p>
                  </div>
                  <span
                    className="shrink-0 rounded-lg border-[3px] border-[var(--bc-ink)] px-2 py-1 text-center text-[0.7rem] font-extrabold"
                    style={{ background: t.fill, color: t.ink }}
                  >
                    {c.reward}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center gap-2.5">
                  <div className="bc-meter h-3 flex-1">
                    <span style={{ width: `${pct}%`, background: t.fill }} />
                  </div>
                  <span className="bc-num w-16 shrink-0 text-right text-[0.7rem] font-extrabold text-white/70">
                    {c.have} / {c.need}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-lg border-[3px] border-[var(--bc-ink)] bg-white px-3 py-1.5 text-sm font-extrabold text-[var(--bc-ink)]">
            Reroll <span className="bc-num opacity-60">1 / 3</span>
          </span>
          <span className="bc-display bc-num text-lg text-[var(--bc-yellow)]">Streak ×1.8</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const MECHANICS = [
  {
    kicker: "Fruit Resonance",
    title: "Wire the lab. Chain the fruit.",
    body:
      "The labs were studying Resonance long before you broke into one. Slot artifacts into the grid and matching elements chain through each other — the longer the run, the harder it hits. Push the stability meter too far and the whole board overloads, which is either a disaster or a strategy, depending on how the run is going.",
    caption: "Concept: the Resonance grid, with a three-long Solar chain and a four-long Tidal chain live.",
    panel: <ResonanceLab />,
  },
  {
    kicker: "Grovekeepers vs. Syndicate",
    title: "Pick a side. Hold the line.",
    body:
      "Every banana you bank counts toward a server-wide tug of war that resets every week. Win and your whole faction carries the buff for seven days; lose and you get to hear about it from the Dealer. Rank up to open the war track and the cosmetics nobody on the other side can buy.",
    caption: "Concept: the weekly war meter, your standing, and the five-node reward track.",
    panel: <FactionWar />,
  },
  {
    kicker: "The Dealer's contracts",
    title: "Three jobs a day. No questions.",
    body:
      "The Dealer posts three contracts every morning and refuses to explain where they come from. Clear all three and your streak multiplier rides into tomorrow's gacha pulls. You get one reroll a day, so spend it wisely on the one asking for forty quadrillion bananas before breakfast.",
    caption: "Concept: the daily contract board, with tiered rewards and a single reroll.",
    panel: <ContractBoard />,
  },
];

export default function Mechanics() {
  return (
    <section
      id="in-the-works"
      className="bc-dots bc-cut-bottom-alt relative -mt-[4.5vw] bg-[var(--bc-cream)] pt-[9vw] pb-[9vw] text-[var(--bc-ink)]"
    >
      <div className="mx-auto max-w-6xl px-6">
        <span className="bc-chip">
          <span>In the works</span>
        </span>
        <h2 className="bc-display mt-5 text-[clamp(2.2rem,5.5vw,4.25rem)]">
          Three mechanics in the oven.
        </h2>
        <p className="mt-5 max-w-2xl text-lg font-semibold text-[var(--bc-ink)]/80">
          Design work for the next stretch of patches. The panels below are mockups, not the
          shipped build — they exist to pin down layout and hierarchy before any of it gets
          written in C#.
        </p>

        <div className="mt-14 flex flex-col gap-16 md:gap-24">
          {MECHANICS.map((m, i) => (
            <figure
              key={m.kicker}
              className={`grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14 ${
                i % 2 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>{m.panel}</div>
              <div>
                <span className="bc-chip !bg-[var(--bc-navy)]">
                  <span>{m.kicker}</span>
                </span>
                <h3 className="bc-display mt-4 text-[clamp(1.8rem,3.8vw,2.75rem)]">{m.title}</h3>
                <p className="mt-4 max-w-prose text-lg font-semibold leading-relaxed text-[var(--bc-ink)]/80">
                  {m.body}
                </p>
                <figcaption className="mt-5 border-l-4 border-[var(--bc-ink)]/25 pl-3 text-sm font-bold text-[var(--bc-ink)]/55">
                  {m.caption}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
