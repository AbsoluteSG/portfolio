import type { Metadata } from "next";
import { Sidebar } from "./sidebar";
import "./linalg.css";

const url = "https://alex-zaalishvili.vercel.app/linalg";

export const metadata: Metadata = {
  title: { default: "Linear algebra, seen", template: "%s · Linear algebra" },
  description: "An intro linear algebra course where every matrix on the page is live. One coordinate plane, tweened from Gaussian elimination to the SVD.",
  openGraph: { title: "Linear algebra, seen", description: "A visual, interactive walk through an intro linear algebra course.", url, type: "website" },
};

export default function LinalgLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="la-root">
      <div className="la-shell">
        <Sidebar />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
