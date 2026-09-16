/**
 * Concept UI for the two screens that frame everything else: the main menu and
 * the dialogue presentation. Character art and key art are the game's own.
 */

import Image from "next/image";
import { A, CURRENCY } from "./catalog";
import { Label, Sprite, WindowBar } from "./panel";

/* ------------------------------------------------------------------ */
/* 1 — Main menu                                                       */
/* ------------------------------------------------------------------ */

const MENU = [
  { label: "Continue", note: "3.2B banked · 14h 22m", primary: true },
  { label: "New run", note: "Prestige 4" },
  { label: "Characters", note: "6 of 9 unlocked" },
  { label: "The Dealer", note: "3 contracts up" },
  { label: "Options" },
];

function MainMenu() {
  return (
    <div className="bc-window" aria-hidden>
      <WindowBar title="Main Menu" tag="NO LOAD SCREEN" />

      <div className="relative isolate aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:aspect-[16/9]">
        {/* The menu isn't a screen in front of the game — it's the game, parked. */}
        <Image
          src={`${A}/library_hero.jpg`}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover object-bottom"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[var(--bc-ink)]"
          style={{ clipPath: "polygon(0 58%, 100% 82%, 100% 100%, 0 100%)" }}
        />

        <div className="relative flex h-full flex-col justify-between p-3 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <Image
              src={`${A}/logo.png`}
              alt=""
              width={640}
              height={360}
              className="w-[52%] max-w-[230px] drop-shadow-[0_6px_0_rgba(0,0,0,0.25)] sm:w-[38%]"
            />
            <span className="flex items-center gap-1.5 rounded-lg border-[3px] border-[var(--bc-ink)] bg-white/90 px-2 py-1">
              <Sprite src={CURRENCY} className="h-4 w-4" />
              <span className="bc-num text-xs font-extrabold text-[var(--bc-ink)]">3.2B</span>
            </span>
          </div>

          <ul className="flex w-[min(88%,17rem)] flex-col gap-1.5 sm:w-[min(62%,17rem)]">
            {MENU.map((m) => (
              <li
                key={m.label}
                className={`flex items-baseline justify-between gap-2 rounded-lg border-[3px] border-[var(--bc-ink)] px-2.5 py-1.5 ${
                  m.primary
                    ? "bg-[var(--bc-yellow)] shadow-[4px_5px_0_var(--bc-ink)]"
                    : "bg-[var(--bc-ink)]/75 backdrop-blur"
                }`}
              >
                <span
                  className={`bc-display text-sm sm:text-base ${m.primary ? "text-[var(--bc-ink)]" : "text-white"}`}
                >
                  {m.label}
                </span>
                {m.note && (
                  <span
                    className={`bc-num truncate text-[0.6rem] font-extrabold ${
                      m.primary ? "text-[var(--bc-ink)]/65" : "text-white/50"
                    }`}
                  >
                    {m.note}
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-end justify-between gap-3 text-[0.6rem] font-extrabold text-white/50">
            <span className="bc-num">Slot 1 · v1.1.5</span>
            <span className="bc-num">Season 01 ends in 12d</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* The transition, as a storyboard rather than a claim. */
const BEATS = [
  { shot: "library_hero.jpg", step: "01", title: "At rest", body: "The scene is live. Grass moves, the banana idles." },
  { shot: "ss2.jpg", step: "02", title: "Push in", body: "Menu sheds outward, camera dollies to the plot." },
  { shot: "ss3.jpg", step: "03", title: "Playing", body: "Same camera, same scene. Nothing reloaded." },
];

function TransitionStrip() {
  return (
    <div className="bc-window" aria-hidden>
      <WindowBar title="Menu → Play" tag="ONE SHOT" tagFill="var(--bc-sky)" />
      <ol className="grid gap-3 p-4 sm:grid-cols-3 sm:p-5">
        {BEATS.map((b) => (
          <li key={b.step} className="rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-navy-deep)] p-2.5">
            <div className="relative overflow-hidden rounded-lg border-[3px] border-[var(--bc-ink)]">
              <Image
                src={`${A}/${b.shot}`}
                alt=""
                width={1280}
                height={720}
                sizes="(max-width: 640px) 90vw, 30vw"
                className="aspect-[16/9] w-full object-cover object-bottom"
              />
              <span className="bc-display absolute top-1 left-1 rounded border-2 border-[var(--bc-ink)] bg-[var(--bc-yellow)] px-1 text-[0.6rem] text-[var(--bc-ink)]">
                {b.step}
              </span>
            </div>
            <div className="bc-display mt-2 text-sm text-white">{b.title}</div>
            <p className="text-[0.7rem] font-bold text-white/60">{b.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2 — Dialogue                                                        */
/* ------------------------------------------------------------------ */

const MOODS = [
  { slug: "dealer-neutral", name: "Neutral" },
  { slug: "dealer-scheming", name: "Scheming" },
  { slug: "dealer-amused", name: "Amused" },
  { slug: "dealer-annoyed", name: "Annoyed" },
];

function Dialogue() {
  return (
    <div className="bc-window" aria-hidden>
      <WindowBar title="Dialogue" tag="THE DEALER" tagFill="var(--bc-coral)" tagInk="var(--bc-white)" />

      <div className="relative isolate aspect-[16/10] overflow-hidden sm:aspect-[16/9]">
        <Image
          src={`${A}/ss2.jpg`}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="scale-105 object-cover object-center blur-[2px]"
        />
        {/* The scene dims rather than disappearing behind a black bar. */}
        <div aria-hidden className="absolute inset-0 bg-[var(--bc-navy-deep)]/70" />

        <div className="relative flex h-full items-end gap-2 p-3 sm:gap-4 sm:p-5">
          <Image
            src={`${A}/cast/dealer-scheming.webp`}
            alt=""
            width={620}
            height={493}
            sizes="(max-width: 640px) 40vw, 20vw"
            className="w-[34%] max-w-[210px] self-end object-contain drop-shadow-[6px_6px_0_rgba(0,0,0,0.35)]"
          />

          <div className="min-w-0 flex-1 pb-1">
            <span className="bc-chip !bg-[var(--bc-coral)]">
              <span>The Dealer</span>
            </span>
            {/* Box is sized to the line, not to the screen. */}
            <div className="mt-1.5 rounded-xl border-[3px] border-[var(--bc-ink)] bg-[var(--bc-ink)]/90 p-3 backdrop-blur">
              <p className="text-sm leading-snug font-bold text-white sm:text-base">
                Look who wandered in. You&apos;ve got the smell of a newcomer and the pockets of one too.
                <span className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 bg-[var(--bc-yellow)]" />
              </p>

              <ul className="mt-2.5 grid gap-1.5">
                {[
                  { text: "“Who's asking?”", tone: "var(--bc-sky)" },
                  { text: "“Show me the contracts.”", tone: "var(--bc-yellow)", pick: true },
                ].map((c) => (
                  <li
                    key={c.text}
                    className={`rounded-lg border-[3px] px-2.5 py-1.5 text-xs font-extrabold sm:text-sm ${
                      c.pick ? "bg-white/15" : "bg-white/5"
                    }`}
                    style={{ borderColor: c.pick ? c.tone : "rgba(255,255,255,0.18)", color: c.tone }}
                  >
                    {c.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-1.5 flex items-center justify-between gap-2 text-[0.6rem] font-extrabold text-white/55 uppercase">
              <span className="flex gap-1.5">
                {["Auto", "Skip", "Log"].map((b) => (
                  <span key={b} className="rounded border-2 border-white/25 px-1.5 py-0.5">
                    {b}
                  </span>
                ))}
              </span>
              <span className="bc-num">3 / 11</span>
            </div>
          </div>
        </div>
      </div>

      {/* The line picks the portrait, so the same box carries a different read. */}
      <div className="border-t-[3px] border-[var(--bc-ink)] bg-[var(--bc-navy-deep)] px-4 py-3 sm:px-5">
        <Label>Portrait follows the line</Label>
        <ul className="mt-2 grid grid-cols-4 gap-2">
          {MOODS.map((m) => (
            <li key={m.slug} className="text-center">
              <span className="bc-slot grid aspect-square place-items-center overflow-hidden bg-[var(--bc-navy)]">
                <Image
                  src={`${A}/cast/${m.slug}.webp`}
                  alt=""
                  width={620}
                  height={520}
                  sizes="15vw"
                  className="h-[88%] w-[88%] object-contain"
                />
              </span>
              <div className="mt-1 text-[0.6rem] font-extrabold tracking-wider text-white/50 uppercase">{m.name}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function FrontDoor() {
  return (
    <section
      id="front-door"
      className="bc-dots-light bc-cut-bottom-alt relative -mt-[4.5vw] bg-[var(--bc-ink)] pt-[9vw] pb-[9vw] text-white"
    >
      <div className="mx-auto max-w-6xl px-6">
        <span className="bc-chip !bg-[var(--bc-yellow)] !text-[var(--bc-ink)]">
          <span>The front door</span>
        </span>
        <h2 className="bc-display bc-outline-yellow mt-5 text-[clamp(2.2rem,5.5vw,4.25rem)]">
          The first ten seconds.
        </h2>
        <p className="mt-5 max-w-2xl text-lg font-semibold text-white/75">
          Two screens everyone sees and nobody designs twice: the menu you open the game into, and the
          box a character talks out of. Both are mockups.
        </p>

        <article className="mt-14">
          <span className="bc-chip !bg-[var(--bc-sky)] !text-[var(--bc-ink)]">
            <span>Main menu</span>
          </span>
          <h3 className="bc-display mt-4 text-[clamp(1.8rem,3.8vw,2.75rem)]">Don&apos;t cut. Push in.</h3>

          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-10">
            <p className="text-lg font-semibold leading-relaxed text-white/75">
              A clicker earns nothing from a menu that sits in front of a loading bar. So the menu is the
              scene: the plot is already rendered, the banana is already idling, and Continue dollies the
              camera down into it rather than cutting away. Same idea as the page you&apos;re reading —
              the key art is the first thing, and the buttons live inside it.
            </p>
            <div className="rounded-xl border-4 border-[var(--bc-ink)] bg-white p-4 text-[var(--bc-ink)] shadow-[6px_7px_0_var(--bc-yellow-deep)]">
              <div className="bc-display text-sm">What it buys</div>
              <ul className="mt-2.5 grid gap-2">
                {[
                  "No load screen between menu and first click",
                  "Continue states its save before you commit to it",
                  "Menu doubles as the attract screen for a trailer",
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

          <figure className="mt-8 grid gap-5">
            <MainMenu />
            <TransitionStrip />
            <figcaption className="text-sm font-bold text-white/50">
              Concept: the menu, and the three beats between pressing Continue and playing. Frames two and
              three are real screenshots standing in for the camera move.
            </figcaption>
          </figure>
        </article>

        <article className="mt-16 md:mt-24">
          <span className="bc-chip !bg-[var(--bc-sky)] !text-[var(--bc-ink)]">
            <span>Dialogue</span>
          </span>
          <h3 className="bc-display mt-4 text-[clamp(1.8rem,3.8vw,2.75rem)]">Give the box less screen.</h3>

          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-10">
            <p className="text-lg font-semibold leading-relaxed text-white/75">
              The shipped version hands a black bar the bottom third of the screen whether the line is
              twenty words or four. This one dims the scene instead of covering it, sizes the box to the
              line, and puts the Dealer&apos;s seven existing expressions to work — the art is already in
              the project, it just never gets picked per line. Choices sit inside the same box, so your
              eye never leaves it.
            </p>
            <div className="rounded-xl border-4 border-[var(--bc-ink)] bg-white p-4 text-[var(--bc-ink)] shadow-[6px_7px_0_var(--bc-yellow-deep)]">
              <div className="bc-display text-sm">What changed</div>
              <ul className="mt-2.5 grid gap-2">
                {[
                  "Box fits the line; the scene stays visible behind it",
                  "Portrait swaps on mood — art that already exists",
                  "Choices live in the box, colour-coded by tone",
                  "Auto, skip and a backlog, plus a line counter",
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
            <Dialogue />
            <figcaption className="mt-3 text-sm font-bold text-white/50">
              Concept: a Dealer scene mid-choice. All four portraits ship in the game already.
            </figcaption>
          </figure>
        </article>
      </div>
    </section>
  );
}
