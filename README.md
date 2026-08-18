# Neural OS

Site institucional e fundação do PUB Memory Engine, a camada de memória central da PUB Holding.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
npm run test
npm run memory:migrate:schema
npm run memory:migrate:json
```

## Direção

O repositório agora combina duas camadas:

- Experience Layer: landing institucional premium.
- Memory Layer: ingestão, versionamento, busca e provenance para conhecimento da PUB Holding.

## Estrutura

- `app/`: rotas, SEO e layout global.
- `app/api/knowledge/`: API interna do Memory Engine.
- `components/`: experiência principal, motion runtime, botão magnético e visualização 3D.
- `docs/`: blueprint de UX, copywriting, design system, motion e arquitetura.
- `lib/memory/`: ingestão, embeddings, storage, retrieval e tipos do núcleo de memória.
- `tests/`: cobertura dos fluxos críticos do Memory Engine.

## Memory Engine

Fluxo inicial implementado:

```text
Markdown / PDF / texto
  -> Parser
  -> Cleaner
  -> Chunker
  -> Embedding provider
  -> Storage local versionado
  -> Search
  -> Provenance
```

Endpoints internos:

- `POST /api/knowledge/ingest`
- `GET /api/knowledge`
- `GET /api/knowledge/:id`
- `POST /api/knowledge/search`
- `GET /api/knowledge/:id/versions`
- `GET /api/knowledge/:id/provenance`

## Configuração de Ambiente

Copie [.env.example](./.env.example) para `.env.local` e ajuste conforme o ambiente.

Variáveis principais:

- `DATABASE_URL`: necessário para PostgreSQL de produção.
- `PUB_MEMORY_BACKEND`: `json` ou `postgres`.
- `PUB_VECTOR_STORE_BACKEND`: atualmente preparado para `pgvector`.
- `PUB_EMBEDDING_PROVIDER`: `deterministic` ou provider real futuro.
- `PUB_EMBEDDING_MODEL`: reservado para o provider real.
- `PUB_EMBEDDING_DIMENSION`: dimensão esperada dos embeddings.

## PostgreSQL e Migração

PostgreSQL e `pgvector` estão preparados na arquitetura, mas não vêm conectados por padrão.

Quando houver `DATABASE_URL`:

```bash
npm run memory:migrate:schema
npm run memory:migrate:json
```

O primeiro comando materializa o schema. O segundo lê o storage JSON do MVP e prepara a migração de conhecimento, versões e chunks para PostgreSQL.

Sem `DATABASE_URL`, o repositório continua operando com o adapter JSON de desenvolvimento/MVP.

## Vector Store e Embeddings

- Vector store alvo: `pgvector`.
- Embeddings de desenvolvimento: determinísticos.
- Embeddings de produção: preparados para serem ativados via variável de ambiente, sem API key hardcoded.

## Status Real

- Implementado: JSON/MVP, ingestão, retrieval, provenance, documentação, testes.
- Preparado: PostgreSQL, migrations, repositories, permissions, audit, entities, relationships, vector store.
- Requer infraestrutura externa: `DATABASE_URL`, PostgreSQL, `pgvector`, provider real de embeddings.
