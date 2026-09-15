import type { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    id: "exp-1",
    role: "Founder & Lead Developer",
    company: "Siphon Games",
    startDate: "Apr 2023",
    endDate: "Present",
    description: [
      "Designed, built, and shipped Banana Clicker (Unity, C#) on Steam in March 2023: 1,000+ unique sales, 10+ post-launch patches driven by player feedback. About 23,000 lines of C#: a service layer with explicit lifecycles, a typed event bus, Addressables-loaded content, multi-slot saves, Steam achievements.",
      "Lead engineering on No Dogs Allowed, a 2D Metroidvania in Unity 6: about 55,000 lines of C# across nine assembly definitions with a one-directional dependency graph; data-driven items, recipes, crops, and quests; in-editor content tools so artists and designers can author without code.",
      "Run the Git workflow, documentation, and release schedule for a distributed team of contract artists and composers.",
      "Built the studio's site and a story-authoring tool (a branching plot graph and cast editor) in Next.js and TypeScript.",
    ],
    technologies: ["Unity", "C#", "Next.js", "TypeScript", "Git", "Steamworks"],
  },
  {
    id: "exp-2",
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
