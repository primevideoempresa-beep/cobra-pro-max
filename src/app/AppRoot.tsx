"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MenuScreen } from "@/components/MenuScreen";
import { GameCanvas } from "@/components/GameCanvas";
import { DashboardView } from "@/components/DashboardView";
import { WardrobeModal } from "@/components/WardrobeModal";
import { LeaderboardModal } from "@/components/LeaderboardModal";
import { ChatModal } from "@/components/ChatModal";
import { SettingsModal } from "@/components/SettingsModal";
import { ProfileModal } from "@/components/ProfileModal";
import { ShareModal } from "@/components/ShareModal";
import { SkinConfig } from "@/lib/gameEngine";
import { sounds } from "@/lib/sound";
import { rememberedUserId, rememberUserId, readLocalSave, writeLocalSave } from "@/lib/persist";
import { getWormSkin, toSkinConfig } from "@/lib/wormSkins";
import { RotateCw } from "lucide-react";

export default function AppRoot() {
  const [currentScreen, setCurrentScreen] = useState<"menu" | "gameplay" | "dashboard">("menu");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>({
    id: "demo-user-1", username: "CobraMestre", coins: 480, level: 2, xp: 340, apples: 20, selectedSkinId: "classic_white", packageName: "com.cobrapromax.game", role: "admin",
    soundEnabled: true, musicVolume: 6, sfxVolume: 5, minimapPosition: "right", minimapScale: "1", showInterface: true, showOverlay: true, handedness: "right", controlScheme: "pointer", arenaBackground: "ocean", foodPack: "apple", wormEmoji: "wink", soundMuted: false, locale: "pt",
  });
  const [powerupCounts, setPowerupCounts] = useState({ magnetCount: 4, boostCount: 5, zoomCount: 3, multiplierCount: 2 });
  const [allSkins, setAllSkins] = useState<any[]>([]);
  const [questsList, setQuestsList] = useState<any[]>([]);
  const [matchesList, setMatchesList] = useState<any[]>([]);
  const [userMatches, setUserMatches] = useState<any[]>([]);
  const [unlockedBackgrounds, setUnlockedBackgrounds] = useState<string[]>([]);
  const [unlockedFoodPacks, setUnlockedFoodPacks] = useState<string[]>([]);
  const [unlockedEmojis, setUnlockedEmojis] = useState<string[]>([]);
  const [unlockedWormSkins, setUnlockedWormSkins] = useState<string[]>([]);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  const loadInitialData = useCallback(async (userId = rememberedUserId() || "demo-user-1") => {
    try {
      const userRes = await fetch(`/api/auth/me?userId=${userId}`); const userData = await userRes.json();
      if (userData.user) { setUser({ ...userData.user, musicVolume: userData.user.musicVolume ?? 6, sfxVolume: userData.user.sfxVolume ?? 5, soundMuted: Boolean(userData.user.soundMuted) }); rememberUserId(userData.user.id); sounds.setSfxLevel(userData.user.sfxVolume ?? 5); sounds.setMusicLevel(userData.user.musicVolume ?? 6); sounds.muted = Boolean(userData.user.soundMuted); }
      if (userData.powerups) setPowerupCounts(userData.powerups);
      const sRes = await fetch(`/api/worm-skins?userId=${userId}`); const sData = await sRes.json(); if (sData.skins) { setUnlockedWormSkins(sData.skins.filter((x: any) => x.isUnlocked).map((x: any) => x.id)); setUser((u: any) => ({ ...u, selectedSkinId: sData.selectedId })); }
      const qRes = await fetch(`/api/quests?userId=${userId}`); const qData = await qRes.json(); if (qData.quests) setQuestsList(qData.quests);
      const mRes = await fetch(`/api/matches?userId=${userId}`); const mData = await mRes.json(); if (mData.leaderboard) setMatchesList(mData.leaderboard); if (mData.userMatches) setUserMatches(mData.userMatches);
      const bgRes = await fetch(`/api/backgrounds?userId=${userId}`); const bgData = await bgRes.json(); if (bgData.backgrounds) setUnlockedBackgrounds(bgData.backgrounds.filter((b: any) => b.isUnlocked).map((b: any) => b.id));
      if (bgData.selectedId) setUser((u: any) => ({ ...u, arenaBackground: bgData.selectedId }));
      const fRes = await fetch(`/api/foods?userId=${userId}`); const fData = await fRes.json(); if (fData.packs) setUnlockedFoodPacks(fData.packs.filter((p: any) => p.isUnlocked).map((p: any) => p.id));
      if (fData.selectedId) setUser((u: any) => ({ ...u, foodPack: fData.selectedId }));
      const eRes = await fetch(`/api/emojis?userId=${userId}`); const eData = await eRes.json(); if (eData.emojis) setUnlockedEmojis(eData.emojis.filter((e: any) => e.isUnlocked).map((e: any) => e.id));
      if (eData.selectedId) setUser((u: any) => ({ ...u, wormEmoji: eData.selectedId }));
    } finally { setIsLoading(false); }
  }, []);

  useEffect(() => {
    loadInitialData();
    const check = () => { if (typeof window !== "undefined") setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 768); };
    check(); window.addEventListener("resize", check); return () => window.removeEventListener("resize", check);
  }, [loadInitialData]);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      writeLocalSave({ userId: user.id, user, powerupCounts, unlockedBackgrounds, unlockedFoodPacks, unlockedEmojis, muted: sounds.muted, savedAt: Date.now() }); rememberUserId(user.id);
      fetch("/api/auth/me", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, username: user.username, coins: user.coins, apples: user.apples, selectedSkinId: user.selectedSkinId, musicVolume: user.musicVolume, sfxVolume: user.sfxVolume, minimapPosition: user.minimapPosition, minimapScale: user.minimapScale, showInterface: user.showInterface, showOverlay: user.showOverlay, handedness: user.handedness, controlScheme: user.controlScheme, arenaBackground: user.arenaBackground, foodPack: user.foodPack, wormEmoji: user.wormEmoji, soundMuted: user.soundMuted, level: user.level, xp: user.xp, locale: user.locale }) }).catch(() => {});
    }, 400);
    return () => clearTimeout(timer);
  }, [isLoading, user, powerupCounts, unlockedBackgrounds, unlockedFoodPacks, unlockedEmojis]);

  const handleFullscreen = () => { if (typeof document !== "undefined") { const el = document.documentElement; if (!document.fullscreenElement) el.requestFullscreen?.().catch(() => {}); else document.exitFullscreen?.(); } };
  const equippedSkin: SkinConfig = toSkinConfig(getWormSkin(user.selectedSkinId));

  const addCoins = async (n: number) => { sounds.playCoin(); const nc = user.coins + n; setUser((u: any) => ({ ...u, coins: nc })); await fetch("/api/auth/me", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, coins: nc }) }); };
  const refillApples = async () => { sounds.playCoin(); setUser((u: any) => ({ ...u, apples: 20 })); await fetch("/api/auth/me", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, apples: 20 }) }); };
  const selectWormSkin = async (id: string) => { setUser((u: any) => ({ ...u, selectedSkinId: id })); await fetch("/api/worm-skins", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, skinId: id, action: "select" }) }); };
  const buyWormSkin = async (id: string) => { const res = await fetch("/api/worm-skins", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, skinId: id, action: "buy" }) }); const d = await res.json(); if (!d.success) return { ok: false, error: d.error }; setUnlockedWormSkins((p) => p.includes(id) ? p : [...p, id]); setUser((u: any) => ({ ...u, selectedSkinId: id, coins: d.coins ?? u.coins })); return { ok: true }; };
  const deleteAccount = async () => { await fetch("/api/auth/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id }) }); await loadInitialData(user.id); };
  const switchUser = async (username: string) => { const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username }) }); const d = await res.json(); if (d.user) loadInitialData(d.user.id); };
  const updateUsername = async (n: string) => { setUser((u: any) => ({ ...u, username: n })); await fetch("/api/auth/me", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, username: n }) }); };
  const saveVolumes = async (m: number, s: number) => { sounds.setMusicLevel(m); sounds.setSfxLevel(s); setUser((u: any) => ({ ...u, musicVolume: m, sfxVolume: s })); await fetch("/api/auth/me", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, musicVolume: m, sfxVolume: s }) }); };
  const saveArenaSettings = async (s: any) => { setUser((u: any) => ({ ...u, ...s })); await fetch("/api/auth/me", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, ...s }) }); };
  const saveControlSettings = async (s: any) => { setUser((u: any) => ({ ...u, ...s })); await fetch("/api/auth/me", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, ...s }) }); };
  const selectBg = async (id: string) => { setUser((u: any) => ({ ...u, arenaBackground: id })); await fetch("/api/backgrounds", { method: "POST", body: JSON.stringify({ userId: user.id, backgroundId: id, action: "select" }), headers: { "Content-Type": "application/json" } }); };
  const buyBg = async (id: string) => { const r = await fetch("/api/backgrounds", { method: "POST", body: JSON.stringify({ userId: user.id, backgroundId: id, action: "buy" }), headers: { "Content-Type": "application/json" } }); const d = await r.json(); if (d.success) { setUnlockedBackgrounds((p) => p.includes(id) ? p : [...p, id]); setUser((u: any) => ({ ...u, arenaBackground: id, coins: d.coins ?? u.coins })); return { ok: true }; } return { ok: false }; };
  const selectFood = async (id: string) => { setUser((u: any) => ({ ...u, foodPack: id })); await fetch("/api/foods", { method: "POST", body: JSON.stringify({ userId: user.id, packId: id, action: "select" }), headers: { "Content-Type": "application/json" } }); };
  const buyFood = async (id: string) => { const r = await fetch("/api/foods", { method: "POST", body: JSON.stringify({ userId: user.id, packId: id, action: "buy" }), headers: { "Content-Type": "application/json" } }); const d = await r.json(); if (d.success) { setUnlockedFoodPacks((p) => p.includes(id) ? p : [...p, id]); setUser((u: any) => ({ ...u, foodPack: id, coins: d.coins ?? u.coins })); return { ok: true }; } return { ok: false }; };
  const selectEmoji = async (id: string) => { setUser((u: any) => ({ ...u, wormEmoji: id })); await fetch("/api/emojis", { method: "POST", body: JSON.stringify({ userId: user.id, emojiId: id, action: "select" }), headers: { "Content-Type": "application/json" } }); };
  const buyEmoji = async (id: string) => { const r = await fetch("/api/emojis", { method: "POST", body: JSON.stringify({ userId: user.id, emojiId: id, action: "buy" }), headers: { "Content-Type": "application/json" } }); const d = await r.json(); if (d.success) { setUnlockedEmojis((p) => p.includes(id) ? p : [...p, id]); setUser((u: any) => ({ ...u, wormEmoji: id })); return { ok: true }; } return { ok: false }; };
  const selectLanguage = async (id: string) => { setUser((u: any) => ({ ...u, locale: id })); await fetch("/api/auth/me", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, locale: id }) }); };
  const reviveCoins = async () => { if (user.coins < 250) return { ok: false, error: "Você não tem 250 moedas." }; const nc = user.coins - 250; setUser((u: any) => ({ ...u, coins: nc })); await fetch("/api/auth/me", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, coins: nc }) }); return { ok: true }; };
  const deleteMatch = async (id: number) => { await fetch(`/api/matches/${id}`, { method: "DELETE" }); setMatchesList((p) => p.filter((m: any) => m.id !== id)); setUserMatches((p) => p.filter((m: any) => m.id !== id)); };
  const buyPowerup = async (type: string) => { sounds.playCoin(); const r = await fetch("/api/powerups", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, type, action: "buy" }) }); const d = await r.json(); if (d.powerups) setPowerupCounts(d.powerups); if (d.user?.coins !== undefined) setUser((u: any) => ({ ...u, coins: d.user.coins })); };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex items-center justify-center">
      {isPortrait && currentScreen !== "dashboard" && <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-amber-950 font-black text-xs px-4 py-1.5 rounded-full shadow-xl flex items-center gap-2 animate-bounce"><RotateCw size={14} /><span>Gire o aparelho para o modo horizontal!</span></div>}
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a275a] text-white"><div className="w-16 h-16 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin mb-4" /><h2 className="text-2xl font-black text-yellow-300 uppercase">Cobra Pro Max</h2><span className="text-xs text-blue-200 mt-1 font-mono">Carregando Arena...</span></div>
        ) : currentScreen === "menu" ? (
          <MenuScreen user={user} equippedSkin={equippedSkin} allSkins={allSkins} onPlayGame={() => { sounds.playClick(); setCurrentScreen("gameplay"); }} onOpenWardrobe={() => setIsWardrobeOpen(true)} onOpenLeaderboard={() => setIsLeaderboardOpen(true)} onOpenChat={() => setIsChatOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} onOpenProfile={() => setIsProfileOpen(true)} onOpenDashboard={() => setCurrentScreen("dashboard")} onRefillApples={refillApples} onOpenCoinShop={() => addCoins(250)} onOpenShare={() => setIsShareOpen(true)} />
        ) : currentScreen === "gameplay" ? (
          <GameCanvas playerUser={user} equippedSkin={equippedSkin} powerupCounts={powerupCounts} arenaSettings={{ minimapPosition: user.minimapPosition ?? "right", minimapScale: user.minimapScale ?? "1", showInterface: user.showInterface ?? true, showOverlay: user.showOverlay ?? true }} controlSettings={{ handedness: user.handedness ?? "right", controlScheme: user.controlScheme ?? "pointer" }} arenaBackground={user.arenaBackground} foodPackId={user.foodPack} wormEmoji={user.wormEmoji} locale={user.locale} onMuteChange={(m) => setUser((u: any) => ({ ...u, soundMuted: m }))} onReviveWithCoins={reviveCoins} onReturnToMenu={() => { sounds.playClick(); setCurrentScreen("menu"); }} onRefreshUserData={() => loadInitialData(user.id)} />
        ) : (
          <DashboardView currentUser={user} skinsList={allSkins} questsList={questsList} matchesList={matchesList} powerupCounts={powerupCounts} onBackToGame={() => setCurrentScreen("menu")} onRefreshData={() => loadInitialData(user.id)} onCreateSkin={async () => {}} onUpdateSkin={async () => {}} onDeleteSkin={async () => {}} onCreateQuest={async () => {}} onUpdateQuest={async () => {}} onDeleteQuest={async () => {}} onClaimQuest={async () => {}} onDeleteMatch={deleteMatch} onBuyPowerup={buyPowerup} onAddCoinsToPlayer={addCoins} />
        )}
      </div>

      <WardrobeModal isOpen={isWardrobeOpen} onClose={() => setIsWardrobeOpen(false)} userCoins={user.coins} selectedSkinId={user.selectedSkinId} unlockedSkinIds={unlockedWormSkins} onSelectSkin={selectWormSkin} onBuySkin={buyWormSkin} onOpenCoinShop={() => addCoins(250)} />
      <LeaderboardModal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} leaderboard={matchesList} userMatches={userMatches} onDeleteMatch={deleteMatch} />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} currentUser={{ id: user.id, username: user.username }} onCoinsEarned={(c) => setUser((u: any) => ({ ...u, coins: u.coins }))} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} onOpenCoinShop={() => addCoins(250)} onRequestFullscreen={handleFullscreen} onSaveVolumes={saveVolumes} onSaveArenaSettings={saveArenaSettings} onSaveControlSettings={saveControlSettings} unlockedBackgrounds={unlockedBackgrounds} onSelectBackground={selectBg} onBuyBackground={buyBg} unlockedFoodPacks={unlockedFoodPacks} onSelectFoodPack={selectFood} onBuyFoodPack={buyFood} unlockedEmojis={unlockedEmojis} onSelectEmoji={selectEmoji} onBuyEmoji={buyEmoji} onSelectLanguage={selectLanguage} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} userMatches={userMatches} unlockedSkinCount={unlockedWormSkins.length} totalSkinCount={unlockedWormSkins.length} onUpdateUsername={updateUsername} onSwitchUser={switchUser} onOpenShare={() => setIsShareOpen(true)} onOpenCoinShop={() => addCoins(250)} onDeleteAccount={deleteAccount} />
      <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} user={{ id: user.id, username: user.username, level: user.level }} onShareComplete={(_c, n) => setUser((u: any) => ({ ...u, coins: n }))} />
    </div>
  );
}
