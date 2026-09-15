import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./vrox.css";

const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-vx-pixel" });
const body = VT323({ weight: "400", subsets: ["latin"], variable: "--font-vx-body" });

const url = "https://alex-zaalishvili.vercel.app/projects/vrox";

export const metadata: Metadata = {
  title: { absolute: "Vrox — a player that moves and shoots, on a server" },
  description:
    "A server-authoritative bullet-hell MMO prototype on SpacetimeDB and Unity. Clients send intent; the server decides; projectiles are written once and positioned analytically. Seeded realm generation, enemies with phases, loot bags, vaults.",
  openGraph: {
    title: "Vrox",
    description: "Server-authoritative bullet hell on SpacetimeDB + Unity. Written once, never updated.",
    url,
    siteName: "Alex Zaalishvili",
    type: "website",
  },
  twitter: { card: "summary", title: "Vrox" },
};

export default function VroxLayout({ children }: { children: React.ReactNode }) {
  // Standalone page: pixel fonts and a Realm-of-the-Mad-God-ish palette, independent of the portfolio theme.
  return (
    <div className={`${pixel.variable} ${body.variable} vx-root`} data-theme="dark">
      {children}
    </div>
  );
}
