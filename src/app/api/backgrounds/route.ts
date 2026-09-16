import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, userBackgrounds } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ARENA_BACKGROUNDS, getBackground } from "@/lib/backgrounds";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "demo-user-1";
    const userList = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const selected = userList[0]?.arenaBackground || "ocean";
    const unlockedRows = await db.select().from(userBackgrounds).where(eq(userBackgrounds.userId, userId));
    const unlocked = new Set(unlockedRows.map((r) => r.backgroundId));
    return NextResponse.json({ backgrounds: ARENA_BACKGROUNDS.map((bg) => ({ ...bg, isUnlocked: !bg.premium || unlocked.has(bg.id), isSelected: bg.id === selected })), selectedId: selected, coins: userList[0]?.coins ?? 0 });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const { userId = "demo-user-1", backgroundId, action = "select" } = await request.json();
    const theme = getBackground(backgroundId); if (!theme || theme.id !== backgroundId) return NextResponse.json({ error: "Tela não encontrada" }, { status: 404 });
    const userList = await db.select().from(users).where(eq(users.id, userId)).limit(1); if (!userList[0]) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    const owned = await db.select().from(userBackgrounds).where(and(eq(userBackgrounds.userId, userId), eq(userBackgrounds.backgroundId, backgroundId))).limit(1);
    const isUnlocked = !theme.premium || owned.length > 0;
    if (action === "buy") {
      if (!isUnlocked) await db.insert(userBackgrounds).values({ userId, backgroundId });
      await db.update(users).set({ arenaBackground: backgroundId }).where(eq(users.id, userId));
      const u = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      return NextResponse.json({ success: true, selectedId: backgroundId, coins: u[0].coins, message: `Tela ${theme.name} desbloqueada!` });
    }
    if (!isUnlocked) return NextResponse.json({ error: "Premium bloqueado" }, { status: 400 });
    await db.update(users).set({ arenaBackground: backgroundId }).where(eq(users.id, userId));
    const u = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return NextResponse.json({ success: true, selectedId: backgroundId, coins: u[0].coins });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}
