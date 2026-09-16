import { NextResponse } from "next/server";
import { db } from "@/db";
import { shares, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
const REWARD_COINS = 50, MAX_PER_DAY = 5;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url); const userId = searchParams.get("userId") || "demo-user-1";
    const list = await db.select().from(shares).where(eq(shares.userId, userId)).orderBy(desc(shares.createdAt)).limit(30);
    return NextResponse.json({ shares: list });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const { userId = "demo-user-1", userName = "CobraMestre", channel = "copy", inviteCode = "COBRA-MAX", shareUrl = "" } = await request.json();
    const u = await db.select().from(users).where(eq(users.id, userId)).limit(1); if (!u[0]) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    const all = await db.select().from(shares).where(eq(shares.userId, userId));
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const rewardedToday = all.filter((s) => { const d = s.createdAt instanceof Date ? s.createdAt : new Date(s.createdAt); return d >= today && s.coinsAwarded > 0; }).length;
    const coinsAwarded = rewardedToday < MAX_PER_DAY ? REWARD_COINS : 0;
    const newCoins = u[0].coins + coinsAwarded;
    if (coinsAwarded > 0) await db.update(users).set({ coins: newCoins }).where(eq(users.id, userId));
    const inserted = await db.insert(shares).values({ userId, userName, channel, inviteCode, shareUrl: String(shareUrl), coinsAwarded }).returning();
    return NextResponse.json({ success: true, share: inserted[0], coinsAwarded, newCoins });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}
