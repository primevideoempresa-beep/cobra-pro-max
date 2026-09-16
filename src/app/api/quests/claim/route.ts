import { NextResponse } from "next/server";
import { db } from "@/db";
import { quests, userQuests, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { userId, questId } = await request.json();
    const q = await db.select().from(quests).where(eq(quests.id, Number(questId))).limit(1);
    const uq = await db.select().from(userQuests).where(eq(userQuests.questId, Number(questId))).limit(1);
    if (!q[0] || !uq[0] || !uq[0].isCompleted) return NextResponse.json({ error: "Missão não concluída" }, { status: 400 });
    const u = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (u[0]) await db.update(users).set({ coins: u[0].coins + q[0].rewardCoins, xp: u[0].xp + q[0].rewardXp, apples: u[0].apples + q[0].rewardApples }).where(eq(users.id, userId));
    await db.update(userQuests).set({ isClaimed: true }).where(eq(userQuests.id, uq[0].id));
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}
