import type { Metadata } from "next";
import { CourseShell } from "../_shared/course-shell";
import { units, chapters } from "./_course";
import "./algorithms.css";

export const metadata: Metadata = {
  title: { default: "Algorithms, seen", template: "%s · Algorithms" },
  description: "Programming patterns you can watch: prefix sums, memoization, dynamic programming and graphs, each drawn as it runs.",
  alternates: { canonical: "/algo" },
  openGraph: { title: "Algorithms, seen", description: "A visual, interactive walk through the core programming patterns.", url: "/algo", type: "website" },
};

export default function AlgorithmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <CourseShell basePath="/algo" title="Algorithms" units={units} chapters={chapters}>
      {children}
    </CourseShell>
  );
}
