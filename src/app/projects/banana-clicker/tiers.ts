/**
 * The game's rarity ladder, shared by every concept panel so a tier is the same
 * colour wherever it shows up.
 *
 * `fill` is for solid blocks — borders, chips, meter fills — where the ink or
 * white in `ink` sits on top. `onDark` is the same tier used as *text* on the
 * navy panels: grape and coral only reach ~2.7:1 and ~1.9:1 there, so those two
 * get a lighter tint rather than being used raw.
 *
 * `plate` is the near-white wash a gear sprite sits on. Painting sprites
 * straight onto `fill` loses them — a gold halo on legendary gold, pale ice on
 * rare blue — so tier reads as the frame around the sprite, not underneath it.
 */

export type Tier = "common" | "rare" | "epic" | "legendary" | "mythic" | "ultimate";

export const TIERS: Record<Tier, { name: string; fill: string; ink: string; onDark: string; plate: string }> = {
  common: { name: "Common", fill: "var(--bc-stone)", ink: "var(--bc-ink)", onDark: "var(--bc-stone)", plate: "#eef1f5" },
  rare: { name: "Rare", fill: "var(--bc-sky)", ink: "var(--bc-ink)", onDark: "var(--bc-sky)", plate: "#ddf1fc" },
  epic: { name: "Epic", fill: "var(--bc-grape)", ink: "var(--bc-white)", onDark: "var(--bc-grape-light)", plate: "#ebe1fb" },
  legendary: { name: "Legendary", fill: "var(--bc-yellow)", ink: "var(--bc-ink)", onDark: "var(--bc-yellow)", plate: "#fff3cb" },
  mythic: { name: "Mythic", fill: "var(--bc-coral)", ink: "var(--bc-white)", onDark: "var(--bc-coral-light)", plate: "#ffe1e2" },
  // Ultimate reads as prismatic, like the rainbow slice in the prestige screen.
  ultimate: { name: "Ultimate", fill: "var(--bc-white)", ink: "var(--bc-ink)", onDark: "var(--bc-white)", plate: "#f6f1ff" },
};

export const ULTIMATE_SHEEN =
  "linear-gradient(135deg, var(--bc-yellow) 0%, var(--bc-coral) 38%, var(--bc-grape) 68%, var(--bc-sky) 100%)";
