-- =================================================================───────────
-- 🛡️ ROYAL TOUCH EVENTS — ADMIN PROFILES & ROLES SETUP
-- =================================================================───────────
-- Run this script in the Supabase SQL Editor to ensure all admin accounts
-- (maishdan4940@gmail.com, eventsroyaltouch7@gmail.com, abigaelmuthoni29@gmail.com)
-- have unique, non-conflicting profile names and 'admin' role permissions.
-- =================================================================───────────

-- 1. Ensure user_role ENUM contains 'admin'
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

-- 3. Upsert Executive Admin Account: maishdan4940@gmail.com
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', 'Dan Maish') AS full_name,
  'admin'::user_role AS role,
  NOW(),
  NOW()
FROM auth.users
WHERE LOWER(email) = 'maishdan4940@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin'::user_role,
  full_name = CASE
    WHEN public.profiles.full_name IS NULL OR public.profiles.full_name = 'Japheth Owiyo' THEN 'Dan Maish'
    ELSE public.profiles.full_name
  END;

-- 4. Upsert C.E.O Account: eventsroyaltouch7@gmail.com
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
SELECT
  id,
  email,
  'Japheth Owiyo' AS full_name,
  'admin'::user_role AS role,
  NOW(),
  NOW()
FROM auth.users
WHERE LOWER(email) = 'eventsroyaltouch7@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin'::user_role,
  full_name = 'Japheth Owiyo';

-- 5. Upsert Super Admin Developer Account: abigaelmuthoni29@gmail.com
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
SELECT
  id,
  email,
  'DANIWEST' AS full_name,
  'admin'::user_role AS role,
  NOW(),
  NOW()
FROM auth.users
WHERE LOWER(email) = 'abigaelmuthoni29@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin'::user_role,
  full_name = 'DANIWEST';

-- 6. Helper function to check admin privileges
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _user_id AND role = 'admin'
  )
$$;

GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;

-- 7. Grant table access permissions & RLS policies
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
