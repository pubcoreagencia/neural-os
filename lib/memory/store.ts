import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { KnowledgeRecord, KnowledgeStoreData } from "./types";

const STORE_PATH = resolve(process.cwd(), "data", "memory-store.json");

async function ensureStorePath() {
  await mkdir(dirname(STORE_PATH), { recursive: true });
  if (!existsSync(STORE_PATH)) {
    const initial: KnowledgeStoreData = { knowledge: [], chunks: [] };
    await writeFile(STORE_PATH, JSON.stringify(initial, null, 2), "utf8");
  }
}

export async function readStore(): Promise<KnowledgeStoreData> {
  await ensureStorePath();
  const raw = await readFile(STORE_PATH, "utf8");
  return JSON.parse(raw) as KnowledgeStoreData;
}

export async function writeStore(store: KnowledgeStoreData) {
  await ensureStorePath();
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export function nextVersion(current?: string) {
  if (!current) return "1.0.0";
  const parts = current.split(".").map(Number);
  const patch = Number.isFinite(parts[2]) ? parts[2] + 1 : 1;
  return `${parts[0] || 1}.${parts[1] || 0}.${patch}`;
}

export function canAccess(record: KnowledgeRecord, visibility?: string) {
  const levelOrder = ["PUBLIC", "INTERNAL", "CONFIDENTIAL", "RESTRICTED"] as const;
  const recordIndex = levelOrder.indexOf((record.permissions?.[0] as (typeof levelOrder)[number]) || "PUBLIC");
  const userIndex = levelOrder.indexOf((visibility as (typeof levelOrder)[number]) || "PUBLIC");
  return userIndex >= recordIndex;
}

