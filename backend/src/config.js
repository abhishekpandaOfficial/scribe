import dotenv from "dotenv";

dotenv.config();

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const config = {
  port: Number(process.env.API_PORT || 8787),
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  dbPath: process.env.DB_PATH || "backend/data/scribe.db",
  appBaseUrl: process.env.APP_BASE_URL || "http://127.0.0.1:4173",
  dataProvider: process.env.DATA_PROVIDER || "sqlite",
  supabase: {
    url:
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.VITE_SUPABASE_URL ||
      "",
    anonKey:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  },
  cache: {
    url: process.env.UPSTASH_REDIS_URL || "",
    token: process.env.UPSTASH_REDIS_TOKEN || "",
    ttlSeconds: toNumber(process.env.CACHE_TTL_SECONDS, 90),
  },
  auth: {
    nextAuthSecret: process.env.NEXTAUTH_SECRET || "",
    nextAuthUrl: process.env.NEXTAUTH_URL || "",
  },
  storage: {
    bucket: process.env.CLOUDFLARE_R2_BUCKET || "",
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || "",
    accessKey: process.env.CLOUDFLARE_R2_ACCESS_KEY || "",
    secretKey: process.env.CLOUDFLARE_R2_SECRET_KEY || "",
  },
  webhooks: {
    inngestEventKey: process.env.INNGEST_EVENT_KEY || "",
    inngestSigningKey: process.env.INNGEST_SIGNING_KEY || "",
  },
  payments: {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    stripePublishableKey:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
      process.env.VITE_STRIPE_PUBLISHABLE_KEY ||
      "",
  },
  email: {
    resendApiKey: process.env.RESEND_API_KEY || "",
  },
  analytics: {
    tinybirdToken: process.env.TINYBIRD_TOKEN || "",
  },
};
