import { randomUUID } from "node:crypto";
import { hasPostgres, withClient } from "./db";
import type {
  AuditRecord,
  EntityRecord,
  KnowledgeChunk,
  KnowledgeRecord,
  KnowledgeVersion,
  PermissionRecord,
  RelationshipRecord,
  SourceRecord
} from "./entities";
import type { JsonStoreData } from "./json-adapter";

export interface KnowledgeRepository {
  upsertKnowledge(record: KnowledgeRecord): Promise<void>;
  getKnowledge(id: string): Promise<KnowledgeRecord | null>;
  getKnowledgeById(id: string): Promise<KnowledgeRecord | null>;
  getKnowledgeBySourceUri(sourceUri: string): Promise<KnowledgeRecord | null>;
  listKnowledge(): Promise<KnowledgeRecord[]>;
  listKnowledgeVersions(id: string): Promise<KnowledgeVersion[]>;
}

export interface ChunkRepository {
  replaceChunks(knowledgeId: string, chunks: KnowledgeChunk[]): Promise<void>;
  listChunksByKnowledge(knowledgeId: string): Promise<KnowledgeChunk[]>;
  listAllChunks(): Promise<KnowledgeChunk[]>;
}

export interface SourceRepository {
  upsertSource(source: SourceRecord): Promise<void>;
  getSourceByUri(uri: string): Promise<SourceRecord | null>;
}

export interface PermissionRepository {
  upsertPermissions(records: PermissionRecord[]): Promise<void>;
  listByResource(resourceType: string, resourceId: string): Promise<PermissionRecord[]>;
}

export interface AuditRepository {
  append(record: AuditRecord): Promise<void>;
  listRecent(limit?: number): Promise<AuditRecord[]>;
}

export interface EntityRepository {
  upsertEntity(entity: EntityRecord): Promise<void>;
  upsertRelationship(relationship: RelationshipRecord): Promise<void>;
}

export interface RepositoryBundle {
  knowledge: KnowledgeRepository;
  chunks: ChunkRepository;
  sources: SourceRepository;
  permissions: PermissionRepository;
  audit: AuditRepository;
  entities: EntityRepository;
}

class JsonKnowledgeRepository implements KnowledgeRepository {
  constructor(private readonly readStore: () => Promise<JsonStoreData>, private readonly writeStore: (data: JsonStoreData) => Promise<void>) {}
  async upsertKnowledge(record: KnowledgeRecord) {
    const store = await this.readStore();
    store.knowledge = store.knowledge.filter((item: KnowledgeRecord) => item.id !== record.id);
    store.knowledge.push(record);
    await this.writeStore(store);
  }
  async getKnowledge(id: string) {
    const store = await this.readStore();
    return store.knowledge.find((item: KnowledgeRecord) => item.id === id) ?? null;
  }
  async getKnowledgeById(id: string) {
    return this.getKnowledge(id);
  }
  async getKnowledgeBySourceUri(sourceUri: string) {
    const store = await this.readStore();
    return store.knowledge.find((item: KnowledgeRecord) => item.sourceUri === sourceUri) ?? null;
  }
  async listKnowledge() {
    const store = await this.readStore();
    return store.knowledge;
  }
  async listKnowledgeVersions(id: string) {
    const knowledge = await this.getKnowledge(id);
    return knowledge?.versions ?? [];
  }
}

class JsonChunkRepository implements ChunkRepository {
  constructor(private readonly readStore: () => Promise<JsonStoreData>, private readonly writeStore: (data: JsonStoreData) => Promise<void>) {}
  async replaceChunks(knowledgeId: string, chunks: KnowledgeChunk[]) {
    const store = await this.readStore();
    store.chunks = store.chunks.filter((item: KnowledgeChunk) => item.knowledgeId !== knowledgeId);
    store.chunks.push(...chunks);
    await this.writeStore(store);
  }
  async listChunksByKnowledge(knowledgeId: string) {
    const store = await this.readStore();
    return store.chunks.filter((item: KnowledgeChunk) => item.knowledgeId === knowledgeId);
  }
  async listAllChunks() {
    const store = await this.readStore();
    return store.chunks;
  }
}

class JsonSourceRepository implements SourceRepository {
  constructor(private readonly readStore: () => Promise<JsonStoreData>, private readonly writeStore: (data: JsonStoreData) => Promise<void>) {}
  async upsertSource(source: SourceRecord) {
    const store = await this.readStore();
    store.sources = store.sources ?? [];
    store.sources = store.sources.filter((item: SourceRecord) => item.id !== source.id);
    store.sources.push(source);
    await this.writeStore(store);
  }
  async getSourceByUri(uri: string) {
    const store = await this.readStore();
    return store.sources?.find((item: SourceRecord) => item.uri === uri) ?? null;
  }
}

class JsonPermissionRepository implements PermissionRepository {
  constructor(private readonly readStore: () => Promise<JsonStoreData>, private readonly writeStore: (data: JsonStoreData) => Promise<void>) {}
  async upsertPermissions(records: PermissionRecord[]) {
    const store = await this.readStore();
    store.permissions = store.permissions ?? [];
    store.permissions.push(...records);
    await this.writeStore(store);
  }
  async listByResource(resourceType: string, resourceId: string) {
    const store = await this.readStore();
    return (store.permissions ?? []).filter(
      (item: PermissionRecord) => item.resourceType === resourceType && item.resourceId === resourceId
    );
  }
}

class JsonAuditRepository implements AuditRepository {
  constructor(private readonly readStore: () => Promise<JsonStoreData>, private readonly writeStore: (data: JsonStoreData) => Promise<void>) {}
  async append(record: AuditRecord) {
    const store = await this.readStore();
    store.audit = store.audit ?? [];
    store.audit.push(record);
    await this.writeStore(store);
  }
  async listRecent(limit = 50) {
    const store = await this.readStore();
    return (store.audit ?? []).slice(-limit);
  }
}

class JsonEntityRepository implements EntityRepository {
  constructor(private readonly readStore: () => Promise<JsonStoreData>, private readonly writeStore: (data: JsonStoreData) => Promise<void>) {}
  async upsertEntity(entity: EntityRecord) {
    const store = await this.readStore();
    store.entities = store.entities ?? [];
    store.entities = store.entities.filter((item: EntityRecord) => item.id !== entity.id);
    store.entities.push(entity);
    await this.writeStore(store);
  }
  async upsertRelationship(relationship: RelationshipRecord) {
    const store = await this.readStore();
    store.relationships = store.relationships ?? [];
    store.relationships.push(relationship);
    await this.writeStore(store);
  }
}

class PgKnowledgeRepository implements KnowledgeRepository {
  async upsertKnowledge(record: KnowledgeRecord) {
    if (!hasPostgres()) return;
    await withClient(async (client) => {
      await client.query(
        `insert into knowledge (id, title, content, domain, category, entity_type, entity_id, source_id, source_type, source_uri, author, owner, version, status, confidence, tags, permissions, created_at, updated_at, provenance)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
         on conflict (id) do update set
           title = excluded.title,
           content = excluded.content,
           domain = excluded.domain,
           category = excluded.category,
           entity_type = excluded.entity_type,
           entity_id = excluded.entity_id,
           source_id = excluded.source_id,
           source_type = excluded.source_type,
           source_uri = excluded.source_uri,
           author = excluded.author,
           owner = excluded.owner,
           version = excluded.version,
           status = excluded.status,
           confidence = excluded.confidence,
           tags = excluded.tags,
           permissions = excluded.permissions,
           updated_at = excluded.updated_at,
           provenance = excluded.provenance`,
        [
          record.id,
          record.title,
          record.content,
          record.domain,
          record.category,
          record.entityType,
          record.entityId,
          record.sourceId ?? null,
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
    });
  }
  async getKnowledge(id: string) {
    if (!hasPostgres()) return null;
    return withClient(async (client) => {
      const result = await client.query(`select * from knowledge where id = $1`, [id]);
      return result.rows[0] ?? null;
    });
  }
  async getKnowledgeById(id: string) {
    return this.getKnowledge(id);
  }
  async getKnowledgeBySourceUri(sourceUri: string) {
    if (!hasPostgres()) return null;
    return withClient(async (client) => {
      const result = await client.query(`select * from knowledge where source_uri = $1 limit 1`, [sourceUri]);
      return result.rows[0] ?? null;
    });
  }
  async listKnowledge() {
    if (!hasPostgres()) return [];
    return withClient(async (client) => {
      const result = await client.query(`select * from knowledge order by updated_at desc`);
      return result.rows;
    });
  }
  async listKnowledgeVersions(id: string) {
    if (!hasPostgres()) return [];
    return withClient(async (client) => {
      const result = await client.query(`select * from knowledge_versions where knowledge_id = $1 order by created_at asc`, [id]);
      return result.rows;
    });
  }
}

class PgChunkRepository implements ChunkRepository {
  async replaceChunks(knowledgeId: string, chunks: KnowledgeChunk[]) {
    if (!hasPostgres()) return;
    await withClient(async (client) => {
      await client.query(`delete from chunks where knowledge_id = $1`, [knowledgeId]);
      for (const chunk of chunks) {
        await client.query(
          `insert into chunks (id, knowledge_id, version, content, chunk_index, token_count, embedding, source_id, source_uri, provenance, created_at)
           values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,now())`,
          [
            chunk.id,
            chunk.knowledgeId,
            chunk.version,
            chunk.content,
            chunk.index,
            chunk.tokenCount,
            chunk.embedding,
            chunk.sourceId ?? null,
            chunk.sourceUri,
            chunk.provenance
          ]
        );
      }
    });
  }
  async listChunksByKnowledge(knowledgeId: string) {
    if (!hasPostgres()) return [];
    return withClient(async (client) => {
      const result = await client.query(`select * from chunks where knowledge_id = $1 order by chunk_index asc`, [knowledgeId]);
      return result.rows;
    });
  }
  async listAllChunks() {
    if (!hasPostgres()) return [];
    return withClient(async (client) => {
      const result = await client.query(`select * from chunks order by created_at desc`);
      return result.rows;
    });
  }
}

class PgSourceRepository implements SourceRepository {
  async upsertSource(source: SourceRecord) {
    if (!hasPostgres()) return;
    await withClient(async (client) => {
      await client.query(
        `insert into sources (id, source_type, uri, title, version, visibility, metadata, created_at, updated_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         on conflict (id) do update set
           source_type = excluded.source_type,
           uri = excluded.uri,
           title = excluded.title,
           version = excluded.version,
           visibility = excluded.visibility,
           metadata = excluded.metadata,
           updated_at = excluded.updated_at`,
        [source.id, source.sourceType, source.uri, source.title, source.version, source.visibility, source.metadata, source.createdAt, source.updatedAt]
      );
    });
  }
  async getSourceByUri(uri: string) {
    if (!hasPostgres()) return null;
    return withClient(async (client) => {
      const result = await client.query(`select * from sources where uri = $1`, [uri]);
      return result.rows[0] ?? null;
    });
  }
}

class PgPermissionRepository implements PermissionRepository {
  async upsertPermissions(records: PermissionRecord[]) {
    if (!hasPostgres()) return;
    await withClient(async (client) => {
      for (const record of records) {
        await client.query(
          `insert into permissions (id, resource_type, resource_id, visibility, principal_type, principal_id, created_at)
           values ($1,$2,$3,$4,$5,$6,$7)
           on conflict (id) do nothing`,
          [record.id, record.resourceType, record.resourceId, record.visibility, record.principalType, record.principalId, record.createdAt]
        );
      }
    });
  }
  async listByResource(resourceType: string, resourceId: string) {
    if (!hasPostgres()) return [];
    return withClient(async (client) => {
      const result = await client.query(`select * from permissions where resource_type = $1 and resource_id = $2`, [resourceType, resourceId]);
      return result.rows;
    });
  }
}

class PgAuditRepository implements AuditRepository {
  async append(record: AuditRecord) {
    if (!hasPostgres()) return;
    await withClient(async (client) => {
      await client.query(
        `insert into audit_logs (id, timestamp, actor, action, resource, resource_id, metadata)
         values ($1,$2,$3,$4,$5,$6,$7)`,
        [record.id, record.timestamp, record.actor, record.action, record.resource, record.resourceId, record.metadata]
      );
    });
  }
  async listRecent(limit = 50) {
    if (!hasPostgres()) return [];
    return withClient(async (client) => {
      const result = await client.query(`select * from audit_logs order by timestamp desc limit $1`, [limit]);
      return result.rows;
    });
  }
}

class PgEntityRepository implements EntityRepository {
  async upsertEntity(entity: EntityRecord) {
    if (!hasPostgres()) return;
    await withClient(async (client) => {
      await client.query(
        `insert into entities (id, type, name, domain, metadata, created_at, updated_at)
         values ($1,$2,$3,$4,$5,$6,$7)
         on conflict (id) do update set
           type = excluded.type,
           name = excluded.name,
           domain = excluded.domain,
           metadata = excluded.metadata,
           updated_at = excluded.updated_at`,
        [entity.id, entity.type, entity.name, entity.domain, entity.metadata, entity.createdAt, entity.updatedAt]
      );
    });
  }
  async upsertRelationship(relationship: RelationshipRecord) {
    if (!hasPostgres()) return;
    await withClient(async (client) => {
      await client.query(
        `insert into relationships (id, from_entity_id, to_entity_id, type, metadata, created_at)
         values ($1,$2,$3,$4,$5,$6)
         on conflict (id) do update set
           from_entity_id = excluded.from_entity_id,
           to_entity_id = excluded.to_entity_id,
           type = excluded.type,
           metadata = excluded.metadata`,
        [relationship.id, relationship.fromEntityId, relationship.toEntityId, relationship.type, relationship.metadata, relationship.createdAt]
      );
    });
  }
}

export function createJsonRepositories(
  readStore: () => Promise<JsonStoreData>,
  writeStore: (data: JsonStoreData) => Promise<void>
): RepositoryBundle {
  return {
    knowledge: new JsonKnowledgeRepository(readStore, writeStore),
    chunks: new JsonChunkRepository(readStore, writeStore),
    sources: new JsonSourceRepository(readStore, writeStore),
    permissions: new JsonPermissionRepository(readStore, writeStore),
    audit: new JsonAuditRepository(readStore, writeStore),
    entities: new JsonEntityRepository(readStore, writeStore)
  };
}

export function createPgRepositories(): RepositoryBundle {
  return {
    knowledge: new PgKnowledgeRepository(),
    chunks: new PgChunkRepository(),
    sources: new PgSourceRepository(),
    permissions: new PgPermissionRepository(),
    audit: new PgAuditRepository(),
    entities: new PgEntityRepository()
  };
}

export function createSeedRecordId() {
  return randomUUID();
}
