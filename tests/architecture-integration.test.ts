import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createEmbeddingProviderSelection } from "../lib/memory/embedding-providers";
import { DeterministicEmbeddingProvider } from "../lib/memory/embeddings";
import { hasDatabaseUrl } from "../lib/memory/config";
import { SCHEMA_SQL } from "../lib/memory/sql";

const domainPath = resolve(process.cwd(), "lib", "domain", "contracts.ts");
const vectorStorePath = resolve(process.cwd(), "lib", "memory", "vector-store.ts");

test("domain does not import memory directly", async () => {
  const contents = await readFile(domainPath, "utf8");
  assert.equal(contents.includes("@/lib/memory"), false);
  assert.equal(contents.includes("lib/memory"), false);
});

test("vector store and schema use the chunks embedding model", async () => {
  const vectorStoreSource = await readFile(vectorStorePath, "utf8");
  assert.equal(SCHEMA_SQL.includes("create table if not exists knowledge_vectors"), false);
  assert.equal(SCHEMA_SQL.includes("chunks_embedding_idx"), true);
  assert.equal(vectorStoreSource.includes("knowledge_vectors"), false);
  assert.equal(vectorStoreSource.includes("from chunks"), true);
});

test("deterministic embeddings stay on a fixed dimension", async () => {
  const provider = new DeterministicEmbeddingProvider();
  const embedding = await provider.embed("PUB Neural OS");
  assert.equal(embedding.length, 48);
});

test("embedding provider selection is explicit when real provider is not configured", () => {
  const previous = process.env.PUB_EMBEDDING_PROVIDER;
  process.env.PUB_EMBEDDING_PROVIDER = "openai";
  const selection = createEmbeddingProviderSelection();
  assert.equal(selection.status, "REAL EMBEDDING PROVIDER NOT CONFIGURED");
  assert.equal(typeof selection.provider.embed, "function");
  process.env.PUB_EMBEDDING_PROVIDER = previous;
});

test("database url detection remains explicit", () => {
  const previous = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  assert.equal(hasDatabaseUrl(), false);
  process.env.DATABASE_URL = "postgres://example";
  assert.equal(hasDatabaseUrl(), true);
  process.env.DATABASE_URL = previous;
});

