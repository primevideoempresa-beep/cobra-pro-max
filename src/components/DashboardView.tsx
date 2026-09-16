"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { sounds } from "@/lib/sound";

interface Props {
  currentUser: any; skinsList: any[]; questsList: any[]; matchesList: any[]; powerupCounts: any;
  onBackToGame: () => void; onRefreshData: () => void;
  onCreateSkin: (s: any) => Promise<void>; onUpdateSkin: (id: string, s: any) => Promise<void>; onDeleteSkin: (id: string) => Promise<void>;
  onCreateQuest: (q: any) => Promise<void>; onUpdateQuest: (id: number, q: any) => Promise<void>; onDeleteQuest: (id: number) => Promise<void>;
  onClaimQuest: (id: number) => Promise<void>;
  onDeleteMatch: (id: number) => Promise<void>;
  onBuyPowerup: (t: string) => Promise<void>; onAddCoinsToPlayer: (n: number) => Promise<void>;
}

export function DashboardView({ currentUser, onBackToGame, onRefreshData, onAddCoinsToPlayer, onBuyPowerup }: Props) {
  return (
    <div className="w-full h-full overflow-auto bg-slate-950 text-white p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => { sounds.playClick(); onBackToGame(); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 cursor-pointer"><ArrowLeft size={18} /> Voltar ao Jogo</button>
        <h1 className="text-3xl font-black text-yellow-300">Painel de Controle</h1>
        <button onClick={onRefreshData} className="ml-auto px-4 py-2 rounded-xl bg-emerald-600 cursor-pointer">Atualizar</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700"><div className="text-xs text-slate-400">Jogador</div><div className="text-xl font-black">{currentUser.username}</div><div className="text-sm">Nível {currentUser.level} • {currentUser.coins} 🪙</div></div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700"><div className="text-xs text-slate-400">Pacote</div><div className="font-mono text-sm">{currentUser.packageName}</div></div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700"><div className="text-xs text-slate-400">Ações rápidas</div><button onClick={() => onAddCoinsToPlayer(500)} className="mt-2 px-3 py-1 bg-amber-500 text-amber-950 font-black rounded cursor-pointer mr-2">+500 🪙</button><button onClick={() => onBuyPowerup("magnet")} className="px-3 py-1 bg-blue-600 rounded cursor-pointer">Comprar ímã</button></div>
      </div>
      <div className="text-sm text-slate-400">CRUD de peles, missões e partidas está disponível via API. A arena principal é a tela de jogo.</div>
    </div>
  );
}
