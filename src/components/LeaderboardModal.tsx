"use client";

import React, { useState } from "react";
import { X, Trophy, Trash2 } from "lucide-react";
import { sounds } from "@/lib/sound";

interface LeaderboardModalProps {
  isOpen: boolean; onClose: () => void;
  leaderboard: Array<{ id: number; playerName: string; score: number; wormsDefeated?: number; survivalSeconds?: number }>;
  userMatches: Array<{ id: number; score: number; coinsEarned?: number; wormsDefeated?: number; survivalSeconds?: number }>;
  onDeleteMatch?: (id: number) => Promise<void>;
}

export function LeaderboardModal({ isOpen, onClose, leaderboard, userMatches, onDeleteMatch }: LeaderboardModalProps) {
  const [tab, setTab] = useState<"global" | "history">("global");
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3">
      <div className="bg-gradient-to-b from-[#1e3a8a] via-[#172554] to-[#0f172a] rounded-3xl border-4 border-yellow-400 max-w-2xl w-full max-h-[85vh] flex flex-col text-white overflow-hidden">
        <div className="px-5 py-4 bg-blue-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3"><Trophy className="text-yellow-300" size={24} /><h2 className="text-xl font-black text-yellow-300 uppercase">Ranking</h2></div>
          <button onClick={() => { sounds.playClick(); onClose(); }} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer"><X size={18} /></button>
        </div>
        <div className="flex border-b border-blue-400/20 bg-blue-950/40 px-5 pt-2 gap-3">
          <button onClick={() => setTab("global")} className={`pb-2 px-3 font-extrabold text-sm cursor-pointer border-b-2 ${tab === "global" ? "border-yellow-400 text-yellow-300" : "border-transparent text-blue-200"}`}>Ranking Global</button>
          <button onClick={() => setTab("history")} className={`pb-2 px-3 font-extrabold text-sm cursor-pointer border-b-2 ${tab === "history" ? "border-yellow-400 text-yellow-300" : "border-transparent text-blue-200"}`}>Meu Histórico</button>
        </div>
        <div className="p-5 overflow-y-auto flex-1 space-y-2">
          {tab === "global" ? leaderboard.map((item, idx) => (
            <div key={item.id || idx} className={`flex items-center justify-between p-3 rounded-2xl border ${idx === 0 ? "bg-amber-500/20 border-yellow-400" : idx === 1 ? "bg-slate-300/10 border-slate-300" : idx === 2 ? "bg-amber-700/15 border-amber-600" : "bg-blue-950/50 border-blue-400/20"}`}>
              <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl font-black flex items-center justify-center">{idx + 1}</div>
                <div className="font-extrabold text-sm">{item.playerName}</div></div>
              <div className="text-yellow-300 font-black font-mono">{item.score.toLocaleString()} pts</div>
            </div>
          )) : userMatches.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-3 rounded-2xl bg-blue-950/60 border border-blue-400/30">
              <div><span className="text-yellow-300 font-mono font-black">{m.score.toLocaleString()} pts</span><span className="ml-2 text-emerald-400 text-xs">+{m.coinsEarned || 0} 🪙</span></div>
              {onDeleteMatch && <button onClick={() => onDeleteMatch(m.id)} className="text-red-400 p-2 cursor-pointer"><Trash2 size={16} /></button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
