# Memory Engine Setup

## Local MVP

The repository works without `DATABASE_URL` by using the JSON adapter.

This is intended for:

- development
- tests
- local iteration

## Production target

Set:

- `DATABASE_URL`
- `PUB_MEMORY_BACKEND=postgres`
- `PUB_VECTOR_STORE_BACKEND=pgvector`
- `PUB_EMBEDDING_PROVIDER=<real provider>`

Then run:

```bash
npm run memory:migrate:schema
npm run memory:migrate:json
```

## Notes

- No hardcoded credentials are stored in the repository.
- The deterministic embedding provider stays available for development and testing.
- JSON storage remains as a development adapter, not a production target.

