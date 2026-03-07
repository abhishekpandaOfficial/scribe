import Database from "better-sqlite3";
import { config } from "./config.js";
import { generateId, hashPassword, nowIso } from "./lib/security.js";

const db = new Database(config.dbPath);
db.pragma("journal_mode = WAL");

function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      plan TEXT NOT NULL DEFAULT 'Pro',
      bio TEXT,
      website TEXT,
      twitter TEXT,
      github TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      excerpt TEXT,
      content_json TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      series TEXT,
      chapter INTEGER,
      difficulty TEXT,
      tags_json TEXT,
      read_time TEXT,
      views INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      published_at TEXT,
      UNIQUE(user_id, slug),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      key_prefix TEXT NOT NULL,
      key_hash TEXT NOT NULL,
      permissions_json TEXT NOT NULL,
      last_used_at TEXT,
      expires_at TEXT,
      revoked INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS webhooks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      events_json TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      last_status INTEGER,
      last_triggered_at TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS webhook_logs (
      id TEXT PRIMARY KEY,
      webhook_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      status INTEGER,
      response_body TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(webhook_id) REFERENCES webhooks(id)
    );

    CREATE TABLE IF NOT EXISTS page_views (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      post_id TEXT,
      source TEXT,
      country TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(post_id) REFERENCES posts(id)
    );

    CREATE INDEX IF NOT EXISTS idx_posts_user_status ON posts(user_id, status);
    CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
    CREATE INDEX IF NOT EXISTS idx_page_views_user ON page_views(user_id, created_at);
  `);
}

async function seed() {
  const hasUsers = db.prepare("SELECT COUNT(*) as count FROM users").get().count > 0;
  if (hasUsers) {
    return;
  }

  const now = nowIso();
  const userId = generateId("usr");
  const passwordHash = await hashPassword("Password@123");

  db.prepare(
    `INSERT INTO users (id, name, username, email, password_hash, plan, bio, website, twitter, github, created_at, updated_at)
     VALUES (@id, @name, @username, @email, @password_hash, @plan, @bio, @website, @twitter, @github, @created_at, @updated_at)`
  ).run({
    id: userId,
    name: "Abhishek Panda",
    username: "abhishekpanda",
    email: "hello@abhishekpanda.com",
    password_hash: passwordHash,
    plan: "Pro",
    bio: "Senior .NET Engineer · Writing about performance, architecture, and real-world C#. 22K readers.",
    website: "https://abhishekpanda.com",
    twitter: "@AbhishekPanda",
    github: "@abhishek-panda",
    created_at: now,
    updated_at: now,
  });
}

export async function initDb() {
  migrate();
  await seed();
}

export default db;
