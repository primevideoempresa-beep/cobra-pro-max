import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, userEmojis } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { WORM_EMOJIS, getWormEmoji } from "@/lib/emojis";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "demo-user-1";
    const userList = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const selected = userList[0]?.wormEmoji || "wink";
    const owned = await db.select().from(userEmojis).where(eq(userEmojis.userId, userId));
    const unlocked = new Set(owned.map((r) => r.emojiId));
    return NextResponse.json({ emojis: WORM_EMOJIS.map((e) => ({ ...e, isUnlocked: !e.premium || unlocked.has(e.id), isSelected: e.id === selected })), selectedId: selected });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const { userId = "demo-user-1", emojiId, action = "select" } = await request.json();
    const item = getWormEmoji(emojiId); if (!item || item.id !== emojiId) return NextResponse.json({ error: "Emoji não encontrado" }, { status: 404 });
    const userList = await db.select().from(users).where(eq(users.id, userId)).limit(1); if (!userList[0]) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    const owned = await db.select().from(userEmojis).where(and(eq(userEmojis.userId, userId), eq(userEmojis.emojiId, emojiId))).limit(1);
    const isUnlocked = !item.premium || owned.length > 0;
    if (action === "buy") { if (!isUnlocked) await db.insert(userEmojis).values({ userId, emojiId }); await db.update(users).set({ wormEmoji: emojiId }).where(eq(users.id, userId)); return NextResponse.json({ success: true, selectedId: emojiId, purchased: !isUnlocked }); }
    if (!isUnlocked) return NextResponse.json({ error: "Premium" }, { status: 400 });
    await db.update(users).set({ wormEmoji: emojiId }).where(eq(users.id, userId));
    return NextResponse.json({ success: true, selectedId: emojiId });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}
