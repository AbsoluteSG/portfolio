import type { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    id: "siphon-games",
    role: "Founder & Lead Developer",
    company: "Siphon Games",
    startDate: "Apr 2023",
    endDate: "Present",
    description: [
      "Shipped Banana Clicker on Steam in March 2023 (Unity, C#; 1,000+ unique sales), then rebuilt it from scratch in 2026 in Electron, React and TypeScript (~33k lines) with a Node/Fastify/SQLite service on Fly.io that owns gacha rolls, chat, clans and seasonal leaderboards. Eleven releases in the first month after the relaunch.",
      "Lead engineering on No Dogs Allowed, a 2D Metroidvania in Unity 6: ~106k lines of C# across nine assembly definitions with a one-way dependency graph and 300+ tests; in-house dialogue, save-migration and world-streaming systems; in-editor content tools so artists and writers can author without code.",
      "Built the studio's Rust game launcher: a five-crate workspace that installs self-hosted builds from SHA-256 manifests, verifies every file before applying an update, and launches through Steam or directly.",
      "Run the Git workflow, documentation, and release schedule for a distributed team of contract artists and composers.",
    ],
    technologies: ["TypeScript", "React", "Electron", "Node.js", "Unity", "C#", "Rust", "Steamworks", "Git"],
  },
  {
    id: "csi-help-desk",
    role: "Help Desk Assistant",
    company: "CUNY College of Staten Island",
    startDate: "Jul 2022",
    endDate: "Dec 2023",
    description: [
      "Front-line technical support for students, faculty, and staff: hardware, software, network, and account issues, in person, by phone, and through the campus ticketing system.",
      "Triaged and documented tickets and kept the internal knowledge base current.",
    ],
    technologies: ["Technical Support", "Troubleshooting", "Documentation"],
  },
];
