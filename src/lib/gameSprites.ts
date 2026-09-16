export type FoodType =
  | "cheese" | "sandwich" | "tomato" | "broccoli" | "kiwi" | "cake" | "croissant"
  | "potion" | "coin" | "multiplier" | "apple" | "banana" | "watermelon" | "strawberry"
  | "orange" | "pizza" | "hamburger" | "hotdog" | "lettuce" | "carrot"
  | "gummy" | "donut" | "icecream" | "chocolate";

export interface FoodItem {
  id: number;
  x: number;
  y: number;
  radius: number;
  type: FoodType;
  value: number;
  rotation: number;
  pulseOffset: number;
}

function dropShadow(ctx: CanvasRenderingContext2D, r: number) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.beginPath();
  ctx.ellipse(r * 0.08, r * 0.78, r * 0.72, r * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function sphere(ctx: CanvasRenderingContext2D, r: number, c0: string, c1: string, c2: string) {
  const g = ctx.createRadialGradient(-r * 0.32, -r * 0.35, r * 0.08, 0, 0, r);
  g.addColorStop(0, c0); g.addColorStop(0.55, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
}

function gloss(ctx: CanvasRenderingContext2D, r: number) {
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.beginPath();
  ctx.ellipse(r * -0.32, r * -0.38, r * 0.28, r * 0.16, -0.5, 0, Math.PI * 2);
  ctx.fill();
}

function sphereAt(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, c0: string, c1: string, c2: string) {
  ctx.save(); ctx.translate(x, y); sphere(ctx, r, c0, c1, c2); ctx.restore();
}

function drawApple(ctx: CanvasRenderingContext2D, r: number) { sphere(ctx, r, "#fca5a5", "#dc2626", "#7f1d1d"); gloss(ctx, r); }
function drawBanana(ctx: CanvasRenderingContext2D, r: number) {
  ctx.fillStyle = "#fde047";
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 1.1, r * 0.42, 0.6, 0, Math.PI * 2);
  ctx.fill(); gloss(ctx, r);
}
function drawWatermelon(ctx: CanvasRenderingContext2D, r: number) {
  sphere(ctx, r, "#86efac", "#16a34a", "#14532d");
  ctx.fillStyle = "#fb7185";
  ctx.beginPath(); ctx.arc(0, 0, r * 0.62, 0, Math.PI * 2); ctx.fill();
}
function drawStrawberry(ctx: CanvasRenderingContext2D, r: number) { sphere(ctx, r, "#fecaca", "#ef4444", "#9f1239"); }
function drawOrange(ctx: CanvasRenderingContext2D, r: number) { sphere(ctx, r, "#fdba74", "#f97316", "#9a3412"); gloss(ctx, r); }
function drawPizza(ctx: CanvasRenderingContext2D, r: number) {
  ctx.fillStyle = "#fde68a"; ctx.beginPath();
  ctx.moveTo(0, -r); ctx.lineTo(r * 0.95, r * 0.78); ctx.lineTo(-r * 0.95, r * 0.78); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.72); ctx.lineTo(r * 0.72, r * 0.58); ctx.lineTo(-r * 0.72, r * 0.58); ctx.closePath(); ctx.fill();
}
function drawHamburger(ctx: CanvasRenderingContext2D, r: number) {
  ctx.fillStyle = "#b45309"; ctx.beginPath(); ctx.ellipse(0, -r * 0.35, r * 0.85, r * 0.32, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#16a34a"; ctx.fillRect(-r * 0.8, -r * 0.12, r * 1.6, r * 0.16);
  ctx.fillStyle = "#78350f"; ctx.fillRect(-r * 0.78, 0.02 * r, r * 1.56, r * 0.22);
  ctx.fillStyle = "#d97706"; ctx.beginPath(); ctx.ellipse(0, r * 0.42, r * 0.85, r * 0.22, 0, 0, Math.PI * 2); ctx.fill();
}
function drawHotdog(ctx: CanvasRenderingContext2D, r: number) {
  ctx.fillStyle = "#d97706"; ctx.beginPath(); ctx.ellipse(0, 0.08 * r, r * 1.1, r * 0.42, 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#fb7185"; ctx.beginPath(); ctx.ellipse(0, -0.02 * r, r * 0.95, r * 0.22, 0.2, 0, Math.PI * 2); ctx.fill();
}
function drawLettuce(ctx: CanvasRenderingContext2D, r: number) {
  sphereAt(ctx, 0, 0, r * 0.7, "#bbf7d0", "#22c55e", "#166534");
  sphereAt(ctx, -r * 0.35, 0.1 * r, r * 0.5, "#bbf7d0", "#22c55e", "#166534");
  sphereAt(ctx, r * 0.35, 0.1 * r, r * 0.5, "#bbf7d0", "#22c55e", "#166534");
}
function drawCarrot(ctx: CanvasRenderingContext2D, r: number) {
  ctx.fillStyle = "#f97316"; ctx.beginPath();
  ctx.moveTo(0, r); ctx.lineTo(r * 0.38, -r * 0.45); ctx.lineTo(-r * 0.38, -r * 0.45); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#16a34a";
  ctx.beginPath(); ctx.moveTo(0, -r * 0.4); ctx.lineTo(-r * 0.22, -r * 0.95); ctx.lineTo(r * 0.22, -r * 0.95); ctx.closePath(); ctx.fill();
}
function drawCheese(ctx: CanvasRenderingContext2D, r: number) {
  ctx.fillStyle = "#f5c542"; ctx.beginPath();
  ctx.moveTo(-r * 0.95, r * 0.72); ctx.lineTo(r * 0.95, r * 0.72); ctx.lineTo(r * 0.15, -r * 0.95); ctx.closePath(); ctx.fill();
}
function drawSandwich(ctx: CanvasRenderingContext2D, r: number) { drawHamburger(ctx, r); }
function drawTomato(ctx: CanvasRenderingContext2D, r: number) { sphere(ctx, r, "#ff9a8b", "#e11d48", "#7f1d1d"); gloss(ctx, r); }
function drawBroccoli(ctx: CanvasRenderingContext2D, r: number) {
  [[0, -0.38, 0.52], [-0.38, -0.08, 0.4], [0.4, -0.1, 0.42], [0, -0.08, 0.32]].forEach(([x, y, s]) => {
    sphereAt(ctx, r * x, r * y, r * s, "#86efac", "#16a34a", "#14532d");
  });
}
function drawKiwi(ctx: CanvasRenderingContext2D, r: number) { sphere(ctx, r, "#a16207", "#854d0e", "#431407"); }
function drawCake(ctx: CanvasRenderingContext2D, r: number) {
  ctx.fillStyle = "#fda4af"; ctx.beginPath();
  ctx.moveTo(0, -r); ctx.lineTo(r * 0.95, r * 0.7); ctx.lineTo(-r * 0.95, r * 0.7); ctx.closePath(); ctx.fill();
}
function drawCroissant(ctx: CanvasRenderingContext2D, r: number) {
  ctx.fillStyle = "#f59e0b"; ctx.beginPath();
  ctx.ellipse(0, 0, r * 1.15, r * 0.62, -0.25, 0, Math.PI * 2); ctx.fill(); gloss(ctx, r);
}
function drawPotion(ctx: CanvasRenderingContext2D, r: number, timestamp: number) {
  ctx.shadowColor = "rgba(250,204,21,0.7)"; ctx.shadowBlur = 16;
  sphereAt(ctx, 0, r * 0.22, r * 0.78, "#fef08a", "#f59e0b", "#b45309");
  ctx.shadowBlur = 0;
}
function drawCoin(ctx: CanvasRenderingContext2D, r: number) {
  sphere(ctx, r * 0.82, "#fef9c3", "#facc15", "#ca8a04");
}
function drawMultiplier(ctx: CanvasRenderingContext2D, r: number) {
  sphere(ctx, r, "#86efac", "#22c55e", "#14532d"); gloss(ctx, r);
  ctx.fillStyle = "#ffffff"; ctx.font = `bold ${Math.round(r * 0.8)}px sans-serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("2x", 0, 1);
}
function drawGummy(ctx: CanvasRenderingContext2D, r: number) { sphere(ctx, r, "#fecaca", "#ef4444", "#7f1d1d"); gloss(ctx, r); }
function drawDonut(ctx: CanvasRenderingContext2D, r: number) { sphere(ctx, r, "#fde68a", "#b45309", "#78350f"); }
function drawIcecream(ctx: CanvasRenderingContext2D, r: number) { sphereAt(ctx, 0, -r * 0.28, r * 0.72, "#fecdd3", "#fb7185", "#be123c"); }
function drawChocolate(ctx: CanvasRenderingContext2D, r: number) { sphere(ctx, r, "#a16207", "#7c2d12", "#1c1917"); gloss(ctx, r); }

export function drawFoodItem(ctx: CanvasRenderingContext2D, food: FoodItem, timestamp: number) {
  const { x, y, radius: r, type, rotation } = food;
  const pulse = Math.sin(timestamp * 0.005 + food.pulseOffset) * 0.06 + 1;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rotation); ctx.scale(pulse, pulse); dropShadow(ctx, r);
  switch (type) {
    case "apple": drawApple(ctx, r); break;
    case "banana": drawBanana(ctx, r); break;
    case "watermelon": drawWatermelon(ctx, r); break;
    case "strawberry": drawStrawberry(ctx, r); break;
    case "orange": drawOrange(ctx, r); break;
    case "pizza": drawPizza(ctx, r); break;
    case "hamburger": drawHamburger(ctx, r); break;
    case "hotdog": drawHotdog(ctx, r); break;
    case "lettuce": drawLettuce(ctx, r); break;
    case "carrot": drawCarrot(ctx, r); break;
    case "cheese": drawCheese(ctx, r); break;
    case "sandwich": drawSandwich(ctx, r); break;
    case "tomato": drawTomato(ctx, r); break;
    case "broccoli": drawBroccoli(ctx, r); break;
    case "kiwi": drawKiwi(ctx, r); break;
    case "cake": drawCake(ctx, r); break;
    case "croissant": drawCroissant(ctx, r); break;
    case "potion": drawPotion(ctx, r, timestamp); break;
    case "coin": drawCoin(ctx, r); break;
    case "multiplier": drawMultiplier(ctx, r); break;
    case "gummy": drawGummy(ctx, r); break;
    case "donut": drawDonut(ctx, r); break;
    case "icecream": drawIcecream(ctx, r); break;
    case "chocolate": drawChocolate(ctx, r); break;
    default: drawCheese(ctx, r);
  }
  ctx.restore();
}
