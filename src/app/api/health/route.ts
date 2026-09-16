import { db, hasDatabaseUrl } from "@/db";
import { sql } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (!hasDatabaseUrl()) return Response.json({ ok: false, error: "DATABASE_URL não configurada." }, { status: 503 });
  try { await db.execute(sql`select 1`); await seedDatabase().catch(() => {}); return Response.json({ ok: true, app: "Cobra Pro Max", package: "com.cobrapromax.game" }); }
  catch { return Response.json({ ok: false }, { status: 500 }); }
}
