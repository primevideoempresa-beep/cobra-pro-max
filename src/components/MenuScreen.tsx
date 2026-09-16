"use client";

import React, { useState } from "react";
import { Shirt, Trophy, MessageCircle, Share2, Settings, Plus, LayoutDashboard } from "lucide-react";
import { SkinConfig } from "@/lib/gameEngine";
import { sounds } from "@/lib/sound";
import { t } from "@/lib/i18n";
import { MenuWorm } from "@/components/MenuWorm";

interface MenuScreenProps {
  user: { id: string; username: string; coins: number; level: number; xp: number; apples: number; locale?: string };
  equippedSkin: SkinConfig;
  allSkins: any[];
  onPlayGame: () => void;
  onOpenWardrobe: () => void;
  onOpenLeaderboard: () => void;
  onOpenChat: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onOpenDashboard: () => void;
  onRefillApples: () => void;
  onOpenCoinShop: () => void;
  onOpenShare: () => void;
}

export function MenuScreen({ user, onPlayGame, onOpenWardrobe, onOpenLeaderboard, onOpenChat, onOpenSettings, onOpenProfile, onOpenDashboard, onRefillApples, onOpenCoinShop, onOpenShare }: MenuScreenProps) {
  const [showEventModal, setShowEventModal] = useState(false);
  const xpPercent = Math.min(100, Math.round(((user.xp % 500) / 500) * 100));
  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-radial from-[#134e9e] via-[#0f3b82] to-[#0a275a] flex flex-col justify-between p-3 sm:p-5 text-white font-sans">
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute inset-0 z-0 pointer-events-none"><MenuWorm /></div>
      <div className="relative z-10 flex items-start justify-between w-full">
        <button onClick={() => { sounds.playClick(); onOpenProfile(); }} className="flex items-center gap-2 bg-[#d97706]/90 border-2 border-[#fbbf24] p-2 rounded-2xl shadow-xl cursor-pointer">
          <div className="relative w-14 h-14 rounded-xl bg-gradient-to-b from-blue-300 to-blue-500 overflow-hidden border-2 border-white/60 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <div className="flex gap-1"><div className="w-3.5 h-3.5 rounded-full bg-slate-900" /><div className="w-3.5 h-3.5 rounded-full bg-slate-900" /></div>
            </div>
            <div className="absolute bottom-0 right-0 bg-amber-500 text-amber-950 text-xs font-black px-1.5 rounded-tl-md">{user.level}</div>
          </div>
          <div className="flex flex-col items-start pr-2">
            <span className="text-white font-extrabold text-sm">Perfil</span>
            <div className="w-28 h-2.5 bg-blue-950/80 rounded-full overflow-hidden p-0.5 border border-yellow-400/40 mt-0.5">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-300 rounded-full" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#b91c1c]/80 border-2 border-red-400/60 rounded-full pl-2 pr-1 py-1">
            <span className="text-lg mr-1">🍎</span>
            <span className="text-white font-black text-sm mr-2">{user.apples}/20</span>
            <button onClick={() => { sounds.playClick(); onRefillApples(); }} className="w-6 h-6 rounded-full bg-[#3b82f6] text-white flex items-center justify-center cursor-pointer"><Plus size={14} /></button>
          </div>
          <div className="flex items-center bg-black/40 border-2 border-amber-400/70 rounded-full pl-2 pr-1 py-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-xs mr-1.5">😊</div>
            <span className="text-yellow-300 font-black text-sm mr-2">{user.coins}</span>
            <button onClick={() => { sounds.playClick(); onOpenCoinShop(); }} className="w-6 h-6 rounded-full bg-[#3b82f6] text-white flex items-center justify-center cursor-pointer"><Plus size={14} /></button>
          </div>
          <button onClick={() => setShowEventModal(true)} className="flex flex-col items-center bg-amber-500/20 p-1 rounded-xl border border-amber-400/40 cursor-pointer">
            <span className="text-3xl animate-bounce">🏺</span>
            <span className="text-[10px] text-yellow-300 font-extrabold">12h 21m</span>
          </button>
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center my-auto">
        <div className="text-4xl sm:text-6xl md:text-7xl font-black italic tracking-wider uppercase">
          <span className="bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent [text-shadow:_0_5px_0_#b45309,_0_10px_15px_rgba(0,0,0,0.6)]">COBRA</span>{" "}
          <span className="bg-gradient-to-b from-lime-300 via-green-400 to-emerald-600 bg-clip-text text-transparent [text-shadow:_0_5px_0_#15803d,_0_10px_15px_rgba(0,0,0,0.6)]">PRO</span>{" "}
          <span className="bg-gradient-to-b from-cyan-300 via-sky-400 to-blue-600 bg-clip-text text-transparent [text-shadow:_0_5px_0_#1d4ed8,_0_10px_15px_rgba(0,0,0,0.6)]">MAX</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 bg-black/40 px-3 py-0.5 rounded-full border border-white/10 text-xs text-blue-200 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          pkg: com.cobrapromax.game <span className="text-white/40">|</span> <span className="text-yellow-300">Modo Horizontal</span>
        </div>
        <button onClick={() => { sounds.playClick(); onPlayGame(); }} className="battle-cta group relative my-3 px-14 py-5 rounded-3xl bg-gradient-to-b from-[#4ade80] via-[#16a34a] to-[#15803d] border-4 border-[#facc15] cursor-pointer overflow-hidden">
          <span className="battle-cta-ring absolute inset-[-10px] rounded-[28px] border-2 border-yellow-300/70" />
          <div className="absolute top-1 left-2 right-2 h-1/3 bg-white/30 rounded-t-2xl pointer-events-none" />
          <span className="battle-cta-shine absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/55 to-transparent" />
          <span className="battle-cta-text relative z-10 text-3xl sm:text-5xl font-black text-white drop-shadow-[0_3px_2px_rgba(0,0,0,0.8)]">{t(user.locale, "battle")}</span>
        </button>
        <button onClick={() => { sounds.playClick(); onOpenWardrobe(); }} className="px-5 py-2 rounded-xl bg-gradient-to-b from-[#0284c7] to-[#0369a1] border-2 border-[#facc15] text-white font-extrabold text-sm cursor-pointer flex items-center gap-2"><Shirt size={16} className="text-yellow-300" /><span>Guarda-roupa</span></button>
      </div>
      <div className="relative z-10 flex items-end justify-between w-full">
        <div className="flex items-center gap-3">
          <button onClick={() => { sounds.playClick(); onOpenLeaderboard(); }} className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#0284c7] to-[#0369a1] border-2 border-[#facc15] text-white flex items-center justify-center cursor-pointer"><Trophy size={22} /></button>
          <button onClick={() => { sounds.playClick(); onOpenChat(); }} className="px-4 h-14 rounded-2xl bg-gradient-to-b from-[#0284c7] to-[#0369a1] border-2 border-[#facc15] flex items-center gap-1.5 text-white cursor-pointer">
            <div className="w-7 h-6 bg-white rounded-lg rounded-bl-none flex items-center justify-center gap-0.5"><span className="w-1 h-1 rounded-full bg-slate-400" /><span className="w-1 h-1 rounded-full bg-slate-400" /></div>
            <span className="text-yellow-300 font-black text-sm">🪙 250</span>
          </button>
        </div>
        <button onClick={() => { sounds.playClick(); onOpenDashboard(); }} className="hidden sm:flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-blue-400/40 text-blue-200 text-xs font-bold cursor-pointer"><LayoutDashboard size={16} className="text-yellow-400" /><span>Painel de Controle</span></button>
        <div className="flex items-center gap-3">
          <button onClick={() => { sounds.playClick(); onOpenShare(); }} className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#0284c7] to-[#0369a1] border-2 border-[#facc15] text-white flex items-center justify-center cursor-pointer"><Share2 size={22} /></button>
          <button onClick={() => { sounds.playClick(); onOpenSettings(); }} className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#0284c7] to-[#0369a1] border-2 border-[#facc15] text-white flex items-center justify-center cursor-pointer"><Settings size={22} /></button>
        </div>
      </div>
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] p-6 rounded-3xl border-4 border-amber-400 max-w-sm w-full text-center text-white">
            <div className="text-4xl mb-2">🎁</div>
            <h3 className="text-2xl font-black text-yellow-300 mb-1">Oferta Relâmpago!</h3>
            <button onClick={() => setShowEventModal(false)} className="mt-4 w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 font-black rounded-xl cursor-pointer">Coletar Bônus</button>
          </div>
        </div>
      )}
    </div>
  );
}
