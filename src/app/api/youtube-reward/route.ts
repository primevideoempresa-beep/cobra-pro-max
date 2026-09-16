import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
const REWARD = 250;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url); const userId = searchParams.get("userId") || "demo-user-1";
    const u = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return NextResponse.json({ claimed: Boolean(u[0]?.youtubeRewardClaimed), reward: REWARD });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const { userId = "demo-user-1" } = await request.json();
    const u = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!u[0]) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    if (u[0].youtubeRewardClaimed) return NextResponse.json({ error: "Já resgatou", coins: u[0].coins, claimed: true }, { status: 400 });
    const nc = u[0].coins + REWARD;
    await db.update(users).set({ coins: nc, youtubeRewardClaimed: true }).where(eq(users.id, userId));
    return NextResponse.json({ success: true, claimed: true, coins: nc, reward: REWARD, message: `+${REWARD} moedas!` });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}
