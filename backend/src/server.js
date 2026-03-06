import cors from "cors";
import express from "express";
import { z } from "zod";
import db, { initDb } from "./db.js";
import { config } from "./config.js";
import { cacheDeleteMany, cacheGet, cacheKey, cacheMeta, cacheSet } from "./lib/cache.js";
import {
  generateApiKey,
  generateId,
  hashApiKey,
  hashPassword,
  nowIso,
  signToken,
  verifyPassword,
  verifyToken,
} from "./lib/security.js";
import { supabaseMeta } from "./lib/supabase.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

function slugify(input = "") {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseJson(value, fallback) {
  if (!value) {
    return fallback;
  }
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function mapUser(row) {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    email: row.email,
    plan: row.plan,
    bio: row.bio || "",
    website: row.website || "",
    twitter: row.twitter || "",
    github: row.github || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPost(row) {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || "",
    content: parseJson(row.content_json, []),
    status: row.status,
    series: row.series || "",
    chapter: row.chapter ?? null,
    difficulty: row.difficulty || "intermediate",
    tags: parseJson(row.tags_json, []),
    readTime: row.read_time || "5 min",
    views: Number(row.views || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  };
}

function mapApiKey(row) {
  return {
    id: row.id,
    name: row.name,
    prefix: row.key_prefix,
    perms: parseJson(row.permissions_json, ["read"]),
    lastUsed: row.last_used_at ? formatRelative(row.last_used_at) : "Never",
    expires: row.expires_at ? row.expires_at.slice(0, 10) : "Never",
    createdAt: row.created_at,
    revoked: Boolean(row.revoked),
  };
}

function mapWebhook(row) {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    events: parseJson(row.events_json, []),
    lastTrigger: row.last_triggered_at ? formatRelative(row.last_triggered_at) : "Never",
    status: row.last_status || 0,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
  };
}

function formatRelative(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "MISSING_AUTH" });
  }

  try {
    const payload = verifyToken(token);
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(payload.sub);
    if (!user) {
      return res.status(401).json({ error: "INVALID_TOKEN" });
    }
    req.user = user;
    req.tokenPayload = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "INVALID_TOKEN" });
  }
}

function apiKeyMiddleware(req, res, next) {
  const key = req.headers["x-api-key"];
  if (!key || typeof key !== "string") {
    return res.status(401).json({ error: "MISSING_AUTH" });
  }

  const keyHash = hashApiKey(key);
  const row = db
    .prepare("SELECT * FROM api_keys WHERE key_hash = ? AND revoked = 0")
    .get(keyHash);

  if (!row) {
    return res.status(401).json({ error: "INVALID_KEY" });
  }

  if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
    return res.status(401).json({ error: "INVALID_KEY" });
  }

  db.prepare("UPDATE api_keys SET last_used_at = ? WHERE id = ?").run(nowIso(), row.id);
  req.apiKey = row;
  req.keyUser = db.prepare("SELECT * FROM users WHERE id = ?").get(row.user_id);

  if (!req.keyUser) {
    return res.status(401).json({ error: "INVALID_KEY" });
  }

  return next();
}

async function triggerWebhooks(userId, eventType, payload) {
  const hooks = db
    .prepare("SELECT * FROM webhooks WHERE user_id = ? AND is_active = 1")
    .all(userId);

  for (const hook of hooks) {
    const events = parseJson(hook.events_json, []);
    const shouldSend =
      events.includes(eventType) ||
      events.includes("*") ||
      events.includes("post.*") && eventType.startsWith("post.");

    if (!shouldSend) {
      continue;
    }

    let status = 0;
    let responseBody = "";
    try {
      const response = await fetch(hook.url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          event: eventType,
          timestamp: nowIso(),
          payload,
        }),
      });

      status = response.status;
      responseBody = await response.text();
    } catch (error) {
      status = 0;
      responseBody = error?.message || "Webhook delivery failed";
    }

    const now = nowIso();
    db.prepare("UPDATE webhooks SET last_status = ?, last_triggered_at = ? WHERE id = ?").run(
      status,
      now,
      hook.id
    );
    db.prepare(
      "INSERT INTO webhook_logs (id, webhook_id, event_type, status, response_body, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(generateId("wlg"), hook.id, eventType, status, responseBody.slice(0, 2000), now);
  }
}

function ensureUniqueSlug(userId, desiredSlug, postId = null) {
  let slug = desiredSlug || "untitled";
  let i = 1;

  while (true) {
    const row = db
      .prepare("SELECT id FROM posts WHERE user_id = ? AND slug = ?")
      .get(userId, slug);

    if (!row || (postId && row.id === postId)) {
      return slug;
    }

    i += 1;
    slug = `${desiredSlug}-${i}`;
  }
}

async function cachedJson(res, key, builder, ttlSeconds = config.cache.ttlSeconds) {
  const cached = await cacheGet(key);
  if (cached) {
    res.setHeader("x-cache", "HIT");
    return res.json(cached);
  }

  const payload = await builder();
  await cacheSet(key, payload, ttlSeconds);
  res.setHeader("x-cache", "MISS");
  return res.json(payload);
}

async function invalidateUserCaches({ userId, username }) {
  const keys = [
    cacheKey(["posts", userId, "all"]),
    cacheKey(["posts", userId, "draft"]),
    cacheKey(["posts", userId, "review"]),
    cacheKey(["posts", userId, "scheduled"]),
    cacheKey(["posts", userId, "published"]),
    cacheKey(["analytics", userId]),
    cacheKey(["v1", userId, "posts", "all"]),
    cacheKey(["v1", userId, "posts", "published"]),
  ];

  const slugRows = db.prepare("SELECT slug FROM posts WHERE user_id = ?").all(userId);
  slugRows.forEach((row) => {
    keys.push(cacheKey(["v1", userId, "post", row.slug]));
  });

  if (username) {
    keys.push(cacheKey(["public", username, "profile"]));
    keys.push(cacheKey(["public", username, "posts"]));
  }

  await cacheDeleteMany(keys);
}

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    time: nowIso(),
    dataProvider: config.dataProvider,
    cache: cacheMeta,
    supabase: supabaseMeta,
  });
});

app.post("/api/auth/local-bypass", async (_req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "NOT_ALLOWED" });
  }

  const user = db.prepare("SELECT * FROM users ORDER BY created_at ASC LIMIT 1").get();
  if (!user) {
    return res.status(404).json({ error: "NO_LOCAL_USER" });
  }

  const token = signToken({ sub: user.id, email: user.email, username: user.username });
  return res.json({ token, user: mapUser(user) });
});

app.post("/api/auth/register", async (req, res) => {
  const schema = z.object({
    name: z.string().min(2),
    username: z
      .string()
      .min(3)
      .regex(/^[a-zA-Z0-9_-]+$/),
    email: z.string().email(),
    password: z.string().min(8),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  const { name, username, email, password } = parsed.data;
  const existing = db
    .prepare("SELECT id FROM users WHERE email = ? OR username = ?")
    .get(email.toLowerCase(), username.toLowerCase());

  if (existing) {
    return res.status(409).json({ error: "USER_EXISTS" });
  }

  const now = nowIso();
  const userId = generateId("usr");
  const passwordHash = await hashPassword(password);

  db.prepare(
    `INSERT INTO users (id, name, username, email, password_hash, plan, bio, website, twitter, github, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'Pro', '', '', '', '', ?, ?)`
  ).run(userId, name, username.toLowerCase(), email.toLowerCase(), passwordHash, now, now);

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
  const token = signToken({ sub: user.id, email: user.email, username: user.username });

  return res.status(201).json({ token, user: mapUser(user) });
});

app.post("/api/auth/login", async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: "INVALID_CREDENTIALS" });
  }

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ error: "INVALID_CREDENTIALS" });
  }

  const token = signToken({ sub: user.id, email: user.email, username: user.username });
  return res.json({ token, user: mapUser(user) });
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  res.json({ user: mapUser(req.user) });
});

app.patch("/api/auth/profile", authMiddleware, async (req, res) => {
  const schema = z.object({
    name: z.string().min(2).optional(),
    username: z
      .string()
      .min(3)
      .regex(/^[a-zA-Z0-9_-]+$/)
      .optional(),
    email: z.string().email().optional(),
    bio: z.string().max(500).optional(),
    website: z.string().max(300).optional(),
    twitter: z.string().max(100).optional(),
    github: z.string().max(100).optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  const next = parsed.data;
  if (next.username && next.username !== req.user.username) {
    const taken = db.prepare("SELECT id FROM users WHERE username = ? AND id != ?").get(next.username, req.user.id);
    if (taken) {
      return res.status(409).json({ error: "USERNAME_TAKEN" });
    }
  }

  if (next.email && next.email !== req.user.email) {
    const taken = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?").get(next.email, req.user.id);
    if (taken) {
      return res.status(409).json({ error: "EMAIL_TAKEN" });
    }
  }

  const fields = {
    name: next.name ?? req.user.name,
    username: next.username ?? req.user.username,
    email: next.email ?? req.user.email,
    bio: next.bio ?? req.user.bio,
    website: next.website ?? req.user.website,
    twitter: next.twitter ?? req.user.twitter,
    github: next.github ?? req.user.github,
    updated_at: nowIso(),
    id: req.user.id,
  };

  db.prepare(
    `UPDATE users SET
      name = @name,
      username = @username,
      email = @email,
      bio = @bio,
      website = @website,
      twitter = @twitter,
      github = @github,
      updated_at = @updated_at
     WHERE id = @id`
  ).run(fields);

  const updated = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  await invalidateUserCaches({
    userId: req.user.id,
    username: req.user.username,
  });
  if (updated.username !== req.user.username) {
    await invalidateUserCaches({
      userId: req.user.id,
      username: updated.username,
    });
  }
  return res.json({ user: mapUser(updated) });
});

app.get("/api/posts", authMiddleware, async (req, res) => {
  const status = req.query.status;
  const normalizedStatus = status && status !== "all" ? status : "all";
  const key = cacheKey(["posts", req.user.id, normalizedStatus]);

  return cachedJson(
    res,
    key,
    async () => {
      const params = [req.user.id];
      let query = "SELECT * FROM posts WHERE user_id = ?";

      if (normalizedStatus !== "all") {
        query += " AND status = ?";
        params.push(normalizedStatus);
      }

      query += " ORDER BY updated_at DESC";
      const posts = db.prepare(query).all(...params).map(mapPost);
      return { data: posts };
    },
    60
  );
});

app.post("/api/posts", authMiddleware, async (req, res) => {
  const schema = z.object({
    title: z.string().min(1),
    slug: z.string().optional(),
    excerpt: z.string().optional(),
    content: z.array(z.any()).optional(),
    status: z.enum(["draft", "review", "scheduled", "published"]).optional(),
    series: z.string().optional(),
    chapter: z.number().int().optional(),
    difficulty: z.enum(["basic", "intermediate", "advanced", "architect"]).optional(),
    tags: z.array(z.string()).optional(),
    readTime: z.string().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  const now = nowIso();
  const data = parsed.data;
  const rawSlug = slugify(data.slug || data.title || "untitled");
  const slug = ensureUniqueSlug(req.user.id, rawSlug || "untitled");
  const status = data.status || "draft";
  const postId = generateId("pst");

  db.prepare(
    `INSERT INTO posts
      (id, user_id, title, slug, excerpt, content_json, status, series, chapter, difficulty, tags_json, read_time, views, created_at, updated_at, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`
  ).run(
    postId,
    req.user.id,
    data.title,
    slug,
    data.excerpt || "",
    JSON.stringify(data.content || []),
    status,
    data.series || "",
    data.chapter ?? null,
    data.difficulty || "intermediate",
    JSON.stringify(data.tags || []),
    data.readTime || "5 min",
    now,
    now,
    status === "published" ? now : null
  );

  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(postId);
  const mapped = mapPost(post);
  const eventType = status === "published" ? "post.published" : "post.created";
  await triggerWebhooks(req.user.id, eventType, mapped);
  await invalidateUserCaches({ userId: req.user.id, username: req.user.username });

  return res.status(201).json({ data: mapped });
});

app.patch("/api/posts/:id", authMiddleware, async (req, res) => {
  const existing = db
    .prepare("SELECT * FROM posts WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  const schema = z.object({
    title: z.string().min(1).optional(),
    slug: z.string().optional(),
    excerpt: z.string().optional(),
    content: z.array(z.any()).optional(),
    status: z.enum(["draft", "review", "scheduled", "published"]).optional(),
    series: z.string().optional(),
    chapter: z.number().int().optional(),
    difficulty: z.enum(["basic", "intermediate", "advanced", "architect"]).optional(),
    tags: z.array(z.string()).optional(),
    readTime: z.string().optional(),
    views: z.number().int().min(0).optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  const data = parsed.data;
  const now = nowIso();
  const nextTitle = data.title ?? existing.title;
  const baseSlug = slugify(data.slug || data.title || existing.slug || "untitled");
  const nextSlug = ensureUniqueSlug(req.user.id, baseSlug, existing.id);
  const nextStatus = data.status ?? existing.status;

  db.prepare(
    `UPDATE posts SET
      title = @title,
      slug = @slug,
      excerpt = @excerpt,
      content_json = @content_json,
      status = @status,
      series = @series,
      chapter = @chapter,
      difficulty = @difficulty,
      tags_json = @tags_json,
      read_time = @read_time,
      views = @views,
      updated_at = @updated_at,
      published_at = @published_at
     WHERE id = @id`
  ).run({
    id: existing.id,
    title: nextTitle,
    slug: nextSlug,
    excerpt: data.excerpt ?? existing.excerpt,
    content_json: JSON.stringify(data.content ?? parseJson(existing.content_json, [])),
    status: nextStatus,
    series: data.series ?? existing.series,
    chapter: data.chapter ?? existing.chapter,
    difficulty: data.difficulty ?? existing.difficulty,
    tags_json: JSON.stringify(data.tags ?? parseJson(existing.tags_json, [])),
    read_time: data.readTime ?? existing.read_time,
    views: data.views ?? existing.views,
    updated_at: now,
    published_at:
      nextStatus === "published"
        ? existing.published_at || now
        : existing.published_at,
  });

  const updated = db.prepare("SELECT * FROM posts WHERE id = ?").get(existing.id);
  const mapped = mapPost(updated);
  const eventType = nextStatus === "published" ? "post.published" : "post.updated";
  await triggerWebhooks(req.user.id, eventType, mapped);
  await invalidateUserCaches({ userId: req.user.id, username: req.user.username });

  return res.json({ data: mapped });
});

app.delete("/api/posts/:id", authMiddleware, async (req, res) => {
  const existing = db
    .prepare("SELECT * FROM posts WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  db.prepare("DELETE FROM posts WHERE id = ?").run(existing.id);
  await triggerWebhooks(req.user.id, "post.deleted", mapPost(existing));
  await invalidateUserCaches({ userId: req.user.id, username: req.user.username });
  return res.status(204).send();
});

app.post("/api/posts/:id/view", async (req, res) => {
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(req.params.id);
  if (!post) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  db.prepare("UPDATE posts SET views = views + 1 WHERE id = ?").run(post.id);
  db.prepare(
    "INSERT INTO page_views (id, user_id, post_id, source, country, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(
    generateId("pv"),
    post.user_id,
    post.id,
    req.body?.source || "Direct",
    req.body?.country || "Unknown",
    nowIso()
  );
  const owner = db.prepare("SELECT username FROM users WHERE id = ?").get(post.user_id);
  await invalidateUserCaches({ userId: post.user_id, username: owner?.username });

  return res.json({ ok: true });
});

app.get("/api/api-keys", authMiddleware, (req, res) => {
  const keys = db
    .prepare("SELECT * FROM api_keys WHERE user_id = ? AND revoked = 0 ORDER BY created_at DESC")
    .all(req.user.id)
    .map(mapApiKey);

  return res.json({ data: keys });
});

app.post("/api/api-keys", authMiddleware, (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    permissions: z.array(z.enum(["read", "write", "admin"])).min(1).default(["read"]),
    expiresAt: z.string().datetime().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  const data = parsed.data;
  const key = generateApiKey();
  const id = generateId("key");
  const createdAt = nowIso();

  const masked = `${key.slice(0, 14)}••••`;

  db.prepare(
    `INSERT INTO api_keys
      (id, user_id, name, key_prefix, key_hash, permissions_json, last_used_at, expires_at, revoked, created_at)
     VALUES (?, ?, ?, ?, ?, ?, NULL, ?, 0, ?)`
  ).run(
    id,
    req.user.id,
    data.name,
    masked,
    hashApiKey(key),
    JSON.stringify(data.permissions),
    data.expiresAt || null,
    createdAt
  );

  const record = db.prepare("SELECT * FROM api_keys WHERE id = ?").get(id);
  return res.status(201).json({ data: mapApiKey(record), apiKey: key });
});

app.delete("/api/api-keys/:id", authMiddleware, (req, res) => {
  const existing = db
    .prepare("SELECT id FROM api_keys WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  db.prepare("UPDATE api_keys SET revoked = 1 WHERE id = ?").run(existing.id);
  return res.status(204).send();
});

app.get("/api/webhooks", authMiddleware, (req, res) => {
  const hooks = db
    .prepare("SELECT * FROM webhooks WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.user.id)
    .map(mapWebhook);
  return res.json({ data: hooks });
});

app.post("/api/webhooks", authMiddleware, (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    url: z.string().url(),
    events: z.array(z.string()).min(1),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
  }

  const data = parsed.data;
  const id = generateId("wh");
  db.prepare(
    `INSERT INTO webhooks
      (id, user_id, name, url, events_json, is_active, last_status, last_triggered_at, created_at)
     VALUES (?, ?, ?, ?, ?, 1, NULL, NULL, ?)`
  ).run(id, req.user.id, data.name, data.url, JSON.stringify(data.events), nowIso());

  const hook = db.prepare("SELECT * FROM webhooks WHERE id = ?").get(id);
  return res.status(201).json({ data: mapWebhook(hook) });
});

app.post("/api/webhooks/:id/test", authMiddleware, async (req, res) => {
  const hook = db
    .prepare("SELECT * FROM webhooks WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.user.id);

  if (!hook) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  await triggerWebhooks(req.user.id, "webhook.test", {
    id: hook.id,
    name: hook.name,
    source: "manual-test",
  });

  const fresh = db.prepare("SELECT * FROM webhooks WHERE id = ?").get(hook.id);
  return res.json({ data: mapWebhook(fresh) });
});

app.delete("/api/webhooks/:id", authMiddleware, (req, res) => {
  const hook = db
    .prepare("SELECT id FROM webhooks WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.user.id);

  if (!hook) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  db.prepare("DELETE FROM webhooks WHERE id = ?").run(hook.id);
  return res.status(204).send();
});

app.get("/api/analytics/overview", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const key = cacheKey(["analytics", userId]);

  return cachedJson(
    res,
    key,
    async () => {
      const totalPosts = db.prepare("SELECT COUNT(*) as count FROM posts WHERE user_id = ?").get(userId).count;
      const totalViews = db.prepare("SELECT COALESCE(SUM(views), 0) as views FROM posts WHERE user_id = ?").get(userId).views;
      const publishedPosts = db
        .prepare("SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND status = 'published'")
        .get(userId).count;

      const traffic = db
        .prepare(
          `SELECT source as name, COUNT(*) as value
           FROM page_views
           WHERE user_id = ?
           GROUP BY source
           ORDER BY value DESC
           LIMIT 5`
        )
        .all(userId)
        .map((row) => ({ name: row.name || "Other", value: Number(row.value) }));

      const topPosts = db
        .prepare(
          `SELECT title, views
           FROM posts
           WHERE user_id = ?
           ORDER BY views DESC
           LIMIT 5`
        )
        .all(userId)
        .map((row) => ({ name: `${row.title.split(" ").slice(0, 3).join(" ")}…`, views: row.views }));

      const chart = db
        .prepare(
          `SELECT substr(created_at,1,10) as day, COUNT(*) as views
           FROM page_views
           WHERE user_id = ? AND created_at >= datetime('now','-30 day')
           GROUP BY substr(created_at,1,10)
           ORDER BY day ASC`
        )
        .all(userId)
        .map((row) => ({ day: row.day, views: Number(row.views) }));

      const geo = db
        .prepare(
          `SELECT country, COUNT(*) as visitors
           FROM page_views
           WHERE user_id = ?
           GROUP BY country
           ORDER BY visitors DESC
           LIMIT 5`
        )
        .all(userId)
        .map((row) => ({
          country: row.country || "Unknown",
          visitors: Number(row.visitors),
        }));

      const performance = db
        .prepare(
          `SELECT id, title, views, read_time, series, status, created_at
           FROM posts
           WHERE user_id = ?
           ORDER BY views DESC`
        )
        .all(userId)
        .map((row) => ({
          id: row.id,
          title: row.title,
          views: row.views,
          avgRead: `${40 + (row.views % 35)}%`,
          subscribers: Math.floor(row.views / 8),
          published: row.created_at.slice(0, 10),
          series: row.series || "General",
          status: row.status,
          readTime: row.read_time,
        }));

      return {
        data: {
          kpis: {
            totalPosts,
            totalViews,
            uniqueVisitors: Math.floor(totalViews * 0.48),
            avgReadTime: "6.2 min",
            subscribers: 800 + publishedPosts * 13,
            apiCalls: db.prepare("SELECT COUNT(*) as count FROM webhook_logs").get().count + 1200,
          },
          traffic,
          topPosts,
          chart,
          geo,
          performance,
        },
      };
    },
    45
  );
});

app.get("/api/public/:username/profile", async (req, res) => {
  const username = req.params.username;
  const key = cacheKey(["public", username, "profile"]);
  const cached = await cacheGet(key);
  if (cached) {
    res.setHeader("x-cache", "HIT");
    return res.json(cached);
  }

  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!user) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  const counts = db
    .prepare(
      `SELECT
         COUNT(*) as total_posts,
         COALESCE(SUM(CASE WHEN status = 'published' THEN views ELSE 0 END), 0) as total_views
       FROM posts
       WHERE user_id = ?`
    )
    .get(user.id);

  const payload = {
    data: {
      ...mapUser(user),
      stats: {
        posts: counts.total_posts,
        views: counts.total_views,
      },
    },
  };

  await cacheSet(key, payload, 180);
  res.setHeader("x-cache", "MISS");
  return res.json(payload);
});

app.get("/api/public/:username/posts", async (req, res) => {
  const username = req.params.username;
  const key = cacheKey(["public", username, "posts"]);
  const cached = await cacheGet(key);
  if (cached) {
    res.setHeader("x-cache", "HIT");
    return res.json(cached);
  }

  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!user) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  const posts = db
    .prepare("SELECT * FROM posts WHERE user_id = ? AND status = 'published' ORDER BY published_at DESC, updated_at DESC")
    .all(user.id)
    .map(mapPost);

  const payload = { data: posts };
  await cacheSet(key, payload, 120);
  res.setHeader("x-cache", "MISS");
  return res.json(payload);
});

app.get("/api/public/:username/posts/:slug", async (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(req.params.username);
  if (!user) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  const post = db
    .prepare("SELECT * FROM posts WHERE user_id = ? AND slug = ? AND status = 'published'")
    .get(user.id, req.params.slug);

  if (!post) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  db.prepare("UPDATE posts SET views = views + 1 WHERE id = ?").run(post.id);
  db.prepare(
    "INSERT INTO page_views (id, user_id, post_id, source, country, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(generateId("pv"), user.id, post.id, "Direct", "Unknown", nowIso());

  await invalidateUserCaches({ userId: user.id, username: user.username });

  const fresh = db.prepare("SELECT * FROM posts WHERE id = ?").get(post.id);
  return res.json({ data: mapPost(fresh) });
});

app.get("/v1/posts", apiKeyMiddleware, async (req, res) => {
  const status = req.query.status || "published";
  const key = cacheKey(["v1", req.keyUser.id, "posts", status]);

  return cachedJson(
    res,
    key,
    async () => {
      let query = "SELECT * FROM posts WHERE user_id = ?";
      const params = [req.keyUser.id];

      if (status !== "all") {
        query += " AND status = ?";
        params.push(status);
      }

      query += " ORDER BY updated_at DESC";

      const posts = db.prepare(query).all(...params).map(mapPost);
      return { data: posts };
    },
    60
  );
});

app.get("/v1/posts/:slug", apiKeyMiddleware, async (req, res) => {
  const key = cacheKey(["v1", req.keyUser.id, "post", req.params.slug]);
  const cached = await cacheGet(key);
  if (cached) {
    res.setHeader("x-cache", "HIT");
    return res.json(cached);
  }

  const post = db
    .prepare("SELECT * FROM posts WHERE user_id = ? AND slug = ?")
    .get(req.keyUser.id, req.params.slug);

  if (!post) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  const payload = { data: mapPost(post) };
  await cacheSet(key, payload, 60);
  res.setHeader("x-cache", "MISS");
  return res.json(payload);
});

app.use((error, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(error);
  return res.status(500).json({ error: "INTERNAL_ERROR" });
});

await initDb();

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Scribe API running on http://127.0.0.1:${config.port}`);
});
