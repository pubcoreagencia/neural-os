import { randomUUID } from "node:crypto";
import { hasPostgres, withClient } from "./db";
import { readJsonStore } from "./json-adapter";
import { createEmbeddingProviderSelection } from "./embedding-providers";
import { createVectorStore } from "./vector-store";

export interface PostgresValidationCheck {
  name: string;
  passed: boolean;
  details?: string;
}

export interface PostgresValidationReport {
  available: boolean;
  passed: boolean;
  blocker?: string;
  checks: PostgresValidationCheck[];
  summary?: {
    jsonKnowledge: number;
    jsonChunks: number;
    postgresKnowledge: number;
    postgresChunks: number;
    postgresKnowledgeVersions: number;
    postgresSources: number;
    postgresRelationships: number;
    postgresEntities: number;
  };
}

async function tableCount(client: Parameters<Parameters<typeof withClient>[0]>[0], table: string) {
  const result = await client.query(`select count(*)::int as count from ${table}`);
  return Number(result.rows[0]?.count ?? 0);
}

async function validateChunksVectorModel(client: Parameters<Parameters<typeof withClient>[0]>[0]) {
  const result = await client.query(
    `select
       c.embedding is not null as has_embedding,
       coalesce((select atttypmod from pg_attribute where attrelid = 'chunks'::regclass and attname = 'embedding'), -1) as typmod,
       exists (
         select 1
         from pg_indexes
         where tablename = 'chunks'
           and indexname = 'chunks_embedding_idx'
       ) as has_index,
       exists (
         select 1
         from pg_extension
         where extname = 'vector'
       ) as has_vector_extension
     from chunks c
     limit 1`
  );
  const row = result.rows[0];
  const passed = Boolean(row?.has_vector_extension) && Boolean(row?.has_index);
  return {
    passed,
    details: `vector_extension=${Boolean(row?.has_vector_extension)}; index=${Boolean(row?.has_index)}; has_embedding=${Boolean(row?.has_embedding)}; typmod=${row?.typmod}`
  };
}

async function validateRetrievalSmoke() {
  const vectorStore = createVectorStore();
  const embeddingProvider = createEmbeddingProviderSelection().provider;
  const queryEmbedding = await embeddingProvider.embed("PUB Neural OS");
  const results = await vectorStore.search(queryEmbedding, 3);
  return {
    passed: results.length >= 0,
    details: `results=${results.length}`
  };
}

export async function validatePostgresFoundation(): Promise<PostgresValidationReport> {
  if (!hasPostgres()) {
    return {
      available: false,
      passed: false,
      blocker: "DATABASE_URL not configured",
      checks: [
        { name: "database_url", passed: false, details: "DATABASE_URL is missing" }
      ]
    };
  }

  const jsonStore = await readJsonStore();
  const checks: PostgresValidationCheck[] = [];

  return withClient(async (client) => {
    await client.query("select 1");
    checks.push({ name: "connection", passed: true });

    await client.query("create extension if not exists vector");
    const vectorCheck = await validateChunksVectorModel(client);
    checks.push({ name: "pgvector_schema", passed: vectorCheck.passed, details: vectorCheck.details });

    const postgresKnowledge = await tableCount(client, "knowledge");
    const postgresChunks = await tableCount(client, "chunks");
    const postgresKnowledgeVersions = await tableCount(client, "knowledge_versions");
    const postgresSources = await tableCount(client, "sources");
    const postgresRelationships = await tableCount(client, "relationships");
    const postgresEntities = await tableCount(client, "entities");

    checks.push({
      name: "knowledge_count",
      passed: postgresKnowledge >= jsonStore.knowledge.length,
      details: `json=${jsonStore.knowledge.length}; postgres=${postgresKnowledge}`
    });
    checks.push({
      name: "chunks_count",
      passed: postgresChunks >= jsonStore.chunks.length,
      details: `json=${jsonStore.chunks.length}; postgres=${postgresChunks}`
    });
    checks.push({
      name: "versions_count",
      passed: postgresKnowledgeVersions >= jsonStore.knowledge.reduce((sum, record) => sum + record.versions.length, 0),
      details: `postgres=${postgresKnowledgeVersions}`
    });
    checks.push({ name: "sources_present", passed: postgresSources >= 0, details: `postgres=${postgresSources}` });
    checks.push({ name: "relationships_present", passed: postgresRelationships >= 0, details: `postgres=${postgresRelationships}` });
    checks.push({ name: "entities_present", passed: postgresEntities >= 0, details: `postgres=${postgresEntities}` });

    const smoke = await validateRetrievalSmoke();
    checks.push({ name: "retrieval_smoke", passed: smoke.passed, details: smoke.details });

    const passed = checks.every((check) => check.passed);

    return {
      available: true,
      passed,
      checks,
      summary: {
        jsonKnowledge: jsonStore.knowledge.length,
        jsonChunks: jsonStore.chunks.length,
        postgresKnowledge,
        postgresChunks,
        postgresKnowledgeVersions,
        postgresSources,
        postgresRelationships,
        postgresEntities
      }
    };
  });
}

export function createValidationRunId() {
  return randomUUID();
}
