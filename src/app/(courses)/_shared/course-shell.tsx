import { CourseSidebar } from "./course-sidebar";
import type { IndexedChapter, Unit } from "./course-model";

interface CourseShellProps {
  basePath: string;
  title: string;
  units: Unit[];
  chapters: IndexedChapter[];
  children: React.ReactNode;
}

/** Two-column course frame: chapter sidebar on the left, chapter content on the right. */
export function CourseShell({ basePath, title, units, chapters, children }: CourseShellProps) {
  return (
    <div className="la-root">
      <div className="la-shell">
        <CourseSidebar basePath={basePath} title={title} units={units} chapters={chapters} />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
