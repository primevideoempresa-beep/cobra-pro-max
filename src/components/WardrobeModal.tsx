"use client";

import React from "react";
import { X, Shirt, Plus } from "lucide-react";
import { sounds } from "@/lib/sound";
import { WORM_SKINS } from "@/lib/wormSkins";

interface WardrobeModalProps {
  isOpen: boolean; onClose: () => void; userCoins: number; selectedSkinId: string;
  unlockedSkinIds?: string[]; onSelectSkin: (id: string) => Promise<void>;
  onBuySkin: (id: string) => Promise<{ ok: boolean; error?: string }>; onOpenCoinShop?: () => void;
}

export function WardrobeModal({ isOpen, onClose, userCoins, selectedSkinId, unlockedSkinIds = [], onSelectSkin, onBuySkin, onOpenCoinShop }: WardrobeModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[#1d3a7a] text-white flex flex-col">
      <header className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2"><Shirt className="text-yellow-300" /><h1 className="text-3xl font-black text-yellow-300">Guarda-roupa</h1></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-black/45 border-2 border-amber-400/80 rounded-full pl-1.5 pr-1 py-1">
            <span className="mr-2">🪙</span><span className="text-yellow-300 font-black mr-2">{userCoins}</span>
            <button onClick={() => { sounds.playClick(); onOpenCoinShop?.(); }} className="w-7 h-7 rounded-lg bg-[#3b82f6]"><Plus size={14} /></button>
          </div>
          <button onClick={() => { sounds.playClick(); onClose(); }} className="w-10 h-10 rounded-xl bg-gradient-to-b from-amber-400 to-orange-500 border-2 border-yellow-200"><X size={22} /></button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gradient-to-b from-[#2f5fae] to-[#0a275a]">
        {WORM_SKINS.map((skin) => {
          const unlocked = skin.priceKind === "free" || unlockedSkinIds.includes(skin.id);
          const equipped = selectedSkinId === skin.id;
          return (
            <div key={skin.id} className={`rounded-2xl p-3 border-[3px] flex flex-col items-center ${equipped ? "border-lime-300 ring-4 ring-lime-300/50" : "border-white/25"}`} style={{ background: `linear-gradient(160deg, ${skin.cardFrom}, ${skin.cardTo})` }}>
              <div className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center text-3xl" style={{ background: `radial-gradient(circle at 35% 30%, #fff, ${skin.headColor})` }}>{skin.face}</div>
              <div className="text-sm font-black text-yellow-300 mt-2">{skin.name}</div>
              <div className="text-[10px] text-white/80">{skin.rarity}</div>
              <button onClick={async () => { sounds.playClick(); if (unlocked) await onSelectSkin(skin.id); else { const r = await onBuySkin(skin.id); if (r.ok) await onSelectSkin(skin.id); } }} className="mt-2 px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-black text-xs cursor-pointer">
                {equipped ? "✓ Equipada" : unlocked ? "Equipar" : skin.priceKind === "coins" ? `${skin.priceCoins} 🪙` : skin.priceBRL}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
