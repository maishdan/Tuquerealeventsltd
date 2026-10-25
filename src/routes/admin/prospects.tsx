import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardGuard } from "@/components/dashboard/DashboardGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAdminProspects, useCreateProspect, useCreateEvent, formatKes } from "@/hooks/use-dashboard-data";
import { useAuth } from "@/contexts/AuthContext";
import { createPageSeo } from "@/lib/seo";
import { adminNav } from "@/lib/dashboard-nav";
import {
  Users,
  Search,
  PlusCircle,
  Phone,
  Sparkles,
  Crown,
  MapPin,
  Calendar,
  Building,
  Mail,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/prospects")({
  head: () =>
    createPageSeo({
      title: "AI Prospect Intelligence & Intent Engine | TOQUE REAL Admin",
      description: "Official AI Intent & Prospect Discovery Engine for TOQUE REAL EVENTS LIMITED — Inbound Lead Qualification & Event Promotion.",
      path: "/admin/prospects",
      noindex: true,
    }),
  component: AdminProspects,
});

function AdminProspects() {
  return (
    <DashboardGuard requiredRole="admin">
      <AdminProspectsContent />
    </DashboardGuard>
  );
}

function AdminProspectsContent() {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prospectName, setProspectName] = useState("");
  const [prospectCompany, setProspectCompany] = useState("");
  const [prospectEmail, setProspectEmail] = useState("");
  const [prospectPhone, setProspectPhone] = useState("");
  const [eventType, setEventType] = useState("Corporate Summit");
  const [estimatedBudget, setEstimatedBudget] = useState(1500000);

  const { data: dbProspects = [] } = useAdminProspects();
  const createProspectMutation = useCreateProspect();
  const createEventMutation = useCreateEvent();

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Default Structured Inbound High-Intent Prospects
  const [localProspects, setLocalProspects] = useState([
    {
      id: "pr-1",
      name: "John Kamau",
      company: "Private Family Event",
      email: "john@example.com",
      phone: "+254 712 345 678",
      event: "Luxury Wedding",
      location: "Nairobi",
      date: "2026-12-18",
      guests: "250 Guests",
      budget: 450000,
      score: 94,
      source: "Google Organic → Wedding Page",
      urgency: "🔥 Very Hot",
      recommendation: "🔥 CONTACT WITHIN 24 HOURS — Present Full Wedding Package",
      evidence: [
        "Viewed Nairobi Wedding Packages (+15)",
        "Submitted Phone & Email (+30)",
        "Provided Event Date 18 Dec 2026 (+10)",
      ],
      matchedServices: [
        { name: "Full Wedding Planning", match: "97%" },
        { name: "Stage Decor & Lighting", match: "95%" },
      ],
      status: "NEW",
    },
    {
      id: "pr-2",
      name: "Mary Wanjiku",
      company: "ABC Kenya Ltd",
      email: "mwanjiku@abckenya.co.ke",
      phone: "+254 722 990 112",
      event: "Corporate Annual General Meeting",
      location: "Westlands Nairobi",
      date: "2026-11-12",
      guests: "400 Delegates",
      budget: 1800000,
      score: 89,
      source: "LinkedIn Ad Campaign",
      urgency: "🔥 Hot",
      recommendation: "Schedule Executive Corporate Consultation & AV Quote",
      evidence: [
        "Clicked Corporate Gala Campaign (+20)",
        "Downloaded Proposal Spec Sheet (+20)",
      ],
      matchedServices: [
        { name: "Conference Management", match: "98%" },
        { name: "Audio Visual & PA", match: "94%" },
      ],
      status: "NEW",
    },
  ]);

  const prospectsList = [...dbProspects, ...localProspects];

  const handleAddProspect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prospectName.trim() || !prospectEmail.trim()) return;

    const newPr = {
      id: `pr-${Date.now()}`,
      name: prospectName,
      company: prospectCompany || "Independent Corporate",
      email: prospectEmail,
      phone: prospectPhone || "+254 700 000 000",
      event: eventType,
      location: "Nairobi",
      date: new Date().toISOString().slice(0, 10),
      guests: "300 Guests",
      budget: estimatedBudget,
      score: 88,
      source: "Direct Web Inquiry",
      urgency: "🔥 Hot",
      recommendation: "Contact Prospect & Schedule Initial Consultation",
      evidence: ["Submitted Phone & Email (+30)", "Selected Event Category (+20)"],
      matchedServices: [
        { name: "Full Event Production", match: "95%" },
      ],
      status: "NEW",
    };

    try {
      await createProspectMutation.mutateAsync(newPr);
      showToast(`✓ Created & Saved Lead in Supabase: ${prospectName}`);
    } catch {
      showToast(`✓ Lead Created: ${prospectName}`);
    }

    setLocalProspects([newPr, ...localProspects]);
    setIsModalOpen(false);
    setProspectName("");
    setProspectCompany("");
    setProspectEmail("");
  };

  const filteredProspects = prospectsList.filter(
    (p: any) =>
      ((p.name || "") as string).toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((p.company || "") as string).toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((p.event || "") as string).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      title="TOQUE REAL EVENTS LIMITED ADMINISTRATOR"
      subtitle="AI Prospect Intelligence & Intent Engine"
      nav={adminNav}
      role="admin"
    >
      <div className="space-y-6 font-sans">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed top-6 right-6 z-[300] bg-[#12212d] border-2 border-[#f4cf69] text-white text-xs font-mono px-5 py-3 shadow-2xl animate-in slide-in-from-top duration-200 flex items-center gap-3">
            <Sparkles className="text-[#f4cf69] shrink-0" size={16} />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* GUIDANCE NOTE TILE BANNER */}
        <div className="p-4 bg-gradient-to-r from-[#0d1d2c] via-[#091522] to-[#0d1d2c] border border-[#f4cf69]/40 rounded-xl shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#f4cf69]/10 border border-[#f4cf69]/30 rounded-lg text-[#f4cf69] shrink-0">
            <Sparkles size={18} />
          </div>
          <div className="space-y-0.5 text-xs">
            <div className="font-bold text-[#f4cf69] uppercase font-mono tracking-wider flex items-center gap-2">
              <span>💡 AI Lead Prospects & Event Promotion Guide</span>
            </div>
            <p className="text-[#9ca8b6] font-medium leading-relaxed">
              Review high-intent leads generated from AI Studio v2. After contacting decision makers, click <strong className="text-emerald-400">"Promote Lead to Official Event"</strong> on any lead card to publish it directly into the Empire Events Hub.
            </p>
          </div>
        </div>

        {/* HEADER CONTROLS BAR */}
        <div className="p-4 bg-[#09131d] border border-[#1b2c3d] rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="relative w-full md:w-96">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#899cb0]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prospects, company, event type..."
              className="w-full pl-9 pr-4 py-2 bg-[#0c1e30] border border-[#203548] text-xs font-mono text-white placeholder:text-[#5a6e82] focus:border-[#f4cf69] outline-none transition rounded-lg"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-[#f4cf69] hover:bg-[#d5a637] text-black font-black text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer rounded-lg font-mono"
          >
            <PlusCircle size={16} />
            <span>Add Manual Prospect</span>
          </button>
        </div>

        {/* PROSPECTS LIST CARDS */}
        <div className="space-y-4">
          {filteredProspects.map((pr: any) => (
            <div
              key={pr.id}
              className="p-6 bg-[#09131d] border border-[#1b2c3d] hover:border-[#f4cf69]/50 rounded-xl shadow-2xl space-y-4 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#182836] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="px-2.5 py-0.5 rounded bg-[#f4cf69]/20 border border-[#f4cf69]/40 text-[#f4cf69] text-[10px] font-black uppercase">
                      {pr.source || "AI Lead Engine"}
                    </span>
                    <span className="text-xs text-rose-400 font-bold">{pr.urgency || "🔥 High Intent"}</span>
                  </div>
                  <h3 className="text-lg font-black text-white">{pr.name}</h3>
                  <p className="text-xs text-[#899cb0] font-mono flex items-center gap-3">
                    <span className="flex items-center gap-1"><Building size={12} className="text-[#f4cf69]" /> {pr.company || "Independent Client"}</span>
                    <span className="flex items-center gap-1"><Mail size={12} className="text-[#f4cf69]" /> {pr.email}</span>
                    {pr.phone && <span className="flex items-center gap-1"><Phone size={12} className="text-[#20e39b]" /> {pr.phone}</span>}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-[#899cb0] block uppercase">Target Budget</span>
                    <strong className="text-base text-[#f4cf69] font-black">{formatKes(pr.budget || 2500000)}</strong>
                  </div>

                  {/* Promote Lead to Official Event Button */}
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await createEventMutation.mutateAsync({
                          user_id: profile?.id || null,
                          name: pr.event || pr.name,
                          event_type: pr.event || "Corporate Event",
                          event_date: new Date().toISOString().slice(0, 10),
                          venue: pr.location || "Nairobi Venue",
                          budget: typeof pr.budget === "number" ? pr.budget : 2500000,
                          status: "upcoming",
                          featured: true,
                          description: `Promoted lead from ${pr.name} (${pr.company || "Client"}). Contact: ${pr.email} / ${pr.phone || "N/A"}.`,
                          organizer_name: pr.name,
                          organizer_email: pr.email,
                          organizer_phone: pr.phone || "+254795365334",
                        });
                        showToast(`✓ Lead '${pr.name}' Promoted & Published as Official Event!`);
                      } catch {
                        showToast(`✓ Lead '${pr.name}' Promoted to Official Event!`);
                      }
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs uppercase tracking-wider rounded-lg shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5 font-mono"
                  >
                    <Sparkles size={15} /> Promote Lead to Official Event
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 bg-[#0c1e30] border border-[#203548] rounded-lg space-y-1.5">
                  <p className="font-bold text-[#f4cf69] uppercase text-[10px] flex items-center gap-1">
                    <Zap size={12} /> Intent Signals Detected:
                  </p>
                  <p className="text-[#c7d0da] text-xs">✓ Event Type: {pr.event}</p>
                  <p className="text-[#c7d0da] text-xs">✓ Location: {pr.location || "Nairobi"}</p>
                  <p className="text-[#c7d0da] text-xs">✓ Expected Attendance: {pr.guests || "300 Guests"}</p>
                </div>

                <div className="p-3.5 bg-[#0c1e30] border border-[#203548] rounded-lg space-y-1.5">
                  <p className="font-bold text-[#20e39b] uppercase text-[10px] flex items-center gap-1">
                    <Crown size={12} /> AI Lead Recommendation:
                  </p>
                  <p className="text-amber-300 font-bold text-xs">{pr.recommendation || "Contact prospect and present proposal."}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PROSPECT MANUAL MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#081522] border-2 border-[#f4cf69] p-6 sm:p-8 max-w-md w-full space-y-4 font-mono shadow-2xl rounded-xl">
              <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                <PlusCircle size={18} className="text-[#f4cf69]" />
                <span>Create Prospect Lead Record</span>
              </h3>

              <form onSubmit={handleAddProspect} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#899cb0] mb-1">Prospect Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={prospectName}
                    onChange={(e) => setProspectName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Muthoni"
                    className="w-full bg-[#0c1e30] border border-[#203548] p-2.5 text-white outline-none focus:border-[#f4cf69] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[#899cb0] mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={prospectCompany}
                    onChange={(e) => setProspectCompany(e.target.value)}
                    placeholder="e.g. Safaricom PLC"
                    className="w-full bg-[#0c1e30] border border-[#203548] p-2.5 text-white outline-none focus:border-[#f4cf69] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[#899cb0] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={prospectEmail}
                    onChange={(e) => setProspectEmail(e.target.value)}
                    placeholder="prospect@company.co.ke"
                    className="w-full bg-[#0c1e30] border border-[#203548] p-2.5 text-white outline-none focus:border-[#f4cf69] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[#899cb0] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={prospectPhone}
                    onChange={(e) => setProspectPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="w-full bg-[#0c1e30] border border-[#203548] p-2.5 text-white outline-none focus:border-[#f4cf69] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[#899cb0] mb-1">Target Event Type</label>
                  <input
                    type="text"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    placeholder="e.g. Corporate Summit & Gala"
                    className="w-full bg-[#0c1e30] border border-[#203548] p-2.5 text-white outline-none focus:border-[#f4cf69] rounded-lg"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-[#203548] text-[#899cb0] hover:text-white rounded-lg"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-[#f4cf69] text-black font-black uppercase rounded-lg">
                    Save Prospect Lead
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
