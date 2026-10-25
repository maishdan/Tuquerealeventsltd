-- =================================================================───────────
-- 🏆 TOQUE REAL EVENTS LIMITED — PRODUCTION SUPABASE SQL SETUP & FEATURED EVENTS
-- =================================================================───────────

-- 1. Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  city TEXT,
  role TEXT DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure profile columns exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 3. Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  event_type TEXT NOT NULL,
  event_date DATE,
  guests TEXT,
  budget TEXT NOT NULL DEFAULT '0',
  services TEXT[] DEFAULT '{}',
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Events Table with FEATURED Column
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE,
  venue TEXT,
  budget NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'upcoming',
  featured BOOLEAN DEFAULT false,
  description TEXT,
  poster_url TEXT,
  organizer_name TEXT,
  organizer_email TEXT,
  organizer_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure featured column exists in public.events
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- 5. Create Tickets Table
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  ticket_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  tier TEXT DEFAULT 'VIP',
  status TEXT DEFAULT 'valid',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Prospects Table
CREATE TABLE IF NOT EXISTS public.prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  event TEXT,
  location TEXT,
  date TEXT,
  guests TEXT,
  budget NUMERIC DEFAULT 0,
  score NUMERIC DEFAULT 85,
  source TEXT DEFAULT 'AI Lead Engine',
  urgency TEXT DEFAULT 'High',
  recommendation TEXT,
  status TEXT DEFAULT 'New Lead',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Contacts Table & Contact Inquiries Alias View
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE VIEW public.contact_inquiries AS SELECT * FROM public.contacts;

-- 8. Enable Row Level Security & Grant Permissions
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Events" ON public.events;
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin Manage Events" ON public.events;
CREATE POLICY "Admin Manage Events" ON public.events FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Bookings" ON public.bookings;
CREATE POLICY "Public Read Bookings" ON public.bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Tickets" ON public.tickets;
CREATE POLICY "Public Read Tickets" ON public.tickets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Prospects" ON public.prospects;
CREATE POLICY "Public Read Prospects" ON public.prospects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin Manage Prospects" ON public.prospects;
CREATE POLICY "Admin Manage Prospects" ON public.prospects FOR ALL USING (true);

-- 9. Reload PostgREST Cache
NOTIFY pgrst, 'reload schema';

SELECT 'SUCCESS: Database schema updated with featured events & prospects flow!' AS status;
