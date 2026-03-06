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
    email: "abhishek@abhishekpanda.com",
    password_hash: passwordHash,
    plan: "Pro",
    bio: "Senior .NET Engineer · Writing about performance, architecture, and real-world C#. 22K readers.",
    website: "https://abhishekpanda.com",
    twitter: "@AbhishekPanda",
    github: "@abhishek-panda",
    created_at: now,
    updated_at: now,
  });

  const posts = [
    {
      id: generateId("pst"),
      title: "The async/await State Machine",
      slug: "async-await-state-machine",
      excerpt: "Deep dive into how the C# compiler transforms async/await into an IAsyncStateMachine struct...",
      status: "published",
      series: "C# Mastery",
      chapter: 22,
      difficulty: "advanced",
      tags_json: JSON.stringify(["CLR", "async", "performance"]),
      read_time: "7 min",
      views: 4821,
      published_at: now,
    },
    {
      id: generateId("pst"),
      title: "Zero-Allocation Patterns in .NET 9",
      slug: "zero-allocation-patterns",
      excerpt: "Using Span<T>, Memory<T>, and ref structs to eliminate GC pressure in hot paths...",
      status: "published",
      series: "C# Mastery",
      chapter: 21,
      difficulty: "architect",
      tags_json: JSON.stringify(["performance", ".NET 9", "Span"]),
      read_time: "9 min",
      views: 3204,
      published_at: now,
    },
    {
      id: generateId("pst"),
      title: "Microservices with .NET Aspire",
      slug: "microservices-dotnet-aspire",
      excerpt: "Building distributed systems with the new .NET Aspire orchestration framework...",
      status: "draft",
      series: "Cloud Architecture",
      chapter: 1,
      difficulty: "intermediate",
      tags_json: JSON.stringify(["microservices", "Aspire", "Docker"]),
      read_time: "6 min",
      views: 0,
      published_at: null,
    },
  ];

  const insertPost = db.prepare(
    `INSERT INTO posts
      (id, user_id, title, slug, excerpt, content_json, status, series, chapter, difficulty, tags_json, read_time, views, created_at, updated_at, published_at)
     VALUES
      (@id, @user_id, @title, @slug, @excerpt, @content_json, @status, @series, @chapter, @difficulty, @tags_json, @read_time, @views, @created_at, @updated_at, @published_at)`
  );

  const insertView = db.prepare(
    `INSERT INTO page_views (id, user_id, post_id, source, country, created_at)
     VALUES (@id, @user_id, @post_id, @source, @country, @created_at)`
  );

  for (const post of posts) {
    insertPost.run({
      ...post,
      user_id: userId,
      content_json: JSON.stringify([{ type: "paragraph", content: post.excerpt }]),
      created_at: now,
      updated_at: now,
    });

    const sources = ["Direct", "Google", "Twitter", "GitHub", "Other"];
    const countries = ["India", "USA", "UK", "Germany", "Canada"];

    const views = Math.max(post.views, 10);
    for (let i = 0; i < views; i += 1) {
      insertView.run({
        id: generateId("pv"),
        user_id: userId,
        post_id: post.id,
        source: sources[i % sources.length],
        country: countries[i % countries.length],
        created_at: new Date(Date.now() - (i % 30) * 86400000).toISOString(),
      });
    }
  }
}

export async function initDb() {
  migrate();
  await seed();
}

export default db;
