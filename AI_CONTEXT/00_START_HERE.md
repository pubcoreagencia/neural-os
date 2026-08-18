# 00_START_HERE — PUB NEURAL HANDOFF ENTRYPOINT

Se você é uma nova IA assumindo este repositório, comece aqui.

Este repositório é a fonte portátil de continuidade do PUB Neural. Ele deve permitir que uma IA nova continue o trabalho sem depender do histórico desta conversa.

O PUB Neural é a base de conhecimento e contexto da PUB Holding. Ele combina:

- uma Experience Layer em Next.js
- uma Memory Layer para ingestão, chunking, embeddings, retrieval, provenance e versionamento
- uma camada de domínio própria para Holding / Repository Context / governança

O que ele é:

- um sistema de contexto institucional
- uma base de conhecimento versionada
- uma fundação para retrieval e futuro PostgreSQL + pgvector
- um projeto que preserva o domínio da Holding como núcleo proprietário

O que ele não é:

- um executor de Dev Loop
- um framework de agentes
- uma plataforma clone de RAGFlow / Onyx / Haystack / LlamaIndex
- um banco vetorial externo já conectado
- um projeto com PostgreSQL real em produção nesta fase

Arquitetura atual congelada:

Experience → Application → Domain

Application → Ports

Infrastructure → implements Ports

Infrastructure atual/alvo:

- PostgreSQL
- pgvector
- embedding provider externo via adapter

Decisões congeladas:

- `chunks.embedding` é a única fonte vetorial operacional
- `knowledge.embedding` não é mais fonte operacional
- `knowledge_vectors` não existe
- JSON storage é apenas DEVELOPMENT / MVP
- PostgreSQL + pgvector são a infraestrutura alvo
- Domain não depende de infraestrutura concreta
- PUB Neural contextualiza; não executa Dev Loop nesta fase

Status atual do gate:

- `POSTGRESQL GATE: NO`
- PostgreSQL está preparado em código, mas não validado em ambiente real
- embeddings reais ainda não estão conectados

Leia primeiro:

1. `AI_CONTEXT/00_PORTABILITY_POLICY.md`
2. `AI_CONTEXT/AI_CONTEXT_TEMPLATE.md`
3. `AI_CONTEXT/01_MASTER_CONTEXT.md`
4. `AI_CONTEXT/02_ARCHITECTURE_BASELINE.md`
5. `AI_CONTEXT/03_CURRENT_STATE.md`
6. `AI_CONTEXT/07_VECTOR_MODEL.md`
7. `AI_CONTEXT/08_EMBEDDING_CONTRACT.md`
8. `AI_CONTEXT/09_REPOSITORY_CONTEXT.md`
9. `AI_CONTEXT/12_PHASE_STATUS.md`
10. `AI_CONTEXT/13_OPEN_BLOCKERS.md`
11. `AI_CONTEXT/14_AI_HANDOFF.md`

Arquivos reais para conferir o estado atual:

- `lib/domain/contracts.ts`
- `lib/application/repository-context.ts`
- `lib/memory/entities.ts`
- `lib/memory/service.ts`
- `lib/memory/sql.ts`
- `lib/memory/migrations.ts`
- `lib/memory/repositories.ts`
- `lib/memory/vector-store.ts`
- `lib/memory/embedding-providers.ts`
- `lib/memory/json-adapter.ts`
- `scripts/memory-migrate.ts`
- `tests/domain-contracts.test.ts`
- `tests/architecture-integration.test.ts`
- `tests/memory.test.ts`
- `docs/PUB_MASTER_CONTEXT.md`
- `docs/architecture/*`
- `docs/memory/*`
- `docs/audits/*`

Ações proibidas sem aprovação explícita:

- implementar novas funcionalidades
- conectar PostgreSQL real sem decisão de fase
- instalar dependências
- criar provider real
- criar migrations novas
- integrar Qdrant, Weaviate, OpenSearch, Vespa, Neo4j, RAGFlow, Onyx como plataforma central
- transformar Haystack/LlamaIndex em núcleo da arquitetura
- fazer commit/push automaticamente

Como assumir o projeto:

1. Leia este pacote na ordem sugerida.
2. Confira o código real citado acima.
3. Verifique o estado real do Git.
4. Execute os gates apropriados antes de afirmar que algo está pronto.
5. Valide os testes atuais antes de qualquer mudança.
6. Respeite as decisões congeladas.
7. Qualquer desvio deve ser tratado como blocker e documentado antes de implementar.
