"use client";

import React, { useState } from "react";
import { X, Plus, Globe, Volume2 } from "lucide-react";
import { sounds } from "@/lib/sound";
import { ControlPreviewArena } from "@/components/ControlPreviewArena";
import { ArenaSettings, ControlSettings } from "@/components/SettingsModalTypes";
import { ARENA_BACKGROUNDS } from "@/lib/backgrounds";
import { FOOD_PACKS } from "@/lib/foodPacks";
import { WORM_EMOJIS } from "@/lib/emojis";
import { LANGUAGES, t } from "@/lib/i18n";

type Tab = "options" | "arena" | "controls" | "gallery" | "food" | "emoji" | "lang";

interface Props {
  isOpen: boolean; onClose: () => void; user: any; onOpenCoinShop: () => void;
  onRequestFullscreen: () => void; onSaveVolumes: (m: number, s: number) => Promise<void>;
  onSaveArenaSettings: (s: ArenaSettings) => Promise<void>; onSaveControlSettings: (s: ControlSettings) => Promise<void>;
  unlockedBackgrounds?: string[]; onSelectBackground: (id: string) => Promise<void>; onBuyBackground: (id: string) => Promise<{ ok: boolean }>;
  unlockedFoodPacks?: string[]; onSelectFoodPack: (id: string) => Promise<void>; onBuyFoodPack: (id: string) => Promise<{ ok: boolean }>;
  unlockedEmojis?: string[]; onSelectEmoji: (id: string) => Promise<void>; onBuyEmoji: (id: string) => Promise<{ ok: boolean }>;
  onSelectLanguage: (id: string) => Promise<void>;
}

export function SettingsModal(p: Props) {
  const [tab, setTab] = useState<Tab>("options");
  const [musicVolume, setMusicVolume] = useState(p.user.musicVolume ?? 6);
  const [sfxVolume, setSfxVolume] = useState(p.user.sfxVolume ?? 5);
  const [minimapPosition, setMinimapPosition] = useState<"left" | "right">(p.user.minimapPosition ?? "right");
  const [minimapScale, setMinimapScale] = useState<"1" | "1.2" | "1.5">(p.user.minimapScale ?? "1");
  const [handedness, setHandedness] = useState<"left" | "right">(p.user.handedness ?? "right");
  const [controlScheme, setControlScheme] = useState<"buttons" | "pointer" | "joystick" | "drag">(p.user.controlScheme ?? "pointer");
  const [arenaBg, setArenaBg] = useState(p.user.arenaBackground ?? "ocean");
  const [foodPackId, setFoodPackId] = useState(p.user.foodPack ?? "apple");
  const [emojiId, setEmojiId] = useState(p.user.wormEmoji ?? "wink");
  if (!p.isOpen) return null;
  const colors = ["#ef4444","#f97316","#fb923c","#f59e0b","#fbbf24","#facc15","#eab308","#ca8a04","#a16207","#854d0e"];
  return (
    <div className="fixed inset-0 z-50 bg-[#1d4f9c] text-white overflow-hidden flex flex-col">
      <header className="flex items-center justify-between px-5 py-3">
        <h1 className="text-3xl font-black text-yellow-300">{t(p.user.locale, "settings")}</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-black/45 border-2 border-amber-400 rounded-full pl-1 pr-1 py-1"><span className="mr-2">🪙</span><span className="text-yellow-300 font-black mr-2">{p.user.coins}</span><button onClick={p.onOpenCoinShop} className="w-7 h-7 rounded-lg bg-[#3b82f6]"><Plus size={14} /></button></div>
          <button onClick={() => { sounds.playClick(); p.onClose(); }} className="w-10 h-10 rounded-xl bg-gradient-to-b from-amber-400 to-orange-500 border-2 border-yellow-200"><X size={22} /></button>
        </div>
      </header>
      <div className="flex px-6 gap-1 overflow-x-auto">
        {([["options","⚙️"],["arena","📺"],["controls","🎮"],["gallery","🖼️"],["food","🍽️"],["emoji","😊"],["lang","🌍"]] as const).map(([id, ic]) => (
          <button key={id} onClick={() => setTab(id as Tab)} className={`px-4 py-2 rounded-t-2xl font-black cursor-pointer border-t-2 border-x-2 ${tab === id ? "bg-[#4da3ff] border-white/30" : "bg-[#2b6cb8] border-transparent"}`}>{ic}</button>
        ))}
      </div>
      <div className="flex-1 bg-gradient-to-b from-[#4da3ff] to-[#2b7de0] border-t-4 border-[#7ec2ff] overflow-y-auto p-5">
        {tab === "options" && <div className="flex flex-col items-center gap-8">
          {[["Música", "🎵", musicVolume, (n: number) => { setMusicVolume(n); sounds.setMusicLevel(n); p.onSaveVolumes(n, sfxVolume); }], ["Sons", "🔊", sfxVolume, (n: number) => { setSfxVolume(n); sounds.setSfxLevel(n); p.onSaveVolumes(musicVolume, n); }]].map(([label, icon, val, fn]: any) => (
            <div key={label as string} className="flex items-center gap-4">
              <span className="w-16 text-right font-black">{label as string}</span>
              <button onClick={() => fn(Math.max(0, val - 1))} className="w-9 h-9 bg-gradient-to-b from-[#7ec8ff] to-[#2b7de0] border-2 border-white/70 rounded-lg font-black text-xl cursor-pointer">−</button>
              <div className="flex gap-[3px] bg-[#12325f] rounded-md px-1.5 py-1.5 border-2 border-[#0b2144]">{Array.from({ length: 10 }).map((_, i) => <button key={i} onClick={() => fn(i + 1)} className="w-5 h-7 rounded-[3px] cursor-pointer" style={{ background: i < val ? colors[i] : "#1e3a5f" }} />)}</div>
              <button onClick={() => fn(Math.min(10, val + 1))} className="w-9 h-9 bg-gradient-to-b from-[#7ec8ff] to-[#2b7de0] border-2 border-white/70 rounded-lg font-black text-xl cursor-pointer">+</button>
              <span className="text-2xl w-8 text-center">{icon as string}</span>
            </div>
          ))}
          <button onClick={p.onRequestFullscreen} className="text-xs underline cursor-pointer"><Volume2 size={14} className="inline mr-1" />Tela cheia</button>
        </div>}
        {tab === "arena" && <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5">
          <div className="space-y-5">
            <div className="font-black">Mini-mapa</div>
            <div className="flex gap-2">{(["1", "1.2", "1.5"] as const).map((s) => <button key={s} onClick={() => { setMinimapScale(s); p.onSaveArenaSettings({ minimapPosition, minimapScale: s, showInterface: true, showOverlay: true }); }} className={`h-11 px-3 rounded-xl font-black cursor-pointer ${minimapScale === s ? "bg-[#3a4a63]" : "bg-[#7a93b0]"}`}>x{s}</button>)}</div>
          </div>
          <div className="relative min-h-[320px] rounded-2xl overflow-hidden border-[3px] border-[#8ec7ff]"><ControlPreviewArena scheme="pointer" liveGameplay backgroundId={arenaBg} foodPackId={foodPackId} emojiId={emojiId} /></div>
        </div>}
        {tab === "controls" && <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
          <div><div className="font-black mb-2">Controles</div>
            <div className="flex items-center gap-3 mb-4"><span className={handedness === "left" ? "font-bold" : "text-white/45"}>Canhoto</span><button onClick={() => { const n = handedness === "left" ? "right" : "left"; setHandedness(n); p.onSaveControlSettings({ handedness: n, controlScheme }); }} className="w-11 h-11 rounded-xl bg-[#2b7de0] border-2 border-white/70">⇄</button><span className={handedness === "right" ? "font-bold" : "text-white/45"}>Destro</span></div>
            <div className="grid grid-cols-2 gap-2">{(["buttons", "pointer", "joystick", "drag"] as const).map((m) => <button key={m} onClick={() => { setControlScheme(m); p.onSaveControlSettings({ handedness, controlScheme: m }); }} className={`h-[90px] rounded-2xl border-[3px] ${controlScheme === m ? "border-lime-300 ring-4 ring-lime-300/50" : "border-white/20"} bg-[#3d7ed0] capitalize text-xs font-black cursor-pointer`}>{m}</button>)}</div>
          </div>
          <div className="relative min-h-[320px] rounded-2xl overflow-hidden border-[3px] border-[#8ec7ff]"><ControlPreviewArena scheme={controlScheme} backgroundId={arenaBg} foodPackId={foodPackId} emojiId={emojiId} /></div>
        </div>}
        {tab === "gallery" && <div className="grid grid-cols-1 lg:grid-cols-[168px_1fr] gap-4">
          <div className="grid grid-cols-2 gap-2 max-h-[62vh] overflow-y-auto">{ARENA_BACKGROUNDS.map((bg) => {
            const unlocked = !bg.premium || (p.unlockedBackgrounds || []).includes(bg.id);
            const sel = arenaBg === bg.id && unlocked;
            return <button key={bg.id} onClick={() => { sounds.playClick(); setArenaBg(bg.id); if (unlocked) p.onSelectBackground(bg.id); }} className={`relative aspect-square rounded-xl border-[3px] ${sel ? "border-lime-300" : "border-white/20"}`} style={{ background: `linear-gradient(135deg, ${bg.color}, ${bg.color2})` }}>{bg.premium && !unlocked && <span className="absolute bottom-1 right-1 w-6 h-6 rounded-md bg-[#1e3a8a]">🔒</span>}</button>;
          })}</div>
          <div className="relative min-h-[320px] rounded-2xl overflow-hidden border-[3px] border-[#8ec7ff]"><ControlPreviewArena scheme="pointer" liveGameplay backgroundId={arenaBg} foodPackId={foodPackId} emojiId={emojiId} /></div>
        </div>}
        {tab === "food" && <div className="grid grid-cols-1 lg:grid-cols-[168px_1fr] gap-4">
          <div className="grid grid-cols-2 gap-2 max-h-[62vh] overflow-y-auto">{FOOD_PACKS.map((fp) => {
            const unlocked = !fp.premium || (p.unlockedFoodPacks || []).includes(fp.id);
            const sel = foodPackId === fp.id && unlocked;
            return <button key={fp.id} onClick={() => { setFoodPackId(fp.id); if (unlocked) p.onSelectFoodPack(fp.id); }} className={`aspect-square rounded-xl bg-[#3d7ed0] border-[3px] text-4xl ${sel ? "border-lime-300" : "border-white/20"} cursor-pointer`}>{fp.emoji}</button>;
          })}</div>
          <div className="relative min-h-[320px] rounded-2xl overflow-hidden border-[3px] border-[#8ec7ff]"><ControlPreviewArena scheme="pointer" liveGameplay backgroundId={arenaBg} foodPackId={foodPackId} emojiId={emojiId} /></div>
        </div>}
        {tab === "emoji" && <div className="grid grid-cols-1 lg:grid-cols-[168px_1fr] gap-4">
          <div className="grid grid-cols-2 gap-2 max-h-[62vh] overflow-y-auto">{WORM_EMOJIS.map((e) => {
            const unlocked = !e.premium || (p.unlockedEmojis || []).includes(e.id);
            const sel = emojiId === e.id && unlocked;
            return <button key={e.id} onClick={() => { setEmojiId(e.id); if (unlocked) p.onSelectEmoji(e.id); }} className={`aspect-square rounded-xl bg-[#3d7ed0] border-[3px] text-3xl ${sel ? "border-lime-300" : "border-white/20"} cursor-pointer flex items-center justify-center`}>{e.id === "none" ? "✖" : e.glyph}</button>;
          })}</div>
          <div className="relative min-h-[320px] rounded-2xl overflow-hidden border-[3px] border-[#8ec7ff]"><ControlPreviewArena scheme="pointer" liveGameplay backgroundId={arenaBg} foodPackId={foodPackId} emojiId={emojiId} /></div>
        </div>}
        {tab === "lang" && <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">{LANGUAGES.map((l) => <button key={l.id} onClick={() => p.onSelectLanguage(l.id)} className={`h-12 rounded-2xl font-black border-2 cursor-pointer ${(p.user.locale || "pt") === l.id ? "bg-[#2b4a73] border-white/30" : "bg-gradient-to-b from-[#7ec8ff] to-[#3b82f6] border-white/50"}`}>{l.label}</button>)}</div>}
      </div>
    </div>
  );
}
