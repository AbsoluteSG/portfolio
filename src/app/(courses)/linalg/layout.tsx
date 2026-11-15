import type { Metadata } from "next";
import { CourseShell } from "../_shared/course-shell";
import { units, chapters } from "./_course";

export const metadata: Metadata = {
  title: { default: "Linear algebra, seen", template: "%s · Linear algebra" },
  description: "An intro linear algebra course where every matrix on the page is live. One coordinate plane, tweened from Gaussian elimination to the SVD.",
  alternates: { canonical: "/linalg" },
  openGraph: { title: "Linear algebra, seen", description: "A visual, interactive walk through an intro linear algebra course.", url: "/linalg", type: "website" },
};

export default function LinearAlgebraLayout({ children }: { children: React.ReactNode }) {
  return (
    <CourseShell basePath="/linalg" title="Linear algebra" units={units} chapters={chapters}>
      {children}
    </CourseShell>
  );
}
