"use client";

import React, { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import { sounds } from "@/lib/sound";

interface ChatModalProps { isOpen: boolean; onClose: () => void; currentUser: { id: string; username: string }; onCoinsEarned?: (c: number) => void; }

export function ChatModal({ isOpen, onClose, currentUser, onCoinsEarned }: ChatModalProps) {
  const [messages, setMessages] = useState<Array<{ id: number; userName: string; message: string }>>([]);
  const [inputText, setInputText] = useState("");
  const [ytClaimed, setYtClaimed] = useState(false);
  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/chat").then((r) => r.json()).then((d) => setMessages(d.messages || [])).catch(() => {});
    fetch(`/api/youtube-reward?userId=${currentUser.id}`).then((r) => r.json()).then((d) => setYtClaimed(Boolean(d.claimed))).catch(() => {});
  }, [isOpen, currentUser.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault(); if (!inputText.trim()) return;
    sounds.playClick();
    const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: currentUser.id, userName: currentUser.username, message: inputText.trim() }) });
    const data = await res.json();
    if (data.message) { setMessages((prev) => [...prev, data.message]); setInputText(""); }
  };

  const claimYt = async () => {
    const res = await fetch("/api/youtube-reward", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: currentUser.id }) });
    const data = await res.json(); if (data.success) { sounds.playCoin(); setYtClaimed(true); onCoinsEarned?.(data.coins); }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3">
      <div className="bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] rounded-3xl border-4 border-yellow-400 max-w-xl w-full h-[75vh] flex flex-col overflow-hidden text-white">
        <div className="px-5 py-4 bg-blue-950/80 flex items-center justify-between"><h2 className="text-xl font-black text-yellow-300">💬 Chat da Arena</h2><button onClick={() => { sounds.playClick(); onClose(); }} className="w-8 h-8 rounded-full bg-white/10"><X size={18} /></button></div>
        <div className="px-4 py-3 bg-[#0b1b33]">
          <div className="rounded-2xl border-2 border-yellow-400/70 bg-gradient-to-r from-[#7f1d1d]/60 to-[#1e3a8a]/60 p-3 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#ff0000] flex items-center justify-center text-xl">▶</div>
            <div className="flex-1"><div className="text-sm font-black text-yellow-300">Ganhe 250 moedas 🪙</div></div>
            {ytClaimed ? <span className="px-3 py-2 bg-emerald-700/70 text-emerald-100 font-black text-xs rounded-xl">✓ Resgatado</span>
              : <button onClick={claimYt} className="px-4 py-2 bg-gradient-to-b from-[#4ade80] to-[#16a34a] text-white font-black text-xs rounded-xl cursor-pointer">Resgatar</button>}
          </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-3">{messages.map((m) => {
          const isMe = m.userName === currentUser.username;
          return <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
            <div className="text-[10px] text-blue-300 font-bold mb-0.5 px-1">{m.userName}{isMe && " (Você)"}</div>
            <div className={`px-3 py-2 rounded-2xl text-sm max-w-[80%] ${isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-blue-950/80 text-blue-100 rounded-tl-none"}`}>{m.message}</div>
          </div>;
        })}</div>
        <form onSubmit={handleSend} className="p-3 bg-blue-950/90 flex gap-2">
          <input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Digite sua mensagem..." className="flex-1 px-4 py-2 bg-slate-900 border border-blue-400/40 rounded-xl text-white text-sm" />
          <button type="submit" className="px-4 py-2 bg-amber-500 text-amber-950 font-black rounded-xl flex items-center gap-1.5 cursor-pointer"><Send size={16} /><span>Enviar</span></button>
        </form>
      </div>
    </div>
  );
}
