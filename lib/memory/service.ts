import { randomUUID, createHash } from "node:crypto";
import { resolve } from "node:path";
import { cleanText, chunkText, parseSourceFile } from "./parser";
import { DeterministicEmbeddingProvider } from "./embeddings";
import { readStore, writeStore, nextVersion } from "./store";
import { buildKnowledgeView, scoreChunks } from "./retrieval";
import type { KnowledgeChunk, KnowledgeRecord, KnowledgeSource } from "./types";

const embeddingProvider = new DeterministicEmbeddingProvider();

function checksum(content: string) {
  return createHash("sha256").update(content).digest("hex");
}

function tokenCount(text: string) {
  return text.split(/\s+/).filter(Boolean).length;
}

function defaultMetadata(source: KnowledgeSource) {
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

export async function ingestKnowledgeFromFile(input: KnowledgeSource & { filePath: string }) {
  const { filePath, ...source } = input;
  const parsed = await parseSourceFile(resolve(filePath));
  const content = cleanText(parsed.text);
  const store = await readStore();
  const sourceChecksum = checksum(content);
  const existing = store.knowledge.find((item) => item.sourceUri === source.sourceUri);
  const version = existing ? nextVersion(existing.version) : source.version;
  const knowledgeId = existing?.id ?? randomUUID();
  const chunks = chunkText(content).map(async (chunk, index) => {
    const embedding = await embeddingProvider.embed(chunk);
    return {
      id: randomUUID(),
      knowledgeId,
      version,
      content: chunk,
      index,
      tokenCount: tokenCount(chunk),
      embedding,
      sourceUri: source.sourceUri,
      provenance: {
        parser: parsed.parser,
        checksum: sourceChecksum
      }
    } satisfies KnowledgeChunk;
  });

  const chunkRecords = await Promise.all(chunks);
  const combinedEmbedding = await embeddingProvider.embed(content);
  const metadata = defaultMetadata(source);
  const createdAt = new Date().toISOString();
  const record: KnowledgeRecord = {
    id: knowledgeId,
    title: source.title,
    content,
    domain: metadata.domain,
    category: metadata.category,
    entityType: metadata.entityType,
    entityId: metadata.entityId,
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
    versions: [
      ...(existing?.versions ?? []),
      {
        id: randomUUID(),
        version,
        content,
        checksum: sourceChecksum,
        sourceUri: source.sourceUri,
        createdAt
      }
    ],
    embedding: combinedEmbedding
  };

  store.knowledge = store.knowledge.filter((item) => item.id !== knowledgeId);
  store.knowledge.push(record);
  store.chunks = store.chunks.filter((item) => item.knowledgeId !== knowledgeId);
  store.chunks.push(...chunkRecords);
  await writeStore(store);

  return buildKnowledgeView(record, chunkRecords);
}

export async function listKnowledge() {
  const store = await readStore();
  return store.knowledge;
}

export async function getKnowledgeById(id: string) {
  const store = await readStore();
  return store.knowledge.find((item) => item.id === id) ?? null;
}

export async function getKnowledgeVersions(id: string) {
  const item = await getKnowledgeById(id);
  return item?.versions ?? [];
}

export async function getProvenance(id: string) {
  const store = await readStore();
  const record = store.knowledge.find((item) => item.id === id);
  if (!record) return null;

  const chunks = store.chunks.filter((chunk) => chunk.knowledgeId === id);
  return {
    knowledge: record,
    chunks
  };
}

export async function searchKnowledge(query: string, filters?: { domain?: string; entityId?: string }) {
  const store = await readStore();
  const embedding = await embeddingProvider.embed(query);
  const filteredKnowledge = store.knowledge.filter((item) => {
    if (filters?.domain && item.domain !== filters.domain) return false;
    if (filters?.entityId && item.entityId !== filters.entityId) return false;
    return true;
  });
  const filteredChunks = store.chunks.filter((chunk) => filteredKnowledge.some((item) => item.id === chunk.knowledgeId));
  const scored = scoreChunks(embedding, filteredChunks).slice(0, 8);
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
  const store = await readStore();
  return {
    knowledgeCount: store.knowledge.length,
    chunkCount: store.chunks.length,
    domains: Array.from(new Set(store.knowledge.map((item) => item.domain))).sort()
  };
}

