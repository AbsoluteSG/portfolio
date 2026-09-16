/**
 * Concept UI for three screens that sit around the core loop: the on-screen
 * objective tracker, the offline-earnings return, and the per-NPC mission board.
 *
 * The mission board is modelled on the game's real DailyMissionService — six
 * slots a day from a pool, each a staged chain (`CurrentStageIndex` of
 * `Stages`), each stage paying `CosmicReward`, with an optional per-day cosmic
 * cap and a UTC rollover. Mission types come from `DailyMissionType`.
 */

import Image from "next/image";
import { A, CURRENCY } from "./catalog";
import { Label, Sprite, WindowBar } from "./panel";
import { ULTIMATE_SHEEN } from "./tiers";

const SLICE = (n: string) => `${A}/slices/${n}.webp`;

/* ------------------------------------------------------------------ */
/* 1 — On-screen objectives                                            */
/* ------------------------------------------------------------------ */

const TRACKED = [
  { art: CURRENCY, label: "Harvest 250K bananas", have: 182, need: 250, unit: "K", reward: 4, done: false },
  { art: `${A}/items/astro-helm.webp`, label: "Pull 3 times on any banner", have: 3, need: 3, unit: "", reward: 6, done: true },
  { art: `${A}/items/lucky-sock.webp`, label: "Recycle 5 pieces of gear", have: 1, need: 5, unit: "", reward: 3, done: false },
];

function Objectives() {
  return (
    <div className="bc-window" aria-hidden>
      <WindowBar title="On-screen objectives" tag="HUD" tagFill="var(--bc-sky)" />

      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/9]">
        <Image
          src={`${A}/ss3.jpg`}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover object-center"
        />

        {/* Top-right, away from the banana. The clicker is the one thing the
            HUD must never cover. */}
        <div className="absolute top-2 right-2 w-[min(72%,17rem)] sm:top-3 sm:right-3">
          <div className="overflow-hidden rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-ink)]/85 backdrop-blur">
            <div className="flex items-center justify-between gap-2 border-b-2 border-white/10 px-2.5 py-1.5">
              <span className="bc-display text-xs text-white">Today</span>
              <span className="flex items-center gap-1.5">
                <span className="bc-num text-[0.6rem] font-extrabold text-white/55">2 / 6</span>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3 text-white/45" aria-hidden>
                  <path d="M12 16 5 8h14z" />
                </svg>
              </span>
            </div>

            <ul className="grid gap-1.5 p-2">
              {TRACKED.map((t) => (
                <li key={t.label} className={t.done ? "opacity-70" : ""}>
                  <div className="flex items-center gap-1.5">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded border-2 border-[var(--bc-ink)] bg-white">
                      <Sprite src={t.art} className="h-[74%] w-[74%]" />
                    </span>
                    <span
                      className={`min-w-0 flex-1 truncate text-[0.65rem] font-extrabold ${
                        t.done ? "text-white/50 line-through" : "text-white"
                      }`}
                    >
                      {t.label}
                    </span>
                    {/* Reward sits on the row: no reason to make anyone open a menu. */}
                    <span className="bc-num flex shrink-0 items-center gap-0.5 rounded bg-[var(--bc-grape)] px-1 text-[0.55rem] font-extrabold text-white">
                      +{t.reward}
                      <Image
                        src={SLICE("banana-cosmic")}
                        alt=""
                        width={64}
                        height={64}
                        className="h-2.5 w-2.5 object-contain"
                      />
                    </span>
                  </div>
                  {!t.done && (
                    <div className="mt-1 flex items-center gap-1.5 pl-6.5">
                      <div className="bc-meter bc-meter-dark bc-meter-thin h-1.5 flex-1">
                        <span
                          style={{ width: `${(t.have / t.need) * 100}%`, background: "var(--bc-yellow)" }}
                        />
                      </div>
                      <span className="bc-num shrink-0 text-[0.55rem] font-extrabold text-white/55">
                        {t.have}
                        {t.unit} / {t.need}
                        {t.unit}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* A completion says so where your eyes already are, then leaves. */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full border-[3px] border-[var(--bc-ink)] bg-[var(--bc-leaf)] px-3 py-1.5 shadow-[4px_5px_0_var(--bc-ink)]">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-[var(--bc-ink)]" aria-hidden>
              <path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="bc-display text-xs text-[var(--bc-ink)] sm:text-sm">Banner pull — done</span>
            <span className="bc-num flex items-center gap-0.5 rounded bg-[var(--bc-ink)] px-1.5 text-[0.65rem] font-extrabold text-white">
              +6
              <Image src={SLICE("banana-cosmic")} alt="" width={64} height={64} className="h-3 w-3 object-contain" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2 — Offline earnings                                                */
/* ------------------------------------------------------------------ */

const BREAKDOWN = [
  { art: `${A}/upgrades/idle-banana-tree.webp`, label: "Banana groves", value: "1.42B" },
  { art: `${A}/upgrades/idle-bank.webp`, label: "The Reserve", value: "612M" },
  { art: `${A}/upgrades/idle-monkey.webp`, label: "Hired chimps", value: "198M" },
];

function Offline() {
  return (
    <div className="bc-window" aria-hidden>
      <WindowBar title="While you were out" tag="7H 12M" tagFill="var(--bc-sky)" />

      <div className="relative overflow-hidden">
        <Image
          src={`${A}/ss2.jpg`}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="scale-105 object-cover object-center blur-[3px]"
        />
        <div aria-hidden className="absolute inset-0 bg-[var(--bc-navy-deep)]/85" />

        <div className="relative p-4 sm:p-6">
          <div className="mx-auto max-w-md rounded-2xl border-4 border-[var(--bc-ink)] bg-[var(--bc-navy)] p-4 shadow-[8px_9px_0_var(--bc-ink)]">
            <div className="text-center">
              <Label>You were away</Label>
              <div className="bc-display bc-num mt-0.5 text-2xl text-white">7h 12m</div>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border-[3px] border-[var(--bc-ink)] bg-[#f4f1e8] px-3 py-3">
              <Sprite src={CURRENCY} className="h-9 w-9" />
              <span className="bc-display bc-num text-3xl text-[var(--bc-ink)] sm:text-4xl">2.23B</span>
            </div>

            <ul className="mt-3 grid gap-1.5">
              {BREAKDOWN.map((b) => (
                <li key={b.label} className="flex items-center gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border-2 border-[var(--bc-ink)] bg-white">
                    <Sprite src={b.art} className="h-[76%] w-[76%]" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs font-bold text-white/70">{b.label}</span>
                  <span className="bc-num shrink-0 text-xs font-extrabold text-white">{b.value}</span>
                </li>
              ))}
            </ul>

            {/* The two things an offline screen usually hides. */}
            <div className="mt-3 rounded-lg bg-white/10 px-2.5 py-2 text-[0.65rem] font-bold text-white/65">
              Offline pays <span className="bc-num text-white">40%</span> of your{" "}
              <span className="bc-num text-white">281K/s</span>, and banks at most{" "}
              <span className="bc-num text-white">8h</span> — you hit the cap
              <span className="bc-num text-[var(--bc-coral-light)]"> 4h ago</span>.
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr]">
              <span className="rounded-lg border-[3px] border-[var(--bc-ink)] bg-white/10 px-3 py-2 text-center text-sm font-extrabold text-white">
                Collect
              </span>
              <span
                className="rounded-lg border-[3px] border-[var(--bc-ink)] px-3 py-2 text-center text-[var(--bc-ink)]"
                style={{ background: ULTIMATE_SHEEN }}
              >
                <span className="bc-display block text-sm">Collect ×2</span>
                <span className="bc-num block text-[0.6rem] font-extrabold opacity-75">4.46B</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3 — NPC missions                                                    */
/* ------------------------------------------------------------------ */

const NPCS = [
  { slug: "chad", name: "Beach Bum Chad", primary: "var(--bc-sky)", ink: "var(--bc-ink)", active: true },
  { slug: "granny", name: "Granny Peel", primary: "var(--bc-leaf)", ink: "var(--bc-ink)" },
  { slug: "rindlock", name: "Capt. Rindlock", primary: "var(--bc-coral)", ink: "var(--bc-white)" },
];

/** Six slots a day, each a staged chain — the shape DailyMissionService saves. */
const MISSIONS = [
  { type: "HARVEST", label: "Harvest 250K bananas", stage: 2, of: 4, have: 182, need: 250, reward: 4, done: false },
  { type: "BANNER_PULL", label: "Pull 3 times on the Astro Drop", stage: 1, of: 3, have: 3, need: 3, reward: 6, done: true },
  { type: "GEAR_RECYCLE", label: "Recycle 5 pieces of gear", stage: 1, of: 3, have: 1, need: 5, reward: 3, done: false },
  { type: "COSMIC_EARNED", label: "Earn 20 Cosmic today", stage: 3, of: 5, have: 14, need: 20, reward: 5, done: false },
  { type: "PERSISTENT_STAT", label: "Reach 24% crit chance", stage: 1, of: 2, have: 24, need: 24, reward: 8, done: true },
  { type: "LOGIN", label: "Open the game", stage: 1, of: 1, have: 1, need: 1, reward: 2, done: true },
];

function Missions() {
  return (
    <div className="bc-window" aria-hidden>
      <WindowBar title="Missions" tag="RESETS 06:41 UTC" />

      <div className="p-4 sm:p-5">
        {/* Character switcher: the shipped MissionView already themes itself
            from each character's primary colour. */}
        <ul className="flex flex-wrap gap-2">
          {NPCS.map((n) => (
            <li
              key={n.slug}
              className={`flex items-center gap-1.5 rounded-lg border-[3px] border-[var(--bc-ink)] py-1 pr-2.5 pl-1 ${
                n.active ? "" : "opacity-60"
              }`}
              style={{ background: n.active ? n.primary : "rgba(255,255,255,0.08)" }}
            >
              <span className="grid h-7 w-7 place-items-center overflow-hidden rounded-md border-2 border-[var(--bc-ink)] bg-white">
                <Image
                  src={`${A}/cast/${n.slug}.webp`}
                  alt=""
                  width={420}
                  height={420}
                  className="h-[88%] w-[88%] object-contain"
                />
              </span>
              <span
                className="bc-display text-xs"
                style={{ color: n.active ? n.ink : "rgba(255,255,255,0.75)" }}
              >
                {n.name}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]">
          <div className="rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-sky)] p-3">
            <Image
              src={`${A}/cast/chad.webp`}
              alt=""
              width={420}
              height={387}
              sizes="(max-width: 768px) 60vw, 13rem"
              className="mx-auto h-28 w-auto object-contain drop-shadow-[4px_5px_0_rgba(0,0,0,0.25)]"
            />
            <div className="bc-display mt-1.5 text-center text-sm text-[var(--bc-ink)]">Beach Bum Chad</div>
            <div className="mt-2.5 rounded-lg border-2 border-[var(--bc-ink)] bg-[var(--bc-ink)]/85 px-2.5 py-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[0.6rem] font-extrabold tracking-wider text-white/55 uppercase">
                  Cosmic today
                </span>
                <span className="bc-num text-xs font-extrabold text-white">38 / 50</span>
              </div>
              <div className="bc-meter bc-meter-dark bc-meter-thin mt-1 h-2">
                <span style={{ width: "76%", background: "var(--bc-grape-light)" }} />
              </div>
              {/* The cap is real and in the service; a player should know it exists. */}
              <p className="mt-1 text-[0.6rem] font-bold text-white/50">Daily cap — resets at rollover.</p>
            </div>
          </div>

          <ul className="grid gap-2">
            {MISSIONS.map((m) => {
              const pct = Math.min(100, Math.round((m.have / m.need) * 100));
              return (
                <li
                  key={m.label}
                  className={`flex items-center gap-2.5 rounded-xl border-[3px] border-[var(--bc-ink)] p-2.5 ${
                    m.done ? "bg-[var(--bc-leaf)]/15" : "bg-[var(--bc-navy-deep)]"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      {/* Stage chips make a chain legible: this is 2 of 4, not "a mission". */}
                      <span className="bc-num rounded border-2 border-[var(--bc-ink)] bg-white/10 px-1 text-[0.55rem] font-extrabold text-white/70">
                        Stage {m.stage}/{m.of}
                      </span>
                      <span className={`text-xs font-extrabold ${m.done ? "text-white/55" : "text-white"}`}>
                        {m.label}
                      </span>
                    </div>
                    {!m.done && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="bc-meter bc-meter-dark bc-meter-thin h-1.5 flex-1">
                          <span style={{ width: `${pct}%`, background: "var(--bc-sky)" }} />
                        </div>
                        <span className="bc-num w-16 shrink-0 text-right text-[0.6rem] font-extrabold text-white/55">
                          {m.have} / {m.need}
                        </span>
                      </div>
                    )}
                  </div>

                  <span
                    className={`bc-num flex shrink-0 items-center gap-1 rounded-lg border-[3px] border-[var(--bc-ink)] px-2 py-1 text-xs font-extrabold ${
                      m.done ? "bg-[var(--bc-leaf)] text-[var(--bc-ink)]" : "bg-[var(--bc-grape)] text-white"
                    }`}
                  >
                    {m.done ? "Claim" : `+${m.reward}`}
                    <Image
                      src={SLICE("banana-cosmic")}
                      alt=""
                      width={64}
                      height={64}
                      className="h-3 w-3 object-contain"
                    />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const PANELS = [
  {
    kicker: "On-screen objectives",
    title: "Put the ask where the eyes are.",
    body:
      "Today's missions live behind a menu, which means most players never learn they exist. This pins three of the six to the HUD, top-right where nothing covers the banana, with the Cosmic payout on the row so nobody has to open anything to find out what a mission is worth. Completions announce themselves near the middle of the screen and then get out of the way.",
    changes: [
      "Three tracked, collapsible, out of the click zone",
      "Reward on the row, not one menu away",
      "Completion toast where you're already looking",
      "Finished lines stay, struck through, until rollover",
    ],
    caption: "Concept: the tracker over live play, one objective just completed.",
    panel: <Objectives />,
  },
  {
    kicker: "Offline earnings",
    title: "Say what you missed, not just what you got.",
    body:
      "A return screen that only shows a big number teaches nothing. This one breaks the total down by what produced it, then states the two rules every idle game has and most hide: the offline rate, and the cap. Telling someone they hit the ceiling four hours ago is the most useful sentence on the screen — it's the one that changes when they next open the game.",
    changes: [
      "Total broken down by which producer earned it",
      "Offline rate and bank cap both stated",
      "Says when you hit the cap, not just that one exists",
      "Doubling is an offer, not the default button",
    ],
    caption: "Concept: the return screen after seven hours away, over a dimmed scene.",
    panel: <Offline />,
  },
  {
    kicker: "NPC missions",
    title: "Six a day, per character, in chains.",
    body:
      "This one is drawn straight from the service that already exists: six slots rolled per UTC day from a weighted pool, each a chain of stages that advances as you clear it, each stage paying Cosmic. The screen just has to show that shape — which stage of which chain, how far into it, what it pays — plus the daily Cosmic cap, which the code enforces and the UI has never mentioned.",
    changes: [
      "Stage chips show chain depth, not just a target",
      "Per-character board, themed by that character's colour",
      "Daily Cosmic cap surfaced with its progress",
      "Reset stated in UTC, since that's how it rolls",
    ],
    caption: "Concept: Chad's board mid-day. Mission types are the real DailyMissionType values.",
    panel: <Missions />,
  },
];

export default function Loop() {
  return (
    <section
      id="loop"
      className="bc-dots bc-cut-bottom relative -mt-[4.5vw] bg-[var(--bc-cream)] pt-[9vw] pb-[9vw] text-[var(--bc-ink)]"
    >
      <div className="mx-auto max-w-6xl px-6">
        <span className="bc-chip">
          <span>Around the loop</span>
        </span>
        <h2 className="bc-display mt-5 text-[clamp(2.2rem,5.5vw,4.25rem)]">What the game asks, and pays.</h2>
        <p className="mt-5 max-w-2xl text-lg font-semibold text-[var(--bc-ink)]/80">
          Three screens that decide whether a session starts well: what you&apos;re being asked to do, what
          accrued while you were gone, and who&apos;s asking. The mission board is modelled on the game&apos;s
          existing daily-mission service rather than invented.
        </p>

        <div className="mt-14 flex flex-col gap-16 md:gap-24">
          {PANELS.map((p) => (
            <article key={p.kicker}>
              <span className="bc-chip !bg-[var(--bc-navy)]">
                <span>{p.kicker}</span>
              </span>
              <h3 className="bc-display mt-4 text-[clamp(1.8rem,3.8vw,2.75rem)]">{p.title}</h3>

              <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-10">
                <p className="text-lg font-semibold leading-relaxed text-[var(--bc-ink)]/80">{p.body}</p>
                <div className="rounded-xl border-4 border-[var(--bc-ink)] bg-white p-4 shadow-[6px_7px_0_var(--bc-ink)]">
                  <div className="bc-display text-sm">What changed</div>
                  <ul className="mt-2.5 grid gap-2">
                    {p.changes.map((c) => (
                      <li key={c} className="flex gap-2 text-sm font-bold text-[var(--bc-ink)]/80">
                        <span aria-hidden className="mt-1 text-[var(--bc-coral)]">
                          ▸
                        </span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <figure className="mt-8">
                {p.panel}
                <figcaption className="mt-3 text-sm font-bold text-[var(--bc-ink)]/55">{p.caption}</figcaption>
              </figure>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
