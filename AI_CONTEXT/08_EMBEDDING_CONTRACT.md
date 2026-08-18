# 08_EMBEDDING_CONTRACT — EMBEDDING STRATEGY

## Contrato

`EmbeddingProvider`

Responsabilidade:

- receber texto
- retornar vetor numérico de dimensão fixa

## Providers

### DeterministicEmbeddingProvider

- uso: DEV / TEST
- já existe no código
- é determinístico e previsível

### RealEmbeddingProvider

- uso: PRODUCTION
- futuro adapter-based
- não deve viver no Domain

## Regras

- o sistema não pode fingir provider real
- se provider real não estiver configurado, isso deve aparecer explicitamente
- a escolha por ENV deve ser clara
- a dimensão precisa ser compatível com o storage vetorial

## ENVs já visíveis no projeto

- `PUB_EMBEDDING_PROVIDER`
- `PUB_EMBEDDING_MODEL`
- `PUB_EMBEDDING_DIMENSION`
- `DATABASE_URL`

## Regras de comportamento

- dev/test: deterministic
- produção: provider real por adapter
- quando não configurado: falha explícita ou retorna status explícito de não configuração

