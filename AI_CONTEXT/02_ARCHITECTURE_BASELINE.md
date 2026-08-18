# 02_ARCHITECTURE_BASELINE — FROZEN ARCHITECTURE

Arquitetura congelada:

Experience
→ Application
→ Domain

Application → Ports

Infrastructure → implements Ports

Infrastructure:

- PostgreSQL
- pgvector
- embedding provider

Regras de dependência:

- Domain não depende de infraestrutura concreta.
- Application pode conhecer Domain e Ports.
- Infrastructure implementa Ports, mas não dita regra de negócio.
- JSON adapter é apenas DEVELOPMENT / MVP.

O que está bloqueado como “não fazer agora”:

- Qdrant
- Weaviate
- OpenSearch
- Vespa
- Neo4j
- RAGFlow como plataforma
- Onyx como plataforma
- Haystack/LlamaIndex como núcleo central

O que é permitido apenas como apoio futuro:

- bibliotecas de ingestão/retrieval se reduzirem código de forma concreta
- provider real de embeddings via adapter

Pontos já validados no código real:

- o domínio não importa `lib/memory`
- o vector model operacional está unificado em chunks
- os comandos `test`, `typecheck`, `lint` e `build` passam no estado atual

