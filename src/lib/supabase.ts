import { createClient } from "@supabase/supabase-js";

// Royal Touch Events Supabase project configuration.
const FALLBACK_URL = "https://asakgmwsgjlsxtqhuybj.supabase.co";
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzYWtnbXdzZ2psc3h0cWh1eWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NzY4OTIsImV4cCI6MjA5NjQ1Mjg5Mn0.MgomS-te1Q425uwktnGd2QaWUNagWKvBuEafhu5moKE";

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL).trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY).trim();

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
const supabaseAnonKey = (rawKey && rawKey !== "") ? rawKey : FALLBACK_ANON_KEY;

const isBrowser = typeof window !== "undefined";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: isBrowser,
    autoRefreshToken: isBrowser,
    detectSessionInUrl: isBrowser,
    storageKey: "royal-touch-auth",
  },
});
