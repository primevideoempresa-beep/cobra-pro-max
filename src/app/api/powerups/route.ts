import { NextResponse } from "next/server";
import { db } from "@/db";
import { userPowerups, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url); const userId = searchParams.get("userId") || "demo-user-1";
    const res = await db.select().from(userPowerups).where(eq(userPowerups.userId, userId)).limit(1);
    if (res.length === 0) { await db.insert(userPowerups).values({ userId, magnetCount: 3, boostCount: 3, zoomCount: 3, multiplierCount: 2 }); const c = await db.select().from(userPowerups).where(eq(userPowerups.userId, userId)).limit(1); return NextResponse.json({ powerups: c[0] }); }
    return NextResponse.json({ powerups: res[0] });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const { userId = "demo-user-1", type, action = "buy" } = await request.json();
    let p = (await db.select().from(userPowerups).where(eq(userPowerups.userId, userId)).limit(1))[0];
    if (!p) { await db.insert(userPowerups).values({ userId, magnetCount: 3, boostCount: 3, zoomCount: 3, multiplierCount: 2 }); p = (await db.select().from(userPowerups).where(eq(userPowerups.userId, userId)).limit(1))[0]; }
    if (action === "buy") {
      const prices: Record<string, number> = { magnet: 50, boost: 40, zoom: 30, multiplier: 80 };
      const price = prices[type] || 50;
      const uList = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!uList[0] || uList[0].coins < price) return NextResponse.json({ error: "Moedas insuficientes!" }, { status: 400 });
      await db.update(users).set({ coins: uList[0].coins - price }).where(eq(users.id, userId));
      const upd = type === "magnet" ? { magnetCount: p.magnetCount + 3 } : type === "boost" ? { boostCount: p.boostCount + 3 } : type === "zoom" ? { zoomCount: p.zoomCount + 3 } : { multiplierCount: p.multiplierCount + 3 };
      await db.update(userPowerups).set(upd).where(eq(userPowerups.id, p.id));
    } else if (action === "use") {
      const upd = type === "magnet" ? { magnetCount: Math.max(0, p.magnetCount - 1) } : type === "boost" ? { boostCount: Math.max(0, p.boostCount - 1) } : type === "zoom" ? { zoomCount: Math.max(0, p.zoomCount - 1) } : { multiplierCount: Math.max(0, p.multiplierCount - 1) };
      await db.update(userPowerups).set(upd).where(eq(userPowerups.id, p.id));
    }
    const updated = await db.select().from(userPowerups).where(eq(userPowerups.userId, userId)).limit(1);
    const u2 = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return NextResponse.json({ powerups: updated[0], user: u2[0] });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}
