import { seedDatabase } from "@/db/seed";
import { hasDatabaseUrl } from "@/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function runSeed() {
  if (!hasDatabaseUrl()) return Response.json({ success: false, error: "DATABASE_URL não configurada." }, { status: 503 });
  try { await seedDatabase(); return Response.json({ success: true, message: "Database seeded successfully" }); }
  catch (error) { return Response.json({ success: false, error: String(error) }, { status: 500 }); }
}

export async function GET() { return runSeed(); }
export async function POST() { return runSeed(); }
