export interface WormEmoji {
  id: string;
  name: string;
  glyph: string;
  premium: boolean;
  priceBRL: string;
}

export const WORM_EMOJIS: WormEmoji[] = [
  { id: "wink", name: "Piscadinha", glyph: "😉", premium: false, priceBRL: "0,00" },
  { id: "none", name: "Nenhum", glyph: "✖", premium: false, priceBRL: "0,00" },
  { id: "smile", name: "Sorriso", glyph: "😊", premium: false, priceBRL: "0,00" },
  { id: "party", name: "Festa", glyph: "🥳", premium: true, priceBRL: "6,99" },
  { id: "cool", name: "Estiloso", glyph: "😎", premium: true, priceBRL: "6,99" },
  { id: "heart", name: "Apaixonado", glyph: "😍", premium: false, priceBRL: "0,00" },
  { id: "laugh", name: "Risada", glyph: "😂", premium: true, priceBRL: "6,99" },
  { id: "fire", name: "Fogo", glyph: "🔥", premium: true, priceBRL: "6,99" },
  { id: "crown", name: "Coroa", glyph: "👑", premium: true, priceBRL: "6,99" },
  { id: "star", name: "Estrela", glyph: "🤩", premium: true, priceBRL: "6,99" },
  { id: "robot", name: "Robô", glyph: "🤖", premium: true, priceBRL: "6,99" },
  { id: "angry", name: "Bravo", glyph: "😡", premium: true, priceBRL: "6,99" },
];

export function getWormEmoji(id?: string | null): WormEmoji {
  return WORM_EMOJIS.find((e) => e.id === id) || WORM_EMOJIS[0];
}
