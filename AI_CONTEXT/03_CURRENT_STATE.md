# 03_CURRENT_STATE — REAL CODEBASE STATUS

Estado real atual do repositório:

## Experience Layer

- Next.js está ativo.
- A landing institucional permanece no projeto.
- As rotas internas de knowledge estão expostas.

## Domain

Arquivo principal:

- `lib/domain/contracts.ts`

Status:

- separado de `lib/memory`
- contém `Holding`, `Company`, `Brand`, `Product`, `Project`, `Repository`, `Document`, `KnowledgeItem`, `Decision`, `Task`, `Agent`, `Operator`, `Workflow`
- contém `RepositoryContext`
- contém utilitários de identity e validação

## Application

Arquivo principal:

- `lib/application/repository-context.ts`

Status:

- faz mapping entre `KnowledgeRecord`/`KnowledgeChunk` e `RepositoryContext`
- ainda é um esqueleto funcional, não o contrato final completo

## Memory Layer

Arquivos principais:

- `lib/memory/service.ts`
- `lib/memory/entities.ts`
- `lib/memory/repositories.ts`
- `lib/memory/vector-store.ts`
- `lib/memory/sql.ts`
- `lib/memory/migrations.ts`
- `lib/memory/embedding-providers.ts`
- `lib/memory/json-adapter.ts`
- `lib/memory/db.ts`

Status:

- ingestão, parser, chunking, retrieval, provenance e versioning estão funcionais no nível atual
- JSON storage existe como adapter de desenvolvimento/MVP
- PostgreSQL está preparado em código, mas não conectado em ambiente real
- vector store opera sobre `chunks`

## Tests

Status:

- existem testes de memória
- existem testes de contrato/arquitetura
- `npm run test`, `npm run typecheck`, `npm run lint` e `npm run build` passaram no estado auditado

## Divergências relevantes

- PostgreSQL preparado não significa PostgreSQL conectado
- Repository Context existe, mas ainda está incompleto frente ao contrato final
- documentação antiga ainda pode conter linguagem mais ampla do que o código atual

