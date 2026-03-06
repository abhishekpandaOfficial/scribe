import { spawnSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import dotenv from "dotenv";

dotenv.config();

function hasRealValue(value) {
  if (!value) {
    return false;
  }
  return !String(value).includes("xxx") && !String(value).includes("...");
}

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
  });

  if (result.error) {
    // eslint-disable-next-line no-console
    console.error(result.error.message);
    return 1;
  }

  return Number(result.status ?? 1);
}

const projectRef = process.env.SUPABASE_PROJECT_REF || "";
const dbPassword = process.env.SUPABASE_DB_PASSWORD || "";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!hasRealValue(projectRef)) {
  // eslint-disable-next-line no-console
  console.error(
    "[supabase-bind] Missing SUPABASE_PROJECT_REF in .env. Add your real project ref (e.g. abcd1234efgh5678)."
  );
  process.exit(1);
}

if (!hasRealValue(supabaseUrl) || !hasRealValue(serviceRoleKey)) {
  // eslint-disable-next-line no-console
  console.error(
    "[supabase-bind] Missing valid Supabase keys. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY with real values."
  );
  process.exit(1);
}

const linkArgs = ["link", "--project-ref", projectRef];
if (dbPassword) {
  linkArgs.push("--password", dbPassword);
}

const pushArgs = ["db", "push", "--linked"];
if (dbPassword) {
  pushArgs.push("--password", dbPassword);
}

async function main() {
  // eslint-disable-next-line no-console
  console.log("[supabase-bind] Linking Supabase project...");
  const linkStatus = run("supabase", linkArgs);
  if (linkStatus !== 0) {
    process.exit(linkStatus);
  }

  // eslint-disable-next-line no-console
  console.log("[supabase-bind] Pushing schema migrations...");
  const pushStatus = run("supabase", pushArgs);
  if (pushStatus !== 0) {
    process.exit(pushStatus);
  }

  // eslint-disable-next-line no-console
  console.log("[supabase-bind] Migrating SQLite data into Supabase tables...");
  let migrateStatus = run("node", ["backend/scripts/migrate-sqlite-to-supabase.js"]);

  if (migrateStatus !== 0) {
    // PostgREST schema cache can lag briefly right after db push.
    // Retry once after a short delay to avoid false negatives.
    // eslint-disable-next-line no-console
    console.log("[supabase-bind] Initial migration failed. Retrying once in 4s...");
    await sleep(4000);
    migrateStatus = run("node", ["backend/scripts/migrate-sqlite-to-supabase.js"]);
  }

  if (migrateStatus !== 0) {
    process.exit(migrateStatus);
  }

  // eslint-disable-next-line no-console
  console.log("[supabase-bind] Completed. Supabase schema + data are now synced.");
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error?.message || "supabase:bind failed");
  process.exit(1);
});
