import { NextResponse } from "next/server";
import { db } from "@/db";
import { skins, userSkins } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params; const body = await request.json();
    await db.update(skins).set({ name: body.name, category: body.category, priceCoins: Number(body.priceCoins), headColor: body.headColor, bodyColor: body.bodyColor, secondaryColor: body.secondaryColor, bodyPattern: body.bodyPattern, eyeType: body.eyeType, hatType: body.hatType, speedBonus: Number(body.speedBonus) }).where(eq(skins.id, id));
    const u = await db.select().from(skins).where(eq(skins.id, id)).limit(1);
    return NextResponse.json({ skin: u[0] });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    if (id === "classic_white") return NextResponse.json({ error: "Não é permitido excluir a skin clássica" }, { status: 400 });
    await db.delete(userSkins).where(eq(userSkins.skinId, id));
    await db.delete(skins).where(eq(skins.id, id));
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}
