import { SkinConfig } from "./gameEngine";

export type PriceKind = "free" | "coins" | "brl" | "ads";

export interface WormSkin {
  id: string; name: string; rarity: string; face: string;
  cardFrom: string; cardTo: string;
  headColor: string; bodyColor: string; secondaryColor: string;
  bodyPattern: "solid" | "striped" | "spotted" | "neon" | "gradient";
  hatType: "none" | "cap_red" | "crown" | "cowboy" | "halo" | "party";
  speedBonus: number;
  priceKind: PriceKind;
  priceCoins?: number; priceBRL?: string;
}

export const WORM_SKINS: WormSkin[] = [
  { id: "classic_white", name: "Classic", rarity: "Comum", face: "🙂", cardFrom: "#60a5fa", cardTo: "#1d4ed8", headColor: "#ffffff", bodyColor: "#f1f5f9", secondaryColor: "#e2e8f0", bodyPattern: "solid", hatType: "cap_red", speedBonus: 1, priceKind: "free" },
  { id: "fire_dragon", name: "Dragão Escarlate", rarity: "Lendário", face: "🐲", cardFrom: "#f59e0b", cardTo: "#b45309", headColor: "#ef4444", bodyColor: "#ea580c", secondaryColor: "#facc15", bodyPattern: "striped", hatType: "crown", speedBonus: 1.08, priceKind: "coins", priceCoins: 500 },
  { id: "golden_emperor", name: "Imperador Dourado", rarity: "Lendário", face: "👑", cardFrom: "#f59e0b", cardTo: "#b45309", headColor: "#f59e0b", bodyColor: "#fbbf24", secondaryColor: "#fef08a", bodyPattern: "gradient", hatType: "crown", speedBonus: 1.1, priceKind: "coins", priceCoins: 1000 },
  { id: "toxic_viper", name: "Víbora Tóxica", rarity: "Épico", face: "😎", cardFrom: "#22c55e", cardTo: "#15803d", headColor: "#22c55e", bodyColor: "#15803d", secondaryColor: "#a855f7", bodyPattern: "spotted", hatType: "none", speedBonus: 1.04, priceKind: "coins", priceCoins: 350 },
  { id: "candy_swirl", name: "Doce Turbilhão", rarity: "Comum", face: "🍓", cardFrom: "#f472b6", cardTo: "#fb7185", headColor: "#f472b6", bodyColor: "#fb7185", secondaryColor: "#38bdf8", bodyPattern: "striped", hatType: "party", speedBonus: 1.02, priceKind: "coins", priceCoins: 150 },
];

export function getWormSkin(id?: string | null): WormSkin { return WORM_SKINS.find((s) => s.id === id) || WORM_SKINS[0]; }
export function toSkinConfig(skin: WormSkin): SkinConfig {
  return { id: skin.id, name: skin.name, headColor: skin.headColor, bodyColor: skin.bodyColor, secondaryColor: skin.secondaryColor, bodyPattern: skin.bodyPattern, eyeType: "cartoon_googly", hatType: skin.hatType, speedBonus: skin.speedBonus };
}
export function isFreeSkin(skin: WormSkin) { return skin.priceKind === "free"; }
