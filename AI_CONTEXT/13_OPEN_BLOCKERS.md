# 13_OPEN_BLOCKERS — REAL BLOCKERS

Blockers reais ainda existentes:

1. PostgreSQL real não conectado.
2. `DATABASE_URL` real não fornecido.
3. provider real de embeddings não configurado.
4. migration JSON → PostgreSQL ainda não validada contra banco real.
5. Repository Context ainda incompleto frente ao contrato final.
6. validação operacional do vector store em produção ainda não existe.

O que não é blocker:

- falta de Qdrant / Weaviate / OpenSearch / Vespa / Neo4j / RAGFlow / Onyx, porque eles não fazem parte da decisão congelada atual

