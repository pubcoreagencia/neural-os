# 09_REPOSITORY_CONTEXT — REPOSITORY CONTEXT PLAN

## Contrato alvo

`getRepositoryContext(repositoryId)`

Retorno esperado:

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

## Estado atual

Arquivo real:

- `lib/application/repository-context.ts`

Status:

- existe mapping funcional
- ainda é parcial frente ao contrato final
- já vive na camada de Application, o que está correto

## Origem dos dados

- repository / project / product / company: PostgreSQL futuro
- architecture / documentation: documentos e contexto institucional
- currentState: composição da aplicação
- devLoopReadiness: domínio + auditoria futura
- relevantKnowledge: memory engine
- relevantDecisions: audit/decisions futuros
- relevantTasks: tasks futuros

## Regra

O Repository Context contextualiza.
Ele não executa Dev Loop.

