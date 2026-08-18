import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { ingestKnowledgeFromFile, searchKnowledge, getKnowledgeVersions, getProvenance } from "../lib/memory/service";
import { readJsonStore } from "../lib/memory/json-adapter";

const tempDir = resolve(process.cwd(), "tmp-test-memory");

async function resetStore() {
  await rm(resolve(process.cwd(), "data"), { recursive: true, force: true });
  await mkdir(tempDir, { recursive: true });
}

test("ingests markdown into knowledge, chunks and provenance", async () => {
  await resetStore();
  const filePath = resolve(tempDir, "master-context.md");
  await writeFile(filePath, "# PUB Neural OS\n\nMemória antes de geração.", "utf8");

  const knowledge = await ingestKnowledgeFromFile({
    filePath,
    title: "PUB Master Context",
    sourceUri: "repo://docs/PUB_MASTER_CONTEXT.md",
    sourceType: "markdown",
    version: "1.0.0"
  });

  assert.equal(knowledge.title, "PUB Master Context");
  assert.ok(knowledge.matches.length > 0);

  const store = await readJsonStore();
  assert.equal(store.knowledge.length, 1);
  assert.ok(store.chunks.length > 0);
});

test("supports search, versions and provenance", async () => {
  await resetStore();
  const filePath = resolve(tempDir, "memory.txt");
  await writeFile(filePath, "O PUB Neural OS é a camada central de memória da PUB Holding.", "utf8");

  const record = await ingestKnowledgeFromFile({
    filePath,
    title: "Memory note",
    sourceUri: "repo://docs/memory.txt",
    sourceType: "text",
    version: "1.0.0"
  });

  const results = await searchKnowledge("camada central de memória");
  assert.ok(results.length > 0);
  assert.equal(results[0]?.knowledge?.id, record.id);

  const versions = await getKnowledgeVersions(record.id);
  assert.equal(versions.length, 1);

  const provenance = await getProvenance(record.id);
  assert.ok(provenance);
  assert.equal(provenance?.knowledge.id, record.id);
});
