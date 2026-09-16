export type BackgroundPattern =
  | "dots" | "solid" | "tiles" | "circles" | "weave" | "stars" | "sparkles"
  | "hex" | "waves" | "bricks" | "diamonds" | "grid";

export interface ArenaBackground {
  id: string;
  name: string;
  premium: boolean;
  priceCoins: number;
  color: string;
  color2: string;
  speckle: string;
  pattern: BackgroundPattern;
}

export const ARENA_BACKGROUNDS: ArenaBackground[] = [
  { id: "ocean", name: "Oceano", premium: false, priceCoins: 0, color: "#2a6db5", color2: "#1e5aa0", speckle: "rgba(8,28,64,0.22)", pattern: "dots" },
  { id: "midnight", name: "Meia-noite", premium: false, priceCoins: 0, color: "#121212", color2: "#1c1c1c", speckle: "rgba(80,80,80,0.35)", pattern: "dots" },
  { id: "grape", name: "Uva", premium: false, priceCoins: 0, color: "#5b3a7a", color2: "#42285c", speckle: "rgba(20,8,32,0.28)", pattern: "circles" },
  { id: "meadow", name: "Pradaria", premium: false, priceCoins: 0, color: "#6a8f4e", color2: "#557a3c", speckle: "rgba(20,40,10,0.2)", pattern: "tiles" },
  { id: "sand", name: "Areia", premium: false, priceCoins: 0, color: "#cbb6a8", color2: "#b89f90", speckle: "rgba(90,60,50,0.18)", pattern: "dots" },
  { id: "clay", name: "Argila", premium: false, priceCoins: 0, color: "#8d6b5b", color2: "#745547", speckle: "rgba(40,20,10,0.22)", pattern: "bricks" },
  { id: "lilac", name: "Lilás", premium: false, priceCoins: 0, color: "#7a6ea8", color2: "#655992", speckle: "rgba(30,20,60,0.2)", pattern: "weave" },
  { id: "navy", name: "Marinho", premium: false, priceCoins: 0, color: "#243a66", color2: "#1b2d52", speckle: "rgba(8,16,40,0.25)", pattern: "dots" },
  { id: "lava", name: "Lava Dourada", premium: true, priceCoins: 220, color: "#b42318", color2: "#7a120c", speckle: "rgba(255,180,40,0.28)", pattern: "sparkles" },
  { id: "aurora", name: "Aurora", premium: true, priceCoins: 280, color: "#0f766e", color2: "#6d28d9", speckle: "rgba(165,243,252,0.3)", pattern: "stars" },
  { id: "amethyst", name: "Ametista Real", premium: true, priceCoins: 350, color: "#4c1d95", color2: "#2e1065", speckle: "rgba(250,204,21,0.32)", pattern: "diamonds" },
  { id: "emerald", name: "Esmeralda", premium: true, priceCoins: 260, color: "#047857", color2: "#064e3b", speckle: "rgba(167,243,208,0.28)", pattern: "hex" },
  { id: "coral", name: "Coral do Pôr do Sol", premium: true, priceCoins: 200, color: "#ea580c", color2: "#be185d", speckle: "rgba(254,215,170,0.28)", pattern: "waves" },
  { id: "ice", name: "Cristal de Gelo", premium: true, priceCoins: 240, color: "#155e75", color2: "#083344", speckle: "rgba(186,230,253,0.35)", pattern: "diamonds" },
  { id: "candy", name: "Doce Neon", premium: true, priceCoins: 180, color: "#db2777", color2: "#9d174d", speckle: "rgba(252,165,165,0.3)", pattern: "circles" },
  { id: "galaxy", name: "Galáxia", premium: true, priceCoins: 420, color: "#020617", color2: "#1e1b4b", speckle: "rgba(196,181,253,0.4)", pattern: "stars" },
];

export function getBackground(id?: string | null): ArenaBackground {
  return ARENA_BACKGROUNDS.find((b) => b.id === id) || ARENA_BACKGROUNDS[0];
}

export function drawArenaBackground(
  ctx: CanvasRenderingContext2D,
  theme: ArenaBackground,
  w: number,
  h: number
) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, theme.color);
  grad.addColorStop(1, theme.color2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = theme.speckle;
  switch (theme.pattern) {
    case "dots":
      for (let y = 8; y < h; y += 18) for (let x = 8; x < w; x += 18) { ctx.beginPath(); ctx.arc(x, y, 1.15, 0, Math.PI * 2); ctx.fill(); }
      break;
    case "circles":
      for (let y = 16; y < h; y += 36) for (let x = 16; x < w; x += 36) { ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill(); }
      break;
    case "tiles":
      for (let y = 0; y < h; y += 28) for (let x = 0; x < w; x += 28) { if (((x + y) / 28) % 2 < 1) ctx.fillRect(x, y, 26, 26); }
      break;
    case "bricks":
      for (let row = 0, y = 0; y < h; y += 22, row++) { const offset = row % 2 === 0 ? 0 : 18; for (let x = -18 + offset; x < w; x += 36) ctx.fillRect(x, y, 32, 18); }
      break;
    case "weave":
      ctx.lineWidth = 2; ctx.strokeStyle = theme.speckle; ctx.beginPath();
      for (let i = -h; i < w + h; i += 16) { ctx.moveTo(i, 0); ctx.lineTo(i + h, h); ctx.moveTo(i, 0); ctx.lineTo(i - h, h); }
      ctx.stroke();
      break;
    case "stars":
      for (let i = 0; i < Math.floor((w * h) / 2800); i++) { const x = ((i * 97) % w) + 4, y = ((i * 53) % h) + 4; ctx.beginPath(); ctx.arc(x, y, i % 5 === 0 ? 1.8 : 1, 0, Math.PI * 2); ctx.fill(); }
      break;
    case "sparkles":
      for (let i = 0; i < Math.floor((w * h) / 2200); i++) { const x = ((i * 73) % w) + 6, y = ((i * 41) % h) + 6; ctx.fillRect(x, y, 2, 6); ctx.fillRect(x - 2, y + 2, 6, 2); }
      break;
    case "hex":
      for (let y = 0; y < h + 20; y += 24) for (let x = 0; x < w + 20; x += 28) { const ox = (Math.floor(y / 24) % 2) * 14; ctx.beginPath(); ctx.arc(x + ox, y, 8, 0, Math.PI * 2); ctx.fill(); }
      break;
    case "waves":
      ctx.strokeStyle = theme.speckle; ctx.lineWidth = 2;
      for (let y = 12; y < h; y += 22) { ctx.beginPath(); for (let x = 0; x <= w; x += 8) { const yy = y + Math.sin(x * 0.05) * 6; if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy); } ctx.stroke(); }
      break;
    case "diamonds":
      for (let y = 0; y < h; y += 26) for (let x = 0; x < w; x += 26) { ctx.beginPath(); ctx.moveTo(x + 13, y); ctx.lineTo(x + 26, y + 13); ctx.lineTo(x + 13, y + 26); ctx.lineTo(x, y + 13); ctx.closePath(); ctx.fill(); }
      break;
    case "grid":
      ctx.strokeStyle = theme.speckle; ctx.lineWidth = 1.5; ctx.beginPath();
      for (let x = 0; x <= w; x += 32) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
      for (let y = 0; y <= h; y += 32) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      ctx.stroke();
      break;
    default: break;
  }
}
