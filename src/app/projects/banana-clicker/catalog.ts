/**
 * The slice of the game's gear and upgrade art used by the concept panels.
 *
 * Sprites are the real ones, pulled out of the Unity project: gear from the
 * Set 1 icon sheet (cut on the rects in its .meta), upgrades from the Purchase
 * Icons folder. Names and tiers here are mine — the sheet ships them numbered.
 */

import type { Tier } from "./tiers";

export const A = "/projects/banana-clicker";

export type Socket = "top" | "accessory" | "bottom";

export const SOCKETS: { id: Socket; name: string }[] = [
  { id: "top", name: "Top" },
  { id: "accessory", name: "Accessory" },
  { id: "bottom", name: "Bottom" },
];

export type Item = { slug: string; name: string; tier: Tier; socket: Socket };

export const ITEMS: Item[] = [
  { slug: "astro-helm", name: "Astro Helm", tier: "ultimate", socket: "top" },
  { slug: "warchief-mask", name: "Warchief Mask", tier: "legendary", socket: "top" },
  { slug: "jack-o-peel", name: "Jack o' Peel", tier: "epic", socket: "top" },
  { slug: "kite-pauldron", name: "Kite Pauldron", tier: "epic", socket: "top" },
  { slug: "fume-filter", name: "Fume Filter", tier: "rare", socket: "top" },
  { slug: "reef-rig", name: "Reef Rig", tier: "rare", socket: "top" },
  { slug: "autumn-visor", name: "Autumn Visor", tier: "common", socket: "top" },

  { slug: "molt-wings", name: "Molt Wings", tier: "mythic", socket: "accessory" },
  { slug: "bloomjelly", name: "Bloomjelly", tier: "mythic", socket: "accessory" },
  { slug: "void-blot", name: "Void Blot", tier: "mythic", socket: "accessory" },
  { slug: "halo", name: "Second Thoughts", tier: "legendary", socket: "accessory" },
  { slug: "tide-trident", name: "Tide Trident", tier: "legendary", socket: "accessory" },
  { slug: "crimson-drape", name: "Crimson Drape", tier: "epic", socket: "accessory" },
  { slug: "rubber-nana", name: "Rubber Nana", tier: "epic", socket: "accessory" },
  { slug: "teal-returner", name: "Teal Returner", tier: "rare", socket: "accessory" },
  { slug: "frost-shards", name: "Frost Shards", tier: "rare", socket: "accessory" },
  { slug: "plain-banana", name: "Plain Banana", tier: "common", socket: "accessory" },

  { slug: "reef-skirt", name: "Reef Skirt", tier: "epic", socket: "bottom" },
  { slug: "rivet-gauntlet", name: "Rivet Gauntlet", tier: "rare", socket: "bottom" },
  { slug: "lucky-sock", name: "Lucky Sock", tier: "common", socket: "bottom" },
];

export const ITEM: Record<string, Item> = Object.fromEntries(ITEMS.map((i) => [i.slug, i]));

/**
 * Chad ships his own ability art in Characters/Chad, which beats the generic
 * Purchase Icons on his sheet — Surfboard Smash is a real ability with a real
 * icon. Generic actives and idles stay for the boards that aren't his.
 */
export const CHAD_ABILITIES = {
  surfboardSmash: `${A}/abilities/chad-surfboard-smash.webp`,
  crabAssistance: `${A}/abilities/chad-crab-assistance.webp`,
  beachscanners: `${A}/abilities/chad-beachscanners.webp`,
  bananaMills: `${A}/abilities/chad-banana-mills.webp`,
  shellTrading: `${A}/abilities/chad-shell-trading.webp`,
} as const;

export const ACTIVE_ICONS = {
  bananaUp: `${A}/upgrades/act-banana-up.webp`,
  picnicBasket: `${A}/upgrades/act-picnic-basket.webp`,
  tongs: `${A}/upgrades/act-tongs.webp`,
  bucket: `${A}/upgrades/act-bucket.webp`,
  rake: `${A}/upgrades/act-rake.webp`,
  briefcase: `${A}/upgrades/act-briefcase.webp`,
  bananaBunch: `${A}/upgrades/act-banana-bunch.webp`,
} as const;

export const IDLE_ICONS = {
  bananaTree: `${A}/upgrades/idle-banana-tree.webp`,
  monkey: `${A}/upgrades/idle-monkey.webp`,
  strawHat: `${A}/upgrades/idle-straw-hat.webp`,
  bank: `${A}/upgrades/idle-bank.webp`,
  pirate: `${A}/upgrades/idle-pirate.webp`,
  merchant: `${A}/upgrades/idle-merchant.webp`,
} as const;

export const CURRENCY = `${A}/upgrades/currency-banana.webp`;
