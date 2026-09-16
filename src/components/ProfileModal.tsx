"use client";

import React, { useState } from "react";
import { X, Globe, Trash2, Share2 } from "lucide-react";
import { sounds } from "@/lib/sound";

interface ProfileModalProps { isOpen: boolean; onClose: () => void; user: any; userMatches: any[]; unlockedSkinCount: number; totalSkinCount: number; onUpdateUsername: (s: string) => Promise<void>; onSwitchUser: (s: string) => Promise<void>; onOpenShare: () => void; onOpenCoinShop: () => void; onDeleteAccount: () => Promise<void>; }

export function ProfileModal({ isOpen, onClose, user, onUpdateUsername, onSwitchUser, onOpenShare, onDeleteAccount }: ProfileModalProps) {
  const [username, setUsername] = useState(user.username);
  const [showDelete, setShowDelete] = useState(false);
  const [showSwitch, setShowSwitch] = useState(false);
  const [switchInput, setSwitchInput] = useState("");
  if (!isOpen) return null;
  const xpPercent = Math.min(100, ((user.xp % 500) / 500) * 100);
  return (
    <div className="fixed inset-0 z-50 bg-[#1d4f9c] text-white overflow-hidden flex flex-col">
      <header className="flex items-center justify-between px-5 py-3"><h1 className="text-3xl font-black">Perfil</h1><button onClick={() => { sounds.playClick(); onClose(); }} className="w-10 h-10 rounded-xl bg-gradient-to-b from-amber-400 to-orange-500 border-2 border-yellow-200"><X size={22} /></button></header>
      <div className="flex px-6 gap-1"><button className="px-7 py-2.5 rounded-t-2xl font-black bg-[#4da3ff] border-white/30 border-t-2 border-x-2 -mb-px">😊 Dossiê</button></div>
      <div className="flex-1 bg-gradient-to-b from-[#3b8cff] to-[#1f64c9] border-t-4 border-[#7ec2ff] overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-b from-[#f5b042] to-[#e08a12] border-[3px] border-[#ffd56a] flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center"><div className="flex gap-1"><div className="w-3.5 h-3.5 rounded-full bg-slate-900" /><div className="w-3.5 h-3.5 rounded-full bg-slate-900" /></div></div>
            </div>
            <div className="flex-1"><div className="h-7 rounded-lg bg-[#12325f] overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300" style={{ width: `${xpPercent}%` }} /></div><div className="text-[10px] text-blue-100 mt-1 text-right">{user.xp % 500}/500 XP</div></div>
          </div>
          <div className="flex items-center gap-3 mb-3"><Globe size={24} /><input value={username} onChange={(e) => setUsername(e.target.value)} onBlur={() => onUpdateUsername(username)} className="flex-1 bg-transparent border-b border-white/30 text-lg font-black" /></div>
          <div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-b from-rose-400 to-red-600 flex items-center justify-center font-black" style={{ clipPath: "polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)" }}>{user.level}</div><span className="text-lg font-black">Seu nível</span></div>
          <div className="flex gap-3 mt-5">
            <button onClick={() => setShowDelete(true)} className="flex-1 h-12 bg-gradient-to-b from-[#ff5d6c] to-[#e11d48] border-2 border-white/40 rounded-xl flex items-center justify-center cursor-pointer"><Trash2 size={22} /></button>
            <button onClick={() => { sounds.playClick(); onOpenShare(); }} className="flex-1 h-12 bg-gradient-to-b from-[#60a5fa] to-[#2563eb] border-2 border-white/40 rounded-xl flex items-center justify-center cursor-pointer"><Share2 size={22} /></button>
          </div>
          <button onClick={() => setShowSwitch(true)} className="mt-3 text-[11px] underline cursor-pointer">Trocar de conta</button>
        </div>
      </div>
      {showDelete && <div className="absolute inset-0 z-30 bg-black/70 flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-[#7f1d1d] to-[#1f2937] p-6 rounded-3xl border-4 border-red-400 max-w-sm w-full text-center">
          <h3 className="text-xl font-black text-red-200 mb-2">Excluir dados?</h3>
          <div className="flex gap-2 mt-4"><button onClick={async () => { await onDeleteAccount(); setShowDelete(false); }} className="flex-1 py-2.5 bg-red-600 rounded-xl font-black cursor-pointer">Excluir tudo</button><button onClick={() => setShowDelete(false)} className="flex-1 py-2.5 bg-slate-700 rounded-xl font-bold cursor-pointer">Cancelar</button></div>
        </div>
      </div>}
      {showSwitch && <form onSubmit={async (e) => { e.preventDefault(); await onSwitchUser(switchInput); setShowSwitch(false); setSwitchInput(""); }} className="absolute inset-0 z-30 bg-black/70 flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] p-5 rounded-3xl border-4 border-yellow-400 max-w-sm w-full"><h3 className="text-lg font-black text-yellow-300 mb-2">Trocar de conta</h3><input value={switchInput} onChange={(e) => setSwitchInput(e.target.value)} placeholder="Nickname" className="w-full px-3 py-2 bg-slate-900 border border-blue-400/40 rounded-xl mb-3" required /><div className="flex gap-2"><button type="submit" className="flex-1 py-2.5 bg-emerald-600 rounded-xl font-black cursor-pointer">Entrar</button><button type="button" onClick={() => setShowSwitch(false)} className="flex-1 py-2.5 bg-slate-700 rounded-xl font-bold cursor-pointer">Cancelar</button></div></div>
      </form>}
    </div>
  );
}
