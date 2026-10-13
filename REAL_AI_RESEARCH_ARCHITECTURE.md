# 🔬 TOQUE REAL EVENTS — REAL AI LEAD RESEARCH & EVIDENCE VERIFICATION ARCHITECTURE

**Official Engineering Specification for Turning Agent Ann into a Real Web-Research & Evidence-Backed Lead Intelligence Engine.**

---

## 🏛️ 1. Core Engineering Principle

> **"The LLM must sit in the middle as an analyst and summarizer, NOT at the bottom as an inventor of unverified opportunities."**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          USER TRIGGER ("SCAN AFRICA")                       │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SEARCH & RESEARCH ORCHESTRATOR                       │
│   • Formulates Structured Search Query Families (Location + Category)       │
│   • Multi-Source Fetching: Official Portals (PPIP, EAC, InvestKenya)        │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PAGE EXTRACTION & EVIDENCE ENGINE                    │
│   • Direct Source URL Verification                                          │
│   • Separates FACT (Published Official Budget) from ESTIMATE                │
│   • Captures Quoted Source Evidence Proof                                  │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       DEDUPLICATION & FINGERPRINTING                        │
│   • Creates Unique Event Fingerprint: `title | org | location | date`       │
│   • Filters Out Previously Discovered or CRM-Registered Leads               │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       VERIFICATION & LEAD SCORING                           │
│   • Calculates Evidence Score (0 - 100) & Trust Tiers (Tier A, Tier B)      │
│   • Verified Contactability Score (0 - 100) for Procurement Decision Maker   │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SUPABASE CRM DATABASE INSERTION                       │
│   • 1-Click "Save Lead to CRM" -> Inserts into `prospects` with Evidence    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ 2. Production Code File Implemented

The real lead research engine is compiled and running in:
- **`src/lib/ann-real-intelligence.ts`**
- **`src/routes/admin/ai.tsx`**

### Key TypeScript Functions Active:
1. **`runRealLeadResearchPipeline(location, category, minBudget)`**: Runs multi-source query families, verifies source URLs, extracts evidence quotes, calculates trust tiers, deduplicates leads, and generates audit metrics.
2. **`createEventFingerprint(title, org, location, date)`**: Normalized fingerprint string preventing duplicate lead generation.
3. **`saveVerifiedLeadToSupabase(lead)`**: Writes verified leads with full evidence notes into the Supabase `prospects` database table.

---

## 📋 3. Real Evidence Card Schema

```typescript
type RealDiscoveredLead = {
  id: string;
  title: string;
  organization: string;
  location: string;
  country: string;
  eventDate: string;
  category: "Corporate Summit" | "Tech Expo" | "Trade Fair" | "Public Tender" | "Wedding";
  evidenceScore: number; // 0 - 100
  leadScore: number; // 0 - 100
  winProbability: string;
  budgetType: "FACT" | "ESTIMATE";
  publishedBudget: number | null; // Fact from official tender
  sourceUrl: string;
  sourceDomain: string;
  sourceTrustTier: "Tier A — Official/Government" | "Tier B — Event Platform" | "Tier C — Directory/Media";
  evidence: {
    sourceUrl: string;
    sourceDomain: string;
    fieldName: string;
    extractedValue: string;
    evidenceText: string;
    confidence: number;
  }[];
  contact: {
    name: string;
    designation: string;
    phone: string;
    email: string;
    contactabilityScore: number;
    isPublicBusinessContact: boolean;
  };
};
```

---

## 🛡️ 4. Source Trust Tiers

- **Tier A — Official / Government** (`invest.go.ke`, `tenders.go.ke`, `eac.int`, `safaricom.co.ke`): Weight `1.0`. High evidence score (`95% - 100%`).
- **Tier B — Event Platforms & Major Media**: Weight `0.85`. Medium-high confidence (`85% - 92%`).
- **Tier C — Directories & Aggregators**: Weight `0.55`. Requires manual verification review.

---

**TOQUE REAL EVENTS LIMITED — Real AI Research Specification**  
*Maintained for CEO Japheth Owiyo & Executive Administration.*
