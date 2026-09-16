import { FoodItem, FoodType } from "./gameSprites";
import { getFoodPack } from "./foodPacks";

export interface SkinConfig {
  id: string;
  name: string;
  headColor: string;
  bodyColor: string;
  secondaryColor: string;
  bodyPattern: string;
  eyeType: string;
  hatType: string;
  speedBonus: number;
}

export interface SnakeSegment { x: number; y: number; }
export interface Snake {
  id: string;
  name: string;
  isPlayer: boolean;
  segments: SnakeSegment[];
  angle: number;
  targetAngle: number;
  speed: number;
  baseSpeed: number;
  isBoosting: boolean;
  score: number;
  length: number;
  radius: number;
  skin: SkinConfig;
  isAlive: boolean;
  kills: number;
  targetFoodId?: number;
  turnTimer?: number;
}

export interface GameState {
  arenaWidth: number;
  arenaHeight: number;
  player: Snake;
  bots: Snake[];
  foods: FoodItem[];
  coinsCollected: number;
  foodEatenCount: number;
  survivalSeconds: number;
  isGameOver: boolean;
  isPaused: boolean;
  activeMagnetSeconds: number;
  activeMultiplierSeconds: number;
  activeZoomSeconds: number;
}

export const FOOD_TYPES: FoodType[] = [
  "apple", "banana", "watermelon", "strawberry", "orange",
  "pizza", "hamburger", "hotdog",
  "lettuce", "carrot", "broccoli",
  "cheese", "sandwich", "tomato", "kiwi", "cake", "croissant",
  "potion", "coin", "multiplier",
];

export function randomFoodType(foodPackId?: string): FoodType {
  const favorite = getFoodPack(foodPackId).types;
  if (favorite.length > 0 && Math.random() < 0.25) return favorite[Math.floor(Math.random() * favorite.length)];
  return FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)];
}

export function createInitialFoods(count: number, arenaW: number, arenaH: number, foodPackId?: string): FoodItem[] {
  const foods: FoodItem[] = [];
  let nextId = 1;
  for (let i = 0; i < count; i++) {
    const isCoin = Math.random() < 0.08;
    const isPotion = Math.random() < 0.04;
    const isMultiplier = Math.random() < 0.03;
    let type: FoodType = randomFoodType(foodPackId);
    if (isCoin) type = "coin"; else if (isPotion) type = "potion"; else if (isMultiplier) type = "multiplier";
    foods.push({
      id: nextId++,
      x: Math.random() * (arenaW - 200) + 100,
      y: Math.random() * (arenaH - 200) + 100,
      radius: type === "coin" ? 14 : type === "potion" || type === "multiplier" ? 18 : 16 + Math.random() * 8,
      type,
      value: type === "coin" ? 10 : type === "potion" ? 50 : type === "multiplier" ? 40 : 15,
      rotation: Math.random() * Math.PI * 2,
      pulseOffset: Math.random() * 10,
    });
  }
  return foods;
}

export const BOT_NAMES = [
  "Người chơi_95098672", "AlphaViper_99", "Player_1569632917", "Jacob Anderson",
  "Oliver Davies", "Pemain_0778191593", "Raztozo", "Ako 89M",
  "ShadowStriker", "MegaAnaconda", "NeonPhantom", "TigreDourado",
  "CobrinhaPro", "Minhoca_BR", "Lucas_Gamer", "Ana Queen", "VenomKing",
];

const BOT_SKINS: SkinConfig[] = [{
  id: "classic_white", name: "Minhoca Clássica", headColor: "#ffffff", bodyColor: "#f3f4f6",
  secondaryColor: "#e5e7eb", bodyPattern: "solid", eyeType: "cartoon_googly", hatType: "cap_red", speedBonus: 1.0,
}];

export function createBotSnake(id: string, name: string, arenaW: number, arenaH: number): Snake {
  const skin = BOT_SKINS[0];
  const startX = Math.random() * (arenaW - 400) + 200;
  const startY = Math.random() * (arenaH - 400) + 200;
  const angle = Math.random() * Math.PI * 2;
  const initialLength = 25;
  const segments: SnakeSegment[] = [];
  for (let i = 0; i < initialLength; i++) segments.push({ x: startX - Math.cos(angle) * (i * 8), y: startY - Math.sin(angle) * (i * 8) });
  return {
    id, name, isPlayer: false, segments, angle, targetAngle: angle,
    speed: 3.2 * skin.speedBonus, baseSpeed: 3.2 * skin.speedBonus, isBoosting: false,
    score: initialLength * 120, length: initialLength, radius: 18, skin, isAlive: true, kills: 0, turnTimer: 30,
  };
}

export function createPlayerSnake(name: string, skin: SkinConfig, arenaW: number, arenaH: number): Snake {
  const startX = arenaW / 2, startY = arenaH / 2, angle = -Math.PI / 2, initialLength = 25;
  const segments: SnakeSegment[] = [];
  for (let i = 0; i < initialLength; i++) segments.push({ x: startX, y: startY + i * 8 });
  return {
    id: "player_main", name: name || "MinhocaPro", isPlayer: true, segments, angle, targetAngle: angle,
    speed: 3.4 * (skin.speedBonus || 1.0), baseSpeed: 3.4 * (skin.speedBonus || 1.0), isBoosting: false,
    score: 16, length: initialLength, radius: 19, skin, isAlive: true, kills: 0,
  };
}

export function updateSnake(snake: Snake, arenaW: number, arenaH: number) {
  if (!snake.isAlive) return;
  let angleDiff = snake.targetAngle - snake.angle;
  while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
  while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
  const turnSpeed = 0.085;
  snake.angle += Math.max(-turnSpeed, Math.min(turnSpeed, angleDiff));
  let currentSpeed = snake.baseSpeed;
  if (snake.isBoosting && snake.score > 20) {
    currentSpeed = snake.baseSpeed * 1.85;
    if (Math.random() < 0.2 && snake.score > 30) snake.score = Math.max(16, snake.score - 1);
  }
  snake.speed = currentSpeed;
  const head = snake.segments[0];
  const newHeadX = head.x + Math.cos(snake.angle) * snake.speed;
  const newHeadY = head.y + Math.sin(snake.angle) * snake.speed;
  const clampedX = Math.max(snake.radius + 10, Math.min(arenaW - snake.radius - 10, newHeadX));
  const clampedY = Math.max(snake.radius + 10, Math.min(arenaH - snake.radius - 10, newHeadY));
  if (clampedX !== newHeadX || clampedY !== newHeadY) snake.targetAngle = Math.atan2(arenaH / 2 - head.y, arenaW / 2 - head.x);
  snake.segments.unshift({ x: clampedX, y: clampedY });
  const targetLength = Math.max(18, Math.floor(snake.length));
  while (snake.segments.length > targetLength) snake.segments.pop();
}

export function updateBotAI(bot: Snake, player: Snake, allBots: Snake[], foods: FoodItem[], arenaW: number, arenaH: number) {
  if (!bot.isAlive) return;
  const head = bot.segments[0];
  const margin = 200;
  if (head.x < margin || head.x > arenaW - margin || head.y < margin || head.y > arenaH - margin) {
    bot.targetAngle = Math.atan2(arenaH / 2 - head.y, arenaW / 2 - head.x);
    return;
  }
  if (bot.turnTimer! <= 0) {
    bot.turnTimer = Math.floor(Math.random() * 40) + 20;
    let closestFood: FoodItem | null = null; let minDist = 400;
    for (let i = 0; i < foods.length; i += 4) {
      const f = foods[i];
      if (Math.abs(f.x - head.x) > minDist || Math.abs(f.y - head.y) > minDist) continue;
      const d = Math.hypot(f.x - head.x, f.y - head.y);
      if (d < minDist) { minDist = d; closestFood = f; }
    }
    if (closestFood) bot.targetAngle = Math.atan2(closestFood.y - head.y, closestFood.x - head.x);
    else bot.targetAngle += (Math.random() - 0.5) * 1.2;
  } else bot.turnTimer!--;
}
