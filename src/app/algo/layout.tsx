import type { Metadata } from "next";
import { Sidebar } from "./sidebar";
import "../linalg/linalg.css";
import "./algo.css";

const url = "https://alex-zaalishvili.vercel.app/algo";

export const metadata: Metadata = {
  title: { default: "Algorithms, seen", template: "%s · Algorithms" },
  description: "Programming patterns you can watch: prefix sums, memoization, dynamic programming and graphs, each drawn as it runs.",
  openGraph: { title: "Algorithms, seen", description: "A visual, interactive walk through the core programming patterns.", url, type: "website" },
};

export default function AlgoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="la-root">
      <div className="la-shell">
        <Sidebar />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
