-- =================================================================───────────
-- 🛡️ TOQUE REAL EVENTS — GRANT ADMIN ROLE TO ABIGAEL MUTHONI
-- User ID: b929c239-2a5a-407d-918c-a5a598a6823e
-- Email: abigaelmuthoni29@gmail.com
-- =================================================================───────────

-- 1. Ensure user_role ENUM type exists
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'staff', 'customer', 'client');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Ensure public.profiles table schema exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  city TEXT,
  role user_role DEFAULT 'customer'::user_role,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Update auth.users metadata so Supabase Auth recognizes 'admin' role directly
UPDATE auth.users
SET
  raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb,
  raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE id = 'b929c239-2a5a-407d-918c-a5a598a6823e'
   OR LOWER(email) = 'abigaelmuthoni29@gmail.com';

-- 4. Upsert Admin Profile in public.profiles table
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  avatar_url,
  role,
  created_at,
  updated_at
)
VALUES (
  'b929c239-2a5a-407d-918c-a5a598a6823e',
  'abigaelmuthoni29@gmail.com',
  'Abigael Muthoni',
  'https://lh3.googleusercontent.com/a/ACg8ocJJwES5Jinj6dB3aZMJlZPHsJEmlsfwzMs65Q7zrfzFNK40IUA=s96-c',
  'admin'::user_role,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin'::user_role,
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = NOW();

-- 5. Helper function to check admin privileges
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role = 'admin'::user_role
  )
$$;

GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;

-- 6. Grant table permissions & RLS policies
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_admin_select_all" ON public.profiles;
CREATE POLICY "profiles_admin_select_all" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "profiles_admin_update_all" ON public.profiles;
CREATE POLICY "profiles_admin_update_all" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin(auth.uid()))
  WITH CHECK (id = auth.uid() OR public.is_admin(auth.uid()));

-- 7. Verify updated profile
SELECT id, email, full_name, role, updated_at
FROM public.profiles
WHERE id = 'b929c239-2a5a-407d-918c-a5a598a6823e' OR LOWER(email) = 'abigaelmuthoni29@gmail.com';
