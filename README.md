# Neural OS

Site institucional e fundação do PUB Memory Engine, a camada de memória central da PUB Holding.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
npm run test
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
