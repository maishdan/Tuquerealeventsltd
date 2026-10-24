import { createServerClient } from "@supabase/ssr";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://ywqfvlrfvxilwioifgqo.supabase.co";

const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3cWZ2bHJmdnhpbHdpb2lmZ3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNTEzMDUsImV4cCI6MjEwNzcyNzMwNX0.oUGdgZ7butv3Z3qq_KUBZRR5LPEqegU3G_5xMbFebwA";

export const createClient = (request: any) => {
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies?.getAll() || [];
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies?.set(name, value)
        );
      },
    },
  });
};
