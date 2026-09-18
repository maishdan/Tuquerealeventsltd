# 👑 TOQUE REAL EVENTS LIMITED — MASTER SYSTEM DOCUMENTATION

```text
========================================================================================
                          TOQUE REAL EVENTS LIMITED 👑
                  East Africa's Premier Event Production & Technology Platform
========================================================================================
```

---

## 🏢 1. CORPORATE & SYSTEM PROFILE

* **Company Name:** TOQUE REAL EVENTS LIMITED *(Formerly Royal Touch Events)*
* **Official Website Domain:** [https://www.royaltouchevents.co.ke](https://www.royaltouchevents.co.ke)
* **Official Headquarters:** TOQUE REAL Executive Tower, Kilimani, Nairobi, Kenya
* **Direct Executive Line:** `+254 795 365 334`
* **Official Contact Email:** `realtoque0@gmail.com`
* **Established:** 2011 – 2026
* **Technology Engineering Partner:** **Powered by My World Africa** ([https://myworldafric.vercel.app](https://myworldafric.vercel.app))

---

## 🏗️ 2. SYSTEM ARCHITECTURAL STACK

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT BROWSER / DEVICE                       │
│             Desktops • Tablets • iPads • Smartphones (320px–4K)         │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        REACT 19 FRONTEND APPLICATION                    │
│   • TanStack Router & TanStack Query for State Management               │
│   • Tailwind CSS v4 + Lucide Icons + Shadcn UI Components               │
│   • Human-Computer Interface (HCI) High-Contrast Design System          │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      SUPABASE CLOUD DATABASE & BACKEND                  │
│   • PostgreSQL Database with Row Level Security (RLS)                   │
│   • Supabase Auth for Role-Based Access Control (RBAC)                  │
│   • Supabase Storage & Realtime Subscriptions                           │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         THIRD-PARTY INTEGRATIONS                        │
│   • M-Pesa QR Gate Pass Ticketing • Google Maps • WhatsApp Concierge    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 3. UI/UX DESIGN SYSTEM & HUMAN-COMPUTER INTERFACE (HCI)

1. **Executive Obsidian & Gold Design System**:
   * Sharp-edged 3D luxury tiles (`rounded-none`) with metallic gold borders (`#f4cf69`) and deep obsidian glass backdrops (`#0b0e14` / `#121722`).
   * High-conversion vibrant green Call-to-Action (CTA) buttons (`bg-emerald-500 hover:bg-emerald-400 text-black font-black`) designed for maximum user conversion rates.

2. **Fixed Background Image Layer (`/ltd.png`)**:
   * Uses `/ltd.png` as a fixed backdrop (`bg-[url('/ltd.png')] bg-cover bg-fixed`) underneath semi-transparent glass tiles (`backdrop-blur-md`), giving a deep, 3D luxury feel across all pages.

3. **Dynamic 3-Line Typewriter Hero Engine**:
   * Real-time character-by-character typewriter animation on page visit & navigation:
     * **Line 1 (Gold):** `TOQUE REAL EVENTS LIMITED`
     * **Line 2 (White):** `We Plan Your Event..........`
     * **Line 3 (Emerald Green):** `You Celebrate....`

4. **Multi-Currency Conversion Selector**:
   * Real-time budget conversion across 6 major regional & global currencies:
     * 🇰🇪 **KES (KSh)** &nbsp;•&nbsp; 🇺🇸 **USD ($)** &nbsp;•&nbsp; 🇪🇺 **EUR (€)** &nbsp;•&nbsp; 🇬🇧 **GBP (£)** &nbsp;•&nbsp; 🇺🇬 **UGX** &nbsp;•&nbsp; 🇹ℤ **TZS**

5. **Accessible Multi-Tier Event Estimator**:
   * Transparent pricing adapted for all social levels:
     * **Community & Private Celebrations:** Birthdays, Graduations & Micro-Weddings *(from KSh 15,000)*.
     * **Corporate Command Summits:** AGMs & Product Launches *(from KSh 150,000)*.
     * **Luxury Weddings & Galas:** Bespoke Reception & Decor *(from KSh 300,000)*.
     * **Stadium Concerts:** Large-Scale Festivals & Rigging *(from KSh 500,000)*.

6. **1-Time Cookie Consent Tile**:
   * Bottom-left fixed consent tile (`fixed bottom-6 left-6 z-[99998]`) with `localStorage` memory. Appears once for new browsers/devices with `Accept`, `Decline`, and `Manage` controls.

7. **10-Second High-Contrast Loading Screen**:
   * Features glowing circular GIF (`Loading Buffering GIF.gif`), TOQUE REAL logo, contact info, green `Skip / Enter Now →` button, and green ***Powered by My World Africa*** credit.

---

## 💻 4. COMPLETE SUITE OF DASHBOARDS

### 1. Executive CEO Admin Dashboard (`/admin`)
* **18 Integrated Modules:**
  1. *CEO Overview & Financial Metrics*
  2. *Registered Clients Directory*
  3. *AI Prospect Intelligence & CRM*
  4. *Registered Customers Portfolio*
  5. *Event Registry & AI Production Planner*
  6. *Sales Pipeline & CRM Lifecycle*
  7. *Proposals & Itemized PDF Quotations*
  8. *M-Pesa Payments Approval Ledger*
  9. *Financial Command Center & Capital Hub*
  10. *Pan-Africa AI Opportunity Discovery Engine*
  11. *Ticket Booking & Office Gate Pass Console*
  12. *System Notifications Registry*
  13. *Customer Contact Messages Inbox*
  14. *Executive Team & Operations Personnel*
  15. *Marketing Campaigns & Ad Attribution*
  16. *Reports & Analytics Ledger*
  17. *Settings & System Configuration*
  18. *Profile & Security Credentials*

### 2. Staff & Operations Command Dashboard (`/staff`)
* **19 Role-Specific Workspaces:**
  * *Staff Overview, My Schedule, My Tasks, Assigned Events, Notifications, Internal Messages, My Profile*.
  * **13 Department Workspaces:** *Decor & Design, Catering & Kitchen, Media & Photography, Sound & Entertainment, Logistics & Operations, Vendor/Supplier, Finance & Accounting, Inventory & Assets, Venue Management, Ticketing & Registration, Marketing, Reports & Analytics, Field Operations*.

### 3. Client / Customer Member Portal (`/dashboard`)
* **Client Workspaces:**
  * *Portal Hub, My Events, Booking Inquiries, Service Orders, Concierge Chat, Digital Receipts, My Profile, Settings*.

---

## 🔒 5. CYBERSECURITY & ROLE-BASED ACCESS CONTROL (RBAC)

1. **Multi-Role RBAC Authorization**:
   * **`admin`**: Executive CEO & Super Developers with full administrative privileges.
   * **`staff`**: Event Coordinators & Department Leads with access restricted to staff workflows.
   * **`customer` / `client`**: Registered event clients with access limited to their personal event portal.

2. **Protected & Immutable Executive Accounts**:
   * CEO Japheth Owiyo and Super Admin DANIWEST accounts are protected against account deletion, role modification, or unauthorized tampering.

3. **Supabase PostgreSQL Row Level Security (RLS)**:
   * Strict RLS policies enabled across all **12 Supabase database tables** (`profiles`, `events`, `bookings`, `tickets`, `prospects`, `contact_inquiries`, `messages`, `financial_records`, `team_members`, `orders`, `seats`, `payments`).

4. **Cryptographic Gate Pass Verification**:
   * Digital tickets generated with unique encrypted QR code tokens preventing ticket duplication or gate pass forgery.

---

## 🗄️ 6. SUPABASE DATABASE SCHEMA & TABLES

```sql
-- 1. PROFILES TABLE & ROLE CHECK CONSTRAINT
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  city TEXT,
  role TEXT DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'staff', 'customer', 'client'));

-- 2. BOOKINGS TABLE (Client Inquiries & Sales CRM)
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY DEFAULT ('bk-' || floor(extract(epoch from now()))::text),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  event_type TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE,
  guests TEXT,
  budget TEXT DEFAULT '150000',
  services JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  seat_number TEXT,
  payment_status TEXT DEFAULT 'PENDING',
  booking_state TEXT DEFAULT 'PENDING_PAYMENT',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CONTACT INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. EVENTS TABLE (Event Registry & AI Planner)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booking_id TEXT,
  name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE,
  venue TEXT,
  budget NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'upcoming',
  lifecycle_state TEXT DEFAULT 'PUBLISHED',
  description TEXT,
  poster_url TEXT,
  organizer_name TEXT,
  organizer_email TEXT,
  organizer_phone TEXT,
  start_time TEXT,
  end_time TEXT,
  ticket_classes JSONB DEFAULT '[]'::jsonb,
  team_count INT DEFAULT 1,
  vendor_count INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TICKETS TABLE (Digital M-Pesa Gate Passes & QR Tokens)
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booking_id TEXT,
  event_id UUID,
  event_name TEXT NOT NULL,
  holder_name TEXT NOT NULL,
  holder_email TEXT NOT NULL,
  holder_phone TEXT,
  ticket_tier TEXT DEFAULT 'Regular',
  price NUMERIC DEFAULT 0,
  quantity INT DEFAULT 1,
  status TEXT DEFAULT 'valid',
  ticket_code TEXT NOT NULL UNIQUE,
  ticket_number TEXT,
  ticket_token TEXT,
  seat_number TEXT,
  payment_status TEXT DEFAULT 'PENDING',
  payment_method TEXT DEFAULT 'M-Pesa',
  event_date TIMESTAMP WITH TIME ZONE,
  venue TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- 6. PROSPECTS / LEADS TABLE (AI Opportunity Discovery Engine)
CREATE TABLE IF NOT EXISTS public.prospects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  event TEXT NOT NULL,
  location TEXT DEFAULT 'Nairobi',
  date TEXT,
  guests TEXT,
  budget NUMERIC DEFAULT 0,
  score NUMERIC DEFAULT 85,
  source TEXT DEFAULT 'Inbound Discovery Engine',
  urgency TEXT DEFAULT 'Hot',
  recommendation TEXT,
  status TEXT DEFAULT 'NEW',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 📱 7. UPCOMING MOBILE APPS (COMING SOON)

* **Google Play Store App:** Android app featuring native QR gate pass scanner, instant M-Pesa booking, and 24/7 concierge chat.
* **Apple App Store App:** iOS app engineered for luxury event booking, VIP pass management, and real-time event status tracking.

---

```text
========================================================================================
         PROJECT COMPLETION STATUS: 100% SUCCESSFUL & PRODUCTION READY 🚀
                      TOQUE REAL EVENTS LIMITED · NAIROBI, KENYA
========================================================================================
```
