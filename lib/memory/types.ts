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

export interface KnowledgeSource {
  sourceType: "markdown" | "pdf" | "text";
  sourceUri: string;
  title: string;
  version: string;
  author?: string;
  owner?: string;
  visibility?: KnowledgeVisibility;
  entityType?: KnowledgeDomain | string;
  entityId?: string;
  domain?: string;
  category?: string;
  tags?: string[];
  permissions?: string[];
}

export interface KnowledgeVersion {
  id: string;
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
  entityType: KnowledgeDomain | string;
  entityId: string;
  source: string;
  sourceType: KnowledgeSource["sourceType"];
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
  embedding?: number[];
}

export interface KnowledgeChunk {
  id: string;
  knowledgeId: string;
  version: string;
  content: string;
  index: number;
  tokenCount: number;
  embedding: number[];
  sourceUri: string;
  provenance: {
    parser: string;
    checksum: string;
  };
}

export interface KnowledgeStoreData {
  knowledge: KnowledgeRecord[];
  chunks: KnowledgeChunk[];
}
