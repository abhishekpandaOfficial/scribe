import dotenv from "dotenv";
import Database from "better-sqlite3";
import { createClient } from "@supabase/supabase-js";
import { config } from "../src/config.js";

dotenv.config();

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const reset = args.has("--reset");
const batchSize = Number(process.env.SUPABASE_MIGRATE_BATCH_SIZE || 500);

function fail(message) {
  // eslint-disable-next-line no-console
  console.error(`\n[sqlite->supabase] ${message}`);
  process.exit(1);
}

function log(message) {
  // eslint-disable-next-line no-console
  console.log(`[sqlite->supabase] ${message}`);
}

function isPlaceholder(value) {
  if (!value) {
    return true;
  }
  const str = String(value);
  return str.includes("xxx") || str.includes("...");
}

const supabaseUrl = config.supabase.url;
const serviceRoleKey = config.supabase.serviceRoleKey;

if (!dryRun && (isPlaceholder(supabaseUrl) || isPlaceholder(serviceRoleKey))) {
  fail(
    "Missing valid Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY with real values."
  );
}

const sqlite = new Database(config.dbPath, { readonly: true });
const supabase = !dryRun
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

const tablePlan = [
  { name: "users", orderBy: "created_at" },
  { name: "posts", orderBy: "created_at" },
  { name: "api_keys", orderBy: "created_at" },
  { name: "webhooks", orderBy: "created_at" },
  { name: "webhook_logs", orderBy: "created_at" },
  { name: "page_views", orderBy: "created_at" },
];

async function clearTargetTables() {
  const reverse = [...tablePlan].reverse();
  for (const table of reverse) {
    const { error } = await supabase.from(table.name).delete().neq("id", "");
    if (error) {
      throw new Error(`Failed clearing table ${table.name}: ${error.message}`);
    }
    log(`Cleared table ${table.name}`);
  }
}

function fetchAllRows(tableName, orderBy) {
  const query = `SELECT * FROM ${tableName} ORDER BY ${orderBy} ASC`;
  return sqlite.prepare(query).all();
}

async function upsertBatch(tableName, rows) {
  if (rows.length === 0) {
    return;
  }

  const { error } = await supabase.from(tableName).upsert(rows, {
    onConflict: "id",
    ignoreDuplicates: false,
  });

  if (error) {
    throw new Error(`Table ${tableName} upsert failed: ${error.message}`);
  }
}

async function migrateTable(tableName, orderBy) {
  const rows = fetchAllRows(tableName, orderBy);
  log(`Read ${rows.length} row(s) from SQLite table ${tableName}`);

  if (dryRun || rows.length === 0) {
    return { count: rows.length };
  }

  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize);
    await upsertBatch(tableName, chunk);
    log(`Migrated ${Math.min(i + chunk.length, rows.length)}/${rows.length} rows in ${tableName}`);
  }

  return { count: rows.length };
}

async function run() {
  log(`SQLite source: ${config.dbPath}`);
  if (dryRun) {
    log("Running in dry-run mode. No writes will be made to Supabase.");
  } else {
    log(`Supabase target: ${supabaseUrl}`);
  }

  if (!dryRun && reset) {
    log("Reset mode enabled. Existing Supabase rows will be deleted first.");
    await clearTargetTables();
  }

  const stats = [];
  for (const table of tablePlan) {
    const result = await migrateTable(table.name, table.orderBy);
    stats.push({ table: table.name, rows: result.count });
  }

  const total = stats.reduce((sum, entry) => sum + entry.rows, 0);
  log(`Completed migration plan. Total rows processed: ${total}`);
  stats.forEach((entry) => log(` - ${entry.table}: ${entry.rows}`));
}

run()
  .catch((error) => {
    fail(error.message || "Migration failed");
  })
  .finally(() => {
    sqlite.close();
  });
