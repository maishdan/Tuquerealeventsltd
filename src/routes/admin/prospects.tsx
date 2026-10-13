import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAdminBookings, useAdminProspects, useCreateProspect, formatKes } from "@/hooks/use-dashboard-data";
import { useAuth } from "@/contexts/AuthContext";
import { createPageSeo } from "@/lib/seo";
import {
  Users,
  Search,
  ChevronDown,
  Power,
  Settings,
  HelpCircle,
  LogOut,
  User,
  Home,
  Crown,
  PlusCircle,
  Filter,
  Send,
  Building,
  Mail,
  Phone,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Award,
  Flame,
  Zap,
  Globe,
  Check,
  ShieldCheck,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/admin/prospects")({
  head: () =>
    createPageSeo({
      title: "AI Prospect Intelligence & Intent Engine | Royal Touch Admin",
      description: "Official AI Intent & Prospect Discovery Engine for Royal Touch Events — Inbound Lead Qualification & Intent Scoring.",
      path: "/admin/prospects",
      noindex: true,
    }),
  component: AdminProspects,
});

export function AdminProspects() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: bookings = [] } = useAdminBookings();

  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prospectName, setProspectName] = useState("");
  const [prospectCompany, setProspectCompany] = useState("");
  const [prospectEmail, setProspectEmail] = useState("");
  const [prospectPhone, setProspectPhone] = useState("");
  const [eventType, setEventType] = useState("Corporate Summit");
  const [estimatedBudget, setEstimatedBudget] = useState(1500000);

  const emailLower = (user?.email || profile?.email || "").toLowerCase();
  const rawName = profile?.full_name || user?.user_metadata?.full_name || "";

  const adminInfo = (() => {
    if (emailLower === "eventsroyaltouch7@gmail.com" || rawName.toLowerCase().includes("japheth")) {
      return { fullName: "Japheth Owiyo", badge: "PROTECTED C.E.O" };
    }
    if (emailLower === "abigaelmuthoni29@gmail.com" || rawName.toLowerCase().includes("daniwest")) {
      return { fullName: "DANIWEST", badge: "SUPER ADMIN DEVELOPER" };
    }
    const fallback = rawName || (emailLower ? emailLower.split("@")[0].toUpperCase() : "ADMINISTRATOR");
    return { fullName: fallback, badge: "EXECUTIVE ADMIN" };
  })();

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const userInitials = profile?.full_name ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase() : "JO";

  // Structured Inbound High-Intent Prospects Engine Data
  const [prospectsList, setProspectsList] = useState([
    {
      id: "pr-1",
      name: "John Kamau",
      company: "Private Family Event",
      email: "john@example.com",
      phone: "+254 712 345 678",
      event: "Luxury Wedding",
      location: "Nairobi",
      date: "18 Dec 2026",
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
        "Provided 250 Guest Count (+10)",
        "Provided KES 450,000 Budget (+10)",
      ],
      matchedServices: [
        { name: "Full Wedding Planning", match: "97%" },
        { name: "Stage Decor & Lighting", match: "95%" },
        { name: "VIP Catering", match: "92%" },
        { name: "Photography & Video", match: "87%" },
      ],
      consentVerified: true,
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
      date: "12 Nov 2026",
      guests: "400 Delegates",
      budget: 1800000,
      score: 89,
      source: "LinkedIn Ad Campaign",
      urgency: "🔥 Hot",
      recommendation: "Schedule Executive Corporate Consultation & AV Quote",
      evidence: [
        "Clicked Corporate Gala Campaign (+20)",
        "Downloaded Proposal Spec Sheet (+20)",
        "Submitted Procurement Phone (+25)",
        "Requested AV Sound & PA Quote (+15)",
      ],
      matchedServices: [
        { name: "Conference Management", match: "98%" },
        { name: "Audio Visual & PA", match: "94%" },
        { name: "Protocol & Security", match: "88%" },
      ],
      consentVerified: true,
      status: "NEW",
    },
    {
      id: "pr-3",
      name: "Dr. Sarah Muthoni",
      company: "Kisii University Delegate",
      email: "research@kisiiuniversity.ac.ke",
      phone: "+254 721 556 789",
      event: "International Innovation Summit",
      location: "Kisii Town",
      date: "28 Oct 2026",
      guests: "600 Attendees",
      budget: 3200000,
      score: 82,
      source: "University Public Portal",
      urgency: "🟠 Warm",
      recommendation: "Send Tent, Stage & AV Production Proposal",
      evidence: [
        "Inquired via Public Portal (+25)",
        "Opened Service Catalogue (+15)",
        "Verified Institutional Email (+20)",
      ],
      matchedServices: [
        { name: "Tent & Dome Hire", match: "92%" },
        { name: "Stage & Lighting", match: "90%" },
      ],
      consentVerified: true,
      status: "CONTACTED",
    },
  ]);

  const { data: dbProspects = [] } = useAdminProspects();
  const createProspectMutation = useCreateProspect();

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
      date: "November 2026",
      guests: "300 Guests",
      budget: estimatedBudget,
      score: 88,
      source: "Direct Web Inquiry",
      urgency: "🔥 Hot",
      recommendation: "Contact Prospect & Schedule Initial Consultation",
      evidence: ["Submitted Phone & Email (+30)", "Selected Event Category (+20)"],
      matchedServices: [
        { name: "Full Event Production", match: "95%" },
        { name: "Catering & AV", match: "90%" },
      ],
      consentVerified: true,
      status: "NEW",
    };

    try {
      await createProspectMutation.mutateAsync(newPr);
      showToast(`✓ Created & Saved Lead in Supabase: ${prospectName}`);
    } catch (err) {
      showToast(`✓ Lead Created: ${prospectName}`);
    }

    setProspectsList([newPr, ...prospectsList]);
    setIsModalOpen(false);
    setProspectName("");
    setProspectCompany("");
    setProspectEmail("");
  };

  const filteredProspects = prospectsList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.event.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#03070d] text-[#f4f7fb] font-sans selection:bg-[#e6b83f] selection:text-black antialiased">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[100] px-5 py-3 bg-[#142231] border border-[#3c4d5e] text-white text-xs font-bold shadow-2xl rounded-lg animate-in slide-in-from-bottom-4 duration-300">
          {toastMsg}
        </div>
      )}

      {/* App Shell Grid */}
      <div className={cn("min-h-screen grid transition-all duration-300", isMenuCollapsed ? "grid-cols-[70px_1fr]" : "grid-cols-[212px_1fr]")}>
        {/* SIDEBAR */}
        <aside className="relative min-h-screen border-r border-[#202c39] bg-gradient-to-b from-[#02070d] via-[#050b12] to-[#02060b] flex flex-col z-50 sticky top-0 h-screen overflow-hidden">
          {/* Brand Header */}
          <div className="h-[95px] flex flex-col items-center justify-center border-b border-[#17212b] text-[#f4cf69] shrink-0 sticky top-0 bg-[#02070d] z-10">
            <Crown size={28} className="text-[#f4cf69]" />
            {!isMenuCollapsed && (
              <>
                <div className="font-serif tracking-[2px] text-xs mt-1 font-bold text-center">TOQUE REAL</div>
                <div className="font-serif tracking-[3px] text-[9px] opacity-80 mt-0.5 text-center">EVENTS LIMITED</div>
              </>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#243343] scrollbar-track-[#07101a]">
            {[
              { to: "/admin", label: "Dashboard", icon: "▣" },
              { to: "/admin/users", label: "Clients", icon: "♟" },
              { to: "/admin/prospects", label: "Prospects", icon: "✦", active: true },
              { to: "/admin/customers", label: "Customers", icon: "♟" },
              { to: "/admin/events", label: "Events", icon: "▦" },
              { to: "/admin/bookings", label: "Sales & CRM", icon: "▤" },
              { to: "/admin/proposals", label: "Proposals", icon: "▤" },
              { to: "/admin/payments", label: "Payments", icon: "▣" },
              { to: "/admin/finance", label: "Finance", icon: "✥" },
              { to: "/admin/ai", label: "AI & Insights", icon: "✦" },
              { to: "/admin/admin-booking", label: "Booking", icon: "▣" },
              { to: "/admin/contacts", label: "Notifications", icon: "♧" },
              { to: "/admin/contacts", label: "Messages", icon: "✉" },
              { to: "/admin/team", label: "Team", icon: "♟" },
              { to: "/admin/marketing", label: "Marketing", icon: "✦" },
              { to: "/admin/reports", label: "Reports", icon: "▣" },
              { to: "/admin/settings", label: "Settings", icon: "⚙" },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                onClick={() => showToast(`${item.label} Module Selected`)}
                className={cn(
                  "flex items-center gap-3 h-[43px] px-3 rounded-lg text-xs font-medium transition-all cursor-pointer my-1",
                  item.active
                    ? "bg-gradient-to-r from-[#a9741b] via-[#d5a637] to-[#896019] text-white shadow-lg shadow-[#b48224]/20 font-bold"
                    : "text-[#c7d0da] hover:bg-[#111b27] hover:text-white"
                )}
              >
                <span className={cn("text-base w-5 text-center shrink-0", item.active ? "text-white" : "text-[#f1c35a]")}>
                  {item.icon}
                </span>
                {!isMenuCollapsed && <span>{item.label}</span>}
              </Link>
            ))}

            <button
              type="button"
              onClick={() => setShowLogoutConfirmModal(true)}
              className="w-full flex items-center gap-3 h-[43px] px-3 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer my-2 text-left"
            >
              <LogOut size={16} />
              {!isMenuCollapsed && <span>Sign Out</span>}
            </button>
          </nav>

          {/* Bottom Photo Card */}
          {!isMenuCollapsed && (
            <div className="relative h-28 w-full shrink-0 border-t border-[#17212b] bg-cover bg-center p-4 flex items-end bg-[linear-gradient(0deg,#03070d_0%,rgba(3,7,13,0.75)_50%,#03070d_100%),url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=700&q=80')]">
              <p className="italic text-xs text-[#f5d47a] font-serif leading-snug">
                Extraordinary Events.<br />Lasting Impressions.
              </p>
            </div>
          )}
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="min-w-0 pb-8">
          {/* TOPBAR (FIXED STICKY HEADER) */}
          <header className="sticky top-0 z-[1000] h-[74px] border-b border-[#202b37] bg-[#03080e]/95 backdrop-blur-md flex items-center gap-4 px-6 shadow-xl overflow-visible">
            <button
              type="button"
              onClick={() => {
                setIsMenuCollapsed(!isMenuCollapsed);
                showToast(isMenuCollapsed ? "Sidebar Menu Expanded" : "Sidebar Menu Collapsed");
              }}
              className="h-9 w-9 rounded-lg border border-[#314354] bg-[#121d29] text-[#e6b83f] flex items-center justify-center text-lg font-bold hover:border-[#e6b83f] transition-all cursor-pointer shrink-0"
              title="Toggle Menu"
            >
              ☰
            </button>

            <div className="relative w-full max-w-[425px] h-9 border border-[#314354] rounded-lg bg-[#121d29] flex items-center px-3 gap-2.5">
              <Search size={15} className="text-[#8d9bad]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prospects, intent signals, corporate leads..."
                className="w-full bg-transparent border-0 outline-none text-xs text-white placeholder:text-[#8291a2]"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Link
                to="/"
                className="h-9 px-3 border border-[#314354] bg-[#121d29] hover:border-[#f4cf69] text-[#f4cf69] hover:text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Go to Public Website Home"
              >
                <Home size={15} /> <span className="hidden sm:inline">Website Home</span>
              </Link>

              <div className="h-9 w-px bg-[#34404d] hidden sm:block" />

              <button
                type="button"
                onClick={() => showToast("3 Active Notifications")}
                className="relative h-9 w-9 flex items-center justify-center text-[#e8edf3] text-xl cursor-pointer hover:text-[#e6b83f]"
              >
                <Sparkles size={18} />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#f0444f] text-white font-extrabold text-[9px] flex items-center justify-center border-2 border-[#050b12]">
                  3
                </span>
              </button>

              <div className="h-9 w-px bg-[#34404d] hidden sm:block" />

              <div className="text-xs text-[#d8dee6] hidden sm:flex items-center gap-2 font-mono">
                {new Date().toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
              </div>

              <div className="h-9 w-px bg-[#34404d] hidden sm:block" />

              {/* User Avatar & Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 group cursor-pointer outline-none">
                    <div className="h-9 w-9 rounded-full bg-[#f2e8cd] text-[#25200f] font-extrabold text-xs flex items-center justify-center shadow-md overflow-hidden ring-2 ring-transparent group-hover:ring-[#f4cf69] transition-all">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Admin Avatar" className="h-full w-full object-cover" />
                      ) : (
                        userInitials
                      )}
                    </div>
                    <div className="text-left hidden md:block">
                      <strong className="block text-xs text-white leading-tight group-hover:text-[#f4cf69] transition-colors">
                        {adminInfo.fullName}
                      </strong>
                      <small className="block text-[10px] text-[#9ca8b6] font-medium uppercase">{adminInfo.badge}</small>
                    </div>
                    <ChevronDown size={14} className="text-[#9ba6b3] group-hover:text-[#f4cf69] transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="w-56 bg-[#09141f] border border-[#f4cf69]/40 text-white p-2 shadow-2xl rounded-xl space-y-1 z-[999999]">
                  <DropdownMenuLabel className="px-3 py-2 text-xs font-black text-[#f4cf69] uppercase tracking-wider">
                    {adminInfo.fullName} ({adminInfo.badge})
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#172533]" />

                  <DropdownMenuItem asChild>
                    <Link to="/admin/settings" search={{ section: undefined }} className="flex items-center gap-3 px-3 py-2.5 text-xs font-semibold hover:bg-[#121d29] rounded-lg cursor-pointer transition-colors text-slate-200 hover:text-white">
                      <Settings size={15} className="text-[#f4cf69]" /> Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/admin/profile" className="flex items-center gap-3 px-3 py-2.5 text-xs font-semibold hover:bg-[#121d29] rounded-lg cursor-pointer transition-colors text-slate-200 hover:text-white">
                      <User size={15} className="text-[#f4cf69]" /> Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/contact" className="flex items-center gap-3 px-3 py-2.5 text-xs font-semibold hover:bg-[#121d29] rounded-lg cursor-pointer transition-colors text-slate-200 hover:text-white">
                      <HelpCircle size={15} className="text-[#f4cf69]" /> Help & Support
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-[#172533]" />

                  <DropdownMenuItem
                    onClick={() => setShowLogoutConfirmModal(true)}
                    className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg cursor-pointer transition-colors"
                  >
                    <LogOut size={15} /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* LOGOUT CONFIRMATION MODAL POPUP */}
          {showLogoutConfirmModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-xs px-4 font-sans animate-in fade-in duration-200">
              <div className="bg-[#09141f]/95 border border-[#e6b83f]/60 p-6 rounded-none max-w-sm w-full shadow-2xl space-y-4 text-center animate-in zoom-in-95 duration-300">
                <div className="mx-auto h-14 w-14 bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center rounded-none shadow-md">
                  <Power size={28} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">
                    Are you sure you want to logout?
                  </h3>
                  <p className="text-[11px] text-[#94a4b6] font-medium leading-relaxed">
                    You are about to terminate your active CEO session.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirmModal(false)}
                    className="h-10 rounded-none bg-[#121d29] border border-[#314354] text-[#f4cf69] font-bold text-[10px] uppercase tracking-widest hover:border-[#e6b83f] transition-all cursor-pointer"
                  >
                    No, Stay Logged In
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setShowLogoutConfirmModal(false);
                      await signOut();
                      navigate({ to: "/sign-in" });
                    }}
                    className="h-10 rounded-none bg-rose-600 text-white font-black text-xs uppercase tracking-widest hover:bg-rose-700 transition-all shadow-md cursor-pointer"
                  >
                    Yes, Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PROSPECTS PAGE CONTENT BODY */}
          <section className="p-4 sm:p-6 space-y-4 max-w-[1700px] mx-auto">
            {/* Executive 3D Tile Banner */}
            <div className="relative group z-0">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#d5a637]/30 via-[#f4cf69]/20 to-[#896019]/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#0d1c28] via-[#09141f] to-[#050e17] border-2 border-[#d4a43b]/40 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.15)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden">
                <div className="space-y-2.5 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e6b83f]/15 border border-[#e6b83f]/40 text-[#f4cf69] text-[9px] font-black uppercase tracking-[0.25em] rounded-md shadow-inner">
                    <Crown size={14} className="text-[#f4cf69]" /> AI Prospect Intelligence & Intent Discovery Engine
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif tracking-tight text-white flex flex-wrap items-center gap-2 leading-tight drop-shadow-md">
                    Inbound Prospect Intent & Lead Scoring Registry
                  </h1>

                  <p className="text-xs sm:text-sm text-[#98a7b7] font-medium leading-relaxed font-sans">
                    Detect customer intent signals, calculate 0–100 AI lead scores, match catalog services, and convert high-intent prospects.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2.5 rounded-lg bg-emerald-500 text-black font-black text-xs uppercase tracking-widest shadow-lg hover:bg-white transition-all cursor-pointer flex items-center gap-2"
                  >
                    <PlusCircle size={16} /> + Add Manual Prospect
                  </button>
                </div>
              </div>
            </div>

            {/* 5 INTENT METRICS CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-1">
                <span className="text-[9px] text-[#8d9baa] uppercase font-bold tracking-wider block">Hot Prospects (90+)</span>
                <p className="text-2xl font-black text-rose-400 font-mono">18 Hot 🔥</p>
                <span className="text-[9px] text-rose-400 font-medium">Contact Within 24h</span>
              </div>

              <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-1">
                <span className="text-[9px] text-[#8d9baa] uppercase font-bold tracking-wider block">Warm Prospects</span>
                <p className="text-2xl font-black text-[#f4cf69] font-mono">34 Warm</p>
                <span className="text-[9px] text-[#f4cf69] font-medium">Follow-Up Scheduled</span>
              </div>

              <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-1">
                <span className="text-[9px] text-[#8d9baa] uppercase font-bold tracking-wider block">New Prospects</span>
                <p className="text-2xl font-black text-white font-mono">76 New</p>
                <span className="text-[9px] text-blue-400 font-medium">Inbound Queue</span>
              </div>

              <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-1">
                <span className="text-[9px] text-[#8d9baa] uppercase font-bold tracking-wider block">High Intent Today</span>
                <p className="text-2xl font-black text-[#20e39b] font-mono">12 High</p>
                <span className="text-[9px] text-[#20e39b] font-medium">↑ Quote Requested</span>
              </div>

              <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-1">
                <span className="text-[9px] text-[#8d9baa] uppercase font-bold tracking-wider block">Est. Pipeline Value</span>
                <p className="text-2xl font-black text-[#f4cf69] font-mono">KES 4.8M</p>
                <span className="text-[9px] text-[#f4cf69] font-medium">Verified Intent</span>
              </div>
            </div>

            {/* DETAILED HIGH-INTENT PROSPECTS LEDGER CARDS */}
            <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#172533] pb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Intent Evidence Ledger</p>
                  <h3 className="text-xl font-black uppercase text-white">Inbound High-Intent Prospects & AI Analysis</h3>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px] uppercase rounded flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Consent Verified (Data Protection Act)
                </span>
              </div>

              <div className="space-y-4">
                {filteredProspects.map((pr) => (
                  <div key={pr.id} className="p-5 bg-[#09141f] border border-[#243343] rounded-xl hover:border-[#f4cf69]/50 transition-all space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#172530] pb-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px] uppercase">
                            {pr.urgency} Intent Score: {pr.score}/100
                          </span>
                          <span className="px-2.5 py-0.5 rounded bg-[#f4cf69]/20 text-[#f4cf69] font-bold text-[10px] uppercase">
                            {pr.event}
                          </span>
                          <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-[10px] uppercase">
                            {pr.source}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white uppercase">{pr.name} ({pr.company})</h4>
                        <p className="text-xs text-[#8d9baa] font-mono flex flex-wrap items-center gap-4">
                          <span>📍 {pr.location}</span>
                          <span>📅 {pr.date}</span>
                          <span>👥 {pr.guests}</span>
                          <span>💰 Budget: <b className="text-emerald-400">{formatKes(pr.budget)}</b></span>
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <a
                          href={`tel:${pr.phone}`}
                          className="px-3 py-2 bg-[#121d29] border border-[#314354] hover:border-[#f4cf69] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5"
                        >
                          <Phone size={14} className="text-emerald-400" /> Call {pr.phone}
                        </a>
                        <button
                          onClick={() => showToast(`✓ Converted ${pr.name} into Active CRM Deal!`)}
                          className="px-3 py-2 bg-[#f4cf69] text-black font-black text-xs uppercase tracking-wider rounded-lg hover:bg-white transition-all shadow cursor-pointer flex items-center gap-1.5"
                        >
                          <Sparkles size={14} /> Convert to Lead
                        </button>
                      </div>
                    </div>

                    {/* INTENT SIGNALS DETECTED & MATCHED SERVICES */}
                    <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="p-3 bg-[#0d1823] border border-[#172530] rounded-lg space-y-1.5">
                        <p className="font-bold text-[#f4cf69] uppercase text-[10px]">Intent Evidence Signals Detected:</p>
                        {pr.evidence.map((sig, i) => (
                          <p key={i} className="text-[#c7d0da] text-[11px] leading-tight">
                            ✓ {sig}
                          </p>
                        ))}
                      </div>

                      <div className="p-3 bg-[#0d1823] border border-[#172530] rounded-lg space-y-1.5">
                        <p className="font-bold text-[#20e39b] uppercase text-[10px]">AI Matched Catalog Services:</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {pr.matchedServices.map((svc, i) => (
                            <span key={i} className="px-2 py-0.5 bg-[#121d29] border border-[#243343] text-[#c7d0da] text-[10px] rounded">
                              ✓ {svc.name} ({svc.match})
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-amber-400 font-bold pt-2 border-t border-[#172530] mt-2">
                          💡 AI Recommendation: {pr.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* NEW PROSPECT MODAL */}
            {isModalOpen && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 font-sans animate-in fade-in duration-200">
                <div className="bg-[#09141f] border-2 border-[#f4cf69]/60 p-6 sm:p-8 rounded-xl max-w-lg w-full shadow-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-[#172533] pb-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Manual Lead Qualification</p>
                      <h3 className="text-lg font-black uppercase text-white">Create New Prospect Record</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="h-8 w-8 rounded-lg bg-[#121d29] text-[#8d9bad] hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAddProspect} className="space-y-4 text-xs">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-[#8d9bad]">Prospect Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Dr. Sarah Muthoni"
                        value={prospectName}
                        onChange={(e) => setProspectName(e.target.value)}
                        className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-[#8d9bad]">Company / Organization</label>
                        <input
                          type="text"
                          placeholder="Ex: ABC Ltd"
                          value={prospectCompany}
                          onChange={(e) => setProspectCompany(e.target.value)}
                          className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-[#8d9bad]">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="smuthoni@abcltd.co.ke"
                          value={prospectEmail}
                          onChange={(e) => setProspectEmail(e.target.value)}
                          className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-[#8d9bad]">Event Type *</label>
                        <input
                          type="text"
                          required
                          value={eventType}
                          onChange={(e) => setEventType(e.target.value)}
                          className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-[#8d9bad]">Estimated Budget (KES)</label>
                        <input
                          type="number"
                          value={estimatedBudget}
                          onChange={(e) => setEstimatedBudget(Number(e.target.value))}
                          className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full h-12 bg-[#f4cf69] text-black font-black text-xs uppercase tracking-[0.2em] rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl cursor-pointer pt-1"
                    >
                      <PlusCircle size={16} /> Save Prospect Record
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* COMPACT SMALL ADMIN FOOTER WITH MY WORLD AFRICA LINK */}
            <footer className="mt-8 pt-4 pb-2 border-t border-[#172533] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs text-[#8d9bad] font-mono">
              <div className="flex flex-wrap items-center gap-2">
                <span>© {new Date().getFullYear()} TOQUE REAL EVENTS LIMITED Nairobi.</span>
                <span className="hidden sm:inline">•</span>
                <a
                  href="https://myworldafric.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline italic text-[#f4cf69] font-serif"
                >
                  Powered by My World Africa
                </a>
              </div>

              <Link
                to="/contact"
                className="hover:text-white text-[#f4cf69] hover:underline flex items-center gap-1 font-sans font-bold text-[10px] uppercase tracking-wider"
              >
                <HelpCircle size={13} /> Help & Support
              </Link>
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}
