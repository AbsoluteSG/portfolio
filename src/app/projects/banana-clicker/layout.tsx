import type { Metadata } from "next";
import { Luckiest_Guy, Nunito } from "next/font/google";
import "./banana-clicker.css";

const display = Luckiest_Guy({ weight: "400", subsets: ["latin"], variable: "--font-bc-display" });
const body = Nunito({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--font-bc-body" });

const url = "https://alex-zaalishvili.vercel.app/projects/banana-clicker";

export const metadata: Metadata = {
  title: { absolute: "Banana Clicker — Click. Upgrade. Conquer." },
  description:
    "Build a banana empire, unlock powerful upgrades, and uncover a wild banana-fueled conspiracy. An absurdist idle/clicker RPG on Steam by Siphon Games.",
  openGraph: {
    title: "Banana Clicker — Click. Upgrade. Conquer.",
    description: "An absurdist idle/clicker RPG on Steam. Factions, gacha, Banana Storms, and a lore that goes way too hard.",
    url,
    siteName: "Siphon Games",
    images: [{ url: "/projects/banana-clicker/capsule_616x353.jpg", width: 616, height: 353 }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Banana Clicker", images: ["/projects/banana-clicker/capsule_616x353.jpg"] },
};

export default function BananaClickerLayout({ children }: { children: React.ReactNode }) {
  // Standalone product page: no portfolio nav, its own fonts, always light — the game's palette, not the site's theme.
  return (
    <div className={`${display.variable} ${body.variable} bc-root`} data-theme="light">
      {children}
    </div>
  );
}
