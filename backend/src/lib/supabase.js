import { createClient } from "@supabase/supabase-js";
import { config } from "../config.js";

function isConfigured(value) {
  if (!value) {
    return false;
  }
  return !String(value).includes("xxx") && !String(value).includes("...");
}

const hasSupabaseConfig = Boolean(
  isConfigured(config.supabase.url) &&
    isConfigured(config.supabase.anonKey) &&
    isConfigured(config.supabase.serviceRoleKey)
);

export const supabaseAdmin = hasSupabaseConfig
  ? createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export const supabasePublic = hasSupabaseConfig
  ? createClient(config.supabase.url, config.supabase.anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export const supabaseMeta = {
  enabled: hasSupabaseConfig,
  url: config.supabase.url || null,
};
