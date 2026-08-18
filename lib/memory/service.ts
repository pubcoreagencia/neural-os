import { randomUUID, createHash } from "node:crypto";
import { resolve } from "node:path";
import { EMBEDDING_PROVIDER, MEMORY_BACKEND, VECTOR_STORE_BACKEND, hasDatabaseUrl } from "./config";
import { createEmbeddingProviderSelection } from "./embedding-providers";
import { DeterministicEmbeddingProvider } from "./embeddings";
import { cleanText, chunkText, parseSourceFile } from "./parser";
import { createJsonRepositories, createPgRepositories } from "./repositories";
import { buildKnowledgeView, scoreChunks } from "./retrieval";
import { createVectorStore } from "./vector-store";
import { nextVersion } from "./store";
import { readJsonStore, writeJsonStore } from "./json-adapter";
import type { KnowledgeChunk, KnowledgeRecord, KnowledgeSourceInput, KnowledgeVersion, SourceRecord } from "./entities";

const deterministicEmbeddingProvider = new DeterministicEmbeddingProvider();
const vectorStore = createVectorStore();

function checksum(content: string) {
  return createHash("sha256").update(content).digest("hex");
}

function tokenCount(text: string) {
  return text.split(/\s+/).filter(Boolean).length;
}

function selectEmbeddingProvider() {
  return EMBEDDING_PROVIDER === "deterministic"
    ? deterministicEmbeddingProvider
    : createEmbeddingProviderSelection().provider;
}

function selectRepositories() {
  return MEMORY_BACKEND === "postgres" && hasDatabaseUrl()
    ? createPgRepositories()
    : createJsonRepositories(readJsonStore, writeJsonStore);
}

function defaultMetadata(source: KnowledgeSourceInput) {
  return {
    domain: source.domain ?? "PUB Holding",
    category: source.category ?? "Master Context",
    entityType: source.entityType ?? "Document",
    entityId: source.entityId ?? source.title.toLowerCase().replace(/\s+/g, "-"),
    author: source.author ?? "PUB Neural OS",
    owner: source.owner ?? "PUB Holding",
    visibility: source.visibility ?? "INTERNAL",
    tags: source.tags ?? [],
    permissions: source.permissions ?? [source.visibility ?? "INTERNAL"]
  };
}

function createVersionRecord(knowledgeId: string, version: string, content: string, sourceUri: string): KnowledgeVersion {
  const createdAt = new Date().toISOString();
  return {
    id: randomUUID(),
    knowledgeId,
    version,
    content,
    checksum: checksum(content),
    sourceUri,
    createdAt
  };
}

function toSourceRecord(source: KnowledgeSourceInput): SourceRecord {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    sourceType: source.sourceType,
    uri: source.sourceUri,
    title: source.title,
    version: source.version,
    visibility: source.visibility ?? "INTERNAL",
    createdAt: now,
    updatedAt: now,
    metadata: {
      author: source.author ?? null,
      owner: source.owner ?? null,
      domain: source.domain ?? null,
      category: source.category ?? null,
      entityType: source.entityType ?? null,
      entityId: source.entityId ?? null,
      tags: source.tags ?? [],
      permissions: source.permissions ?? []
    }
  };
}

export async function ingestKnowledgeFromFile(input: KnowledgeSourceInput & { filePath: string }) {
  const { filePath, ...source } = input;
  const parsed = await parseSourceFile(resolve(filePath));
  const content = cleanText(parsed.text);
  const repositories = selectRepositories();
  const embeddingProvider = selectEmbeddingProvider();
  const sourceChecksum = checksum(content);
  const existingKnowledge = await repositories.knowledge.getKnowledgeBySourceUri(source.sourceUri);
  const existing = existingKnowledge ?? null;
  const knowledgeId = existing?.id ?? randomUUID();
  const version = existing ? nextVersion(existing.version) : source.version;
  const sourceRecord = toSourceRecord(source);
  await repositories.sources.upsertSource(sourceRecord);

  const chunkRecords = await Promise.all(
    chunkText(content).map(async (chunk, index) => {
      const embedding = await embeddingProvider.embed(chunk);
      return {
        id: randomUUID(),
        knowledgeId,
        version,
        content: chunk,
        index,
        tokenCount: tokenCount(chunk),
        embedding,
        sourceId: sourceRecord.id,
        sourceUri: source.sourceUri,
        provenance: {
          parser: parsed.parser,
          checksum: sourceChecksum,
          page: null,
          section: null,
          heading: null,
          offset: null
        }
      } satisfies KnowledgeChunk;
    })
  );

  const metadata = defaultMetadata(source);
  const createdAt = new Date().toISOString();
  const versionRecord = createVersionRecord(knowledgeId, version, content, source.sourceUri);
  const record: KnowledgeRecord = {
    id: knowledgeId,
    title: source.title,
    content,
    domain: metadata.domain,
    category: metadata.category,
    entityType: metadata.entityType,
    entityId: metadata.entityId,
    sourceId: sourceRecord.id,
    source: source.sourceUri,
    sourceType: source.sourceType,
    sourceUri: source.sourceUri,
    author: metadata.author,
    owner: metadata.owner,
    version,
    status: "active",
    confidence: 0.86,
    tags: metadata.tags,
    permissions: metadata.permissions,
    createdAt: existing?.createdAt ?? createdAt,
    updatedAt: createdAt,
    provenance: {
      parser: parsed.parser,
      checksum: sourceChecksum,
      chunkCount: chunkRecords.length,
      chunkIds: chunkRecords.map((item) => item.id)
    },
    versions: [...(existing?.versions ?? []), versionRecord]
  };

  await repositories.knowledge.upsertKnowledge(record);
  await repositories.chunks.replaceChunks(record.id, chunkRecords);
  await vectorStore.upsert(
    chunkRecords.map((chunk) => ({
      id: chunk.id,
      knowledgeId: chunk.knowledgeId,
      chunkId: chunk.id,
      embedding: chunk.embedding,
      metadata: {
        sourceUri: chunk.sourceUri,
        version: chunk.version,
        chunkIndex: chunk.index
      }
    }))
  );

  return buildKnowledgeView(record, chunkRecords);
}

export async function listKnowledge() {
  const repositories = selectRepositories();
  return repositories.knowledge.listKnowledge();
}

export async function getKnowledgeById(id: string) {
  const repositories = selectRepositories();
  return repositories.knowledge.getKnowledgeById(id);
}

export async function getKnowledgeVersions(id: string) {
  const repositories = selectRepositories();
  return repositories.knowledge.listKnowledgeVersions(id);
}

export async function getProvenance(id: string) {
  const repositories = selectRepositories();
  const record = await repositories.knowledge.getKnowledgeById(id);
  if (!record) return null;
  const chunks = await repositories.chunks.listChunksByKnowledge(id);
  return {
    knowledge: record,
    chunks
  };
}

export async function searchKnowledge(query: string, filters?: { domain?: string; entityId?: string }) {
  const repositories = selectRepositories();
  const embeddingProvider = selectEmbeddingProvider();
  const queryEmbedding = await embeddingProvider.embed(query);
  const records = await repositories.knowledge.listKnowledge();
  const chunks = await repositories.chunks.listAllChunks();
  const filteredKnowledge = records.filter((item) => {
    if (filters?.domain && item.domain !== filters.domain) return false;
    if (filters?.entityId && item.entityId !== filters.entityId) return false;
    return true;
  });
  const filteredChunks = chunks.filter((chunk) => filteredKnowledge.some((item) => item.id === chunk.knowledgeId));
  const scored = scoreChunks(queryEmbedding, filteredChunks).slice(0, 8);
  return scored.map((chunk) => {
    const knowledge = filteredKnowledge.find((item) => item.id === chunk.knowledgeId);
    return {
      score: chunk.score,
      chunk,
      knowledge
    };
  });
}

export async function getKnowledgeSummary() {
  const knowledge = await listKnowledge();
  return {
    knowledgeCount: knowledge.length,
    chunkCount: (await getChunksCount()),
    domains: Array.from(new Set(knowledge.map((item) => item.domain))).sort()
  };
}

async function getChunksCount() {
  const repositories = selectRepositories();
  return (await repositories.chunks.listAllChunks()).length;
}

export async function exportJsonStore() {
  return readJsonStore();
}

export { MEMORY_BACKEND, VECTOR_STORE_BACKEND };
export { createEmbeddingProviderSelection };
