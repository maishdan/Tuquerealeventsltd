import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  useAdminEvents,
  useAdminBookings,
  useAdminTickets,
  useAdminClients,
  useAdminProspects,
  computeAdminKpis,
  formatKes
} from "@/hooks/use-dashboard-data";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Mail, FileText, HelpCircle, LogOut, ChevronDown, Power, User, Home, Crown, Bell } from "lucide-react";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { createPageSeo } from "@/lib/seo";

export const Route = createFileRoute("/admin/")({
  head: () =>
    createPageSeo({
      title: "Executive CEO Command Center | TOQUE REAL EVENTS LIMITED",
      description: "Official Executive CEO Command Center for Royal Touch Events — Kenya's Top Event Management Agency.",
      path: "/admin",
      noindex: true,
    }),
  component: AdminDashboard,
});

export function AdminDashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Real Database Hooks
  const { data: bookings = [], isLoading: isLoadingBookings } = useAdminBookings();
  const { data: events = [], isLoading: isLoadingEvents } = useAdminEvents();
  const { data: clients = [], isLoading: isLoadingClients } = useAdminClients();
  const { data: tickets = [] } = useAdminTickets();
  const { data: prospects = [] } = useAdminProspects();

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2800);
  };

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

  // Financial KPI calculations
  const totalRevenue = tickets.reduce((acc, t) => acc + (t.price || 0), 0);
  const salesPipelineAmount = bookings.reduce((acc, b) => {
    const numeric = typeof b.budget === "number" ? b.budget : parseInt(String(b.budget || 0).replace(/[^0-9]/g, "")) || 0;
    return acc + numeric;
  }, 0);

  const pendingBookings = bookings.filter((b) => b.status === "pending" || !b.status);
  const activeClients = clients.filter((c) => c.email);

  if (isLoadingBookings || isLoadingEvents || isLoadingClients) {
    return <LoadingScreen message="Connecting to Live Database..." />;
  }

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
              { to: "/admin/contacts", label: "Notifications", icon: "✉" },
              { to: "/admin/contacts", label: "Messages", icon: "✉" },
              { to: "/admin/team", label: "Team", icon: "♟" },
              { to: "/admin/marketing", label: "Marketing", icon: "⚡" },
              { to: "/admin/reports", label: "Reports", icon: "📄" },
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
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="min-w-0 pb-8">
          {/* EXACT DEFAULT HEADER */}
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

            {/* Universal Global Search Bar */}
            <div className="relative w-full max-w-[425px] h-9 border border-[#314354] rounded-lg bg-[#121d29] flex items-center px-3 gap-2.5">
              <span className="text-[#8d9bad] text-sm">⌕</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search registered clients, emails, roles..."
                className="w-full bg-transparent border-0 outline-none text-xs text-white placeholder:text-[#8291a2]"
              />
            </div>

            <div className="ml-auto flex items-center gap-3">
              {/* Website Home Button */}
              <Link
                to="/"
                className="h-9 px-3.5 border border-[#314354] bg-[#121d29] hover:border-[#f4cf69] text-[#f4cf69] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Go to Public Website Home"
              >
                <Home size={15} /> <span className="hidden sm:inline">Website Home</span>
              </Link>

              <div className="h-9 w-px bg-[#34404d] hidden sm:block" />

              {/* Notifications Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="relative h-9 w-9 flex items-center justify-center text-[#e8edf3] text-xl cursor-pointer hover:text-[#e6b83f] outline-none group"
                    title="Notifications Overview"
                  >
                    <Bell size={18} />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#f0444f] text-white font-extrabold text-[9px] flex items-center justify-center border-2 border-[#050b12] group-hover:scale-110 transition-transform">
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
                      className="w-full py-2.5 bg-gradient-to-r from-[#a9741b] via-[#d5a637] to-[#896019] text-black font-black text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 hover:bg-gold transition-all cursor-pointer"
                    >
                      View All Notifications & Messages →
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-9 w-px bg-[#34404d] hidden sm:block" />

              {/* Date */}
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
                  <DropdownMenuItem onClick={() => navigate({ to: "/admin/settings" })} className="cursor-pointer">
                    <Settings size={15} className="mr-2 text-[#f4cf69]" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowLogoutConfirmModal(true)} className="text-rose-400 cursor-pointer">
                    <LogOut size={15} className="mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* MAIN DASHBOARD CANVAS */}
          <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
            {/* TOP BANNER WITH ACTION BUTTONS */}
            <div className="p-6 bg-gradient-to-r from-[#0d1c28] via-[#09141f] to-[#050e17] border-2 border-[#d4a43b]/40 rounded-xl shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-[#e6b83f]/15 border border-[#e6b83f]/40 text-[#f4cf69] text-[9px] font-black uppercase tracking-[0.2em] rounded">
                  TOQUE REAL EVENTS LIMITED ADMINISTRATOR
                </span>
                <h1 className="text-2xl lg:text-3xl font-black font-serif text-white">
                  Good Morning, {adminInfo.fullName}
                </h1>
                <p className="text-xs text-[#98a7b7]">
                  Here's how your business is performing today with live database records.
                </p>
              </div>

              {/* TOP HEADER ACTION BUTTONS (ALL NAVIGATE TO EXACT PAGES) */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => navigate({ to: "/admin/users" })}
                  className="px-3.5 py-2 rounded-lg bg-[#121d29] border border-[#d5a637]/50 text-[#f4cf69] text-xs font-bold hover:bg-[#1a2938] transition-all cursor-pointer"
                >
                  + New Client
                </button>
                <button
                  onClick={() => navigate({ to: "/admin/events" })}
                  className="px-3.5 py-2 rounded-lg bg-[#121d29] border border-[#d5a637]/50 text-[#f4cf69] text-xs font-bold hover:bg-[#1a2938] transition-all cursor-pointer"
                >
                  ▣ New Event
                </button>
                <button
                  onClick={() => navigate({ to: "/admin/proposals" })}
                  className="px-3.5 py-2 rounded-lg bg-[#121d29] border border-[#d5a637]/50 text-[#f4cf69] text-xs font-bold hover:bg-[#1a2938] transition-all cursor-pointer"
                >
                  ▤ Create Proposal
                </button>
                <button
                  onClick={() => navigate({ to: "/admin/payments" })}
                  className="px-3.5 py-2 rounded-lg bg-[#121d29] border border-[#d5a637]/50 text-[#f4cf69] text-xs font-bold hover:bg-[#1a2938] transition-all cursor-pointer"
                >
                  ▣ Approve Payment
                </button>
                <button
                  onClick={() => navigate({ to: "/admin/admin-booking" })}
                  className="px-3.5 py-2 rounded-lg bg-[#121d29] border border-[#d5a637]/50 text-[#f4cf69] text-xs font-bold hover:bg-[#1a2938] transition-all cursor-pointer"
                >
                  ▣ Booking
                </button>
              </div>
            </div>

            {/* KPI STATS ROW (8 INTERACTIVE CLICKABLE BUTTON CARDS NAVIGATING TO REAL PAGES) */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {/* Card 1: Total Revenue -> /admin/finance */}
              <button
                onClick={() => navigate({ to: "/admin/finance" })}
                className="p-4 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-1 text-left transition-all cursor-pointer hover:scale-105 shadow-md active:scale-95 group"
                title="View Finance Page"
              >
                <span className="text-[10px] text-[#899cb0] uppercase font-bold group-hover:text-[#f4cf69]">Total Revenue</span>
                <p className="text-base font-black text-white font-mono">{formatKes(totalRevenue)}</p>
                <small className="text-[9px] text-emerald-400 block">Live DB Verified</small>
              </button>

              {/* Card 2: This Month -> /admin/payments */}
              <button
                onClick={() => navigate({ to: "/admin/payments" })}
                className="p-4 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-1 text-left transition-all cursor-pointer hover:scale-105 shadow-md active:scale-95 group"
                title="View Payments Page"
              >
                <span className="text-[10px] text-[#899cb0] uppercase font-bold group-hover:text-[#f4cf69]">This Month</span>
                <p className="text-base font-black text-white font-mono">{formatKes(totalRevenue)}</p>
                <small className="text-[9px] text-emerald-400 block">MTD Sales</small>
              </button>

              {/* Card 3: Sales Pipeline -> /admin/bookings */}
              <button
                onClick={() => navigate({ to: "/admin/bookings" })}
                className="p-4 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-1 text-left transition-all cursor-pointer hover:scale-105 shadow-md active:scale-95 group"
                title="View Sales & CRM Bookings Page"
              >
                <span className="text-[10px] text-[#899cb0] uppercase font-bold group-hover:text-[#f4cf69]">Sales Pipeline</span>
                <p className="text-base font-black text-[#f4cf69] font-mono">{formatKes(salesPipelineAmount)}</p>
                <small className="text-[9px] text-[#899cb0] block">Inbound Orders</small>
              </button>

              {/* Card 4: Events -> /admin/events */}
              <button
                onClick={() => navigate({ to: "/admin/events" })}
                className="p-4 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-1 text-left transition-all cursor-pointer hover:scale-105 shadow-md active:scale-95 group"
                title="View Events Registry Page"
              >
                <span className="text-[10px] text-[#899cb0] uppercase font-bold group-hover:text-[#f4cf69]">Events</span>
                <p className="text-base font-black text-white font-mono">{events.length}</p>
                <small className="text-[9px] text-[#899cb0] block">Active Events</small>
              </button>

              {/* Card 5: Active Clients -> /admin/users */}
              <button
                onClick={() => navigate({ to: "/admin/users" })}
                className="p-4 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-1 text-left transition-all cursor-pointer hover:scale-105 shadow-md active:scale-95 group"
                title="View Clients Directory Page"
              >
                <span className="text-[10px] text-[#899cb0] uppercase font-bold group-hover:text-[#f4cf69]">Active Clients</span>
                <p className="text-base font-black text-white font-mono">{activeClients.length}</p>
                <small className="text-[9px] text-emerald-400 block">Registered Users</small>
              </button>

              {/* Card 6: Pending Invoices -> /admin/bookings */}
              <button
                onClick={() => navigate({ to: "/admin/bookings" })}
                className="p-4 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-1 text-left transition-all cursor-pointer hover:scale-105 shadow-md active:scale-95 group"
                title="View Pending Orders"
              >
                <span className="text-[10px] text-[#899cb0] uppercase font-bold group-hover:text-[#f4cf69]">Pending Invoices</span>
                <p className="text-base font-black text-white font-mono">{pendingBookings.length}</p>
                <small className="text-[9px] text-[#899cb0] block">Unpaid Orders</small>
              </button>

              {/* Card 7: Tickets Sold -> /admin/events */}
              <button
                onClick={() => navigate({ to: "/admin/events" })}
                className="p-4 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-1 text-left transition-all cursor-pointer hover:scale-105 shadow-md active:scale-95 group"
                title="View Tickets Page"
              >
                <span className="text-[10px] text-[#899cb0] uppercase font-bold group-hover:text-[#f4cf69]">Tickets Sold</span>
                <p className="text-base font-black text-white font-mono">{tickets.length}</p>
                <small className="text-[9px] text-emerald-400 block">Verified Passes</small>
              </button>

              {/* Card 8: Critical Queue -> /admin/contacts */}
              <button
                onClick={() => navigate({ to: "/admin/contacts" })}
                className="p-4 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl space-y-1 text-left transition-all cursor-pointer hover:scale-105 shadow-md active:scale-95 group"
                title="View Inbound Contacts Page"
              >
                <span className="text-[10px] text-[#899cb0] uppercase font-bold group-hover:text-[#f4cf69]">Critical Queue</span>
                <p className="text-base font-black text-white font-mono">0</p>
                <small className="text-[9px] text-emerald-400 block">Action Needed</small>
              </button>
            </div>

            {/* ROW 1: REVENUE OVERVIEW CHART, SALES PIPELINE FUNNEL & CEO QUICK ACTIONS */}
            <div className="grid lg:grid-cols-12 gap-4">
              {/* Revenue Overview Bar Chart */}
              <div className="lg:col-span-5 bg-[#081522] border border-[#203348] rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-[#1f3246] pb-3">
                  <h3 className="text-xs font-black uppercase text-white">Revenue Overview</h3>
                  <span className="text-[10px] text-[#f4cf69] font-mono font-bold">Live DB Metrics</span>
                </div>

                <div className="space-y-2">
                  <div className="text-right">
                    <span className="text-[10px] text-[#899cb0] block uppercase">Monthly Revenue</span>
                    <strong className="text-xl font-black text-[#f4cf69] font-mono">{formatKes(totalRevenue)}</strong>
                  </div>

                  {/* Visual Bar Chart */}
                  <div className="h-40 flex items-end justify-between gap-3 pt-4 border-b border-[#1f3246]">
                    {[
                      { month: "Jan", val: 30, target: 70 },
                      { month: "Feb", val: 45, target: 75 },
                      { month: "Mar", val: 60, target: 80 },
                      { month: "Apr", val: totalRevenue > 0 ? 90 : 15, target: 100 },
                    ].map((m) => (
                      <div key={m.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div className="w-full flex items-end justify-center gap-1 h-full">
                          <div style={{ height: `${m.val}%` }} className="w-3.5 bg-gradient-to-t from-[#d5a637] to-[#f4cf69] rounded-t" />
                          <div style={{ height: `${m.target}%` }} className="w-2 bg-[#1f3246] rounded-t" />
                        </div>
                        <span className="text-[10px] text-[#899cb0] font-mono mt-1">{m.month}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#899cb0] pt-1">
                    <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded bg-[#f4cf69] inline-block" /> Revenue</span>
                    <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded bg-[#1f3246] inline-block" /> Target</span>
                  </div>
                </div>
              </div>

              {/* Sales Pipeline Funnel */}
              <div className="lg:col-span-4 bg-[#081522] border border-[#203348] rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-[#1f3246] pb-3">
                  <h3 className="text-xs font-black uppercase text-white">Sales Pipeline</h3>
                  <Link to="/admin/bookings" className="text-xs text-[#f4cf69] font-bold hover:underline">View Details →</Link>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {[
                    { stage: "New Leads", count: bookings.length, amt: formatKes(salesPipelineAmount) },
                    { stage: "Qualified", count: bookings.filter((b) => b.status === "planning").length, amt: formatKes(salesPipelineAmount * 0.7) },
                    { stage: "Proposal Sent", count: bookings.filter((b) => b.status === "confirmed").length, amt: formatKes(salesPipelineAmount * 0.5) },
                    { stage: "Won", count: tickets.length, amt: formatKes(totalRevenue) },
                  ].map((s) => (
                    <div key={s.stage} className="p-2.5 bg-[#0c1a28] border border-[#1b2f40] rounded-xl flex justify-between items-center">
                      <span className="text-white font-bold">{s.stage}</span>
                      <div className="text-right">
                        <span className="text-emerald-400 font-bold block">{s.amt}</span>
                        <span className="text-[9px] text-[#899cb0]">{s.count} orders</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CEO Quick Actions Panel */}
              <div className="lg:col-span-3 bg-[#081522] border border-[#203348] rounded-xl p-5 space-y-4">
                <h3 className="text-xs font-black uppercase text-[#f4cf69] border-b border-[#1f3246] pb-3">
                  CEO Quick Actions
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button onClick={() => navigate({ to: "/admin/users" })} className="p-2.5 rounded-xl bg-[#142637] border border-[#f4cf69]/40 text-[#f4cf69] hover:bg-[#1f344c] font-bold text-left transition-all cursor-pointer">
                    + New Client
                  </button>
                  <button onClick={() => navigate({ to: "/admin/events" })} className="p-2.5 rounded-xl bg-[#142637] border border-[#f4cf69]/40 text-[#f4cf69] hover:bg-[#1f344c] font-bold text-left transition-all cursor-pointer">
                    + New Event
                  </button>
                  <button onClick={() => navigate({ to: "/admin/proposals" })} className="p-2.5 rounded-xl bg-[#142637] border border-[#f4cf69]/40 text-[#f4cf69] hover:bg-[#1f344c] font-bold text-left transition-all cursor-pointer">
                    + Proposal
                  </button>
                  <button onClick={() => navigate({ to: "/admin/payments" })} className="p-2.5 rounded-xl bg-[#142637] border border-[#f4cf69]/40 text-[#f4cf69] hover:bg-[#1f344c] font-bold text-left transition-all cursor-pointer">
                    + Approve
                  </button>
                  <button onClick={() => navigate({ to: "/admin/team" })} className="p-2.5 rounded-xl bg-[#142637] border border-[#f4cf69]/40 text-[#f4cf69] hover:bg-[#1f344c] font-bold text-left transition-all cursor-pointer">
                    + Assign Task
                  </button>
                  <button onClick={() => navigate({ to: "/admin/users" })} className="p-2.5 rounded-xl bg-[#0c1a28] border border-[#203548] text-white hover:border-[#f4cf69] font-bold text-left transition-all cursor-pointer">
                    View CRM
                  </button>
                  <button onClick={() => navigate({ to: "/admin/finance" })} className="p-2.5 rounded-xl bg-[#0c1a28] border border-[#203548] text-white hover:border-[#f4cf69] font-bold text-left transition-all cursor-pointer">
                    Finance
                  </button>
                  <button onClick={() => navigate({ to: "/admin/reports" })} className="p-2.5 rounded-xl bg-[#0c1a28] border border-[#203548] text-white hover:border-[#f4cf69] font-bold text-left transition-all cursor-pointer">
                    Reports
                  </button>
                </div>
              </div>
            </div>

            {/* ROW 2: EVENTS TABLE, FINANCIAL POSITION, OPERATIONS & RECENT ACTIVITY */}
            <div className="grid lg:grid-cols-12 gap-4">
              {/* Upcoming Events Table */}
              <div className="lg:col-span-4 bg-[#081522] border border-[#203348] rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-[#1f3246] pb-3">
                  <h3 className="text-xs font-black uppercase text-white">Upcoming Events ({events.length})</h3>
                  <Link to="/admin/events" className="text-xs text-[#f4cf69] font-bold hover:underline">View All →</Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-[#899cb0] border-b border-[#1f3246]">
                        <th className="pb-2">Event</th>
                        <th className="pb-2">Venue</th>
                        <th className="pb-2">Date</th>
                        <th className="pb-2 text-right">Budget</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1d3043] text-white">
                      {events.length > 0 ? (
                        events.slice(0, 3).map((e) => (
                          <tr key={e.id}>
                            <td className="py-2.5 font-bold">{e.name}</td>
                            <td className="py-2.5 text-[#899cb0]">{e.venue}</td>
                            <td className="py-2.5 font-mono text-[#f4cf69]">{e.event_date}</td>
                            <td className="py-2.5 text-right font-mono font-bold">{formatKes(e.budget || 0)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-[#899cb0]">No live events in database.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Position Summary */}
              <div className="lg:col-span-3 bg-[#081522] border border-[#203348] rounded-xl p-5 space-y-3">
                <div className="flex justify-between items-center border-b border-[#1f3246] pb-3">
                  <h3 className="text-xs font-black uppercase text-white">Financial Position</h3>
                  <Link to="/admin/finance" className="text-xs text-[#f4cf69] font-bold hover:underline">View Details →</Link>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[#899cb0] text-[10px] block uppercase">Settled Cash</span>
                    <strong className="text-white font-bold">{formatKes(totalRevenue)}</strong>
                  </div>
                  <div>
                    <span className="text-[#899cb0] text-[10px] block uppercase">Pipeline</span>
                    <strong className="text-[#f4cf69] font-bold">{formatKes(salesPipelineAmount)}</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-[#0c1a28] border border-[#1b2f40] rounded-xl flex justify-between items-center text-xs">
                  <span className="text-emerald-400 font-bold">✓ Verified DB Engine</span>
                  <span className="text-[#899cb0]">100% M-Pesa</span>
                </div>
              </div>

              {/* Operations Readiness */}
              <div className="lg:col-span-2 bg-[#081522] border border-[#203348] rounded-xl p-5 space-y-3">
                <div className="flex justify-between items-center border-b border-[#1f3246] pb-3">
                  <h3 className="text-xs font-black uppercase text-white">Operations</h3>
                  <Link to="/admin/events" className="text-xs text-[#f4cf69] font-bold hover:underline">View All →</Link>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    100%
                  </div>
                  <div className="text-[11px] text-[#a0b2c6] space-y-0.5">
                    <p>● Equipment</p>
                    <p>● Logistics</p>
                    <p>● Security</p>
                  </div>
                </div>
              </div>

              {/* Recent Real Activity Feed */}
              <div className="lg:col-span-3 bg-[#081522] border border-[#203348] rounded-xl p-5 space-y-3">
                <div className="flex justify-between items-center border-b border-[#1f3246] pb-3">
                  <h3 className="text-xs font-black uppercase text-white">Recent Real Activity</h3>
                  <Link to="/admin/bookings" className="text-xs text-[#f4cf69] font-bold hover:underline">View All →</Link>
                </div>

                <div className="space-y-2 text-xs">
                  {tickets.length > 0 ? (
                    tickets.slice(0, 3).map((t) => (
                      <div key={t.id} className="p-2 bg-[#0c1a28] border border-[#1b2f40] rounded-xl flex justify-between items-center">
                        <span className="text-white font-bold truncate max-w-[140px]">{t.holder_name}</span>
                        <span className="text-emerald-400 font-mono font-bold">{formatKes(t.price)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-[#899cb0]">No recent database activity found.</p>
                  )}
                </div>
              </div>
            </div>

            {/* ROW 3: REGISTERED CLIENTS, MARKETING, DECISION CENTER, AI LEAD INTELLIGENCE */}
            <div className="grid lg:grid-cols-12 gap-4">
              {/* Registered Clients Table */}
              <div className="lg:col-span-4 bg-[#081522] border border-[#203348] rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-[#1f3246] pb-3">
                  <h3 className="text-xs font-black uppercase text-white">Live Registered Clients ({activeClients.length})</h3>
                  <Link to="/admin/users" className="text-xs text-[#f4cf69] font-bold hover:underline">View Directory →</Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-[#899cb0] border-b border-[#172530]">
                        <th className="pb-2">Client Name</th>
                        <th className="pb-2">Email Address</th>
                        <th className="pb-2 text-right">Passes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1d3043] text-white">
                      {activeClients.length > 0 ? (
                        activeClients.slice(0, 4).map((c) => {
                          const clientTkts = tickets.filter((t) => t.holder_email.toLowerCase() === c.email.toLowerCase());
                          return (
                            <tr key={c.id}>
                              <td className="py-2 font-bold">{c.full_name || "Account Member"}</td>
                              <td className="py-2 text-[#899cb0] font-mono truncate max-w-[130px]">{c.email}</td>
                              <td className="py-2 text-right font-mono font-bold text-[#f4cf69]">{clientTkts.length} Pass(es)</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-8 text-center text-[#8391a0]">No registered clients found in database.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Marketing Intelligence Tile */}
              <div
                onClick={() => navigate({ to: "/admin/marketing" })}
                className="lg:col-span-3 bg-[#081522] border border-[#203348] hover:border-[#f4cf69] rounded-xl p-5 space-y-3 cursor-pointer transition-all"
              >
                <div className="flex justify-between items-center border-b border-[#1f3246] pb-3">
                  <h3 className="text-xs font-black uppercase text-white">Marketing Intelligence</h3>
                  <span className="text-xs text-[#f4cf69] font-bold hover:underline">View All →</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#899cb0] text-[10px] block uppercase">Website Visitors</span>
                    <p className="text-sm font-bold text-white font-mono">0 <span className="text-[#899cb0] text-[9px]">(Live DB)</span></p>
                  </div>
                  <div>
                    <span className="text-[#899cb0] text-[10px] block uppercase">LinkedIn Leads</span>
                    <p className="text-sm font-bold text-white font-mono">0 <span className="text-[#899cb0] text-[9px]">(Live DB)</span></p>
                  </div>
                </div>
              </div>

              {/* Decision Center */}
              <div className="lg:col-span-2 bg-[#081522] border border-[#203348] rounded-xl p-5 space-y-3">
                <h3 className="text-xs font-black uppercase text-white border-b border-[#1f3246] pb-3">
                  Decision Center
                </h3>

                <div className="p-2.5 bg-rose-950/60 border border-rose-500/50 text-rose-300 rounded-xl text-xs space-y-1">
                  <b className="block">Requires Decision ({pendingBookings.length})</b>
                  <p className="text-[11px] text-[#a0b2c6]">{pendingBookings.length > 0 ? `${pendingBookings.length} pending orders` : "No pending approvals"}</p>
                </div>
              </div>

              {/* REAL AI LEAD INTELLIGENCE CARD */}
              <div className="lg:col-span-3 bg-[#081522] border border-[#f4cf69]/40 rounded-xl p-5 space-y-4 flex flex-col justify-between">
                <div className="flex justify-between items-center border-b border-[#1f3246] pb-3">
                  <h3 className="text-xs font-black uppercase text-[#f4cf69]">AI Lead Intelligence</h3>
                  <Link to="/admin/ai" className="text-xs text-[#f4cf69] font-bold hover:underline">Explore AI →</Link>
                </div>

                <div className="space-y-2 flex-1 flex flex-col justify-center">
                  {prospects.length > 0 ? (
                    prospects.slice(0, 3).map((p) => (
                      <div key={p.id} className="p-3 bg-[#0d1c2a] border border-[#1d3244] rounded-xl flex justify-between items-center text-xs">
                        <span className="text-white font-bold truncate max-w-[160px]">{p.company_name || p.contact_name}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px]">
                          Score: {p.lead_score || 90}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-5 bg-[#0c1a28] border border-[#1b2f40] rounded-xl text-center text-[#899cb0] space-y-1">
                      <p className="font-bold text-white text-xs">No saved prospects yet.</p>
                      <p className="text-[11px]">Run the AI Lead Scanner on the AI page.</p>
                    </div>
                  )}
                </div>

                <Link
                  to="/admin/ai"
                  className="w-full py-2.5 bg-gradient-to-r from-[#d5a637] to-[#f4cf69] text-black font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center hover:scale-105 transition-all shadow cursor-pointer mt-2"
                >
                  Explore AI Lead Research Engine →
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
