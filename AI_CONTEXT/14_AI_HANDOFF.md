# 14_AI_HANDOFF — OPERATIONAL RESUME GUIDE

## Current Phase

Architecture freeze / handoff package.

## Current Status

- codebase validado localmente
- domínio separado
- vector model congelado em `chunks.embedding`
- PostgreSQL preparado, não conectado
- embeddings reais não conectados

## Current Gate

`POSTGRESQL GATE: NO`

## Frozen Decisions

- PostgreSQL como source of truth
- pgvector como infra vetorial
- JSON apenas DEVELOPMENT / MVP
- `chunks.embedding` como única fonte vetorial
- domain proprietário
- Dev Loop boundary separada

## Current Blockers

- ausência de `DATABASE_URL`
- ausência de ambiente PostgreSQL real
- ausência de provider real de embeddings
- migration real não validada

## Last Validation

No estado auditado:

- `npm run test` passou
- `npm run typecheck` passou
- `npm run lint` passou
- `npm run build` passou

## Git State

No momento da criação deste pacote, o repositório estava com mudanças locais não commitadas e arquivos novos pendentes de rastreio. O estado exato deve ser confirmado com `git status --short` antes de qualquer próxima etapa.

## Next Action

Continuar a fundação PostgreSQL/pgvector apenas quando houver ambiente real e decisão explícita.

## Do Not Do

- não implementar Dev Loop
- não integrar plataformas externas como núcleo
- não conectar PostgreSQL sem decisão
- não criar provider real sem configuração
- não mudar a arquitetura congelada sem revisão

## How to Resume

1. Leia `AI_CONTEXT/00_START_HERE.md`.
2. Confirme o estado real do código em `lib/domain`, `lib/application` e `lib/memory`.
3. Refaça `git status --short`.
4. Reexecute os testes principais.
5. Só então avance para a próxima fase aprovada.

