import { NextResponse } from "next/server";
import { db } from "@/db";
import { quests, userQuests } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try { const { id } = await props.params; const body = await request.json(); const questId = parseInt(id, 10);
    await db.update(quests).set({ title: body.title, description: body.description, targetType: body.targetType, targetValue: Number(body.targetValue), rewardCoins: Number(body.rewardCoins), rewardXp: Number(body.rewardXp), rewardApples: Number(body.rewardApples) }).where(eq(quests.id, questId));
    const u = await db.select().from(quests).where(eq(quests.id, questId)).limit(1); return NextResponse.json({ quest: u[0] });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  try { const { id } = await props.params; const questId = parseInt(id, 10); await db.delete(userQuests).where(eq(userQuests.questId, questId)); await db.delete(quests).where(eq(quests.id, questId)); return NextResponse.json({ success: true, deletedId: questId }); }
  catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}
