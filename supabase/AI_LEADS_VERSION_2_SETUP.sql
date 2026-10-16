-- ============================================================================
-- TOQUE REAL EVENTS LIMITED — VERSION 2 AI LEADS & SEARCH CONTROL DATABASE
-- Execute this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================================

-- 1. Create Table: ai_leads_v2
CREATE TABLE IF NOT EXISTS public.ai_leads_v2 (
    id TEXT PRIMARY KEY,
    event_name TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_date TEXT,
    venue TEXT,
    city TEXT DEFAULT 'Nairobi',
    country TEXT DEFAULT 'Kenya',
    organiser TEXT NOT NULL,
    organiser_website TEXT,
    organiser_email TEXT,
    organiser_phone TEXT,
    event_url TEXT,
    estimated_attendance TEXT,
    fit_score INTEGER DEFAULT 85,
    qualification_reason TEXT,
    campaign TEXT NOT NULL,
    lead_status TEXT DEFAULT 'Qualified Lead',
    decision_maker_name TEXT,
    decision_maker_title TEXT,
    decision_maker_email TEXT,
    email_status TEXT DEFAULT 'valid',
    icebreaker TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Table: ai_search_control
CREATE TABLE IF NOT EXISTS public.ai_search_control (
    id SERIAL PRIMARY KEY,
    campaign TEXT NOT NULL,
    search_type TEXT NOT NULL,
    query TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT DEFAULT 'ready',
    status_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes for Instant O(1) Search Performance
CREATE INDEX IF NOT EXISTS idx_ai_leads_campaign ON public.ai_leads_v2(campaign);
CREATE INDEX IF NOT EXISTS idx_ai_leads_city ON public.ai_leads_v2(city);
CREATE INDEX IF NOT EXISTS idx_ai_leads_email_status ON public.ai_leads_v2(email_status);
CREATE INDEX IF NOT EXISTS idx_ai_leads_fit_score ON public.ai_leads_v2(fit_score DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.ai_leads_v2 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_search_control ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies for Admin & Public Read Access
DROP POLICY IF EXISTS "Allow read access to ai_leads_v2" ON public.ai_leads_v2;
CREATE POLICY "Allow read access to ai_leads_v2"
    ON public.ai_leads_v2 FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow write access to authenticated admin users" ON public.ai_leads_v2;
CREATE POLICY "Allow write access to authenticated admin users"
    ON public.ai_leads_v2 FOR ALL
    USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow read access to ai_search_control" ON public.ai_search_control;
CREATE POLICY "Allow read access to ai_search_control"
    ON public.ai_search_control FOR SELECT
    USING (true);

-- 6. Insert Verified Master V2 Lead Data Records
INSERT INTO public.ai_leads_v2 (
    id, event_name, event_type, event_date, venue, city, country, organiser,
    organiser_website, organiser_email, organiser_phone, fit_score, qualification_reason,
    campaign, lead_status, decision_maker_name, decision_maker_title, decision_maker_email, email_status, icebreaker
) VALUES
('ld-v2-101', 'East Africa Procurement & Supply Chain Summit 2026', 'Corporate Conference', '2026-11-18', 'KICC Convention Centre', 'Nairobi', 'Kenya', 'Kenya Institute of Supplies Management (KISM)', 'https://kism.or.ke', 'events@kism.or.ke', '+254 722 000 111', 96, '350+ delegates requiring LED displays and simultaneous interpretation.', 'Corporate Conferences & AGMs', 'Qualified Lead', 'James Mwangi', 'Head of Procurement & Events', 'mwangi.james@kism.or.ke', 'valid', 'Hi James, saw KISM is hosting 350+ delegates at KICC. We can deploy 4K LED displays and simultaneous translation booths.'),
('ld-v2-102', 'AFRICA TECH SUMMIT NAIROBI 2026', 'Tech Expo & Summit', '2026-12-02', 'Villa Rosa Kempinski', 'Nairobi', 'Kenya', 'Africa Tech Summit Global', 'https://africatechsummit.com', 'info@africatechsummit.com', '+254 700 888 999', 98, 'International tech summit requiring VVIP stage rigging and 4K livestreaming.', 'Tech Expos & Product Launches', 'Hot Opportunity', 'Andrew Bester', 'Managing Director', 'andrew@africatechsummit.com', 'valid', 'Hi Andrew, loved ATS 2025! For ATS 2026 at Kempinski, we can handle full VVIP stage rigging and multi-camera 4K broadcasting.'),
('ld-v2-103', 'MOMBASA COASTAL WEDDING EXPO & GALA', 'Luxury Gala & Wedding', '2026-11-28', 'Sarova Whitesands Beach Resort', 'MOMBASA', 'Kenya', 'Coastal Wedding Association', 'https://whitesands.sarovahotels.com', 'weddings@sarovahotels.com', '+254 711 222 333', 94, 'High-budget beachfront wedding needing waterproof stretch tents and ambient lighting.', 'Luxury Weddings & Galas', 'Qualified Lead', 'Amina Abdalla', 'Lead Event Planner', 'amina.abdalla@sarovahotels.com', 'valid', 'Hi Amina, for the Coastal Gala at Whitesands, we provide ballasted outdoor stretch tents and IP65 waterproof stage lighting.')
ON CONFLICT (id) DO UPDATE SET
    event_name = EXCLUDED.event_name,
    fit_score = EXCLUDED.fit_score,
    decision_maker_email = EXCLUDED.decision_maker_email;

-- SQL Setup Complete!
