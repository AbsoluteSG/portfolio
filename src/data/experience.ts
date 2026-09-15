import type { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    id: "exp-1",
    role: "Founder & Lead Developer",
    company: "Siphon Games",
    startDate: "May 2024",
    endDate: "Present",
    description: [
      "Founded an independent game studio and architected production pipelines for sustainable long-term development",
      "Leading end-to-end design and programming of No Dogs Allowed, a 2D cooking Metroidvania, engineering core movement, combat systems, level logic, and custom in-house content creation tools",
      "Established documentation standards, development schedules, and Git workflows to coordinate a distributed collaborative team",
      "Directing cross-disciplinary collaboration with artists, composers, and contractors to ensure gameplay vision aligns with visual and audio direction",
    ],
    technologies: ["Unity", "C#", "Git", "Gameplay Systems", "Tools Dev"],
  },
  {
    id: "exp-2",
    role: "Game Developer",
    company: "Siphon Games",
    startDate: "Apr 2023",
    endDate: "May 2024",
    description: [
      "Designed and shipped Banana Clicker, an idle/incremental game published on Steam with over 1,000 unique sales",
      "Architected modular gameplay systems including progression balancing, resource generation, upgrade trees, and event-driven mechanics",
      "Built internal tooling for runtime value tuning, automated testing, and long-term progression curve validation",
      "Collaborated closely with artists and audio designers to shape the game's thematic and visual identity from concept to launch",
    ],
    technologies: ["Unity", "C#", "Steam SDK", "Game Design", "QA Tooling"],
  },
  {
    id: "exp-3",
    role: "HelpDesk Assistant",
    company: "College of Staten Island",
    startDate: "Jul 2022",
    endDate: "Dec 2023",
    description: [
      "Provided front-line technical support to students and staff, diagnosing and resolving hardware, software, and account issues",
      "Managed and triaged support tickets, improving response efficiency and documentation accuracy across the department",
      "Delivered clear and approachable guidance, contributing to measurably improved user satisfaction",
    ],
    technologies: ["Technical Support", "Troubleshooting", "Documentation"],
  },
];
