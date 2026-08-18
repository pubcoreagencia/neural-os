import { hasPostgres, withClient } from "./db";

export interface VectorRecord {
  id: string;
  knowledgeId: string;
  chunkId: string;
  embedding: number[];
  metadata: Record<string, unknown>;
}

export interface VectorSearchResult {
  id: string;
  knowledgeId: string;
  chunkId: string;
  score: number;
  metadata: Record<string, unknown>;
}

type VectorQueryRow = {
  id: string;
  knowledge_id: string;
  chunk_id: string;
  metadata: Record<string, unknown> | null;
  score: string | number;
};

export interface VectorStore {
  upsert(records: VectorRecord[]): Promise<void>;
  search(query: number[], limit: number, filters?: Record<string, unknown>): Promise<VectorSearchResult[]>;
  delete(ids: string[]): Promise<void>;
  update(records: VectorRecord[]): Promise<void>;
}

export class PgVectorStore implements VectorStore {
  async upsert(records: VectorRecord[]) {
    if (!hasPostgres() || records.length === 0) return;
    await withClient(async (client) => {
      for (const record of records) {
        await client.query(
          `update chunks
           set embedding = $2,
               provenance = jsonb_set(coalesce(provenance, '{}'::jsonb), '{vectorMetadata}', $3::jsonb, true)
           where id = $1`,
          [record.chunkId, record.embedding, JSON.stringify(record.metadata)]
        );
      }
    });
  }

  async search(query: number[], limit: number) {
    if (!hasPostgres()) return [];
    return withClient(async (client) => {
      const result = await client.query(
        `select id, knowledge_id, id as chunk_id, provenance as metadata,
                1 - (embedding <=> $1::vector) as score
         from chunks
         order by embedding <=> $1::vector
         limit $2`,
        [`[${query.join(",")}]`, limit]
      );
      return result.rows.map((row: VectorQueryRow) => ({
        id: row.id,
        knowledgeId: row.knowledge_id,
        chunkId: row.chunk_id,
        score: Number(row.score),
        metadata: row.metadata ?? {}
      }));
    });
  }

  async delete(ids: string[]) {
    if (!hasPostgres() || ids.length === 0) return;
    await withClient(async (client) => {
      await client.query(`delete from chunks where id = any($1::uuid[])`, [ids]);
    });
  }

  async update(records: VectorRecord[]) {
    await this.upsert(records);
  }
}

export function createVectorStore(): VectorStore {
  return new PgVectorStore();
}
