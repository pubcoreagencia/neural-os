# Holding Context Model

## Purpose

This document defines the minimum structured context PUB Neural should know about the PUB Holding before expanding into PostgreSQL-backed operational context.

The goal is not to execute work. The goal is to represent the Holding accurately, consistently, and with provenance.

## Source of truth hierarchy

1. `docs/PUB_MASTER_CONTEXT.md`
2. Ingested master context chunks in the Memory Engine
3. Confirmed repository and code evidence
4. Derived operational context

If a fact is not supported by one of the sources above, it must remain `UNKNOWN`.

## Core conceptual entities

### CORE

- `Holding`
- `Company`
- `Brand`
- `Product`
- `Project`
- `Repository`
- `Document`
- `KnowledgeItem`
- `Decision`

### SECONDARY

- `Agent`
- `Operator`
- `Workflow`
- `Task`

### FUTURE

- `Lead`
- `Customer`
- `Service`
- `Campaign`
- `Process`

## Entity definitions

### Holding

Represents the PUB Holding as the parent organizational context.

### Company

Represents a company unit explicitly declared or confirmed by the Holding context.

### Brand

Represents a brand or commercial identity owned by a company or directly by the Holding.

### Product

Represents a product, platform, or offer that can be related to a company, brand, or project.

### Project

Represents a bounded initiative, delivery, product implementation, or strategic effort.

### Repository

Represents a Git repository as an operational asset, not just a URL.

### Document

Represents a versioned document ingested into memory.

### KnowledgeItem

Represents structured knowledge extracted or confirmed from documents, repositories, or operations.

### Decision

Represents a recorded strategic or operational decision with provenance.

### Agent

Represents a specialized digital actor that may later operate on projects or workflows.

### Operator

Represents a human or organizational role responsible for operational actions.

### Workflow

Represents a reusable process definition.

### Task

Represents a bounded execution unit that may later target a repository or project.

## Relationship model

The minimal relationship set for the Holding context is:

- `Holding -> owns -> Company`
- `Company -> owns -> Brand`
- `Brand -> has -> Product`
- `Product -> belongs_to -> Project`
- `Project -> has -> Repository`
- `Repository -> implements -> Product`
- `Project -> has -> Document`
- `Document -> describes -> Project`
- `Document -> supports -> Decision`
- `Agent -> operates_on -> Project`
- `Workflow -> operates_on -> Repository`
- `Task -> targets -> Repository`
- `Task -> belongs_to -> Project`
- `Decision -> affects -> Project`

These are defaults, not truths. Each relationship must be confirmed by source evidence before being treated as fact.

## Repository registry model

The repository registry should capture operational context, not just Git metadata.

Recommended minimum fields:

- `id`
- `name`
- `url`
- `provider`
- `organization`
- `defaultBranch`
- `language`
- `framework`
- `description`
- `status`
- `projectId`
- `productId`
- `companyId`
- `visibility`
- `archived`
- `lastAudit`
- `readiness`
- `devLoopReadiness`
- `documentationStatus`
- `buildStatus`
- `testStatus`
- `securityStatus`

### Recommended normalization

- `readiness`: computed operational summary
- `devLoopReadiness`: readiness for PUB DEV LOOP consumption
- `buildStatus`, `testStatus`, `documentationStatus`, `securityStatus`: latest audit signals or snapshots

## Dev Loop readiness

`devLoopReadiness` is best modeled as a snapshot or computed state derived from audits and operational checks, not as a free-text field.

Recommended states:

- `READY`
- `READY_WITH_MINOR_FIXES`
- `NEEDS_HARDENING`
- `BLOCKED`
- `UNKNOWN`

Supporting signals:

- build
- typecheck
- lint
- test
- git hygiene
- environment completeness
- security posture
- documentation quality
- agent readiness

## Source of truth matrix

| Information | Source of truth | Can be derived? | Can be overwritten? |
| --- | --- | --- | --- |
| Repository URL | Git provider | No | No |
| Repository language | repository inspection | Yes | No |
| Product ownership | Master Context / Holding registry | Yes | No |
| Project status | PUB Neural operational state | Yes | Yes, by a newer validated state |
| Build status | audit execution | Yes | Yes, by the latest audit |
| Dev Loop readiness | repository audit | Yes | Yes, by a newer audit |
| Decision | Neural decision record | No | No |
| Document text | ingestion pipeline | No | No |

## Provenance model

The entity layer must keep pointers back to the knowledge layer.

Recommended provenance chain:

`Entity -> KnowledgeItem -> Chunk -> Document -> Source`

Example:

- `Product` has a source document in `docs/PUB_MASTER_CONTEXT.md`
- the document is ingested
- the ingested chunks produce the knowledge item
- the entity references that knowledge item

## Confidence model

Recommended confidence values:

- `CONFIRMED`
- `INFERRED`
- `DERIVED`
- `UNKNOWN`
- `STALE`

Rules:

- `CONFIRMED` requires direct evidence.
- `INFERRED` is a reasoned interpretation from evidence.
- `DERIVED` is computed from other validated data.
- `UNKNOWN` means there is not enough evidence.
- `STALE` means evidence exists but may no longer reflect reality.

## Operational state

Recommended states for companies, products, projects and repositories:

- `ACTIVE`
- `IN_DEVELOPMENT`
- `MAINTENANCE`
- `PAUSED`
- `ARCHIVED`
- `UNKNOWN`

## PostgreSQL mapping

Likely SQL tables for the next phase:

- `companies`
- `brands`
- `products`
- `projects`
- `repositories`
- `documents`
- `knowledge_items`
- `relationships`
- `decisions`
- `tasks`
- `agents`
- `operators`
- `audit_events`
- `permissions`

## Knowledge graph strategy

For the next phase, PostgreSQL with an `entity_relationships` table is sufficient.

That table should store:

- `from_entity_id`
- `to_entity_id`
- `relationship_type`
- `metadata`
- `confidence`
- `source_knowledge_id`
- `created_at`

This keeps the model relational and auditable without introducing a graph database too early.

## Dev Loop context contract

Future context retrieval should look conceptually like:

`getRepositoryContext(repositoryId)`

and return:

- repository
- project
- product
- company
- architecture notes
- documentation
- current state
- dev loop readiness
- relevant knowledge
- relevant decisions
- relevant tasks

## Current implementation status

### Implemented now

- master context document
- knowledge ingestion
- provenance at knowledge/chunk level
- JSON development adapter
- repository abstractions
- vector store abstraction
- documentation scaffolding
- domain contracts for holding, repository context, confidence, readiness and relationships

### Prepared now

- Holding model
- repository registry model
- source of truth matrix
- confidence model
- operational state model
- PostgreSQL mapping
- relationship strategy
- domain/infrastructure separation for the Holding layer

### Planned later

- PostgreSQL real storage
- repository registry persistence
- operational audits tied to repositories
- Dev Loop integration
- orchestrator
- agents
- workflow execution
