import { createClient } from "@supabase/supabase-js";

// Royal Touch Events Supabase project configuration.
const FALLBACK_URL = "https://asakgmwsgjlsxtqhuybj.supabase.co";
const FALLBACK_ANON_KEY = "sb_publishable_Ubqo4jnctHdgscUJRXNnLg_wMUov3AS";

const rawUrl = (
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  FALLBACK_URL
).trim();

const rawKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  FALLBACK_ANON_KEY
).trim();

// Super safe URL parsing to avoid SSR crashes
const getSafeUrl = (url: string) => {
  try {
    if (!url || url === "") return FALLBACK_URL;
    return url.replace(/\/+$/, "").replace("/rest/v1", "").replace("/auth/v1", "");
  } catch {
    return FALLBACK_URL;
  }
};

const supabaseUrl = getSafeUrl(rawUrl);
const supabaseAnonKey = rawKey && rawKey !== "" ? rawKey : FALLBACK_ANON_KEY;

const isBrowser = typeof window !== "undefined";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: isBrowser,
    autoRefreshToken: isBrowser,
    detectSessionInUrl: isBrowser,
    storageKey: "royal-touch-auth",
  },
});
