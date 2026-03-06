import { Redis } from "@upstash/redis";
import { config } from "../config.js";

function isConfigured(value) {
  if (!value) {
    return false;
  }
  return !String(value).includes("xxx") && !String(value).includes("...");
}

const hasRedis = Boolean(isConfigured(config.cache.url) && isConfigured(config.cache.token));
const redis = hasRedis
  ? new Redis({
      url: config.cache.url,
      token: config.cache.token,
    })
  : null;

const localStore = new Map();

function isLocalHitValid(entry) {
  return entry && entry.expiresAt > Date.now();
}

export async function cacheGet(key) {
  if (!key) {
    return null;
  }

  if (redis) {
    try {
      const value = await redis.get(key);
      return value ?? null;
    } catch {
      // fall through to local fallback
    }
  }

  const local = localStore.get(key);
  if (!isLocalHitValid(local)) {
    localStore.delete(key);
    return null;
  }

  return local.value;
}

export async function cacheSet(key, value, ttlSeconds = config.cache.ttlSeconds) {
  if (!key) {
    return;
  }

  const ttl = Math.max(1, Number(ttlSeconds) || config.cache.ttlSeconds);

  if (redis) {
    try {
      await redis.set(key, value, { ex: ttl });
      return;
    } catch {
      // fall through to local fallback
    }
  }

  localStore.set(key, {
    value,
    expiresAt: Date.now() + ttl * 1000,
  });
}

export async function cacheDeleteMany(keys = []) {
  const normalized = [...new Set((keys || []).filter(Boolean))];
  if (normalized.length === 0) {
    return;
  }

  if (redis) {
    try {
      await redis.del(...normalized);
    } catch {
      // keep local invalidation anyway
    }
  }

  normalized.forEach((key) => localStore.delete(key));
}

export function cacheKey(parts = []) {
  return `scribe:${parts.filter(Boolean).join(":")}`;
}

export const cacheMeta = {
  enabled: hasRedis,
  provider: hasRedis ? "upstash" : "local-memory",
  defaultTtlSeconds: config.cache.ttlSeconds,
};
