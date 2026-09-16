/**
 * Concept UI for three Critter Cove screens: the capture ring mid-catch, the
 * field guide, and the cove's income pedestals.
 *
 * Two registers on purpose. Catch and cove are overlays on live play, so they
 * stay light and let the scene through. The field guide is a paper object the
 * player opens, so it is drawn as paper — edges, tape, a ribbon — rather than
 * as a panel with a border.
 *
 * Numbers are the game's own: species rates, caps and level archetypes from
 * cmd_zoo's catalog, moveset fill-speeds and the catch distance falloff from
 * its catching and wild-animal modules. Chrome is aria-hidden; the prose beside
 * each panel carries the meaning.
 */

import Image from "next/image";
import {
  A,
  CATCH,
  MOVESETS,
  SPECIES,
  THEME_COLOR,
  distanceMultiplier,
  type Species,
} from "./species";

function Critter({ id, className = "h-full w-full" }: { id: string; className?: string }) {
  return (
    <Image
      src={`${A}/critters/${id}.webp`}
      alt=""
      width={256}
      height={256}
      className={`${className} cc-sprite object-contain`}
    />
  );
}

function Biome({ theme }: { theme: string }) {
  const c = THEME_COLOR[theme] ?? "#9fb5a3";
  return (
    <span
      className="cc-chip !px-2 !py-0.5 !text-[0.7rem]"
      style={{ background: c, color: ["Void", "Jungle", "Taiga"].includes(theme) ? "#fff" : "var(--cc-ink)" }}
    >
      {theme}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* 1 — Catch                                                           */
/* ------------------------------------------------------------------ */

const TARGET = SPECIES.lava_lynx;
const MOVE = MOVESETS.find((m) => m.name === "Burster")!;
const DIST = 540;
const MULT = distanceMultiplier(DIST);
const FILL = 0.62;

/** Ring geometry — a hand-drawn arc rather than a UI progress circle. */
function CatchRing({ progress }: { progress: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(31,51,36,0.35)" strokeWidth="7" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="rgba(251,244,228,0.55)"
        strokeWidth="7"
        strokeDasharray="2 9"
        strokeLinecap="round"
      />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="var(--cc-leaf)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${c * progress} ${c}`}
      />
    </svg>
  );
}

function Catch() {
  return (
    <div className="relative overflow-hidden rounded-[22px]" aria-hidden>
      <Image
        src={`${A}/shot-5.jpg`}
        alt=""
        width={1279}
        height={716}
        sizes="(max-width: 1024px) 100vw, 60vw"
        className="aspect-[16/10] w-full object-cover sm:aspect-[16/9]"
      />

      {/* The ring sits on the critter, not in a corner. */}
      <div className="absolute top-1/2 left-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 sm:h-36 sm:w-36">
        <CatchRing progress={FILL} />
        <span className="absolute inset-0 grid place-items-center">
          <Critter id="lava_lynx" className="h-[52%] w-[52%]" />
        </span>
        {/* Name tag hangs off the ring like a luggage label. */}
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-[var(--cc-ink)] px-2.5 py-0.5 text-[0.65rem] font-extrabold whitespace-nowrap text-[var(--cc-cream)]">
          {TARGET.name}
        </span>
      </div>

      {/* Distance is the whole mechanic, so it gets said in words. */}
      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 p-3 sm:p-4">
        <div className="cc-hud px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="cc-display text-sm text-[var(--cc-cream)]">{MOVE.name}</span>
            <span className="cc-num rounded-full bg-[var(--cc-leaf)] px-1.5 text-[0.62rem] font-extrabold text-[var(--cc-ink)]">
              {MOVE.fill.toFixed(2)}/s
            </span>
          </div>
          <p className="mt-0.5 max-w-[22ch] text-[0.68rem] font-bold text-[var(--cc-cream)]/70">{MOVE.note}</p>
        </div>

        <div className="cc-hud px-3 py-2 text-right">
          <div className="text-[0.6rem] font-extrabold tracking-[0.16em] text-[var(--cc-cream)]/55 uppercase">
            Too far
          </div>
          <div className="cc-display text-lg text-[var(--cc-sun)]">×{MULT.toFixed(2)} fill</div>
          <div className="cc-num text-[0.62rem] font-bold text-[var(--cc-cream)]/60">
            Full speed within {CATCH.nearDist}
          </div>
        </div>
      </div>

      {/* Rare species need catching more than once; say which catch this is. */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5">
        {[true, false].map((done, i) => (
          <span
            key={i}
            className="h-2.5 w-7 rounded-full border border-[var(--cc-ink)]/40"
            style={{ background: done ? "var(--cc-sun)" : "rgba(251,244,228,0.3)" }}
          />
        ))}
        <span className="cc-num ml-1 text-[0.62rem] font-extrabold text-[var(--cc-cream)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
          Catch 2 of 2
        </span>
      </div>
    </div>
  );
}

/** The card the catch resolves into — a keepsake, not a stat sheet. */
function CritterCard({ s }: { s: Species }) {
  return (
    <div className="cc-paper mx-auto w-full max-w-xs p-5 pt-7" aria-hidden>
      <span className="cc-tape -top-2 left-1/2 -translate-x-1/2 -rotate-2" />
      <div className="cc-dots grid place-items-center rounded-xl border-2 border-[var(--cc-ink)]/15 py-4">
        <Critter id={s.id} className="h-24 w-24" />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="cc-display text-xl text-[var(--cc-ink)]">{s.name}</span>
        <Biome theme={s.theme} />
      </div>
      <p className="mt-1 text-[0.8rem] font-semibold text-[var(--cc-ink-soft)]">
        Caught in the volcanic scree, twice, after it set the grass on fire.
      </p>
      <dl className="mt-3 grid grid-cols-3 gap-2 border-t-2 border-dashed border-[var(--cc-ink)]/20 pt-3">
        {[
          ["Earns", `${s.rate}/s`],
          ["Holds", s.cap.toLocaleString()],
          ["Scales", s.arche.toLowerCase()],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-[0.58rem] font-extrabold tracking-[0.12em] text-[var(--cc-ink-soft)] uppercase">
              {k}
            </dt>
            <dd className="cc-display cc-num text-sm text-[var(--cc-green)]">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2 — Field guide                                                     */
/* ------------------------------------------------------------------ */

const GUIDE_FOREST = ["red_fox", "grey_wolf", "badger", "boar", "hedgehog", "field_mouse", "scamp", "bogtrot"];
const GUIDE_WATER = ["beaver", "heron", "blue_frog", "galaxy_whale", "comettail", "cogwhale"];
const CAUGHT = new Set(["red_fox", "grey_wolf", "badger", "hedgehog", "field_mouse", "beaver", "heron", "blue_frog", "comettail"]);

function GuideRow({ ids }: { ids: string[] }) {
  return (
    <ul className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-6">
      {ids.map((id) => {
        const s = SPECIES[id];
        const got = CAUGHT.has(id);
        return (
          <li key={id} className="text-center">
            <span className="relative grid aspect-square place-items-center rounded-lg border-2 border-[var(--cc-ink)]/15 bg-white/55">
              {got ? (
                <Critter id={id} className="h-[74%] w-[74%]" />
              ) : (
                // Unseen entries keep their silhouette so the shape is a clue.
                <span className="grid h-[74%] w-[74%] place-items-center opacity-[0.28] brightness-0">
                  <Critter id={id} className="h-full w-full" />
                </span>
              )}
              {s?.exotic && got && (
                <span className="absolute -top-1 -right-1 text-[0.7rem]" style={{ color: "var(--cc-sun)" }}>
                  ★
                </span>
              )}
            </span>
            <div className="mt-1 truncate text-[0.6rem] font-bold text-[var(--cc-ink-soft)]">
              {got ? s?.name : "— — —"}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function FieldGuide() {
  return (
    <div className="cc-paper relative p-5 sm:p-7" aria-hidden>
      <span className="cc-tape -top-2.5 left-8 -rotate-3" />
      <span className="cc-tape -top-2.5 right-10 rotate-2" />
      {/* Ribbon bookmark, tucked behind the page edge. */}
      <span className="cc-ribbon absolute top-0 right-7 h-14 w-5 bg-[var(--cc-coral)]" />

      <div className="flex flex-wrap items-end justify-between gap-3 pr-12">
        <div>
          <div className="cc-eyebrow">Field guide</div>
          <h4 className="cc-display mt-1 text-2xl text-[var(--cc-ink)] sm:text-3xl">Who I&apos;ve met</h4>
        </div>
        <div className="text-right">
          <div className="cc-display cc-num text-2xl text-[var(--cc-green)]">31</div>
          <div className="text-[0.62rem] font-extrabold tracking-[0.12em] text-[var(--cc-ink-soft)] uppercase">
            of 100+
          </div>
        </div>
      </div>

      {/* Hand-ruled divider rather than a border. */}
      <svg viewBox="0 0 600 6" preserveAspectRatio="none" className="mt-3 h-1.5 w-full" aria-hidden>
        <path
          d="M2 4 C 120 1, 260 6, 380 2 S 560 5, 598 3"
          fill="none"
          stroke="rgba(31,51,36,0.28)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <div className="mt-4 grid gap-5 md:grid-cols-2 md:gap-9">
        <section>
          <div className="flex items-baseline justify-between">
            <Biome theme="Forest" />
            <span className="cc-num text-[0.68rem] font-extrabold text-[var(--cc-ink-soft)]">6 / 8</span>
          </div>
          <GuideRow ids={GUIDE_FOREST} />
        </section>
        <section className="md:border-l-2 md:border-dashed md:border-[var(--cc-ink)]/15 md:pl-8">
          <div className="flex items-baseline justify-between">
            <Biome theme="Ocean" />
            <span className="cc-num text-[0.68rem] font-extrabold text-[var(--cc-ink-soft)]">4 / 6</span>
          </div>
          <GuideRow ids={GUIDE_WATER} />
        </section>
      </div>

      {/* A note in the margin, because a field guide is written in. */}
      <p className="mt-4 max-w-md -rotate-[0.6deg] text-[0.78rem] font-bold text-[var(--cc-ink-soft)] italic">
        &ldquo;Cogwhale won&apos;t surface while I&apos;m standing on the jetty. Try from the water.&rdquo;
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t-2 border-dashed border-[var(--cc-ink)]/20 pt-3">
        <span className="text-[0.62rem] font-extrabold tracking-[0.12em] text-[var(--cc-ink-soft)] uppercase">
          Crossbreeds
        </span>
        <span className="cc-num rounded-full bg-[var(--cc-ink)]/10 px-2 py-0.5 text-[0.68rem] font-extrabold text-[var(--cc-ink)]">
          3 found
        </span>
        <span className="text-[0.72rem] font-bold text-[var(--cc-ink-soft)]">
          Pairings you haven&apos;t tried stay blank — the guide won&apos;t spoil them.
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3 — Cove & pedestals                                                */
/* ------------------------------------------------------------------ */

const PEDESTALS: { id: string; level: number; pct: number }[] = [
  { id: "lion", level: 4, pct: 1 },
  { id: "giraffe", level: 2, pct: 0.46 },
  { id: "brown_bear", level: 3, pct: 0.78 },
  { id: "arctic_fox", level: 1, pct: 0.22 },
  { id: "butter_horse", level: 5, pct: 1 },
];

function Pedestal({ id, level, pct }: { id: string; level: number; pct: number }) {
  const s = SPECIES[id];
  const full = pct >= 1;
  return (
    <li className={`relative ${full ? "cc-atcap" : ""}`}>
      <div className="relative grid place-items-center">
        {full && (
          // At cap the critter has stopped earning. That's the only thing on
          // this screen worth interrupting the player for.
          <span className="absolute -top-3 z-10 rounded-full bg-[var(--cc-sun)] px-2 py-0.5 text-[0.58rem] font-extrabold whitespace-nowrap text-[var(--cc-ink)] shadow-[0_2px_0_rgba(31,51,36,0.35)]">
            Full
          </span>
        )}
        <Critter id={id} className="h-12 w-12 sm:h-16 sm:w-16" />
      </div>
      {/* The pedestal itself: a painted disc, not a card. */}
      <div
        className="mx-auto -mt-1.5 h-3 w-14 rounded-[999px] sm:w-20"
        style={{ background: "rgba(31,51,36,0.45)", boxShadow: "0 3px 0 rgba(31,51,36,0.25)" }}
      />
      <div className="cc-fill mx-auto mt-1.5 h-1.5 w-14 sm:w-20">
        <span
          style={{
            width: `${pct * 100}%`,
            background: full ? "var(--cc-sun)" : "var(--cc-leaf)",
          }}
        />
      </div>
      <div className="mt-1 text-center">
        <div className="cc-num text-[0.58rem] font-extrabold text-[var(--cc-cream)]">
          L{level} · {s.rate}/s
        </div>
        <div className="cc-num text-[0.55rem] font-bold text-[var(--cc-cream)]/55">
          {s.arche.toLowerCase()}
        </div>
      </div>
    </li>
  );
}

function Cove() {
  const fullCount = PEDESTALS.filter((p) => p.pct >= 1).length;
  return (
    <div className="relative overflow-hidden rounded-[22px]" aria-hidden>
      <Image
        src={`${A}/shot-2.jpg`}
        alt=""
        width={1095}
        height={721}
        sizes="(max-width: 1024px) 100vw, 60vw"
        className="aspect-[16/10] w-full object-cover sm:aspect-[16/9]"
      />
      <span
        aria-hidden
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(22,35,58,0.93) 0%, rgba(22,35,58,0.75) 22%, rgba(22,35,58,0.12) 58%)" }}
      />

      {/* Wallet, top-left, small. */}
      <div className="cc-hud absolute top-3 left-3 flex items-center gap-3 px-3 py-1.5">
        <span className="cc-num text-sm font-extrabold text-[var(--cc-sun)]">12,480</span>
        <span className="h-3 w-px bg-[var(--cc-cream)]/25" />
        <span className="cc-num text-sm font-extrabold text-[var(--cc-sky)]">6 helix</span>
      </div>

      {/* Two at cap, so the prompt names the number. */}
      <div className="absolute top-3 right-3">
        <span className="rounded-full bg-[var(--cc-sun)] px-3 py-1.5 text-xs font-extrabold text-[var(--cc-ink)] shadow-[0_3px_0_rgba(31,51,36,0.35)]">
          Collect {fullCount} full
        </span>
      </div>

      <ul className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-3 p-3 sm:gap-6 sm:p-5">
        {PEDESTALS.map((p) => (
          <Pedestal key={p.id} {...p} />
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const PANELS = [
  {
    kicker: "The catch",
    title: "Put the mechanic on the screen.",
    body:
      "The ring fills faster the closer you stand — full speed inside 260 units, tapering to a twelfth of that at long range — and every species sets its own base rate, from a Freezer at 0.18 a second to a Zigzagger at 0.42. Both numbers decide whether a catch is worth starting, so both are on screen: the moveset names itself and what it does to you, and the distance penalty is stated as a multiplier rather than implied by a slow bar. The ring is drawn on the animal, since that's where you're looking.",
    changes: [
      "Ring sits on the critter, not in a corner",
      "Moveset named, with what it will do to your catch",
      "Distance penalty shown as the multiplier it is",
      "Pips count which catch this is, for the twice-caught rare ones",
    ],
    caption: "Concept: a Lava Lynx mid-catch at long range. Fill rates and falloff are the real ones.",
    panel: (
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-center">
        <Catch />
        <CritterCard s={TARGET} />
      </div>
    ),
  },
  {
    kicker: "The field guide",
    title: "A book you write in, not a database.",
    body:
      "A hundred-plus species, and a collection screen is the one place a cozy game can be genuinely warm rather than efficient. So it's paper: taped at the corners, ruled by hand, with room in the margin for the note you leave yourself about where a thing hides. Unseen species keep their silhouette, because the shape is half the clue, and crossbreed pairings stay blank — the guide refuses to spoil them.",
    changes: [
      "Drawn as paper, with tape, a ribbon and a hand-ruled divider",
      "Unseen entries keep their silhouette as a hint",
      "Margin note for the thing the player worked out themselves",
      "Crossbreeds stay blank rather than listing what you haven't tried",
    ],
    caption: "Concept: two biome spreads, nine of fourteen found. Sprites are the shipped ones.",
    panel: <FieldGuide />,
  },
  {
    kicker: "The cove",
    title: "Say which one has stopped earning.",
    body:
      "Every critter accrues at its own rate into its own storage cap, and the moment it hits that cap it stops — a Lava Lynx at 18 a second fills five thousand in under five minutes and then sits there earning nothing. That's the only decision this screen has, so the full ones lift and label themselves and the collect prompt counts them. Everything else stays quiet: the wallet is small, the pedestals are painted discs, and the cove is what you're looking at.",
    changes: [
      "Full pedestals lift and label; the rest stay quiet",
      "Collect prompt counts what's actually waiting",
      "Rate and level scaling per pedestal, in the archetype's words",
      "HUD stays off the scene — this is a screen you sit and watch",
    ],
    caption: "Concept: five pedestals, two at cap. Rates, caps and archetypes are from the catalog.",
    panel: <Cove />,
  },
];

export default function Screens() {
  return (
    <section id="interface" className="cc-dots border-y border-black/10 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <span className="cc-eyebrow">Interface</span>
        <h2 className="cc-display mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)]">
          Three screens, designed against the numbers that already exist.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed font-semibold text-[var(--cc-ink-soft)]">
          Concepts, not the build. The rates, storage caps, level archetypes, moveset fill-speeds and
          catch falloff below are read out of the game&apos;s own catalog and combat modules, so these
          are layout decisions about real content.
        </p>

        <div className="mt-14 flex flex-col gap-16 md:gap-24">
          {PANELS.map((p) => (
            <article key={p.kicker}>
              <span className="cc-eyebrow">{p.kicker}</span>
              <h3 className="cc-display mt-3 text-[clamp(1.6rem,3.4vw,2.5rem)]">{p.title}</h3>

              <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-10">
                <p className="text-lg leading-relaxed font-semibold text-[var(--cc-ink-soft)]">{p.body}</p>
                <div className="cc-card p-5">
                  <div className="cc-display text-sm text-[var(--cc-green)]">What it does</div>
                  <ul className="mt-3 grid gap-2.5">
                    {p.changes.map((c) => (
                      <li key={c} className="flex gap-2.5 text-sm font-semibold text-[var(--cc-ink-soft)]">
                        <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--cc-leaf)]" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <figure className="mt-8">
                {p.panel}
                <figcaption className="mt-3 text-sm font-semibold text-[var(--cc-ink-soft)]">
                  {p.caption}
                </figcaption>
              </figure>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
