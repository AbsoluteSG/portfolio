/**
 * Concept UI for the pearl unlock screen and the pearl shop.
 *
 * Built on the game's real `PearlDetails`: pearls are collectables that bounce
 * around the scene, and each one carries BaseBounceCount, BaseSpeed,
 * BaseMultiplier and a SpawnWeight that decides how often the spawner rolls it
 * out of the unlocked pool. The unlock screen mirrors the Banana Slices screen;
 * the shop is where those four numbers become something you can spend on.
 */

import Image from "next/image";
import { A, CURRENCY } from "./catalog";
import { Label, Sprite, WindowBar } from "./panel";
import { ULTIMATE_SHEEN } from "./tiers";

const P = (n: string) => `${A}/slices/${n}.webp`;

type Pearl = {
  slug: string;
  name: string;
  blurb: string;
  tint: string;
  ink: string;
  bounces: number;
  speed: number;
  multiplier: number;
  weight: number;
  level?: number;
  cost?: string;
  unlocked: boolean;
};

const PEARLS: Pearl[] = [
  {
    slug: "pearl-regular",
    name: "Regular Pearl",
    blurb: "Bounces five times. Pays a little each hit.",
    tint: "var(--bc-stone)",
    ink: "var(--bc-ink)",
    bounces: 5,
    speed: 5,
    multiplier: 1,
    weight: 70,
    level: 4,
    cost: "180K",
    unlocked: true,
  },
  {
    slug: "pearl-golden",
    name: "Golden Pearl",
    blurb: "Fewer bounces, far bigger pay per hit.",
    tint: "var(--bc-yellow)",
    ink: "var(--bc-ink)",
    bounces: 3,
    speed: 7.5,
    multiplier: 6,
    weight: 25,
    level: 2,
    cost: "1.4M",
    unlocked: true,
  },
  {
    slug: "pearl-cosmic",
    name: "Cosmic Pearl",
    blurb: "Keeps bouncing. Pays in Cosmic, not bananas.",
    tint: "var(--bc-grape)",
    ink: "var(--bc-white)",
    bounces: 12,
    speed: 4,
    multiplier: 25,
    weight: 5,
    unlocked: false,
  },
];

/* ------------------------------------------------------------------ */
/* 1 — Unlock screen                                                   */
/* ------------------------------------------------------------------ */

function PearlUnlock() {
  return (
    <div className="bc-window" aria-hidden>
      <WindowBar title="Unlock Pearls" tag="2 OF 3" />

      <div className="bc-dots-light relative bg-[var(--bc-navy)] p-4 sm:p-6">
        <h4 className="bc-display bc-outline text-center text-[clamp(1.4rem,4vw,2.4rem)]">Unlock Pearls</h4>

        {/* The slice screen puts the focus item centre and larger; keep that,
            but let each one say what it is. */}
        <ul className="mt-4 grid gap-3 sm:grid-cols-3 sm:items-end">
          {PEARLS.map((p, i) => {
            const focus = i === 2;
            return (
              <li key={p.slug} className={focus ? "sm:-mt-4" : ""}>
                <div
                  className={`relative grid place-items-center rounded-xl border-[3px] border-[var(--bc-ink)] ${
                    focus ? "py-5" : "py-4"
                  }`}
                  style={{ background: p.unlocked ? "#f4f1e8" : "var(--bc-navy-deep)" }}
                >
                  {focus && <span aria-hidden className="bc-rays pointer-events-none absolute inset-0" />}
                  <Image
                    src={P(p.slug)}
                    alt=""
                    width={256}
                    height={256}
                    sizes="(max-width: 640px) 40vw, 18vw"
                    className={`relative object-contain ${focus ? "h-20 sm:h-24" : "h-16 sm:h-20"} ${
                      p.unlocked ? "" : "opacity-80"
                    }`}
                  />
                  {!p.unlocked && (
                    <span className="bc-display absolute right-2 bottom-2 rounded border-2 border-[var(--bc-ink)] bg-[var(--bc-ink)] px-1.5 text-[0.6rem] text-white">
                      Locked
                    </span>
                  )}
                </div>

                <div className="mt-2 text-center">
                  <div className="bc-display text-sm text-white">{p.name}</div>
                  <p className="mx-auto max-w-[22ch] text-[0.68rem] font-bold text-white/60">{p.blurb}</p>
                </div>

                <div className="mt-2 flex justify-center">
                  {p.unlocked ? (
                    <span className="bc-num rounded-md border-2 border-[var(--bc-ink)] bg-[var(--bc-leaf)] px-2 py-0.5 text-[0.65rem] font-extrabold text-[var(--bc-ink)]">
                      Unlocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 rounded-lg border-[3px] border-[var(--bc-ink)] bg-[var(--bc-yellow)] px-2.5 py-1 text-xs font-extrabold text-[var(--bc-ink)]">
                      Unlock
                      <Sprite src={CURRENCY} className="h-3.5 w-3.5" />
                      <span className="bc-num">40M</span>
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* The slice screen's currency bar, but it says whether you can afford it. */}
        <div className="mx-auto mt-5 flex max-w-md items-center gap-2 rounded-full border-[3px] border-[var(--bc-ink)] bg-[var(--bc-ink)] px-2 py-1.5">
          <Sprite src={CURRENCY} className="h-6 w-6" />
          <span className="bc-num flex-1 text-sm font-extrabold text-white">3.2B</span>
          <span className="bc-num text-[0.65rem] font-extrabold text-[var(--bc-leaf)]">
            Enough for Cosmic
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2 — Pearl shop                                                      */
/* ------------------------------------------------------------------ */

const STATS: { key: keyof Pick<Pearl, "bounces" | "speed" | "multiplier">; label: string; max: number; suffix?: string }[] = [
  { key: "bounces", label: "Bounces", max: 15 },
  { key: "speed", label: "Speed", max: 10 },
  { key: "multiplier", label: "Payout", max: 30, suffix: "×" },
];

function PearlShop() {
  const totalWeight = PEARLS.reduce((sum, p) => sum + (p.unlocked ? p.weight : 0), 0);
  return (
    <div className="bc-window" aria-hidden>
      <WindowBar title="Pearl Shop" tag="SPAWN POOL" tagFill="var(--bc-sky)" />

      <div className="p-4 sm:p-5">
        {/* SpawnWeight decides what the spawner rolls. Showing the pool as one
            bar makes an upgrade's real effect legible. */}
        <div className="rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-navy-deep)] p-3">
          <div className="flex items-baseline justify-between gap-2">
            <Label>What spawns</Label>
            <span className="bc-num text-[0.65rem] font-extrabold text-white/55">
              of every {totalWeight} rolls
            </span>
          </div>
          <div className="mt-2 flex h-6 overflow-hidden rounded-full border-[3px] border-[var(--bc-ink)]">
            {PEARLS.filter((p) => p.unlocked).map((p) => (
              <span
                key={p.slug}
                className="grid place-items-center"
                style={{ width: `${(p.weight / totalWeight) * 100}%`, background: p.tint }}
              >
                <span className="bc-num text-[0.6rem] font-extrabold" style={{ color: p.ink }}>
                  {Math.round((p.weight / totalWeight) * 100)}%
                </span>
              </span>
            ))}
          </div>
        </div>

        <ul className="mt-3 grid gap-2.5 sm:grid-cols-3">
          {PEARLS.map((p) => (
            <li
              key={p.slug}
              className="flex flex-col rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-navy-deep)] p-3"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="bc-slot grid h-14 w-14 shrink-0 place-items-center"
                  style={{ background: p.tint }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-[3px] rounded-[7px]"
                    style={{ background: p.unlocked ? "#f4f1e8" : "var(--bc-navy)" }}
                  />
                  <Image
                    src={P(p.slug)}
                    alt=""
                    width={256}
                    height={256}
                    className={`relative h-[70%] w-[70%] object-contain ${p.unlocked ? "" : "opacity-60"}`}
                  />
                </span>
                <div className="min-w-0">
                  <div className="bc-display truncate text-sm text-white">{p.name}</div>
                  {p.unlocked ? (
                    <span className="bc-num rounded border-2 border-[var(--bc-ink)] bg-white/10 px-1 text-[0.6rem] font-extrabold text-white/70">
                      Level {p.level}
                    </span>
                  ) : (
                    <span className="bc-num rounded border-2 border-[var(--bc-ink)] bg-[var(--bc-ink)] px-1 text-[0.6rem] font-extrabold text-white/60">
                      Locked
                    </span>
                  )}
                </div>
              </div>

              <ul className="mt-2.5 grid flex-1 gap-1.5">
                {STATS.map((s) => (
                  <li key={s.key}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[0.65rem] font-bold text-white/60">{s.label}</span>
                      <span className="bc-num text-[0.7rem] font-extrabold text-white">
                        {s.suffix}
                        {p[s.key]}
                      </span>
                    </div>
                    <div className="bc-meter bc-meter-dark bc-meter-thin mt-0.5 h-1.5">
                      <span style={{ width: `${(p[s.key] / s.max) * 100}%`, background: p.tint }} />
                    </div>
                  </li>
                ))}
              </ul>

              <span
                className={`mt-2.5 flex items-center justify-center gap-1.5 rounded-lg border-[3px] border-[var(--bc-ink)] px-2 py-1.5 text-xs font-extrabold ${
                  p.unlocked ? "bg-[var(--bc-yellow)] text-[var(--bc-ink)]" : "text-[var(--bc-ink)]"
                }`}
                style={p.unlocked ? undefined : { background: ULTIMATE_SHEEN }}
              >
                {p.unlocked ? (
                  <>
                    Upgrade
                    <Sprite src={CURRENCY} className="h-3.5 w-3.5" />
                    <span className="bc-num">{p.cost}</span>
                  </>
                ) : (
                  "Unlock first"
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const PANELS = [
  {
    kicker: "Pearl unlock",
    title: "Name them. Say what they do.",
    body:
      "The Banana Slices screen is a row of beautiful objects, a number, and no way to tell which one you're buying or what it changes. Pearls get the same layout — focus item centre, currency bar below — plus the two things the slice screen leaves out: what each one actually does, and whether the number at the bottom is enough.",
    changes: [
      "Every pearl named, with its behaviour in one line",
      "Cost sits on the thing it unlocks",
      "Currency bar says whether you can afford the next one",
      "Locked reads as locked without hiding the art",
    ],
    caption: "Concept: the unlock screen with Cosmic still locked. Pearl art is the game's own.",
    panel: <PearlUnlock />,
  },
  {
    kicker: "Pearl shop",
    title: "Make the spawn pool visible.",
    body:
      "Each pearl carries four numbers — bounces, speed, payout multiplier, and a spawn weight that decides how often it appears at all. That last one is the most important and the least visible: upgrading a Golden Pearl matters far less than changing how often one shows up. So the pool goes on top as a single bar, and every upgrade you buy visibly moves it.",
    changes: [
      "Spawn weights drawn as one pool bar, in percentages",
      "All four stats per pearl, against their ceilings",
      "Level and cost on the card that spends",
      "Locked pearls still show their stat line to aim at",
    ],
    caption: "Concept: the shop with the pool weighted 70/25/5 across the unlocked pearls.",
    panel: <PearlShop />,
  },
];

export default function Pearls() {
  return (
    <section
      id="pearls"
      className="bc-dots-light relative -mt-[4.5vw] bg-[var(--bc-ink)] pt-[9vw] pb-20 text-white"
    >
      <div className="mx-auto max-w-6xl px-6">
        <span className="bc-chip !bg-[var(--bc-yellow)] !text-[var(--bc-ink)]">
          <span>Pearls</span>
        </span>
        <h2 className="bc-display bc-outline-yellow mt-5 text-[clamp(2.2rem,5.5vw,4.25rem)]">
          The other collectable.
        </h2>
        <p className="mt-5 max-w-2xl text-lg font-semibold text-white/75">
          Pearls bounce across the scene and pay out on each hit, with a weight deciding how often the
          spawner picks them. Two screens: the unlock, built to match the Banana Slices screen, and a shop
          for the four numbers underneath.
        </p>

        <div className="mt-14 flex flex-col gap-16 md:gap-24">
          {PANELS.map((p) => (
            <article key={p.kicker}>
              <span className="bc-chip !bg-[var(--bc-sky)] !text-[var(--bc-ink)]">
                <span>{p.kicker}</span>
              </span>
              <h3 className="bc-display mt-4 text-[clamp(1.8rem,3.8vw,2.75rem)]">{p.title}</h3>

              <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-10">
                <p className="text-lg font-semibold leading-relaxed text-white/75">{p.body}</p>
                <div className="rounded-xl border-4 border-[var(--bc-ink)] bg-white p-4 text-[var(--bc-ink)] shadow-[6px_7px_0_var(--bc-yellow-deep)]">
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
                <figcaption className="mt-3 text-sm font-bold text-white/50">{p.caption}</figcaption>
              </figure>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
