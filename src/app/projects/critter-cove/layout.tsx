import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./critter-cove.css";

const display = Fredoka({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-cc-display" });
const body = Nunito({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-cc-body" });

const url = "https://alex-zaalishvili.vercel.app/projects/critter-cove";

export const metadata: Metadata = {
  title: { absolute: "Critter Cove — a cozy co-op zoo builder with bite" },
  description:
    "Explore a procedurally generated wilderness, catch the critters that roam it, and raise them into a zoo — solo, or with up to three friends over Steam. Written in Rust.",
  openGraph: {
    title: "Critter Cove",
    description: "A cozy co-op zoo builder with bite. Written in Rust.",
    url,
    siteName: "Siphon Games",
    images: [{ url: "/projects/critter-cove/hero-day.jpg", width: 1792, height: 592 }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Critter Cove", images: ["/projects/critter-cove/hero-day.jpg"] },
};

export default function CritterCoveLayout({ children }: { children: React.ReactNode }) {
  // Standalone product page: its own fonts and a meadow palette, independent of the portfolio theme.
  return (
    <div className={`${display.variable} ${body.variable} cc-root`} data-theme="light">
      {children}
    </div>
  );
}
