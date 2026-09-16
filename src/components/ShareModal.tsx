"use client";

import React, { useMemo, useState } from "react";
import { X, Copy, Check, Share2 } from "lucide-react";
import { sounds } from "@/lib/sound";

interface Props { isOpen: boolean; onClose: () => void; user: { id: string; username: string; level: number }; onShareComplete?: (c: number, n: number) => void; }

export function ShareModal({ isOpen, onClose, user, onShareComplete }: Props) {
  const [copied, setCopied] = useState(false);
  const [msg, setMsg] = useState("");
  const inviteCode = useMemo(() => `COBRA-${(user.username || "MAX").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8)}-${user.level}`, [user]);
  const shareText = `🐍 Entre no Cobra Pro Max! Código: ${inviteCode}`;
  if (!isOpen) return null;
  const copy = async () => {
    sounds.playClick(); await navigator.clipboard?.writeText(shareText); setCopied(true); setMsg("Link copiado!"); setTimeout(() => setCopied(false), 2500);
    const r = await fetch("/api/share", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, userName: user.username, channel: "copy", inviteCode, shareUrl: "" }) }); const d = await r.json(); if (d.coinsAwarded) onShareComplete?.(d.coinsAwarded, d.newCoins);
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3">
      <div className="bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] rounded-3xl border-4 border-yellow-400 max-w-lg w-full text-white overflow-hidden">
        <div className="px-5 py-4 bg-blue-950/80 flex items-center justify-between"><h2 className="text-xl font-black text-yellow-300">🔗 Compartilhar</h2><button onClick={() => { sounds.playClick(); onClose(); }} className="w-8 h-8 rounded-full bg-white/10"><X size={18} /></button></div>
        <div className="p-5 space-y-4">
          <div className="bg-emerald-500/15 border border-emerald-400/40 rounded-2xl p-4 flex items-center gap-3"><div className="flex-1"><div className="text-sm font-black text-emerald-300">+50 moedas por convite</div></div></div>
          <div className="bg-blue-950/70 p-4 rounded-2xl"><div className="text-xs text-blue-300 font-bold mb-1">Código</div><div className="text-2xl font-black text-yellow-300 tracking-[0.18em] font-mono">{inviteCode}</div></div>
          <div className="flex gap-2"><button onClick={copy} className="flex-1 px-3 py-2 bg-amber-500 text-amber-950 font-black rounded-xl cursor-pointer flex items-center gap-1.5">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copiado" : "Copiar"}</button><button onClick={() => { if (navigator.share) navigator.share({ title: "Cobra Pro Max", text: shareText }); }} className="px-4 py-2 bg-blue-600 rounded-xl font-black cursor-pointer flex items-center gap-1.5"><Share2 size={14} />Sistema</button></div>
          {msg && <div className="text-center text-xs font-bold text-yellow-300">{msg}</div>}
        </div>
      </div>
    </div>
  );
}
