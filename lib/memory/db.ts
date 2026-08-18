import { Pool, type PoolClient } from "pg";
import { hasDatabaseUrl } from "./config";

let pool: Pool | null = null;

export function hasPostgres() {
  return hasDatabaseUrl();
}

export function getPool() {
  if (!hasPostgres()) {
    throw new Error("DATABASE_URL is required for PostgreSQL operations");
  }
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

export async function withClient<T>(fn: (client: PoolClient) => Promise<T>) {
  const client = await getPool().connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
