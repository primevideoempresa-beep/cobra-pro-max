import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, userSkins, userQuests, userPowerups, matches, shares, chatMessages } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { userId = "demo-user-1" } = await request.json();
    const userList = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (userList.length === 0) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    await db.delete(matches).where(eq(matches.userId, userId));
    await db.delete(userQuests).where(eq(userQuests.userId, userId));
    await db.delete(shares).where(eq(shares.userId, userId));
    await db.delete(chatMessages).where(eq(chatMessages.userId, userId));
    await db.delete(userSkins).where(eq(userSkins.userId, userId));
    await db.delete(userPowerups).where(eq(userPowerups.userId, userId));
    await db.insert(userSkins).values({ userId, skinId: "classic_white" });
    await db.insert(userPowerups).values({ userId, magnetCount: 3, boostCount: 3, zoomCount: 3, multiplierCount: 2 });
    await db.update(users).set({ level: 1, xp: 0, coins: 0, apples: 20, selectedSkinId: "classic_white" }).where(eq(users.id, userId));
    const updated = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return NextResponse.json({ success: true, user: updated[0] });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}
