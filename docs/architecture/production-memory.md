# Production Memory Foundation

## What is implemented

- JSON development adapter
- ingestion for markdown, pdf and text
- versioned knowledge records
- provenance at knowledge and chunk level
- retrieval with deterministic embeddings
- public API preserved

## What is prepared

- PostgreSQL repositories
- schema for knowledge, sources, versions, chunks, embeddings, permissions, audit, entities and relationships
- `pgvector` target vector store
- migration script for schema and JSON -> PostgreSQL
- environment-driven embedding provider selection

## What still depends on external infrastructure

- `DATABASE_URL`
- actual PostgreSQL server
- actual `pgvector` extension availability
- external embedding provider credentials and endpoint

## Adapter policy

- `json`: development / MVP only
- `postgres`: production target

The code makes this distinction explicit instead of silently falling back.

