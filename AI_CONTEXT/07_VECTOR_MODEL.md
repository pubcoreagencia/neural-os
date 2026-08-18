# 07_VECTOR_MODEL — FROZEN VECTOR MODEL

Decisão congelada:

`chunks.embedding`

## O que não existe mais como fonte operacional

- `knowledge.embedding`
- `knowledge_vectors`
- segunda fonte vetorial
- segundo vector store

## Estado real do código

- `lib/memory/vector-store.ts` opera sobre `chunks`
- `lib/memory/sql.ts` define `chunks.embedding vector(48) not null`
- `lib/memory/sql.ts` não define `knowledge_vectors`
- `lib/memory/entities.ts` não carrega embedding no `KnowledgeRecord`
- `lib/memory/postgres-validation.ts` valida o modelo operacional quando há banco real

## Parâmetros do modelo

- dimensão: 48
- tipo: `vector(48)`
- distância: cosine
- índice: `ivfflat`
- busca: por chunk

## Filtros

Filtros esperados na camada de aplicação/repositório:

- `knowledge_id`
- `source_uri`
- `version`
- metadata contextual do chunk

## Regra de sistema

O vector store serve ao chunk.
O knowledge é agregado canônico, não o vetor principal.
