# 06_POSTGRESQL_PLAN — POSTGRESQL STRATEGY

## Situação atual

- PostgreSQL está preparado em código
- PostgreSQL não está conectado em ambiente real
- o JSON adapter continua sendo o caminho DEVELOPMENT / MVP

## Esquema alvo mínimo real

Tabelas centrais nesta fase:

- `sources`
- `entities`
- `relationships`
- `knowledge`
- `knowledge_versions`
- `chunks`
- `permissions`
- `audit_logs`

Tabelas futuras, apenas quando o domínio justificar:

- `companies`
- `brands`
- `products`
- `projects`
- `repositories`
- `documents`
- `decisions`
- `tasks`
- `agents`
- `operators`

## Estratégia de persistência

- source of truth: PostgreSQL
- chunks guardam os embeddings
- knowledge guarda o agregado canônico
- versions guardam histórico
- provenance fica embutida em JSON estruturado

## Replay JSON → PostgreSQL

O plano conceitual já existe no repositório:

- criar schema
- habilitar `vector`
- migrar knowledge
- migrar versions
- migrar chunks
- validar contagens
- validar IDs
- validar embeddings
- smoke test de retrieval

## Validação operacional

Existe um verificador de PostgreSQL/pgvector em:

- `lib/memory/postgres-validation.ts`
- `scripts/postgres-validate.ts`

Ele só confirma o estado real quando `DATABASE_URL` estiver disponível.

## Risco atual

- sem `DATABASE_URL` real, nenhuma migração pode ser tratada como validada
- qualquer banco legado com schema antigo exigirá revisão/migração incremental
