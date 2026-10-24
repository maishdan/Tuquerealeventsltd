-- =================================================================───────────
-- 🏆 TOQUE REAL EVENTS LIMITED — PRODUCTION SUPABASE SQL SETUP & TABLE RESTORATION
-- =================================================================───────────
-- Purpose:
-- Fixes HTTP 404 (Not Found) errors on Supabase REST API endpoints by creating all
-- 16 database tables, ENUM types, primary keys, foreign keys, alias views, RLS policies,
-- and reloading PostgREST schema cache.
-- =================================================================───────────

-- ----------------------------------------------------------------------------
-- STEP 1: CREATE EXTENSIONS & ENUM TYPES
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Roles
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'staff', 'customer', 'client');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Booking & Payment Enums
DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'planning', 'inquiry', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE booking_payment_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE booking_state AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'EXPIRED', 'COMPLETED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Event Lifecycle Enums
DO $$ BEGIN
    CREATE TYPE event_status AS ENUM ('in-progress', 'upcoming', 'completed', 'delayed', 'confirmed', 'planning', 'inquiry');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE event_lifecycle_state AS ENUM ('DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Contact Inquiry Status
DO $$ BEGIN
    CREATE TYPE contact_status AS ENUM ('new', 'read', 'replied', 'archived');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Ticket Enums
DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM ('valid', 'used', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Seat Status
DO $$ BEGIN
    CREATE TYPE seat_status AS ENUM ('available', 'selected', 'occupied', 'reserved');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- STEP 2: CREATE / UPDATE ALL TABLES
-- ----------------------------------------------------------------------------

-- 1. User Profiles (Preserved & Protected)
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

-- Ensure profile columns exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Sales & CRM Bookings
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
  status booking_status DEFAULT 'pending'::booking_status,
  seat_number TEXT,
  payment_status booking_payment_status DEFAULT 'PENDING'::booking_payment_status,
  booking_state booking_state DEFAULT 'PENDING_PAYMENT'::booking_state,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Event Production Hub
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE,
  venue TEXT,
  budget NUMERIC DEFAULT 0,
  status event_status DEFAULT 'upcoming'::event_status,
  lifecycle_state event_lifecycle_state DEFAULT 'PUBLISHED'::event_lifecycle_state,
  description TEXT,
  poster_url TEXT,
  organizer_name TEXT,
  organizer_email TEXT,
  organizer_phone TEXT,
  start_time TIME,
  end_time TIME,
  team_count INT DEFAULT 1,
  vendor_count INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Ticket Pricing Classes
CREATE TABLE IF NOT EXISTS public.ticket_classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  quantity_available INT NOT NULL DEFAULT 100,
  quantity_sold INT NOT NULL DEFAULT 0,
  benefits TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Customer Issued Tickets & Passes
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  ticket_class_id UUID REFERENCES public.ticket_classes(id) ON DELETE SET NULL,
  ticket_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  tier TEXT DEFAULT 'VIP',
  status ticket_status DEFAULT 'valid'::ticket_status,
  qr_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Event Venue Seats
CREATE TABLE IF NOT EXISTS public.seats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  seat_number TEXT NOT NULL,
  seat_type TEXT DEFAULT 'VIP',
  status seat_status DEFAULT 'available'::seat_status,
  price NUMERIC DEFAULT 0,
  locked_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Payment Transactions (M-PESA / Cards)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  mpesa_receipt TEXT UNIQUE,
  provider TEXT DEFAULT 'M-PESA',
  status booking_payment_status DEFAULT 'PENDING'::booking_payment_status,
  paid_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Sales Proposals & Quotes
CREATE TABLE IF NOT EXISTS public.proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  event_name TEXT NOT NULL,
  proposal_title TEXT NOT NULL,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  proposal_body TEXT NOT NULL,
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Inbound Contacts & Inquiries
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status contact_status DEFAULT 'new'::contact_status,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alias view for contact_inquiries (resolves 404 on contact_inquiries endpoint)
CREATE OR REPLACE VIEW public.contact_inquiries AS SELECT * FROM public.contacts;

-- 10. Direct In-App Client Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  from_name TEXT NOT NULL,
  from_role TEXT DEFAULT 'Admin',
  subject TEXT,
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Financial Records (Ledger, Revenue & Expenses)
CREATE TABLE IF NOT EXISTS public.financial_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  record_type TEXT NOT NULL,
  label TEXT NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  client_name TEXT,
  due_date DATE,
  month_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Marketing Campaigns & Ads
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  budget NUMERIC NOT NULL DEFAULT 0,
  reach_count INT DEFAULT 0,
  conversions_count INT DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Reports Analytics Logs
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_type TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  generated_by TEXT,
  download_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. AI Lead Prospects Table (resolves 404 on prospects endpoint)
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

-- 15. AI Search Sources Registry
CREATE TABLE IF NOT EXISTS public.intelligence_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  base_url TEXT NOT NULL,
  country TEXT DEFAULT 'Kenya',
  region TEXT DEFAULT 'East Africa',
  source_type TEXT DEFAULT 'official_portal',
  trust_score NUMERIC DEFAULT 90,
  enabled BOOLEAN DEFAULT TRUE,
  last_scanned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. AI Discovered Evidence Proofs
CREATE TABLE IF NOT EXISTS public.lead_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES public.prospects(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  source_domain TEXT,
  field_name TEXT,
  extracted_value TEXT,
  evidence_text TEXT,
  confidence NUMERIC DEFAULT 90,
  captured_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. AI Scan Audit History
CREATE TABLE IF NOT EXISTS public.scan_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_ref TEXT UNIQUE NOT NULL,
  region TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  min_budget NUMERIC DEFAULT 0,
  queries_run INT DEFAULT 0,
  sources_checked INT DEFAULT 0,
  pages_found INT DEFAULT 0,
  duplicates_removed INT DEFAULT 0,
  verified_count INT DEFAULT 0,
  status_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- STEP 3: CREATE SUPABASE STORAGE BUCKET FOR EVENT POSTER IMAGES
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-posters', 'event-posters', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
    CREATE POLICY "Public Read Event Posters" ON storage.objects FOR SELECT USING (bucket_id = 'event-posters');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Public Upload Event Posters" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'event-posters');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- STEP 4: ENABLE ROW LEVEL SECURITY & GRANT API PERMISSIONS
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;

-- Grant PostgREST schema & table access
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Allow RLS Policies
DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Events" ON public.events;
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Bookings" ON public.bookings;
CREATE POLICY "Public Read Bookings" ON public.bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Tickets" ON public.tickets;
CREATE POLICY "Public Read Tickets" ON public.tickets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Contacts" ON public.contacts;
CREATE POLICY "Public Read Contacts" ON public.contacts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Messages" ON public.messages;
CREATE POLICY "Public Read Messages" ON public.messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Prospects" ON public.prospects;
CREATE POLICY "Public Read Prospects" ON public.prospects FOR SELECT USING (true);

-- ----------------------------------------------------------------------------
-- STEP 5: RELOAD POSTGREST SCHEMA CACHE
-- ----------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';

SELECT 'SUCCESS: All Supabase database tables created, RLS enabled, PostgREST schema reloaded!' AS status;
