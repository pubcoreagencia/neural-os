# 05_MEMORY_ENGINE — MEMORY ENGINE STATUS

O Memory Engine é a camada responsável por transformar documentos em conhecimento recuperável.

## Pipeline atual

Markdown / PDF / texto
→ Parser
→ Cleaner
→ Chunker
→ Embedding provider
→ Storage
→ Search
→ Provenance

## Componentes reais

- `lib/memory/parser.ts`
- `lib/memory/service.ts`
- `lib/memory/retrieval.ts`
- `lib/memory/chunker` logic within service/parser flow
- `lib/memory/json-adapter.ts`
- `lib/memory/repositories.ts`
- `lib/memory/vector-store.ts`
- `lib/memory/embedding-providers.ts`

## O que está funcionando agora

- ingestão de conteúdo
- limpeza de texto
- chunking
- embeddings determinísticos em dev/test
- persistência via JSON adapter
- persistência preparada em PostgreSQL
- retrieval baseado em chunks
- provenance por knowledge/chunk
- versioning do knowledge

## O que ainda é preparo

- PostgreSQL real
- provider real de embeddings
- validação de migração JSON → PostgreSQL em banco real

## Regra de arquitetura

O Memory Engine não deve se tornar o domínio.
Ele é infraestrutura aplicada ao contexto institucional da PUB Neural.

