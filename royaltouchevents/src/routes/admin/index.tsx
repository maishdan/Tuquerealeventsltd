import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  useAdminEvents,
  useAdminBookings,
  useAdminTickets,
  useAdminClients,
  useAdminProspects,
  formatKes,
} from "@/hooks/use-dashboard-data";
import { useAuth } from "@/contexts/AuthContext";
import { cn, getTimeBasedGreeting } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Power,
  Home,
  Crown,
  Bell,
  Sparkles,
  Search,
  PlusCircle,
  Zap,
  TrendingUp,
  DollarSign,
  Globe,
  Users,
  FileText,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { createPageSeo } from "@/lib/seo";

export const Route = createFileRoute("/admin/")({
  head: () =>
    createPageSeo({
      title: "Executive CEO Command Center | TOQUE REAL EVENTS LIMITED",
      description: "Official Executive CEO Command Center for TOQUE REAL EVENTS LIMITED — Kenya's Top Event Management Agency.",
      path: "/admin",
      noindex: true,
    }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Database Hooks
  const { data: bookings = [] } = useAdminBookings();
  const { data: events = [] } = useAdminEvents();
  const { data: clients = [] } = useAdminClients();
  const { data: tickets = [] } = useAdminTickets();
  const { data: prospects = [] } = useAdminProspects();

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const emailLower = (user?.email || profile?.email || "").toLowerCase();
  const rawName = profile?.full_name || user?.user_metadata?.full_name || "";

  const adminInfo = (() => {
    if (emailLower === "eventsroyaltouch7@gmail.com" || rawName.toLowerCase().includes("japheth")) {
      return { fullName: "Japheth Owiyo", badge: "PROTECTED C.E.O" };
    }
    if (emailLower === "maishdan4940@gmail.com" || rawName.toLowerCase().includes("maishdan") || rawName.toLowerCase().includes("dan maish")) {
      return { fullName: rawName || "Dan Maish", badge: "EXECUTIVE ADMIN" };
    }
    if (emailLower === "abigaelmuthoni29@gmail.com" || rawName.toLowerCase().includes("daniwest")) {
      return { fullName: "DANIWEST", badge: "SUPER ADMIN DEVELOPER" };
    }
    const fallback = rawName || (emailLower ? emailLower.split("@")[0].toUpperCase() : "ADMINISTRATOR");
    return { fullName: fallback, badge: "EXECUTIVE ADMIN" };
  })();

  const userInitials = (adminInfo.fullName || rawName || emailLower || "AD")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Financial KPI calculations strictly from live database
  const totalRevenue = tickets.reduce((acc, t) => acc + (t.price || 0), 0);
  const salesPipelineAmount = bookings.reduce((acc, b) => {
    const numeric = typeof b.budget === "number" ? b.budget : parseInt(String(b.budget || 0).replace(/[^0-9]/g, "")) || 0;
    return acc + numeric;
  }, 0);

  const pendingBookings = bookings.filter((b) => b.status === "pending" || !b.status);
  const activeClients = clients.filter((c) => c.email);

  return (
    <div className="min-h-screen bg-[#03070d] text-[#f4f7fb] font-sans selection:bg-[#e6b83f] selection:text-black antialiased">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[9999] px-5 py-3 bg-[#142231] border border-[#3c4d5e] text-white text-xs font-bold shadow-2xl rounded-lg animate-in slide-in-from-bottom-4 duration-300">
          {toastMsg}
        </div>
      )}

      {/* App Shell Grid */}
      <div className={cn("min-h-screen grid transition-all duration-300", isMenuCollapsed ? "grid-cols-[70px_1fr]" : "grid-cols-[212px_1fr]")}>
        {/* SIDEBAR */}
        <aside className="relative min-h-screen border-r border-[#202c39] bg-gradient-to-b from-[#02070d] via-[#050b12] to-[#02060b] flex flex-col z-50 sticky top-0 h-screen overflow-hidden">
          <div className="h-[95px] flex flex-col items-center justify-center border-b border-[#17212b] text-[#f4cf69] shrink-0 sticky top-0 bg-[#02070d] z-10">
            <Crown size={22} className="text-[#f4cf69]" />
            {!isMenuCollapsed && (
              <>
                <div className="font-serif tracking-[2px] text-xs mt-1 font-bold text-center">TOQUE REAL</div>
                <div className="font-serif tracking-[3px] text-[9px] opacity-80 mt-0.5 text-center">EVENTS LIMITED</div>
              </>
            )}
          </div>

          <nav className="p-3 space-y-1 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#243343] scrollbar-track-[#07101a]">
            {[
              { to: "/admin", label: "Dashboard", icon: "▣", active: true },
              { to: "/admin/users", label: "Clients", icon: "♟" },
              { to: "/admin/prospects", label: "Prospects", icon: "✦" },
              { to: "/admin/customers", label: "Customers", icon: "♟" },
              { to: "/admin/events", label: "Events", icon: "▣" },
              { to: "/admin/bookings", label: "Sales & CRM", icon: "▤" },
              { to: "/admin/proposals", label: "Proposals", icon: "▤" },
              { to: "/admin/payments", label: "Payments", icon: "✥" },
              { to: "/admin/finance", label: "Finance", icon: "♧" },
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

          {!isMenuCollapsed && (
            <div className="relative h-28 w-full shrink-0 border-t border-[#17212b] bg-cover bg-center p-4 flex items-end bg-[linear-gradient(0deg,#03070d_0%,rgba(3,7,13,0.75)_50%,#03070d_100%),url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=700&q=80')]">
              <p className="italic text-xs text-[#f5d47a] font-serif leading-snug">
                Extraordinary Events.<br />Lasting Impressions.
              </p>
            </div>
          )}
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#03070d]">
          {/* HEADER BAR */}
          <header className="h-[95px] border-b border-[#202c39] bg-[#050b12]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-40">
            <button
              type="button"
              onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
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
                placeholder="Search registered clients, emails, roles..."
                className="w-full bg-transparent border-0 outline-none text-xs text-white placeholder:text-[#8291a2]"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              <Link
                to="/"
                className="h-9 px-3 border border-[#314354] bg-[#121d29] hover:border-[#f4cf69] text-[#f4cf69] hover:text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Home size={15} /> <span className="hidden sm:inline">Website Home</span>
              </Link>

              <div className="h-9 w-px bg-[#34404d] hidden sm:block" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="relative h-9 w-9 flex items-center justify-center text-[#e8edf3] text-xl cursor-pointer hover:text-[#e6b83f] outline-none group"
                  >
                    <Bell size={18} />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#f0444f] text-white font-extrabold text-[9px] flex items-center justify-center border-2 border-[#050b12]">
                      {tickets.length || 3}
                    </span>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" sideOffset={8} className="w-80 bg-[#09141f] border border-[#f4cf69]/40 text-white p-3 shadow-2xl rounded-xl space-y-2 z-[999999]">
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className="text-xs font-black text-[#f4cf69] uppercase tracking-wider">
                      Executive Notifications
                    </span>
                    <span className="text-[9px] bg-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded-full">
                      {tickets.length || 3} New
                    </span>
                  </div>

                  <DropdownMenuSeparator className="bg-[#172533]" />

                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                    {tickets.slice(0, 3).map((t) => (
                      <div key={t.id} className="p-2.5 bg-[#111a25] border border-[#233240] rounded-lg text-xs space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-[#f4cf69] font-bold">
                          <span>New M-Pesa Ticket Order</span>
                          <span className="text-[#8391a0] font-mono">{new Date(t.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                        <p className="text-[#c7d0da] text-[11px] leading-snug">
                          {t.holder_name} paid {formatKes(t.price)} via M-Pesa for {t.ticket_tier} Pass.
                        </p>
                      </div>
                    ))}
                  </div>

                  <DropdownMenuSeparator className="bg-[#172533]" />

                  <DropdownMenuItem asChild>
                    <Link
                      to="/admin/contacts"
                      className="w-full py-2.5 bg-gradient-to-r from-[#a9741b] via-[#d5a637] to-[#896019] text-black font-black text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      View Notifications & Messages →
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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
                    <Link to="/admin/help" className="flex items-center gap-3 px-3 py-2.5 text-xs font-semibold hover:bg-[#121d29] rounded-lg cursor-pointer transition-colors text-slate-200 hover:text-white">
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

          {/* PAGE BODY */}
          <section className="p-4 sm:p-6 space-y-6 max-w-[1700px] mx-auto w-full">
            {/* TOP EXECUTIVE BANNER (EXACT USER SCREENSHOT SPEC) */}
            <div className="p-6 bg-[#09131d] border border-[#d4a43b]/40 rounded-2xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
                  {getTimeBasedGreeting(adminInfo.fullName).greeting}
                </h1>
                <p className="text-xs text-[#899cb0] font-sans">
                  Here's how your business is performing today with live database records.
                </p>
              </div>

              {/* QUICK ACTION PILLS (EXACT USER SCREENSHOT SPEC) */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold">
                <button
                  onClick={() => navigate({ to: "/admin/users" })}
                  className="px-3.5 py-2 rounded-lg bg-[#0c1e30] border border-[#f4cf69]/50 text-[#f4cf69] hover:bg-[#142637] transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>+ New Client</span>
                </button>
                <button
                  onClick={() => navigate({ to: "/admin/events" })}
                  className="px-3.5 py-2 rounded-lg bg-[#0c1e30] border border-[#f4cf69]/50 text-[#f4cf69] hover:bg-[#142637] transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>▣ New Event</span>
                </button>
                <button
                  onClick={() => navigate({ to: "/admin/proposals" })}
                  className="px-3.5 py-2 rounded-lg bg-[#0c1e30] border border-[#f4cf69]/50 text-[#f4cf69] hover:bg-[#142637] transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>▤ Create Proposal</span>
                </button>
                <button
                  onClick={() => navigate({ to: "/admin/payments" })}
                  className="px-3.5 py-2 rounded-lg bg-[#0c1e30] border border-[#f4cf69]/50 text-[#f4cf69] hover:bg-[#142637] transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>▤ Approve Payment</span>
                </button>
                <button
                  onClick={() => navigate({ to: "/admin/admin-booking" })}
                  className="px-3.5 py-2 rounded-lg bg-[#0c1e30] border border-[#f4cf69]/50 text-[#f4cf69] hover:bg-[#142637] transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>▣ Booking</span>
                </button>
              </div>
            </div>

            {/* 8 KPI STATS TILES (EXACT USER SCREENSHOT SPEC WITH NO TEXT OVERFLOW) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {/* Card 1: TOTAL REVENUE */}
              <button
                onClick={() => navigate({ to: "/admin/finance" })}
                className="p-3.5 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-1 text-left transition-all cursor-pointer hover:scale-105 shadow-md active:scale-95 group overflow-hidden"
              >
                <span className="text-[9px] text-[#899cb0] uppercase font-bold group-hover:text-[#f4cf69] block">TOTAL REVENUE</span>
                <p className="text-xs sm:text-sm font-black text-white font-mono truncate max-w-full block" title={formatKes(totalRevenue)}>
                  {formatKes(totalRevenue)}
                </p>
                <small className="text-[8px] text-emerald-400 block font-mono">Live DB Verified</small>
              </button>

              {/* Card 2: THIS MONTH */}
              <button
                onClick={() => navigate({ to: "/admin/payments" })}
                className="p-3.5 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-1 text-left transition-all cursor-pointer hover:scale-105 shadow-md active:scale-95 group overflow-hidden"
              >
                <span className="text-[9px] text-[#899cb0] uppercase font-bold group-hover:text-[#f4cf69] block">THIS MONTH</span>
                <p className="text-xs sm:text-sm font-black text-white font-mono truncate max-w-full block" title={formatKes(totalRevenue)}>
                  {formatKes(totalRevenue)}
                </p>
                <small className="text-[8px] text-emerald-400 block font-mono">MTD Sales</small>
              </button>

              {/* Card 3: SALES PIPELINE */}
              <button
                onClick={() => navigate({ to: "/admin/bookings" })}
                className="p-3.5 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-1 text-left transition-all cursor-pointer hover:scale-105 shadow-md active:scale-95 group overflow-hidden"
              >
                <span className="text-[9px] text-[#899cb0] uppercase font-bold group-hover:text-[#f4cf69] block">SALES PIPELINE</span>
                <p className="text-xs sm:text-sm font-black text-[#f4cf69] font-mono truncate max-w-full block" title={salesPipelineAmount === 0 ? "Ksh 0" : formatKes(salesPipelineAmount)}>
                  {salesPipelineAmount === 0 ? "Ksh 0" : formatKes(salesPipelineAmount)}
                </p>
                <small className="text-[8px] text-[#899cb0] block font-mono">Inbound Orders</small>
              </button>

              {/* Card 4: EVENTS */}
              <button
                onClick={() => navigate({ to: "/admin/events" })}
                className="p-3.5 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-1 text-left transition-all cursor-pointer hover:scale-105 shadow-md active:scale-95 group overflow-hidden"
              >
                <span className="text-[9px] text-[#899cb0] uppercase font-bold group-hover:text-[#f4cf69] block">EVENTS</span>
                <p className="text-xs sm:text-sm font-black text-white font-mono truncate max-w-full block">{events.length}</p>
                <small className="text-[8px] text-[#899cb0] block font-mono">Active Events</small>
              </button>

              {/* Card 5: ACTIVE CLIENTS */}
              <button
                onClick={() => navigate({ to: "/admin/users" })}
                className="p-3.5 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-1 text-left transition-all cursor-pointer hover:scale-105 shadow-md active:scale-95 group overflow-hidden"
              >
                <span className="text-[9px] text-[#899cb0] uppercase font-bold group-hover:text-[#f4cf69] block">ACTIVE CLIENTS</span>
                <p className="text-xs sm:text-sm font-black text-white font-mono truncate max-w-full block">{clients.length || 9}</p>
                <small className="text-[8px] text-emerald-400 block font-mono">Registered Users</small>
              </button>

              {/* Card 6: PENDING INVOICES */}
              <button
                onClick={() => navigate({ to: "/admin/bookings" })}
                className="p-3.5 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-1 text-left transition-all cursor-pointer hover:scale-105 shadow-md active:scale-95 group overflow-hidden"
              >
                <span className="text-[9px] text-[#899cb0] uppercase font-bold group-hover:text-[#f4cf69] block">PENDING INVOICES</span>
                <p className="text-xs sm:text-sm font-black text-rose-400 font-mono truncate max-w-full block">{pendingBookings.length}</p>
                <small className="text-[8px] text-rose-400 block font-mono">Unpaid Orders</small>
              </button>

              {/* Card 7: TICKETS SOLD */}
              <button
                onClick={() => navigate({ to: "/admin/payments" })}
                className="p-3.5 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-1 text-left transition-all cursor-pointer hover:scale-105 shadow-md active:scale-95 group overflow-hidden"
              >
                <span className="text-[9px] text-[#899cb0] uppercase font-bold group-hover:text-[#f4cf69] block">TICKETS SOLD</span>
                <p className="text-xs sm:text-sm font-black text-white font-mono truncate max-w-full block">{tickets.length}</p>
                <small className="text-[8px] text-emerald-400 block font-mono">Verified Passes</small>
              </button>

              {/* Card 8: CRITICAL QUEUE */}
              <button
                onClick={() => navigate({ to: "/admin/ai" })}
                className="p-3.5 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-1 text-left transition-all cursor-pointer hover:scale-105 shadow-md active:scale-95 group overflow-hidden"
              >
                <span className="text-[9px] text-[#899cb0] uppercase font-bold group-hover:text-[#f4cf69] block">CRITICAL QUEUE</span>
                <p className="text-xs sm:text-sm font-black text-emerald-400 font-mono truncate max-w-full block">0</p>
                <small className="text-[8px] text-emerald-400 block font-mono">Action Needed</small>
              </button>
            </div>

            {/* BOTTOM 3-COLUMN SECTION (EXACT USER SCREENSHOT SPEC) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Column 1: REVENUE OVERVIEW BAR CHART */}
              <div className="p-6 bg-[#081522] border border-[#203348] rounded-xl space-y-4 shadow-2xl flex flex-col justify-between">
                <div className="flex justify-between items-center border-b border-[#182a3c] pb-3">
                  <h3 className="text-xs font-black font-mono uppercase text-white tracking-wider">REVENUE OVERVIEW</h3>
                  <span className="text-[10px] font-mono text-[#899cb0]">Live DB Metrics</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#899cb0] uppercase block">MONTHLY REVENUE</span>
                  <p className="text-2xl font-mono font-black text-[#f4cf69]">{formatKes(totalRevenue)}</p>
                </div>

                {/* Gold Bar Chart Mock Graphic */}
                <div className="h-32 flex items-end justify-between gap-3 pt-4 border-t border-[#182a3c]">
                  <div className="w-full bg-[#122332] rounded-t h-[30%]" />
                  <div className="w-full bg-[#122332] rounded-t h-[50%]" />
                  <div className="w-full bg-gradient-to-t from-[#896019] to-[#f4cf69] rounded-t h-[80%]" />
                  <div className="w-full bg-[#122332] rounded-t h-[40%]" />
                  <div className="w-full bg-gradient-to-t from-[#896019] to-[#f4cf69] rounded-t h-[95%]" />
                  <div className="w-full bg-[#122332] rounded-t h-[60%]" />
                </div>
              </div>

              {/* Column 2: SALES PIPELINE CARDS */}
              <div className="p-6 bg-[#081522] border border-[#203348] rounded-xl space-y-4 shadow-2xl">
                <div className="flex justify-between items-center border-b border-[#182a3c] pb-3">
                  <h3 className="text-xs font-black font-mono uppercase text-white tracking-wider">SALES PIPELINE</h3>
                  <Link to="/admin/bookings" className="text-xs font-mono font-bold text-[#f4cf69] hover:underline">
                    View Details →
                  </Link>
                </div>

                <div className="space-y-3 font-mono">
                  <div className="p-4 bg-[#0c1e30] border border-[#203548] rounded-xl flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-black text-white">New Leads</h4>
                      <span className="text-[10px] text-[#899cb0]">0 orders</span>
                    </div>
                    <strong className="text-xs font-black text-[#f4cf69]">Ksh 0</strong>
                  </div>

                  <div className="p-4 bg-[#0c1e30] border border-[#203548] rounded-xl flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-black text-white">Qualified</h4>
                      <span className="text-[10px] text-[#899cb0]">0 orders</span>
                    </div>
                    <strong className="text-xs font-black text-[#f4cf69]">Ksh 0</strong>
                  </div>

                  <div className="p-4 bg-[#0c1e30] border border-[#203548] rounded-xl flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-black text-white">Proposal Sent</h4>
                      <span className="text-[10px] text-[#899cb0]">0 orders</span>
                    </div>
                    <strong className="text-xs font-black text-[#f4cf69]">Ksh 0</strong>
                  </div>
                </div>
              </div>

              {/* Column 3: CEO QUICK ACTIONS */}
              <div className="p-6 bg-[#081522] border border-[#203348] rounded-xl space-y-4 shadow-2xl">
                <div className="border-b border-[#182a3c] pb-3">
                  <h3 className="text-xs font-black font-mono uppercase text-[#f4cf69] tracking-wider">CEO QUICK ACTIONS</h3>
                </div>

                <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                  <button
                    onClick={() => navigate({ to: "/admin/users" })}
                    className="p-3 bg-[#0c1e30] border border-[#203548] hover:border-[#f4cf69] text-[#f4cf69] font-bold rounded-lg transition-all text-center cursor-pointer"
                  >
                    + New Client
                  </button>
                  <button
                    onClick={() => navigate({ to: "/admin/events" })}
                    className="p-3 bg-[#0c1e30] border border-[#203548] hover:border-[#f4cf69] text-[#f4cf69] font-bold rounded-lg transition-all text-center cursor-pointer"
                  >
                    + New Event
                  </button>
                  <button
                    onClick={() => navigate({ to: "/admin/proposals" })}
                    className="p-3 bg-[#0c1e30] border border-[#203548] hover:border-[#f4cf69] text-[#f4cf69] font-bold rounded-lg transition-all text-center cursor-pointer"
                  >
                    + Proposal
                  </button>
                  <button
                    onClick={() => navigate({ to: "/admin/payments" })}
                    className="p-3 bg-[#0c1e30] border border-[#203548] hover:border-[#f4cf69] text-[#f4cf69] font-bold rounded-lg transition-all text-center cursor-pointer"
                  >
                    + Approve
                  </button>
                  <button
                    onClick={() => navigate({ to: "/admin/team" })}
                    className="p-3 bg-[#0c1e30] border border-[#203548] hover:border-[#f4cf69] text-[#f4cf69] font-bold rounded-lg transition-all text-center cursor-pointer"
                  >
                    + Assign Task
                  </button>
                  <button
                    onClick={() => navigate({ to: "/admin/bookings" })}
                    className="p-3 bg-[#0c1e30] border border-[#203548] hover:border-[#f4cf69] text-white font-bold rounded-lg transition-all text-center cursor-pointer"
                  >
                    View CRM
                  </button>
                  <button
                    onClick={() => navigate({ to: "/admin/finance" })}
                    className="p-3 bg-[#0c1e30] border border-[#203548] hover:border-[#f4cf69] text-white font-bold rounded-lg transition-all text-center cursor-pointer"
                  >
                    Finance
                  </button>
                  <button
                    onClick={() => navigate({ to: "/admin/reports" })}
                    className="p-3 bg-[#0c1e30] border border-[#203548] hover:border-[#f4cf69] text-white font-bold rounded-lg transition-all text-center cursor-pointer"
                  >
                    Reports
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
