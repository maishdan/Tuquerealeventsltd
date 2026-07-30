import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Royal Touch Events Supabase project.
// The URL and anon (publishable) key are safe to ship to the browser —
// all access is protected by Row Level Security policies.
const FALLBACK_URL = "https://asakgmwsgjlsxtqhuybj.supabase.co";
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzYWtnbXdzZ2psc3h0cWh1eWJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NzY4OTIsImV4cCI6MjA5NjQ1Mjg5Mn0.MgomS-te1Q425uwktnGd2QaWUNagWKvBuEafhu5moKE";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;

const isBrowser = typeof window !== "undefined";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: isBrowser,
    autoRefreshToken: isBrowser,
    detectSessionInUrl: isBrowser,
    storageKey: "royal-touch-auth",
  },
});
