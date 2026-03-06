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
import { supabaseAdmin, supabaseMeta, supabasePublic } from "./lib/supabase.js";

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

function mapPublicProfile(row) {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    plan: row.plan,
    bio: row.bio || "",
    website: row.website || "",
    twitter: row.twitter || "",
    github: row.github || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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

const prefersSupabase = config.dataProvider === "supabase";
const usingSupabase = prefersSupabase && Boolean(supabaseAdmin);
const usingSupabasePublic = usingSupabase && Boolean(supabasePublic);

if (prefersSupabase && !usingSupabase) {
  // eslint-disable-next-line no-console
  console.warn("DATA_PROVIDER=supabase but Supabase config is incomplete. Falling back to sqlite runtime.");
}

function assertSupabase(result, context) {
  if (!result.error) {
    return result.data;
  }
  throw new Error(`${context}: ${result.error.message}`);
}

async function getUserById(id) {
  if (!usingSupabase) {
    return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  }
  const result = await supabaseAdmin.from("users").select("*").eq("id", id).maybeSingle();
  return assertSupabase(result, "getUserById");
}

async function getUserByEmail(email) {
  if (!usingSupabase) {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
  }
  const result = await supabaseAdmin.from("users").select("*").eq("email", email.toLowerCase()).maybeSingle();
  return assertSupabase(result, "getUserByEmail");
}

async function getUserByUsername(username) {
  if (!usingSupabase) {
    return db.prepare("SELECT * FROM users WHERE username = ?").get(username.toLowerCase());
  }
  const result = await supabaseAdmin.from("users").select("*").eq("username", username.toLowerCase()).maybeSingle();
  return assertSupabase(result, "getUserByUsername");
}

async function getPublicProfileByUsername(username) {
  if (!usingSupabase) {
    return getUserByUsername(username);
  }
  if (!usingSupabasePublic) {
    return getUserByUsername(username);
  }
  const result = await supabasePublic
    .from("public_profiles")
    .select("*")
    .eq("username", username.toLowerCase())
    .maybeSingle();
  return assertSupabase(result, "getPublicProfileByUsername");
}

async function findExistingUserByEmailOrUsername(email, username) {
  if (!usingSupabase) {
    return db.prepare("SELECT id FROM users WHERE email = ? OR username = ?").get(email.toLowerCase(), username.toLowerCase());
  }
  const result = await supabaseAdmin
    .from("users")
    .select("id,email,username")
    .or(`email.eq.${email.toLowerCase()},username.eq.${username.toLowerCase()}`)
    .limit(1);
  return assertSupabase(result, "findExistingUserByEmailOrUsername")?.[0] || null;
}

async function isUsernameTaken(username, excludeUserId) {
  if (!usingSupabase) {
    const taken = db.prepare("SELECT id FROM users WHERE username = ? AND id != ?").get(username, excludeUserId);
    return Boolean(taken);
  }
  const result = await supabaseAdmin.from("users").select("id").eq("username", username).neq("id", excludeUserId).limit(1);
  const rows = assertSupabase(result, "isUsernameTaken");
  return rows.length > 0;
}

async function isEmailTaken(email, excludeUserId) {
  if (!usingSupabase) {
    const taken = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?").get(email, excludeUserId);
    return Boolean(taken);
  }
  const result = await supabaseAdmin.from("users").select("id").eq("email", email).neq("id", excludeUserId).limit(1);
  const rows = assertSupabase(result, "isEmailTaken");
  return rows.length > 0;
}

async function createUserRecord(payload) {
  if (!usingSupabase) {
    db.prepare(
      `INSERT INTO users (id, name, username, email, password_hash, plan, bio, website, twitter, github, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'Pro', '', '', '', '', ?, ?)`
    ).run(payload.id, payload.name, payload.username, payload.email, payload.passwordHash, payload.createdAt, payload.updatedAt);
    return getUserById(payload.id);
  }

  const result = await supabaseAdmin
    .from("users")
    .insert({
      id: payload.id,
      name: payload.name,
      username: payload.username,
      email: payload.email,
      password_hash: payload.passwordHash,
      plan: "Pro",
      bio: "",
      website: "",
      twitter: "",
      github: "",
      created_at: payload.createdAt,
      updated_at: payload.updatedAt,
    })
    .select("*")
    .single();
  return assertSupabase(result, "createUserRecord");
}

async function updateUserRecord(payload) {
  if (!usingSupabase) {
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
    ).run(payload);
    return getUserById(payload.id);
  }

  const result = await supabaseAdmin
    .from("users")
    .update({
      name: payload.name,
      username: payload.username,
      email: payload.email,
      bio: payload.bio,
      website: payload.website,
      twitter: payload.twitter,
      github: payload.github,
      updated_at: payload.updated_at,
    })
    .eq("id", payload.id)
    .select("*")
    .single();
  return assertSupabase(result, "updateUserRecord");
}

async function getApiKeyByHash(keyHash) {
  if (!usingSupabase) {
    return db.prepare("SELECT * FROM api_keys WHERE key_hash = ? AND revoked = 0").get(keyHash);
  }
  const result = await supabaseAdmin
    .from("api_keys")
    .select("*")
    .eq("key_hash", keyHash)
    .eq("revoked", 0)
    .limit(1);
  return assertSupabase(result, "getApiKeyByHash")?.[0] || null;
}

async function touchApiKeyLastUsed(id, at) {
  if (!usingSupabase) {
    db.prepare("UPDATE api_keys SET last_used_at = ? WHERE id = ?").run(at, id);
    return;
  }
  const result = await supabaseAdmin.from("api_keys").update({ last_used_at: at }).eq("id", id);
  assertSupabase(result, "touchApiKeyLastUsed");
}

async function listApiKeysByUser(userId) {
  if (!usingSupabase) {
    return db
      .prepare("SELECT * FROM api_keys WHERE user_id = ? AND revoked = 0 ORDER BY created_at DESC")
      .all(userId);
  }
  const result = await supabaseAdmin
    .from("api_keys")
    .select("*")
    .eq("user_id", userId)
    .eq("revoked", 0)
    .order("created_at", { ascending: false });
  return assertSupabase(result, "listApiKeysByUser");
}

async function createApiKeyRecord(payload) {
  if (!usingSupabase) {
    db.prepare(
      `INSERT INTO api_keys
        (id, user_id, name, key_prefix, key_hash, permissions_json, last_used_at, expires_at, revoked, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NULL, ?, 0, ?)`
    ).run(
      payload.id,
      payload.user_id,
      payload.name,
      payload.key_prefix,
      payload.key_hash,
      payload.permissions_json,
      payload.expires_at,
      payload.created_at
    );
    return getApiKeyById(payload.id);
  }

  const result = await supabaseAdmin
    .from("api_keys")
    .insert(payload)
    .select("*")
    .single();
  return assertSupabase(result, "createApiKeyRecord");
}

async function getApiKeyById(id) {
  if (!usingSupabase) {
    return db.prepare("SELECT * FROM api_keys WHERE id = ?").get(id);
  }
  const result = await supabaseAdmin.from("api_keys").select("*").eq("id", id).maybeSingle();
  return assertSupabase(result, "getApiKeyById");
}

async function getApiKeyByIdAndUser(id, userId) {
  if (!usingSupabase) {
    return db.prepare("SELECT id FROM api_keys WHERE id = ? AND user_id = ?").get(id, userId);
  }
  const result = await supabaseAdmin.from("api_keys").select("id").eq("id", id).eq("user_id", userId).maybeSingle();
  return assertSupabase(result, "getApiKeyByIdAndUser");
}

async function revokeApiKey(id) {
  if (!usingSupabase) {
    db.prepare("UPDATE api_keys SET revoked = 1 WHERE id = ?").run(id);
    return;
  }
  const result = await supabaseAdmin.from("api_keys").update({ revoked: 1 }).eq("id", id);
  assertSupabase(result, "revokeApiKey");
}

async function getWebhooksByUser(userId, { activeOnly = false } = {}) {
  if (!usingSupabase) {
    const query = activeOnly
      ? "SELECT * FROM webhooks WHERE user_id = ? AND is_active = 1"
      : "SELECT * FROM webhooks WHERE user_id = ? ORDER BY created_at DESC";
    return db.prepare(query).all(userId);
  }
  let query = supabaseAdmin.from("webhooks").select("*").eq("user_id", userId);
  if (activeOnly) {
    query = query.eq("is_active", 1);
  } else {
    query = query.order("created_at", { ascending: false });
  }
  const result = await query;
  return assertSupabase(result, "getWebhooksByUser");
}

async function createWebhookRecord(payload) {
  if (!usingSupabase) {
    db.prepare(
      `INSERT INTO webhooks
        (id, user_id, name, url, events_json, is_active, last_status, last_triggered_at, created_at)
       VALUES (?, ?, ?, ?, ?, 1, NULL, NULL, ?)`
    ).run(payload.id, payload.user_id, payload.name, payload.url, payload.events_json, payload.created_at);
    return getWebhookById(payload.id);
  }
  const result = await supabaseAdmin
    .from("webhooks")
    .insert({
      ...payload,
      is_active: 1,
      last_status: null,
      last_triggered_at: null,
    })
    .select("*")
    .single();
  return assertSupabase(result, "createWebhookRecord");
}

async function getWebhookById(id) {
  if (!usingSupabase) {
    return db.prepare("SELECT * FROM webhooks WHERE id = ?").get(id);
  }
  const result = await supabaseAdmin.from("webhooks").select("*").eq("id", id).maybeSingle();
  return assertSupabase(result, "getWebhookById");
}

async function getWebhookByIdAndUser(id, userId) {
  if (!usingSupabase) {
    return db.prepare("SELECT * FROM webhooks WHERE id = ? AND user_id = ?").get(id, userId);
  }
  const result = await supabaseAdmin
    .from("webhooks")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();
  return assertSupabase(result, "getWebhookByIdAndUser");
}

async function deleteWebhook(id) {
  if (!usingSupabase) {
    db.prepare("DELETE FROM webhooks WHERE id = ?").run(id);
    return;
  }
  const result = await supabaseAdmin.from("webhooks").delete().eq("id", id);
  assertSupabase(result, "deleteWebhook");
}

async function updateWebhookDelivery(id, status, triggeredAt) {
  if (!usingSupabase) {
    db.prepare("UPDATE webhooks SET last_status = ?, last_triggered_at = ? WHERE id = ?").run(status, triggeredAt, id);
    return;
  }
  const result = await supabaseAdmin
    .from("webhooks")
    .update({ last_status: status, last_triggered_at: triggeredAt })
    .eq("id", id);
  assertSupabase(result, "updateWebhookDelivery");
}

async function insertWebhookLog(payload) {
  if (!usingSupabase) {
    db.prepare(
      "INSERT INTO webhook_logs (id, webhook_id, event_type, status, response_body, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(payload.id, payload.webhook_id, payload.event_type, payload.status, payload.response_body, payload.created_at);
    return;
  }
  const result = await supabaseAdmin.from("webhook_logs").insert(payload);
  assertSupabase(result, "insertWebhookLog");
}

async function countWebhookLogs() {
  if (!usingSupabase) {
    return db.prepare("SELECT COUNT(*) as count FROM webhook_logs").get().count;
  }
  const result = await supabaseAdmin.from("webhook_logs").select("id", { count: "exact", head: true });
  assertSupabase(result, "countWebhookLogs");
  return result.count || 0;
}

async function listPostSlugsByUser(userId) {
  if (!usingSupabase) {
    return db.prepare("SELECT slug FROM posts WHERE user_id = ?").all(userId);
  }
  const result = await supabaseAdmin.from("posts").select("slug").eq("user_id", userId);
  return assertSupabase(result, "listPostSlugsByUser");
}

async function getPostIdByUserAndSlug(userId, slug) {
  if (!usingSupabase) {
    return db.prepare("SELECT id FROM posts WHERE user_id = ? AND slug = ?").get(userId, slug);
  }
  const result = await supabaseAdmin.from("posts").select("id").eq("user_id", userId).eq("slug", slug).maybeSingle();
  return assertSupabase(result, "getPostIdByUserAndSlug");
}

async function listPostsByUser(userId, { status = "all", onlyPublished = false, orderByViews = false, publicOrder = false } = {}) {
  if (!usingSupabase) {
    const params = [userId];
    let query = "SELECT * FROM posts WHERE user_id = ?";
    if (onlyPublished) {
      query += " AND status = 'published'";
    } else if (status !== "all") {
      query += " AND status = ?";
      params.push(status);
    }
    if (orderByViews) {
      query += " ORDER BY views DESC";
    } else if (publicOrder) {
      query += " ORDER BY published_at DESC, updated_at DESC";
    } else {
      query += " ORDER BY updated_at DESC";
    }
    return db.prepare(query).all(...params);
  }

  let query = supabaseAdmin.from("posts").select("*").eq("user_id", userId);
  if (onlyPublished) {
    query = query.eq("status", "published");
  } else if (status !== "all") {
    query = query.eq("status", status);
  }
  if (orderByViews) {
    query = query.order("views", { ascending: false });
  } else if (publicOrder) {
    query = query.order("published_at", { ascending: false, nullsFirst: false }).order("updated_at", { ascending: false });
  } else {
    query = query.order("updated_at", { ascending: false });
  }
  const result = await query;
  return assertSupabase(result, "listPostsByUser");
}

async function listPublishedPostsByUserPublic(userId) {
  if (!usingSupabase) {
    return listPostsByUser(userId, { onlyPublished: true, publicOrder: true });
  }
  if (!usingSupabasePublic) {
    return listPostsByUser(userId, { onlyPublished: true, publicOrder: true });
  }
  const result = await supabasePublic
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });
  return assertSupabase(result, "listPublishedPostsByUserPublic");
}

async function getPostById(id) {
  if (!usingSupabase) {
    return db.prepare("SELECT * FROM posts WHERE id = ?").get(id);
  }
  const result = await supabaseAdmin.from("posts").select("*").eq("id", id).maybeSingle();
  return assertSupabase(result, "getPostById");
}

async function getPostByIdAndUser(id, userId) {
  if (!usingSupabase) {
    return db.prepare("SELECT * FROM posts WHERE id = ? AND user_id = ?").get(id, userId);
  }
  const result = await supabaseAdmin.from("posts").select("*").eq("id", id).eq("user_id", userId).maybeSingle();
  return assertSupabase(result, "getPostByIdAndUser");
}

async function getPostByUserAndSlug(userId, slug, { publishedOnly = false } = {}) {
  if (!usingSupabase) {
    const query = publishedOnly
      ? "SELECT * FROM posts WHERE user_id = ? AND slug = ? AND status = 'published'"
      : "SELECT * FROM posts WHERE user_id = ? AND slug = ?";
    return db.prepare(query).get(userId, slug);
  }
  const client = publishedOnly && usingSupabasePublic ? supabasePublic : supabaseAdmin;
  let q = client.from("posts").select("*").eq("user_id", userId).eq("slug", slug);
  if (publishedOnly) {
    q = q.eq("status", "published");
  }
  const result = await q.maybeSingle();
  return assertSupabase(result, "getPostByUserAndSlug");
}

async function createPostRecord(payload) {
  if (!usingSupabase) {
    db.prepare(
      `INSERT INTO posts
        (id, user_id, title, slug, excerpt, content_json, status, series, chapter, difficulty, tags_json, read_time, views, created_at, updated_at, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`
    ).run(
      payload.id,
      payload.user_id,
      payload.title,
      payload.slug,
      payload.excerpt,
      payload.content_json,
      payload.status,
      payload.series,
      payload.chapter,
      payload.difficulty,
      payload.tags_json,
      payload.read_time,
      payload.created_at,
      payload.updated_at,
      payload.published_at
    );
    return getPostById(payload.id);
  }

  const result = await supabaseAdmin
    .from("posts")
    .insert({ ...payload, views: 0 })
    .select("*")
    .single();
  return assertSupabase(result, "createPostRecord");
}

async function updatePostRecord(id, payload) {
  if (!usingSupabase) {
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
    ).run({ id, ...payload });
    return getPostById(id);
  }

  const result = await supabaseAdmin
    .from("posts")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  return assertSupabase(result, "updatePostRecord");
}

async function deletePost(id) {
  if (!usingSupabase) {
    db.prepare("DELETE FROM posts WHERE id = ?").run(id);
    return;
  }
  const result = await supabaseAdmin.from("posts").delete().eq("id", id);
  assertSupabase(result, "deletePost");
}

async function incrementPostViews(id, currentViews = null) {
  if (!usingSupabase) {
    db.prepare("UPDATE posts SET views = views + 1 WHERE id = ?").run(id);
    return;
  }
  const nextViews = Number(currentViews ?? 0) + 1;
  const result = await supabaseAdmin.from("posts").update({ views: nextViews }).eq("id", id);
  assertSupabase(result, "incrementPostViews");
}

async function insertPageView(payload) {
  if (!usingSupabase) {
    db.prepare(
      "INSERT INTO page_views (id, user_id, post_id, source, country, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(payload.id, payload.user_id, payload.post_id, payload.source, payload.country, payload.created_at);
    return;
  }
  const result = await supabaseAdmin.from("page_views").insert(payload);
  assertSupabase(result, "insertPageView");
}

async function listPageViewsByUser(userId) {
  if (!usingSupabase) {
    return db.prepare("SELECT * FROM page_views WHERE user_id = ?").all(userId);
  }
  const result = await supabaseAdmin.from("page_views").select("*").eq("user_id", userId);
  return assertSupabase(result, "listPageViewsByUser");
}

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "MISSING_AUTH" });
  }

  try {
    const payload = verifyToken(token);
    const user = await getUserById(payload.sub);
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

async function apiKeyMiddleware(req, res, next) {
  const key = req.headers["x-api-key"];
  if (!key || typeof key !== "string") {
    return res.status(401).json({ error: "MISSING_AUTH" });
  }

  const keyHash = hashApiKey(key);
  const row = await getApiKeyByHash(keyHash);

  if (!row) {
    return res.status(401).json({ error: "INVALID_KEY" });
  }

  if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
    return res.status(401).json({ error: "INVALID_KEY" });
  }

  await touchApiKeyLastUsed(row.id, nowIso());
  req.apiKey = row;
  req.keyUser = await getUserById(row.user_id);

  if (!req.keyUser) {
    return res.status(401).json({ error: "INVALID_KEY" });
  }

  return next();
}

async function triggerWebhooks(userId, eventType, payload) {
  const hooks = await getWebhooksByUser(userId, { activeOnly: true });

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
    await updateWebhookDelivery(hook.id, status, now);
    await insertWebhookLog({
      id: generateId("wlg"),
      webhook_id: hook.id,
      event_type: eventType,
      status,
      response_body: responseBody.slice(0, 2000),
      created_at: now,
    });
  }
}

async function ensureUniqueSlug(userId, desiredSlug, postId = null) {
  let slug = desiredSlug || "untitled";
  let i = 1;

  while (true) {
    const row = await getPostIdByUserAndSlug(userId, slug);

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

  const slugRows = await listPostSlugsByUser(userId);
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
    runtimeProvider: usingSupabase ? "supabase" : "sqlite",
    cache: cacheMeta,
    supabase: supabaseMeta,
  });
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
  const existing = await findExistingUserByEmailOrUsername(email, username);

  if (existing) {
    return res.status(409).json({ error: "USER_EXISTS" });
  }

  const now = nowIso();
  const userId = generateId("usr");
  const passwordHash = await hashPassword(password);

  const user = await createUserRecord({
    id: userId,
    name,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    passwordHash,
    createdAt: now,
    updatedAt: now,
  });
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
  const user = await getUserByEmail(email);

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
    const taken = await isUsernameTaken(next.username, req.user.id);
    if (taken) {
      return res.status(409).json({ error: "USERNAME_TAKEN" });
    }
  }

  if (next.email && next.email !== req.user.email) {
    const taken = await isEmailTaken(next.email, req.user.id);
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

  const updated = await updateUserRecord(fields);
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
      const posts = (await listPostsByUser(req.user.id, { status: normalizedStatus })).map(mapPost);
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
  const slug = await ensureUniqueSlug(req.user.id, rawSlug || "untitled");
  const status = data.status || "draft";
  const postId = generateId("pst");

  const post = await createPostRecord({
    id: postId,
    user_id: req.user.id,
    title: data.title,
    slug,
    excerpt: data.excerpt || "",
    content_json: JSON.stringify(data.content || []),
    status,
    series: data.series || "",
    chapter: data.chapter ?? null,
    difficulty: data.difficulty || "intermediate",
    tags_json: JSON.stringify(data.tags || []),
    read_time: data.readTime || "5 min",
    created_at: now,
    updated_at: now,
    published_at: status === "published" ? now : null,
  });
  const mapped = mapPost(post);
  const eventType = status === "published" ? "post.published" : "post.created";
  await triggerWebhooks(req.user.id, eventType, mapped);
  await invalidateUserCaches({ userId: req.user.id, username: req.user.username });

  return res.status(201).json({ data: mapped });
});

app.patch("/api/posts/:id", authMiddleware, async (req, res) => {
  const existing = await getPostByIdAndUser(req.params.id, req.user.id);

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
  const nextSlug = await ensureUniqueSlug(req.user.id, baseSlug, existing.id);
  const nextStatus = data.status ?? existing.status;

  const updated = await updatePostRecord(existing.id, {
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
  const mapped = mapPost(updated);
  const eventType = nextStatus === "published" ? "post.published" : "post.updated";
  await triggerWebhooks(req.user.id, eventType, mapped);
  await invalidateUserCaches({ userId: req.user.id, username: req.user.username });

  return res.json({ data: mapped });
});

app.delete("/api/posts/:id", authMiddleware, async (req, res) => {
  const existing = await getPostByIdAndUser(req.params.id, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  await deletePost(existing.id);
  await triggerWebhooks(req.user.id, "post.deleted", mapPost(existing));
  await invalidateUserCaches({ userId: req.user.id, username: req.user.username });
  return res.status(204).send();
});

app.post("/api/posts/:id/view", async (req, res) => {
  const post = await getPostById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  await incrementPostViews(post.id, Number(post.views || 0));
  await insertPageView({
    id: generateId("pv"),
    user_id: post.user_id,
    post_id: post.id,
    source: req.body?.source || "Direct",
    country: req.body?.country || "Unknown",
    created_at: nowIso(),
  });
  const owner = await getUserById(post.user_id);
  await invalidateUserCaches({ userId: post.user_id, username: owner?.username });

  return res.json({ ok: true });
});

app.get("/api/api-keys", authMiddleware, async (req, res) => {
  const keys = (await listApiKeysByUser(req.user.id)).map(mapApiKey);

  return res.json({ data: keys });
});

app.post("/api/api-keys", authMiddleware, async (req, res) => {
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

  const record = await createApiKeyRecord({
    id,
    user_id: req.user.id,
    name: data.name,
    key_prefix: masked,
    key_hash: hashApiKey(key),
    permissions_json: JSON.stringify(data.permissions),
    expires_at: data.expiresAt || null,
    created_at: createdAt,
    revoked: 0,
  });
  return res.status(201).json({ data: mapApiKey(record), apiKey: key });
});

app.delete("/api/api-keys/:id", authMiddleware, async (req, res) => {
  const existing = await getApiKeyByIdAndUser(req.params.id, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  await revokeApiKey(existing.id);
  return res.status(204).send();
});

app.get("/api/webhooks", authMiddleware, async (req, res) => {
  const hooks = (await getWebhooksByUser(req.user.id)).map(mapWebhook);
  return res.json({ data: hooks });
});

app.post("/api/webhooks", authMiddleware, async (req, res) => {
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
  const hook = await createWebhookRecord({
    id,
    user_id: req.user.id,
    name: data.name,
    url: data.url,
    events_json: JSON.stringify(data.events),
    created_at: nowIso(),
  });
  return res.status(201).json({ data: mapWebhook(hook) });
});

app.post("/api/webhooks/:id/test", authMiddleware, async (req, res) => {
  const hook = await getWebhookByIdAndUser(req.params.id, req.user.id);

  if (!hook) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  await triggerWebhooks(req.user.id, "webhook.test", {
    id: hook.id,
    name: hook.name,
    source: "manual-test",
  });

  const fresh = await getWebhookById(hook.id);
  return res.json({ data: mapWebhook(fresh) });
});

app.delete("/api/webhooks/:id", authMiddleware, async (req, res) => {
  const hook = await getWebhookByIdAndUser(req.params.id, req.user.id);

  if (!hook) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  await deleteWebhook(hook.id);
  return res.status(204).send();
});

app.get("/api/analytics/overview", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const key = cacheKey(["analytics", userId]);

  return cachedJson(
    res,
    key,
    async () => {
      const posts = await listPostsByUser(userId, { status: "all" });
      const pageViews = await listPageViewsByUser(userId);

      const totalPosts = posts.length;
      const totalViews = posts.reduce((sum, row) => sum + Number(row.views || 0), 0);
      const publishedPosts = posts.filter((row) => row.status === "published").length;

      const trafficMap = new Map();
      pageViews.forEach((view) => {
        const source = view.source || "Other";
        trafficMap.set(source, (trafficMap.get(source) || 0) + 1);
      });
      const traffic = [...trafficMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));

      const topPosts = [...posts]
        .sort((a, b) => Number(b.views || 0) - Number(a.views || 0))
        .slice(0, 5)
        .map((row) => ({ name: `${row.title.split(" ").slice(0, 3).join(" ")}…`, views: Number(row.views || 0) }));

      const thirtyDaysAgo = Date.now() - 30 * 86400000;
      const chartMap = new Map();
      pageViews.forEach((view) => {
        const created = new Date(view.created_at || 0).getTime();
        if (!Number.isFinite(created) || created < thirtyDaysAgo) {
          return;
        }
        const day = String(view.created_at || "").slice(0, 10);
        chartMap.set(day, (chartMap.get(day) || 0) + 1);
      });
      const chart = [...chartMap.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([day, views]) => ({ day, views }));

      const geoMap = new Map();
      pageViews.forEach((view) => {
        const country = view.country || "Unknown";
        geoMap.set(country, (geoMap.get(country) || 0) + 1);
      });
      const geo = [...geoMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([country, visitors]) => ({ country, visitors }));

      const performance = [...posts]
        .sort((a, b) => Number(b.views || 0) - Number(a.views || 0))
        .map((row) => ({
          id: row.id,
          title: row.title,
          views: Number(row.views || 0),
          avgRead: `${40 + (Number(row.views || 0) % 35)}%`,
          subscribers: Math.floor(Number(row.views || 0) / 8),
          published: String(row.created_at || "").slice(0, 10),
          series: row.series || "General",
          status: row.status,
          readTime: row.read_time,
        }));

      const webhookLogCount = await countWebhookLogs();

      return {
        data: {
          kpis: {
            totalPosts,
            totalViews,
            uniqueVisitors: Math.floor(totalViews * 0.48),
            avgReadTime: "6.2 min",
            subscribers: 800 + publishedPosts * 13,
            apiCalls: webhookLogCount + 1200,
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

  const user = await getPublicProfileByUsername(username);
  if (!user) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  const publishedPosts = await listPublishedPostsByUserPublic(user.id);
  const totalPublishedViews = publishedPosts.reduce((sum, post) => sum + Number(post.views || 0), 0);

  const payload = {
    data: {
      ...mapPublicProfile(user),
      stats: {
        posts: publishedPosts.length,
        views: totalPublishedViews,
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

  const user = await getPublicProfileByUsername(username);
  if (!user) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  const posts = (await listPublishedPostsByUserPublic(user.id)).map(mapPost);

  const payload = { data: posts };
  await cacheSet(key, payload, 120);
  res.setHeader("x-cache", "MISS");
  return res.json(payload);
});

app.get("/api/public/:username/posts/:slug", async (req, res) => {
  const user = await getPublicProfileByUsername(req.params.username);
  if (!user) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  const post = await getPostByUserAndSlug(user.id, req.params.slug, { publishedOnly: true });

  if (!post) {
    return res.status(404).json({ error: "NOT_FOUND" });
  }

  await incrementPostViews(post.id, Number(post.views || 0));
  await insertPageView({
    id: generateId("pv"),
    user_id: user.id,
    post_id: post.id,
    source: "Direct",
    country: "Unknown",
    created_at: nowIso(),
  });

  await invalidateUserCaches({ userId: user.id, username: user.username });

  const fresh = await getPostById(post.id);
  return res.json({ data: mapPost(fresh) });
});

app.get("/v1/posts", apiKeyMiddleware, async (req, res) => {
  const status = req.query.status || "published";
  const key = cacheKey(["v1", req.keyUser.id, "posts", status]);

  return cachedJson(
    res,
    key,
    async () => {
      const posts = (await listPostsByUser(req.keyUser.id, { status })).map(mapPost);
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

  const post = await getPostByUserAndSlug(req.keyUser.id, req.params.slug);

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
