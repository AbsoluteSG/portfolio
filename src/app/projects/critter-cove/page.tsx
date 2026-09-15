import Image from "next/image";
import Link from "next/link";

const A = "/projects/critter-cove";
const CODE = "https://github.com/AbsoluteSG/cmd_zoo";
const CONTACT = "mailto:alex.zvili01@gmail.com?subject=Critter%20Cove";

const parade = [
  "red_fox", "blue_frog", "field_mouse", "lion", "arctic_fox", "hedgehog", "galaxy_whale", "clockwork_owl",
  "butter_horse", "giraffe", "donut_seal", "beaver", "golden_toucan", "lava_lynx", "brown_bear", "candy_dove",
  "glass_fox", "goat", "cogwhale", "monkey", "caramel_stag", "heron", "eclipse_hound", "chicken",
];

const features = [
  {
    title: "Build a zoo with friends",
    body: "Open your cove to up to three friends over Steam. Visitors roam your world as their own avatar, hunt wild critters alongside you in real time, and send gift animals straight to your collection. It's your zoo — you decide what guests can do.",
    sprite: "lion",
  },
  {
    title: "Explore a vast procedural world",
    body: "Your home plot sits at the heart of a seamless, procedurally generated wilderness. No loading screens, no edges in sight. Mark fast-travel waypoints, zoom the camera, and dash across the map to wherever the rare ones hide.",
    sprite: "arctic_fox",
  },
  {
    title: "Catch critters that fight back",
    body: "Catching isn't a guaranteed click. Fill the capture ring by closing the distance — but every species runs its own playbook. Zigzaggers juke, bursters dash, circlers orbit, vanishers hide, and the bold ones charge, lob projectiles, or stalk and lunge to break your catch. The rarest ones you'll have to catch more than once.",
    sprite: "lava_lynx",
  },
  {
    title: "Breed strange hybrids",
    body: "Lead your critters on a physics-based follow chain back to the nests, pair them up, and wait. From a catalog of 100+ species you'll unlock crossbreeds and themed exotics you can only get by experimenting with who you put together.",
    sprite: "bogtrot",
  },
  {
    title: "Grow an idle empire",
    body: "Every critter earns while it lives in your cove. Coins and DNA Helix accrue over time — collect, level up, and rank up duplicates for bigger payouts. Place animals on income pedestals to bank rewards while you're away. Play actively and optimize, or let it tick along and come back richer.",
    sprite: "butter_horse",
  },
  {
    title: "Built to feel good",
    body: "Soft isometric art, biome colors that blend into one another, swaying grass, and satisfying collect-pops. Tune the look with fullscreen filters — scanlines, pixelate, sepia — and feel every big catch through camera shake and hitstop.",
    sprite: "donut_seal",
  },
];

const biomes = [
  ["Forest", "#7cc043"], ["Arctic", "#bfe3f5"], ["Savanna", "#e5c15b"], ["Jungle", "#3f9a4d"], ["Desert", "#f0c88a"],
  ["Ocean", "#6cc2e8"], ["Beach", "#f6e2a8"], ["Taiga", "#5f8f6b"], ["Tundra", "#c9d6dc"], ["Highlands", "#9fb5a3"],
  ["Wetland", "#7fa86e"], ["Badlands", "#d2905b"], ["Volcanic", "#e0644a"], ["Farmland", "#b9d36b"],
  ["Festive", "#f28cae"], ["Food", "#f7b267"], ["Mythical", "#b79ce8"], ["Void", "#4a4670"],
];

const recipes = [
  { a: "red_fox", b: "field_mouse", out: "scamp", outName: "Scamp" },
  { a: "blue_frog", b: "red_fox", out: "bogtrot", outName: "Bogtrot" },
];

const tech = [
  ["Rust + Macroquad", "one binary, ~30k lines across a game crate, a core crate, and a SpacetimeDB module crate"],
  ["201 tests", "the domain — species catalog, economy, breeding recipes, catch resolution — is plain Rust with no engine in it, so it's tested like a library"],
  ["World streaming", "chunks load and unload around the player with hysteresis so the edge never flickers; entities migrate between chunks"],
  ["Procedural biomes", "noise sampling, placement rules, and weighted spawn tables per biome; bounded arenas for expeditions"],
  ["Two ways online", "a Steam relay transport for visiting a friend's zoo (behind a cargo feature so the project builds without the SDK), and a SpacetimeDB hub for a shared plaza"],
  ["Versioned saves", "a save schema with forward migrations and atomic writes; an old save always opens"],
  ["Input abstraction", "keyboard, mouse, and gamepad (gilrs) behind one intent layer; the game switches to whichever you touch"],
  ["Sprites embedded at build", "build.rs scans the art folder and embeds every species PNG; a missing sprite falls back to a lettered placeholder so art can land incrementally"],
];

export default function CritterCovePage() {
  return (
    <main className="cc-root overflow-x-hidden">
      {/* top bar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-3 text-sm font-bold sm:px-6">
        <Link href="/" className="pointer-events-auto rounded-full border border-black/15 bg-white/85 px-3 py-1 text-[var(--cc-ink)] backdrop-blur hover:bg-white">
          ← alex-zaalishvili
        </Link>
        <a href={CODE} target="_blank" rel="noopener noreferrer" className="pointer-events-auto rounded-full border border-black/15 bg-white/85 px-3 py-1 text-[var(--cc-ink)] backdrop-blur hover:bg-white">
          GitHub ↗
        </a>
      </div>

      {/* HERO: the key art at its own aspect, title block below */}
      <section className="relative">
        <div className="relative">
          <Image src={`${A}/hero-day.jpg`} alt="A painted zoo: a ranger capybara on a path between ponds, a horse, a fox, a lion, and balloons" width={1792} height={592} priority sizes="100vw" className="h-auto w-full" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_top,var(--cc-cream),transparent)]" />
        </div>
        <div className="mx-auto -mt-6 max-w-6xl px-6 pb-16 md:-mt-10">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4">
                <Image src={`${A}/mark.png`} alt="" width={600} height={600} className="h-16 w-16 md:h-20 md:w-20" />
                <span className="cc-eyebrow">Siphon Games · In development · Rust</span>
              </div>
              <h1 className="cc-display mt-4 text-[clamp(2.8rem,7vw,5.5rem)] text-[var(--cc-ink)]">Critter Cove</h1>
              <p className="mt-3 text-xl font-extrabold text-[var(--cc-green)] sm:text-2xl">A cozy co-op zoo builder with bite.</p>
              <p className="mt-4 text-lg font-semibold leading-relaxed text-[var(--cc-ink-soft)]">
                Explore a massive, living wilderness, catch the critters that roam it, and raise them into a zoo
                that hums with income — solo, or with up to three friends dropping into your world to help.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={CODE} target="_blank" rel="noopener noreferrer" className="cc-btn cc-btn-green">Read the code</a>
              <a href="#critters" className="cc-btn cc-btn-ghost">Meet the critters</a>
            </div>
          </div>
        </div>
      </section>

      {/* PARADE */}
      <section id="critters" className="cc-parade-wrap overflow-hidden border-y border-black/10 bg-white/60 py-8">
        <div className="cc-parade">
          {[...parade, ...parade].map((n, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`${n}-${i}`} src={`${A}/critters/${n}.webp`} alt={i < parade.length ? n.replace(/_/g, " ") : ""} loading="lazy" draggable={false} />
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="cc-dots py-24">
        <div className="mx-auto max-w-6xl px-6">
          <span className="cc-eyebrow">What you do</span>
          <h2 className="cc-display mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)]">Catch the world. Build your cove. Bring your friends.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {features.map((f) => (
              <article key={f.title} className="cc-card relative overflow-hidden p-7 md:p-8">
                <div className="flex items-start gap-5">
                  <Image src={`${A}/critters/${f.sprite}.webp`} alt="" width={360} height={360} className="cc-sprite h-20 w-20 shrink-0 object-contain md:h-24 md:w-24" />
                  <div>
                    <h3 className="cc-display text-2xl md:text-3xl">{f.title}</h3>
                    <p className="mt-3 font-semibold leading-relaxed text-[var(--cc-ink-soft)]">{f.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CROSSBREEDS */}
      <section className="border-y border-black/10 bg-[var(--cc-green-deep)] py-24 text-[var(--cc-cream)]">
        <div className="mx-auto max-w-6xl px-6">
          <span className="cc-eyebrow !text-[var(--cc-leaf)]">Crossbreeds</span>
          <h2 className="cc-display mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)]">Put two critters in a nest. See what comes out.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {recipes.map((r) => (
              <div key={r.out} className="flex items-center justify-between gap-2 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
                <Image src={`${A}/critters/${r.a}.webp`} alt={r.a.replace(/_/g, " ")} width={360} height={360} className="cc-sprite h-20 w-20 object-contain sm:h-28 sm:w-28" />
                <span className="cc-display text-3xl text-[var(--cc-sun)]">+</span>
                <Image src={`${A}/critters/${r.b}.webp`} alt={r.b.replace(/_/g, " ")} width={360} height={360} className="cc-sprite h-20 w-20 object-contain sm:h-28 sm:w-28" />
                <span className="cc-display text-3xl text-[var(--cc-sun)]">=</span>
                <div className="flex flex-col items-center">
                  <Image src={`${A}/critters/${r.out}.webp`} alt={r.outName} width={360} height={360} className="cc-sprite h-24 w-24 object-contain sm:h-32 sm:w-32" />
                  <span className="cc-display mt-1 text-lg text-[var(--cc-sun)]">{r.outName}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm font-bold text-[var(--cc-cream)]/70">
            100+ species in the catalog, including themed exotics. Some outcomes stay hidden until you find them.
          </p>
        </div>
      </section>

      {/* BIOMES */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <span className="cc-eyebrow">The wilderness</span>
          <h2 className="cc-display mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)]">Eighteen biomes, blending into one another.</h2>
          <p className="mt-4 max-w-2xl font-semibold leading-relaxed text-[var(--cc-ink-soft)]">Each with its own critters to find and its own terrain. Waypoints mark the way back.</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {biomes.map(([name, color]) => (
              <span key={name} className="cc-chip" style={{ background: color, color: ["Void", "Jungle", "Taiga", "Volcanic"].includes(name) ? "#fff" : "var(--cc-ink)" }}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CURRENT BUILD */}
      <section className="cc-dots border-y border-black/10 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="cc-eyebrow">From the current build</span>
              <h2 className="cc-display mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)]">Playable now. Rough in places.</h2>
            </div>
            <p className="max-w-sm text-sm font-bold text-[var(--cc-ink-soft)]">Placeholder terrain and HUD in some areas; the systems underneath are the point.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["shot-4.jpg", 1600, 859, "A fox beside hay bales on the home plot"],
              ["shot-2.jpg", 1095, 721, "The home plot filling in with critters and structures"],
              ["shot-5.jpg", 1279, 716, "Nests and the hotbar in a red biome"],
            ].map(([src, w, h, alt]) => (
              <figure key={src as string} className="cc-card overflow-hidden">
                <Image src={`${A}/${src}`} alt={alt as string} width={w as number} height={h as number} sizes="(max-width: 768px) 100vw, 33vw" className="h-auto w-full" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* UNDER THE HOOD */}
      <section id="under-the-hood" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <span className="cc-eyebrow">Under the hood</span>
          <h2 className="cc-display mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)]">How it&apos;s built.</h2>
          <p className="mt-4 max-w-2xl font-semibold leading-relaxed text-[var(--cc-ink-soft)]">
            Critter Cove started as <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-sm">cmd_zoo</code>, a way to learn Rust by shipping a complete game instead of following a tutorial. It kept going. The code is public.
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {tech.map(([k, v]) => (
              <li key={k} className="cc-card p-5">
                <div className="cc-display text-lg text-[var(--cc-green)]">{k}</div>
                <p className="mt-1 text-sm font-semibold leading-relaxed text-[var(--cc-ink-soft)]">{v}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={CODE} target="_blank" rel="noopener noreferrer" className="cc-btn cc-btn-green">Read the code</a>
            <a href="https://github.com/AbsoluteSG/cmd_zoo#readme" target="_blank" rel="noopener noreferrer" className="cc-btn cc-btn-ghost">Build it yourself</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[var(--cc-night)] text-[var(--cc-cream)]">
        <Image src={`${A}/hero-night.jpg`} alt="The same zoo at night, under stars" width={1792} height={592} sizes="100vw" className="h-auto w-full opacity-90" />
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="cc-display text-[clamp(2.2rem,6vw,4.5rem)]">Catch the world. Build your cove. Bring your friends.</h2>
          <p className="mt-4 text-lg font-semibold text-[var(--cc-cream)]/75">In development at Siphon Games. Write if you want to play an early build.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href={CONTACT} className="cc-btn cc-btn-cream">Write to Siphon Games</a>
            <a href={CODE} target="_blank" rel="noopener noreferrer" className="cc-btn cc-btn-ghost !border-white/30 !text-[var(--cc-cream)]">GitHub</a>
          </div>
        </div>
        <footer className="border-t border-white/10 px-6 py-6 text-center text-sm font-bold text-[var(--cc-cream)]/60">
          © {new Date().getFullYear()} Siphon Games. <span className="mx-2">·</span> Designed &amp; built by{" "}
          <Link href="/" className="text-[var(--cc-sun)] underline-offset-4 hover:underline">Alex Zaalishvili</Link>
        </footer>
      </section>
    </main>
  );
}
