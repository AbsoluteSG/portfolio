import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./vision-bots.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-vb-display" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-vb-mono" });

const url = "https://alex-zaalishvili.vercel.app/projects/vision-bots";

export const metadata: Metadata = {
  title: { absolute: "Vision Bots — playing games through the screen" },
  description:
    "Two studies in playing games from pixels alone: a YOLO-driven navigator for Celtic Heroes, and a PPO agent for Rocket Rats. Screen capture in, synthetic input out. Python, YOLOv8, Stable-Baselines3.",
  openGraph: {
    title: "Vision Bots",
    description: "Playing games through the screen: YOLO detectors, a landmark navigator, and a PPO agent.",
    url,
    siteName: "Alex Zaalishvili",
    images: [{ url: "/projects/vision-bots/det-1.jpg", width: 1400, height: 788 }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Vision Bots", images: ["/projects/vision-bots/det-1.jpg"] },
};

export default function VisionBotsLayout({ children }: { children: React.ReactNode }) {
  // Standalone study page: dark instrument-panel look, its own fonts, independent of the portfolio theme.
  return (
    <div className={`${display.variable} ${mono.variable} vb-root`} data-theme="dark">
      {children}
    </div>
  );
}
