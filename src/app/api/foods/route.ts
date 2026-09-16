import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, userFoodPacks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { FOOD_PACKS, getFoodPack } from "@/lib/foodPacks";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "demo-user-1";
    const userList = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const selected = userList[0]?.foodPack || "apple";
    const owned = await db.select().from(userFoodPacks).where(eq(userFoodPacks.userId, userId));
    const unlocked = new Set(owned.map((r) => r.packId));
    return NextResponse.json({ packs: FOOD_PACKS.map((p) => ({ ...p, isUnlocked: !p.premium || unlocked.has(p.id), isSelected: p.id === selected })), selectedId: selected, coins: userList[0]?.coins ?? 0 });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const { userId = "demo-user-1", packId, action = "select" } = await request.json();
    const pack = getFoodPack(packId); if (!pack || pack.id !== packId) return NextResponse.json({ error: "Alimento não encontrado" }, { status: 404 });
    const userList = await db.select().from(users).where(eq(users.id, userId)).limit(1); if (!userList[0]) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    const owned = await db.select().from(userFoodPacks).where(and(eq(userFoodPacks.userId, userId), eq(userFoodPacks.packId, packId))).limit(1);
    const isUnlocked = !pack.premium || owned.length > 0;
    if (action === "buy") { if (!isUnlocked) await db.insert(userFoodPacks).values({ userId, packId }); await db.update(users).set({ foodPack: packId }).where(eq(users.id, userId)); const u = await db.select().from(users).where(eq(users.id, userId)).limit(1); return NextResponse.json({ success: true, selectedId: packId, coins: u[0].coins }); }
    if (!isUnlocked) return NextResponse.json({ error: "Premium" }, { status: 400 });
    await db.update(users).set({ foodPack: packId }).where(eq(users.id, userId));
    const u = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return NextResponse.json({ success: true, selectedId: packId, coins: u[0].coins });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}
