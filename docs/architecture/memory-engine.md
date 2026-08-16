# PUB Memory Engine Architecture

## Objetivo

Construir a primeira camada funcional de memória da PUB Holding, capaz de ingerir conhecimento local, versionar conteúdo, recuperar contexto e preservar provenance.

## Camadas

```text
Source
  -> Parser
  -> Cleaner
  -> Chunker
  -> EmbeddingProvider
  -> Storage
  -> Retrieval
  -> Provenance
```

## Estado atual

- Markdown, PDF e texto suportados.
- Storage local em JSON versionado.
- Busca semântica MVP com embeddings determinísticos.
- Provenance por conhecimento e por chunk.
- API interna para ingestão e consulta.

## Próximas fases

- Banco relacional dedicado.
- Vector store especializado.
- Knowledge graph.
- Auth e permissões reais.
- Connectors externos.
