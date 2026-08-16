import type { KnowledgeChunk, KnowledgeRecord } from "./types";

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    const av = a[i] || 0;
    const bv = b[i] || 0;
    dot += av * bv;
    normA += av * av;
    normB += bv * bv;
  }
  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function scoreChunks(queryEmbedding: number[], chunks: KnowledgeChunk[]) {
  return chunks
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding)
    }))
    .sort((left, right) => right.score - left.score);
}

export function buildKnowledgeView(record: KnowledgeRecord, matchedChunks: KnowledgeChunk[]) {
  return {
    id: record.id,
    title: record.title,
    content: record.content,
    domain: record.domain,
    category: record.category,
    entityType: record.entityType,
    entityId: record.entityId,
    source: record.source,
    sourceType: record.sourceType,
    sourceUri: record.sourceUri,
    author: record.author,
    owner: record.owner,
    version: record.version,
    status: record.status,
    confidence: record.confidence,
    tags: record.tags,
    permissions: record.permissions,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    provenance: record.provenance,
    versions: record.versions,
    matches: matchedChunks
  };
}

