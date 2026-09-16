import { NextResponse } from "next/server";
import { db } from "@/db";
import { skins, userSkins, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url); const userId = searchParams.get("userId") || "demo-user-1";
    let all = await db.select().from(skins);
    if (all.length === 0) { await seedDatabase(); all = await db.select().from(skins); }
    const u = await db.select().from(userSkins).where(eq(userSkins.userId, userId));
    const set = new Set(u.map((x) => x.skinId));
    return NextResponse.json({ skins: all.map((s) => ({ ...s, isUnlocked: s.isUnlockedByDefault || set.has(s.id) })) });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = `custom_${Date.now()}`;
    await db.insert(skins).values({ id, name: body.name || "Custom", category: body.category || "standard", priceCoins: Number(body.priceCoins || 0), headColor: body.headColor || "#3b82f6", bodyColor: body.bodyColor || "#2563eb", secondaryColor: body.secondaryColor || "#93c5fd", bodyPattern: body.bodyPattern || "striped", eyeType: "cartoon_googly", hatType: body.hatType || "none", speedBonus: Number(body.speedBonus || 1), isUnlockedByDefault: false });
    if (body.userId) await db.insert(userSkins).values({ userId: body.userId, skinId: id });
    const n = await db.select().from(skins).where(eq(skins.id, id)).limit(1);
    return NextResponse.json({ skin: { ...n[0], isUnlocked: true } });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}
