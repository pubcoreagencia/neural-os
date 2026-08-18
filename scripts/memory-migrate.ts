import { ensureMigrationsDir, applySchemaMigration, migrateJsonToPostgres } from "../lib/memory/migrations";

const command = process.argv[2] ?? "schema";

async function main() {
  await ensureMigrationsDir();

  if (command === "schema") {
    await applySchemaMigration();
    console.log("Schema migration applied.");
    return;
  }

  if (command === "json-to-postgres") {
    const summary = await migrateJsonToPostgres();
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

