import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __cobraProMaxPool?: Pool;
  __cobraProMaxDb?: NodePgDatabase<Record<string, never>>;
};

function createPool(): Pool {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const needsSsl =
    /supabase|neon|render|railway|amazonaws|heroku/i.test(databaseUrl) &&
    !/sslmode=disable/i.test(databaseUrl);

  return new Pool({
    connectionString: databaseUrl,
    ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  });
}

export function getPool(): Pool {
  if (!globalForDb.__cobraProMaxPool) {
    globalForDb.__cobraProMaxPool = createPool();
  }
  return globalForDb.__cobraProMaxPool;
}

function getDb(): NodePgDatabase<Record<string, never>> {
  if (!globalForDb.__cobraProMaxDb) {
    globalForDb.__cobraProMaxDb = drizzle(getPool());
  }
  return globalForDb.__cobraProMaxDb;
}

export const hasDatabaseUrl = () => Boolean(process.env.DATABASE_URL);

export const db = new Proxy({} as NodePgDatabase<Record<string, never>>, {
  get(_target, prop, receiver) {
    const realDb = getDb();
    const value = Reflect.get(realDb as object, prop, receiver);
    return typeof value === "function" ? value.bind(realDb) : value;
  },
});

export const pool = new Proxy({} as Pool, {
  get(_target, prop, receiver) {
    const realPool = getPool();
    const value = Reflect.get(realPool as object, prop, receiver);
    return typeof value === "function" ? value.bind(realPool) : value;
  },
});
