import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "tutor-payroll",
    title: "Borough Prep — Tutor Payroll",
    description:
      "Marketing site + full-stack bookkeeping app for Borough Prep, an independent tutoring studio. Replaced their shared spreadsheet; in production with real tutors, one-click Stripe Connect payouts, and a live-chat queue.",
    longDescription:
      "Tutors log classes, the manager sets per-client rates, and balances come from an append-only ledger — each class snapshots its rate so changing a rate later never rewrites history. Payouts go out through Stripe Connect. The public site carries a live-chat queue where staff availability is a heartbeat rather than a setting, plus a rate-limited AI assistant locked to a closed brief so it never invents a price.",
    image: "/assets/projects/tutor-payroll.png",
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Auth.js", "Stripe Connect"],
    category: "web",
    github: "https://github.com/AbsoluteSG/tutor-payroll",
    liveUrl: "https://tutor-payroll-absolutez.vercel.app",
    featured: false,
  },
  {
    id: "banana-clicker",
    title: "Banana Clicker",
    description:
      "An idle/incremental game published on Steam with 1,000+ unique sales. Built with modular progression systems and internal balancing tools; 10+ post-launch patches.",
    longDescription:
      "Banana Clicker is an idle/incremental game that I designed and developed from concept to commercial release on Steam (March 2023). It features layered progression systems, resource generation loops, upgrade mechanics, and event-driven gameplay — all built on a modular architecture designed for long-term balance and extensibility. Internal tooling tunes values at runtime and validates progression curves automatically.",
    image: "/assets/projects/banana-clicker.jpg",
    tags: ["Unity", "C#", "Steam", "Game Design"],
    category: "game",
    github: "https://github.com/AbsoluteSG/banana-clicker-source",
    liveUrl: "https://store.steampowered.com/app/2322080/Banana_Clicker/",
    slug: "banana-clicker",
    page: "/projects/banana-clicker",
    featured: true,
  },
  {
    id: "vrox",
    title: "Vrox",
    description:
      "A server-authoritative bullet-hell MMO prototype on SpacetimeDB + Unity. Clients send intent at 20 Hz and render server truth; projectiles are written once and positioned analytically, so a bullet costs one insert and one delete.",
    longDescription:
      "It began as a player that moves and shoots, on a server, and nothing else. The server module and its realm generator are now about 7,900 lines of C#: seeded realm generation with a reachability check, biomes, enemies with phases, loot pools and bag tiers, a backpack and a vault, character slots. Each layer was played before the next one went in.",
    image: "/assets/projects/vrox.jpg",
    tags: ["C#", "Unity", "SpacetimeDB", "Multiplayer", "Netcode"],
    category: "game",
    github: "https://github.com/AbsoluteSG/vrox",
    page: "/projects/vrox",
    featured: false,
  },
  {
    id: "critter-cove",
    title: "Critter Cove",
    description:
      "A cozy co-op zoo builder with bite, written in Rust. Explore a procedurally generated wilderness, catch critters that fight back, breed hybrids from 100+ species, and open your cove to friends over Steam.",
    longDescription:
      "Critter Cove started as cmd_zoo, a way to learn Rust by shipping a complete game. ~30k lines across a game crate, a core crate, and a SpacetimeDB module; 200+ tests on the engine-free domain; chunk streaming with hysteresis, noise-driven biomes with weighted spawn tables, versioned saves with forward migrations, a Steam relay transport behind a cargo feature, and a SpacetimeDB online hub.",
    image: "/assets/projects/critter-cove.jpg",
    tags: ["Rust", "Macroquad", "Procedural Generation", "SpacetimeDB", "Steamworks"],
    category: "game",
    github: "https://github.com/AbsoluteSG/cmd_zoo",
    page: "/projects/critter-cove",
    featured: false,
  },
  {
    id: "no-dogs-allowed",
    title: "No Dogs Allowed",
    description:
      "A cooking Metroidvania in development at Siphon Games. Fifteen-year-old Whiskers walks out of a burning kitchen with no plan; the Dog Mafia has his parents; the restaurant has to open. Cook, fight, grow, fish, roam.",
    longDescription:
      "A 2D open-world Metroidvania built in Unity 6 (URP 2D): ~55k lines of C# across nine assembly definitions with a strict one-directional dependency graph, data-driven items/recipes/crops/quests, GOAP enemy AI, FMOD audio, Yarn Spinner dialogue, and a separate Next.js tool that draws the branching plot graph and cast. As lead engineer I own the gameplay programming, systems architecture, in-editor content tools, and the Git workflow for a distributed team of artists and composers.",
    image: "/assets/projects/no-dogs-allowed.jpg",
    tags: ["Unity", "C#", "Systems Architecture", "Tools Dev", "Metroidvania"],
    category: "game",
    liveUrl: "/projects/no-dogs-allowed",
    slug: "metroidvania",
    page: "/projects/no-dogs-allowed",
    featured: false,
  },
  {
    id: "vision-bots",
    title: "Vision Bots",
    description:
      "Two studies in playing games from pixels alone: YOLOv8 detectors and a landmark-graph navigator for Celtic Heroes, then a PPO agent that learns to survive Rocket Rats through screen capture and synthetic input.",
    longDescription:
      "No game API — the bots only ever see the window. A perception toolkit (Win32 capture, calibrated regions, HSV readers, OCR, template matching, two fine-tuned YOLOv8 detectors on 340 hand-labelled frames) feeds either a scripted strategy, a graph planner with belief state and recovery behaviours, or a Gymnasium env for PPO. The second study ports the infrastructure to a new game and measures everything before assuming it.",
    image: "/assets/projects/vision-bots.jpg",
    tags: ["Python", "YOLOv8", "OpenCV", "Reinforcement Learning", "PPO"],
    category: "tool",
    page: "/projects/vision-bots",
    featured: false,
  },
];
