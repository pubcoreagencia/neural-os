import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { AuditRecord, EntityRecord, KnowledgeChunk, KnowledgeRecord, PermissionRecord, RelationshipRecord, SourceRecord } from "./entities";

export interface JsonStoreData {
  knowledge: KnowledgeRecord[];
  chunks: KnowledgeChunk[];
  sources?: SourceRecord[];
  permissions?: PermissionRecord[];
  audit?: AuditRecord[];
  entities?: EntityRecord[];
  relationships?: RelationshipRecord[];
}

const STORE_PATH = resolve(process.cwd(), "data", "memory-store.json");

async function ensureStorePath() {
  await mkdir(dirname(STORE_PATH), { recursive: true });
  if (!existsSync(STORE_PATH)) {
    const initial: JsonStoreData = { knowledge: [], chunks: [] };
    await writeFile(STORE_PATH, JSON.stringify(initial, null, 2), "utf8");
  }
}

export async function readJsonStore(): Promise<JsonStoreData> {
  await ensureStorePath();
  const raw = await readFile(STORE_PATH, "utf8");
  return JSON.parse(raw) as JsonStoreData;
}

export async function writeJsonStore(store: JsonStoreData) {
  await ensureStorePath();
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}
