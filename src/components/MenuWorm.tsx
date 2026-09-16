"use client";

import React, { useEffect, useRef } from "react";

export function MenuWorm() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let alive = true, anim = 0, cssW = 800, cssH = 450;
    const resize = () => {
      const parent = canvas.parentElement;
      cssW = Math.max(parent?.clientWidth || 800, 320);
      cssH = Math.max(parent?.clientHeight || 450, 240);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(cssW * dpr); canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = `${cssW}px`; canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize(); window.addEventListener("resize", resize);
    const SEGMENTS = 26, trail: Array<{ x: number; y: number }> = [];
    const loop = (ts: number) => {
      if (!alive) return;
      ctx.clearRect(0, 0, cssW, cssH);
      const t = ts * 0.00042, cx = cssW / 2, cy = cssH / 2;
      const rx = Math.min(cssW * 0.42, 420), ry = Math.min(cssH * 0.4, 210);
      const headX = cx + Math.cos(t) * rx + Math.sin(t * 3.1) * 18, headY = cy + Math.sin(t) * ry + Math.cos(t * 2.3) * 14;
      trail.unshift({ x: headX, y: headY });
      while (trail.length > SEGMENTS * 4) trail.pop();
      const body: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < SEGMENTS; i++) { const p = trail[Math.min(i * 4, trail.length - 1)]; if (p) body.push(p); }
      for (let i = body.length - 1; i >= 1; i--) {
        const s = body[i], taper = Math.max(0.38, 1 - i / (SEGMENTS * 1.1)), r = 15 * taper + 3;
        const g = ctx.createRadialGradient(s.x - r * 0.35, s.y - r * 0.4, r * 0.15, s.x, s.y, r);
        g.addColorStop(0, "#ffffff"); g.addColorStop(0.65, "#f1f5f9"); g.addColorStop(1, "#cbd5e1");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2); ctx.fill();
      }
      if (body.length >= 2) {
        const h = body[0], n = body[1], a = Math.atan2(h.y - n.y, h.x - n.x), hr = 19;
        ctx.save(); ctx.translate(h.x, h.y); ctx.rotate(a);
        const hg = ctx.createRadialGradient(-hr * 0.3, -hr * 0.35, hr * 0.15, 0, 0, hr);
        hg.addColorStop(0, "#ffffff"); hg.addColorStop(0.7, "#f8fafc"); hg.addColorStop(1, "#cbd5e1");
        ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(0, 0, hr, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#dc2626"; ctx.beginPath(); ctx.ellipse(hr * 0.62, 0, hr * 0.3, hr * 0.24, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(hr * 0.2, hr * 0.5, hr * 0.42, 0, Math.PI * 2); ctx.arc(hr * 0.2, -hr * 0.5, hr * 0.42, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#0f172a"; ctx.beginPath(); ctx.arc(hr * 0.36, hr * 0.5, hr * 0.2, 0, Math.PI * 2); ctx.arc(hr * 0.36, -hr * 0.5, hr * 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#dc2626"; ctx.beginPath(); ctx.arc(-hr * 0.2, 0, hr * 0.6, -Math.PI / 2, Math.PI / 2); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.ellipse(-hr * 0.05, 0, hr * 0.66, hr * 0.26, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
      anim = requestAnimationFrame(loop);
    };
    anim = requestAnimationFrame(loop);
    return () => { alive = false; cancelAnimationFrame(anim); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}
