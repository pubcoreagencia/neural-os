# 04_DOMAIN_MODEL — DOMAIN MODEL

Modelo de domínio congelado para esta fase.

## Núcleo institucional

- Holding
- Company
- Brand
- Product
- Project
- Repository

## Conteúdo e conhecimento

- Document
- KnowledgeItem
- Decision

## Operação e governança

- Task
- Agent
- Operator
- Workflow

## Relações

Relações conceituais suportadas:

- company → brand
- brand → product
- product → project
- project → repository
- repository → document
- document → knowledge item
- knowledge item → decision
- knowledge item → task
- qualquer entidade → relationship com provenance

## RepositoryContext

O contexto de repositório deve reunir:

- repository
- project
- product
- company
- architecture
- documentation
- currentState
- devLoopReadiness
- relevantKnowledge
- relevantDecisions
- relevantTasks

## Estado atual no código

- `lib/domain/contracts.ts` já materializa a maior parte desse modelo
- `KnowledgeItem` já existe
- `RepositoryContext` já existe
- o modelo ainda pode evoluir, mas a fronteira do domínio já está estabelecida

