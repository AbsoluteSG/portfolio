import Image from "next/image";
import Link from "next/link";
import Mechanics from "./mechanics";

const STEAM = "https://store.steampowered.com/app/2322080/Banana_Clicker/";
const SOURCE = "https://github.com/AbsoluteSG/banana-clicker-source";
const A = "/projects/banana-clicker";

const stats = [
  { big: "1,000+", small: "players on Steam" },
  { big: "Mar 2023", small: "released" },
  { big: "v1.1.5", small: "10+ patches since" },
  { big: "$2.99", small: "early access" },
];

const features = [
  {
    kicker: "Click. Build. Ascend.",
    title: "Every tap is profit.",
    body: "Upgrade your click power to peel through dimensions. Build farms, pirate fleets, and research labs that keep the bananas flowing while you're offline. Then cash it all out for Banana Slices — permanent prestige that supercharges the next run.",
    shot: "ss3.jpg",
    alt: "Banana Storm in progress: 462.94 million bananas at 281,355 per second",
    bg: "var(--bc-coral)",
    ink: "var(--bc-white)",
    tilt: "-2deg",
  },
  {
    kicker: "Gacha, events & mayhem",
    title: "Trigger a Banana Storm.",
    body: "Pull the Dealer's gacha for rare items, cosmetics, boosts, and artifacts tied to the world's NPCs. Unleash screen-filling Banana Storms. Ride out seasonal madness, time-limited boosts, and anomalies that change how you play.",
    shot: "ss6.jpg",
    alt: "Unlock Banana Slices — the prestige menu",
    bg: "var(--bc-navy)",
    ink: "var(--bc-white)",
    tilt: "2deg",
  },
  {
    kicker: "Absurd characters",
    title: "Meet the misfits.",
    body: "Time-traveling chimps. A hyper-enthusiastic surfer prophet. Morally questionable scientists. Factions with way too much banana-related lore. Pledge to the Grovekeepers or the Banana Syndicate, earn reputation, and climb their ranks.",
    shot: "ss4.jpg",
    alt: "Character select: Beach Bum Chad, Granny Peel, Capt. Rindlock",
    bg: "var(--bc-sky)",
    ink: "var(--bc-ink)",
    tilt: "-2deg",
  },
  {
    kicker: "A story way too deep for a clicker",
    title: "Then you meet Him.",
    body: "It starts with harmless clicking. Then the conspiracies begin: underground banana cartels, a cross-dimensional banana war, secret labs studying “Fruit Resonance,” and a villain who may or may not be you from the future. It's ridiculous. It's dramatic. That's the point.",
    shot: "ss1.jpg",
    alt: "The Dealer: “Looks like we've got a newcomer…”",
    bg: "var(--bc-cream)",
    ink: "var(--bc-ink)",
    tilt: "2deg",
  },
];

const gallery = [
  ["ss2.jpg", "Objective: collect 299 bananas"],
  ["ss5.jpg", "Beach Bum Chad's upgrade board"],
  ["ss7.jpg", "Gear inventory with tiers and sockets"],
  ["ss8.jpg", "Achievements"],
  ["ss3.jpg", "Banana Storm"],
  ["ss6.jpg", "Banana Slices"],
  ["ss4.jpg", "The cast"],
  ["ss1.jpg", "The Dealer"],
];

export default function BananaClickerPage() {
  return (
    <main className="bc-root overflow-x-hidden">
      {/* Floating top bar — small on purpose; the page should read as the game's site. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-3 text-sm font-bold sm:px-6">
        <Link
          href="/"
          className="pointer-events-auto rounded-full border-2 border-black/80 bg-white/90 px-3 py-1 text-black backdrop-blur hover:bg-white"
        >
          ← alex-zaalishvili
        </Link>
        <a
          href={STEAM}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto rounded-full border-2 border-black/80 bg-[var(--bc-yellow)] px-3 py-1 text-black hover:brightness-105"
        >
          Steam ↗
        </a>
      </div>

      {/* HERO */}
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-[var(--bc-sky)] bc-cut-bottom">
        <Image
          src={`${A}/library_hero.jpg`}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* diagonal ink wedge, bottom-left, like the in-game HUD */}
        <div
          aria-hidden
          className="absolute inset-0 -z-0 bg-[var(--bc-ink)]"
          style={{ clipPath: "polygon(0 72%, 100% 92%, 100% 100%, 0 100%)" }}
        />
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-6 pt-20 pb-28 text-center">
          <div className="bc-float w-[min(88vw,640px)]">
            <Image
              src={`${A}/logo.png`}
              alt="Banana Clicker"
              width={640}
              height={360}
              priority
              className="h-auto w-full drop-shadow-[0_14px_0_rgba(0,0,0,0.25)]"
            />
          </div>

          <h1 className="bc-display bc-outline mt-2 text-[clamp(2.4rem,7vw,5.5rem)]">
            Click. Upgrade. Conquer.
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-bold text-[var(--bc-ink)] sm:text-xl">
            Build a banana empire, unlock powerful upgrades, and uncover a wild banana-fueled
            conspiracy. Meet silly NPCs, test your luck in gacha, and unleash Banana Storms.
            The bananas never stop.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a href={STEAM} target="_blank" rel="noopener noreferrer" className="bc-btn bc-btn-yellow">
              <SteamIcon /> Get it on Steam
            </a>
            <a href={STEAM} target="_blank" rel="noopener noreferrer" className="bc-btn bc-btn-white">
              ▶ Watch the trailer
            </a>
          </div>

          <ul className="mt-14 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <li
                key={s.small}
                className="rounded-2xl border-4 border-[var(--bc-ink)] bg-white px-4 py-4 shadow-[6px_7px_0_var(--bc-ink)]"
              >
                <div className="bc-display text-2xl text-[var(--bc-ink)] sm:text-3xl">{s.big}</div>
                <div className="mt-1 text-xs font-extrabold tracking-wider text-[var(--bc-ink)]/70 uppercase">
                  {s.small}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FEATURES */}
      {features.map((f, i) => (
        <section
          key={f.kicker}
          className={`relative -mt-[4.5vw] pt-[8vw] pb-[9vw] ${i % 2 ? "bc-cut-bottom-alt" : "bc-cut-bottom"} ${f.bg === "var(--bc-cream)" ? "bc-dots" : "bc-dots-light"}`}
          style={{ background: f.bg, color: f.ink }}
        >
          <div
            className={`mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:gap-16 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            <div>
              <span className="bc-chip">
                <span>{f.kicker}</span>
              </span>
              <h2 className="bc-display mt-5 text-[clamp(2.2rem,5.5vw,4.25rem)]">{f.title}</h2>
              <p className="mt-5 max-w-prose text-lg font-semibold leading-relaxed opacity-90">{f.body}</p>
            </div>
            <div className="bc-sticker" style={{ transform: `rotate(${f.tilt})` }}>
              <Image
                src={`${A}/${f.shot}`}
                alt={f.alt}
                width={1280}
                height={720}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-auto w-full"
              />
            </div>
          </div>
        </section>
      ))}

      {/* GALLERY */}
      <section className="relative -mt-[4.5vw] bg-[var(--bc-ink)] pt-[9vw] pb-[9vw] text-white bc-dots-light bc-cut-bottom">
        <div className="mx-auto max-w-6xl px-6">
          <span className="bc-chip !bg-[var(--bc-yellow)] !text-[var(--bc-ink)]">
            <span>Screenshots</span>
          </span>
          <h2 className="bc-display bc-outline-yellow mt-5 text-[clamp(2.2rem,5.5vw,4.25rem)]">
            Numbers go up. Then off the screen.
          </h2>
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {gallery.map(([shot, alt]) => (
              <li key={shot} className="bc-sticker !shadow-[6px_7px_0_var(--bc-yellow-deep)] transition-transform hover:-translate-y-1">
                <Image src={`${A}/${shot}`} alt={alt} width={640} height={360} sizes="(max-width: 640px) 50vw, 25vw" className="h-auto w-full" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* IN THE WORKS */}
      <Mechanics />

      {/* UNDER THE HOOD */}
      <section className="relative bg-[var(--bc-navy-deep)] py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <div>
            <span className="bc-chip !bg-[var(--bc-sky)] !text-[var(--bc-ink)]">
              <span>Under the hood</span>
            </span>
            <h2 className="bc-display mt-5 text-[clamp(2rem,4.5vw,3.5rem)] text-[var(--bc-yellow)]">
              Built solo, shipped for real.
            </h2>
            <p className="mt-5 text-lg font-semibold leading-relaxed text-white/85">
              Banana Clicker is ~23,000 lines of C# in Unity, designed, programmed, and released by
              one person, then patched ten-plus times from live player feedback. The code is public.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={SOURCE} target="_blank" rel="noopener noreferrer" className="bc-btn bc-btn-ink">
                Read the source
              </a>
            </div>
          </div>
          <ul className="grid gap-3 self-center font-mono text-sm">
            {[
              ["Service layer", "~25 IService singletons with explicit Register → Initialize lifecycle"],
              ["Event bus", "typed, filtered subscriptions; unsubscribe by IDisposable"],
              ["Data", "ScriptableObjects loaded async via Addressables behind a readiness gate"],
              ["Economy", "TickManager-driven idle income, offline progress, designer-tuned curves"],
              ["Saves", "multi-slot, hashed integrity check, async IO"],
              ["Steam", "achievements with composable requirement rules, login"],
            ].map(([k, v]) => (
              <li key={k} className="rounded-xl border-2 border-white/15 bg-white/5 px-4 py-3">
                <span className="text-[var(--bc-yellow)]">{k}</span>
                <span className="text-white/60"> — </span>
                <span className="text-white/85">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative bg-[var(--bc-yellow)] py-24 text-center bc-dots">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="bc-display bc-outline text-[clamp(2.6rem,8vw,6rem)]">
            Start your banana empire.
          </h2>
          <p className="mt-5 text-lg font-bold text-[var(--bc-ink)]/80 sm:text-xl">
            Casual tapper, min-max enjoyer, or someone who just likes watching numbers explode —
            there&apos;s always another peel to pull back.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a href={STEAM} target="_blank" rel="noopener noreferrer" className="bc-btn bc-btn-ink">
              <SteamIcon /> Get Banana Clicker — $2.99
            </a>
          </div>
          <p className="mt-6 text-sm font-bold text-[var(--bc-ink)]/60">
            Windows · Single-player · Steam Achievements · Early Access
          </p>
        </div>
      </section>

      <footer className="bg-[var(--bc-ink)] px-6 py-8 text-center text-sm font-bold text-white/60">
        © 2023–{new Date().getFullYear()} Siphon Games. Banana Clicker is a Siphon Games title.
        <span className="mx-2">·</span>
        Designed &amp; built by{" "}
        <Link href="/" className="text-[var(--bc-yellow)] underline-offset-4 hover:underline">
          Alex Zaalishvili
        </Link>
      </footer>
    </main>
  );
}

function SteamIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-9.97 9.2l5.36 2.22a2.83 2.83 0 0 1 1.6-.5l2.39-3.46v-.05a3.77 3.77 0 1 1 3.77 3.77h-.09l-3.4 2.43a2.83 2.83 0 0 1-5.62.6L2.2 14.7A10 10 0 1 0 12 2zm-3.7 15.17a2.13 2.13 0 0 1-1.94-1.26l1.24.51a1.57 1.57 0 1 0 1.2-2.9l-1.28-.53a2.13 2.13 0 1 1 .78 4.18zm6.85-5.5a2.51 2.51 0 1 1 0-5.02 2.51 2.51 0 0 1 0 5.02zm0-4.4a1.89 1.89 0 1 0 0 3.78 1.89 1.89 0 0 0 0-3.78z" />
    </svg>
  );
}
