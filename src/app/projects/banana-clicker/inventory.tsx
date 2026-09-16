/**
 * Concept UI for the inventory and the gear tooltip.
 *
 * Gear sprites are the game's own. Same rules as the other panels: markup, not
 * screenshots, and the chrome is aria-hidden because the numbers are set
 * dressing — the prose beside each panel carries the meaning.
 */

import Image from "next/image";
import { A, ITEM, ITEMS, SOCKETS, type Item } from "./catalog";
import { TIERS, ULTIMATE_SHEEN, type Tier } from "./tiers";

function tierFill(tier: Tier) {
  return tier === "ultimate" ? ULTIMATE_SHEEN : TIERS[tier].fill;
}

function Sprite({ slug, className = "h-[74%] w-[74%]" }: { slug: string; className?: string }) {
  return (
    <Image
      src={`${A}/items/${slug}.webp`}
      alt=""
      width={256}
      height={256}
      className={`${className} object-contain`}
    />
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[0.65rem] font-extrabold tracking-[0.16em] text-white/55 uppercase">{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Gear slot — the unit the whole screen is built from                 */
/* ------------------------------------------------------------------ */

type SlotState = { equipped?: boolean; isNew?: boolean; count?: number; selected?: boolean };

function GearSlot({ item, state = {}, size = "grid" }: { item: Item; state?: SlotState; size?: "grid" | "lg" }) {
  const t = TIERS[item.tier];
  return (
    <span
      className={`bc-slot grid aspect-square place-items-center ${
        state.selected ? "outline-[3px] outline-offset-2 outline-[var(--bc-yellow)]" : ""
      }`}
      style={{ background: tierFill(item.tier), color: t.ink }}
    >
      {/* Tier is the frame; the sprite sits on a near-white plate so it stays legible. */}
      <span aria-hidden className="absolute inset-[3px] rounded-[7px]" style={{ background: t.plate }} />
      <Sprite slug={item.slug} className={`relative ${size === "lg" ? "h-[68%] w-[68%]" : "h-[70%] w-[70%]"}`} />

      {/* Equipped is a corner flag rather than a colour change — tier already owns colour. */}
      {state.equipped && (
        <span className="absolute top-0 left-0 grid h-5 w-5 place-items-center rounded-tl-[7px] rounded-br-lg border-r-[3px] border-b-[3px] border-[var(--bc-ink)] bg-[var(--bc-ink)] text-[var(--bc-sky)]">
          <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden>
            <path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
      {state.isNew && (
        <span className="bc-display absolute -top-2 -right-2 rotate-6 rounded border-2 border-[var(--bc-ink)] bg-[var(--bc-coral)] px-1 text-[0.55rem] text-white">
          New
        </span>
      )}
      {state.count && state.count > 1 && (
        <span className="bc-num absolute right-0.5 bottom-0.5 rounded bg-[var(--bc-ink)] px-1 text-[0.6rem] font-extrabold text-white">
          ×{state.count}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* 1 — Inventory                                                       */
/* ------------------------------------------------------------------ */

const BAG: { slug: string; state?: SlotState }[] = [
  { slug: "astro-helm", state: { isNew: true, selected: true } },
  { slug: "molt-wings", state: { equipped: true } },
  { slug: "warchief-mask", state: { equipped: true } },
  { slug: "void-blot", state: { isNew: true } },
  { slug: "tide-trident" },
  { slug: "halo" },
  { slug: "bloomjelly" },
  { slug: "jack-o-peel" },
  { slug: "crimson-drape", state: { count: 3 } },
  { slug: "kite-pauldron" },
  { slug: "rubber-nana" },
  { slug: "reef-skirt", state: { equipped: true } },
  { slug: "fume-filter" },
  { slug: "reef-rig", state: { count: 2 } },
  { slug: "teal-returner" },
  { slug: "frost-shards" },
  { slug: "rivet-gauntlet" },
  { slug: "autumn-visor", state: { count: 4 } },
  { slug: "plain-banana", state: { count: 9 } },
  { slug: "lucky-sock" },
];

const SELECTED = ITEM["astro-helm"];

function Inventory() {
  return (
    <div className="bc-window" aria-hidden>
      <div className="bc-window-bar">
        <span className="bc-window-title text-lg">Inventory</span>
        <span className="bc-num shrink-0 rounded-md bg-[var(--bc-yellow)] px-2 py-0.5 text-xs font-extrabold whitespace-nowrap text-[var(--bc-ink)]">
          20 / 60
        </span>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)] lg:gap-5 lg:p-5">
        <div>
          {/* Filters as one row of controls, not a column of radio buttons. */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex overflow-hidden rounded-lg border-[3px] border-[var(--bc-ink)] text-xs font-extrabold">
              {["All", ...SOCKETS.map((s) => s.name)].map((tab) => (
                <span
                  key={tab}
                  className={`px-2.5 py-1 ${tab === "All" ? "bg-[var(--bc-yellow)] text-[var(--bc-ink)]" : "bg-white/10 text-white/70"}`}
                >
                  {tab}
                </span>
              ))}
            </span>

            <span className="ml-auto flex items-center gap-1.5 rounded-lg border-[3px] border-[var(--bc-ink)] bg-white/10 px-2.5 py-1 text-xs font-extrabold text-white/70">
              Sort: Tier
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3" aria-hidden>
                <path d="M12 16 5 8h14z" />
              </svg>
            </span>
          </div>

          {/* Tier filter reuses the ladder's colours, so the chips teach themselves. */}
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {(Object.keys(TIERS) as Tier[]).map((tier) => {
              const on = tier === "legendary" || tier === "mythic" || tier === "ultimate";
              return (
                <li
                  key={tier}
                  className="flex items-center gap-1.5 rounded-md border-2 border-[var(--bc-ink)] px-1.5 py-0.5 text-[0.7rem] font-extrabold"
                  style={{
                    background: on ? TIERS[tier].fill : "rgba(255,255,255,0.08)",
                    color: on ? TIERS[tier].ink : "rgba(255,255,255,0.45)",
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full border border-[var(--bc-ink)]"
                    style={{ background: tierFill(tier) }}
                  />
                  {TIERS[tier].name}
                </li>
              );
            })}
          </ul>

          <ul className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-7">
            {BAG.map(({ slug, state }) => (
              <li key={slug}>
                <GearSlot item={ITEM[slug]} state={state} />
              </li>
            ))}
            {Array.from({ length: 8 }, (_, i) => (
              <li key={`empty-${i}`} className="bc-socket-empty aspect-square" />
            ))}
          </ul>
        </div>

        {/* Detail rail: what's selected, and what swapping it would cost you */}
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-navy-deep)] p-3.5">
            <Label>Equipped preview</Label>
            <div className="mt-2 grid place-items-center rounded-lg border-[3px] border-[var(--bc-ink)] bg-[var(--bc-navy)] py-3">
              <Image
                src={`${A}/items/banana-base.webp`}
                alt=""
                width={360}
                height={360}
                className="h-24 w-auto object-contain"
              />
            </div>
            <ul className="mt-2 grid grid-cols-3 gap-2">
              {SOCKETS.map((s) => {
                const worn = BAG.find(
                  (b) => b.state?.equipped && ITEM[b.slug].socket === s.id,
                );
                return (
                  <li key={s.id}>
                    {worn ? (
                      <GearSlot item={ITEM[worn.slug]} />
                    ) : (
                      <span className="bc-socket-empty grid aspect-square" />
                    )}
                    <div className="mt-1 text-center text-[0.6rem] font-extrabold tracking-wider text-white/45 uppercase">
                      {s.name}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-navy-deep)] p-3.5">
            <div className="flex items-start gap-3">
              <span className="h-14 w-14 shrink-0">
                <GearSlot item={SELECTED} size="lg" />
              </span>
              <div className="min-w-0">
                <div className="bc-display text-base text-white">{SELECTED.name}</div>
                <span className="bc-stamp" style={{ color: TIERS[SELECTED.tier].onDark }}>
                  Ultimate · Top
                </span>
              </div>
            </div>

            <ul className="mt-3 grid gap-1.5">
              {[
                ["Click power", "+248%", 92],
                ["Crit chance", "+6.4%", 61],
                ["Storm length", "+6s", 78],
              ].map(([stat, value, roll]) => (
                <li key={stat as string}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white/70">{stat}</span>
                    <span className="bc-num text-sm font-extrabold text-[var(--bc-yellow)]">{value}</span>
                  </div>
                  {/* Roll quality: where this copy landed inside the stat's range. */}
                  <div className="bc-meter bc-meter-dark bc-meter-thin mt-1 h-2.5">
                    <span style={{ width: `${roll}%`, background: "var(--bc-sky)" }} />
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex items-center gap-2">
              <span className="rounded-lg border-[3px] border-[var(--bc-ink)] bg-[var(--bc-yellow)] px-3 py-1.5 text-sm font-extrabold text-[var(--bc-ink)]">
                Equip
              </span>
              <span className="flex items-center gap-1.5 rounded-lg border-[3px] border-[var(--bc-ink)] bg-white/10 px-2.5 py-1.5 text-sm font-extrabold text-white">
                Reroll
                <Image
                  src={`${A}/upgrades/currency-banana.webp`}
                  alt=""
                  width={128}
                  height={128}
                  className="h-4 w-4 object-contain"
                />
                <span className="bc-num">10</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2 — Tooltips                                                        */
/* ------------------------------------------------------------------ */

function Tip({
  item,
  subtitle,
  stats,
  set,
  flavor,
  footer,
}: {
  item: Item;
  subtitle: string;
  stats: { stat: string; value: string; roll?: number; delta?: "up" | "down" }[];
  set?: { name: string; have: number; of: number; bonus: string; active: boolean }[];
  flavor?: string;
  footer?: string;
}) {
  const t = TIERS[item.tier];
  return (
    <div className="bc-tip">
      {/* The tier band does the identifying, so the name doesn't have to shout it. */}
      <div
        className="flex items-center gap-2.5 border-b-[3px] border-[var(--bc-ink)] px-3 py-2"
        style={{ background: tierFill(item.tier), color: t.ink }}
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border-2 border-[var(--bc-ink)] bg-white/35">
          <Sprite slug={item.slug} className="h-[80%] w-[80%]" />
        </span>
        <span className="min-w-0">
          <span className="bc-display block truncate text-sm">{item.name}</span>
          <span className="block text-[0.65rem] font-extrabold tracking-wider uppercase opacity-85">{subtitle}</span>
        </span>
      </div>

      <div className="px-3 py-2.5">
        <ul className="grid gap-1.5">
          {stats.map((s) => (
            <li key={s.stat}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[0.7rem] font-bold text-white/70">{s.stat}</span>
                <span
                  className="bc-num text-xs font-extrabold"
                  style={{
                    color:
                      s.delta === "up"
                        ? "var(--bc-leaf, #8fdc6a)"
                        : s.delta === "down"
                          ? "var(--bc-coral-light)"
                          : "var(--bc-yellow)",
                  }}
                >
                  {s.delta === "up" ? "▲ " : s.delta === "down" ? "▼ " : ""}
                  {s.value}
                </span>
              </div>
              {s.roll !== undefined && (
                <div className="bc-meter bc-meter-dark bc-meter-thin mt-1 h-2.5">
                  <span style={{ width: `${s.roll}%`, background: "var(--bc-sky)" }} />
                </div>
              )}
            </li>
          ))}
        </ul>

        {set && (
          <div className="mt-2.5 border-t-2 border-white/10 pt-2">
            {set.map((b) => (
              <div key={`${b.name}-${b.of}-${b.bonus}`} className={b.active ? "" : "opacity-40"}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[0.7rem] font-extrabold" style={{ color: TIERS.rare.onDark }}>
                    {b.name}
                  </span>
                  <span className="bc-num text-[0.7rem] font-extrabold text-white/60">
                    {b.have} / {b.of}
                  </span>
                </div>
                <p className="text-[0.68rem] font-bold text-white/60">{b.bonus}</p>
              </div>
            ))}
          </div>
        )}

        {flavor && (
          <p className="mt-2.5 border-t-2 border-white/10 pt-2 text-[0.68rem] font-bold text-white/45 italic">
            {flavor}
          </p>
        )}
      </div>

      {footer && (
        <div className="border-t-[3px] border-[var(--bc-ink)] bg-black/25 px-3 py-1.5 text-[0.62rem] font-extrabold tracking-wide text-white/50 uppercase">
          {footer}
        </div>
      )}
    </div>
  );
}

function Tooltips() {
  return (
    <div className="bc-window" aria-hidden>
      <div className="bc-window-bar">
        <span className="bc-window-title text-lg">Tooltip states</span>
        <span className="bc-num shrink-0 rounded-md bg-[var(--bc-sky)] px-2 py-0.5 text-xs font-extrabold whitespace-nowrap text-[var(--bc-ink)]">
          3 VARIANTS
        </span>
      </div>

      <div className="grid gap-5 p-4 sm:p-5 md:grid-cols-3">
        <figure className="flex flex-col gap-2">
          <Tip
            item={ITEM["lucky-sock"]}
            subtitle="Common · Bottom"
            stats={[{ stat: "Idle rate", value: "+4.2%", roll: 38 }]}
            flavor="Warm. Suspiciously warm."
          />
          <figcaption className="text-[0.7rem] font-bold text-white/50">
            Common: one stat, one line. The card shrinks to what it has to say.
          </figcaption>
        </figure>

        <figure className="flex flex-col gap-2">
          <Tip
            item={ITEM["reef-rig"]}
            subtitle="Rare · Top"
            stats={[
              { stat: "Click power", value: "+31%", roll: 74 },
              { stat: "Crit chance", value: "+2.1%", roll: 22 },
            ]}
            set={[
              { name: "Reef Set", have: 2, of: 4, bonus: "2 pcs — +15% crit damage", active: true },
              { name: "Reef Set", have: 2, of: 4, bonus: "4 pcs — crits refund a click", active: false },
            ]}
            flavor="Fogs up. Still better than squinting."
            footer="Shift — compare"
          />
          <figcaption className="text-[0.7rem] font-bold text-white/50">
            Rare with a set: unearned tiers stay visible but dimmed, so you can see what you&apos;re chasing.
          </figcaption>
        </figure>

        <figure className="flex flex-col gap-2">
          <Tip
            item={ITEM["astro-helm"]}
            subtitle="Ultimate · Top — vs equipped"
            stats={[
              { stat: "Click power", value: "+217%", delta: "up" },
              { stat: "Crit chance", value: "−1.8%", delta: "down" },
              { stat: "Storm length", value: "+6s", delta: "up" },
            ]}
            flavor="One small step for a banana."
            footer="Comparing against Warchief Mask"
          />
          <figcaption className="text-[0.7rem] font-bold text-white/50">
            Compare mode: absolute values give way to the difference, in both directions.
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function InventorySection() {
  return (
    <section
      id="inventory"
      className="bc-dots relative -mt-[4.5vw] bg-[var(--bc-cream)] pt-[9vw] pb-20 text-[var(--bc-ink)]"
    >
      <div className="mx-auto max-w-6xl px-6">
        <span className="bc-chip">
          <span>Inventory &amp; tooltips</span>
        </span>
        <h2 className="bc-display mt-5 text-[clamp(2.2rem,5.5vw,4.25rem)]">
          Everything you own, and what it&apos;s worth.
        </h2>
        <p className="mt-5 max-w-2xl text-lg font-semibold text-[var(--bc-ink)]/80">
          The shipped inventory is {ITEMS.length * 3} identical white squares and a right rail reading ITEM
          NAME. Tier, rolls, duplicates, and set progress all exist in the data already — none of it
          reaches the screen. Gear art below is the game&apos;s own, straight out of the sprite sheet.
        </p>

        <article className="mt-14">
          <span className="bc-chip !bg-[var(--bc-navy)]">
            <span>The bag</span>
          </span>
          <h3 className="bc-display mt-4 text-[clamp(1.8rem,3.8vw,2.75rem)]">Colour carries the tier.</h3>

          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-10">
            <p className="text-lg font-semibold leading-relaxed text-[var(--bc-ink)]/80">
              Once the slot is tier-coloured, the filter column stops earning its keep — you can see the
              legendaries without asking for them. That frees the whole left rail, which goes back to the
              grid, and the filters collapse into one row above it. The right rail then has room to answer
              the only question that screen exists for: is this better than what I&apos;m wearing?
            </p>
            <div className="rounded-xl border-4 border-[var(--bc-ink)] bg-white p-4 shadow-[6px_7px_0_var(--bc-ink)]">
              <div className="bc-display text-sm">What changed</div>
              <ul className="mt-2.5 grid gap-2">
                {[
                  "Slots carry tier, equipped state, and stack count",
                  "Filters become one row; the grid takes the rail back",
                  "Equipped preview shows all three sockets at once",
                  "Roll quality is a bar, because the number alone means nothing",
                ].map((c) => (
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
            <Inventory />
            <figcaption className="mt-3 text-sm font-bold text-[var(--bc-ink)]/55">
              Concept: the bag with Astro Helm selected. Every sprite here ships in the game.
            </figcaption>
          </figure>
        </article>

        <article className="mt-16 md:mt-24">
          <span className="bc-chip !bg-[var(--bc-navy)]">
            <span>Tooltips</span>
          </span>
          <h3 className="bc-display mt-4 text-[clamp(1.8rem,3.8vw,2.75rem)]">One card, three jobs.</h3>

          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-10">
            <p className="text-lg font-semibold leading-relaxed text-[var(--bc-ink)]/80">
              A tooltip has to identify the thing, quantify it, and — when you&apos;re already wearing
              something in that socket — settle an argument. Rather than three different cards, it&apos;s one
              layout that grows: the tier band and name always, stats when there are stats, set progress
              when the item belongs to one, and a compare mode that swaps absolute numbers for deltas.
            </p>
            <div className="rounded-xl border-4 border-[var(--bc-ink)] bg-white p-4 shadow-[6px_7px_0_var(--bc-ink)]">
              <div className="bc-display text-sm">Rules it follows</div>
              <ul className="mt-2.5 grid gap-2">
                {[
                  "Sections appear only when they have content",
                  "Roll bars show where a stat landed in its range",
                  "Unearned set tiers stay visible, dimmed",
                  "Up and down are arrows as well as colours",
                ].map((c) => (
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
            <Tooltips />
            <figcaption className="mt-3 text-sm font-bold text-[var(--bc-ink)]/55">
              Concept: the same tooltip at three sizes — minimal, full, and comparing.
            </figcaption>
          </figure>
        </article>
      </div>
    </section>
  );
}
