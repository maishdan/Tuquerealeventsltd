import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAdminTickets, useAdminBookings, formatKes } from "@/hooks/use-dashboard-data";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  Search,
  ChevronDown,
  Power,
  Settings,
  Mail,
  HelpCircle,
  LogOut,
  User,
  Download,
  FileCheck2,
  Calendar,
  Filter,
  FileText,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  PieChart as PieChartIcon,
  Flame,
  Target,
  DollarSign,
  Briefcase,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Home
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

import { createPageSeo } from "@/lib/seo";

export const Route = createFileRoute("/admin/reports")({
  head: () =>
    createPageSeo({
      title: "Business Intelligence & Financial Reports",
      description: "Official Executive Reports & Analytics Ledger for Royal Touch Events.",
      path: "/admin/reports",
      noindex: true,
    }),
  component: AdminReports,
});

type ReportTab = "overview" | "sales" | "events" | "finance" | "marketing" | "builder";

export function AdminReports() {
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
  const { data: tickets = [] } = useAdminTickets();
  const { data: bookings = [] } = useAdminBookings();

  const [activeTab, setActiveTab] = useState<ReportTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);

  // Custom Report Builder State
  const [builderReportType, setBuilderReportType] = useState("Financial Settlement Ledger");
  const [builderRange, setBuilderRange] = useState("This Month (September 2026)");
  const [builderFormat, setBuilderFormat] = useState("PDF Document");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const userInitials = profile?.full_name ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase() : "JO";
  const totalSettled = tickets.reduce((acc, t) => acc + (t.price || 0), 0);

  const handleExportCustomReport = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`✓ Generated & downloaded ${builderReportType} (${builderRange}) as ${builderFormat}!`);
  };

  // Illustrative Royal Touch Financial Performance Data
  const financialData = [
    { month: "Apr", revenue: 1200000, expenses: 720000, profit: 480000 },
    { month: "May", revenue: 1350000, expenses: 790000, profit: 560000 },
    { month: "Jun", revenue: 1500000, expenses: 850000, profit: 650000 },
    { month: "Jul", revenue: 1750000, expenses: 920000, profit: 830000 },
    { month: "Aug", revenue: 2000000, expenses: 1080000, profit: 920000 },
    { month: "Sep", revenue: 2200000, expenses: 1200000, profit: 1000000 },
  ];

  const maxFinancialRev = Math.max(...financialData.map((d) => d.revenue));

  // Events Lifecycle Distribution
  const eventStages = [
    { status: "Draft", count: 4, color: "text-zinc-400 bg-zinc-800" },
    { status: "Inquiry", count: 7, color: "text-blue-400 bg-blue-500/20" },
    { status: "Planning", count: 10, color: "text-purple-400 bg-purple-500/20" },
    { status: "Confirmed", count: 15, color: "text-[#f4cf69] bg-[#f4cf69]/20" },
    { status: "In Preparation", count: 8, color: "text-amber-400 bg-amber-500/20" },
    { status: "Completed", count: 31, color: "text-emerald-400 bg-emerald-500/20" },
    { status: "Cancelled", count: 3, color: "text-rose-400 bg-rose-500/20" },
  ];

  // Lead Sources Volume
  const leadSources = [
    { source: "LinkedIn", leads: 28, share: "28%" },
    { source: "WhatsApp", leads: 24, share: "24%" },
    { source: "Instagram", leads: 18, share: "18%" },
    { source: "Facebook", leads: 15, share: "15%" },
    { source: "Website", leads: 12, share: "12%" },
    { source: "TikTok", leads: 9, share: "9%" },
    { source: "Referral", leads: 7, share: "7%" },
  ];

  // Salesperson Target Performance
  const salesPerformance = [
    { name: "Jane Wambui", deals: 18, revenue: 3200000, target: 3000000, percent: 107 },
    { name: "David Mwangi", deals: 14, revenue: 2600000, target: 3000000, percent: 87 },
    { name: "Mary Otieno", deals: 11, revenue: 2100000, target: 2500000, percent: 84 },
  ];

  // Accounts Receivable Aged Ledger
  const receivables = [
    { category: "Current", amount: 450000, status: "On Schedule" },
    { category: "1–30 Days Overdue", amount: 320000, status: "Follow-up Sent" },
    { category: "31–60 Days Overdue", amount: 180000, status: "Notice Dispatched" },
    { category: "61–90 Days Overdue", amount: 150000, status: "Finance Escalation" },
    { category: "90+ Days Overdue", amount: 300000, status: "Legal Review" },
  ];

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
              { to: "/admin/reports", label: "Reports", icon: "▣", active: true },
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
              <span className="text-[#8d9bad] text-sm">⌕</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search executive reports, financial ledgers..."
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

              <button
                type="button"
                onClick={() => showToast("3 Active Notifications")}
                className="relative h-9 w-9 flex items-center justify-center text-[#e8edf3] text-xl cursor-pointer hover:text-[#e6b83f]"
              >
                ♧
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#f0444f] text-white font-extrabold text-[9px] flex items-center justify-center border-2 border-[#050b12]">
                  3
                </span>
              </button>

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
                <DropdownMenuContent align="end" className="w-56 bg-[#09141f] border-[#243343] text-white p-2 shadow-2xl rounded-xl space-y-1 z-[99999]">
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

          {/* REPORTS DASHBOARD CONTENT BODY */}
          <section className="p-4 sm:p-6 space-y-4 max-w-[1700px] mx-auto">
            {/* Executive 3D Tile Banner */}
            <div className="relative group z-0">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#d5a637]/30 via-[#f4cf69]/20 to-[#896019]/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#0d1c28] via-[#09141f] to-[#050e17] border-2 border-[#d4a43b]/40 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.15)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden">
                <div className="space-y-2.5 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e6b83f]/15 border border-[#e6b83f]/40 text-[#f4cf69] text-[9px] font-black uppercase tracking-[0.25em] rounded-md shadow-inner">
                    <span className="text-[#f4cf69] font-serif text-sm">♛</span> Executive Reports & Analytics Engine
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif tracking-tight text-white flex flex-wrap items-center gap-2 leading-tight drop-shadow-md">
                    Reports, Analytics & Business Intelligence <span className="text-[#f4cf69] font-serif text-2xl lg:text-3xl">♛</span>
                  </h1>

                  <p className="text-xs sm:text-sm text-[#98a7b7] font-medium leading-relaxed font-sans">
                    Multi-series financial graphs, profit margins, event lifecycle reports, sales target achievements, and custom PDF exporter.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0">
                  <button
                    onClick={() => {
                      setActiveTab("builder");
                      showToast("Opened Custom Report Builder");
                    }}
                    className="px-4 py-2.5 rounded-lg bg-emerald-500 text-black font-black text-xs uppercase tracking-widest shadow-lg hover:bg-white transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Download size={16} /> Export Reports (Excel / PDF)
                  </button>
                </div>
              </div>
            </div>

            {/* REPORT MODULE SUB-NAVIGATION PILLS */}
            <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-[#09141f] border border-[#243343] rounded-xl scrollbar-thin">
              {[
                { id: "overview", label: "Executive Overview", icon: BarChart3 },
                { id: "sales", label: "Sales & Targets", icon: Target },
                { id: "events", label: "Event Analytics", icon: Layers },
                { id: "finance", label: "Finance & VAT", icon: DollarSign },
                { id: "marketing", label: "Marketing ROI", icon: Flame },
                { id: "builder", label: "Report Builder & Export", icon: Download },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ReportTab)}
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

            {/* TAB 1: EXECUTIVE OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* 6 EXECUTIVE KPI CARDS */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-1">
                    <span className="text-[9px] text-[#8d9baa] uppercase font-bold tracking-wider block">Total Revenue</span>
                    <p className="text-2xl font-black text-[#f4cf69] font-mono">KSh 4.8M</p>
                    <span className="text-[9px] text-[#20e39b] font-medium flex items-center gap-0.5">
                      <ArrowUpRight size={10} /> 18% vs Last Month
                    </span>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-1">
                    <span className="text-[9px] text-[#8d9baa] uppercase font-bold tracking-wider block">Total Expenses</span>
                    <p className="text-2xl font-black text-rose-400 font-mono">KSh 920K</p>
                    <span className="text-[9px] text-[#20e39b] font-medium flex items-center gap-0.5">
                      <ArrowDownRight size={10} /> 5% Savings
                    </span>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-1">
                    <span className="text-[9px] text-[#8d9baa] uppercase font-bold tracking-wider block">Net Profit</span>
                    <p className="text-2xl font-black text-emerald-400 font-mono">KSh 3.88M</p>
                    <span className="text-[9px] text-emerald-400 font-medium">80.8% Net Margin</span>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-1">
                    <span className="text-[9px] text-[#8d9baa] uppercase font-bold tracking-wider block">Total Events</span>
                    <p className="text-2xl font-black text-white font-mono">42 Events</p>
                    <span className="text-[9px] text-[#20e39b] font-medium">31 Completed</span>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-1">
                    <span className="text-[9px] text-[#8d9baa] uppercase font-bold tracking-wider block">Conversion Rate</span>
                    <p className="text-2xl font-black text-[#20e39b] font-mono">16.7%</p>
                    <span className="text-[9px] text-[#20e39b] font-medium">↑ Industry Leader</span>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-1">
                    <span className="text-[9px] text-[#8d9baa] uppercase font-bold tracking-wider block">Outstanding AR</span>
                    <p className="text-2xl font-black text-amber-400 font-mono">KSh 1.4M</p>
                    <span className="text-[9px] text-amber-400 font-medium">● 5 Accounts Aged</span>
                  </div>
                </div>

                {/* EXACT REVENUE OVERVIEW CHART CARD MATCHING USER SCREENSHOT */}
                <div className="p-6 bg-[#08121e] border border-[#1f2d3d] rounded-2xl shadow-2xl space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center gap-0.5 text-[#f4cf69]">
                        <span className="h-4 w-1 bg-[#f4cf69] rounded-xs" />
                        <span className="h-4 w-1 bg-[#f4cf69] rounded-xs" />
                        <span className="h-4 w-1 bg-[#f4cf69] rounded-xs" />
                        <span className="h-4 w-1 bg-[#f4cf69] rounded-xs" />
                      </div>
                      <h3 className="text-lg font-black tracking-tight text-white font-sans">
                        Revenue Overview
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => showToast("Filter Range: Last 6 Months")}
                      className="text-xs font-bold text-[#f4cf69] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      Last 6 Months <ChevronDown size={14} />
                    </button>
                  </div>

                  <div className="grid lg:grid-cols-12 gap-8 items-center">
                    {/* Left Column: Dual-Bar Graph Chart */}
                    <div className="lg:col-span-8 space-y-4">
                      <div className="h-56 relative border-b border-l border-[#1f2d3d] flex items-end justify-between px-3 sm:px-6 gap-2 pt-6">
                        {[
                          { month: "Apr", rev: 55, tgt: 68 },
                          { month: "May", rev: 62, tgt: 74 },
                          { month: "Jun", rev: 70, tgt: 82 },
                          { month: "Jul", rev: 78, tgt: 89 },
                          { month: "Aug", rev: 84, tgt: 95 },
                          { month: "Sep", rev: 42, tgt: 100 },
                        ].map((m) => (
                          <div key={m.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                            <div className="w-full flex items-end justify-center gap-1 h-full">
                              {/* Revenue Gold Bar */}
                              <div
                                style={{ height: `${m.rev}%` }}
                                className="w-1/2 bg-gradient-to-t from-[#a9741b] via-[#d5a637] to-[#f4cf69] rounded-t-sm transition-all group-hover:brightness-125"
                                title={`Revenue: ${m.rev}%`}
                              />
                              {/* Target Slate/Grey Bar */}
                              <div
                                style={{ height: `${m.tgt}%` }}
                                className="w-1/2 bg-[#516173] rounded-t-sm transition-all group-hover:bg-[#6c7d91]"
                                title={`Target: ${m.tgt}%`}
                              />
                            </div>
                            <span className="text-[11px] font-mono font-bold text-[#8d9baa] group-hover:text-white">
                              {m.month}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Legend */}
                      <div className="flex items-center gap-6 text-xs font-bold text-[#8d9baa] pt-2 px-2">
                        <span className="flex items-center gap-2 text-white">
                          <span className="h-3 w-3 rounded-full bg-[#f4cf69]" /> Revenue
                        </span>
                        <span className="flex items-center gap-2 text-white">
                          <span className="h-3 w-3 rounded-full bg-[#516173]" /> Target
                        </span>
                        <span className="flex items-center gap-2 text-white">
                          <span className="h-3 w-3 rounded-full bg-[#20e39b]" /> Profit
                        </span>
                      </div>
                    </div>

                    {/* Right Column: Monthly Revenue, Ring Gauge & Annual Target */}
                    <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#1f2d3d] pt-6 lg:pt-0 lg:pl-8 space-y-6 text-center">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-[#8d9bad]">Monthly Revenue</p>
                        <p className="text-3xl font-black text-white font-mono tracking-tight">
                          {totalSettled > 0 ? formatKes(totalSettled) : "KSh 40,500"}
                        </p>
                      </div>

                      {/* Circular Gauge Ring */}
                      <div className="relative h-32 w-32 mx-auto flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-[#1a2736]"
                            strokeWidth="3.8"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-[#20e39b]"
                            strokeDasharray="42, 100"
                            strokeWidth="3.8"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-sm font-black text-white font-mono">42%</span>
                          <span className="text-[9px] text-[#8d9bad] font-bold">of target</span>
                        </div>
                      </div>

                      <div className="space-y-1 pt-2">
                        <p className="text-xs font-bold text-[#8d9bad]">Annual Target</p>
                        <p className="text-xl font-black text-[#f4cf69] font-mono">
                          KSh 24,000,000
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SALES & TARGETS */}
            {activeTab === "sales" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-4">
                  <div className="border-b border-[#172533] pb-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Salesperson Intelligence</p>
                    <h3 className="text-xl font-black uppercase text-white">Sales Team Targets & Performance Achievement</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="text-[#8d9baa] bg-[#0d1823] border-b border-[#172530]">
                          <th className="p-3">Salesperson</th>
                          <th className="p-3 text-center">Deals Won</th>
                          <th className="p-3 text-right">Settled Revenue</th>
                          <th className="p-3 text-right">Monthly Target</th>
                          <th className="p-3 text-right">Target Achievement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#172530] text-[#dbe2e9]">
                        {salesPerformance.map((s, idx) => (
                          <tr key={idx} className="hover:bg-[#0d1823] transition-colors">
                            <td className="p-3 font-bold text-white uppercase">{s.name}</td>
                            <td className="p-3 text-center font-mono font-bold text-[#f4cf69]">{s.deals} Deals</td>
                            <td className="p-3 text-right font-mono font-black text-emerald-400">{formatKes(s.revenue)}</td>
                            <td className="p-3 text-right font-mono text-[#8d9baa]">{formatKes(s.target)}</td>
                            <td className="p-3 text-right font-mono font-black">
                              <span className={cn("px-2.5 py-1 rounded text-[10px]", s.percent >= 100 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400")}>
                                {s.percent}% Achieved
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: EVENT ANALYTICS */}
            {activeTab === "events" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-4">
                  <div className="border-b border-[#172533] pb-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Production Breakdown</p>
                    <h3 className="text-xl font-black uppercase text-white">Event Lifecycle Stage Distribution</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                    {eventStages.map((st, idx) => (
                      <div key={idx} className="p-4 bg-[#09141f] border border-[#243343] rounded-xl space-y-1 text-center">
                        <span className="text-[9px] text-[#8d9baa] uppercase font-bold block">{st.status}</span>
                        <p className="text-2xl font-black text-white font-mono">{st.count}</p>
                        <span className={cn("px-2 py-0.5 rounded text-[8px] font-bold block uppercase", st.color)}>
                          {st.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: FINANCE & VAT */}
            {activeTab === "finance" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-4">
                  <div className="border-b border-[#172533] pb-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">Receivables Ledger</p>
                    <h3 className="text-xl font-black uppercase text-white">Accounts Receivable Aged Analysis</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="text-[#8d9baa] bg-[#0d1823] border-b border-[#172530]">
                          <th className="p-3">Aging Category</th>
                          <th className="p-3 text-right">Outstanding Value (KES)</th>
                          <th className="p-3 text-center">Recommended Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#172530] text-[#dbe2e9]">
                        {receivables.map((r, idx) => (
                          <tr key={idx} className="hover:bg-[#0d1823] transition-colors">
                            <td className="p-3 font-bold text-white">{r.category}</td>
                            <td className="p-3 text-right font-mono font-black text-amber-400">{formatKes(r.amount)}</td>
                            <td className="p-3 text-center">
                              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-[9px] font-bold uppercase rounded">
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: MARKETING ROI */}
            {activeTab === "marketing" && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-4">
                  <div className="border-b border-[#172533] pb-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Acquisition Channels</p>
                    <h3 className="text-xl font-black uppercase text-white">Lead Volume by Source</h3>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {leadSources.map((ls, idx) => (
                      <div key={idx} className="p-4 bg-[#09141f] border border-[#243343] rounded-xl space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-white uppercase">{ls.source}</span>
                          <span className="font-mono text-[#f4cf69] font-bold">{ls.share}</span>
                        </div>
                        <p className="text-xl font-black text-white font-mono">{ls.leads} Leads</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: CUSTOM REPORT BUILDER & EXPORT */}
            {activeTab === "builder" && (
              <form onSubmit={handleExportCustomReport} className="p-6 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-xl space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-[#172533] pb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Custom Export Engine</p>
                  <h3 className="text-xl font-black uppercase text-white flex items-center gap-2">
                    <FileText size={20} className="text-[#f4cf69]" /> Custom Report Builder & Exporter
                  </h3>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 text-xs font-sans">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Select Report Type *</label>
                    <select
                      value={builderReportType}
                      onChange={(e) => setBuilderReportType(e.target.value)}
                      className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69] cursor-pointer"
                    >
                      <option value="Financial Settlement Ledger">Financial Settlement Ledger</option>
                      <option value="Ticket Sales & Gate Passes Summary">Ticket Sales & Gate Passes Summary</option>
                      <option value="Client CRM & Lead Activity Log">Client CRM & Lead Activity Log</option>
                      <option value="Executive KRA Tax & VAT Ledger">Executive KRA Tax & VAT Ledger</option>
                      <option value="Accounts Receivable Aged Analysis">Accounts Receivable Aged Analysis</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Time Period Range *</label>
                    <select
                      value={builderRange}
                      onChange={(e) => setBuilderRange(e.target.value)}
                      className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69] cursor-pointer"
                    >
                      <option value="This Month (September 2026)">This Month (September 2026)</option>
                      <option value="Quarter-to-Date (Q3 2026)">Quarter-to-Date (Q3 2026)</option>
                      <option value="Annual Summary 2026">Annual Summary 2026</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Export File Format *</label>
                    <select
                      value={builderFormat}
                      onChange={(e) => setBuilderFormat(e.target.value)}
                      className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69] cursor-pointer"
                    >
                      <option value="PDF Document">PDF Document (.pdf)</option>
                      <option value="Excel Spreadsheet">Excel Spreadsheet (.xlsx)</option>
                      <option value="CSV Data Export">CSV Data Export (.csv)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-14 bg-emerald-500 text-black font-black text-xs uppercase tracking-[0.2em] rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl cursor-pointer pt-1"
                >
                  <Download size={18} /> Compile & Download Report
                </button>
              </form>
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
                to="/admin/help"
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
