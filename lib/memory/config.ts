export const MEMORY_BACKEND = process.env.PUB_MEMORY_BACKEND ?? "json";
export const VECTOR_STORE_BACKEND = process.env.PUB_VECTOR_STORE_BACKEND ?? "pgvector";
export const EMBEDDING_PROVIDER = process.env.PUB_EMBEDDING_PROVIDER ?? "deterministic";

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim());
}

