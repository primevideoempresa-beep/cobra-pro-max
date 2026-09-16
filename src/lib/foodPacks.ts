import { FoodType } from "./gameSprites";

export interface FoodPack {
  id: string;
  name: string;
  emoji: string;
  category: "fruta" | "salgado" | "verdura";
  premium: boolean;
  priceCoins: number;
  priceBRL: string;
  types: FoodType[];
}

export const FOOD_PACKS: FoodPack[] = [
  { id: "apple", name: "Maçã", emoji: "🍎", category: "fruta", premium: false, priceCoins: 0, priceBRL: "0,00", types: ["apple"] },
  { id: "banana", name: "Banana", emoji: "🍌", category: "fruta", premium: true, priceCoins: 180, priceBRL: "6,99", types: ["banana"] },
  { id: "watermelon", name: "Melancia", emoji: "🍉", category: "fruta", premium: false, priceCoins: 0, priceBRL: "0,00", types: ["watermelon"] },
  { id: "strawberry", name: "Morango", emoji: "🍓", category: "fruta", premium: true, priceCoins: 180, priceBRL: "6,99", types: ["strawberry"] },
  { id: "orange", name: "Laranja", emoji: "🍊", category: "fruta", premium: false, priceCoins: 0, priceBRL: "0,00", types: ["orange"] },
  { id: "pizza", name: "Pizza", emoji: "🍕", category: "salgado", premium: true, priceCoins: 180, priceBRL: "6,99", types: ["pizza"] },
  { id: "hamburger", name: "Hambúrguer", emoji: "🍔", category: "salgado", premium: false, priceCoins: 0, priceBRL: "0,00", types: ["hamburger"] },
  { id: "hotdog", name: "Cachorro-quente", emoji: "🌭", category: "salgado", premium: true, priceCoins: 180, priceBRL: "6,99", types: ["hotdog"] },
  { id: "lettuce", name: "Alface", emoji: "🥬", category: "verdura", premium: false, priceCoins: 0, priceBRL: "0,00", types: ["lettuce"] },
  { id: "carrot", name: "Cenoura", emoji: "🥕", category: "verdura", premium: false, priceCoins: 0, priceBRL: "0,00", types: ["carrot"] },
  { id: "broccoli", name: "Brócolis", emoji: "🥦", category: "verdura", premium: true, priceCoins: 180, priceBRL: "6,99", types: ["broccoli"] },
];

export function getFoodPack(id?: string | null): FoodPack {
  return FOOD_PACKS.find((p) => p.id === id) || FOOD_PACKS[0];
}
