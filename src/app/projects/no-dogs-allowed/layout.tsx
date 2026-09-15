import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./no-dogs-allowed.css";

const display = Baloo_2({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-nda-display" });
const body = Nunito({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-nda-body" });

const url = "https://alex-zaalishvili.vercel.app/projects/no-dogs-allowed";

export const metadata: Metadata = {
  title: { absolute: "No Dogs Allowed — a cooking Metroidvania" },
  description:
    "Whiskers is fifteen. He walks out of a burning kitchen with his father's handkerchief and nothing else. The Dog Mafia has his parents. A 2D Metroidvania about cooking, fighting, and a supply chain, in development at Siphon Games.",
  openGraph: {
    title: "No Dogs Allowed",
    description: "A 2D Metroidvania about cooking, fighting, and a supply chain. In development at Siphon Games.",
    url,
    siteName: "Siphon Games",
    images: [{ url: "/projects/no-dogs-allowed/hero.jpg", width: 1920, height: 1080 }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "No Dogs Allowed", images: ["/projects/no-dogs-allowed/hero.jpg"] },
};

export default function NoDogsAllowedLayout({ children }: { children: React.ReactNode }) {
  // Standalone product page — its own fonts and palette (the key art's navy/gold/red), not the portfolio theme.
  return (
    <div className={`${display.variable} ${body.variable} nda-root`} data-theme="dark">
      {children}
    </div>
  );
}
