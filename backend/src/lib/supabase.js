import { createClient } from "@supabase/supabase-js";
import { config } from "../config.js";

function isConfigured(value) {
  if (!value) {
    return false;
  }
  return !String(value).includes("xxx") && !String(value).includes("...");
}

const hasSupabaseUrl = Boolean(isConfigured(config.supabase.url));
const hasSupabaseAnon = Boolean(hasSupabaseUrl && isConfigured(config.supabase.anonKey));
const hasSupabaseAdmin = Boolean(hasSupabaseUrl && isConfigured(config.supabase.serviceRoleKey));

export const supabaseAdmin = hasSupabaseAdmin
  ? createClient(config.supabase.url, config.supabase.serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export const supabasePublic = hasSupabaseAnon
  ? createClient(config.supabase.url, config.supabase.anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export const supabaseMeta = {
  enabled: hasSupabaseAdmin,
  adminEnabled: hasSupabaseAdmin,
  publicEnabled: hasSupabaseAnon,
  url: config.supabase.url || null,
};
