import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, userSkins, skins, userPowerups } from "@/db/schema";
import { eq } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "demo-user-1";
    let userList = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (userList.length === 0) { await seedDatabase(); userList = await db.select().from(users).where(eq(users.id, userId)).limit(1); }
    if (userList.length === 0) userList = await db.select().from(users).limit(1);
    if (userList.length === 0) return NextResponse.json({ error: "No user found" }, { status: 404 });
    const user = userList[0];
    const unlocked = await db.select().from(userSkins).where(eq(userSkins.userId, user.id));
    const powerups = await db.select().from(userPowerups).where(eq(userPowerups.userId, user.id)).limit(1);
    return NextResponse.json({ user, unlockedSkinIds: unlocked.map((u) => u.skinId), powerups: powerups[0] || { magnetCount: 3, boostCount: 3, zoomCount: 3, multiplierCount: 2 } });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId = "demo-user-1", username, soundEnabled, musicEnabled, selectedSkinId, avatar, coins, apples, musicVolume, sfxVolume, minimapPosition, minimapScale, showInterface, showOverlay, handedness, controlScheme, arenaBackground, foodPack, wormEmoji, soundMuted, level, xp, locale } = body;
    const updateData: any = {};
    if (username !== undefined) updateData.username = username;
    if (soundEnabled !== undefined) updateData.soundEnabled = soundEnabled;
    if (musicEnabled !== undefined) updateData.musicEnabled = musicEnabled;
    if (selectedSkinId !== undefined) updateData.selectedSkinId = selectedSkinId;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (coins !== undefined) updateData.coins = Number(coins);
    if (apples !== undefined) updateData.apples = Number(apples);
    if (musicVolume !== undefined) updateData.musicVolume = Math.max(0, Math.min(10, Number(musicVolume)));
    if (sfxVolume !== undefined) updateData.sfxVolume = Math.max(0, Math.min(10, Number(sfxVolume)));
    if (minimapPosition !== undefined) updateData.minimapPosition = minimapPosition === "left" ? "left" : "right";
    if (minimapScale !== undefined) updateData.minimapScale = ["1", "1.2", "1.5"].includes(String(minimapScale)) ? String(minimapScale) : "1";
    if (showInterface !== undefined) updateData.showInterface = Boolean(showInterface);
    if (showOverlay !== undefined) updateData.showOverlay = Boolean(showOverlay);
    if (handedness !== undefined) updateData.handedness = handedness === "left" ? "left" : "right";
    if (controlScheme !== undefined) { const allowed = ["buttons", "pointer", "joystick", "drag"]; updateData.controlScheme = allowed.includes(String(controlScheme)) ? String(controlScheme) : "pointer"; }
    if (arenaBackground !== undefined) updateData.arenaBackground = String(arenaBackground);
    if (foodPack !== undefined) updateData.foodPack = String(foodPack);
    if (wormEmoji !== undefined) updateData.wormEmoji = String(wormEmoji);
    if (soundMuted !== undefined) updateData.soundMuted = Boolean(soundMuted);
    if (level !== undefined) updateData.level = Number(level);
    if (xp !== undefined) updateData.xp = Number(xp);
    if (locale !== undefined) updateData.locale = String(locale);
    await db.update(users).set(updateData).where(eq(users.id, userId));
    const updated = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return NextResponse.json({ user: updated[0] });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}
