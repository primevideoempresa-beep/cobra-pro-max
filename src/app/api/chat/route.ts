import { NextResponse } from "next/server";
import { db } from "@/db";
import { chatMessages } from "@/db/schema";
import { desc } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let list = await db.select().from(chatMessages).orderBy(desc(chatMessages.createdAt)).limit(30);
    if (list.length === 0) { await seedDatabase(); list = await db.select().from(chatMessages).orderBy(desc(chatMessages.createdAt)).limit(30); }
    return NextResponse.json({ messages: list.reverse() });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const { userId = "demo-user-1", userName = "CobraMestre", message } = await request.json();
    if (!message || !message.trim()) return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 });
    const inserted = await db.insert(chatMessages).values({ userId, userName, userAvatar: "/images/worm-mascot.png", message: message.trim() }).returning();
    return NextResponse.json({ message: inserted[0] });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}
