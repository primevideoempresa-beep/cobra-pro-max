import { NextResponse } from "next/server";
import { db } from "@/db";
import { quests, userQuests, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url); const userId = searchParams.get("userId") || "demo-user-1";
    let all = await db.select().from(quests);
    if (all.length === 0) { await seedDatabase(); all = await db.select().from(quests); }
    const progress = await db.select().from(userQuests).where(eq(userQuests.userId, userId));
    const map = new Map(progress.map((p) => [p.questId, p]));
    return NextResponse.json({ quests: all.map((q) => { const up = map.get(q.id); return { ...q, currentProgress: up ? up.currentProgress : 0, isCompleted: up ? up.isCompleted || up.currentProgress >= q.targetValue : false, isClaimed: up ? up.isClaimed : false }; }) });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const inserted = await db.insert(quests).values({ title: body.title, description: body.description, targetType: body.targetType, targetValue: Number(body.targetValue), rewardCoins: Number(body.rewardCoins || 100), rewardXp: Number(body.rewardXp || 50), rewardApples: Number(body.rewardApples || 5), isActive: true }).returning();
    return NextResponse.json({ quest: inserted[0] });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}
