import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  useAdminBookings,
  useAdminTickets,
  useUpdateBookingStatus,
  useIssueTicket,
  formatKes
} from "@/hooks/use-dashboard-data";
import { useAuth } from "@/contexts/AuthContext";
import {
  FileText,
  Ticket as TicketIcon,
  CheckCircle2,
  Clock,
  ScanLine,
  Search,
  Filter,
  DollarSign,
  UserCheck,
  Plus,
  Loader2,
  Share2,
  Send,
  Sparkles,
  Copy,
  Receipt,
  X,
  Bell,
  ChevronDown,
  Settings,
  Mail,
  HelpCircle,
  LogOut,
  Power,
  Flame,
  Zap,
  TrendingUp,
  Target,
  Kanban,
  Calendar,
  MessageSquare,
  PhoneCall,
  Award,
  BarChart3,
  FileCheck2,
  UserPlus,
  Menu,
  MapPin,
  User,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking, Ticket } from "@/lib/database.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InvoiceModal } from "@/components/dashboard/InvoiceModal";
import { TicketPassModal } from "@/components/dashboard/TicketPassModal";
import { TicketScannerModal } from "@/components/dashboard/TicketScannerModal";

export const Route = createFileRoute("/admin/bookings")({
  validateSearch: (search: Record<string, unknown>) => ({
    action: search.action as string | undefined,
    tab: search.tab as string | undefined,
    status: search.status as string | undefined,
  }),
  component: AdminBookings,
});

type CRMSection = "overview" | "leads" | "pipeline" | "quotations" | "followups" | "won_deals";

function AdminBookings() {
  const searchParams = Route.useSearch();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

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

  const { data: bookings = [], isLoading: loadingBookings, refetch: refetchBookings } = useAdminBookings();
  const { data: tickets = [], isLoading: loadingTickets } = useAdminTickets();

  const updateBookingMutation = useUpdateBookingStatus();
  const issueTicketMutation = useIssueTicket();

  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);

  // Active CRM Section
  const [crmSection, setCrmSection] = useState<CRMSection>(
    (searchParams.tab as CRMSection) || "overview"
  );

  // Modals
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<Booking | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // New Lead Form
  const [leadName, setLeadName] = useState("");
  const [leadCompany, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadService, setLeadService] = useState("Corporate Gala");
  const [leadBudget, setLeadBudget] = useState("KSh 1,800,000");

  // Quotation Itemizer Form
  const [quoteClient, setQuoteClient] = useState("ABC Limited");
  const [quoteEvent, setQuoteEvent] = useState("Annual Corporate Gala Night");
  const [venueCost, setVenueCost] = useState(500000);
  const [decorCost, setDecorCost] = useState(250000);
  const [cateringCost, setCateringCost] = useState(600000);
  const [entertainmentCost, setEntertainmentCost] = useState(150000);

  useEffect(() => {
    if (searchParams.action === "invoice" && bookings.length > 0) {
      setSelectedBookingForInvoice(bookings[0]);
      setIsInvoiceModalOpen(true);
    }
  }, [searchParams.action, bookings]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const calculateLeadScore = (budgetStr: string) => {
    const numeric = parseInt(budgetStr.replace(/[^0-9]/g, "")) || 0;
    if (numeric >= 1500000) return { score: 95, label: "HOT", color: "text-rose-400 bg-rose-500/20 border-rose-500/40" };
    if (numeric >= 500000) return { score: 72, label: "WARM", color: "text-[#f4cf69] bg-[#f4cf69]/20 border-[#f4cf69]/40" };
    return { score: 45, label: "COLD", color: "text-blue-400 bg-blue-500/20 border-blue-500/40" };
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadCompany.trim()) return;

    showToast(`✓ New Lead created for ${leadName} (${leadCompany})!`);
    setIsNewLeadModalOpen(false);
    setLeadName("");
    setLeadEmail("");
  };

  const quoteSubtotal = venueCost + decorCost + cateringCost + entertainmentCost;
  const quoteVAT = quoteSubtotal * 0.16;
  const quoteTotal = quoteSubtotal + quoteVAT;

  const handleSendQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsQuotationModalOpen(false);
    showToast(`✓ Official Quotation of ${formatKes(quoteTotal)} dispatched to ${quoteClient}!`);
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.event_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPipelineAmount = bookings.reduce((acc, b) => {
    const numeric = typeof b.budget === "number" ? b.budget : parseInt(String(b.budget || 0).replace(/[^0-9]/g, "")) || 0;
    return acc + numeric;
  }, 0);

  const userInitials = profile?.full_name ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase() : "JO";

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
            <div className="text-2xl font-serif">♕</div>
            {!isMenuCollapsed && (
              <>
                <div className="font-serif tracking-[2px] text-sm mt-1 font-bold">ROYAL TOUCH</div>
                <div className="font-serif tracking-[4px] text-[10px] opacity-80 mt-0.5">EVENTS</div>
              </>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#243343] scrollbar-track-[#07101a]">
            {[
              { to: "/admin", label: "Dashboard", icon: "▣" },
              { to: "/admin/users", label: "Clients", icon: "♟" },
              { to: "/admin/prospects", label: "Prospects", icon: "✦" },
              { to: "/admin/customers", label: "Customers", icon: "♟" },
              { to: "/admin/events", label: "Events", icon: "▦" },
              { to: "/admin/bookings", label: "Sales & CRM", icon: "▤", active: true },
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
              <span className="text-base w-5 text-center shrink-0 text-rose-400 font-bold">🚪</span>
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
          <header className="sticky top-0 z-[100] h-[74px] border-b border-[#202b37] bg-[#03080e]/95 backdrop-blur-md flex items-center gap-4 px-6 shadow-xl overflow-visible">
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
              <span className="text-[#8d9bad] text-sm">⌕</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search leads, opportunities, proposals, deals..."
                className="w-full bg-transparent border-0 outline-none text-xs text-white placeholder:text-[#8291a2]"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              {/* Home Icon Button (Takes user to public Website Homepage) */}
              <Link
                to="/"
                className="h-9 px-3 border border-[#314354] bg-[#121d29] hover:border-[#f4cf69] text-[#f4cf69] hover:text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Go to Public Website Home"
              >
                <Home size={15} /> <span className="hidden sm:inline">Website Home</span>
              </Link>

              <div className="h-9 w-px bg-[#34404d] hidden sm:block" />

              {/* Notifications Dropdown Popover */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="relative h-9 w-9 flex items-center justify-center text-[#e8edf3] text-xl cursor-pointer hover:text-[#e6b83f] outline-none group"
                    title="Notifications Overview"
                  >
                    ♧
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#f0444f] text-white font-extrabold text-[9px] flex items-center justify-center border-2 border-[#050b12] group-hover:scale-110 transition-transform">
                      3
                    </span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-80 bg-[#09141f] border-[#243343] text-white p-3 shadow-2xl rounded-xl space-y-2">
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className="text-xs font-black text-[#f4cf69] uppercase tracking-wider">
                      Executive Notifications
                    </span>
                    <span className="text-[9px] bg-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded-full">
                      3 New
                    </span>
                  </div>

                  <DropdownMenuSeparator className="bg-[#172533]" />

                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                    <div className="p-2.5 bg-[#111a25] border border-[#233240] rounded-lg text-xs space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-[#f4cf69] font-bold">
                        <span>New Lead Dispatched</span>
                        <span className="text-[#8391a0]">2m ago</span>
                      </div>
                      <p className="text-[#c7d0da] text-[11px] leading-snug">
                        ABC Ltd submitted production inquiry for Corporate Gala.
                      </p>
                    </div>
                  </div>

                  <DropdownMenuSeparator className="bg-[#172533]" />

                  <DropdownMenuItem asChild>
                    <Link
                      to="/admin/contacts"
                      className="w-full py-2.5 bg-gradient-to-r from-[#a9741b] via-[#d5a637] to-[#896019] text-black font-black text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 hover:bg-gold transition-all cursor-pointer"
                    >
                      View All Notifications & Messages →
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-9 w-px bg-[#34404d] hidden sm:block" />

              <div className="text-xs text-[#d8dee6] hidden sm:flex items-center gap-2 font-mono">
                <span>▣</span> {new Date().toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
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
                    <Link to="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 text-xs font-semibold hover:bg-[#121d29] rounded-lg cursor-pointer transition-colors text-slate-200 hover:text-white">
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
                    className="h-10 rounded-none bg-[#121d29] border border-[#314354] text-white font-bold text-[10px] uppercase tracking-widest hover:border-[#e6b83f] transition-all cursor-pointer"
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

          {/* SALES & CRM DASHBOARD CONTENT BODY */}
          <section className="p-4 sm:p-6 space-y-4 max-w-[1700px] mx-auto">
            {/* Executive 3D Tile Banner */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#d5a637]/30 via-[#f4cf69]/20 to-[#896019]/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#0d1c28] via-[#09141f] to-[#050e17] border-2 border-[#d4a43b]/40 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.15)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden">
                <div className="space-y-2.5 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e6b83f]/15 border border-[#e6b83f]/40 text-[#f4cf69] text-[9px] font-black uppercase tracking-[0.25em] rounded-md shadow-inner">
                    <span className="text-[#f4cf69] font-serif text-sm">♛</span> Enterprise Sales & CRM Lifecycle Engine
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif tracking-tight text-white flex flex-wrap items-center gap-2 leading-tight drop-shadow-md">
                    Sales & Customer Relationship Management <span className="text-[#f4cf69] font-serif text-2xl lg:text-3xl">♛</span>
                  </h1>

                  <p className="text-xs sm:text-sm text-[#98a7b7] font-medium leading-relaxed font-sans">
                    360° Customer relationship management, lead scoring, pipeline stages, quotation itemizer & won deal contracts.
                  </p>
                </div>

                {/* Quick Actions Bar embedded in Tile */}
                <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0">
                  <button
                    onClick={() => setIsNewLeadModalOpen(true)}
                    className="px-4 py-2.5 rounded-lg bg-[#f4cf69] text-black font-black text-xs uppercase tracking-widest shadow-lg transition-all cursor-pointer hover:bg-white flex items-center gap-2"
                  >
                    <UserPlus size={16} /> + New Lead / Opportunity
                  </button>

                  <button
                    onClick={() => setIsQuotationModalOpen(true)}
                    className="px-4 py-2.5 rounded-lg bg-emerald-500 text-black font-black text-xs uppercase tracking-widest shadow-lg transition-all cursor-pointer hover:bg-black hover:text-emerald-400 flex items-center gap-2"
                  >
                    <Receipt size={16} /> ▤ Generate Quotation
                  </button>
                </div>
              </div>
            </div>

            {/* ENTERPRISE CRM NAVIGATION CONTROL (DROPDOWN + COLLAPSIBLE MENU) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#09141f] border border-[#243343] rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                {/* Dropdown Menu Trigger for CRM Navigation */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="h-11 px-4 bg-gradient-to-r from-[#a9741b] via-[#d5a637] to-[#896019] text-white font-black text-xs uppercase tracking-wider rounded-lg flex items-center gap-2.5 shadow-md hover:bg-gold transition-all cursor-pointer outline-none"
                    >
                      <Menu size={18} /> ☰ CRM Navigation
                      <ChevronDown size={15} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 bg-[#09141f] border-[#243343] text-white p-2 shadow-2xl rounded-xl space-y-1 z-[150]">
                    <DropdownMenuLabel className="px-3 py-2 text-xs font-black text-[#f4cf69] uppercase tracking-wider">
                      Sales & CRM Navigation
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#172533]" />

                    {[
                      { id: "overview", label: "CRM Overview", icon: BarChart3 },
                      { id: "leads", label: "Leads & Scoring", icon: Flame },
                      { id: "pipeline", label: "Sales Pipeline", icon: Kanban },
                      { id: "quotations", label: "Quotations & Proposals", icon: Receipt },
                      { id: "followups", label: "Follow-ups & Timeline", icon: Calendar },
                      { id: "won_deals", label: "Won Deals & Revenue", icon: Award },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = crmSection === tab.id;
                      return (
                        <DropdownMenuItem
                          key={tab.id}
                          onClick={() => {
                            setCrmSection(tab.id as CRMSection);
                            showToast(`Navigated to ${tab.label}`);
                          }}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-lg cursor-pointer transition-colors",
                            isActive ? "bg-[#f4cf69] text-black font-black" : "text-slate-200 hover:bg-[#121d29] hover:text-white"
                          )}
                        >
                          <Icon size={16} className={isActive ? "text-black" : "text-[#f4cf69]"} />
                          <span>{tab.label}</span>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Active Section Indicator */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#121d29] border border-[#314354] rounded-lg text-xs font-bold text-white">
                  <span className="text-[#8d9bad]">Active View:</span>
                  <span className="text-[#f4cf69] uppercase font-mono font-black">
                    {crmSection === "overview" && "📊 CRM Overview"}
                    {crmSection === "leads" && "🔥 Leads & Scoring"}
                    {crmSection === "pipeline" && "📊 Sales Pipeline"}
                    {crmSection === "quotations" && "🧾 Quotations & Proposals"}
                    {crmSection === "followups" && "📅 Follow-ups & Timeline"}
                    {crmSection === "won_deals" && "🎗 Won Deals & Revenue"}
                  </span>
                </div>
              </div>

              {/* Collapsible Responsive CRM Pill Buttons (No Scrollbars) */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "overview", label: "Overview", icon: BarChart3 },
                  { id: "leads", label: "Leads", icon: Flame },
                  { id: "pipeline", label: "Pipeline", icon: Kanban },
                  { id: "quotations", label: "Quotes", icon: Receipt },
                  { id: "followups", label: "Follow-ups", icon: Calendar },
                  { id: "won_deals", label: "Won Deals", icon: Award },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = crmSection === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setCrmSection(tab.id as CRMSection)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer",
                        isActive
                          ? "bg-[#f4cf69] text-black font-black shadow-md"
                          : "bg-[#121d29] text-[#8d9bad] hover:bg-[#1a2838] hover:text-white border border-[#243343]"
                      )}
                    >
                      <Icon size={13} /> {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 1: CRM OVERVIEW */}
            {crmSection === "overview" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* 6 CRM KPI METRICS */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-1">
                    <span className="text-[9px] text-[#8d9baa] uppercase font-bold tracking-wider block">Total Leads</span>
                    <p className="text-2xl font-black text-white font-mono">{bookings.length + 18}</p>
                    <span className="text-[9px] text-[#20e39b] font-medium">↑ Live Pipeline</span>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-1">
                    <span className="text-[9px] text-[#8d9baa] uppercase font-bold tracking-wider block">Qualified Leads</span>
                    <p className="text-2xl font-black text-[#f4cf69] font-mono">{bookings.length}</p>
                    <span className="text-[9px] text-[#20e39b] font-medium">↑ Verified Budget</span>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-1">
                    <span className="text-[9px] text-[#8d9baa] uppercase font-bold tracking-wider block">Pipeline Value</span>
                    <p className="text-2xl font-black text-[#f4cf69] font-mono">{formatKes(totalPipelineAmount)}</p>
                    <span className="text-[9px] text-[#20e39b] font-medium">↑ Expected Value</span>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-1">
                    <span className="text-[9px] text-[#8d9baa] uppercase font-bold tracking-wider block">Conversion Rate</span>
                    <p className="text-2xl font-black text-[#20e39b] font-mono">21.4%</p>
                    <span className="text-[9px] text-[#20e39b] font-medium">↑ Industry Leader</span>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-1">
                    <span className="text-[9px] text-[#8d9baa] uppercase font-bold tracking-wider block">Won Deals</span>
                    <p className="text-2xl font-black text-emerald-400 font-mono">{tickets.length}</p>
                    <span className="text-[9px] text-emerald-400 font-medium">✓ Settled Revenue</span>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-1">
                    <span className="text-[9px] text-[#8d9baa] uppercase font-bold tracking-wider block">Today's Follow-ups</span>
                    <p className="text-2xl font-black text-blue-400 font-mono">4 Reminders</p>
                    <span className="text-[9px] text-blue-400 font-medium">● Schedule Ready</span>
                  </div>
                </div>

                {/* RECENT LEADS & OPPORTUNITIES TABLE */}
                <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-4">
                  <div className="flex justify-between items-center border-b border-[#172533] pb-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Active Inbound Pipeline</p>
                      <h3 className="text-lg font-black uppercase text-white">Recent Customer Opportunities & Proposals</h3>
                    </div>
                    <button onClick={() => setIsNewLeadModalOpen(true)} className="px-3 py-1.5 bg-[#f4cf69] text-black font-black text-xs uppercase rounded-lg">
                      + Add Opportunity
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="text-[#8d9baa] bg-[#0d1823] border-b border-[#172530]">
                          <th className="p-3">Opportunity ID</th>
                          <th className="p-3">Client / Organization</th>
                          <th className="p-3">Event Brief</th>
                          <th className="p-3 text-center">Lead Score</th>
                          <th className="p-3 text-right">Estimated Value</th>
                          <th className="p-3 text-center">Pipeline Stage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#172530] text-[#dbe2e9]">
                        {bookings.map((b) => {
                          const scoring = calculateLeadScore(b.budget);
                          return (
                            <tr key={b.id} className="hover:bg-[#0d1823] transition-colors">
                              <td className="p-3 font-mono font-bold text-[#f4cf69]">OPP-{b.id.slice(0, 6)}</td>
                              <td className="p-3">
                                <p className="font-bold text-white">{b.name}</p>
                                <p className="text-[10px] text-[#8d9baa] font-mono">{b.email}</p>
                              </td>
                              <td className="p-3 text-[#9ca8b6] font-medium">{b.event_type}</td>
                              <td className="p-3 text-center">
                                <span className={cn("px-2 py-0.5 rounded text-[9px] font-black border", scoring.color)}>
                                  {scoring.label} ({scoring.score}%)
                                </span>
                              </td>
                              <td className="p-3 text-right font-mono font-black text-[#f4cf69]">{b.budget}</td>
                              <td className="p-3 text-center">
                                <span className="px-2.5 py-1 rounded bg-blue-500/20 border border-blue-500/40 text-blue-400 text-[9px] font-black uppercase">
                                  {b.status || "Proposal Sent"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: LEADS & SCORING */}
            {crmSection === "leads" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-4">
                  <div className="flex justify-between items-center border-b border-[#172533] pb-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Lead Intelligence</p>
                      <h3 className="text-xl font-black uppercase text-white">Scored Customer Inquiries (Hot / Warm / Cold)</h3>
                    </div>
                    <button onClick={() => setIsNewLeadModalOpen(true)} className="px-3.5 py-2 bg-emerald-500 text-black font-black text-xs uppercase rounded-lg">
                      + Add New Lead
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {bookings.map((b) => {
                      const scoring = calculateLeadScore(b.budget);
                      return (
                        <div key={b.id} className="p-5 bg-[#09141f] border border-[#243343] hover:border-[#f4cf69] rounded-xl space-y-3 shadow-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9px] text-[#8d9baa] font-mono">LEAD #{b.id.slice(0, 6)}</span>
                              <h4 className="text-sm font-bold text-white uppercase">{b.name}</h4>
                              <p className="text-[10px] text-[#8d9baa] font-mono">{b.email}</p>
                            </div>
                            <span className={cn("px-2.5 py-1 rounded text-[9px] font-black border", scoring.color)}>
                              🔥 {scoring.label} ({scoring.score})
                            </span>
                          </div>

                          <div className="text-xs space-y-1 text-[#9ca8b6]">
                            <p><span className="text-white font-bold">Event Type:</span> {b.event_type}</p>
                            <p><span className="text-white font-bold">Budget:</span> <span className="text-[#f4cf69] font-mono font-bold">{b.budget}</span></p>
                            <p><span className="text-white font-bold">Lead Source:</span> Website Inbound</p>
                          </div>

                          <div className="pt-2 border-t border-[#172533] flex justify-between items-center">
                            <button
                              onClick={() => {
                                setSelectedBookingForInvoice(b);
                                setIsInvoiceModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-[#f4cf69] text-black font-black text-[10px] uppercase rounded-lg hover:bg-white"
                            >
                              Send Proposal →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: SALES PIPELINE KANBAN STAGES */}
            {crmSection === "pipeline" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-4">
                  <div className="border-b border-[#172533] pb-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Pipeline Stages</p>
                    <h3 className="text-xl font-black uppercase text-white">Visual Sales Funnel (New → Qualified → Proposal → Negotiation → Won)</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
                    {/* Stage 1: New Leads */}
                    <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl space-y-3 min-w-[240px]">
                      <div className="flex justify-between items-center text-xs border-b border-[#172533] pb-2">
                        <span className="font-bold uppercase text-[#f4cf69]">1. New Leads ({bookings.length})</span>
                        <span className="text-[9px] font-mono text-[#8d9baa]">{formatKes(totalPipelineAmount)}</span>
                      </div>
                      {bookings.slice(0, 2).map((b) => (
                        <div key={b.id} className="p-3 bg-[#111a25] border border-[#233240] rounded-lg text-xs space-y-1">
                          <p className="font-bold text-white">{b.name}</p>
                          <p className="text-[10px] text-[#9ca8b6]">{b.event_type}</p>
                          <p className="text-[10px] font-mono font-bold text-[#f4cf69]">{b.budget}</p>
                        </div>
                      ))}
                    </div>

                    {/* Stage 2: Proposal Sent */}
                    <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl space-y-3 min-w-[240px]">
                      <div className="flex justify-between items-center text-xs border-b border-[#172533] pb-2">
                        <span className="font-bold uppercase text-blue-400">2. Proposal Sent ({bookings.length})</span>
                        <span className="text-[9px] font-mono text-[#8d9baa]">{formatKes(totalPipelineAmount * 0.8)}</span>
                      </div>
                      {bookings.map((b) => (
                        <div key={b.id} className="p-3 bg-[#111a25] border border-[#233240] rounded-lg text-xs space-y-1">
                          <p className="font-bold text-white">{b.name}</p>
                          <p className="text-[10px] text-[#9ca8b6]">{b.event_type}</p>
                          <p className="text-[10px] font-mono font-bold text-blue-400">{b.budget}</p>
                        </div>
                      ))}
                    </div>

                    {/* Stage 3: Negotiation */}
                    <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl space-y-3 min-w-[240px]">
                      <div className="flex justify-between items-center text-xs border-b border-[#172533] pb-2">
                        <span className="font-bold uppercase text-amber-400">3. Negotiation (2)</span>
                        <span className="text-[9px] font-mono text-[#8d9baa]">KSh 3,200,000</span>
                      </div>
                      <div className="p-3 bg-[#111a25] border border-[#233240] rounded-lg text-xs space-y-1">
                        <p className="font-bold text-white">Kisii University Senate</p>
                        <p className="text-[10px] text-[#9ca8b6]">Annual Tech Summit</p>
                        <p className="text-[10px] font-mono font-bold text-amber-400">KSh 2,500,000</p>
                      </div>
                    </div>

                    {/* Stage 4: Won Sales */}
                    <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl space-y-3 min-w-[240px]">
                      <div className="flex justify-between items-center text-xs border-b border-[#172533] pb-2">
                        <span className="font-bold uppercase text-emerald-400">4. Won Sales ({tickets.length})</span>
                        <span className="text-[9px] font-mono text-[#8d9baa]">{formatKes(tickets.reduce((a, t) => a + t.price, 0))}</span>
                      </div>
                      {tickets.slice(0, 2).map((t) => (
                        <div key={t.id} className="p-3 bg-[#111a25] border border-emerald-500/30 rounded-lg text-xs space-y-1">
                          <p className="font-bold text-white">{t.holder_name}</p>
                          <p className="text-[10px] text-[#9ca8b6]">{t.event_name}</p>
                          <p className="text-[10px] font-mono font-bold text-emerald-400">{formatKes(t.price)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: QUOTATIONS & PROPOSALS */}
            {crmSection === "quotations" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-4">
                  <div className="flex justify-between items-center border-b border-[#172533] pb-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Quotation & Proposal Itemizer</p>
                      <h3 className="text-xl font-black uppercase text-white">Generate Official PDF Proposal & Itemized Quote</h3>
                    </div>
                    <button onClick={() => setIsQuotationModalOpen(true)} className="px-4 py-2 bg-emerald-500 text-black font-black text-xs uppercase rounded-lg">
                      + Create New Quotation
                    </button>
                  </div>

                  <div className="p-6 bg-[#09141f] border border-[#243343] rounded-xl space-y-4">
                    <h4 className="text-sm font-bold text-[#f4cf69] uppercase">Itemized Quotation Template Preview (#QT-2026-9021)</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-[#8d9baa]">Client / Organization:</p>
                        <p className="font-bold text-white">ABC Limited (Nairobi HQ)</p>
                      </div>
                      <div>
                        <p className="text-[#8d9baa]">Event Production:</p>
                        <p className="font-bold text-white">Annual Executive Corporate Gala</p>
                      </div>
                    </div>

                    <div className="border border-[#243343] rounded-lg overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-[#0d1823] text-[#8d9baa]">
                          <tr>
                            <th className="p-2.5">Service Line</th>
                            <th className="p-2.5 text-right">Amount (KES)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#172530] text-white font-mono">
                          <tr><td className="p-2.5">Venue Booking & Auditorium Setup</td><td className="p-2.5 text-right">KSh 500,000</td></tr>
                          <tr><td className="p-2.5">Luxury Stage Decor & Lighting</td><td className="p-2.5 text-right">KSh 250,000</td></tr>
                          <tr><td className="p-2.5">Executive Catering (200 Delegates)</td><td className="p-2.5 text-right">KSh 600,000</td></tr>
                          <tr><td className="p-2.5">Audio/Visual & Entertainment</td><td className="p-2.5 text-right">KSh 150,000</td></tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end text-xs font-mono space-y-1 text-right pt-2 border-t border-[#172533]">
                      <div className="space-y-1">
                        <p className="text-[#8d9baa]">Subtotal: <span className="text-white font-bold">KSh 1,500,000</span></p>
                        <p className="text-[#8d9baa]">VAT (16%): <span className="text-white font-bold">KSh 240,000</span></p>
                        <p className="text-[#f4cf69] font-black text-sm">TOTAL AMOUNT: KSh 1,740,000</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 5: FOLLOW-UPS & TIMELINE */}
            {crmSection === "followups" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-4">
                  <div className="border-b border-[#172533] pb-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">360° Activity Timeline</p>
                    <h3 className="text-xl font-black uppercase text-white">Client Communications, Calls & Site Visits</h3>
                  </div>

                  <div className="space-y-3 font-sans text-xs">
                    {[
                      { time: "Today 10:00 AM", title: "Site Visit Confirmed", desc: "Completed site inspection at Kisii University Main Auditorium.", type: "Site Visit", icon: MapPin, color: "text-[#f4cf69]" },
                      { time: "Yesterday 03:30 PM", title: "Official Proposal Emailed", desc: "Sent revised PDF proposal #QT-2026-9021 to ABC Ltd.", type: "Email Sent", icon: Mail, color: "text-blue-400" },
                      { time: "08 Sep 11:15 AM", title: "WhatsApp Inquiry Logged", desc: "Client confirmed 200 attendee headcount for VIP passes.", type: "WhatsApp", icon: MessageSquare, color: "text-emerald-400" },
                    ].map((act, idx) => {
                      const Icon = act.icon;
                      return (
                        <div key={idx} className="p-4 bg-[#09141f] border border-[#243343] rounded-xl flex items-start gap-4">
                          <div className={cn("h-10 w-10 rounded-lg bg-[#111a25] flex items-center justify-center font-bold shrink-0", act.color)}>
                            <Icon size={20} />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-white text-sm">{act.title}</span>
                              <span className="text-[9px] bg-[#121d29] border border-[#314354] px-2 py-0.5 rounded text-[#8d9bad] font-mono">{act.time}</span>
                            </div>
                            <p className="text-[#c7d0da] leading-snug">{act.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 6: WON DEALS */}
            {crmSection === "won_deals" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-4">
                  <div className="border-b border-[#172533] pb-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Settled Revenue</p>
                    <h3 className="text-xl font-black uppercase text-white">Won Deals & M-Pesa Gate Pass Contracts</h3>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {tickets.map((t) => (
                      <div key={t.id} className="p-5 bg-[#09141f] border border-emerald-500/40 rounded-xl space-y-2 shadow-md">
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase rounded">
                          WON DEAL #DL-{t.id.slice(0, 6)}
                        </span>
                        <h4 className="text-sm font-bold text-white uppercase">{t.holder_name}</h4>
                        <p className="text-[10px] text-[#8d9baa] font-mono">{t.event_name}</p>
                        <p className="text-base font-black text-emerald-400 font-mono pt-1">{formatKes(t.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* COMPACT SMALL ADMIN FOOTER WITH MY WORLD AFRICA LINK */}
            <footer className="mt-8 pt-4 pb-2 border-t border-[#172533] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs text-[#8d9bad] font-mono">
              <div className="flex flex-wrap items-center gap-2">
                <span>© {new Date().getFullYear()} Royal Touch Events Nairobi.</span>
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

      {/* NEW LEAD / OPPORTUNITY MODAL */}
      {isNewLeadModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-[#09141f] border border-[#f4cf69]/40 rounded-xl p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#172533] pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#f4cf69] text-black flex items-center justify-center font-black rounded-lg">
                  <UserPlus size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Lead Intake</p>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">Create New Opportunity</h3>
                </div>
              </div>
              <button onClick={() => setIsNewLeadModalOpen(false)} className="h-10 w-10 bg-[#121d29] border border-[#314354] flex items-center justify-center text-[#8d9bad] hover:text-white cursor-pointer rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs font-sans">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Contact Name *</label>
                <input type="text" required placeholder="Ex: John Kamau" value={leadName} onChange={(e) => setLeadName(e.target.value)} className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]" />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Company / Organization *</label>
                <input type="text" required placeholder="Ex: ABC Limited" value={leadCompany} onChange={(e) => setLeadEmail(e.target.value)} className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Interested Service</label>
                  <input type="text" value={leadService} onChange={(e) => setLeadService(e.target.value)} className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]" />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Estimated Budget</label>
                  <input type="text" value={leadBudget} onChange={(e) => setLeadBudget(e.target.value)} className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]" />
                </div>
              </div>

              <button type="submit" className="w-full h-14 bg-[#f4cf69] text-black font-black text-xs uppercase tracking-[0.2em] rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl cursor-pointer pt-1">
                Save Opportunity & Score Lead
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE QUOTATION MODAL */}
      {isQuotationModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-[#09141f] border border-[#f4cf69]/40 rounded-xl p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#172533] pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-500 text-black flex items-center justify-center font-black rounded-lg">
                  <Receipt size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Quotation Builder</p>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">Generate Itemized Quotation</h3>
                </div>
              </div>
              <button onClick={() => setIsQuotationModalOpen(false)} className="h-10 w-10 bg-[#121d29] border border-[#314354] flex items-center justify-center text-[#8d9bad] hover:text-white cursor-pointer rounded-lg">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendQuotation} className="space-y-4 text-xs font-sans">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Client Name</label>
                  <input type="text" value={quoteClient} onChange={(e) => setQuoteClient(e.target.value)} className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Event Title</label>
                  <input type="text" value={quoteEvent} onChange={(e) => setQuoteEvent(e.target.value)} className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Venue Cost (KES)</label>
                  <input type="number" value={venueCost} onChange={(e) => setVenueCost(Number(e.target.value))} className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Stage Decor (KES)</label>
                  <input type="number" value={decorCost} onChange={(e) => setDecorCost(Number(e.target.value))} className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]" />
                </div>
              </div>

              <div className="p-4 bg-[#111a25] border border-[#233240] rounded-lg space-y-1 text-right font-mono">
                <p className="text-white font-bold text-sm">Total Quote Amount: {formatKes(quoteTotal)}</p>
                <p className="text-[10px] text-[#8d9baa]">(Includes 16% VAT)</p>
              </div>

              <button type="submit" className="w-full h-14 bg-emerald-500 text-black font-black text-xs uppercase tracking-[0.2em] rounded-lg flex items-center justify-center gap-2 hover:bg-black hover:text-emerald-400 transition-all shadow-xl cursor-pointer pt-1">
                Dispatch Official Quotation PDF
              </button>
            </form>
          </div>
        </div>
      )}

      {/* INVOICE MODAL */}
      <InvoiceModal booking={selectedBookingForInvoice} isOpen={isInvoiceModalOpen} onClose={() => { setIsInvoiceModalOpen(false); setSelectedBookingForInvoice(null); }} />
      {/* GATE SCANNER MODAL */}
      <TicketScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
      {/* TICKET PASS MODAL */}
      <TicketPassModal ticket={selectedTicket} isOpen={isPassModalOpen} onClose={() => { setIsPassModalOpen(false); setSelectedTicket(null); }} />
    </div>
  );
}
