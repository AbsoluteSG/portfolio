import Image from "next/image";
import Link from "next/link";

const A = "/projects/vision-bots";
const CONTACT = "mailto:alex.zvili01@gmail.com?subject=Vision%20Bots";

const pipeline = [
  ["Capture", "Win32 window capture of the game, dropping stale frames so the loop always sees the newest one."],
  ["Preprocess", "Crop to calibrated regions, resize, HSV conversion. Regions are drawn once with a calibration tool and saved to JSON."],
  ["Perceive", "YOLOv8 detectors for entities and landmarks, HSV colour readers for bars, OCR for numbers, template matching for fixed screens."],
  ["State", "One dict per tick: what's on screen, where, how confident. A belief state carries position between sightings."],
  ["Decide", "A scripted strategy, a graph planner with recovery behaviours, or a PPO policy — swapped in behind the same interface."],
  ["Act", "Synthetic keyboard and mouse. Held keys are diffed against the target set each step; only the delta is sent."],
];

// Per-class AP@0.5 from the best checkpoint's PR curves.
const entityAP = [["player", 0.944], ["enemy", 0.823], ["boss", 0.666], ["loot", 0.493], ["npc", 0.463], ["enemy_buff", 0.264], ["enemy_debuff", 0.011]] as const;
const landmarkAP = [["western_road", 0.995], ["eastern_dock", 0.995], ["dustwither_catacombs", 0.864], ["northern_peninsula", 0.765], ["temple_of_belenus", 0.609], ["southern_pass", 0.537], ["farcrag_castle", 0.517], ["highshore_village", 0.179]] as const;

// Landmark graph from config/landmark_graph.json, laid out by hand.
const nodes: Record<string, [number, number]> = {
  causeway_steps: [60, 200], highshore_village: [200, 140], western_road: [340, 60], temple_of_belenus: [360, 230],
  southern_pass: [270, 330], farcrag_castle: [480, 40], crookback_hollow: [500, 130], eastern_dock: [520, 260],
  northern_peninsula: [560, 360], dustwither_catacombs: [430, 380],
};
const edges: [string, string, number][] = [
  ["causeway_steps", "highshore_village", 12], ["highshore_village", "western_road", 10], ["highshore_village", "temple_of_belenus", 15],
  ["highshore_village", "southern_pass", 12], ["western_road", "southern_pass", 10], ["western_road", "farcrag_castle", 8],
  ["western_road", "crookback_hollow", 10], ["temple_of_belenus", "southern_pass", 12], ["temple_of_belenus", "eastern_dock", 10],
  ["temple_of_belenus", "northern_peninsula", 15], ["temple_of_belenus", "dustwither_catacombs", 8], ["eastern_dock", "northern_peninsula", 10],
];
const zoneEntrances = new Set(["farcrag_castle", "dustwither_catacombs", "crookback_hollow"]);

const rrFacts = [
  ["Capture at 2560×1440", "17.6 FPS (56 ms) — too slow"],
  ["Capture at 1280×720", "72 FPS (13.8 ms) — the env runs at 15 Hz comfortably"],
  ["Starting a run", "walk to the rocket, press E"],
  ["Wave break", "four upgrade cards appear; selecting one takes two clicks (highlight, then confirm)"],
  ["Upgrade detection", "colour fraction of the cards' brick red in the card band: 0.13–0.15 on a settled upgrade screen, 0.03 mid-fly-in, 0.00 in-run. Template matching was tried first and failed — cards vary in count, size, tilt, and highlight state"],
  ["“In a run” detection", "template match on the Completion Time header: 1.00 in-run, 0.27 in the hub. Drives both termination and reset"],
  ["HUD position", "shifts ~25 px between the hub and an active run; regions are calibrated for in-run"],
  ["Score readout", "the cheese counter is a persistent bank balance, not a per-run score; only its delta is meaningful"],
];

function Bars({ data, color }: { data: readonly (readonly [string, number])[]; color: string }) {
  return (
    <div className="space-y-2">
      {data.map(([k, v]) => (
        <div key={k} className="vb-bar">
          <span className="truncate text-[var(--vb-dim)]">{k}</span>
          <i><b style={{ width: `${v * 100}%`, background: color }} /></i>
          <span className="text-right text-[var(--vb-text)]">{v.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

function Hud({ src, alt, w, h, tag, priority = false }: { src: string; alt: string; w: number; h: number; tag?: string; priority?: boolean }) {
  return (
    <figure className="vb-hud">
      <span className="vb-corner" />
      <Image src={`${A}/${src}`} alt={alt} width={w} height={h} priority={priority} sizes="(max-width: 768px) 100vw, 60vw" />
      {tag && <figcaption className="vb-mono absolute top-4 left-4 rounded bg-black/70 px-2 py-1 text-[0.7rem] tracking-widest text-[var(--vb-cyan)] uppercase">{tag}</figcaption>}
    </figure>
  );
}

export default function VisionBotsPage() {
  return (
    <main className="vb-root overflow-x-hidden">
      {/* top bar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-3 text-sm sm:px-6">
        <Link href="/" className="vb-mono pointer-events-auto rounded-lg border border-[var(--vb-line)] bg-[rgba(11,15,20,0.8)] px-3 py-1 text-[var(--vb-text)] backdrop-blur hover:border-[var(--vb-cyan)]">
          ← alex-zaalishvili
        </Link>
        <a href={CONTACT} className="vb-mono pointer-events-auto rounded-lg border border-[var(--vb-line)] bg-[rgba(11,15,20,0.8)] px-3 py-1 text-[var(--vb-text)] backdrop-blur hover:border-[var(--vb-cyan)]">
          contact
        </a>
      </div>

      {/* HERO */}
      <section className="vb-grid relative border-b border-[var(--vb-line)]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 pt-28 pb-20 md:grid-cols-[0.9fr_1.1fr] md:pt-32">
          <div>
            <span className="vb-eyebrow">Study · 2026 · Python · YOLOv8 · PPO</span>
            <h1 className="vb-display mt-5 text-[clamp(2.4rem,5.5vw,4.4rem)]">Playing games through the screen.</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--vb-dim)]">
              Two bots that get nothing from the game but pixels. Capture the window, read it back
              with detectors, act through synthetic input. The first drives an MMORPG with a
              landmark map and a planner; the second learns to survive an arena with reinforcement
              learning.
            </p>
            <p className="vb-mono mt-4 text-xs text-[var(--vb-dim)]">A learning project. Run on my own accounts in private sessions; never distributed.</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {["screen capture", "YOLOv8", "OpenCV", "Tesseract", "Gymnasium", "Stable-Baselines3", "PyTorch"].map((t) => (
                <span key={t} className="vb-chip">{t}</span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#celtic" className="vb-btn vb-btn-green">Study 01 · Celtic Heroes</a>
              <a href="#rocket" className="vb-btn">Study 02 · Rocket Rats</a>
            </div>
          </div>
          <Hud src="det-1.jpg" alt="A Celtic Heroes frame with the trained detector's boxes: one player, eight enemies, confidences shown" w={1400} h={788} tag="live · yolov8n · 9 classes" priority />
        </div>
      </section>

      {/* PIPELINE */}
      <section className="border-b border-[var(--vb-line)] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <span className="vb-eyebrow">The loop</span>
          <h2 className="vb-display mt-4 text-[clamp(1.8rem,4vw,3rem)]">Pixels in, keystrokes out. Nothing else.</h2>
          <p className="mt-3 max-w-2xl text-[var(--vb-dim)]">No game API, no memory reading, no mods. Everything the bot knows, it read off the screen.</p>
          <ol className="vb-pipe mt-12">
            {pipeline.map(([k, v], i) => (
              <li key={k} className="vb-step" data-n={String(i + 1).padStart(2, "0")}>
                <div className="vb-mono text-sm font-semibold text-[var(--vb-text)]">{k}</div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--vb-dim)]">{v}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* STUDY 01 */}
      <section id="celtic" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="vb-eyebrow">Study 01</span>
              <h2 className="vb-display mt-4 text-[clamp(2rem,4.5vw,3.5rem)]">Celtic Heroes</h2>
              <p className="mt-3 max-w-2xl text-[var(--vb-dim)]">
                A 3D MMORPG. The bot has to find enemies, read their health, fight, loot, and walk between
                places it recognises — all from a window it can only look at.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="vb-stat"><b>340</b><span>frames hand-labelled</span></div>
              <div className="vb-stat"><b>19</b><span>classes, two detectors</span></div>
              <div className="vb-stat"><b>0.94</b><span>AP@0.5 on player</span></div>
            </div>
          </div>

          {/* perception */}
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <Hud src="det-2.jpg" alt="Entity detector on a validation frame" w={1400} h={788} tag="entities · val frame" />
            <Hud src="det-3.jpg" alt="Entity detector on another validation frame" w={1400} h={788} tag="entities · val frame" />
            <Hud src="lm-1.jpg" alt="Landmark detector recognising a place from a distance" w={1400} h={788} tag="landmarks · 10 places" />
            <Hud src="ch-labeled.jpg" alt="A training frame with its hand-drawn labels: twelve boxes" w={1400} h={788} tag="ground truth · 12 boxes" />
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr_1fr]">
            <div className="vb-panel p-6">
              <div className="vb-mono text-xs tracking-widest text-[var(--vb-dim)] uppercase">Training · mAP@0.5 on validation</div>
              <Image src={`${A}/map-curve.png`} alt="mAP@0.5 per epoch for the entity detector (60 epochs) and the landmark detector (313 epochs)" width={1800} height={630} className="mt-3 h-auto w-full rounded-lg" />
              <p className="mt-3 text-sm leading-relaxed text-[var(--vb-dim)]">
                YOLOv8n fine-tuned at 640 px, batch 16, on 285 training and 55 validation frames for entities, 110 frames for landmarks.
                Frames were pulled from recorded play and labelled with an annotator built into the toolkit. Small dataset, honest numbers:
                the player and enemies are reliable; buffs and debuffs, which are a few pixels each, are not.
              </p>
            </div>
            <div className="vb-panel p-6">
              <div className="vb-mono text-xs tracking-widest text-[var(--vb-dim)] uppercase">Per-class AP@0.5 · entities</div>
              <div className="mt-3"><Bars data={entityAP} color="var(--vb-green)" /></div>
              <div className="vb-mono mt-6 text-xs tracking-widest text-[var(--vb-dim)] uppercase">Landmarks</div>
              <div className="mt-3"><Bars data={landmarkAP} color="var(--vb-cyan)" /></div>
            </div>
          </div>

          {/* navigation */}
          <div className="mt-16 grid gap-8 md:grid-cols-[1fr_1fr]">
            <div>
              <span className="vb-eyebrow">Navigation</span>
              <h3 className="vb-display mt-3 text-2xl md:text-3xl">A map of places it can recognise.</h3>
              <p className="mt-3 text-[var(--vb-dim)]">
                Ten landmarks the detector can spot, joined by edges with rough travel times. The planner
                routes over that graph; a belief state tracks where the bot probably is between sightings
                and admits when it&apos;s lost; edge memory records how each hop actually went and blocks
                the ones that keep failing.
              </p>
              <div className="vb-mono mt-5 text-xs tracking-widest text-[var(--vb-dim)] uppercase">Walk state machine</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {["SEEKING", "APPROACHING", "SEARCHING", "RECOVERING", "ARRIVED_HOP", "ARRIVED_GOAL"].map((s) => <span key={s} className="vb-chip vb-chip-green">{s}</span>)}
              </div>
              <div className="vb-mono mt-5 text-xs tracking-widest text-[var(--vb-dim)] uppercase">Recovery ladder, when lost or stuck</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {["ROTATE_SCAN", "STEP_AND_SCAN", "BACKTRACK", "RANDOM_WALK"].map((s) => <span key={s} className="vb-chip vb-chip-amber">{s}</span>)}
              </div>
              <p className="mt-4 text-sm text-[var(--vb-dim)]">
                Stuck is detected visually: the target&apos;s box stops growing after N forward steps, or consecutive frames stay nearly identical despite movement input.
              </p>
            </div>
            <div className="vb-panel p-4">
              <div className="vb-mono px-2 pt-1 text-xs tracking-widest text-[var(--vb-dim)] uppercase">config/landmark_graph.json</div>
              <svg viewBox="0 0 620 420" className="mt-2 h-auto w-full" role="img" aria-label="Landmark graph: ten nodes with weighted edges">
                {edges.map(([a, b, w]) => {
                  const [x1, y1] = nodes[a]; const [x2, y2] = nodes[b];
                  return (
                    <g key={`${a}-${b}`}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--vb-line)" strokeWidth="2" />
                      <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 4} fill="var(--vb-dim)" fontSize="10" fontFamily="var(--font-vb-mono)" textAnchor="middle">{w}</text>
                    </g>
                  );
                })}
                {Object.entries(nodes).map(([n, [x, y]]) => (
                  <g key={n}>
                    <circle cx={x} cy={y} r="7" fill={zoneEntrances.has(n) ? "var(--vb-amber)" : "var(--vb-cyan)"} />
                    <text x={x} y={y + 20} fill="var(--vb-text)" fontSize="10" fontFamily="var(--font-vb-mono)" textAnchor="middle">{n}</text>
                  </g>
                ))}
              </svg>
              <div className="vb-mono flex gap-4 px-2 pb-1 text-[0.7rem] text-[var(--vb-dim)]">
                <span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[var(--vb-cyan)]" />landmark</span>
                <span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[var(--vb-amber)]" />zone entrance</span>
                <span>edge label = travel weight</span>
              </div>
            </div>
          </div>

          {/* learning */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              ["01 · Record", "Play, while a recorder logs every key and click against the screen capture — an mp4 and a jsonl of timestamped inputs."],
              ["02 · Imitate", "Replay the video through the perception pipeline, map each input to the nearest action in the RL action space, and train a policy by behavioural cloning."],
              ["03 · Fine-tune", "Start PPO from the cloned policy instead of from scratch, against the live game, with the combat reward."],
            ].map(([k, v]) => (
              <div key={k} className="vb-panel p-6">
                <div className="vb-mono text-sm font-semibold text-[var(--vb-green)]">{k}</div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--vb-dim)]">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Hud src="ch-a.jpg" alt="Recorded play: fighting Crookback cave guards" w={960} h={540} tag="recording · input log paired" />
            <Hud src="ch-b.jpg" alt="Recorded play: a strike landing on a large enemy" w={960} h={540} tag="recording · input log paired" />
          </div>
        </div>
      </section>

      {/* STUDY 02 */}
      <section id="rocket" className="vb-grid border-y border-[var(--vb-line)] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="vb-eyebrow">Study 02</span>
              <h2 className="vb-display mt-4 text-[clamp(2rem,4.5vw,3.5rem)]">Rocket Rats</h2>
              <p className="mt-3 max-w-2xl text-[var(--vb-dim)]">
                A top-down survival arena. This time the goal was reinforcement learning from the start:
                a PPO agent that learns to stay alive as long as possible, driving the real game through
                screen capture and synthetic input. The capture, input, template, OCR, and calibration
                code came straight from the first study; everything game-specific is new.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="vb-stat"><b>15 Hz</b><span>env step rate</span></div>
              <div className="vb-stat"><b>9</b><span>discrete actions</span></div>
              <div className="vb-stat"><b>~50k</b><span>env steps per hour</span></div>
            </div>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <Hud src="rr-regions.jpg" alt="A Rocket Rats frame with the calibrated regions the env reads: hearts, timer, upgrade slot, retry and confirm buttons" w={1280} h={720} tag="what the env reads · regions.json" />
            <div className="vb-panel p-6">
              <div className="vb-mono text-xs tracking-widest text-[var(--vb-dim)] uppercase">Observation</div>
              <p className="mt-2 text-sm text-[var(--vb-dim)]"><span className="vb-mono text-[var(--vb-text)]">frame</span> — (4, 84, 84) uint8, stacked grayscale downscales. Spatial layout.</p>
              <Image src={`${A}/rr-obs.png`} alt="Four consecutive 84 by 84 grayscale frames, as the policy sees them" width={1416} height={336} className="mt-3 h-auto w-full rounded" style={{ imageRendering: "pixelated" }} />
              <p className="mt-3 text-sm text-[var(--vb-dim)]"><span className="vb-mono text-[var(--vb-text)]">vec</span> — (5,) float32: hearts, hearts lost this step, fraction of the step cap elapsed, score delta, upgrade-screen flag. The game&apos;s facts stated outright, so the policy does not have to learn to read the HUD.</p>
              <div className="vb-mono mt-5 text-xs tracking-widest text-[var(--vb-dim)] uppercase">Action</div>
              <p className="mt-2 text-sm text-[var(--vb-dim)]"><span className="vb-mono text-[var(--vb-text)]">Discrete(9)</span> — eight movement directions plus no-op, applied as held keys. The env diffs the held set against the action&apos;s target set and sends only the delta.</p>
              <div className="vb-mono mt-5 text-xs tracking-widest text-[var(--vb-dim)] uppercase">Reward</div>
              <p className="mt-2 text-sm text-[var(--vb-dim)]">Survival-dominant: a small bonus per surviving step, a penalty per heart lost, a terminal death penalty, and a small shaping term on cheese picked up.</p>
            </div>
          </div>

          <div className="vb-panel mt-8 overflow-x-auto p-6">
            <div className="vb-mono text-xs tracking-widest text-[var(--vb-dim)] uppercase">Measured facts about the game — established by inspection, not assumed</div>
            <table className="vb-table mt-3">
              <thead><tr><th>Thing</th><th>Finding</th></tr></thead>
              <tbody>{rrFacts.map(([k, v]) => <tr key={k}><td>{k}</td><td className="text-[var(--vb-dim)]">{v}</td></tr>)}</tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <blockquote className="vb-quote">
              Phase 1 is movement only, fixed build. During a wave break the env picks a fixed card and emits no step, so the trajectory contains only in-run movement decisions. Learning which upgrades to take is a separate problem.
              <small>README · scope</small>
            </blockquote>
            <blockquote className="vb-quote">
              Real-time screen-captured RL gets ~50k env steps per wall-clock hour, against millions for a native env. If the game&apos;s source or a mod hook ever becomes available, wrapping the game directly beats every optimization in this repo combined.
              <small>README · constraint worth knowing</small>
            </blockquote>
          </div>
        </div>
      </section>

      {/* TAKEAWAYS */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <span className="vb-eyebrow">What I took from it</span>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ["Calibrate, then trust", "Regions, colour ranges, and thresholds were measured with small tools and written to JSON, not guessed. Every number in the facts table came from looking."],
              ["Give the policy the facts", "Reading the HUD is a solved problem; the agent shouldn't relearn it. Hand it hearts and score as numbers and let it spend its capacity on movement."],
              ["Know the ceiling", "A screen-driven env is two orders of magnitude slower than a native one. It's fine for a movement policy. It's the wrong tool for anything bigger, and the README says so."],
            ].map(([k, v]) => (
              <div key={k} className="vb-panel p-6">
                <div className="vb-display text-xl">{k}</div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--vb-dim)]">{v}</p>
              </div>
            ))}
          </div>
          <p className="vb-mono mt-10 text-xs text-[var(--vb-dim)]">
            Built as a study of perception and control, run on my own accounts, never distributed. Code available on request.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={CONTACT} className="vb-btn vb-btn-green">Ask for the code</a>
            <Link href="/" className="vb-btn">More of my work</Link>
          </div>
        </div>
      </section>

      <footer className="vb-mono border-t border-[var(--vb-line)] px-6 py-6 text-center text-xs text-[var(--vb-dim)]">
        © {new Date().getFullYear()} Alex Zaalishvili · Celtic Heroes and Rocket Rats belong to their respective owners.
      </footer>
    </main>
  );
}
