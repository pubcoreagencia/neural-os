# 11_DECISIONS — ARCHITECTURE DECISIONS

Decisões congeladas até aqui:

1. PostgreSQL é o source of truth alvo.
2. pgvector é a infraestrutura vetorial alvo.
3. JSON adapter permanece apenas como DEVELOPMENT / MVP.
4. `chunks.embedding` é a única fonte vetorial operacional.
5. `KnowledgeRecord.embedding` não é mais a fonte operacional.
6. `knowledge_vectors` não existe.
7. Domain não depende de infraestrutura concreta.
8. PUB Neural não executa Dev Loop nesta fase.
9. Holding Context / Repository Context permanecem proprietários.
10. Governança, provenance, confidence, relationships, audit e permissions são domínio próprio.
11. Haystack/LlamaIndex são opcionais e não centrais.
12. Qdrant / Weaviate / OpenSearch / Vespa / Neo4j / RAGFlow / Onyx não são adotados agora como plataforma central.

Decisão de fase atual:

- BUILD + ADOPT + OPTIONAL

Leitura operacional:

- BUILD o que é domínio e governança
- ADOPT infraestrutura que reduz retrabalho
- OPTIONAL só se houver ganho concreto

