import Image from "next/image";
import Link from "next/link";
import { Hero } from "./hero";

const A = "/projects/vrox";
const CODE = "https://github.com/AbsoluteSG/vrox";

const decisions = [
  ["The step is fixed, not time-scaled.", "One input moves you speed × 0.05 regardless of how long the frame took. Prediction only becomes possible if the same input always produces the same displacement; a step scaled by measured elapsed time can never be reproduced on the client."],
  ["The direction is normalised server-side.", "Otherwise the length of the vector is a speed multiplier any client can set."],
  ["The send rate is the movement speed.", "One input equals one server step, so sending twice as often would move twice as fast. Anything that rate-limits input is therefore also a speed limit, and getting it wrong looks exactly like lag."],
];

const rules = [
  ["One layer at a time, played before the next", "The previous build accumulated prediction, reconciliation, interpolation, interest management, weapons and a level pipeline before anyone pressed Play once. When it finally felt wrong, six untested layers were candidates and it had to be scrapped. Add one thing. Play it. Then add the next. Never say a feature “works” when what was verified is that it compiles."],
  ["Never let the client decide what the server knows", "_equipped cached the id we last asked to equip. The request failed, the cache remembered success, and it never retried. WeaponDef.Find(id) is null was read as “no such weapon”. It also means “the client has not been told yet”, and the two are indistinguishable client-side. Reconcile against replicated server state, not a local record of intent."],
  ["A fallback that hides a failure is worse than a crash", "The server fired a default weapon when nothing was equipped. So “my weapon did not equip” and “my weapon fires one bullet” looked identical, and the real failure was invisible for three rounds of debugging. Prefer doing nothing loudly. Unarmed now fires nothing, which makes a bullet proof that equipping worked."],
];

const tables: [string, string[]][] = [
  ["World", ["Realm", "RealmConfig", "TerrainChunk", "BiomeDef", "Spawner", "WorldSpawn"]],
  ["Combat", ["Shot", "Hit", "Tracer", "Enemy", "EnemyDef", "PhaseDef", "DamageTally", "DebuffTally"]],
  ["Items", ["ItemDef", "WeaponDef", "LootPoolDef", "LootEntry", "EnemyLoot", "LootDrop", "Inventory", "Vault"]],
  ["Players", ["Player", "PlayerConfig", "PlayerStat", "Character"]],
];

const bags = [["common", "Common"], ["uncommon", "Uncommon"], ["rare", "Rare"], ["epic", "Epic"], ["legendary", "Legendary"], ["boss", "Boss"]];

export default function VroxPage() {
  return (
    <main className="vx-root overflow-x-hidden">
      {/* top bar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="vx-pixel pointer-events-auto border-2 border-[var(--vx-edge)] bg-black/80 px-3 py-2 text-[0.5rem] text-[var(--vx-text)] hover:border-[var(--vx-gold)]">← alex-zaalishvili</Link>
        <a href={CODE} target="_blank" rel="noopener noreferrer" className="vx-pixel pointer-events-auto border-2 border-[var(--vx-edge)] bg-black/80 px-3 py-2 text-[0.5rem] text-[var(--vx-text)] hover:border-[var(--vx-gold)]">GitHub ↗</a>
      </div>

      {/* HERO */}
      <section className="vx-hatch border-b-4 border-[var(--vx-edge)]">
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-16">
          <span className="vx-eyebrow">Prototype · SpacetimeDB · Unity · C#</span>
          <h1 className="vx-pixel mt-5 text-[clamp(1.6rem,5vw,3.4rem)] text-[var(--vx-gold)]" style={{ textShadow: "4px 4px 0 #000" }}>VROX</h1>
          <p className="mt-4 max-w-3xl text-[1.45rem] leading-snug text-[var(--vx-text)]">
            A player that moves and shoots, on a server. Small on purpose. The server is authoritative
            and there is no client prediction: the client sends a direction twenty times a second, the
            server decides where that puts you, and the client draws wherever the server says it is.
            What you see is the truth.
          </p>
          <div className="mt-10"><Hero /></div>
        </div>
      </section>

      {/* SHOT MATH */}
      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[1fr_1fr]">
          <div>
            <span className="vx-eyebrow">Shooting</span>
            <h2 className="vx-pixel mt-4 text-[clamp(1rem,2.6vw,1.6rem)] leading-relaxed">How a shot works</h2>
            <p className="mt-4 text-[var(--vx-dim)]">
              A shot&apos;s row is written once and never updated. Position is a function of how long it has been alive —
              <code className="vx-panel mx-1 px-2 py-0.5 text-[var(--vx-gold)]">origin + dir · speed · t</code>
              — evaluated independently by every client, so a bullet costs one insert and one delete however far it flies.
              Moving projectiles by updating rows every tick is what makes this genre expensive to network.
            </p>
            <p className="mt-4 text-[var(--vx-dim)]">
              Rate of fire is enforced server-side, so calling the reducer faster buys nothing. The client never invents a projectile of its own.
              One timer, running once a second, deletes expired shots. It is the only scheduled thing in the project.
            </p>
          </div>
          <div className="vx-panel p-5">
            <table className="vx-table">
              <thead><tr><th>Pattern</th><th>What it does</th></tr></thead>
              <tbody>
                <tr><td>SingleShot</td><td>One projectile.</td></tr>
                <tr><td>SpreadShot</td><td>Fanned across an arc, centred on the aim.</td></tr>
                <tr><td>RingShot</td><td>Evenly around a circle.</td></tr>
                <tr><td>ParallelShot</td><td>Side by side, same direction, offset perpendicular to travel.</td></tr>
                <tr><td>HelixShot</td><td>Same direction, wave phases spread evenly so the strands braid.</td></tr>
                <tr><td>+ Spin</td><td>Rotates the whole volley over time. Derived from the spawn timestamp rather than a shot counter, so it needs no per-player state and stays right across a disconnect.</td></tr>
                <tr><td>+ Wave</td><td>Makes each projectile weave. Still analytic: the row is written once, and the path is simply no longer straight.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* THREE DECISIONS */}
      <section className="vx-hatch border-y-4 border-[var(--vx-edge)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <span className="vx-eyebrow">Three decisions worth keeping when this grows</span>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {decisions.map(([k, v], i) => (
              <div key={k} className="vx-panel p-5">
                <div className="vx-pixel text-[0.55rem] text-[var(--vx-gold)]">0{i + 1}</div>
                <h3 className="mt-2 text-[1.35rem] leading-snug text-[var(--vx-text)]">{k}</h3>
                <p className="mt-2 text-[1.1rem] text-[var(--vx-dim)]">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S IN THE SERVER NOW */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <span className="vx-eyebrow">What the server holds now</span>
          <h2 className="vx-pixel mt-4 text-[clamp(1rem,2.6vw,1.6rem)] leading-relaxed">What the module holds now</h2>
          <p className="mt-4 max-w-3xl text-[var(--vx-dim)]">
            The README describes the first layer. Since then the module and its realm generator have grown to about 7,900
            lines of C# and around fifty reducers. The rule has not changed: the client asks, the server decides, the client draws the rows.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {tables.map(([group, list]) => (
              <div key={group} className="vx-panel p-4">
                <div className="vx-pixel text-[0.5rem] text-[var(--vx-gold)] uppercase">{group}</div>
                <ul className="mt-3 space-y-1 text-[1.05rem] text-[var(--vx-text)]">{list.map((t) => <li key={t}>▸ {t}</li>)}</ul>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="vx-panel p-5">
              <div className="vx-pixel text-[0.5rem] text-[var(--vx-gold)] uppercase">Realm generation</div>
              <p className="mt-3 text-[1.1rem] text-[var(--vx-dim)]">
                The server generates the map and the client draws the rows that come out. That split is the whole point:
                the seed and every knob live on the server, so two clients cannot disagree about what the world looks like,
                and the ground the server collides against is by construction the ground you can see. Plain C# on purpose —
                no Unity, no System.Random, no clock. A seed has to reproduce its realm exactly or “regenerate with the same seed”
                is not a debugging tool. A seed whose open ground is less than 80% reachable from the spawn point is rejected,
                and the realm row records how many were rejected before one was accepted.
              </p>
            </div>
            <div className="vx-panel p-5">
              <div className="vx-pixel text-[0.5rem] text-[var(--vx-gold)] uppercase">Loot</div>
              <p className="mt-3 text-[1.1rem] text-[var(--vx-dim)]">
                An enemy rolls its loot pool into a bag when it dies. A bag lasts 120 seconds and opens within two tiles.
                Items go to a six-slot backpack, three equipped slots, or the vault. An account has four character slots.
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                {bags.map(([id, name]) => (
                  <figure key={id} className="flex flex-col items-center gap-1">
                    <Image src={`${A}/bag-${id}.png`} alt={`${name} loot bag`} width={64} height={64} className="h-12 w-12" style={{ imageRendering: "pixelated" }} />
                    <figcaption className="vx-pixel text-[0.42rem] text-[var(--vx-dim)] uppercase">{name}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* WORKING RULES */}
      <section className="vx-hatch border-y-4 border-[var(--vx-edge)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <span className="vx-eyebrow">Working rules</span>
          <p className="mt-3 max-w-3xl text-[var(--vx-dim)]">Three of the rules in the project&apos;s working notes. Every rule there comes from a real bug in this project, named so it is checkable rather than a platitude.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {rules.map(([k, v]) => (
              <blockquote key={k} className="vx-quote">
                <div className="text-[1.35rem] leading-snug text-[var(--vx-text)]">{k}</div>
                <p className="mt-2 text-[1.05rem] text-[var(--vx-dim)]">{v}</p>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* KNOWN LIMITS */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <span className="vx-eyebrow">Known limits</span>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            <li className="vx-panel p-5 text-[1.1rem] text-[var(--vx-dim)]">Only the client evaluates the wave — the server stores its parameters but never computes a projectile&apos;s position, because nothing can be hit yet. When collision arrives, the server must use the same formula or the two will disagree about where a bullet is.</li>
            <li className="vx-panel p-5 text-[1.1rem] text-[var(--vx-dim)]">Shot age is measured against the server&apos;s timestamp but compared to the local clock. That is only correct while both are on the same machine. A real server needs clock-offset estimation, and that is the next layer, not this one.</li>
          </ul>
          <p className="mt-6 text-[var(--vx-dim)]">
            What to add next, one at a time: other players rendered from the same table (it is already subscribed); a camera that
            follows rather than being parented; client prediction, then reconciliation — and only with a way to <em>measure</em>
            disagreement, because that is what rubber-banding is. Add one, play it, keep it or throw it away.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={CODE} target="_blank" rel="noopener noreferrer" className="vx-btn vx-btn-gold">Read the code</a>
            <Link href="/" className="vx-btn">More of my work</Link>
          </div>
        </div>
      </section>

      <footer className="vx-pixel border-t-4 border-[var(--vx-edge)] px-6 py-6 text-center text-[0.45rem] text-[var(--vx-dim)]">
        © {new Date().getFullYear()} ALEX ZAALISHVILI · PLACEHOLDER ART
      </footer>
    </main>
  );
}
