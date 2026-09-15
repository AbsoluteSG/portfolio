import Image from "next/image";
import Link from "next/link";
import { Parallax } from "./parallax";

const A = "/projects/no-dogs-allowed";
const WIKI = "https://siphongames.vercel.app";
const CONTACT = "mailto:alex.zvili01@gmail.com?subject=No%20Dogs%20Allowed";

const pillars = [
  {
    n: "01",
    title: "Cook",
    lead: "The restaurant is the hub, and the reason for everything.",
    body: "Ingredients come in from the districts; recipes turn them into dishes; dishes are how a kitchen finds people. Every system in the game eventually feeds the kitchen — literally.",
    color: "var(--nda-gold)",
  },
  {
    n: "02",
    title: "Fight",
    lead: "Edged tools from a vendor who won't discuss previous owners.",
    body: "Hitbox-driven combat with attack chaining, a parry that ripples the whole screen, and bosses with a point of view — an old warthog who fights on all fours, a Marshal with a Seat at the Table.",
    color: "var(--nda-red)",
    image: "splash.jpg",
    alt: "Whiskers caught in chains, teeth gritted",
  },
  {
    n: "03",
    title: "Grow & fish",
    lead: "Forty cultivars, and Maya knows which will sulk on which terrace.",
    body: "Crop plots, seeds, tree crops, and fishing regions with their own catch tables. Wandering is allowed in Milliden Hollow; it asks nothing of you.",
    color: "var(--nda-green)",
    image: "backyard.jpg",
    alt: "A backyard garden behind the restaurant",
  },
  {
    n: "04",
    title: "Roam",
    lead: "Six districts, west to east, defined by what they do to an ingredient.",
    body: "An interconnected 2D world with mounts from the Wilds, fast travel, weather, and gates run by two armadillos who have the regulations by heart. Controller and keyboard are both first-class.",
    color: "var(--nda-teal)",
  },
];

const districts = [
  { name: "The Great Tree", what: "A hollow trunk at the world's western edge. Whiskers' family restaurant is a deck thirty tiles up it.", role: "Home. The hub the whole game returns to." },
  { name: "Milliden Hollow", what: "Crop terraces, an irrigation channel, a barn, a windmill. Growers.", role: "The first district. Where wandering is allowed." },
  { name: "Claypot Ward", what: "Kilns, warehouses, refineries. Where a crop becomes an ingredient.", role: "The working world. Loud, busy, and not sinister." },
  { name: "Highspice Row", what: "Ornate restaurants, grand dining halls, the Gilded Exchange.", role: "Where the money is, and where the money declines to ask questions." },
  { name: "Basinrun", what: "The agrarian heart and the outermost district. Seraphin's command.", role: "One bad season from the Wilds taking it." },
  { name: "The Underroot", what: "Named once, in shipped dialogue, as a buyer.", role: "Undefined on purpose." },
];

const cast = [
  { id: "whiskers", name: "Whiskers", who: "Cat, fifteen. The player.", bio: "The only child of a restaurant. Small, fast, and possessed of a stubbornness that reads as bravery from a distance and as a problem up close. He starts with no weapon, no money, no plan, and one piece of cloth.", accent: "#e8e2d8", tall: true },
  { id: "slick", name: "Slick", who: "Cat. Weapons vendor.", bio: "Deals in edged tools out of the Claypot cargo depots, where a great deal of paperwork changes hands and very little of it is read twice.", accent: "#f5a623", tall: true },
  { id: "pipette", name: "Pipette", who: "Rat. Jester of Claypot Ward.", bio: "Motley, bells and all. Plays the kilns and workshops for whoever is coming off a shift — quick, warm, a little chaotic, and never once mean with it.", accent: "#c0603a", tall: true },
  { id: "maya", name: "Maya", who: "Cat. Seed and gardening vendor.", bio: "Sells seed out of a stall in Milliden Hollow, in a sun hat considerably wider than she is. Gentle, unhurried, and genuinely interested.", accent: "#f2a7c3", tall: false },
  { id: "gristle", name: "Gristle", who: "Warthog. Boss, then NPC.", bio: "An old warthog gone thick through the shoulders, tusks dulled and scarred. Runs his crew out of a dead pickling plant. A subcontractor who does not know he is a subcontractor.", accent: "#8a5a3c", tall: false },
  { id: "seraphin", name: "Seraphin", who: "Black panther. The Marshal.", bio: "The Seat of the Dominion Culinary Table that answers for Basinrun — its defence, its logistics, its borders. Revered at home to the point of religion. Boss, then NPC.", accent: "#7b5ea7", tall: false },
];

const tech = [
  ["Unity 6 · URP 2D", "Cinemachine, the new Input System, DOTween, Odin"],
  ["55k lines of C#", "nine assembly definitions with a strict one-directional dependency graph: Core → Data → Systems → Gameplay → UI"],
  ["Data-driven everything", "items, recipes, crops, fish, combat profiles, loot, and quests are inert ScriptableObjects; services act on them through a ServiceLocator"],
  ["Quests as conditions", "typed conditions evaluated against an event bus — success, failure, gate, branch, modifier"],
  ["GOAP enemy AI", "goal-oriented planners for the things that hunt you"],
  ["FMOD + Yarn Spinner", "adaptive audio; dialogue as scripts the writers own"],
  ["A story tool", "a separate Next.js app that draws the branching plot graph and the cast, so the writing and the game stay in sync"],
  ["A team", "I lead engineering and direct a distributed group of artists and composers, with the Git workflow and docs to match"],
];

export default function NoDogsAllowedPage() {
  return (
    <main className="nda-root overflow-x-hidden">
      {/* top bar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-3 text-sm font-bold sm:px-6">
        <Link href="/" className="pointer-events-auto rounded-full border border-white/20 bg-[rgba(18,26,51,0.75)] px-3 py-1 text-[var(--nda-cream)] backdrop-blur hover:bg-[rgba(18,26,51,0.95)]">
          ← alex-zaalishvili
        </Link>
        <a href={WIKI} target="_blank" rel="noopener noreferrer" className="pointer-events-auto rounded-full border border-white/20 bg-[rgba(18,26,51,0.75)] px-3 py-1 text-[var(--nda-cream)] backdrop-blur hover:bg-[rgba(18,26,51,0.95)]">
          Lore wiki ↗
        </a>
      </div>

      {/* HERO */}
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <Image src={`${A}/hero.jpg`} alt="Whiskers, pan in hand, with Slick behind him under the No Dogs Allowed title" fill priority sizes="100vw" className="object-cover object-[70%_center]" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(18,26,51,0.97)_0%,rgba(18,26,51,0.88)_48%,rgba(18,26,51,0.1)_100%)] md:bg-[linear-gradient(90deg,rgba(18,26,51,0.94)_0%,rgba(18,26,51,0.7)_34%,rgba(18,26,51,0)_62%)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,var(--nda-navy),transparent)]" />
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pt-24 pb-16 md:justify-center md:pb-24">
          <div className="max-w-xl">
            <span className="nda-eyebrow">Siphon Games · In development</span>
            <h1 className="nda-display mt-4 text-[clamp(2.6rem,6.5vw,5.2rem)] text-[var(--nda-cream)]">
              The restaurant <span className="text-[var(--nda-gold)]">has to open.</span>
            </h1>
            <p className="mt-5 text-lg font-semibold leading-relaxed text-[var(--nda-cream-dim)] sm:text-xl">
              Fifteen-year-old Whiskers walks out of a burning kitchen with his father&apos;s
              handkerchief and no plan. The Dog Mafia has his parents. A cooking Metroidvania about
              pulling on a supply chain that would rather you didn&apos;t.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={WIKI} target="_blank" rel="noopener noreferrer" className="nda-btn nda-btn-gold">Explore the world</a>
              <a href="#story" className="nda-btn nda-btn-ghost">The story so far ↓</a>
            </div>
            <p className="mt-6 text-xs font-bold tracking-[0.2em] text-[var(--nda-cream-dim)] uppercase">
              2D open-world Metroidvania · Unity · PC · controller &amp; keyboard
            </p>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="nda-stars relative py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-[1fr_0.8fr]">
          <div>
            <span className="nda-eyebrow">The story so far</span>
            <h2 className="nda-display mt-4 text-[clamp(2rem,4.5vw,3.5rem)]">
              He begins looking for two people and ends up pulling on a supply chain.
            </h2>
            <div className="mt-6 space-y-4 text-lg font-semibold leading-relaxed text-[var(--nda-cream-dim)]">
              <p>
                The Dominion is a society of animals organised entirely around food — not as a
                quirk, as its actual political structure. Districts are defined by what they do to
                an ingredient: grow it, process it, cook it, or sell it. Status is culinary. So is law.
              </p>
              <p>
                Whiskers grew up underfoot in a working kitchen thirty tiles up the Great Tree, which
                is why he can cook and why a room full of adults doesn&apos;t frighten him. The Butler
                has convinced him that a working kitchen is how you find people. So the restaurant
                has to open — and somewhere around Claypot Ward, the question of who the Dog Mafia
                actually are starts mattering for its own sake.
              </p>
            </div>
            <blockquote className="mt-8 border-l-4 border-[var(--nda-gold)] pl-5 text-xl font-bold text-[var(--nda-cream)]">
              &ldquo;He starts with no weapon, no money, no plan and one piece of cloth.&rdquo;
            </blockquote>
          </div>
          <div className="relative mx-auto w-[min(60vw,300px)] md:mx-0 md:ml-auto md:w-[300px]">
            <div aria-hidden className="absolute inset-x-8 top-8 bottom-0 rounded-full bg-[radial-gradient(closest-side,rgba(245,180,0,0.28),transparent)] blur-2xl" />
            <Image src={`${A}/cast-whiskers.png`} alt="Whiskers" width={597} height={900} sizes="(max-width: 768px) 70vw, 40vw" className="relative h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]" />
          </div>
        </div>
      </section>

      {/* WORLD (parallax) */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 pb-8">
          <span className="nda-eyebrow">The world</span>
          <h2 className="nda-display mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)]">
            Painted by hand, built to be walked through.
          </h2>
        </div>
        <div className="nda-glow">
          <Parallax base={A} />
        </div>
        <p className="mx-auto max-w-6xl px-6 pt-4 text-sm font-bold text-[var(--nda-cream-dim)]">
          The town below the Great Tree, with Whiskers&apos; restaurant. Ten hand-painted layers; move your pointer.
        </p>
      </section>

      {/* PILLARS */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <span className="nda-eyebrow">What you do</span>
          <h2 className="nda-display mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)]">Cook. Fight. Grow. Roam.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {pillars.map((p) => (
              <article key={p.n} className="nda-card relative overflow-hidden p-7 md:p-9">
                {p.image && (
                  <>
                    <Image src={`${A}/${p.image}`} alt={p.alt ?? ""} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover opacity-25 transition-opacity duration-500 hover:opacity-40" />
                    <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,var(--nda-navy-2)_35%,rgba(27,37,71,0.2))]" />
                  </>
                )}
                <div className="relative">
                  <div className="nda-display text-sm tracking-[0.3em]" style={{ color: p.color }}>{p.n}</div>
                  <h3 className="nda-display mt-2 text-4xl">{p.title}</h3>
                  <p className="mt-3 text-lg font-extrabold text-[var(--nda-cream)]">{p.lead}</p>
                  <p className="mt-3 font-semibold leading-relaxed text-[var(--nda-cream-dim)]">{p.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* DISTRICTS */}
      <section className="border-y border-white/10 bg-[var(--nda-navy-2)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <span className="nda-eyebrow">The Dominion, west to east</span>
          <h2 className="nda-display mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)]">Six districts. Each defined by what it does to an ingredient.</h2>
        </div>
        <div className="mx-auto mt-10 max-w-6xl px-6">
          <ol className="nda-rail">
            {districts.map((d, i) => (
              <li key={d.name} className="rounded-2xl border border-white/10 bg-[var(--nda-navy)] p-6">
                <div className="nda-display text-sm tracking-[0.3em] text-[var(--nda-gold)]">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="nda-display mt-2 text-2xl">{d.name}</h3>
                <p className="mt-3 font-semibold leading-relaxed text-[var(--nda-cream-dim)]">{d.what}</p>
                <p className="mt-3 text-sm font-extrabold text-[var(--nda-cream)]">{d.role}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CAST */}
      <section className="nda-stars py-24">
        <div className="mx-auto max-w-6xl px-6">
          <span className="nda-eyebrow">The cast</span>
          <h2 className="nda-display mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)]">Everyone in this story will tell him to stop.</h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cast.map((c) => (
              <li key={c.id} className="nda-cast">
                <div className="relative flex h-[420px] items-end justify-center overflow-hidden" style={{ background: `radial-gradient(80% 60% at 50% 40%, ${c.accent}33, transparent)` }}>
                  <Image src={`${A}/cast-${c.id}.png`} alt={c.name} width={600} height={900} sizes="(max-width: 640px) 90vw, 33vw" className={`relative w-auto object-contain ${c.tall ? "h-[400px]" : "h-[300px] mb-10"}`} />
                </div>
                <div className="relative z-10 -mt-24 px-6 pb-6">
                  <div className="nda-display text-xs tracking-[0.25em] uppercase" style={{ color: c.accent }}>{c.who}</div>
                  <h3 className="nda-display mt-1 text-3xl">{c.name}</h3>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-[var(--nda-cream-dim)]">{c.bio}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm font-bold text-[var(--nda-cream-dim)]">
            Plus the Butler, the Farmer, Mango, Daisy, Hob, the Gate Wardens, and the Hyena — all on the{" "}
            <a href={WIKI} target="_blank" rel="noopener noreferrer" className="text-[var(--nda-gold)] underline-offset-4 hover:underline">wiki</a>.
          </p>
        </div>
      </section>

      {/* UNDER THE HOOD */}
      <section id="under-the-hood" className="border-t border-white/10 bg-[#0e1429] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <span className="nda-eyebrow">Under the hood</span>
          <h2 className="nda-display mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)]">AA scope, one lead engineer, and a dependency graph that only points down.</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {tech.map(([k, v]) => (
              <li key={k} className="rounded-2xl border border-white/10 bg-[var(--nda-navy-2)] p-5">
                <div className="nda-display text-lg text-[var(--nda-gold)]">{k}</div>
                <p className="mt-1 text-sm font-semibold leading-relaxed text-[var(--nda-cream-dim)]">{v}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm font-bold text-[var(--nda-cream-dim)]">
            The codebase is private while the game is in development. Happy to walk through it on a call.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-28 text-center">
        <Image src={`${A}/hero.jpg`} alt="" fill sizes="100vw" className="object-cover object-[70%_center] opacity-20 blur-sm" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(18,26,51,0.2),var(--nda-navy))]" />
        <div className="relative mx-auto max-w-3xl px-6">
          <Image src={`${A}/logo.png`} alt="No Dogs Allowed" width={1400} height={1388} sizes="(max-width: 640px) 60vw, 300px" className="mx-auto h-auto w-[min(60vw,300px)] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]" />
          <h2 className="nda-display mt-8 text-[clamp(2.2rem,6vw,4.5rem)]">Follow the road to Highspice Row.</h2>
          <p className="mt-4 text-lg font-semibold text-[var(--nda-cream-dim)]">Act One — the road to Highspice Row — is in production at Siphon Games. Press, playtesters, and publishers welcome.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href={WIKI} target="_blank" rel="noopener noreferrer" className="nda-btn nda-btn-gold">Read the lore wiki</a>
            <a href={CONTACT} className="nda-btn nda-btn-ghost">Press &amp; playtesting</a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm font-bold text-[var(--nda-cream-dim)]">
        © {new Date().getFullYear()} Siphon Games. No Dogs Allowed is in development; everything here is subject to change.
        <span className="mx-2">·</span>
        Lead engineer{" "}
        <Link href="/" className="text-[var(--nda-gold)] underline-offset-4 hover:underline">Alex Zaalishvili</Link>
      </footer>
    </main>
  );
}
