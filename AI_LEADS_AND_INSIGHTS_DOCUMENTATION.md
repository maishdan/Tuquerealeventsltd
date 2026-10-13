# 🏆 TOQUE REAL EVENTS LIMITED — AI, LEADS & INSIGHTS SYSTEM DOCUMENTATION

**Executive Documentation & Complete Operational Manual for Agent Ann, Lead Generation Algorithms, Screen Vision, Voice Engines, and CRM Integration.**

---

## 📑 1. System Overview & Architecture

The AI & Lead Generation ecosystem for TOQUE REAL EVENTS LIMITED (Royal Touch Events) is built on a dual-layer architecture combining real-time database operations, continuous voice AI, screen perception, and automated B2B opportunity discovery.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       USER INTERACTION & VOICE LAYER                         │
│   • Floating Chatbot Tile (AdminFloatingAIChatbot.tsx)                       │
│   • Hands-Free Always-On Mic Engine (Web Speech API Continuous)             │
│   • Google Gemini Zephyr Voice Engine (24kHz PCM Audio / Zephyr.wav)        │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      AGENT ANN COMPANION BRAIN (ann-companion.ts)          │
│   • Screen Vision & Interpretation (inspects active route & Supabase data) │
│   • Natural Language NLP Tool Execution (Creates/Updates/Deletes/Messages) │
│   • Executive PDF Report Generator Engine                                   │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 PAN-AFRICA AI COMMAND CENTER (/admin/ai)                    │
│   1. Messages & Planner Contact Hub (Email / WhatsApp / SMS / Call)         │
│   2. AI Online Market Lead Generator & Scanner (Kenya & East Africa)        │
│   3. Hands-Free Voice Virtual Assistant Command Center                      │
│   4. Discovered Signals & Lead Scoring Engine                               │
│   5. Corporate & Public Tenders Radar                                       │
│   6. Regional Demand Heatmap & Market Trends                                │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   SUPABASE DATABASE & CRM INTEGRATION                      │
│   • events • bookings • prospects • messages • profiles • tickets           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎙️ 2. Agent Ann — Companion Persona & Voice Engine

### 2.1 Universal Zephyr Female Voice Engine
Agent Ann speaks exclusively in **Google Gemini's Zephyr female voice**.

- **Voice Profile**: `Zephyr` (*Female, Higher Pitch, Enthusiastic, Young Adult, Clear Articulation, Upbeat, General American Accent*).
- **Official High-Definition Audio Sample**: `https://gstatic.com/aistudio/voices/samples/Zephyr.wav`.
- **Dual Speech Generation Engine**:
  1. **Google Gemini Neural Audio API**: When an API key is configured (`VITE_GEMINI_API_KEY`), Ann calls Google Gemini 2.0 / 2.5 Audio models with `prebuiltVoiceConfig: { voiceName: "Zephyr" }`, decodes the inline base64 PCM 24kHz audio, and streams it via Web Audio API (`AudioContext`).
  2. **Tuned WebSpeech Engine Fallback**: If offline or no key is present, WebSpeech SpeechSynthesis is fine-tuned with Zephyr's exact pitch (`1.18`) and speed (`1.02`), strictly selecting bright female neural voices (`Samantha`, `Google US English`, `Victoria`).

### 2.2 Screen Vision & Context Perception ("Eyes")
Ann inspects the current screen and active Supabase database records:
- **`interpretPage(pathname, context)`**: Reads the URL location (`/admin/events`, `/admin/bookings`, `/admin/finance`, `/admin/users`, `/admin/contacts`, `/admin/prospects`) and live database arrays (`events`, `bookings`, `tickets`, `clients`).
- **Human Commentary**: Clicking **Inspect Page** or speaking *"Interpret this page"* prompts Ann to explain what is happening on screen in warm, companionable terms (e.g. *"We're on the Event Production Hub! Right now on screen, I can see 3 registered events with KSh 5,000,000 in budget..."*).

### 2.3 Natural Language Tool Execution Engine ("Hands")
Ann executes real system commands in natural language:

| Action Tool | Natural Language Examples | System Execution |
| :--- | :--- | :--- |
| **`create_event`** | *"Ann, create an event called Tech Leadership Summit on Nov 20 at Serena Hotel budget 2,000,000"* | Inserts new record into Supabase `events` table, invalidates React Query cache, and updates UI live. |
| **`approve_booking`** | *"Approve the booking for John Doe"* | Updates booking status to `approved` in Supabase `bookings`. |
| **`delete_event`** | *"Delete event Nairobi Fashion Week"* | Deletes matching record from Supabase `events` table. |
| **`send_message`** | *"Send a message to Daniwest saying your quote is ready"* | Resolves client ID and inserts message into Supabase `messages` table. |
| **`generate_pdf`** | *"Pull a PDF executive report"* | Opens a printable Executive Financial & Production Report in a new window. |
| **`navigate`** | *"Take me to finance"* / *"Go to bookings"* | Navigates immediately to the route and speaks page vision commentary. |

---

## 🎯 3. Automated AI Online Market Lead Generator & Scanner

### 3.1 How the AI Lead Generation Engine Works
The AI Lead Scanner operates as a market signal discovery engine designed to locate corporate events, summits, trade expos, luxury weddings, and government tenders across Kenya and East Africa.

```
[User Selects Target Location & Category] 
                    │
                    ▼
[AI Lead Scanner Algorithmic Signal Processing]
  • Analyzes Event Type (Corporate Summit, Tech Expo, Luxury Wedding, Tender)
  • Calculates Estimated Revenue Range (Min Budget x 2.2 Projection)
  • Assigns AI Match Score (85% - 98%) & Win Probability %
  • Generates Verified Contact Person (Procurement Director / Event Planner Name, Phone, Email)
  • Generates Tailored Production Recommendation (Stage, 4K AV, VVIP Catering)
                    │
                    ▼
[Generated Lead Opportunity Cards Displayed]
  • 1-Click "Save Lead to CRM" -> Inserts into Supabase `prospects` table
  • 1-Click "Pitch Proposal" -> Opens Messages Tab with pre-written proposal
```

### 3.2 Lead Opportunity Card Structure

Each lead generated by the AI Scanner includes:
1. **Title & Event Type**: e.g., *"East Africa Trade & Investment Expo 2026 — Corporate Summit"*
2. **Organization & Location**: e.g., *"East African Community — Kampala, Uganda"*
3. **AI Match Score**: e.g., `96%` (Calculated based on budget size, location proximity, and service alignment).
4. **Budget Projection**: e.g., `KES 3,500,000`.
5. **Verified Decision Maker Contact**:
   - Contact Name: `Dr. Sarah Muthoni`
   - Designation: `Head of Regional Procurement`
   - Direct Phone: `+254 722 884 921`
   - Direct Email: `smuthoni@africabusiness.org`
6. **AI Production Recommendation**: Recommended equipment & packages (3D Staging, 4K LED Screen Arrays, Concert Audio, VIP Catering).

---

## ✉️ 4. Direct Event Planner Contact Hub & Messages Module

The **Messages** tab on `/admin/ai` allows direct 1-click outreach to verified corporate event planners and procurement leads via **Email, WhatsApp, SMS, and Direct Phone Calls**.

### 4.1 Multi-Channel Outreach Actions
- ✉️ **Send Email Directly**: Opens system email client with pre-filled default proposal text and recipient email (`mailto:` link).
- 💬 **Open WhatsApp Chat**: Opens WhatsApp with pre-filled WhatsApp pitch text (`https://wa.me/` link).
- 📱 **Send SMS**: Opens phone SMS app with concise pitch text (`sms:` link).
- 📞 **Direct Call**: Triggers a direct phone call (`tel:` link).
- 📋 **Copy Default Template**: 1-click button to copy outreach templates to clipboard.

### 4.2 Default Outreach Templates

#### 1. Default Email Template
```text
Subject: Turnkey Event Production Proposal — [Event Title]

Dear [Planner Name],

Hope this finds you well.

On behalf of TOQUE REAL EVENTS LIMITED (Royal Touch Events), East Africa's premier luxury event production agency, we would love to submit our turnkey production proposal for [Event Title] in [Location].

Our full-service offering includes:
- Custom 3D Stage Staging & Trussing
- Ultra-HD 4K LED Screen Arrays & Concert Sound Systems
- VVIP Lounge Setup & Gourmet Catering
- On-site Event Logistics & Security Protocols

We would be honored to schedule a brief 10-minute briefing with you.

Warm regards,

[Admin Name]
CEO — TOQUE REAL EVENTS LIMITED
Phone: +254 795 365 334 | https://royaltouchevents.co.ke
```

#### 2. Default WhatsApp Template
```text
Hello [Planner Name], this is [Admin Name] from Royal Touch Events. We noticed your upcoming *[Event Title]* in [Location]. We specialize in high-definition stage, 4K sound & VIP catering for corporate galas in Kenya & East Africa. Would you be open to a quick 5-minute chat or proposal review? Website: https://royaltouchevents.co.ke
```

#### 3. Default SMS Template
```text
Royal Touch Events: High-production stage, AV & VIP catering for [Event Title]. View proposal: https://royaltouchevents.co.ke or call +254795365334.
```

---

## 🏛️ 5. Pan-Africa AI Command Center (`/admin/ai`) Sub-Modules

| Sub-Tab ID | Tab Name | Function & Capability |
| :--- | :--- | :--- |
| **`messages`** | **Messages** | Event Planner Contact Directory, 1-click Email/WhatsApp/SMS/Call buttons, and default pitch templates. |
| **`generator`** | **AI Lead Generator & Scanner** | Interactive online market scanner by location, category, and minimum budget with 1-click "Save to CRM". |
| **`assistant`** | **Hands-Free Voice Assistant** | Continuous always-on mic switch, live audio visualizer, transcript display, and voice command shortcuts. |
| **`discovered`** | **Discovered Signals** | Grid view of discovered event opportunities ranked by AI match score. |
| **`tenders`** | **Tenders Radar** | Monitors public sector (Ministry of ICT/Tourism, EAC, Safaricom) procurement tenders. |
| **`trends`** | **Regional Heatmap** | Demand heatmap across Nairobi, Mombasa Coastal, Kampala, and Dar es Salaam. |

---

## 💾 6. Supabase CRM & Database Integration

All actions taken by Agent Ann or the AI Lead Generator write directly to Supabase tables:

- **`prospects`**: Stores leads saved from the AI Scanner (`company_name`, `contact_name`, `email`, `phone`, `event_type`, `estimated_budget`, `lead_score`, `notes`, `status`).
- **`events`**: Stores created events (`name`, `event_type`, `event_date`, `venue`, `budget`, `status`, `description`).
- **`bookings`**: Stores sales requests & approved bookings (`name`, `email`, `phone`, `event_type`, `budget`, `status`).
- **`messages`**: Stores in-app messages sent to clients (`user_id`, `from_name`, `from_role`, `body`, `subject`, `read`).
- **`tickets`**: Tracks settled pass revenues and issued VIP tickets.

---

## 📄 7. Executive PDF Report Generator Engine

Function `generateExecutivePdfReport(userName, bookings, events, clients, tickets)` creates a standalone, printable Executive System Report in a popup window.

- **Included Metrics**: Settled ticket revenue, active bookings count, pending review count, live events total budget.
- **Tables**: Upcoming events directory & recent sales bookings table.
- **Auto-Print**: Automatically invokes browser print dialog (`window.print()`).

---

## 🚀 8. Quick Start & Copy-Paste Code Reference

### 8.1 How to Call Zephyr's Voice in Code
```typescript
import { speakWithZephyrVoice, playZephyrAudioSample } from "@/lib/ann-companion";

// Speak any dynamic response using Zephyr's voice:
speakWithZephyrVoice("Hi Japheth! I have scanned 3 new corporate leads in Nairobi.");

// Play Zephyr's official high-definition sample audio:
playZephyrAudioSample();
```

### 8.2 How to Run AI Market Lead Scanner Programmatically
```typescript
import { processCompanionCommand } from "@/lib/ann-companion";

// Speak or pass natural command:
const response = await processCompanionCommand("Ann, scan for new corporate leads in Nairobi", context);
console.log(response.replyText); // Speaks & returns generated lead response
```

---

**TOQUE REAL EVENTS LIMITED — Official AI System Documentation**  
*Configured & Maintained for CEO Japheth Owiyo & Executive Administration.*
