import type { RepositoryContext } from "@/lib/domain";
import type { KnowledgeRecord, KnowledgeChunk } from "@/lib/memory/entities";

export interface RepositoryContextSource {
  repositoryId: string;
  repository?: RepositoryContext["repository"];
  project?: RepositoryContext["project"];
  product?: RepositoryContext["product"];
  company?: RepositoryContext["company"];
  architecture?: string;
  documentation?: RepositoryContext["documentation"];
  currentState?: RepositoryContext["currentState"];
  devLoopReadiness?: RepositoryContext["devLoopReadiness"];
  relevantKnowledge?: Array<{ record: KnowledgeRecord; chunks: KnowledgeChunk[] }>;
  relevantDecisions?: RepositoryContext["relevantDecisions"];
  relevantTasks?: RepositoryContext["relevantTasks"];
}

export function toRepositoryContext(input: RepositoryContextSource): RepositoryContext {
  return {
    repository: input.repository,
    project: input.project,
    product: input.product,
    company: input.company,
    architecture: input.architecture,
    documentation: input.documentation,
    currentState: input.currentState,
    devLoopReadiness: input.devLoopReadiness,
    relevantKnowledge: input.relevantKnowledge?.map(({ record, chunks }) => ({
      id: record.id,
      slug: record.entityId,
      name: record.title,
      kind: "KnowledgeItem",
      status: "UNKNOWN",
      confidence: "DERIVED",
      knowledgeId: record.id,
      chunkIds: chunks.map((chunk) => chunk.id),
      source: {
        sourceType: record.sourceType,
        sourceId: record.sourceId ?? record.id,
        sourceUri: record.sourceUri,
        version: record.version,
        confidence: "DERIVED"
      }
    })),
    relevantDecisions: input.relevantDecisions,
    relevantTasks: input.relevantTasks
  };
}

