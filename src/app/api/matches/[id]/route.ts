import { NextResponse } from "next/server";
import { db } from "@/db";
import { matches } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    await db.delete(matches).where(eq(matches.id, parseInt(id, 10)));
    return NextResponse.json({ success: true, deletedId: parseInt(id, 10) });
  } catch (error) { return NextResponse.json({ error: String(error) }, { status: 500 }); }
}
