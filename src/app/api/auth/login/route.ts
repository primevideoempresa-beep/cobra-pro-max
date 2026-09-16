import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, userSkins, userPowerups } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    if (!username) return NextResponse.json({ error: "Nome de usuário é obrigatório" }, { status: 400 });
    const existing = await db.select().from(users).where(eq(users.username, username.trim())).limit(1);
    if (existing.length === 0) {
      const newId = `user_${Date.now()}`;
      await db.insert(users).values({
        id: newId, username: username.trim(), email: `${username.trim().toLowerCase()}@cobrapromax.game`, passwordHash: password || "123456",
        avatar: "/images/worm-mascot.png", level: 1, xp: 0, coins: 300, apples: 20, selectedSkinId: "classic_white", packageName: "com.cobrapromax.game", role: "player",
      });
      await db.insert(userSkins).values({ userId: newId, skinId: "classic_white" });
      await db.insert(userPowerups).values({ userId: newId, magnetCount: 3, boostCount: 3, zoomCount: 3, multiplierCount: 2 });
      const newUser = await db.select().from(users).where(eq(users.id, newId)).limit(1);
      return NextResponse.json({ user: newUser[0], message: "Conta criada com sucesso!" });
    }
    return NextResponse.json({ user: existing[0], message: "Bem-vindo de volta!" });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}
