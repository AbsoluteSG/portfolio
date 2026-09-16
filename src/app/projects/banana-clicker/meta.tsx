/**
 * Concept UI for the three meta-progression screens: the battle pass, daily
 * login rewards, and achievements. Reward art is the game's own — prestige
 * slices, pearls, gear, and the currency banana.
 */

import Image from "next/image";
import { A, CURRENCY } from "./catalog";
import { Sprite, WindowBar } from "./panel";
import { TIERS, ULTIMATE_SHEEN, type Tier } from "./tiers";

const SLICE = (n: string) => `${A}/slices/${n}.webp`;

/** Reward node state drives colour everywhere on these three screens. */
type State = "claimed" | "ready" | "locked";

function stateRing(state: State) {
  return state === "claimed"
    ? "var(--bc-leaf)"
    : state === "ready"
      ? "var(--bc-yellow)"
      : "rgba(255,255,255,0.2)";
}

function Reward({
  art,
  state,
  hide = false,
  className = "",
}: {
  art: string;
  state: State;
  hide?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`bc-slot grid aspect-square place-items-center ${className}`}
      style={{ background: stateRing(state) }}
    >
      <span
        aria-hidden
        className="absolute inset-[3px] rounded-[7px]"
        style={{ background: hide ? "var(--bc-navy-deep)" : state === "locked" ? "#e4e0d6" : "#f4f1e8" }}
      />

      {hide ? (
        <span className="bc-display relative text-white/35">?</span>
      ) : (
        // A locked reward you can't see is a locked reward you won't chase — so
        // it stays legible and only the frame and a corner badge say "not yet".
        <Sprite src={art} className={`relative h-[70%] w-[70%] ${state === "locked" ? "opacity-75" : ""}`} />
      )}

      {state === "claimed" && (
        <span className="absolute -right-1.5 -bottom-1.5 grid h-5 w-5 place-items-center rounded-full border-2 border-[var(--bc-ink)] bg-[var(--bc-leaf)] text-[var(--bc-ink)]">
          <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden>
            <path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
      {state === "locked" && (
        <span className="absolute -right-1.5 -bottom-1.5 grid h-5 w-5 place-items-center rounded-full border-2 border-[var(--bc-ink)] bg-[var(--bc-ink)] text-white/70">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" aria-hidden>
            <path d="M7 10V7a5 5 0 0 1 10 0v3h1.5v11h-13V10zm2.5 0h5V7a2.5 2.5 0 0 0-5 0z" />
          </svg>
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* 1 — Battle pass                                                     */
/* ------------------------------------------------------------------ */

const TIERS_TRACK: { n: number; free: string; premium: string; state: State; premiumState: State }[] = [
  { n: 1, free: CURRENCY, premium: SLICE("core-slice"), state: "claimed", premiumState: "locked" },
  { n: 2, free: SLICE("banana-cosmic"), premium: SLICE("golden-slice"), state: "claimed", premiumState: "locked" },
  { n: 3, free: SLICE("pearl-regular"), premium: SLICE("gem-encrusted-slice"), state: "claimed", premiumState: "locked" },
  { n: 4, free: SLICE("chocolate-dipped-slice"), premium: SLICE("pearl-golden"), state: "ready", premiumState: "locked" },
  { n: 5, free: SLICE("spawn-rate"), premium: `${A}/items/warchief-mask.webp`, state: "locked", premiumState: "locked" },
  { n: 6, free: SLICE("max-capacity"), premium: SLICE("rainbow-slice"), state: "locked", premiumState: "locked" },
  { n: 7, free: SLICE("pearl-cosmic"), premium: `${A}/items/astro-helm.webp`, state: "locked", premiumState: "locked" },
];

function BattlePass() {
  return (
    <div className="bc-window" aria-hidden>
      <WindowBar title="Battle Pass — Season 01" tag="FULL SCREEN" />

      {/* Full screen, not a card: this is the whole viewport in game. */}
      <div className="bc-dots-light relative aspect-[5/8] overflow-hidden bg-[var(--bc-navy)] sm:aspect-[16/10] lg:aspect-[16/9]">
        <div className="absolute inset-0 flex flex-col gap-3 p-3 sm:gap-4 sm:p-5">
          <div className="grid flex-1 items-center gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_minmax(0,1fr)] sm:gap-4">
            {/* Left: where you are in the season */}
            <div>
              <h4 className="bc-display bc-outline text-[clamp(1.4rem,3.6vw,2.6rem)]">Battle Pass</h4>
              <div className="mt-1 flex items-center gap-2.5">
                <span className="bc-display text-[clamp(2rem,5vw,3.4rem)] leading-none text-[var(--bc-yellow)]">4</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.6rem] font-extrabold tracking-[0.16em] text-white/55 uppercase">
                    Season 01
                  </span>
                  <span className="bc-meter mt-1 block h-3.5">
                    <span style={{ width: "70%", background: "var(--bc-yellow)" }} />
                  </span>
                  <span className="bc-num mt-0.5 block text-[0.65rem] font-extrabold text-white/70">
                    3,499 / 5,000 XP
                  </span>
                </span>
              </div>
              <p className="mt-1.5 text-[0.65rem] font-bold text-white/55">
                Tier 5 in <span className="bc-num text-white">1,501</span> XP — about two Storms.
              </p>

              <span
                className="mt-2.5 block rounded-lg border-[3px] border-[var(--bc-ink)] px-3 py-2 text-center text-[var(--bc-ink)]"
                style={{ background: ULTIMATE_SHEEN }}
              >
                <span className="bc-display block text-sm">Unlock premium</span>
                {/* The number that actually sells it. */}
                <span className="bc-num block text-[0.62rem] font-extrabold opacity-80">
                  Claim 4 held rewards at once
                </span>
              </span>
            </div>

            {/* Centre: the reward itself, given the room a full screen allows */}
            <div className="relative grid place-items-center">
              <span aria-hidden className="bc-rays pointer-events-none absolute inset-0" />
              <Image
                src={SLICE("chocolate-dipped-slice")}
                alt=""
                width={256}
                height={256}
                className="relative h-[min(26vw,9rem)] w-auto object-contain drop-shadow-[0_10px_0_rgba(0,0,0,0.3)]"
              />
            </div>

            {/* Right: what it is and what it does */}
            <div className="text-right">
              <h4 className="bc-display bc-outline text-[clamp(1.1rem,2.8vw,2rem)]">Chocolate Slices</h4>
              <p className="mt-1 ml-auto max-w-[24ch] text-[0.7rem] font-bold text-white/70">
                Unlock chocolate dipped banana slices.
              </p>
              <ul className="mt-2 flex flex-wrap justify-end gap-1.5">
                {["+12% offline rate", "Permanent", "Stacks"].map((t) => (
                  <li
                    key={t}
                    className="bc-num rounded border-2 border-[var(--bc-ink)] bg-white/10 px-1.5 py-0.5 text-[0.6rem] font-extrabold text-white/80"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <span className="mt-3 block rounded-lg border-[3px] border-[var(--bc-ink)] bg-[var(--bc-yellow)] px-4 py-2 text-center text-sm font-extrabold text-[var(--bc-ink)] shadow-[4px_5px_0_var(--bc-ink)]">
                Redeem
              </span>
            </div>
          </div>

          {/* Bottom: the track, running the full width the way yours does */}
          <ol className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {TIERS_TRACK.map((t) => {
              const current = t.n === 4;
              const past = t.state === "claimed";
              return (
                <li
                  key={t.n}
                  className="overflow-hidden rounded-lg border-[3px] border-[var(--bc-ink)] p-1 sm:p-1.5"
                  style={{
                    background: current
                      ? "var(--bc-yellow)"
                      : past
                        ? "linear-gradient(180deg, #f2b705, #b97f05)"
                        : "var(--bc-navy-deep)",
                  }}
                >
                  <div
                    className={`bc-display text-center text-sm leading-none sm:text-lg ${
                      current || past ? "text-[var(--bc-ink)]" : "text-white/40"
                    }`}
                  >
                    {t.n}
                  </div>
                  <div className="mt-1 grid gap-1">
                    <Reward art={t.free} state={t.state} />
                    <Reward art={t.premium} state={t.premiumState} />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2 — Login rewards                                                   */
/* ------------------------------------------------------------------ */

const DAYS: { d: number; art: string; label: string; state: State }[] = [
  { d: 1, art: CURRENCY, label: "5K bananas", state: "claimed" },
  { d: 2, art: SLICE("banana-gold"), label: "25K bananas", state: "claimed" },
  { d: 3, art: SLICE("pearl-regular"), label: "1 Pearl", state: "claimed" },
  { d: 4, art: SLICE("chocolate-dipped-slice"), label: "1 Slice", state: "ready" },
  { d: 5, art: SLICE("banana-cosmic"), label: "3 Tokens", state: "locked" },
  { d: 6, art: `${A}/items/autumn-visor.webp`, label: "Gear roll", state: "locked" },
];

function LoginRewards() {
  return (
    <div className="bc-window" aria-hidden>
      <WindowBar title="Daily Login" tag="DAY 4 OF 7" tagFill="var(--bc-sky)" />

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs font-bold text-white/60">
            Miss a day and you keep your place — the streak pauses, it doesn&apos;t reset.
          </p>
          <span className="bc-num rounded-md border-2 border-[var(--bc-ink)] bg-white/10 px-2 py-0.5 text-xs font-extrabold text-white">
            Next in 18:42:10
          </span>
        </div>

        <div className="mt-3 grid gap-2.5 md:grid-cols-[minmax(0,1fr)_minmax(0,13rem)]">
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {DAYS.map((day) => (
              <li
                key={day.d}
                className={`rounded-xl border-[3px] border-[var(--bc-ink)] p-2 ${
                  day.state === "ready" ? "bg-[var(--bc-yellow)]" : "bg-[var(--bc-navy-deep)]"
                }`}
              >
                <div
                  className={`text-center text-[0.6rem] font-extrabold tracking-wider uppercase ${
                    day.state === "ready" ? "text-[var(--bc-ink)]" : "text-white/45"
                  }`}
                >
                  Day {day.d}
                </div>
                <div className="mt-1">
                  <Reward art={day.art} state={day.state} />
                </div>
                <div
                  className={`mt-1.5 truncate text-center text-[0.6rem] font-extrabold ${
                    day.state === "ready" ? "text-[var(--bc-ink)]" : "text-white/55"
                  }`}
                >
                  {day.label}
                </div>
              </li>
            ))}
          </ul>

          {/* Day seven is the reason you came back six times. */}
          <div
            className="relative grid place-items-center overflow-hidden rounded-xl border-[3px] border-[var(--bc-ink)] p-3 text-center"
            style={{ background: ULTIMATE_SHEEN }}
          >
            <span aria-hidden className="bc-rays pointer-events-none absolute inset-0" />
            <div className="relative">
              <div className="bc-display text-sm text-[var(--bc-ink)]">Day 7</div>
              <Image
                src={SLICE("cosmic-slice")}
                alt=""
                width={256}
                height={256}
                className="mx-auto my-1.5 h-20 w-auto object-contain drop-shadow-[0_6px_0_rgba(0,0,0,0.25)]"
              />
              <div className="bc-display text-base text-[var(--bc-ink)]">Cosmic Slice</div>
              <div className="bc-num text-[0.65rem] font-extrabold text-[var(--bc-ink)]/70">
                3 days away
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="bc-num text-xs font-extrabold text-white/55">Streak 4 · best 11</span>
          <span className="rounded-lg border-[3px] border-[var(--bc-ink)] bg-[var(--bc-yellow)] px-4 py-1.5 text-sm font-extrabold text-[var(--bc-ink)]">
            Claim day 4
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3 — Achievements                                                    */
/* ------------------------------------------------------------------ */

const ACHIEVEMENTS: {
  name: string;
  how: string;
  have: number;
  need: number;
  art: string;
  reward: string;
  tier: Tier;
  state: State;
  secret?: boolean;
}[] = [
  {
    name: "Top Banana",
    how: "Bank 100,000 bananas",
    have: 100000,
    need: 100000,
    art: SLICE("golden-slice"),
    reward: "1 Golden Slice",
    tier: "legendary",
    state: "claimed",
  },
  {
    name: "High Stakes Peels",
    how: "Bank 1,000,000 bananas",
    have: 1000000,
    need: 1000000,
    art: SLICE("pearl-golden"),
    reward: "2 Golden Pearls",
    tier: "epic",
    state: "ready",
  },
  {
    name: "Signal Found!",
    how: "Place 10 Beachscanners",
    have: 6,
    need: 10,
    art: `${A}/abilities/chad-beachscanners.webp`,
    reward: "Chad — Beach skin",
    tier: "rare",
    state: "locked",
  },
  {
    name: "The Reserve Opens",
    how: "Bank 10,000,000 bananas",
    have: 3200000,
    need: 10000000,
    art: SLICE("max-capacity"),
    reward: "+1 slice capacity",
    tier: "epic",
    state: "locked",
  },
  {
    name: "?????",
    how: "Do something the Dealer notices",
    have: 0,
    need: 1,
    art: SLICE("cosmic-slice"),
    reward: "Hidden",
    tier: "mythic",
    state: "locked",
    secret: true,
  },
];

const fmt = (n: number) => {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${+(n / 1_000).toFixed(0)}K`;
  return `${n}`;
};

function Achievements() {
  return (
    <div className="bc-window" aria-hidden>
      <WindowBar title="Achievements" tag="412 / 680" />

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex overflow-hidden rounded-lg border-[3px] border-[var(--bc-ink)] text-xs font-extrabold">
            {["All", "Bananas", "Gear", "Story", "Secret"].map((tab) => (
              <span
                key={tab}
                className={`px-2.5 py-1 ${tab === "All" ? "bg-[var(--bc-yellow)] text-[var(--bc-ink)]" : "bg-white/10 text-white/70"}`}
              >
                {tab}
              </span>
            ))}
          </span>
          <span className="bc-num ml-auto rounded-lg border-[3px] border-[var(--bc-ink)] bg-white/10 px-2.5 py-1 text-xs font-extrabold text-white/70">
            Steam · synced
          </span>
        </div>

        <div className="mt-2.5 flex items-center gap-2.5">
          <div className="bc-meter bc-meter-dark bc-meter-thin h-2.5 flex-1">
            <span style={{ width: "61%", background: "var(--bc-leaf)" }} />
          </div>
          <span className="bc-num text-[0.7rem] font-extrabold text-white/70">61%</span>
        </div>

        <ul className="mt-3 grid gap-2">
          {ACHIEVEMENTS.map((a) => {
            const pct = Math.min(100, Math.round((a.have / a.need) * 100));
            const t = TIERS[a.tier];
            return (
              <li
                key={a.name}
                className={`flex items-center gap-3 rounded-xl border-[3px] border-[var(--bc-ink)] p-2.5 ${
                  a.state === "ready" ? "bg-[var(--bc-yellow)]/15" : "bg-[var(--bc-navy-deep)]"
                }`}
              >
                <span className="h-12 w-12 shrink-0">
                  <Reward art={a.art} state={a.state} hide={a.secret} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className={`bc-display text-sm ${a.secret ? "text-white/50" : "text-white"}`}>
                      {a.name}
                    </span>
                    {/* The reward, on the row — the shipped screen never says there is one. */}
                    <span
                      className="bc-num rounded border-2 border-[var(--bc-ink)] px-1 text-[0.6rem] font-extrabold"
                      style={{ background: t.fill, color: t.ink }}
                    >
                      {a.reward}
                    </span>
                  </div>
                  <p className="truncate text-[0.7rem] font-bold text-white/55">{a.how}</p>
                  {a.state !== "claimed" && !a.secret && (
                    <div className="mt-1 flex items-center gap-2">
                      <div className="bc-meter bc-meter-dark bc-meter-thin h-1.5 flex-1">
                        <span style={{ width: `${pct}%`, background: t.fill }} />
                      </div>
                      <span className="bc-num w-20 shrink-0 text-right text-[0.6rem] font-extrabold text-white/55">
                        {fmt(a.have)} / {fmt(a.need)}
                      </span>
                    </div>
                  )}
                </div>

                <span className="shrink-0">
                  {a.state === "ready" ? (
                    <span className="rounded-lg border-[3px] border-[var(--bc-ink)] bg-[var(--bc-yellow)] px-2.5 py-1 text-xs font-extrabold text-[var(--bc-ink)]">
                      Claim
                    </span>
                  ) : a.state === "claimed" ? (
                    <span className="bc-num text-[0.6rem] font-extrabold tracking-wider text-[var(--bc-leaf)] uppercase">
                      Claimed
                    </span>
                  ) : (
                    <span className="bc-num text-[0.6rem] font-extrabold tracking-wider text-white/35 uppercase">
                      {pct}%
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const PANELS = [
  {
    kicker: "Battle pass",
    title: "Two lanes, so the upsell argues for itself.",
    body:
      "The existing design stacks one lane of numbered tiers under a preview, which reads clearly but makes Unlock Premium an act of faith — you can't see what you'd be buying. Splitting the track into free and premium rows puts the locked lane directly under the one you're earning, and the button stops saying “unlock” and starts saying how many rewards are already waiting behind it.",
    changes: [
      "Free and premium as parallel lanes, not one track",
      "Nodes show the actual reward art and its state",
      "XP bar names the distance in something you do",
      "Premium button counts the rewards it would release",
    ],
    caption: "Concept: Season 01 at tier 4, built on the existing layout.",
    panel: <BattlePass />,
  },
  {
    kicker: "Login rewards",
    title: "Seven days, and a reason to see day seven.",
    body:
      "The diagonal strip in the existing design looks great and tells you almost nothing — which day you're on, what you already took, or how long you've got. This keeps the escalation and the day-seven payoff, adds the state to each card, and states the streak rule out loud, because a player who thinks one missed day resets the week is a player who stops opening the game.",
    changes: [
      "Today is obvious; claimed days are stamped",
      "Day seven previewed from day one, with its distance",
      "Countdown to the next claim",
      "The streak rule written down, not inferred",
    ],
    caption: "Concept: the daily track on day four, with the day-seven finale kept in view.",
    panel: <LoginRewards />,
  },
  {
    kicker: "Achievements",
    title: "Say what they're worth.",
    body:
      "Right now it's two columns of white pills and the same banana icon 680 times — no progress, no categories, and nothing to say an achievement pays out at all. Every row here carries its reward, how far along you are, and a claim when it's due. Secret ones stay secret without pretending they don't exist.",
    changes: [
      "Every achievement names its in-game reward",
      "Progress on the row, for the ones you're partway into",
      "Categories and an overall completion figure",
      "Secrets show as locked rather than hiding entirely",
    ],
    caption: "Concept: the achievement list with rewards, progress, and a claimable row.",
    panel: <Achievements />,
  },
];

export default function Meta() {
  return (
    <section
      id="meta"
      className="bc-dots bc-cut-bottom-alt relative -mt-[4.5vw] bg-[var(--bc-sky)] pt-[9vw] pb-[9vw] text-[var(--bc-ink)]"
    >
      <div className="mx-auto max-w-6xl px-6">
        <span className="bc-chip">
          <span>Reasons to come back</span>
        </span>
        <h2 className="bc-display mt-5 text-[clamp(2.2rem,5.5vw,4.25rem)]">The meta layer.</h2>
        <p className="mt-5 max-w-2xl text-lg font-semibold text-[var(--bc-ink)]/80">
          Three screens whose whole job is to be worth opening tomorrow. The battle pass and the login track
          are second passes on designs already sketched for the game; the achievements are a rework of
          the shipped screen.
          Reward art throughout is the game&apos;s — prestige slices, pearls, gear.
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
