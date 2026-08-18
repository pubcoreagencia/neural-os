export const SCHEMA_SQL = `
create extension if not exists vector;

create table if not exists sources (
  id uuid primary key,
  source_type text not null,
  uri text not null unique,
  title text not null,
  version text not null,
  visibility text not null default 'INTERNAL',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists entities (
  id uuid primary key,
  type text not null,
  name text not null,
  domain text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists relationships (
  id uuid primary key,
  from_entity_id uuid not null references entities(id) on delete cascade,
  to_entity_id uuid not null references entities(id) on delete cascade,
  type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists knowledge (
  id uuid primary key,
  title text not null,
  content text not null,
  domain text not null,
  category text not null,
  entity_type text not null,
  entity_id text not null,
  source_id uuid references sources(id) on delete set null,
  source_type text not null,
  source_uri text not null,
  author text not null,
  owner text not null,
  version text not null,
  status text not null,
  confidence numeric not null default 0.8,
  tags text[] not null default '{}',
  permissions text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  provenance jsonb not null default '{}'::jsonb
);

create index if not exists knowledge_domain_idx on knowledge(domain);
create index if not exists knowledge_entity_idx on knowledge(entity_type, entity_id);
create index if not exists knowledge_source_idx on knowledge(source_id, source_uri);
create index if not exists knowledge_version_idx on knowledge(version);

create table if not exists knowledge_versions (
  id uuid primary key,
  knowledge_id uuid not null references knowledge(id) on delete cascade,
  version text not null,
  content text not null,
  checksum text not null,
  source_uri text not null,
  created_at timestamptz not null default now()
);

create index if not exists knowledge_versions_knowledge_idx on knowledge_versions(knowledge_id, created_at desc);

create table if not exists chunks (
  id uuid primary key,
  knowledge_id uuid not null references knowledge(id) on delete cascade,
  version text not null,
  content text not null,
  chunk_index integer not null,
  token_count integer not null,
  embedding vector(48) not null,
  source_id uuid references sources(id) on delete set null,
  source_uri text not null,
  provenance jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists chunks_knowledge_idx on chunks(knowledge_id, chunk_index);
create index if not exists chunks_embedding_idx on chunks using ivfflat (embedding vector_cosine_ops);

create table if not exists permissions (
  id uuid primary key,
  resource_type text not null,
  resource_id uuid not null,
  visibility text not null,
  principal_type text not null,
  principal_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists permissions_resource_idx on permissions(resource_type, resource_id);

create table if not exists audit_logs (
  id uuid primary key,
  timestamp timestamptz not null,
  actor text not null,
  action text not null,
  resource text not null,
  resource_id text not null,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists audit_logs_timestamp_idx on audit_logs(timestamp desc);
`;
