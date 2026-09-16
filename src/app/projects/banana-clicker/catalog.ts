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

/** Chad's board: actives from Purchase Icons/Actives, passives from /Idle. */
export const ACTIVE_ICONS = {
  bananaUp: "act-banana-up",
  picnicBasket: "act-picnic-basket",
  tongs: "act-tongs",
  bucket: "act-bucket",
  rake: "act-rake",
  briefcase: "act-briefcase",
  bananaBunch: "act-banana-bunch",
} as const;

export const IDLE_ICONS = {
  bananaTree: "idle-banana-tree",
  monkey: "idle-monkey",
  strawHat: "idle-straw-hat",
  bank: "idle-bank",
  pirate: "idle-pirate",
  merchant: "idle-merchant",
} as const;
