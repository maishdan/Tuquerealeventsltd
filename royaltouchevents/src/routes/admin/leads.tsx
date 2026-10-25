import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardGuard } from "@/components/dashboard/DashboardGuard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAdminProspects, useCreateEvent, useCreateProspect, formatKes } from "@/hooks/use-dashboard-data";
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
  Star,
  CheckCircle2,
  Filter,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/leads")({
  head: () =>
    createPageSeo({
      title: "Saved AI Leads Directory | TOQUE REAL Admin",
      description: "Dedicated Directory of Saved AI Discovery Leads, Qualification, Favorites & Event Promotion.",
      path: "/admin/leads",
      noindex: true,
    }),
  component: AdminLeadsPage,
});

function AdminLeadsPage() {
  return (
    <DashboardGuard requiredRole="admin">
      <AdminLeadsContent />
    </DashboardGuard>
  );
}

function AdminLeadsContent() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"ALL" | "NEW" | "APPROVED" | "FAVORITES">("ALL");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [eventType, setEventType] = useState("Corporate Summit");

  const { data: dbProspects = [], refetch: refetchProspects } = useAdminProspects();
  const createProspectMutation = useCreateProspect();
  const createEventMutation = useCreateEvent();

  const [favoritesMap, setFavoritesMap] = useState<Record<string, boolean>>({});

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const toggleFavoriteLead = (id: string, name: string) => {
    setFavoritesMap((prev) => {
      const next = !prev[id];
      showToast(next ? `⭐ Added '${name}' to Favorite Leads!` : `Removed '${name}' from Favorites`);
      return { ...prev, [id]: next };
    });
  };

  const handleCreateLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim()) return;

    try {
      await createProspectMutation.mutateAsync({
        name: leadName,
        company: leadCompany || "Corporate Client",
        email: leadEmail,
        phone: leadPhone || "+254700000000",
        event: eventType,
        location: "Nairobi",
        budget: 2500000,
        source: "Manual Admin Entry",
        status: "New Lead",
      });
      showToast(`✓ Saved Lead '${leadName}' to Database!`);
      refetchProspects();
      setIsModalOpen(false);
      setLeadName("");
      setLeadCompany("");
      setLeadEmail("");
      setLeadPhone("");
    } catch {
      showToast(`❌ Error saving lead to database.`);
    }
  };

  const handleApproveAndPromote = async (lead: any) => {
    try {
      await createEventMutation.mutateAsync({
        user_id: profile?.id || null,
        name: lead.event || lead.name,
        event_type: lead.event || "Corporate Event",
        event_date: new Date().toISOString().slice(0, 10),
        venue: lead.location || "Nairobi Venue",
        budget: typeof lead.budget === "number" ? lead.budget : 2500000,
        status: "upcoming",
        featured: true,
        description: `Promoted lead from ${lead.name} (${lead.company || "Client"}). Contact: ${lead.email} / ${lead.phone || "N/A"}.`,
        organizer_name: lead.name,
        organizer_email: lead.email,
        organizer_phone: lead.phone || "+254795365334",
      });
      showToast(`✓ Lead '${lead.name}' APPROVED & Published as Official Active Event!`);
      setTimeout(() => {
        navigate({ to: "/admin/events" });
      }, 800);
    } catch {
      showToast(`❌ Failed to promote lead to active event.`);
    }
  };

  const allLeads = dbProspects;

  const filteredLeads = allLeads.filter((l: any) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      ((l.name || "") as string).toLowerCase().includes(q) ||
      ((l.company || "") as string).toLowerCase().includes(q) ||
      ((l.event || "") as string).toLowerCase().includes(q);

    if (filterTab === "FAVORITES") return matchesSearch && Boolean(favoritesMap[l.id]);
    if (filterTab === "NEW") return matchesSearch && (l.status === "New Lead" || l.status === "NEW" || !l.status);
    if (filterTab === "APPROVED") return matchesSearch && (l.status === "Approved" || l.status === "Approved & Promoted");
    return matchesSearch;
  });

  return (
    <DashboardLayout
      title="TOQUE REAL EVENTS LIMITED ADMINISTRATOR"
      subtitle="Saved AI Leads & Discovery Directory"
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
              <span>💡 Saved Leads & Event Promotion Workflow Guide</span>
            </div>
            <p className="text-[#9ca8b6] font-medium leading-relaxed">
              All commercial leads saved from AI Studio v2 appear here. Click the <strong className="text-[#f4cf69]">⭐ Star icon</strong> to favorite leads, or click <strong className="text-emerald-400">"✓ Approve & Promote to Event"</strong> to publish the lead directly into the Admin Events Hub as an active event.
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
              placeholder="Search leads by name, company, event type..."
              className="w-full pl-9 pr-4 py-2 bg-[#0c1e30] border border-[#203548] text-xs font-mono text-white placeholder:text-[#5a6e82] focus:border-[#f4cf69] outline-none transition rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto font-mono">
            <span className="text-[10px] text-[#899cb0] uppercase font-bold mr-1">Filter:</span>
            <button
              onClick={() => setFilterTab("ALL")}
              className={cn(
                "px-3 py-1.5 text-xs font-bold uppercase transition border cursor-pointer rounded-md",
                filterTab === "ALL" ? "bg-[#f4cf69] text-black border-[#f4cf69]" : "bg-[#0c1e30] text-[#899cb0] border-[#203548]"
              )}
            >
              All ({allLeads.length})
            </button>
            <button
              onClick={() => setFilterTab("FAVORITES")}
              className={cn(
                "px-3 py-1.5 text-xs font-bold uppercase transition border cursor-pointer rounded-md flex items-center gap-1",
                filterTab === "FAVORITES" ? "bg-amber-400 text-black border-amber-400 font-black" : "bg-[#0c1e30] text-[#899cb0] border-[#203548]"
              )}
            >
              <Star size={12} className={cn(filterTab === "FAVORITES" && "fill-black")} />
              <span>Favorites ({Object.values(favoritesMap).filter(Boolean).length})</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-1.5 bg-[#f4cf69] hover:bg-[#d5a637] text-black font-black text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-1.5 cursor-pointer rounded-md ml-2"
            >
              <PlusCircle size={14} /> Add Lead
            </button>
          </div>
        </div>

        {/* LEADS LIST CARDS */}
        {filteredLeads.length === 0 ? (
          <div className="p-12 bg-[#09131d] border border-[#1b2c3d] rounded-xl text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-[#12212d] border border-[#f4cf69]/30 text-[#f4cf69] flex items-center justify-center mx-auto">
              <Sparkles size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">No Saved Leads Found</h3>
              <p className="text-xs text-[#899cb0] max-w-md mx-auto">
                No saved leads match your filter. Go to AI Studio v2 and click "Save Lead to CRM" to populate this directory.
              </p>
            </div>
            <button
              onClick={() => navigate({ to: "/admin/ai" })}
              className="px-6 py-2.5 bg-[#f4cf69] text-black font-black text-xs uppercase tracking-wider rounded-lg shadow-lg cursor-pointer font-mono"
            >
              Open AI Studio v2 →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead: any) => {
              const isFav = Boolean(favoritesMap[lead.id]);
              return (
                <div
                  key={lead.id}
                  className="p-6 bg-[#09131d] border border-[#1b2c3d] hover:border-[#f4cf69]/50 rounded-xl shadow-2xl space-y-4 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#182836] pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="px-2.5 py-0.5 rounded bg-[#f4cf69]/20 border border-[#f4cf69]/40 text-[#f4cf69] text-[10px] font-black uppercase">
                          {lead.source || "AI Studio Discovery"}
                        </span>
                        <span className="text-xs text-rose-400 font-bold">{lead.urgency || "🔥 High Fit Score"}</span>
                      </div>
                      <h3 className="text-lg font-black text-white">{lead.name}</h3>
                      <p className="text-xs text-[#899cb0] font-mono flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1"><Building size={12} className="text-[#f4cf69]" /> {lead.company || "Corporate Client"}</span>
                        <span className="flex items-center gap-1"><Mail size={12} className="text-[#f4cf69]" /> {lead.email}</span>
                        {lead.phone && <span className="flex items-center gap-1"><Phone size={12} className="text-[#20e39b]" /> {lead.phone}</span>}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      {/* Favorite Star Button */}
                      <button
                        type="button"
                        onClick={() => toggleFavoriteLead(lead.id, lead.name)}
                        className={cn(
                          "p-2.5 rounded-lg border transition-all cursor-pointer font-mono text-xs font-bold flex items-center gap-1.5",
                          isFav
                            ? "bg-amber-400 text-black border-amber-300 font-black shadow-lg"
                            : "bg-[#0c1e30] border-[#203548] text-[#899cb0] hover:text-white hover:border-[#f4cf69]"
                        )}
                        title={isFav ? "Remove from Favorites" : "Add to Favorite Leads"}
                      >
                        <Star size={16} className={cn(isFav && "fill-black text-black")} />
                        <span>{isFav ? "Favorited ★" : "Favorite"}</span>
                      </button>

                      {/* Approve & Promote to Event Button */}
                      <button
                        type="button"
                        onClick={() => handleApproveAndPromote(lead)}
                        className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs uppercase tracking-wider rounded-lg shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5 font-mono"
                      >
                        <CheckCircle2 size={16} /> Approve & Promote to Event
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-3.5 bg-[#0c1e30] border border-[#203548] rounded-lg space-y-1.5">
                      <p className="font-bold text-[#f4cf69] uppercase text-[10px] flex items-center gap-1">
                        <Zap size={12} /> Lead Event Details:
                      </p>
                      <p className="text-[#c7d0da] text-xs">✓ Event Type: {lead.event || "Corporate Gathering"}</p>
                      <p className="text-[#c7d0da] text-xs">✓ Location: {lead.location || "Nairobi Venue"}</p>
                      <p className="text-[#c7d0da] text-xs">✓ Target Budget: {formatKes(lead.budget || 2500000)}</p>
                    </div>

                    <div className="p-3.5 bg-[#0c1e30] border border-[#203548] rounded-lg space-y-1.5">
                      <p className="font-bold text-[#20e39b] uppercase text-[10px] flex items-center gap-1">
                        <Crown size={12} /> AI Conversion Guidance:
                      </p>
                      <p className="text-amber-300 font-bold text-xs">{lead.recommendation || "Contact decision maker & present proposal brief."}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MANUAL LEAD MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#081522] border-2 border-[#f4cf69] p-6 sm:p-8 max-w-md w-full space-y-4 font-mono shadow-2xl rounded-xl">
              <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                <PlusCircle size={18} className="text-[#f4cf69]" />
                <span>Save New Lead Record</span>
              </h3>

              <form onSubmit={handleCreateLeadSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#899cb0] mb-1">Lead Name *</label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Muthoni"
                    className="w-full bg-[#0c1e30] border border-[#203548] p-2.5 text-white outline-none focus:border-[#f4cf69] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[#899cb0] mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={leadCompany}
                    onChange={(e) => setLeadCompany(e.target.value)}
                    placeholder="e.g. Safaricom PLC"
                    className="w-full bg-[#0c1e30] border border-[#203548] p-2.5 text-white outline-none focus:border-[#f4cf69] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[#899cb0] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="lead@company.co.ke"
                    className="w-full bg-[#0c1e30] border border-[#203548] p-2.5 text-white outline-none focus:border-[#f4cf69] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[#899cb0] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="w-full bg-[#0c1e30] border border-[#203548] p-2.5 text-white outline-none focus:border-[#f4cf69] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-[#899cb0] mb-1">Event Type</label>
                  <input
                    type="text"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    placeholder="e.g. Corporate Summit"
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
                    Save Lead
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
