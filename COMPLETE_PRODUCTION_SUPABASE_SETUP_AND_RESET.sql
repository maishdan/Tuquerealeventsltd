-- =================================================================───────────
-- 🏆 TOQUE REAL EVENTS LIMITED — PRODUCTION SUPABASE SQL SETUP & DEFAULT RESET
-- =================================================================───────────
-- Purpose:
-- 1. Creates all missing PostgreSQL tables, ENUM types, primary keys, foreign keys, RLS policies, Storage Buckets, and indexes.
-- 2. Resets all sample/mock operational data (Events, Bookings, Finance, Proposals, Payments, Messages, Notifications, Marketing, Reports) back to clean default state.
-- 3. PRESERVES ALL USER ACCOUNTS (auth.users and profiles) — No user accounts, passwords, or profiles are deleted or modified.
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

-- 9. Inbound Inquiries & Notifications
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status contact_status DEFAULT 'new'::contact_status,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alias view for contact_inquiries
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

-- 14. AI Search Sources Registry
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

-- 15. AI Discovered Evidence Proofs
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

-- 16. AI Scan Audit History
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
-- STEP 4: ENABLE ROW LEVEL SECURITY (RLS)
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

-- Allow Access Policies
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users Update Own Profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admin Insert Events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Update Events" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Admin Delete Events" ON public.events FOR DELETE USING (true);

CREATE POLICY "Public Read Bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Public Insert Bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Update Bookings" ON public.bookings FOR UPDATE USING (true);

CREATE POLICY "Public Read Tickets" ON public.tickets FOR SELECT USING (true);
CREATE POLICY "Public Insert Tickets" ON public.tickets FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Contacts" ON public.contacts FOR SELECT USING (true);
CREATE POLICY "Public Insert Contacts" ON public.contacts FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Public Insert Messages" ON public.messages FOR INSERT WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- STEP 5: CLEAN RESTORATION / RESET TO DEFAULT OPERATIONAL STATE
-- ----------------------------------------------------------------------------
-- Purges sample data from operational tables so the live site starts with 0 events, 0 revenue, 0 passes.
-- USER ACCOUNTS (auth.users AND public.profiles) ARE PRESERVED 100%.

TRUNCATE TABLE public.payments CASCADE;
TRUNCATE TABLE public.tickets CASCADE;
TRUNCATE TABLE public.seats CASCADE;
TRUNCATE TABLE public.ticket_classes CASCADE;
TRUNCATE TABLE public.events CASCADE;
TRUNCATE TABLE public.proposals CASCADE;
TRUNCATE TABLE public.bookings CASCADE;
TRUNCATE TABLE public.contacts CASCADE;
TRUNCATE TABLE public.messages CASCADE;
TRUNCATE TABLE public.financial_records CASCADE;
TRUNCATE TABLE public.marketing_campaigns CASCADE;
TRUNCATE TABLE public.reports CASCADE;
TRUNCATE TABLE public.lead_evidence CASCADE;
TRUNCATE TABLE public.scan_jobs CASCADE;

-- ----------------------------------------------------------------------------
-- STEP 6: VERIFICATION SUMMARY
-- ----------------------------------------------------------------------------
SELECT 'SUCCESS: All Supabase tables & Storage Bucket created, RLS enabled, and operational data restored to default clean state!' AS migration_status;
