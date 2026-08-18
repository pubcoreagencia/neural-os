export type DomainConfidence = "CONFIRMED" | "INFERRED" | "DERIVED" | "UNKNOWN" | "STALE";

export type DomainStatus = "ACTIVE" | "IN_DEVELOPMENT" | "MAINTENANCE" | "PAUSED" | "ARCHIVED" | "UNKNOWN";

export type DevLoopReadiness = "READY" | "READY_WITH_MINOR_FIXES" | "NEEDS_HARDENING" | "BLOCKED" | "UNKNOWN";

export type DomainKind =
  | "Holding"
  | "Company"
  | "Brand"
  | "Product"
  | "Project"
  | "Repository"
  | "Document"
  | "KnowledgeItem"
  | "Agent"
  | "Operator"
  | "Workflow"
  | "Decision"
  | "Task";

export interface SourceReference {
  sourceType: "markdown" | "pdf" | "text" | "document" | "github" | "database" | "crm" | "erp" | "api" | "meeting" | "email" | "whatsapp" | "social" | "agent" | "workflow" | "system";
  sourceId: string;
  sourceUri: string;
  version?: string;
  confidence: DomainConfidence;
}

export interface DomainBase {
  id: string;
  slug: string;
  name: string;
  kind: DomainKind;
  status: DomainStatus;
  confidence: DomainConfidence;
  source?: SourceReference;
  createdAt?: string;
  updatedAt?: string;
}

export interface Holding extends DomainBase {
  kind: "Holding";
}

export interface Company extends DomainBase {
  kind: "Company";
  holdingId?: string;
}

export interface Brand extends DomainBase {
  kind: "Brand";
  companyId?: string;
  holdingId?: string;
}

export interface Product extends DomainBase {
  kind: "Product";
  brandId?: string;
  companyId?: string;
  projectId?: string;
}

export interface Project extends DomainBase {
  kind: "Project";
  companyId?: string;
  productId?: string;
}

export interface Repository extends DomainBase {
  kind: "Repository";
  url?: string;
  provider?: string;
  organization?: string;
  defaultBranch?: string;
  language?: string;
  framework?: string;
  description?: string;
  projectId?: string;
  productId?: string;
  companyId?: string;
  visibility?: "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "RESTRICTED";
  archived?: boolean;
  lastAudit?: string;
  readiness?: DomainStatus;
  devLoopReadiness?: DevLoopReadiness;
  documentationStatus?: DomainStatus;
  buildStatus?: DomainStatus;
  testStatus?: DomainStatus;
  securityStatus?: DomainStatus;
}

export interface Document extends DomainBase {
  kind: "Document";
  repositoryId?: string;
  projectId?: string;
  source?: SourceReference;
}

export interface KnowledgeItem extends DomainBase {
  kind: "KnowledgeItem";
  documentId?: string;
  chunkIds?: string[];
  knowledgeId?: string;
  source?: SourceReference;
}

export interface Decision extends DomainBase {
  kind: "Decision";
  projectId?: string;
  documentId?: string;
}

export interface Agent extends DomainBase {
  kind: "Agent";
  projectId?: string;
}

export interface Operator extends DomainBase {
  kind: "Operator";
  companyId?: string;
}

export interface Workflow extends DomainBase {
  kind: "Workflow";
  repositoryId?: string;
  projectId?: string;
}

export interface Task extends DomainBase {
  kind: "Task";
  repositoryId?: string;
  projectId?: string;
}

export interface DomainRelationship {
  id: string;
  sourceEntityId: string;
  relationshipType: string;
  targetEntityId: string;
  provenance?: SourceReference;
  confidence: DomainConfidence;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface RepositoryContext {
  repository?: Repository;
  project?: Project;
  product?: Product;
  company?: Company;
  architecture?: string;
  documentation?: Document[];
  currentState?: DomainStatus;
  devLoopReadiness?: DevLoopReadiness;
  relevantKnowledge?: KnowledgeItem[];
  relevantDecisions?: Decision[];
  relevantTasks?: Task[];
}

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createDomainIdentity(name: string, kind: DomainKind, slug?: string) {
  const normalized = slug?.trim() || normalizeSlug(name);
  return {
    id: `${kind.toLowerCase()}:${normalized}`,
    slug: normalized,
    name,
    kind
  } as const;
}

export function isValidConfidence(value: string): value is DomainConfidence {
  return ["CONFIRMED", "INFERRED", "DERIVED", "UNKNOWN", "STALE"].includes(value);
}

export function isValidDevLoopReadiness(value: string): value is DevLoopReadiness {
  return ["READY", "READY_WITH_MINOR_FIXES", "NEEDS_HARDENING", "BLOCKED", "UNKNOWN"].includes(value);
}

export function isValidDomainStatus(value: string): value is DomainStatus {
  return ["ACTIVE", "IN_DEVELOPMENT", "MAINTENANCE", "PAUSED", "ARCHIVED", "UNKNOWN"].includes(value);
}
