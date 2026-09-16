"use client";

import React, { useEffect, useRef } from "react";
import { drawFoodItem, FoodItem } from "@/lib/gameSprites";
import { drawArenaBackground, getBackground } from "@/lib/backgrounds";
import { getFoodPack } from "@/lib/foodPacks";
import { randomFoodType } from "@/lib/gameEngine";
import { getWormEmoji } from "@/lib/emojis";

export type ControlScheme = "buttons" | "pointer" | "joystick" | "drag";

export function ControlPreviewArena({
  scheme,
  liveGameplay = false,
  backgroundId = "ocean",
  foodPackId = "apple",
  emojiId = "wink",
}: {
  scheme: ControlScheme;
  liveGameplay?: boolean;
  backgroundId?: string;
  foodPackId?: string;
  emojiId?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, down: false });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let alive = true, anim = 0, nextId = 1, cssW = 640, cssH = 360;
    const foods: FoodItem[] = [];
    const segments: Array<{ x: number; y: number }> = [];
    let angle = 0.35;

    const spawnFood = (count: number) => {
      const w = Math.max(cssW, 200), h = Math.max(cssH, 160);
      for (let i = 0; i < count; i++) foods.push({
        id: nextId++, x: 50 + Math.random() * Math.max(40, w - 100), y: 45 + Math.random() * Math.max(40, h - 90),
        radius: 22 + Math.random() * 10, type: liveGameplay ? randomFoodType(foodPackId) : getFoodPack(foodPackId).types[0],
        value: 10, rotation: Math.random() * Math.PI * 2, pulseOffset: Math.random() * 8,
      });
    };

    const resize = () => {
      const parent = canvas.parentElement;
      cssW = Math.max(parent?.clientWidth || 640, 240); cssH = Math.max(parent?.clientHeight || 360, 180);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(cssW * dpr); canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = `${cssW}px`; canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    spawnFood(16);
    const startX = cssW * 0.3, startY = cssH * 0.5;
    for (let i = 0; i < 16; i++) segments.push({ x: startX - i * 9, y: startY });

    const loop = (ts: number) => {
      if (!alive) return;
      ctx.clearRect(0, 0, cssW, cssH);
      drawArenaBackground(ctx, getBackground(backgroundId), cssW, cssH);
      const head = segments[0], w = cssW, h = cssH;
      let targetAngle = angle;
      if (!liveGameplay && (scheme === "pointer" || (scheme === "drag" && pointerRef.current.down))) targetAngle = Math.atan2(pointerRef.current.y - head.y, pointerRef.current.x - head.x);
      else if (foods.length > 0) { let nearest = foods[0], best = Infinity; for (const f of foods) { const d = Math.hypot(f.x - head.x, f.y - head.y); if (d < best) { best = d; nearest = f; } } targetAngle = Math.atan2(nearest.y - head.y, nearest.x - head.x); }
      let diff = targetAngle - angle; while (diff < -Math.PI) diff += Math.PI * 2; while (diff > Math.PI) diff -= Math.PI * 2;
      angle += Math.max(-0.09, Math.min(0.09, diff));
      const speed = 2;
      const nx = head.x + Math.cos(angle) * speed, ny = head.y + Math.sin(angle) * speed;
      segments.unshift({ x: Math.max(24, Math.min(w - 24, nx)), y: Math.max(24, Math.min(h - 24, ny)) });
      while (segments.length > 18) segments.pop();
      for (let i = foods.length - 1; i >= 0; i--) { const f = foods[i]; if (Math.hypot(f.x - segments[0].x, f.y - segments[0].y) < f.radius + 10) { foods.splice(i, 1); spawnFood(1); } }
      if (foods.length < 12) spawnFood(12 - foods.length);
      for (const f of foods) { ctx.save(); drawFoodItem(ctx, f, ts); ctx.restore(); }
      for (let i = segments.length - 1; i >= 1; i--) { const s = segments[i], t = Math.max(0.5, 1 - i / 22); ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(s.x, s.y, 10 * t + 5, 0, Math.PI * 2); ctx.fill(); }
      const hx = segments[0].x, hy = segments[0].y;
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(angle); ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#dc2626"; ctx.beginPath(); ctx.ellipse(-8, 0, 7, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#1e293b"; ctx.beginPath(); ctx.arc(6, 7, 5.5, 0, Math.PI * 2); ctx.arc(6, -7, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#0f172a"; ctx.beginPath(); ctx.arc(8, 7, 2.6, 0, Math.PI * 2); ctx.arc(8, -7, 2.6, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      const emo = getWormEmoji(emojiId);
      if (emo.id !== "none") {
        const bx = hx, by = hy - 42;
        ctx.fillStyle = "#ffffff"; ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(bx - 22, by - 22, 44, 36, 10); else ctx.rect(bx - 22, by - 22, 44, 36);
        ctx.fill(); ctx.font = "22px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(emo.glyph, bx, by - 2);
      }
      anim = requestAnimationFrame(loop);
    };
    anim = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);
    return () => { alive = false; cancelAnimationFrame(anim); window.removeEventListener("resize", resize); };
  }, [scheme, liveGameplay, backgroundId, foodPackId, emojiId]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); pointerRef.current.x = e.clientX - r.left; pointerRef.current.y = e.clientY - r.top; }}
      onPointerDown={(e) => { const r = e.currentTarget.getBoundingClientRect(); pointerRef.current = { x: e.clientX - r.left, y: e.clientY - r.top, down: true }; }}
      onPointerUp={() => { pointerRef.current.down = false; }}
    />
  );
}
