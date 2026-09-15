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
    featured: true,
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
    featured: false,
  },
  {
    id: "vrox",
    title: "Vrox — Server-Authoritative Shooter",
    description:
      "A multiplayer prototype where the server owns all state: clients send intent at 20 Hz and render server truth. Projectiles are written once and positioned analytically, so a bullet costs one insert and one delete.",
    longDescription:
      "Vrox is a deliberately small multiplayer shooter built on SpacetimeDB and Unity. The server is authoritative with no client prediction — what you see is the truth. A shot's row is written once and never updated; its position is a function of time (origin + dir · speed · t) evaluated independently by every client. Rate of fire is enforced server-side. Bullet patterns (spread, ring, parallel, helix) compose with spin and wave modifiers derived from spawn timestamps, so they need no per-player state and survive disconnects.",
    image: "/assets/projects/vrox.png",
    tags: ["C#", "Unity", "SpacetimeDB", "Multiplayer", "Netcode"],
    category: "game",
    github: "https://github.com/AbsoluteSG/vrox",
    featured: false,
  },
  {
    id: "cmd-zoo",
    title: "cmd_zoo",
    description:
      "An open-world idle zoo sim in Rust: chunk-streamed world, biome-driven procedural spawns, breeding with 100+ hybrid species, post-process shaders, and optional online visiting over a Steam relay.",
    longDescription:
      "cmd_zoo is a hands-on study in building a complete game in Rust with Macroquad rather than following a tutorial. Each module explores a different area: camera/projection and billboard rendering, chunk load/cull with hysteresis, per-species evasion AI, a breeding and hybrid recipe system, save persistence via the platform app-data directory, five fullscreen post-process shaders, and a session/avatar layer that supports visiting a friend's zoo over a Steam relay transport (feature-gated so the project always builds without the SDK). Tested with cargo test.",
    image: "/assets/projects/cmd-zoo.png",
    tags: ["Rust", "Macroquad", "Procedural Generation", "Steamworks", "Shaders"],
    category: "game",
    github: "https://github.com/AbsoluteSG/cmd_zoo",
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
    liveUrl: "https://siphongames.vercel.app",
    slug: "metroidvania",
    page: "/projects/no-dogs-allowed",
    featured: false,
  },
  {
    id: "cv-automation",
    title: "Computer Vision Automation Tool",
    description:
      "A C++ tool using OpenCV for real-time template matching and automated input simulation, achieving a ~5x throughput gain over manual play.",
    longDescription:
      "A lightweight computer vision tool built in C++ with OpenCV that detects on-screen objects in real time and automates an in-game action loop. Integrates template matching with Win32 input simulation to achieve a 5x efficiency increase in item collection tasks.",
    image: "/assets/projects/cv-automation.png",
    tags: ["C++", "OpenCV", "Win32 API", "Computer Vision"],
    category: "tool",
    slug: "cv-automation",
    featured: false,
  },
];
