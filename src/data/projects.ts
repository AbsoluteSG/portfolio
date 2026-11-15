import type { Project } from "@/types";

/**
 * Every project on the home page, in display order. The first `featured` entry gets the large card.
 * Numbers in the copy are counted from the repositories; keep them verifiable when you edit.
 */
export const projects: Project[] = [
  {
    id: "banana-clicker",
    title: "Banana Clicker",
    description:
      "An idle game on Steam with 1,000+ unique sales, rebuilt from scratch in Electron, React and TypeScript with an online server for banner pulls, chat, clans and seasonal leaderboards. Eleven releases in the first month after the relaunch.",
    longDescription:
      "Banana Clicker first shipped on Steam in March 2023 as a Unity game. In October 2026 I replaced it with a ground-up rebuild in Electron, React 19 and TypeScript (~33k lines), with Steamworks over FFI and native Windows and Linux builds. A Node/Fastify service on Fly.io with SQLite verifies Steam tickets, owns every gacha roll and pity counter, and runs chat, friends, clans, season leaderboards and play analytics, covered by 42 integration tests. Simulation scripts solve the economy's thresholds, later retuned against live player data.",
    image: "/assets/projects/banana-clicker.jpg",
    imageAlt: "Banana Clicker capsule art",
    tags: ["TypeScript", "React", "Electron", "Node.js", "Fastify", "SQLite", "Fly.io", "Steamworks"],
    category: "game",
    status: "shipped",
    period: "2023–2026",
    github: "https://github.com/AbsoluteSG/banana-clicker-source",
    liveUrl: "https://store.steampowered.com/app/2322080/Banana_Clicker/",
    page: "/projects/banana-clicker",
    featured: true,
  },
  {
    id: "tutor-payroll",
    title: "Borough Prep",
    description:
      "Marketing site and full-stack bookkeeping app for Borough Prep, an independent tutoring studio. Replaced their shared spreadsheet; in production with real tutors, one-click Stripe Connect payouts, and a live-chat queue.",
    longDescription:
      "Tutors log classes, the manager sets per-client rates, and balances come from an append-only ledger: each class snapshots its rate, so changing a rate later never rewrites history. Payouts go out through Stripe Connect. The public site carries a live-chat queue where staff availability is a heartbeat rather than a setting, plus a rate-limited AI assistant locked to a closed brief so it never invents a price.",
    image: "/assets/projects/tutor-payroll.png",
    imageAlt: "Borough Prep bookkeeping dashboard",
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Auth.js", "Stripe Connect"],
    category: "web",
    status: "in-production",
    period: "2026",
    github: "https://github.com/AbsoluteSG/tutor-payroll",
    liveUrl: "https://tutor-payroll-absolutez.vercel.app",
  },
  {
    id: "local-ai",
    title: "Local AI",
    description:
      "A private AI desktop suite that runs open models on your own GPU. Five task profiles drive a tool-using agent loop, and Immersive Mode turns the assistant into a HUD of floating panels across the desktop.",
    longDescription:
      "A Tauri 2 app with a Rust backend (~5.7k lines) and a plain TypeScript UI (~5.6k lines) that starts a portable Ollama runtime on launch and stops it on exit. Each profile (code, assistant, story, video, UI design) gets its own model, system prompt and tool set; the agent loop streams tokens, executes tool calls behind ask / auto-approve modes, and keeps file tools confined to the chat's folder. Web search runs against a self-hosted SearXNG container, skills load on demand from SKILL.md folders, and everything installs into one folder with no services or registry entries.",
    image: "/assets/projects/local-ai.jpg",
    imageAlt: "Local AI Immersive Mode: floating HUD panels with GPU stats, a chart and a chat",
    tags: ["Rust", "Tauri", "TypeScript", "Tokio", "Ollama", "LLM Agents"],
    category: "tool",
    status: "prototype",
    period: "2026",
    liveUrl: "/projects/local-ai/trailer.mp4",
  },
  {
    id: "siphon-launcher",
    title: "Siphon Launcher",
    description:
      "A desktop game launcher for Siphon Games, written in Rust. Works alongside Steam, and installs self-hosted builds from content-addressed manifests so an update downloads only the files that changed.",
    longDescription:
      "A five-crate Cargo workspace (~8.7k lines): a UI-free core library, an egui desktop app, a CLI, a build publisher and a local dev server. It finds Steam libraries through the registry and its own VDF parser and launches through Steam or directly. Self-hosted games install from SHA-256 manifests into a staging folder and are applied only after every file verifies, so a failed update never leaves a half-patched game. Downloads use HMAC-signed, expiring links from a Cloudflare Worker backed by R2 and Supabase.",
    image: "/assets/projects/siphon-launcher.jpg",
    imageAlt: "Siphon Launcher icon",
    tags: ["Rust", "egui", "Cargo Workspace", "SHA-256 Manifests", "Cloudflare Workers", "Win32"],
    category: "tool",
    status: "in-development",
    period: "2026",
  },
  {
    id: "minecraft-fabric-mods",
    title: "Minecraft Fabric Mods",
    description:
      "Original mods, ports and a server-side reimplementation of mcMMO for Minecraft 26.3 on Fabric, plus a modpack that updates itself on launch in any launcher. Every mod ships with in-game automated tests.",
    longDescription:
      "Productive Squids is an original mod (~5.3k lines of Java, 23 gametests). The mcMMO reimplementation rebuilds the Bukkit plugin as a server-side Fabric mod that vanilla clients can join (~13k lines, 68 gametests). Unofficial ports bring BlakeBr0's Extended Crafting from NeoForge and Refined Storage 2 forward to Fabric 26.3 (156 gametests on the latter). The pack's updater is a Fabric preLaunch mod that checks every file against a SHA-1 manifest, stages jars Windows has locked for a helper process to swap in after exit, and backs up every world before a launch where a mod has gone missing. A Python publish pipeline refuses to push until a real headless client launch passes.",
    image: "/assets/projects/fabric-mods.jpg",
    imageAlt: "In-game screenshots: squid aquarium, crafting table, squid tanks, storage network",
    tags: ["Java", "Fabric", "Gradle", "Gametests", "Python", "C#"],
    category: "tool",
    status: "shipped",
    period: "2026",
  },
  {
    id: "no-dogs-allowed",
    title: "No Dogs Allowed",
    description:
      "A cooking Metroidvania in development at Siphon Games, where I lead engineering. Unity 6, ~106k lines of C# across nine assemblies, with in-house dialogue, save and world-streaming systems.",
    longDescription:
      "A 2D open-world Metroidvania in Unity 6 (URP 2D): nine assembly definitions with a strict one-way dependency graph and 300+ tests, including headless .NET suites that run outside the editor. Recent work replaced third-party AI and dialogue packages with in-house systems: a localized dialogue engine with FMOD voice-over, authored as Markdown and compiled by an in-editor workbench; a versioned save pipeline with migrations; seamless world streaming with persistent scheduled NPCs; and one kinematic motor and combat module shared by every agent. Movement and combat timing were first prototyped in a from-scratch MonoGame build (~57k lines, 750+ self-test checks).",
    image: "/assets/projects/no-dogs-allowed.jpg",
    imageAlt: "No Dogs Allowed key art",
    tags: ["Unity", "C#", "Systems Architecture", "Editor Tooling", "FMOD", "MonoGame"],
    category: "game",
    status: "in-development",
    period: "2026",
    page: "/projects/no-dogs-allowed",
  },
  {
    id: "critter-cove",
    title: "Critter Cove",
    description:
      "A cozy co-op zoo builder with bite, written in Rust. Explore a procedurally generated wilderness, catch critters that fight back, breed hybrids from 100+ species, and open your cove to friends over Steam.",
    longDescription:
      "Critter Cove started as cmd_zoo, a way to learn Rust by shipping a complete game. ~30k lines across a game crate, a core crate, and a SpacetimeDB module; 200+ tests on the engine-free domain; chunk streaming with hysteresis, noise-driven biomes with weighted spawn tables, versioned saves with forward migrations, a Steam relay transport behind a cargo feature, and a SpacetimeDB online hub.",
    image: "/assets/projects/critter-cove.jpg",
    imageAlt: "Critter Cove meadow at daytime",
    tags: ["Rust", "Macroquad", "Procedural Generation", "SpacetimeDB", "Steamworks"],
    category: "game",
    status: "in-development",
    period: "2026",
    github: "https://github.com/AbsoluteSG/cmd_zoo",
    page: "/projects/critter-cove",
  },
  {
    id: "vision-bots",
    title: "Vision Bots",
    description:
      "Two studies in playing games from pixels alone: YOLOv8 detectors and a landmark-graph navigator for Celtic Heroes, then a PPO agent that learns to survive Rocket Rats through screen capture and synthetic input.",
    longDescription:
      "No game API: the bots only ever see the window. A perception toolkit (Win32 capture, calibrated regions, HSV readers, OCR, template matching, two fine-tuned YOLOv8 detectors on 340 hand-labelled frames) feeds either a scripted strategy, a graph planner with belief state and recovery behaviours, or a Gymnasium env for PPO. The second study ports the infrastructure to a new game and measures everything before assuming it.",
    image: "/assets/projects/vision-bots.jpg",
    imageAlt: "YOLOv8 detections drawn over a game frame",
    tags: ["Python", "YOLOv8", "OpenCV", "Reinforcement Learning", "PPO"],
    category: "tool",
    status: "prototype",
    period: "2026",
    page: "/projects/vision-bots",
  },
];
