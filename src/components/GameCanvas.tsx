"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Snake,
  GameState,
  createInitialFoods,
  createBotSnake,
  createPlayerSnake,
  updateSnake,
  updateBotAI,
  BOT_NAMES,
  SkinConfig,
  randomFoodType,
} from "@/lib/gameEngine";
import { drawFoodItem } from "@/lib/gameSprites";
import { drawSnake } from "@/lib/snakeRenderer";
import { sounds } from "@/lib/sound";
import { drawArenaBackground, getBackground } from "@/lib/backgrounds";
import { getWormEmoji } from "@/lib/emojis";
import { Pause, Play, Home, Zap, Magnet, ZoomIn, Volume2, VolumeX } from "lucide-react";
import confetti from "canvas-confetti";

interface GameCanvasProps {
  playerUser: { id: string; username: string; coins: number; level: number; xp: number; apples: number };
  equippedSkin: SkinConfig;
  powerupCounts: { magnetCount: number; boostCount: number; zoomCount: number; multiplierCount: number };
  onReturnToMenu: () => void;
  onRefreshUserData: () => void;
  onMuteChange?: (muted: boolean) => void;
  arenaSettings?: { minimapPosition: "left" | "right"; minimapScale: "1" | "1.2" | "1.5"; showInterface: boolean; showOverlay: boolean };
  controlSettings?: { handedness: "left" | "right"; controlScheme: "buttons" | "pointer" | "joystick" | "drag" };
  arenaBackground?: string;
  foodPackId?: string;
  wormEmoji?: string;
  locale?: string;
  onReviveWithCoins?: () => Promise<{ ok: boolean; error?: string }>;
}

export function GameCanvas({ playerUser, equippedSkin, powerupCounts, onReturnToMenu, onRefreshUserData, arenaSettings, arenaBackground = "ocean", foodPackId = "apple", wormEmoji = "wink", onMuteChange, onReviveWithCoins }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const minimapCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const minimapPosition = arenaSettings?.minimapPosition ?? "right";
  const minimapScale = arenaSettings?.minimapScale ?? "1";
  const showInterface = arenaSettings?.showInterface ?? true;
  const showOverlay = arenaSettings?.showOverlay ?? true;
  const [magnets, setMagnets] = useState(powerupCounts.magnetCount);
  const [boosts, setBoosts] = useState(powerupCounts.boostCount);
  const [zooms, setZooms] = useState(powerupCounts.zoomCount);
  const [magnetTimer, setMagnetTimer] = useState(0);
  const [liveCoins, setLiveCoins] = useState(0);
  const [liveScore, setLiveScore] = useState(16);
  const [liveRank, setLiveRank] = useState(140);
  const [survivalSecs, setSurvivalSecs] = useState(0);
  const [leaderboardList, setLeaderboardList] = useState<Array<{ rank: number; name: string; score: number; isPlayer?: boolean }>>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverStats, setGameOverStats] = useState<any>(null);
  const [soundMuted, setSoundMuted] = useState(sounds.muted);
  const gameStateRef = useRef<GameState | null>(null);
  const pointerPosRef = useRef({ x: 0, y: 0 });
  const isPointerDownRef = useRef(false);
  const lastTimeRef = useRef(0);
  const secondTimerRef = useRef(0);
  const isPausedRef = useRef(false);
  const isGameOverRef = useRef(false);
  const ARENA_W = 5000, ARENA_H = 5000, BOT_COUNT = 30;

  const pauseGame = useCallback(() => { if (isGameOverRef.current) return; isPausedRef.current = true; setIsPaused(true); if (gameStateRef.current) gameStateRef.current.isPaused = true; }, []);
  const resumeGame = useCallback(() => { isPausedRef.current = false; setIsPaused(false); if (gameStateRef.current) gameStateRef.current.isPaused = false; }, []);

  const initGame = useCallback(() => {
    const player = createPlayerSnake(playerUser.username || "MinhocaPro", equippedSkin, ARENA_W, ARENA_H);
    const bots: Snake[] = [];
    for (let i = 0; i < BOT_COUNT; i++) bots.push(createBotSnake(`bot_${i}`, BOT_NAMES[i % BOT_NAMES.length], ARENA_W, ARENA_H));
    const foods = createInitialFoods(620, ARENA_W, ARENA_H, foodPackId);
    gameStateRef.current = { arenaWidth: ARENA_W, arenaHeight: ARENA_H, player, bots, foods, coinsCollected: 0, foodEatenCount: 0, survivalSeconds: 0, isGameOver: false, isPaused: false, activeMagnetSeconds: 0, activeMultiplierSeconds: 0, activeZoomSeconds: 0 };
    setLiveCoins(0); setLiveScore(16); setSurvivalSecs(0); setIsGameOver(false); setIsPaused(false); setGameOverStats(null); setMagnetTimer(0);
    isPausedRef.current = false; isGameOverRef.current = false; lastTimeRef.current = 0;
  }, [playerUser.username, equippedSkin, foodPackId]);

  useEffect(() => { initGame(); sounds.startMusic(); return () => sounds.stopMusic(); }, [initGame]);

  const handlePlayerDied = useCallback(async (stats: any) => {
    if (isGameOverRef.current) return; isGameOverRef.current = true; setIsGameOver(true); setGameOverStats(stats);
    sounds.playDeath(); if (stats.score > 500) confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    try { await fetch("/api/matches", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: playerUser.id, playerName: playerUser.username, score: stats.score, coinsEarned: stats.coins, foodEaten: stats.foodEaten, wormsDefeated: stats.wormsDefeated, survivalSeconds: stats.survivalSeconds, maxLength: Math.floor(stats.score / 15) + 20, rankAchieved: stats.rank }) }); onRefreshUserData(); } catch {}
  }, [playerUser.id, playerUser.username, onRefreshUserData]);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const resize = () => { canvas.width = canvas.parentElement?.clientWidth || window.innerWidth; canvas.height = canvas.parentElement?.clientHeight || window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    const loop = (ts: number) => {
      const state = gameStateRef.current; if (!state) { animId = requestAnimationFrame(loop); return; }
      if (isPausedRef.current || state.isPaused || state.isGameOver || isGameOverRef.current) { lastTimeRef.current = 0; animId = requestAnimationFrame(loop); return; }
      const rawDt = lastTimeRef.current ? (ts - lastTimeRef.current) / 1000 : 0.016; const dt = Math.min(rawDt, 0.05); lastTimeRef.current = ts;
      secondTimerRef.current += dt;
      if (secondTimerRef.current >= 1) { secondTimerRef.current = 0; state.survivalSeconds++; setSurvivalSecs(state.survivalSeconds); if (state.activeMagnetSeconds > 0) { state.activeMagnetSeconds--; setMagnetTimer(state.activeMagnetSeconds); } }
      const { player, bots, foods } = state;
      if (player.isAlive) {
        const head = player.segments[0]; const viewW = canvas.width, viewH = canvas.height;
        const worldTargetX = head.x + (pointerPosRef.current.x - viewW / 2); const worldTargetY = head.y + (pointerPosRef.current.y - viewH / 2);
        player.targetAngle = Math.atan2(worldTargetY - head.y, worldTargetX - head.x);
        player.isBoosting = isPointerDownRef.current;
        updateSnake(player, ARENA_W, ARENA_H);
      }
      for (const bot of bots) if (bot.isAlive) { updateBotAI(bot, player, bots, foods, ARENA_W, ARENA_H); updateSnake(bot, ARENA_W, ARENA_H); }
      const head = player.segments[0]; const isMagnet = state.activeMagnetSeconds > 0;
      for (let i = foods.length - 1; i >= 0; i--) {
        const f = foods[i]; if (player.isAlive) {
          const dist = Math.hypot(f.x - head.x, f.y - head.y);
          if (isMagnet && dist < 280) { f.x += (head.x - f.x) * 0.18; f.y += (head.y - f.y) * 0.18; }
          if (dist < player.radius + f.radius) { state.foodEatenCount++; player.score += f.value; player.length += f.value > 20 ? 1.2 : 0.4; if (f.type === "coin") { state.coinsCollected++; setLiveCoins(state.coinsCollected); sounds.playCoin(); } else if (f.type === "potion") { state.activeMagnetSeconds = 8; setMagnetTimer(8); sounds.playPowerup(); } else sounds.playEat(); foods.splice(i, 1); continue; }
        }
      }
      if (foods.length < 560) foods.push(...createInitialFoods(60, ARENA_W, ARENA_H, foodPackId));
      if (player.isAlive) for (const bot of bots) {
        if (!bot.isAlive) continue; if (Math.abs(bot.segments[0].x - head.x) > 600 || Math.abs(bot.segments[0].y - head.y) > 600) continue;
        for (let s = 2; s < bot.segments.length; s += 2) { const seg = bot.segments[s]; if (Math.hypot(head.x - seg.x, head.y - seg.y) < player.radius + bot.radius - 6) { player.isAlive = false; state.isGameOver = true; handlePlayerDied({ score: Math.round(player.score), coins: state.coinsCollected, foodEaten: state.foodEatenCount, wormsDefeated: player.kills, survivalSeconds: state.survivalSeconds, rank: liveRank }); break; } }
      }
      state.bots = state.bots.filter((b) => b.isAlive);
      const all = [player, ...state.bots]; all.sort((a, b) => b.score - a.score);
      const pr = all.findIndex((s) => s.isPlayer) + 1; setLiveRank(pr > 0 ? pr : 140); setLiveScore(Math.round(player.score));
      const top: Array<{ rank: number; name: string; score: number; isPlayer?: boolean }> = [];
      for (let i = 0; i < Math.min(9, all.length); i++) top.push({ rank: i + 1, name: all[i].name, score: Math.round(all[i].score), isPlayer: all[i].isPlayer });
      setLeaderboardList(top);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const viewW = canvas.width, viewH = canvas.height;
      ctx.save(); ctx.translate(viewW / 2, viewH / 2); ctx.translate(-head.x, -head.y);
      drawArenaBackground(ctx, getBackground(arenaBackground), ARENA_W, ARENA_H);
      ctx.strokeStyle = "rgba(59,130,246,0.6)"; ctx.lineWidth = 12; ctx.strokeRect(0, 0, ARENA_W, ARENA_H);
      for (const f of foods) if (f.x > head.x - viewW && f.x < head.x + viewW && f.y > head.y - viewH && f.y < head.y + viewH) drawFoodItem(ctx, f, ts);
      for (const b of state.bots) drawSnake(ctx, b, ts);
      if (player.isAlive) drawSnake(ctx, player, ts, state.activeMagnetSeconds > 0, false, getWormEmoji(wormEmoji).id === "none" ? undefined : getWormEmoji(wormEmoji).glyph);
      ctx.restore();
      const mm = minimapCanvasRef.current; if (mm) { const mc = mm.getContext("2d"); if (mc) { mc.clearRect(0, 0, mm.width, mm.height); mc.fillStyle = "rgba(10,25,47,0.85)"; mc.fillRect(0, 0, mm.width, mm.height); mc.fillStyle = "rgba(255,255,255,0.65)"; for (const b of state.bots) { mc.beginPath(); mc.arc((b.segments[0].x / ARENA_W) * mm.width, (b.segments[0].y / ARENA_H) * mm.height, 1.8, 0, Math.PI * 2); mc.fill(); } mc.fillStyle = "#22c55e"; mc.beginPath(); mc.arc((head.x / ARENA_W) * mm.width, (head.y / ARENA_H) * mm.height, 3.5, 0, Math.PI * 2); mc.fill(); } }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, [arenaBackground, foodPackId, wormEmoji, handlePlayerDied, liveRank]);

  const toggleSound = () => { const m = sounds.toggleMute(); setSoundMuted(m); onMuteChange?.(m); };
  const activateMagnet = () => { if (magnets > 0 && magnetTimer <= 0) { setMagnets((m) => m - 1); setMagnetTimer(10); if (gameStateRef.current) gameStateRef.current.activeMagnetSeconds = 10; sounds.playPowerup(); } };
  const activateBoost = () => { if (boosts > 0) { setBoosts((b) => b - 1); if (gameStateRef.current?.player) gameStateRef.current.player.isBoosting = true; sounds.playPowerup(); setTimeout(() => { if (gameStateRef.current?.player) gameStateRef.current.player.isBoosting = false; }, 5000); } };
  const activateZoom = () => { if (zooms > 0) setZooms((z) => z - 1); };

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#0c2b5e]">
      <canvas ref={canvasRef} onPointerMove={(e) => { if (!isPausedRef.current) { const r = e.currentTarget.getBoundingClientRect(); pointerPosRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }; } }} onPointerDown={() => { if (!isPausedRef.current) isPointerDownRef.current = true; }} onPointerUp={() => { isPointerDownRef.current = false; }} className="w-full h-full block cursor-crosshair touch-none" />
      {showInterface && <div className={`absolute top-2 z-10 pointer-events-none ${minimapPosition === "left" ? "right-3" : "left-3"}`}>
        <div className={`${showOverlay ? "bg-black/45" : "bg-[#0b1b33]"} text-white p-2.5 rounded-lg border border-white/10 text-xs w-52`}>
          <div className="text-white/80 font-bold mb-1.5 flex justify-between"><span>Melhores jogadores</span><span className="text-blue-300 font-normal">({260})</span></div>
          <div className="space-y-0.5">{leaderboardList.map((i) => (
            <div key={`${i.rank}-${i.name}`} className={`flex justify-between text-[11px] py-0.5 px-1 rounded ${i.isPlayer ? "text-yellow-300 font-bold bg-yellow-500/20" : "text-white/90"}`}>
              <div className="flex gap-1"><span className="text-white/60 w-5 text-right">{i.rank}.</span><span className="truncate max-w-[130px]">{i.name}</span></div>
              <span>{i.score.toLocaleString()}</span>
            </div>
          ))}</div>
        </div>
      </div>}
      {showInterface && <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none">
        <div className={`${showOverlay ? "bg-gradient-to-b from-[#1e293b]/90 to-[#0f172a]/90" : "bg-[#0b1b33]"} px-4 py-1.5 rounded-lg border border-amber-500/30 flex items-center gap-3`}>
          <div className="w-8 h-8 rounded-md bg-amber-600/30 flex items-center justify-center">🎁</div>
          <div className="flex flex-col"><div className="text-white text-xs font-bold">Sobrevive 240 segundos</div>
            <div className="flex items-center gap-2 mt-0.5"><div className="w-28 h-2 bg-black/60 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-500 to-green-400" style={{ width: `${Math.min(100, (survivalSecs / 240) * 100)}%` }} /></div>
              <span className="text-[11px] font-mono font-bold">{survivalSecs}/240</span></div>
          </div>
        </div>
        {magnetTimer > 0 && <div className="mt-1 bg-blue-600/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-300 animate-pulse">🧲 Ímã {magnetTimer}s</div>}
      </div>}
      <div className={`absolute top-2 z-10 flex flex-col gap-2 ${minimapPosition === "left" ? "left-3" : "right-3"}`}>
        <div className="flex items-center gap-2">
          {showInterface && <div className="flex items-center bg-amber-500/20 border border-amber-400/40 rounded-full px-3 py-1"><span className="text-yellow-300 font-extrabold text-sm">🪙 {liveCoins}</span></div>}
          <button onClick={pauseGame} className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center cursor-pointer"><Pause size={16} /></button>
        </div>
        {showInterface && <div className="relative rounded-lg overflow-hidden border-2 border-white/20" style={{ transform: `scale(${minimapScale})`, transformOrigin: minimapPosition === "left" ? "top left" : "top right" }}><canvas ref={minimapCanvasRef} width={110} height={110} className="block w-28 h-28" /></div>}
      </div>
      <div className={`absolute bottom-4 z-10 flex items-center gap-4 ${showInterface ? "" : "hidden"} left-1/2 -translate-x-1/2`}>
        <button onClick={activateMagnet} className="relative w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-b from-blue-700 to-blue-900 border-blue-400/80 border-2 cursor-pointer"><Magnet className="text-white w-6 h-6" /><span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-blue-950 px-1.5 rounded-full">{magnets}</span></button>
        <button onPointerDown={() => { isPointerDownRef.current = true; }} onPointerUp={() => { isPointerDownRef.current = false; }} onClick={activateBoost} className="relative w-16 h-16 rounded-full bg-gradient-to-b from-blue-600 to-indigo-900 border-blue-300 border-2 cursor-pointer flex items-center justify-center"><Zap className="text-yellow-300 w-7 h-7 animate-pulse" /><span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-indigo-950 px-1.5 rounded-full">{boosts}</span></button>
        <button onClick={activateZoom} className="relative w-14 h-14 rounded-full bg-gradient-to-b from-blue-800 to-slate-900 border-blue-400/80 border-2 cursor-pointer flex items-center justify-center"><ZoomIn className="text-white w-6 h-6" /><span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-blue-950 px-1.5 rounded-full">{zooms}</span></button>
      </div>
      {isPaused && !isGameOver && <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] p-6 rounded-2xl border-2 border-yellow-400/80 max-w-sm w-full text-center text-white">
          <div className="text-4xl mb-2">⏸️</div><h2 className="text-2xl font-black text-yellow-300 mb-2">Jogo Pausado</h2>
          <div className="space-y-3">
            <button onClick={() => { sounds.playClick(); resumeGame(); }} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-extrabold rounded-xl flex items-center justify-center gap-2 cursor-pointer"><Play size={18} />Continuar</button>
            <button onClick={toggleSound} className="w-full py-2.5 bg-blue-900/60 text-blue-200 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer">{soundMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}{soundMuted ? "Ativar som" : "Silenciar"}</button>
            <button onClick={onReturnToMenu} className="w-full py-2.5 bg-red-900/60 text-red-200 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"><Home size={18} />Voltar ao Menu</button>
          </div>
        </div>
      </div>}
      {isGameOver && gameOverStats && <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] p-6 rounded-3xl border-4 border-yellow-400 max-w-md w-full text-center text-white">
          <div className="inline-block px-6 py-1.5 bg-red-600 rounded-full text-white font-black text-sm uppercase mb-3">Fim de Jogo!</div>
          <h2 className="text-3xl font-black text-yellow-300 mb-1">{gameOverStats.score > 2000 ? "Incrível Desempenho!" : "Boa Tentativa!"}</h2>
          <div className="grid grid-cols-2 gap-3 my-5">
            <div className="bg-blue-950/70 p-3 rounded-xl"><div className="text-[11px] text-blue-300 font-bold">Pontuação</div><div className="text-2xl font-black text-yellow-300">{gameOverStats.score.toLocaleString()}</div></div>
            <div className="bg-blue-950/70 p-3 rounded-xl"><div className="text-[11px] text-blue-300 font-bold">Moedas</div><div className="text-2xl font-black text-amber-400">+{gameOverStats.coins} 🪙</div></div>
          </div>
          <div className="space-y-2">
            <button onClick={async () => { if (playerUser.coins >= 250 && onReviveWithCoins) { const res = await onReviveWithCoins(); if (res.ok) initGame(); } }} className="w-full py-3 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-yellow-200 text-amber-950 font-black cursor-pointer">Reviver 250 🪙</button>
            <button onClick={onReturnToMenu} className="w-full py-2.5 bg-blue-900/60 text-blue-100 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"><Home size={18} />Voltar ao Menu</button>
          </div>
        </div>
      </div>}
    </div>
  );
}
