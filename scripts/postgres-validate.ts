import { validatePostgresFoundation } from "../lib/memory/postgres-validation";

async function main() {
  const report = await validatePostgresFoundation();
  console.log(JSON.stringify(report, null, 2));
  if (!report.passed) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
