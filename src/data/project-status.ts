import type { ProjectStatus } from "@/types";

export const projectStatusLabel: Record<ProjectStatus, string> = {
  shipped: "Shipped",
  "in-production": "In production",
  "in-development": "In development",
  prototype: "Prototype",
};
