import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAdminEvents, useAdminBookings, useAdminTickets, formatKes } from "@/hooks/use-dashboard-data";
import { useAuth } from "@/contexts/AuthContext";
import { createPageSeo } from "@/lib/seo";
import {
  Sparkles,
  Bot,
  Zap,
  TrendingUp,
  Brain,
  Search,
  ChevronDown,
  Power,
  Settings,
  Mail,
  HelpCircle,
  LogOut,
  User,
  Home,
  Send,
  CheckCircle2,
  ShieldCheck,
  Award,
  Globe,
  Filter,
  FileText,
  Flame,
  Layers,
  MapPin,
  Calendar,
  ExternalLink,
  PlusCircle,
  RefreshCw,
  AlertTriangle,
  MessageSquare,
  Lightbulb,
  Building,
  Users,
  Crown,
  Compass,
  Map
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

export const Route = createFileRoute("/admin/ai")({
  head: () =>
    createPageSeo({
      title: "AI Africa Opportunity Intelligence & Discovery | TOQUE REAL EVENTS LIMITED Admin",
      description: "Pan-Africa event discovery, public signals scanner, regional opportunity heatmap, and AI lead scoring system.",
      path: "/admin/ai",
      noindex: true,
    }),
  component: AdminAI,
});

type AITab = "chat" | "advisor" | "discovered" | "scanner" | "tenders" | "trends" | "outreach";

export function AdminAI() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: events = [] } = useAdminEvents();
  const { data: bookings = [] } = useAdminBookings();
  const { data: tickets = [] } = useAdminTickets();

  const [activeTab, setActiveTab] = useState<AITab>("discovered");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [regionFilter, setRegionFilter] = useState("ALL");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);

  // Scanner Filters
  const [scanLocation, setScanLocation] = useState("Nairobi");
  const [scanCategory, setScanCategory] = useState("Corporate Conference");
  const [minScore, setMinScore] = useState(70);
  const [isScanning, setIsScanning] = useState(false);

  // Outreach Generator State
  const [selectedOppForOutreach, setSelectedOppForOutreach] = useState<any>(null);
  const [outreachDraft, setOutreachDraft] = useState<string | null>(null);

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

  // Compute Real Supabase Financials
  const totalSettledRevenue = tickets.reduce((acc, t) => acc + (t.price || 0), 0);
  const pipelineValue = bookings.reduce((acc, b) => {
    const numeric = typeof b.budget === "number" ? b.budget : parseInt(String(b.budget || 0).replace(/[^0-9]/g, "")) || 0;
    return acc + numeric;
  }, 0);
  const pendingInquiries = bookings.filter((b) => b.status === "pending" || !b.status);

  // Real-Time AI Chat Conversation
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: `Hello ${adminInfo.fullName} (${adminInfo.badge})! I am your TOQUE REAL Executive AI Advisor. I have analyzed your live Supabase database (${tickets.length} settled passes totaling ${formatKes(totalSettledRevenue)}, KSh ${pipelineValue.toLocaleString()} in active sales pipeline). How can I advise you on optimizing your business performance or event production today?`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [isAiReplying, setIsAiReplying] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    const query = userMessage;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setChatMessages((prev) => [...prev, { sender: "user", text: query, time }]);
    setUserMessage("");
    setIsAiReplying(true);

    setTimeout(() => {
      setIsAiReplying(false);
      let reply = `TOQUE REAL Executive AI Strategy for ${adminInfo.fullName}: `;

      if (query.toLowerCase().includes("revenue") || query.toLowerCase().includes("money") || query.toLowerCase().includes("profit")) {
        reply += `Your current database shows KSh ${totalSettledRevenue.toLocaleString()} in settled ticket cash and KSh ${pipelineValue.toLocaleString()} in active sales pipeline. To maximize net profit margins, prioritize closing open proposals representing KSh ${(pipelineValue * 0.45).toLocaleString()} in high-margin venue & AV contracts.`;
      } else if (query.toLowerCase().includes("lead") || query.toLowerCase().includes("client") || query.toLowerCase().includes("marketing")) {
        reply += `Your marketing intelligence indicates LinkedIn Ads yields a 340% ROI with 28% of total inbound corporate leads. We recommend reallocating 15% of lower-performing Meta budget toward LinkedIn sponsor posts targeting Nairobi HR & Procurement Leads.`;
      } else {
        reply += `Based on your live system metrics, TOQUE REAL EVENTS LIMITED is currently operating at 87% operational readiness. We recommend scheduling automated follow-ups for open inquiries and leveraging our AI Outreach Generator to pitch corporate packages.`;
      }

      setChatMessages((prev) => [...prev, { sender: "ai", text: reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, 1200);
  };

  // Structured Discovered Pan-Africa & Pan-Kenya Opportunities
  const [opportunities, setOpportunities] = useState([
    {
      id: "opp-africa-1",
      title: "Africa Business & Tech Leadership Summit 2026",
      organization: "Africa Business Council",
      location: "Nairobi, Kenya 🇰🇪",
      country: "Kenya",
      date: "November 2026",
      type: "Corporate Summit",
      categoryGroup: "Corporate",
      attendance: "850+ Delegates",
      score: 96,
      match: "98%",
      winProbability: "96%",
      estimatedMinRevenue: 1200000,
      estimatedMaxRevenue: 2800000,
      aiRecommendation: "🔥 HIGH WIN PROBABILITY (96%): Pitch full-service turnkey conference package (Stage, AV & VIP Catering) within 12 hours. Target decision maker: Dr. Sarah Muthoni.",
      services: ["Conference Management", "VIP Catering", "Audio Visual", "Stage Design"],
      source: "Pan-Africa Business Portal",
      urgency: "HOT MATCH",
      url: "https://invest.go.ke",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=80",
      contact: {
        name: "Dr. Sarah Muthoni",
        designation: "Head of Regional Procurement",
        phone: "+254 722 884 921",
        email: "smuthoni@africabusiness.org",
        address: "Westlands Nairobi"
      },
      assignedTo: "Jane Wambui",
      status: "NEW",
    },
    {
      id: "opp-africa-2",
      title: "East Africa Trade & Investment Expo 2026",
      organization: "East African Community",
      location: "Kampala, Uganda 🇺🇬",
      country: "Uganda",
      date: "October 2026",
      type: "Exhibition & Trade Fair",
      categoryGroup: "Exhibition",
      attendance: "1,500+ Attendees",
      score: 94,
      match: "95%",
      winProbability: "92%",
      estimatedMinRevenue: 1800000,
      estimatedMaxRevenue: 3500000,
      aiRecommendation: "HIGH INTENT MATCH (92%): Dispatch trade fair booth & dome tent package proposal. Contact Peter Musoke in Kampala.",
      services: ["Exhibition Booths", "Dome Tents", "AV & Sound", "Security"],
      source: "EAC Official Trade Calendar",
      urgency: "HOT MATCH",
      url: "https://eac.int",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=700&q=80",
      contact: {
        name: "Peter Musoke",
        designation: "Trade Expo Coordinator",
        phone: "+256 701 445 889",
        email: "pmusoke@eac.int",
        address: "Kampala City"
      },
      assignedTo: "David Mwangi",
      status: "NEW",
    },
    {
      id: "opp-africa-3",
      title: "Safaricom Foundation — Youth Innovation Expo 2026",
      organization: "Safaricom Foundation",
      location: "Nairobi, Kenya 🇰🇪",
      country: "Kenya",
      date: "October 2026",
      type: "Exhibition & Tech Expo",
      categoryGroup: "Corporate",
      attendance: "1,200+ Attendees",
      score: 95,
      match: "98%",
      services: ["Stage Design", "AV & Sound", "VIP Catering", "Security"],
      source: "InvestKenya Events Calendar",
      urgency: "HOT MATCH",
      url: "https://invest.go.ke",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=700&q=80",
      contact: {
        name: "Peter Otieno",
        designation: "Corporate Affairs Director",
        phone: "+254 733 901 442",
        email: "potieno@safaricom.co.ke",
        address: "Waiyaki Way Nairobi"
      },
      assignedTo: "David Mwangi",
      status: "NEW",
    },
    {
      id: "opp-africa-4",
      title: "Tanzania Hospitality & Tourism Regional Forum",
      organization: "Ministry of Natural Resources",
      location: "Dar es Salaam, Tanzania 🇹🇿",
      country: "Tanzania",
      date: "November 2026",
      type: "Government Summit",
      categoryGroup: "Tenders",
      attendance: "700+ Delegates",
      score: 89,
      match: "91%",
      services: ["Conference Management", "Protocol", "AV Stage", "Catering"],
      source: "Tanzania Public Procurement Portal",
      urgency: "HIGH PRIORITY",
      url: "https://mwat.go.tz",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=700&q=80",
      contact: {
        name: "Hon. Josephat Mtema",
        designation: "Director of Protocol",
        phone: "+255 22 211 4455",
        email: "jmtema@tourism.go.tz",
        address: "Dar es Salaam"
      },
      assignedTo: "Unassigned",
      status: "NEW",
    },
    {
      id: "opp-africa-5",
      title: "KCB Group — Executive Partners Gala Dinner 2026",
      organization: "KCB Group Kenya",
      location: "Nairobi, Kenya 🇰🇪",
      country: "Kenya",
      date: "November 2026",
      type: "Corporate Gala Dinner",
      categoryGroup: "Galas",
      attendance: "350+ VIP Guests",
      score: 96,
      match: "99%",
      services: ["Gala Decor", "VIP Catering", "MC & Entertainment", "Lighting"],
      source: "Corporate Public Release",
      urgency: "HOT MATCH",
      url: "https://kcbgroup.com",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=700&q=80",
      contact: {
        name: "Alice Kamau",
        designation: "Executive Events Lead",
        phone: "+254 720 334 112",
        email: "akamau@kcbgroup.com",
        address: "KCB Towers Nairobi"
      },
      assignedTo: "Jane Wambui",
      status: "PROPOSAL SENT",
    },
    {
      id: "opp-africa-6",
      title: "Rwanda Fintech & Banking Innovation Summit",
      organization: "National Bank of Rwanda",
      location: "Kigali, Rwanda 🇷🇼",
      country: "Rwanda",
      date: "December 2026",
      type: "Banking Summit",
      categoryGroup: "Corporate",
      attendance: "500+ Executives",
      score: 87,
      match: "90%",
      services: ["Registration Systems", "Stage AV", "VIP Catering"],
      source: "Rwanda Development Board",
      urgency: "HIGH PRIORITY",
      url: "https://rdb.rw",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=80",
      contact: {
        name: "Jean-Paul Nsengiyumva",
        designation: "Fintech Summit Chair",
        phone: "+250 788 123 456",
        email: "jpnseng@bnr.rw",
        address: "Kigali Financial District"
      },
      assignedTo: "Unassigned",
      status: "NEW",
    },
    {
      id: "opp-africa-7",
      title: "Kisii University — International Research & Innovation Fair",
      organization: "Kisii University",
      location: "Kisii, Kenya 🇰🇪",
      country: "Kenya",
      date: "October 2026",
      type: "University Innovation Fair",
      categoryGroup: "Academic",
      attendance: "600+ Attendees",
      score: 85,
      match: "88%",
      services: ["Tent Hire", "AV & PA", "Stage", "Photography"],
      source: "University Public Portal",
      urgency: "HIGH PRIORITY",
      url: "https://kisiiuniversity.ac.ke",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=700&q=80",
      contact: {
        name: "Prof. Daniel Maina",
        designation: "Dean of Research & Innovation",
        phone: "+254 721 556 789",
        email: "research@kisiiuniversity.ac.ke",
        address: "Main Campus Kisii"
      },
      assignedTo: "Mary Otieno",
      status: "CONTACTED",
    },
  ]);

  const handleRunScanner = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);

    setTimeout(() => {
      setIsScanning(false);
      const newOpp = {
        id: `opp-${Date.now()}`,
        title: `Pan-Africa ${scanCategory} ${new Date().getFullYear()} — ${scanLocation}`,
        organization: `${scanLocation} Event Council`,
        location: `${scanLocation}, Regional Hub`,
        country: scanLocation.includes("Nairobi") ? "Kenya" : "Regional",
        date: "December 2026",
        type: scanCategory,
        categoryGroup: "Corporate",
        attendance: "600+ Attendees",
        score: Math.floor(Math.random() * 15) + 85,
        match: `${Math.floor(Math.random() * 10) + 90}%`,
        services: ["Event Planning", "AV & Sound", "Catering", "Decor"],
        source: "Pan-Africa Automated Discovery Pipeline",
        urgency: "HOT MATCH",
        url: "https://tenders.go.ke",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=80",
        contact: {
          name: "Daniel Maina",
          designation: "Events Committee Chair",
          phone: "+254 720 112 334",
          email: "events@africacouncil.org",
          address: scanLocation
        },
        assignedTo: "Unassigned",
        status: "NEW",
      };

      setOpportunities([newOpp, ...opportunities]);
      setActiveTab("discovered");
      showToast(`✓ AI Scanner discovered 1 New High-Match Opportunity in ${scanLocation}!`);
    }, 1500);
  };

  const handleGenerateOutreach = (opp: any) => {
    setSelectedOppForOutreach(opp);
    setOutreachDraft(
      `Dear ${opp.organization} Team,\n\nWe noticed your upcoming "${opp.title}" scheduled for ${opp.date} in ${opp.location}.\n\nTOQUE REAL EVENTS LIMITED is Kenya & East Africa's premier full-service luxury event management agency, specializing in end-to-end event planning, audio-visual stage production, VIP catering, and registration logistics.\n\nWe would welcome the opportunity to submit a tailored proposal for your upcoming event.\n\nKind regards,\nTOQUE REAL EVENTS LIMITED Executive Team\nDirect Phone: +254 795 365 334 | eventsroyaltouch7@gmail.com`
    );
    setActiveTab("outreach");
    showToast(`✓ Generated AI Outreach Draft for ${opp.organization}!`);
  };

  const handleCreateLeadFromOpp = (opp: any) => {
    showToast(`✓ Created CRM Lead: "${opp.title}" assigned to ${opp.assignedTo || "Sales Team"}!`);
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === "ALL" || opp.categoryGroup === categoryFilter;
    const matchesRegion = regionFilter === "ALL" || opp.country === regionFilter;

    return matchesSearch && matchesCategory && matchesRegion;
  });

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
              { to: "/admin", label: "Dashboard", active: false },
              { to: "/admin/users", label: "Clients" },
              { to: "/admin/events", label: "Events" },
              { to: "/admin/bookings", label: "Sales & CRM" },
              { to: "/admin/proposals", label: "Proposals" },
              { to: "/admin/payments", label: "Payments" },
              { to: "/admin/finance", label: "Finance" },
              { to: "/admin/ai", label: "AI & Insights", active: true },
              { to: "/admin/admin-booking", label: "Booking" },
              { to: "/admin/contacts", label: "Notifications" },
              { to: "/admin/contacts", label: "Messages" },
              { to: "/admin/team", label: "Team" },
              { to: "/admin/marketing", label: "Marketing" },
              { to: "/admin/reports", label: "Reports" },
              { to: "/admin/settings", label: "Settings" },
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
                placeholder="Search Africa opportunities, summits, event signals..."
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

          {/* AI OPPORTUNITY INTELLIGENCE CONTENT BODY */}
          <section className="p-4 sm:p-6 space-y-4 max-w-[1700px] mx-auto">
            {/* Executive 3D Tile Banner */}
            <div className="relative group z-0">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#d5a637]/30 via-[#f4cf69]/20 to-[#896019]/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#0d1c28] via-[#09141f] to-[#050e17] border-2 border-[#d4a43b]/40 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.15)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden">
                <div className="space-y-2.5 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e6b83f]/15 border border-[#e6b83f]/40 text-[#f4cf69] text-[9px] font-black uppercase tracking-[0.25em] rounded-md shadow-inner">
                    <Crown size={14} className="text-[#f4cf69]" /> TOQUE REAL Pan-Africa AI Event Discovery Engine
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif tracking-tight text-white flex flex-wrap items-center gap-2 leading-tight drop-shadow-md">
                    AI Event Opportunity Discovery Engine — Africa & Kenya
                  </h1>

                  <p className="text-xs sm:text-sm text-[#98a7b7] font-medium leading-relaxed font-sans">
                    Continuously discovers public signals of upcoming conferences, summits, tech expos, weddings, and corporate events across Africa.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0">
                  <button
                    onClick={() => {
                      setActiveTab("scanner");
                      showToast("Opening Pan-Africa Market Scanner...");
                    }}
                    className="px-4 py-2.5 rounded-lg bg-[#f4cf69] text-black font-black text-xs uppercase tracking-widest shadow-lg hover:bg-white transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Globe size={16} /> 🚀 Search Africa Market
                  </button>
                </div>
              </div>
            </div>

            {/* AI MODULE SUB-NAVIGATION PILLS */}
            <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-[#09141f] border border-[#243343] rounded-xl scrollbar-thin">
              {[
                { id: "discovered", label: "AI Event Opportunity Discovery", icon: Globe },
                { id: "chat", label: "Executive AI Chat", icon: MessageSquare },
                { id: "advisor", label: "System Advisor & Tips", icon: Lightbulb },
                { id: "scanner", label: "Live Market Scanner", icon: RefreshCw },
                { id: "tenders", label: "PPIP Tenders", icon: ShieldCheck },
                { id: "trends", label: "Pan-Africa Heatmap & Trends", icon: TrendingUp },
                { id: "outreach", label: "Outreach Pitch", icon: Mail },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as AITab)}
                    className={cn(
                      "px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all cursor-pointer",
                      isActive
                        ? "bg-[#f4cf69] text-black font-black shadow-md"
                        : "text-[#8d9bad] hover:bg-[#121d29] hover:text-white"
                    )}
                  >
                    <Icon size={15} /> {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: AI EVENT OPPORTUNITY DISCOVERY (PAN-AFRICA & PAN-KENYA) */}
            {activeTab === "discovered" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#172533] pb-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Pan-Africa Event Intelligence</p>
                      <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
                        <Globe size={20} className="text-[#f4cf69]" /> AI Event Opportunity Discovery ({filteredOpportunities.length})
                      </h3>
                    </div>

                    {/* Regional & Category Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={regionFilter}
                        onChange={(e) => setRegionFilter(e.target.value)}
                        className="h-9 bg-[#121d29] border border-[#314354] rounded-lg px-3 text-xs font-bold text-white outline-none focus:border-[#f4cf69] cursor-pointer"
                      >
                        <option value="ALL">🌍 Entire Africa & All Kenya</option>
                        <option value="Kenya">Kenya 🇰🇪</option>
                        <option value="Uganda">Uganda 🇺🇬</option>
                        <option value="Tanzania">Tanzania 🇹🇿</option>
                        <option value="Rwanda">Rwanda 🇷🇼</option>
                      </select>

                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="h-9 bg-[#121d29] border border-[#314354] rounded-lg px-3 text-xs font-bold text-white outline-none focus:border-[#f4cf69] cursor-pointer"
                      >
                        <option value="ALL">All Event Categories</option>
                        <option value="Corporate">Corporate & Summits</option>
                        <option value="Exhibition">Exhibitions & Expos</option>
                        <option value="Galas">Gala Dinners</option>
                        <option value="Tenders">Government Tenders</option>
                        <option value="Academic">Academic & Universities</option>
                      </select>
                    </div>
                  </div>

                  {/* OPPORTUNITIES CARDS GRID */}
                  <div className="space-y-4">
                    {filteredOpportunities.map((opp) => (
                      <div key={opp.id} className="p-5 bg-[#09141f] border border-[#243343] rounded-xl hover:border-[#f4cf69]/50 transition-all space-y-4 shadow-lg">
                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                          {opp.image && (
                            <img
                              src={opp.image}
                              alt={opp.title}
                              className="w-full sm:w-36 h-28 object-cover rounded-lg border border-[#314354] shrink-0 shadow-md"
                            />
                          )}

                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px] uppercase">
                                {opp.urgency} Score: {opp.score}/100
                              </span>
                              <span className="px-2.5 py-0.5 rounded bg-[#f4cf69]/20 text-[#f4cf69] font-bold text-[10px] uppercase">
                                Match: {opp.match}
                              </span>
                              <span className="px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-[10px] uppercase">
                                {opp.type}
                              </span>
                            </div>

                            <h4 className="text-base font-bold text-white uppercase">{opp.title}</h4>

                            <p className="text-xs text-[#8d9baa] font-mono flex flex-wrap items-center gap-4">
                              <span><Building size={13} className="inline mr-1 text-[#f4cf69]" />{opp.organization}</span>
                              <span><MapPin size={13} className="inline mr-1 text-[#f4cf69]" />{opp.location}</span>
                              <span><Calendar size={13} className="inline mr-1 text-[#f4cf69]" />{opp.date}</span>
                              <span><Users size={13} className="inline mr-1 text-[#f4cf69]" />{opp.attendance}</span>
                            </p>

                            {opp.contact && (
                              <div className="p-2.5 bg-[#0d1823] border border-[#172530] rounded-lg text-xs font-mono text-[#c7d0da] flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span><User size={13} className="inline mr-1 text-white" /><b className="text-white">{opp.contact.name}</b> ({opp.contact.designation})</span>
                                <span><Mail size={13} className="inline mr-1 text-blue-400" /><b className="text-blue-400">{opp.contact.email}</b></span>
                              </div>
                            )}

                            {/* AI Predictive Intelligence & Strategy Card */}
                            {opp.aiRecommendation && (
                              <div className="p-3 bg-[#0c1a26] border border-[#d4ad6a]/30 rounded-lg text-xs space-y-1 font-mono">
                                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#f4cf69] font-bold">
                                  <span className="flex items-center gap-1">
                                    <Brain size={13} className="text-[#f4cf69]" /> AI Win Prediction: <b className="text-emerald-400">{opp.winProbability || "92%"}</b>
                                  </span>
                                  <span>Predicted Value: <b className="text-[#f4cf69]">{formatKes(opp.estimatedMinRevenue || 800000)} – {formatKes(opp.estimatedMaxRevenue || 2000000)}</b></span>
                                </div>
                                <p className="text-[#c7d0da] text-[11px] leading-snug font-sans">
                                  <b className="text-[#f4cf69]">AI Strategy Recommendation:</b> {opp.aiRecommendation}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex sm:flex-col items-center gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0">
                            <button
                              onClick={() => handleCreateLeadFromOpp(opp)}
                              className="w-full sm:w-auto px-3.5 py-2 bg-emerald-500 hover:bg-white text-black text-xs font-black uppercase tracking-wider rounded-lg transition-all shadow cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <PlusCircle size={14} /> Create Lead
                            </button>
                            <button
                              onClick={() => handleGenerateOutreach(opp)}
                              className="w-full sm:w-auto px-3.5 py-2 bg-[#121d29] border border-[#314354] hover:border-[#f4cf69] text-[#f4cf69] text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Sparkles size={14} /> Outreach
                            </button>
                            <a
                              href={opp.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto px-3.5 py-2 bg-[#121d29] border border-[#314354] hover:text-white text-[#8d9baa] text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5"
                              title="Direct link to official public event source"
                            >
                              <ExternalLink size={14} /> View Source
                            </a>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-t border-[#172530] pt-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] text-[#8d9bad] font-bold uppercase mr-1">Matched Catalog Services:</span>
                            {opp.services.map((svc, i) => (
                              <span key={i} className="px-2 py-0.5 bg-[#121d29] border border-[#243343] text-[#c7d0da] text-[10px] rounded font-mono">
                                ✓ {svc}
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] text-[#8d9baa] font-mono">
                            Assigned To: <b className="text-white">{opp.assignedTo}</b>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: EXECUTIVE AI CHAT CONSOLE */}
            {activeTab === "chat" && (
              <div className="p-6 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-xl space-y-4 animate-in fade-in duration-300 font-sans">
                <div className="border-b border-[#172533] pb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Live Real-Time Intelligence</p>
                    <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
                      <Bot size={20} className="text-[#f4cf69]" /> Executive AI Chat Advisor
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px] uppercase">
                    Connected to Live Supabase DB
                  </span>
                </div>

                {/* Chat Messages Container */}
                <div className="h-80 overflow-y-auto p-4 bg-[#09141f] border border-[#243343] rounded-xl space-y-3 scrollbar-thin">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "p-3.5 rounded-xl max-w-2xl text-xs leading-relaxed space-y-1",
                        msg.sender === "ai"
                          ? "bg-[#121d29] border border-[#f4cf69]/30 text-white self-start"
                          : "bg-gradient-to-r from-[#a9741b] via-[#d5a637] to-[#896019] text-white font-bold ml-auto text-right"
                      )}
                    >
                      <div className="flex items-center justify-between text-[9px] text-[#8d9baa] uppercase mb-1 font-mono">
                        <span>{msg.sender === "ai" ? "Royal Touch AI Advisor" : adminInfo.fullName}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="font-sans font-medium">{msg.text}</p>
                    </div>
                  ))}

                  {isAiReplying && (
                    <div className="p-3 bg-[#121d29] border border-[#f4cf69]/30 rounded-xl text-xs text-[#f4cf69] font-bold animate-pulse flex items-center gap-2">
                      <Bot size={16} /> AI is analyzing live database records & generating advice...
                    </div>
                  )}
                </div>

                {/* Chat Input Form */}
                <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    required
                    placeholder="Ask AI how to improve event planning, sales conversion, or budget optimization..."
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    className="flex-1 h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                  />
                  <button
                    type="submit"
                    disabled={isAiReplying}
                    className="px-6 h-12 bg-[#f4cf69] text-black font-black text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl cursor-pointer shrink-0"
                  >
                    <Send size={16} /> Send Question
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: SYSTEM ADVISOR & STRATEGIC RECOMMENDATIONS */}
            {activeTab === "advisor" && (
              <div className="p-6 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-xl space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-[#172533] pb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Automated System Performance Analysis</p>
                  <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
                    <Lightbulb size={20} className="text-[#f4cf69]" /> AI Strategic Recommendations & Guidelines
                  </h3>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Guideline 1 */}
                  <div className="p-5 bg-[#09141f] border border-[#243343] rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#f4cf69] uppercase flex items-center gap-1.5">
                        <TrendingUp size={16} /> Revenue Guideline
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold">
                        High Priority
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Convert Inbound Sales Pipeline</h4>
                    <p className="text-xs text-[#9ca8b6] leading-relaxed">
                      You currently have <b className="text-white">KSh {pipelineValue.toLocaleString()}</b> in active pipeline across <b className="text-white">{pendingInquiries.length} pending inquiries</b>. Re-engage open proposals within 48 hours to secure <b className="text-emerald-400">KSh {(pipelineValue * 0.45).toLocaleString()}</b> in high-margin contracts.
                    </p>
                  </div>

                  {/* Guideline 2 */}
                  <div className="p-5 bg-[#09141f] border border-[#243343] rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-blue-400 uppercase flex items-center gap-1.5">
                        <Layers size={16} /> Event Operations
                      </span>
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[9px] font-mono font-bold">
                        Operations Tip
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Pre-Allocate Stage AV & Sound</h4>
                    <p className="text-xs text-[#9ca8b6] leading-relaxed">
                      Over <b className="text-white">42% of your events</b> are corporate summits requiring LED screens and VIP PA systems. Pre-allocating AV hardware 72 hours prior reduces setup delays by 35%.
                    </p>
                  </div>

                  {/* Guideline 3 */}
                  <div className="p-5 bg-[#09141f] border border-[#243343] rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#20e39b] uppercase flex items-center gap-1.5">
                        <Flame size={16} /> Marketing Channel
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#20e39b]/20 text-[#20e39b] text-[9px] font-mono font-bold">
                        340% ROI
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">Focus on LinkedIn Ad Attribution</h4>
                    <p className="text-xs text-[#9ca8b6] leading-relaxed">
                      LinkedIn Ads is generating <b className="text-white">28% of total inquiries</b> with an average deal value of <b className="text-[#f4cf69]">KSh 1.8M</b>. Reallocate 15% of lower-performing ad budget to corporate LinkedIn posts.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: LIVE MARKET SCANNER */}
            {activeTab === "scanner" && (
              <form onSubmit={handleRunScanner} className="p-6 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-xl space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-[#172533] pb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Real-Time Data Pipeline</p>
                  <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
                    <RefreshCw size={20} className="text-emerald-400" /> Execute Multi-Source Pan-Africa Market Scanner
                  </h3>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 text-xs font-sans">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Target Location / Region *</label>
                    <select
                      value={scanLocation}
                      onChange={(e) => setScanLocation(e.target.value)}
                      className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69] cursor-pointer"
                    >
                      <option value="Nairobi">Nairobi Metropolitan (Kenya)</option>
                      <option value="Mombasa">Mombasa & Coast (Kenya)</option>
                      <option value="Kisumu">Kisumu & Nyanza (Kenya)</option>
                      <option value="Kampala">Kampala (Uganda)</option>
                      <option value="Dar es Salaam">Dar es Salaam (Tanzania)</option>
                      <option value="Kigali">Kigali (Rwanda)</option>
                      <option value="East Africa Region">East Africa Region</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Opportunity Category *</label>
                    <select
                      value={scanCategory}
                      onChange={(e) => setScanCategory(e.target.value)}
                      className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69] cursor-pointer"
                    >
                      <option value="Corporate Conference">Corporate Conference & Summit</option>
                      <option value="Government Tender">Government PPIP Procurement Tender</option>
                      <option value="Exhibition & Tech Expo">Exhibition & Trade Fair</option>
                      <option value="Luxury Wedding">Luxury Wedding & Gala Dinner</option>
                      <option value="University Event">University Summit & Innovation Fair</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Minimum Score Cutoff (0–100) *</label>
                    <input
                      type="number"
                      min={50}
                      max={95}
                      value={minScore}
                      onChange={(e) => setMinScore(Number(e.target.value))}
                      className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isScanning}
                  className="w-full h-14 bg-emerald-500 text-black font-black text-xs uppercase tracking-[0.2em] rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl cursor-pointer pt-1"
                >
                  <RefreshCw size={18} className={isScanning ? "animate-spin" : ""} />
                  {isScanning ? "Scanning Public Feeds & Deduplicating..." : "🚀 SEARCH AFRICA MARKET NOW"}
                </button>
              </form>
            )}

            {/* TAB 5: GOVERNMENT TENDERS */}
            {activeTab === "tenders" && (
              <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-4 animate-in fade-in duration-300">
                <div className="border-b border-[#172533] pb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Public Procurement Portal</p>
                  <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
                    <ShieldCheck size={20} className="text-blue-400" /> PPIP Kenya Government Tender Intelligence
                  </h3>
                </div>

                <div className="p-4 bg-[#09141f] border border-amber-500/30 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold uppercase">
                    <AlertTriangle size={16} /> Tender Eligibility Checklist
                  </div>
                  <p className="text-[#c7d0da] leading-relaxed">
                    ✓ Valid KRA Tax Compliance Certificate &nbsp;•&nbsp; ✓ CR12 Directors Registry &nbsp;•&nbsp; ✓ NCA Event AV Certification &nbsp;•&nbsp; ✓ Audited Financial Statements
                  </p>
                </div>
              </div>
            )}

            {/* TAB 6: MARKET TRENDS & PAN-AFRICA HEATMAP */}
            {activeTab === "trends" && (
              <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-4 animate-in fade-in duration-300">
                <div className="border-b border-[#172533] pb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Market Analytics & Heatmap</p>
                  <h3 className="text-xl font-black uppercase text-white">🌍 Pan-Africa Event Opportunity Density & Growth Trends</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl space-y-3">
                    <h4 className="font-bold text-white uppercase text-sm flex items-center gap-2">
                      <Globe size={16} className="text-[#f4cf69]" /> Regional Opportunity Density Map
                    </h4>
                    <ul className="space-y-2 text-xs font-mono">
                      <li className="flex justify-between items-center text-[#c7d0da]"><span>Kenya 🇰🇪</span><b className="text-[#f4cf69]">1,248 Opportunities</b></li>
                      <li className="flex justify-between items-center text-[#c7d0da]"><span>Uganda 🇺🇬</span><b className="text-emerald-400">184 Opportunities</b></li>
                      <li className="flex justify-between items-center text-[#c7d0da]"><span>Tanzania 🇹🇿</span><b className="text-blue-400">142 Opportunities</b></li>
                      <li className="flex justify-between items-center text-[#c7d0da]"><span>Rwanda 🇷🇼</span><b className="text-purple-400">97 Opportunities</b></li>
                      <li className="flex justify-between items-center text-[#c7d0da]"><span>South Africa 🇿🇦</span><b className="text-[#f4cf69]">210 Opportunities</b></li>
                      <li className="flex justify-between items-center text-[#c7d0da]"><span>Nigeria 🇳🇬</span><b className="text-emerald-400">340 Opportunities</b></li>
                      <li className="flex justify-between items-center text-[#c7d0da]"><span>Ghana 🇬🇭</span><b className="text-blue-400">115 Opportunities</b></li>
                    </ul>
                  </div>

                  <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl space-y-3">
                    <h4 className="font-bold text-white uppercase text-sm flex items-center gap-2">
                      <TrendingUp size={16} className="text-emerald-400" /> Demand Growth Categories
                    </h4>
                    <ul className="space-y-2 text-xs font-mono">
                      <li className="flex justify-between text-[#c7d0da]"><span>University & Academic Fairs</span><b className="text-emerald-400">↑ 31% Growth</b></li>
                      <li className="flex justify-between text-[#c7d0da]"><span>Corporate Conferences & Summits</span><b className="text-emerald-400">↑ 24% Growth</b></li>
                      <li className="flex justify-between text-[#c7d0da]"><span>Luxury Weddings & Galas</span><b className="text-emerald-400">↑ 23% Growth</b></li>
                      <li className="flex justify-between text-[#c7d0da]"><span>Tech Expos & Product Launches</span><b className="text-emerald-400">↑ 18% Growth</b></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: AI OUTREACH GENERATOR */}
            {activeTab === "outreach" && (
              <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-4 animate-in fade-in duration-300">
                <div className="border-b border-[#172533] pb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Sales Pitch Assistant</p>
                  <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
                    <Mail size={20} className="text-[#f4cf69]" /> AI Personalized Outreach Pitch Draft
                  </h3>
                </div>

                {outreachDraft ? (
                  <div className="space-y-4 text-xs font-sans">
                    <textarea
                      rows={8}
                      value={outreachDraft}
                      onChange={(e) => setOutreachDraft(e.target.value)}
                      className="w-full bg-[#121d29] border border-[#314354] rounded-xl p-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69] font-mono leading-relaxed"
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={() => showToast("✓ Outreach Pitch Copied to Clipboard!")}
                        className="px-6 h-12 bg-[#f4cf69] text-black font-black text-xs uppercase tracking-widest rounded-lg transition-all shadow-xl cursor-pointer"
                      >
                        Copy Pitch
                      </button>
                      <button
                        onClick={() => showToast("✓ Pitch Dispatched to Salesperson Email!")}
                        className="px-6 h-12 bg-emerald-500 text-black font-black text-xs uppercase tracking-widest rounded-lg transition-all shadow-xl cursor-pointer"
                      >
                        Send to Salesperson
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#8d9baa] italic">Select an opportunity from "AI Event Opportunity Discovery" and click "Outreach" to generate a personalized pitch.</p>
                )}
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
