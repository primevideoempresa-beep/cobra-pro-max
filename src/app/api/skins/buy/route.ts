import { NextResponse } from "next/server";
import { db } from "@/db";
import { skins, userSkins, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { userId, skinId } = await request.json();
    const sl = await db.select().from(skins).where(eq(skins.id, skinId)).limit(1);
    if (!sl[0]) return NextResponse.json({ error: "Skin não encontrada" }, { status: 404 });
    const u = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!u[0]) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    const owned = await db.select().from(userSkins).where(and(eq(userSkins.userId, userId), eq(userSkins.skinId, skinId))).limit(1);
    if (owned.length > 0 || sl[0].isUnlockedByDefault) { await db.update(users).set({ selectedSkinId: skinId }).where(eq(users.id, userId)); return NextResponse.json({ success: true, alreadyOwned: true }); }
    if (u[0].coins < sl[0].priceCoins) return NextResponse.json({ error: "Moedas insuficientes" }, { status: 400 });
    await db.update(users).set({ coins: u[0].coins - sl[0].priceCoins, selectedSkinId: skinId }).where(eq(users.id, userId));
    await db.insert(userSkins).values({ userId, skinId });
    return NextResponse.json({ success: true, remainingCoins: u[0].coins - sl[0].priceCoins, skinId });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}
