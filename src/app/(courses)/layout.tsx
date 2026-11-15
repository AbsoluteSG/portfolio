import "./_shared/course-shell.css";

/** Route group for the interactive courses. Shares one stylesheet; each course supplies its own sidebar and metadata. */
export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
