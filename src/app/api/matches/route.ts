import { NextResponse } from "next/server";
import { db } from "@/db";
import { matches, users, userQuests, quests } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url); const userId = searchParams.get("userId") || "demo-user-1";
    let allMatches = await db.select().from(matches).orderBy(desc(matches.score)).limit(50);
    if (allMatches.length === 0) { await seedDatabase(); allMatches = await db.select().from(matches).orderBy(desc(matches.score)).limit(50); }
    const userMatch = await db.select().from(matches).where(eq(matches.userId, userId)).orderBy(desc(matches.createdAt)).limit(20);
    return NextResponse.json({ leaderboard: allMatches.slice(0, 15), userMatches: userMatch });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId = "demo-user-1", playerName = "CobraMestre", score = 0, coinsEarned = 0, foodEaten = 0, wormsDefeated = 0, survivalSeconds = 0 } = body;
    const inserted = await db.insert(matches).values({ userId, playerName, score: Number(score), coinsEarned: Number(coinsEarned), foodEaten: Number(foodEaten), wormsDefeated: Number(wormsDefeated), survivalSeconds: Number(survivalSeconds), maxLength: Math.floor(Number(score) / 15) + 20, rankAchieved: 100 }).returning();
    const u = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (u[0]) {
      const xpGained = Math.floor(Number(score) / 50) + Number(wormsDefeated) * 25 + Math.floor(Number(survivalSeconds) / 5);
      const newXp = u[0].xp + xpGained; const newLevel = Math.floor(newXp / 500) + 1;
      await db.update(users).set({ coins: u[0].coins + Number(coinsEarned), xp: newXp, level: newLevel }).where(eq(users.id, userId));
    }
    return NextResponse.json({ match: inserted[0], success: true });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}
