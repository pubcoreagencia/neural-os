import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { hasPostgres, withClient } from "./db";
import { SCHEMA_SQL } from "./sql";
import { readJsonStore } from "./json-adapter";

const MIGRATIONS_DIR = resolve(process.cwd(), "migrations");

export async function ensureMigrationsDir() {
  await mkdir(MIGRATIONS_DIR, { recursive: true });
  await writeFile(resolve(MIGRATIONS_DIR, "001_initial_schema.sql"), SCHEMA_SQL, "utf8");
}

export async function applySchemaMigration() {
  if (!hasPostgres()) {
    throw new Error("DATABASE_URL is required to run PostgreSQL migrations");
  }
  await withClient(async (client) => {
    await client.query(SCHEMA_SQL);
  });
}

export async function migrateJsonToPostgres() {
  if (!hasPostgres()) {
    throw new Error("DATABASE_URL is required to migrate JSON storage to PostgreSQL");
  }
  const store = await readJsonStore();
  const summary = {
    knowledge: store.knowledge.length,
    chunks: store.chunks.length
  };
  await applySchemaMigration();
  await withClient(async (client) => {
    for (const record of store.knowledge) {
      await client.query(
        `insert into knowledge (id, title, content, domain, category, entity_type, entity_id, source_type, source_uri, author, owner, version, status, confidence, tags, permissions, created_at, updated_at, provenance)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
         on conflict (id) do nothing`,
        [
          record.id,
          record.title,
          record.content,
          record.domain,
          record.category,
          record.entityType,
          record.entityId,
          record.sourceType,
          record.sourceUri,
          record.author,
          record.owner,
          record.version,
          record.status,
          record.confidence,
          record.tags,
          record.permissions,
          record.createdAt,
          record.updatedAt,
          record.provenance
        ]
      );
      for (const version of record.versions) {
        await client.query(
          `insert into knowledge_versions (id, knowledge_id, version, content, checksum, source_uri, created_at)
           values ($1,$2,$3,$4,$5,$6,$7)
           on conflict (id) do nothing`,
          [version.id, record.id, version.version, version.content, version.checksum, version.sourceUri, version.createdAt]
        );
      }
    }
    for (const chunk of store.chunks) {
      await client.query(
        `insert into chunks (id, knowledge_id, version, content, chunk_index, token_count, embedding, source_uri, provenance, created_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,now())
         on conflict (id) do nothing`,
        [
          chunk.id,
          chunk.knowledgeId,
          chunk.version,
          chunk.content,
          chunk.index,
          chunk.tokenCount,
          chunk.embedding,
          chunk.sourceUri,
          chunk.provenance
        ]
      );
    }
  });
  return summary;
}
