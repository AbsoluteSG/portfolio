/**
 * Second-pass concept UI for three screens that already exist in the shipped
 * build: the character sheet, the gacha banners, and the reward reveal.
 *
 * Same rules as the mechanics panels — markup rather than screenshots, and the
 * chrome is aria-hidden because the readouts are set dressing. What each pass
 * actually changes is stated in prose beside the panel, where a screen reader
 * and a skimming recruiter both get it.
 */

import Image from "next/image";
import { TIERS, ULTIMATE_SHEEN, type Tier } from "./tiers";
import { A, CHAD_ABILITIES, CURRENCY, IDLE_ICONS, ITEM } from "./catalog";
import { Label, Sprite, WindowBar } from "./panel";


/* ------------------------------------------------------------------ */
/* 1 — Character sheet                                                 */
/* ------------------------------------------------------------------ */

const STATS = [
  { label: "Click power", value: "1.42M", delta: "+18%" },
  { label: "Idle rate", value: "281K/s", delta: "+6%" },
  { label: "Crit chance", value: "24%", delta: "+2%" },
  { label: "Storm gain", value: "×3.1", delta: null },
];

type Slot = { art: string; tier: Tier; level: number; selected?: boolean } | { empty: true } | { locked: true };

const ACTIVES: Slot[] = [
  { art: CHAD_ABILITIES.crabAssistance, tier: "legendary", level: 4 },
  { art: CHAD_ABILITIES.surfboardSmash, tier: "epic", level: 1, selected: true },
  { art: CHAD_ABILITIES.beachscanners, tier: "rare", level: 2 },
  { empty: true },
  { locked: true },
];

const PASSIVES: Slot[] = [
  { art: CHAD_ABILITIES.bananaMills, tier: "legendary", level: 5 },
  { art: CHAD_ABILITIES.shellTrading, tier: "epic", level: 3 },
  { art: IDLE_ICONS.strawHat, tier: "common", level: 1 },
  { empty: true },
  { empty: true },
];

function SlotRow({ slots }: { slots: Slot[] }) {
  return (
    <ul className="mt-2 grid grid-cols-5 gap-2">
      {slots.map((s, i) => {
        if ("empty" in s) return <li key={i} className="bc-socket-empty aspect-square" />;
        if ("locked" in s)
          return (
            <li
              key={i}
              className="bc-slot grid aspect-square place-items-center text-white/35"
              style={{ background: "var(--bc-navy-deep)" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-1/2 w-1/2" aria-hidden>
                <path d="M7 10V7a5 5 0 0 1 10 0v3h1.5v11h-13V10zm2.5 0h5V7a2.5 2.5 0 0 0-5 0z" />
              </svg>
            </li>
          );
        const t = TIERS[s.tier];
        return (
          <li
            key={i}
            className={`bc-slot grid aspect-square place-items-center ${
              s.selected ? "outline-[3px] outline-offset-2 outline-[var(--bc-yellow)]" : ""
            }`}
            style={{ background: t.fill, color: t.ink }}
          >
            <span aria-hidden className="absolute inset-[3px] rounded-[7px]" style={{ background: t.plate }} />
            <Sprite src={s.art} className="relative h-[72%] w-[72%]" />
            <span className="bc-num absolute -right-1 -bottom-1 rounded-md border-2 border-[var(--bc-ink)] bg-[var(--bc-ink)] px-1 text-[0.6rem] font-extrabold text-white">
              {s.level}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function CharacterSheet() {
  return (
    <div className="bc-window" aria-hidden>
      <WindowBar title="Beach Bum Chad" tag="LV 27" />

      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-5 lg:p-5">
        {/* Identity + stats */}
        <div className="flex flex-col gap-3">
          <div className="relative overflow-hidden rounded-xl border-[3px] border-[var(--bc-ink)]">
            <Image
              src={`${A}/chad-portrait.jpg`}
              alt=""
              width={660}
              height={880}
              sizes="(max-width: 1024px) 90vw, 17rem"
              className="h-auto w-full"
            />
            <span className="absolute bottom-2 left-2 rounded-md border-2 border-[var(--bc-ink)] bg-[var(--bc-sky)] px-1.5 py-0.5 text-[0.6rem] font-extrabold tracking-wider text-[var(--bc-ink)] uppercase">
              Grovekeepers
            </span>
          </div>

          <div>
            <div className="bc-display text-xl text-white">Beach Bum Chad</div>
            <div className="text-xs font-bold text-white/60">Surfer prophet · Click specialist</div>
          </div>

          <div>
            <div className="flex items-end justify-between">
              <Label>Level 27</Label>
              <span className="bc-num text-xs font-extrabold text-white/70">12.4K / 18K</span>
            </div>
            <div className="bc-meter mt-1 h-3.5">
              <span style={{ width: "69%", background: "var(--bc-yellow)" }} />
            </div>
          </div>

          <ul className="grid gap-1.5">
            {STATS.map((s) => (
              <li
                key={s.label}
                className="flex items-center justify-between gap-2 rounded-lg border-[3px] border-[var(--bc-ink)] bg-[var(--bc-navy-deep)] px-2.5 py-1.5"
              >
                <span className="text-xs font-bold text-white/70">{s.label}</span>
                <span className="flex items-center gap-1.5">
                  <span className="bc-num text-sm font-extrabold text-white">{s.value}</span>
                  {s.delta && (
                    <span className="bc-num rounded bg-[var(--bc-yellow)] px-1 text-[0.6rem] font-extrabold text-[var(--bc-ink)]">
                      {s.delta}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Loadout + the upgrade you're actually looking at */}
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-end justify-between">
              <Label>Actives</Label>
              <span className="bc-num text-xs font-extrabold text-white/70">3 / 5 equipped</span>
            </div>
            <SlotRow slots={ACTIVES} />
          </div>

          <div>
            <div className="flex items-end justify-between">
              <Label>Passives</Label>
              <span className="bc-num text-xs font-extrabold text-white/70">3 / 5 equipped</span>
            </div>
            <SlotRow slots={PASSIVES} />
          </div>

          <div className="mt-auto rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-navy-deep)] p-3.5">
            <div className="flex gap-3.5">
              <span
                className="bc-slot grid h-16 w-16 shrink-0 place-items-center"
                style={{ background: TIERS.epic.fill, color: TIERS.epic.ink }}
              >
                <span aria-hidden className="absolute inset-[3px] rounded-[7px]" style={{ background: TIERS.epic.plate }} />
                <Sprite src={CHAD_ABILITIES.surfboardSmash} className="relative h-[72%] w-[72%]" />
              </span>
              <div className="min-w-0">
                <span className="bc-stamp" style={{ color: TIERS.epic.onDark }}>
                  Epic · Active
                </span>
                <div className="bc-display mt-1.5 text-lg text-white">Surfboard Smash</div>
                <p className="text-xs font-bold text-white/60">
                  Slam the board for 12s: every click counts twice and crits chain into the next one.
                </p>
              </div>
            </div>

            {/* The number the purchase actually moves. */}
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
              <span className="text-[0.7rem] font-extrabold tracking-wider text-white/55 uppercase">
                Click damage
              </span>
              <span className="bc-num text-sm font-extrabold text-white/70">+140%</span>
              <span className="text-[var(--bc-yellow)]">→</span>
              <span className="bc-num text-sm font-extrabold text-[var(--bc-yellow)]">+185%</span>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <Sprite src={CURRENCY} className="h-6 w-6" />
                <span className="bc-num text-sm font-extrabold text-white">4.2M</span>
              </span>

              <span className="flex items-center gap-2">
                {/* Buying in bulk was a single "BUY 1" chip in the shipped screen. */}
                <span className="flex overflow-hidden rounded-lg border-[3px] border-[var(--bc-ink)] text-xs font-extrabold">
                  {["×1", "×10", "Max"].map((o) => (
                    <span
                      key={o}
                      className={`px-2 py-1 ${
                        o === "×10" ? "bg-[var(--bc-yellow)] text-[var(--bc-ink)]" : "bg-white/10 text-white/70"
                      }`}
                    >
                      {o}
                    </span>
                  ))}
                </span>
                <span className="rounded-lg border-[3px] border-[var(--bc-ink)] bg-[var(--bc-yellow)] px-3 py-1 text-sm font-extrabold text-[var(--bc-ink)]">
                  Buy
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2 — Gacha banners                                                   */
/* ------------------------------------------------------------------ */

// Banner art is its own thing in a real build — key art per banner, not the
// items inside it. Standing in with a mark on a colour field rather than
// borrowing a gear sprite, which read as "this banner contains one helmet".
const BANNER_MARKS = {
  sparkle: "M12 1.5 14.3 9l7.2 2.4-7.2 2.4L12 22.5 9.7 13.8 2.5 11.4 9.7 9zM19.5 2l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9zM4.5 15l.9 2.6 2.6.9-2.6.9L4.5 22l-.9-2.6-2.6-.9 2.6-.9z",
  coin: "M12 2c5 0 9 2 9 4.5S17 11 12 11 3 9 3 6.5 7 2 12 2zM3 9.6C4.8 11.1 8.2 12 12 12s7.2-.9 9-2.4v3C21 15.1 17 17 12 17s-9-1.9-9-4.4zm0 6C4.8 17.1 8.2 18 12 18s7.2-.9 9-2.4v2.9C21 21 17 22 12 22s-9-1-9-3.5z",
  shield: "M12 1.8 3.5 5.4v6.2c0 5 3.6 9.3 8.5 10.6 4.9-1.3 8.5-5.6 8.5-10.6V5.4z",
} as const;

const BANNERS = [
  { name: "Astro Drop", ends: "4d 06h", fill: ULTIMATE_SHEEN, mark: "sparkle" as const, active: true },
  { name: "House Blend", ends: "Always on", fill: "var(--bc-sky)", mark: "coin" as const },
  { name: "Syndicate Vault", ends: "1d 22h", fill: "var(--bc-coral)", mark: "shield" as const },
];

const RATES: { tier: Tier; pct: number }[] = [
  { tier: "ultimate", pct: 0.6 },
  { tier: "mythic", pct: 2.4 },
  { tier: "legendary", pct: 7 },
  { tier: "epic", pct: 18 },
  { tier: "rare", pct: 32 },
  { tier: "common", pct: 40 },
];

function GachaBanners() {
  return (
    <div className="bc-window" aria-hidden>
      <WindowBar title="The Dealer's Banners" tag="3 ACTIVE" />

      <div className="p-4 sm:p-5">
        {/* Which banner */}
        <ul className="grid gap-2.5 sm:grid-cols-3">
          {BANNERS.map((b) => (
            <li
              key={b.name}
              className={`overflow-hidden rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-navy-deep)] ${
                b.active ? "outline-[3px] outline-offset-2 outline-[var(--bc-yellow)]" : ""
              }`}
            >
              <span
                className="grid h-14 place-items-center border-b-[3px] border-[var(--bc-ink)] text-[var(--bc-ink)]"
                style={{ background: b.fill }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7" aria-hidden>
                  <path d={BANNER_MARKS[b.mark]} />
                </svg>
              </span>
              <span className="block px-2.5 py-2">
                <span className="bc-display block text-sm text-white">{b.name}</span>
                <span className="bc-num block text-[0.7rem] font-bold text-white/55">{b.ends}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          {/* What's rated up */}
          <div className="rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-navy-deep)] p-3.5">
            <Label>Rate-up</Label>
            <div
              className="mt-2 grid aspect-[4/3] place-items-center rounded-lg border-[3px] border-[var(--bc-ink)] text-[var(--bc-ink)]"
              style={{ background: ULTIMATE_SHEEN }}
            >
              <Sprite src={`${A}/items/astro-helm.webp`} className="h-[72%] w-[72%]" />
            </div>
            <div className="mt-2.5 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="bc-display truncate text-base text-white">{ITEM["astro-helm"].name}</div>
                <span className="bc-stamp" style={{ color: TIERS.ultimate.onDark }}>
                  Ultimate
                </span>
              </div>
              <span className="bc-num shrink-0 rounded-md border-2 border-[var(--bc-ink)] bg-[var(--bc-yellow)] px-1.5 py-0.5 text-[0.7rem] font-extrabold text-[var(--bc-ink)]">
                ×2 ODDS
              </span>
            </div>
          </div>

          {/* The odds, in full */}
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-navy-deep)] p-3.5">
              <Label>Drop rates</Label>
              <ul className="mt-2 grid gap-1.5">
                {RATES.map(({ tier, pct }) => (
                  <li key={tier} className="flex items-center gap-2.5">
                    <span className="w-[4.5rem] shrink-0 text-[0.7rem] font-extrabold" style={{ color: TIERS[tier].onDark }}>
                      {TIERS[tier].name}
                    </span>
                    <span className="bc-meter bc-meter-dark h-2.5 flex-1">
                      {/* Scaled against the commonest tier; 0.6% would otherwise vanish. */}
                      <span style={{ width: `${Math.max(3, (pct / 40) * 100)}%`, background: TIERS[tier].fill }} />
                    </span>
                    <span className="bc-num w-11 shrink-0 text-right text-[0.7rem] font-extrabold text-white/70">
                      {pct.toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-navy-deep)] p-3.5">
              <div className="flex items-end justify-between gap-2">
                <Label>Pity</Label>
                <span className="bc-num text-xs font-extrabold text-white/70">74 / 90</span>
              </div>
              <div className="bc-meter mt-1.5 h-3.5">
                <span style={{ width: "82%", background: "var(--bc-yellow)" }} />
              </div>
              <p className="mt-1.5 text-[0.7rem] font-bold text-white/60">
                Legendary or better guaranteed within <span className="bc-num text-white">16</span> pulls.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <span className="rounded-lg border-[3px] border-[var(--bc-ink)] bg-white px-3 py-2 text-center">
                <span className="bc-display block text-sm text-[var(--bc-ink)]">Pull ×1</span>
                <span className="bc-num block text-xs font-extrabold text-[var(--bc-ink)]/60">160 tokens</span>
              </span>
              <span className="relative rounded-lg border-[3px] border-[var(--bc-ink)] bg-[var(--bc-yellow)] px-3 py-2 text-center">
                <span className="bc-display block text-sm text-[var(--bc-ink)]">Pull ×10</span>
                <span className="bc-num block text-xs font-extrabold text-[var(--bc-ink)]/70">1,440 tokens</span>
                <span className="absolute -top-2.5 -right-2 rotate-6 rounded border-2 border-[var(--bc-ink)] bg-[var(--bc-coral)] px-1 text-[0.6rem] font-extrabold text-white">
                  −10%
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3 — Reward reveal                                                   */
/* ------------------------------------------------------------------ */

// Slugs carry their own tier, so the strip can't drift out of sync with the catalog.
const PULL: { slug: string; dupe?: number }[] = [
  { slug: "astro-helm" },
  { slug: "tide-trident" },
  { slug: "crimson-drape", dupe: 40 },
  { slug: "reef-skirt" },
  { slug: "rubber-nana", dupe: 40 },
  { slug: "teal-returner", dupe: 15 },
  { slug: "frost-shards" },
  { slug: "rivet-gauntlet", dupe: 15 },
  { slug: "autumn-visor" },
  { slug: "lucky-sock", dupe: 5 },
];

function RewardReveal() {
  return (
    <div className="bc-window" aria-hidden>
      <WindowBar title="Pull Results" tag="10 × PULL" />

      <div className="p-4 sm:p-5">
        {/* The one that matters */}
        <div className="relative grid place-items-center overflow-hidden rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-navy-deep)] px-4 py-7">
          <span aria-hidden className="bc-rays pointer-events-none absolute inset-0" />

          <div className="relative flex flex-col items-center">
            <div className="relative">
              <div
                className="grid h-36 w-28 place-items-center rounded-xl border-[4px] border-[var(--bc-ink)] text-[var(--bc-ink)] shadow-[8px_9px_0_var(--bc-ink)]"
                style={{ background: ULTIMATE_SHEEN }}
              >
                <Sprite src={`${A}/items/astro-helm.webp`} className="h-[74%] w-[74%]" />
              </div>
              <span className="bc-display absolute -top-3 -right-4 rotate-[8deg] rounded-md border-[3px] border-[var(--bc-ink)] bg-[var(--bc-coral)] px-2 py-0.5 text-sm text-white">
                New!
              </span>
            </div>

            <span className="bc-stamp mt-4" style={{ color: TIERS.ultimate.onDark }}>
              Ultimate
            </span>
            <div className="bc-display mt-2 text-3xl text-white">{ITEM["astro-helm"].name}</div>
            <p className="mt-1 max-w-sm text-center text-xs font-bold text-white/65">
              +250% click power, and Banana Storms run six seconds longer. Counts as every set at once.
            </p>
          </div>
        </div>

        {/* And the other nine */}
        <Label>
          <span className="mt-4 block">The rest of the pull</span>
        </Label>
        <ul className="mt-2 grid grid-cols-5 gap-2 sm:grid-cols-10">
          {PULL.map((p, i) => {
            const item = ITEM[p.slug];
            const t = TIERS[item.tier];
            return (
              <li key={p.slug} className="relative">
                <span
                  className={`bc-slot grid aspect-[3/4] place-items-center ${i === 0 ? "opacity-40" : ""}`}
                  style={{ background: item.tier === "ultimate" ? ULTIMATE_SHEEN : t.fill, color: t.ink }}
                >
                  <span aria-hidden className="absolute inset-[3px] rounded-[7px]" style={{ background: t.plate }} />
                  <Sprite src={`${A}/items/${p.slug}.webp`} className="relative h-[66%] w-[66%]" />
                </span>
                {/* Duplicates convert on the spot rather than in a second screen. */}
                {p.dupe && (
                  <span className="bc-num absolute -right-1 -bottom-1.5 rounded border-2 border-[var(--bc-ink)] bg-[var(--bc-ink)] px-1 text-[0.55rem] font-extrabold text-[var(--bc-sky)]">
                    +{p.dupe}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <ul className="flex flex-wrap gap-1.5">
            {[
              ["1 Ultimate", "ultimate"],
              ["1 Legendary", "legendary"],
              ["3 Epic", "epic"],
              ["115 shards", null],
            ].map(([text, tier]) => (
              <li
                key={text as string}
                className="bc-num rounded-md border-2 border-[var(--bc-ink)] bg-white/10 px-1.5 py-0.5 text-[0.7rem] font-extrabold"
                style={{ color: tier ? TIERS[tier as Tier].onDark : "var(--bc-white)" }}
              >
                {text}
              </li>
            ))}
          </ul>
          <span className="flex items-center gap-2">
            <span className="rounded-lg border-[3px] border-[var(--bc-ink)] bg-white/10 px-3 py-1.5 text-sm font-extrabold text-white">
              Skip
            </span>
            <span className="rounded-lg border-[3px] border-[var(--bc-ink)] bg-[var(--bc-yellow)] px-3 py-1.5 text-sm font-extrabold text-[var(--bc-ink)]">
              Pull again · <span className="bc-num">1,440</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const SCREENS = [
  {
    kicker: "Character sheet",
    title: "Give the sheet something to say.",
    body:
      "The shipped screen hands you two grids of silhouettes and the words SELECT AN UPGRADE. It won't tell you what Chad is good at, what an upgrade does, or what it costs until after you've clicked it. This pass puts his numbers on the page and moves the decision next to the thing being decided.",
    changes: [
      "Stats on screen, with the delta the purchase would apply",
      "Slots carry tier and level, so the board reads at a glance",
      "Current → next and price both land before you commit",
    ],
    caption: "Concept: the character sheet with Surfboard Smash selected; every icon is Chad’s own ability art.",
    panel: <CharacterSheet />,
  },
  {
    kicker: "Gacha banners",
    title: "Show the odds. All of them.",
    body:
      "A gacha screen that hides its rates is one players don't trust, and one a growing number of storefronts won't carry. So every rate is on the panel, the pity counter says exactly how far off the guarantee is, and the ten-pull discount is stated instead of implied.",
    changes: [
      "The full drop table, not a link to it",
      "Pity reads as progress, with the guarantee named",
      "Cost and discount sit on the button that spends",
    ],
    caption: "Concept: banner select with the featured rate-up and the full odds.",
    panel: <GachaBanners />,
  },
  {
    kicker: "Reward reveal",
    title: "One hero, then the receipts.",
    body:
      "The reveal spends its moment on a single card — the best thing in the pull — and then gets out of the way. The other nine land in a strip underneath where duplicates already show what they converted into, so nobody opens a second screen to work out whether ten pulls were worth it.",
    changes: [
      "Best pull is the hero; the other nine are a strip",
      "Duplicates show their shard conversion in place",
      "A skip that's visible from the first frame",
    ],
    caption: "Concept: the ten-pull result, resolved on one screen.",
    panel: <RewardReveal />,
  },
];

export default function Screens() {
  return (
    <section
      id="screens"
      className="bc-dots bc-cut-bottom relative -mt-[4.5vw] bg-[var(--bc-sky)] pt-[9vw] pb-[9vw] text-[var(--bc-ink)]"
    >
      <div className="mx-auto max-w-6xl px-6">
        <span className="bc-chip">
          <span>Redesign pass</span>
        </span>
        <h2 className="bc-display mt-5 text-[clamp(2.2rem,5.5vw,4.25rem)]">Three screens, second pass.</h2>
        <p className="mt-5 max-w-2xl text-lg font-semibold text-[var(--bc-ink)]/80">
          These three shipped, players used them, and the same note kept coming back: the screens look
          the part but make you guess. Each pass below keeps the art and fixes what the layout was
          hiding. Still mockups — the point is the hierarchy, not the pixels.
        </p>

        <div className="mt-14 flex flex-col gap-16 md:gap-24">
          {SCREENS.map((s) => (
            <article key={s.kicker}>
              <span className="bc-chip !bg-[var(--bc-navy)]">
                <span>{s.kicker}</span>
              </span>
              <h3 className="bc-display mt-4 text-[clamp(1.8rem,3.8vw,2.75rem)]">{s.title}</h3>

              <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-10">
                <p className="text-lg font-semibold leading-relaxed text-[var(--bc-ink)]/80">{s.body}</p>
                <div className="rounded-xl border-4 border-[var(--bc-ink)] bg-[var(--bc-cream)] p-4 shadow-[6px_7px_0_var(--bc-ink)]">
                  <div className="bc-display text-sm">What changed</div>
                  <ul className="mt-2.5 grid gap-2">
                    {s.changes.map((c) => (
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
                {s.panel}
                <figcaption className="mt-3 text-sm font-bold text-[var(--bc-ink)]/55">{s.caption}</figcaption>
              </figure>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
