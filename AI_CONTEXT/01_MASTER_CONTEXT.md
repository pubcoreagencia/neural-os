# 01_MASTER_CONTEXT — CONSOLIDATED CONTEXT

Este documento consolida o contexto institucional e técnico do PUB Neural sem substituir `docs/PUB_MASTER_CONTEXT.md`.

Resumo institucional:

- A PUB Neural é a camada de memória e contexto da PUB Holding.
- O foco é preservar conhecimento institucional, relacionamento entre entidades, provenance e governança.
- O domínio é proprietário; a infraestrutura é substituível.

Resumo técnico:

- Experience Layer: Next.js e superfície institucional.
- Application Layer: orquestração, mapping e composição de contexto.
- Domain Layer: modelo da Holding, Repository Context, confidence, relationships, governança.
- Memory Layer: ingestão, parser, chunking, embeddings, retrieval, versioning e adapters.

Conceitos congelados:

- `chunks.embedding` é a única fonte vetorial operacional.
- `KnowledgeRecord` não carrega embedding próprio.
- PostgreSQL ainda não está conectado em ambiente real.
- Embeddings reais ainda não estão conectados.
- JSON storage continua como DEVELOPMENT / MVP.

Documentos de referência:

- `docs/PUB_MASTER_CONTEXT.md`
- `docs/architecture/holding-context-model.md`
- `docs/architecture/production-memory.md`
- `docs/architecture/memory-engine.md`
- `docs/memory/setup.md`
- `docs/audits/PUB_NEURAL_PHASE2_AUDIT.md`
- `docs/audits/PUB_DEV_LOOP_READINESS_MATRIX.md`

Este pacote de handoff deve ser suficiente para retomar o projeto sem depender desta conversa.

