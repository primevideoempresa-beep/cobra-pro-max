import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, userWormSkins } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { WORM_SKINS, getWormSkin, isFreeSkin } from "@/lib/wormSkins";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url); const userId = searchParams.get("userId") || "demo-user-1";
    const u = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const selected = u[0]?.selectedSkinId || "classic_white";
    const owned = await db.select().from(userWormSkins).where(eq(userWormSkins.userId, userId));
    const unlocked = new Set(owned.map((r) => r.skinId));
    return NextResponse.json({ skins: WORM_SKINS.map((s) => ({ ...s, isUnlocked: isFreeSkin(s) || unlocked.has(s.id), isSelected: s.id === selected })), selectedId: selected, coins: u[0]?.coins ?? 0 });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const { userId = "demo-user-1", skinId, action = "select" } = await request.json();
    const skin = getWormSkin(skinId); if (!skin || skin.id !== skinId) return NextResponse.json({ error: "Pele não encontrada" }, { status: 404 });
    const u = await db.select().from(users).where(eq(users.id, userId)).limit(1); if (!u[0]) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    const owned = await db.select().from(userWormSkins).where(and(eq(userWormSkins.userId, userId), eq(userWormSkins.skinId, skinId))).limit(1);
    const isUnlocked = isFreeSkin(skin) || owned.length > 0;
    if (action === "buy") {
      if (skin.priceKind === "coins") {
        const price = skin.priceCoins ?? 0; if (u[0].coins < price) return NextResponse.json({ error: "Moedas insuficientes!" }, { status: 400 });
        await db.update(users).set({ coins: u[0].coins - price, selectedSkinId: skinId }).where(eq(users.id, userId));
        if (!isUnlocked) await db.insert(userWormSkins).values({ userId, skinId });
        const u2 = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        return NextResponse.json({ success: true, purchased: true, selectedId: skinId, coins: u2[0].coins });
      }
      if (!isUnlocked) await db.insert(userWormSkins).values({ userId, skinId });
      await db.update(users).set({ selectedSkinId: skinId }).where(eq(users.id, userId));
      return NextResponse.json({ success: true, purchased: true, selectedId: skinId, coins: u[0].coins });
    }
    if (!isUnlocked) return NextResponse.json({ error: "Bloqueado" }, { status: 400 });
    await db.update(users).set({ selectedSkinId: skinId }).where(eq(users.id, userId));
    return NextResponse.json({ success: true, selectedId: skinId, coins: u[0].coins });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}
