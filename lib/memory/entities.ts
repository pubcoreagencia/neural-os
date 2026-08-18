export type KnowledgeVisibility = "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "RESTRICTED";

export type KnowledgeDomain =
  | "Holding"
  | "Company"
  | "Brand"
  | "Product"
  | "Service"
  | "Project"
  | "Customer"
  | "Person"
  | "Agent"
  | "Workflow"
  | "Tool"
  | "Document"
  | "Repository"
  | "Campaign"
  | "Decision"
  | "Process"
  | "Knowledge"
  | "Other";

export type KnowledgeStatus = "draft" | "active" | "validated" | "archived";
export type SourceType =
  | "markdown"
  | "pdf"
  | "text"
  | "document"
  | "github"
  | "database"
  | "crm"
  | "erp"
  | "api"
  | "meeting"
  | "email"
  | "whatsapp"
  | "social"
  | "agent"
  | "workflow"
  | "system";
export type EntityType = KnowledgeDomain;
export type RelationshipType =
  | "owns"
  | "has"
  | "belongs_to"
  | "contains"
  | "uses"
  | "executes"
  | "supports"
  | "generates"
  | "converts_to"
  | "relates_to";
export type AuditAction =
  | "ingest"
  | "create"
  | "update"
  | "version"
  | "delete"
  | "retrieval"
  | "permission_change"
  | "source_sync"
  | "embedding"
  | "indexing"
  | "migration";

export interface KnowledgeSourceInput {
  sourceType: SourceType;
  sourceUri: string;
  title: string;
  version: string;
  author?: string;
  owner?: string;
  visibility?: KnowledgeVisibility;
  entityType?: EntityType | string;
  entityId?: string;
  domain?: string;
  category?: string;
  tags?: string[];
  permissions?: string[];
}

export interface KnowledgeVersion {
  id: string;
  knowledgeId: string;
  version: string;
  content: string;
  checksum: string;
  sourceUri: string;
  createdAt: string;
}

export interface KnowledgeRecord {
  id: string;
  title: string;
  content: string;
  domain: string;
  category: string;
  entityType: EntityType | string;
  entityId: string;
  sourceId?: string;
  source: string;
  sourceType: SourceType;
  sourceUri: string;
  author: string;
  owner: string;
  version: string;
  status: KnowledgeStatus;
  confidence: number;
  tags: string[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  provenance: {
    parser: string;
    checksum: string;
    chunkCount: number;
    chunkIds: string[];
  };
  versions: KnowledgeVersion[];
}

export interface KnowledgeChunk {
  id: string;
  knowledgeId: string;
  version: string;
  content: string;
  index: number;
  tokenCount: number;
  embedding: number[];
  sourceId?: string;
  sourceUri: string;
  provenance: {
    parser: string;
    checksum: string;
    page?: number | null;
    section?: string | null;
    heading?: string | null;
    offset?: number | null;
  };
}

export interface SourceRecord {
  id: string;
  sourceType: SourceType;
  uri: string;
  title: string;
  version: string;
  visibility: KnowledgeVisibility;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
}

export interface EntityRecord {
  id: string;
  type: EntityType | string;
  name: string;
  domain: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface RelationshipRecord {
  id: string;
  fromEntityId: string;
  toEntityId: string;
  type: RelationshipType;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface PermissionRecord {
  id: string;
  resourceType: string;
  resourceId: string;
  visibility: KnowledgeVisibility;
  principalType: "user" | "company" | "domain" | "agent" | "resource";
  principalId: string;
  createdAt: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  actor: string;
  action: AuditAction;
  resource: string;
  resourceId: string;
  metadata: Record<string, unknown>;
}

export interface KnowledgeStoreData {
  knowledge: KnowledgeRecord[];
  chunks: KnowledgeChunk[];
}
