/**
 * Species data read out of cmd_zoo's own catalog (`src/game/species.rs`), for
 * the entries whose sprites ship on this page.
 *
 * `rate` is base_rate_per_sec, `cap` is base_storage_cap, `cost` is
 * purchase_cost. `arche` is the level-scaling archetype the catalog assigns —
 * sprinter trades capacity for output, tank trades output for storage. Movesets
 * and their catch fill-speeds come from `src/game/wild_animal.rs`.
 */

export const A = "/projects/critter-cove";

export type Arche = "SPRINTER" | "BALANCED" | "TANK";

export type Species = {
  id: string;
  name: string;
  theme: string;
  rate: number;
  cap: number;
  cost: number;
  arche: Arche;
  exotic?: boolean;
  /** Rarest species pay out DNA Helix instead of coins. */
  helix?: boolean;
};

export const SPECIES: Record<string, Species> = {
  field_mouse: { id: "field_mouse", name: "Field Mouse", theme: "Forest", rate: 0.5, cap: 60, cost: 25, arche: "BALANCED" },
  hedgehog: { id: "hedgehog", name: "Hedgehog", theme: "Forest", rate: 0.6, cap: 90, cost: 45, arche: "BALANCED" },
  chicken: { id: "chicken", name: "Chicken", theme: "Farmland", rate: 0.7, cap: 80, cost: 35, arche: "BALANCED" },
  goat: { id: "goat", name: "Goat", theme: "Farmland", rate: 1.1, cap: 140, cost: 110, arche: "BALANCED" },
  badger: { id: "badger", name: "Badger", theme: "Forest", rate: 1.2, cap: 220, cost: 150, arche: "TANK" },
  beaver: { id: "beaver", name: "Beaver", theme: "Wetland", rate: 1.3, cap: 260, cost: 180, arche: "TANK" },
  heron: { id: "heron", name: "Heron", theme: "Wetland", rate: 1.4, cap: 150, cost: 160, arche: "SPRINTER" },
  arctic_fox: { id: "arctic_fox", name: "Arctic Fox", theme: "Arctic", rate: 1.4, cap: 240, cost: 220, arche: "SPRINTER" },
  red_fox: { id: "red_fox", name: "Red Fox", theme: "Forest", rate: 1.5, cap: 240, cost: 250, arche: "BALANCED" },
  scamp: { id: "scamp", name: "Scamp", theme: "Forest", rate: 1.6, cap: 360, cost: 360, arche: "SPRINTER" },
  donut_seal: { id: "donut_seal", name: "Donut Seal", theme: "Food", rate: 1.6, cap: 360, cost: 280, arche: "TANK" },
  boar: { id: "boar", name: "Wild Boar", theme: "Forest", rate: 1.8, cap: 360, cost: 300, arche: "TANK" },
  coyote: { id: "coyote", name: "Coyote", theme: "Badlands", rate: 1.8, cap: 320, cost: 300, arche: "SPRINTER" },
  blue_frog: { id: "blue_frog", name: "Blue Frog", theme: "Wetland", rate: 2.0, cap: 120, cost: 50, arche: "BALANCED" },
  caramel_stag: { id: "caramel_stag", name: "Caramel Stag", theme: "Food", rate: 2.0, cap: 400, cost: 420, arche: "BALANCED" },
  monkey: { id: "monkey", name: "Capuchin", theme: "Jungle", rate: 2.0, cap: 400, cost: 400, arche: "BALANCED" },
  grey_wolf: { id: "grey_wolf", name: "Grey Wolf", theme: "Forest", rate: 2.2, cap: 420, cost: 420, arche: "BALANCED" },
  bogtrot: { id: "bogtrot", name: "Bogtrot", theme: "Forest", rate: 2.2, cap: 440, cost: 460, arche: "BALANCED" },
  honey_badger: { id: "honey_badger", name: "Honey Badger", theme: "Food", rate: 2.2, cap: 420, cost: 460, arche: "SPRINTER" },
  giraffe: { id: "giraffe", name: "Giraffe", theme: "Savanna", rate: 2.4, cap: 780, cost: 640, arche: "TANK" },
  eclipse_hound: { id: "eclipse_hound", name: "Eclipse Hound", theme: "Void", rate: 2.6, cap: 520, cost: 640, arche: "SPRINTER" },
  brown_bear: { id: "brown_bear", name: "Brown Bear", theme: "Taiga", rate: 3.2, cap: 1000, cost: 900, arche: "TANK" },
  lion: { id: "lion", name: "Lion", theme: "Savanna", rate: 3.5, cap: 800, cost: 1000, arche: "BALANCED" },
  candy_dove: { id: "candy_dove", name: "Candy Dove", theme: "Farmland", rate: 4.0, cap: 9000, cost: 24000, arche: "SPRINTER", exotic: true },
  butter_horse: { id: "butter_horse", name: "Butter Horse", theme: "Farmland", rate: 5.0, cap: 70000, cost: 800, arche: "TANK" },
  galaxy_whale: { id: "galaxy_whale", name: "Galaxy Whale", theme: "Ocean", rate: 8.0, cap: 60000, cost: 150000, arche: "TANK", exotic: true, helix: true },
  clockwork_owl: { id: "clockwork_owl", name: "Clockwork Owl", theme: "Arctic", rate: 9.0, cap: 11000, cost: 52000, arche: "BALANCED", exotic: true },
  comettail: { id: "comettail", name: "Comettail", theme: "Ocean", rate: 9.4, cap: 63000, cost: 170000, arche: "TANK" },
  cogwhale: { id: "cogwhale", name: "Cogwhale", theme: "Ocean", rate: 15.5, cap: 41000, cost: 185000, arche: "TANK" },
  lava_lynx: { id: "lava_lynx", name: "Lava Lynx", theme: "Savanna", rate: 18.0, cap: 5000, cost: 90000, arche: "SPRINTER", exotic: true, helix: true },
};

/** Biome colours, matching the chips already on the page. */
export const THEME_COLOR: Record<string, string> = {
  Forest: "#7cc043",
  Arctic: "#bfe3f5",
  Savanna: "#e5c15b",
  Jungle: "#3f9a4d",
  Ocean: "#6cc2e8",
  Beach: "#f6e2a8",
  Taiga: "#5f8f6b",
  Tundra: "#c9d6dc",
  Highlands: "#9fb5a3",
  Wetland: "#7fa86e",
  Badlands: "#d2905b",
  Volcanic: "#e0644a",
  Farmland: "#b9d36b",
  Festive: "#f28cae",
  Food: "#f7b267",
  Mythical: "#b79ce8",
  Void: "#4a4670",
  Desert: "#f0c88a",
};

/**
 * Movesets and how fast each fills the capture ring, in progress per second.
 * Slower movers fill slower so no moveset is a free win.
 */
export const MOVESETS: { name: string; fill: number; note: string }[] = [
  { name: "Freezer", fill: 0.18, note: "Stands still. A patience test, not a free win." },
  { name: "Aggressor", fill: 0.24, note: "Comes at you instead of away." },
  { name: "Vanisher", fill: 0.28, note: "Teleports out of the ring every few seconds." },
  { name: "Basher", fill: 0.3, note: "Charges. A connecting bash resets the ring." },
  { name: "Thrower", fill: 0.3, note: "Drops timed danger zones to move you off." },
  { name: "Venomous", fill: 0.3, note: "Stalks, then lunges at close range." },
  { name: "Burster", fill: 0.33, note: "Sudden dashes between long pauses." },
  { name: "Circler", fill: 0.36, note: "Orbits you at a fixed radius." },
  { name: "Zigzagger", fill: 0.42, note: "Sharp random turns, subtly telegraphed." },
];

/** Catch ring distance falloff, from `catching.rs`. */
export const CATCH = { nearDist: 260, farDist: 1400, minMult: 0.12 };

export function distanceMultiplier(dist: number) {
  if (dist <= CATCH.nearDist) return 1;
  if (dist >= CATCH.farDist) return CATCH.minMult;
  const t = (dist - CATCH.nearDist) / (CATCH.farDist - CATCH.nearDist);
  return 1 - t * (1 - CATCH.minMult);
}
