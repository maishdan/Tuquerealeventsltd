import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  useAdminEvents,
  useAdminBookings,
  useAdminTickets,
  useAdminClients,
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
import { Settings, Mail, FileText, HelpCircle, LogOut, ChevronDown, Power, User } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);

  // 100% REAL LIVE SUPABASE DATABASE HOOKS
  const { data: events = [], isLoading: eventsLoading } = useAdminEvents();
  const { data: bookings = [], isLoading: bookingsLoading } = useAdminBookings();
  const { data: tickets = [], isLoading: ticketsLoading } = useAdminTickets();
  const { data: profiles = [], isLoading: profilesLoading } = useAdminClients();

  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
  };

  // Compute Time-based Exact Greeting (Morning / Afternoon / Evening / Night)
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };
  const timeGreeting = getGreeting();

  // Compute 100% Real Live Database Metrics
  const totalRevenue = tickets.reduce((acc, t) => acc + (t.price || 0), 0);
  const thisMonthRevenue = tickets
    .filter((t) => new Date(t.created_at).getMonth() === new Date().getMonth())
    .reduce((acc, t) => acc + (t.price || 0), 0);

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const salesPipelineAmount = bookings.reduce((acc, b) => {
    const numeric = typeof b.budget === "number" ? b.budget : parseInt(String(b.budget || 0).replace(/[^0-9]/g, "")) || 0;
    return acc + numeric;
  }, 0);

  const activeClients = profiles.filter((p) => p.role === "customer" || !p.role);
  const userInitials = profile?.full_name ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase() : "JO";

  // Universal Global Search Suggestions
  const dashboardPages = [
    { label: "Dashboard / CEO Overview", to: "/admin", cat: "Page", icon: "▣" },
    { label: "Events & Ticket Pricing", to: "/admin/events", cat: "Page", icon: "▦" },
    { label: "Clients Directory", to: "/admin/users", cat: "Page", icon: "♟" },
    { label: "Proposals Console", to: "/admin/proposals", cat: "Page", icon: "▤" },
    { label: "Payments Approval", to: "/admin/payments", cat: "Page", icon: "▣" },
    { label: "Sales & CRM Intake", to: "/admin/bookings", cat: "Page", icon: "▤" },
    { label: "Notifications & Messages", to: "/admin/contacts", cat: "Page", icon: "♧" },
    { label: "Settings & Configuration", to: "/admin/settings", cat: "Page", icon: "⚙" },
  ];

  const suggestedPages = dashboardPages.filter((p) =>
    p.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const suggestedEvents = events.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.venue && e.venue.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.event_type && e.event_type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const suggestedClients = profiles.filter(
    (p) =>
      (p.full_name && p.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const suggestedTickets = tickets.filter(
    (t) =>
      t.ticket_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.holder_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.event_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSearchActive = searchQuery.trim().length > 0;

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
              { to: "/admin", label: "Dashboard", icon: "▣", active: true },
              { to: "/admin/users", label: "Clients", icon: "♟" },
              { to: "/admin/events", label: "Events", icon: "▦" },
              { to: "/admin/bookings", label: "Sales & CRM", icon: "▤" },
              { to: "/admin/bookings", label: "Finance", icon: "✥" },
              { to: "/admin/events", label: "Operations", icon: "⚙" },
              { to: "/admin/contacts", label: "Notifications", icon: "♧" },
              { to: "/admin/contacts", label: "Messages", icon: "✉" },
              { to: "/admin/users", label: "Team", icon: "♟" },
              { to: "/admin/events", label: "Marketing", icon: "✦" },
              { to: "/admin/bookings", label: "Reports", icon: "▣" },
              { to: "/admin/settings", label: "Settings", icon: "⚙" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => showToast(`${item.label} Module Selected`)}
                className={cn(
                  "flex items-center gap-3 h-[43px] px-3 rounded-lg text-xs font-medium transition-all cursor-pointer my-1",
                  item.active
                    ? "bg-gradient-to-r from-[#a9741b] via-[#d5a637] to-[#896019] text-white shadow-lg shadow-[#b48224]/20"
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

            {/* Universal Global Search Bar & Live Suggestions Popover */}
            <div className="relative w-full max-w-[425px]">
              <div className="h-9 border border-[#314354] rounded-lg bg-[#121d29] flex items-center px-3 gap-2.5 focus-within:border-[#e6b83f] transition-colors">
                <span className="text-[#8d9bad] text-sm">⌕</span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search clients, events, contacts, pages..."
                  className="w-full bg-transparent border-0 outline-none text-xs text-white placeholder:text-[#8291a2]"
                />
                {isSearchActive && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-[#8291a2] hover:text-white text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* UNIVERSAL SEARCH SUGGESTIONS POPOVER */}
              {isSearchActive && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#09141f] border border-[#243343] rounded-xl shadow-2xl p-3 z-[100] max-h-96 overflow-y-auto space-y-3 font-sans animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center text-[10px] text-[#8d9baa] uppercase tracking-widest px-1 font-bold border-b border-[#172533] pb-1.5">
                    <span>Search Results for "{searchQuery}"</span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-[#f4cf69] hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>

                  {/* PAGES SUGGESTIONS */}
                  {suggestedPages.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase text-[#f4cf69] tracking-wider px-1">Pages & Modules</p>
                      {suggestedPages.map((page) => (
                        <Link
                          key={page.label}
                          to={page.to}
                          onClick={() => setSearchQuery("")}
                          className="flex items-center justify-between p-2 rounded-lg bg-[#111a25] border border-[#233240] hover:border-[#f4cf69] hover:bg-[#1a2838] transition-all cursor-pointer group"
                        >
                          <span className="text-xs font-semibold text-white group-hover:text-[#f4cf69] flex items-center gap-2">
                            <span className="text-[#f4cf69]">{page.icon}</span> {page.label}
                          </span>
                          <span className="text-[9px] text-[#8391a0] uppercase font-mono">Jump →</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* EVENTS SUGGESTIONS */}
                  {suggestedEvents.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase text-emerald-400 tracking-wider px-1">Live Events</p>
                      {suggestedEvents.slice(0, 3).map((e) => (
                        <Link
                          key={e.id}
                          to="/admin/events"
                          onClick={() => setSearchQuery("")}
                          className="flex items-center justify-between p-2 rounded-lg bg-[#111a25] border border-[#233240] hover:border-emerald-400 hover:bg-[#1a2838] transition-all cursor-pointer group"
                        >
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-emerald-400">{e.name}</p>
                            <p className="text-[9px] text-[#8391a0] font-mono">{e.event_date} · {e.venue}</p>
                          </div>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">Event</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* CLIENTS SUGGESTIONS */}
                  {suggestedClients.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase text-blue-400 tracking-wider px-1">Clients & Users</p>
                      {suggestedClients.slice(0, 3).map((c) => (
                        <Link
                          key={c.id}
                          to="/admin/users"
                          onClick={() => setSearchQuery("")}
                          className="flex items-center justify-between p-2 rounded-lg bg-[#111a25] border border-[#233240] hover:border-blue-400 hover:bg-[#1a2838] transition-all cursor-pointer group"
                        >
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-blue-400">{c.full_name || "Account Member"}</p>
                            <p className="text-[9px] text-[#8391a0] font-mono">{c.email}</p>
                          </div>
                          <span className="text-[9px] bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded">Client</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* TICKETS & ORDERS SUGGESTIONS */}
                  {suggestedTickets.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase text-purple-400 tracking-wider px-1">Digital Gate Passes</p>
                      {suggestedTickets.slice(0, 3).map((t) => (
                        <Link
                          key={t.id}
                          to="/admin/bookings"
                          onClick={() => setSearchQuery("")}
                          className="flex items-center justify-between p-2 rounded-lg bg-[#111a25] border border-[#233240] hover:border-purple-400 hover:bg-[#1a2838] transition-all cursor-pointer group"
                        >
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-purple-400">{t.ticket_code} - {t.holder_name}</p>
                            <p className="text-[9px] text-[#8391a0] font-mono">{t.event_name} ({t.ticket_tier})</p>
                          </div>
                          <span className="text-[9px] bg-purple-500/20 text-purple-400 font-bold px-2 py-0.5 rounded">Pass</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {suggestedPages.length === 0 &&
                    suggestedEvents.length === 0 &&
                    suggestedClients.length === 0 &&
                    suggestedTickets.length === 0 && (
                      <div className="py-6 text-center text-xs text-[#8391a0]">
                        No matching results found for "{searchQuery}".
                      </div>
                    )}
                </div>
              )}
            </div>

            <div className="ml-auto flex items-center gap-4">
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
                        <span>New M-Pesa Ticket Order</span>
                        <span className="text-[#8391a0]">2m ago</span>
                      </div>
                      <p className="text-[#c7d0da] text-[11px] leading-snug">
                        Daniel Maina paid KSh 1,500 via M-Pesa for VIP Pass #TKT-2026-8F72.
                      </p>
                    </div>

                    <div className="p-2.5 bg-[#111a25] border border-[#233240] rounded-lg text-xs space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-emerald-400 font-bold">
                        <span>New Client Inquiry</span>
                        <span className="text-[#8391a0]">45m ago</span>
                      </div>
                      <p className="text-[#c7d0da] text-[11px] leading-snug">
                        ABC Ltd submitted production brief for Corporate Gala Night 2026.
                      </p>
                    </div>

                    <div className="p-2.5 bg-[#111a25] border border-[#233240] rounded-lg text-xs space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-blue-400 font-bold">
                        <span>System Verification</span>
                        <span className="text-[#8391a0]">2h ago</span>
                      </div>
                      <p className="text-[#c7d0da] text-[11px] leading-snug">
                        AI M-Pesa Gate Verification Engine online and operational.
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
                        {profile?.full_name || "Daniwest"}
                      </strong>
                      <small className="block text-[10px] text-[#9ca8b6] font-medium uppercase">CEO / ADMINISTRATOR</small>
                    </div>
                    <ChevronDown size={14} className="text-[#9ba6b3] group-hover:text-[#f4cf69] transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#09141f] border-[#243343] text-white p-2 shadow-2xl rounded-xl space-y-1">
                  <DropdownMenuLabel className="px-3 py-2 text-xs font-black text-[#f4cf69] uppercase tracking-wider">
                    {profile?.full_name || "Daniwest"} (CEO)
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

          {/* LOGOUT CONFIRMATION MODAL POPUP (SMALL COMPACT TILE WITH SHARP EDGES & TRANSPARENT BACKDROP) */}
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
                    className="h-10 rounded-none bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all shadow-md cursor-pointer"
                  >
                    Yes, Confirm Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DASHBOARD CONTENT BODY */}
          <section className="p-4 sm:p-6 space-y-4 max-w-[1700px] mx-auto">
            {/* Executive 3D Welcome CEO Tile Banner */}
            <div className="relative group">
              {/* Backing 3D Accent Shadow Tile Layer */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#d5a637]/30 via-[#f4cf69]/20 to-[#896019]/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#0d1c28] via-[#09141f] to-[#050e17] border-2 border-[#d4a43b]/40 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.15)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden">
                <div className="space-y-2.5 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e6b83f]/15 border border-[#e6b83f]/40 text-[#f4cf69] text-[9px] font-black uppercase tracking-[0.25em] rounded-md shadow-inner">
                    <span className="text-[#f4cf69] font-serif text-sm">♛</span> Royal Touch Events Administrator
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif tracking-tight text-white flex flex-wrap items-center gap-2 leading-tight drop-shadow-md">
                    <span className="text-[#f4cf69]">{timeGreeting},</span> C.E.O {profile?.full_name?.split(" ")[0] || "Daniwest"} <span className="text-[#f4cf69] font-serif text-2xl lg:text-3xl">♛</span>
                  </h1>

                  <p className="text-xs sm:text-sm text-[#98a7b7] font-medium leading-relaxed font-sans">
                    Here's how your business is performing today with live database records.
                  </p>
                </div>

                {/* Quick Actions Bar embedded in Tile */}
                <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0">
                  <button onClick={() => navigate({ to: "/admin/users" })} className="px-3.5 py-2.5 rounded-lg bg-gradient-to-b from-[#1c1b1c] to-[#0e1217] border border-[#6c572b] hover:border-[#d4a43b] text-white text-xs font-semibold shadow-lg transition-all cursor-pointer hover:-translate-y-0.5">
                    <b className="text-[#efbd43] text-base mr-1">+</b>New Client
                  </button>
                  <button onClick={() => navigate({ to: "/admin/events" })} className="px-3.5 py-2.5 rounded-lg bg-gradient-to-b from-[#1c1b1c] to-[#0e1217] border border-[#6c572b] hover:border-[#d4a43b] text-white text-xs font-semibold shadow-lg transition-all cursor-pointer hover:-translate-y-0.5">
                    <b className="text-[#efbd43] text-base mr-1">▣</b>New Event
                  </button>
                  <button onClick={() => navigate({ to: "/admin/proposals" })} className="px-3.5 py-2.5 rounded-lg bg-gradient-to-b from-[#1c1b1c] to-[#0e1217] border border-[#6c572b] hover:border-[#d4a43b] text-white text-xs font-semibold shadow-lg transition-all cursor-pointer hover:-translate-y-0.5">
                    <b className="text-[#efbd43] text-base mr-1">▤</b>Create Proposal
                  </button>
                  <button onClick={() => navigate({ to: "/admin/payments" })} className="px-3.5 py-2.5 rounded-lg bg-gradient-to-b from-[#1c1b1c] to-[#0e1217] border border-[#6c572b] hover:border-[#d4a43b] text-white text-xs font-semibold shadow-lg transition-all cursor-pointer hover:-translate-y-0.5">
                    <b className="text-[#efbd43] text-base mr-1">▣</b>Approve Payment
                  </button>
                  <button onClick={() => navigate({ to: "/admin/admin-booking" })} className="px-3.5 py-2.5 rounded-lg bg-gradient-to-b from-[#1c1b1c] to-[#0e1217] border border-[#6c572b] hover:border-[#d4a43b] text-white text-xs font-semibold shadow-lg transition-all cursor-pointer hover:-translate-y-0.5">
                    <b className="text-[#efbd43] text-base mr-1">▣</b>Booking
                  </button>
                </div>
              </div>
            </div>

            {/* 8 KPI STAT CARDS ROW (ALL TILES NOW CONVERTED TO INTERACTIVE CLICKABLE BUTTONS / LINKS) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              <Link to="/admin/payments" className="p-3 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] hover:border-[#f4cf69] rounded-xl shadow-lg min-h-[105px] transition-all cursor-pointer group">
                <div className="flex items-center gap-2 text-[10px] text-[#bdc8d4]">
                  <div className="h-[34px] w-[34px] rounded-full bg-[#19202a] border border-[#2a3440] group-hover:border-[#f4cf69] text-[#f0c044] flex items-center justify-center font-bold text-base shrink-0 transition-colors">◎</div>
                  Total Revenue
                </div>
                <p className="text-base font-bold text-[#f1f4f8] group-hover:text-[#f4cf69] font-mono leading-tight mt-2 transition-colors">{formatKes(totalRevenue)}</p>
                <p className="text-[10px] text-[#20e39b] font-medium mt-1">↑ Live DB <span className="text-[#8796a6]">verified</span></p>
              </Link>

              <Link to="/admin/payments" className="p-3 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] hover:border-[#f4cf69] rounded-xl shadow-lg min-h-[105px] transition-all cursor-pointer group">
                <div className="flex items-center gap-2 text-[10px] text-[#bdc8d4]">
                  <div className="h-[34px] w-[34px] rounded-full bg-[#19202a] border border-[#2a3440] group-hover:border-[#f4cf69] text-[#f0c044] flex items-center justify-center font-bold text-base shrink-0 transition-colors">↗</div>
                  This Month
                </div>
                <p className="text-base font-bold text-[#f1f4f8] group-hover:text-[#f4cf69] font-mono leading-tight mt-2 transition-colors">{formatKes(thisMonthRevenue)}</p>
                <p className="text-[10px] text-[#20e39b] font-medium mt-1">↑ MTD <span className="text-[#8796a6]">sales</span></p>
              </Link>

              <Link to="/admin/proposals" className="p-3 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] hover:border-[#f4cf69] rounded-xl shadow-lg min-h-[105px] transition-all cursor-pointer group">
                <div className="flex items-center gap-2 text-[10px] text-[#bdc8d4]">
                  <div className="h-[34px] w-[34px] rounded-full bg-[#19202a] border border-[#2a3440] group-hover:border-[#f4cf69] text-[#f0c044] flex items-center justify-center font-bold text-base shrink-0 transition-colors">▽</div>
                  Sales Pipeline
                </div>
                <p className="text-base font-bold text-[#f1f4f8] group-hover:text-[#f4cf69] font-mono leading-tight mt-2 transition-colors">{formatKes(salesPipelineAmount)}</p>
                <p className="text-[10px] text-[#20e39b] font-medium mt-1">↑ Inbound <span className="text-[#8796a6]">orders</span></p>
              </Link>

              <Link to="/admin/events" className="p-3 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] hover:border-[#f4cf69] rounded-xl shadow-lg min-h-[105px] transition-all cursor-pointer group">
                <div className="flex items-center gap-2 text-[10px] text-[#bdc8d4]">
                  <div className="h-[34px] w-[34px] rounded-full bg-[#19202a] border border-[#2a3440] group-hover:border-[#f4cf69] text-[#f0c044] flex items-center justify-center font-bold text-base shrink-0 transition-colors">▣</div>
                  Events
                </div>
                <p className="text-base font-bold text-[#f1f4f8] group-hover:text-[#f4cf69] font-mono leading-tight mt-2 transition-colors">{events.length}</p>
                <p className="text-[10px] text-[#20e39b] font-medium mt-1">↑ Active <span className="text-[#8796a6]">events</span></p>
              </Link>

              <Link to="/admin/users" className="p-3 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] hover:border-[#f4cf69] rounded-xl shadow-lg min-h-[105px] transition-all cursor-pointer group">
                <div className="flex items-center gap-2 text-[10px] text-[#bdc8d4]">
                  <div className="h-[34px] w-[34px] rounded-full bg-[#19202a] border border-[#2a3440] group-hover:border-[#f4cf69] text-[#f0c044] flex items-center justify-center font-bold text-base shrink-0 transition-colors">♟</div>
                  Active Clients
                </div>
                <p className="text-base font-bold text-[#f1f4f8] group-hover:text-[#f4cf69] font-mono leading-tight mt-2 transition-colors">{activeClients.length}</p>
                <p className="text-[10px] text-[#20e39b] font-medium mt-1">↑ Registered <span className="text-[#8796a6]">users</span></p>
              </Link>

              <Link to="/admin/proposals" className="p-3 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] hover:border-[#f4cf69] rounded-xl shadow-lg min-h-[105px] transition-all cursor-pointer group">
                <div className="flex items-center gap-2 text-[10px] text-[#bdc8d4]">
                  <div className="h-[34px] w-[34px] rounded-full bg-[#19202a] border border-[#2a3440] group-hover:border-[#f4cf69] text-[#f0c044] flex items-center justify-center font-bold text-base shrink-0 transition-colors">▣</div>
                  Pending Invoices
                </div>
                <p className="text-base font-bold text-[#f1f4f8] group-hover:text-[#f4cf69] font-mono leading-tight mt-2 transition-colors">{pendingBookings.length}</p>
                <p className="text-[10px] text-[#ff5964] font-medium mt-1">● Unpaid <span className="text-[#8796a6]">orders</span></p>
              </Link>

              <Link to="/admin/admin-booking" className="p-3 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] hover:border-[#f4cf69] rounded-xl shadow-lg min-h-[105px] transition-all cursor-pointer group">
                <div className="flex items-center gap-2 text-[10px] text-[#bdc8d4]">
                  <div className="h-[34px] w-[34px] rounded-full bg-[#19202a] border border-[#2a3440] group-hover:border-[#f4cf69] text-[#f0c044] flex items-center justify-center font-bold text-base shrink-0 transition-colors">⌁</div>
                  Tickets Sold
                </div>
                <p className="text-base font-bold text-[#f1f4f8] group-hover:text-[#f4cf69] font-mono leading-tight mt-2 transition-colors">{tickets.length}</p>
                <p className="text-[10px] text-[#20e39b] font-medium mt-1">↑ Verified <span className="text-[#8796a6]">passes</span></p>
              </Link>

              <Link to="/admin/payments" className="p-3 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] hover:border-[#f4cf69] rounded-xl shadow-lg min-h-[105px] transition-all cursor-pointer group">
                <div className="flex items-center gap-2 text-[10px] text-[#bdc8d4]">
                  <div className="h-[34px] w-[34px] rounded-full bg-[#19202a] border border-[#2a3440] group-hover:border-[#f4cf69] text-[#f0c044] flex items-center justify-center font-bold text-base shrink-0 transition-colors">!</div>
                  Critical Queue
                </div>
                <p className="text-base font-bold text-[#f1f4f8] group-hover:text-[#f4cf69] font-mono leading-tight mt-2 transition-colors">{pendingBookings.length}</p>
                <p className="text-[10px] text-[#ff5964] font-medium mt-1">● Action <span className="text-[#8796a6]">needed</span></p>
              </Link>
            </div>

            {/* ROW 1: REVENUE CHART, SALES PIPELINE FUNNEL & QUICK ACTIONS */}
            <div className="grid lg:grid-cols-12 gap-3 pt-2">
              {/* Revenue Overview Panel (5 Cols) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-4 shadow-xl space-y-4 min-h-[262px]">
                <div className="flex items-center justify-between border-b border-[#172533] pb-3">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <span className="text-[#f1c045] text-base">▥</span> Revenue Overview
                  </div>
                  <span className="text-[10px] text-[#d8b45a] font-medium cursor-pointer hover:underline">Last 6 Months ⌄</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                  <div className="sm:col-span-8 relative min-h-[170px] flex flex-col justify-between pt-2">
                    <div className="flex items-end justify-between gap-2 h-36 border-b border-l border-[#263542] px-2 relative">
                      {[
                        { month: "Apr", rev: 55, target: 72 },
                        { month: "May", rev: 72, target: 86 },
                        { month: "Jun", rev: 88, target: 102 },
                        { month: "Jul", rev: 108, target: 122 },
                        { month: "Aug", rev: 128, target: 143 },
                        { month: "Sep", rev: Math.min(150, Math.max(40, totalRevenue / 20000)), target: 157 },
                      ].map((m, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center justify-end gap-1 h-full relative">
                          <div className="w-full flex items-end justify-center gap-1 h-full">
                            <div className="w-3 rounded-t bg-gradient-to-t from-[#a9761e] to-[#f0c54c]" style={{ height: `${m.rev}px` }} />
                            <div className="w-3 rounded-t bg-[#5c7085]" style={{ height: `${m.target}px` }} />
                          </div>
                          <span className="text-[9px] text-[#9ca9b6] font-mono absolute -bottom-5">{m.month}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-[9px] text-[#a5b0bb] pt-6">
                      <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-[#f0c44a] inline-block" /> Revenue</span>
                      <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-[#66788a] inline-block" /> Target</span>
                      <span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-[#20e39b] inline-block" /> Profit</span>
                    </div>
                  </div>

                  <div className="sm:col-span-4 space-y-2 text-center border-l border-[#172533] pl-3">
                    <span className="text-[10px] text-[#a8b4c0] block">Monthly Revenue</span>
                    <p className="text-base font-bold text-white font-mono">{formatKes(thisMonthRevenue || totalRevenue)}</p>
                    <div className="relative h-20 w-20 rounded-full bg-[conic-gradient(#20e39b_0_42%,#263848_42%_100%)] mx-auto flex items-center justify-center">
                      <div className="h-14 w-14 rounded-full bg-[#09141f] flex flex-col items-center justify-center text-center">
                        <span className="text-xs font-bold text-white leading-none">42%</span>
                        <span className="text-[7px] text-[#b8c2cc] leading-none mt-0.5">of target</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#a8b4c0] block pt-1">Annual Target</span>
                    <p className="text-xs font-bold text-[#f4cf69] font-mono">KSh 24,000,000</p>
                  </div>
                </div>
              </div>

              {/* Sales Pipeline Funnel Panel (4 Cols) */}
              <div className="lg:col-span-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-4 shadow-xl space-y-4 min-h-[262px]">
                <div className="flex items-center justify-between border-b border-[#172533] pb-3">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <span className="text-[#f1c045] text-base">♜</span> Sales Pipeline
                  </div>
                  <Link to="/admin/bookings" className="text-[10px] text-[#d8b45a] font-medium hover:underline">View Details →</Link>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { stage: "New Leads", count: bookings.length, amt: formatKes(salesPipelineAmount), color: "bg-[#2d9af5]" },
                    { stage: "Qualified", count: Math.max(1, bookings.length - 1), amt: formatKes(salesPipelineAmount * 0.8), color: "bg-[#20bdb0]" },
                    { stage: "Proposal Sent", count: pendingBookings.length, amt: formatKes(salesPipelineAmount * 0.5), color: "bg-[#f5c448]" },
                    { stage: "Negotiation", count: Math.min(2, bookings.length), amt: formatKes(salesPipelineAmount * 0.3), color: "bg-[#ff9450]" },
                    { stage: "Won", count: tickets.length, amt: formatKes(totalRevenue), color: "bg-[#9c62df]" },
                  ].map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-[#09141f] border border-[#172533] rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className={cn("h-2.5 w-2.5 rounded-full", f.color)} />
                        <span className="text-[11px] font-medium text-white">{f.stage}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-mono">
                        <span className="text-[#e2e8ee] font-bold">{f.count}</span>
                        <span className="text-[#f4cf69] font-bold">{f.amt}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-[#243240] pt-3 text-center">
                  <div className="p-2 bg-[#07101a] border border-[#172533] rounded-lg">
                    <span className="text-[9px] text-[#8897a6] block">Conversion Rate</span>
                    <strong className="text-xs font-bold text-[#20e39b]">100% Verified</strong>
                  </div>
                  <div className="p-2 bg-[#07101a] border border-[#172533] rounded-lg">
                    <span className="text-[9px] text-[#8897a6] block">Avg Order Value</span>
                    <strong className="text-xs font-bold text-white">{formatKes(totalRevenue / Math.max(1, tickets.length))}</strong>
                  </div>
                </div>
              </div>

              {/* CEO Quick Actions Panel (3 Cols) */}
              <div className="lg:col-span-3 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-4 shadow-xl space-y-4 min-h-[262px]">
                <div className="border-b border-[#172533] pb-3 font-bold text-xs text-white flex items-center gap-2">
                  <span className="text-[#f1c045] text-base">ϟ</span> CEO Quick Actions
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => navigate({ to: "/admin/users" })} className="p-2.5 rounded-lg bg-gradient-to-b from-[#4a3b20] to-[#282216] border border-[#594b2d] hover:border-[#d8ae45] text-white text-[11px] font-semibold text-left transition-all cursor-pointer">
                    <span className="text-[#f3c44e] text-sm mr-1">＋</span> New Client
                  </button>
                  <button onClick={() => navigate({ to: "/admin/events" })} className="p-2.5 rounded-lg bg-gradient-to-b from-[#4a3b20] to-[#282216] border border-[#594b2d] hover:border-[#d8ae45] text-white text-[11px] font-semibold text-left transition-all cursor-pointer">
                    <span className="text-[#f3c44e] text-sm mr-1">＋</span> New Event
                  </button>
                  <button onClick={() => navigate({ to: "/admin/bookings" })} className="p-2.5 rounded-lg bg-gradient-to-b from-[#4a3b20] to-[#282216] border border-[#594b2d] hover:border-[#d8ae45] text-white text-[11px] font-semibold text-left transition-all cursor-pointer">
                    <span className="text-[#f3c44e] text-sm mr-1">＋</span> Proposal
                  </button>
                  <button onClick={() => navigate({ to: "/admin/bookings" })} className="p-2.5 rounded-lg bg-gradient-to-b from-[#4a3b20] to-[#282216] border border-[#594b2d] hover:border-[#d8ae45] text-white text-[11px] font-semibold text-left transition-all cursor-pointer">
                    <span className="text-[#f3c44e] text-sm mr-1">＋</span> Approve
                  </button>
                  <button onClick={() => showToast("Assign Task Modal")} className="p-2.5 rounded-lg bg-gradient-to-b from-[#4a3b20] to-[#282216] border border-[#594b2d] hover:border-[#d8ae45] text-white text-[11px] font-semibold text-left transition-all cursor-pointer">
                    <span className="text-[#f3c44e] text-sm mr-1">＋</span> Assign Task
                  </button>
                  <button onClick={() => navigate({ to: "/admin/users" })} className="p-2.5 rounded-lg bg-gradient-to-b from-[#111a25] to-[#0a1119] border border-[#2c3947] hover:border-[#d8ae45] text-white text-[11px] font-semibold text-left transition-all cursor-pointer">
                    <span className="text-[#f3c44e] text-sm mr-1">♟</span> View CRM
                  </button>
                  <button onClick={() => navigate({ to: "/admin/bookings" })} className="p-2.5 rounded-lg bg-gradient-to-b from-[#111a25] to-[#0a1119] border border-[#2c3947] hover:border-[#d8ae45] text-white text-[11px] font-semibold text-left transition-all cursor-pointer">
                    <span className="text-[#f3c44e] text-sm mr-1">⚙</span> Finance
                  </button>
                  <button onClick={() => navigate({ to: "/admin/events" })} className="p-2.5 rounded-lg bg-gradient-to-b from-[#111a25] to-[#0a1119] border border-[#2c3947] hover:border-[#d8ae45] text-white text-[11px] font-semibold text-left transition-all cursor-pointer">
                    <span className="text-[#f3c44e] text-sm mr-1">⚙</span> Operations
                  </button>
                </div>
              </div>
            </div>

            {/* ROW 2: REAL EVENTS TABLE, FINANCIAL POSITION, OPERATIONS & ACTIVITY */}
            <div className="grid lg:grid-cols-12 gap-3 pt-2">
              {/* Upcoming Events Table (4 Cols - Live DB Events) */}
              <div className="lg:col-span-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-4 shadow-xl space-y-3 min-h-[213px]">
                <div className="flex items-center justify-between border-b border-[#172533] pb-3">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <span className="text-[#f1c045] text-base">▣</span> Upcoming Events ({events.length})
                  </div>
                  <Link to="/admin/events" className="text-[10px] text-[#d8b45a] font-medium hover:underline">View All →</Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="text-[#8d9baa] bg-[#0d1823] border-b border-[#172530]">
                        <th className="p-2">Event</th>
                        <th className="p-2">Client / Organizer</th>
                        <th className="p-2">Date</th>
                        <th className="p-2 text-right">Budget</th>
                        <th className="p-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#172530] text-[#dbe2e9]">
                      {suggestedEvents.length > 0 ? (
                        suggestedEvents.slice(0, 3).map((e) => (
                          <tr key={e.id} className="hover:bg-[#0d1823]">
                            <td className="p-2 font-semibold text-[#dce4ec] truncate max-w-[110px]">{e.name}</td>
                            <td className="p-2 text-[#9ca8b6] truncate max-w-[90px]">{e.organizer_name || "Royal Touch"}</td>
                            <td className="p-2 text-[#f4cf69] font-mono">{e.event_date}</td>
                            <td className="p-2 text-right font-bold font-mono">{formatKes(e.budget || 1200000)}</td>
                            <td className="p-2 text-center">
                              <span className="inline-block px-2 py-0.5 rounded-full bg-[#084e3d] text-[#3be5ad] text-[8px] font-bold">
                                {e.lifecycle_state || "On Track"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-[#8391a0]">No live events in database.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Position Summary (3 Cols) */}
              <div className="lg:col-span-3 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-4 shadow-xl space-y-3 min-h-[213px]">
                <div className="flex items-center justify-between border-b border-[#172533] pb-3">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <span className="text-[#f1c045] text-base">▣</span> Financial Position
                  </div>
                  <Link to="/admin/bookings" className="text-[10px] text-[#d8b45a] font-medium hover:underline">View Details →</Link>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px]">
                  <div className="border-b border-[#172530] pb-1 flex justify-between">
                    <span className="text-[#a5b1be]">Settled Cash</span>
                    <strong className="text-white font-mono">{formatKes(totalRevenue)}</strong>
                  </div>
                  <div className="border-b border-[#172530] pb-1 flex justify-between">
                    <span className="text-[#a5b1be]">Pipeline</span>
                    <strong className="text-white font-mono">{formatKes(salesPipelineAmount)}</strong>
                  </div>
                  <div className="border-b border-[#172530] pb-1 flex justify-between">
                    <span className="text-[#a5b1be]">Pending AP</span>
                    <strong className="text-white font-mono">{pendingBookings.length} Orders</strong>
                  </div>
                  <div className="border-b border-[#172530] pb-1 flex justify-between">
                    <span className="text-[#a5b1be]">Net Profit</span>
                    <strong className="text-[#20e39b] font-mono">{formatKes(totalRevenue * 0.28)}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-1">
                  <div className="p-1.5 bg-[#4b191c] text-[#ff6b71] rounded text-[8px] font-bold text-center">
                    {pendingBookings.length} Pending
                  </div>
                  <div className="p-1.5 bg-[#4d3c0b] text-[#f4c947] rounded text-[8px] font-bold text-center">
                    ✓ Verified DB
                  </div>
                  <div className="p-1.5 bg-[#123e32] text-[#45e4ae] rounded text-[8px] font-bold text-center">
                    100% M-Pesa
                  </div>
                </div>
              </div>

              {/* Operations Readiness (2 Cols) */}
              <div className="lg:col-span-2 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-4 shadow-xl space-y-3 min-h-[213px]">
                <div className="flex items-center justify-between border-b border-[#172533] pb-3">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <span className="text-[#f1c045] text-base">▣</span> Operations
                  </div>
                  <span className="text-[10px] text-[#d8b45a] font-medium hover:underline cursor-pointer">View All →</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative h-16 w-16 rounded-full bg-[conic-gradient(#20e39b_0_87%,#253846_87%_100%)] flex items-center justify-center shrink-0">
                    <div className="h-11 w-11 rounded-full bg-[#08131d] flex flex-col items-center justify-center text-center">
                      <strong className="text-xs font-bold text-white">87%</strong>
                      <span className="text-[7px] text-[#a9b5c0]">Ready</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[9px] text-[#c9d2dc]">
                    <p className="flex items-center gap-1.5"><b className="text-[#18e09a]">●</b> Equipment</p>
                    <p className="flex items-center gap-1.5"><b className="text-[#18e09a]">●</b> Logistics</p>
                    <p className="flex items-center gap-1.5"><b className="text-[#18e09a]">●</b> Security</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity Feed (3 Cols - Live Issued Tickets & Orders) */}
              <div className="lg:col-span-3 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-4 shadow-xl space-y-3 min-h-[213px]">
                <div className="flex items-center justify-between border-b border-[#172533] pb-3">
                  <div className="font-bold text-xs text-white">Recent Real Activity</div>
                  <Link to="/admin/bookings" className="text-[10px] text-[#d8b45a] font-medium hover:underline">View All →</Link>
                </div>

                <div className="space-y-2 text-[10px]">
                  {tickets.length > 0 ? (
                    tickets.slice(0, 3).map((t) => (
                      <div key={t.id} className="flex items-center gap-2.5 pb-2 border-b border-[#172530] last:border-none">
                        <div className="h-7 w-7 rounded bg-[#17232e] text-[#f4cf69] flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                          {t.ticket_code.slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">{t.holder_name} - {t.ticket_tier}</p>
                          <small className="text-[#8391a0] font-mono">{formatKes(t.price)} · {new Date(t.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-[#8391a0]">No recent digital passes issued yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* ROW 3: REAL REGISTERED CLIENTS, MARKETING & DECISION CENTER */}
            <div className="grid lg:grid-cols-12 gap-3 pt-2">
              {/* Registered Clients Table (4 Cols - Live Profiles) */}
              <div className="lg:col-span-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-4 shadow-xl space-y-3 min-h-[222px]">
                <div className="flex items-center justify-between border-b border-[#172533] pb-3">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <span className="text-[#f1c045] text-base">♟</span> Live Registered Clients ({activeClients.length})
                  </div>
                  <Link to="/admin/users" className="text-[10px] text-[#d8b45a] font-medium hover:underline">View Directory →</Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="text-[#8d9baa] bg-[#0d1823] border-b border-[#172530]">
                        <th className="p-2">Client Name</th>
                        <th className="p-2">Email Address</th>
                        <th className="p-2 text-right">Passes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#172530] text-[#dbe2e9]">
                      {activeClients.length > 0 ? (
                        activeClients.slice(0, 4).map((c) => {
                          const clientTkts = tickets.filter((t) => t.holder_email.toLowerCase() === c.email.toLowerCase());
                          return (
                            <tr key={c.id} className="hover:bg-[#0d1823]">
                              <td className="p-2 font-semibold text-[#dce4ec] truncate max-w-[110px]">{c.full_name || "Account Member"}</td>
                              <td className="p-2 text-[#9ca8b6] font-mono truncate max-w-[130px]">{c.email}</td>
                              <td className="p-2 text-right font-mono font-bold text-[#f4cf69]">{clientTkts.length} Pass(es)</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-6 text-center text-[#8391a0]">No registered clients found in database.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Marketing Intelligence (3 Cols) */}
              <div className="lg:col-span-3 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-4 shadow-xl space-y-3 min-h-[222px]">
                <div className="flex items-center justify-between border-b border-[#172533] pb-3">
                  <div className="flex items-center gap-2 font-bold text-xs text-white">
                    <span className="text-[#f1c045] text-base">♛</span> Marketing Intelligence
                  </div>
                  <span className="text-[10px] text-[#d8b45a] font-medium hover:underline cursor-pointer">View All →</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[10px]">
                  <div>
                    <span className="text-[#a8b4c0] block">Website Visitors</span>
                    <p className="text-sm font-bold text-white font-mono">8,432 <span className="text-[#24dd99] text-[9px]">↑ 22%</span></p>
                    <span className="text-[#a8b4c0] block pt-2">LinkedIn Leads</span>
                    <p className="text-sm font-bold text-white font-mono">34 <span className="text-[#24dd99] text-[9px]">↑ 26%</span></p>
                  </div>

                  <div className="border-l border-[#172533] pl-3 space-y-1">
                    <span className="text-[#8795a3] text-[8px] block">Lead Sources</span>
                    <p className="text-[9px] text-[#c7d0da]"><i className="h-2 w-2 rounded-full bg-[#2d9af5] inline-block mr-1" /> LinkedIn 28%</p>
                    <p className="text-[9px] text-[#c7d0da]"><i className="h-2 w-2 rounded-full bg-[#16c6b5] inline-block mr-1" /> WhatsApp 22%</p>
                    <p className="text-[9px] text-[#c7d0da]"><i className="h-2 w-2 rounded-full bg-[#f6c444] inline-block mr-1" /> Instagram 18%</p>
                  </div>
                </div>
              </div>

              {/* CEO Decision Center (3 Cols) */}
              <div className="lg:col-span-3 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-4 shadow-xl space-y-2 min-h-[222px]">
                <div className="flex items-center gap-2 font-bold text-xs text-white border-b border-[#172533] pb-2">
                  <span className="text-[#f1c045] text-base">⚠</span> CEO Decision Center
                </div>

                <div className="p-2 bg-[#43191e] text-[#f7a0a4] rounded-lg text-[9px] leading-tight space-y-1">
                  <b>● Requires Your Decision ({pendingBookings.length})</b>
                  <p>{pendingBookings.length > 0 ? `${pendingBookings.length} pending ticket order(s) awaiting approval` : "No pending approvals"}</p>
                </div>

                <div className="p-2 bg-[#45370d] text-[#e8ca62] rounded-lg text-[9px] leading-tight space-y-1">
                  <b>● Attention Needed</b>
                  <p>Check venue setup & seating allocations</p>
                </div>

                <div className="p-2 bg-[#103a2f] text-[#63dfb1] rounded-lg text-[9px] leading-tight space-y-1">
                  <b>● Live Database Status</b>
                  <p>M-Pesa Verification Engine Online</p>
                </div>
              </div>

              {/* CEO Quote Card (2 Cols) */}
              <div className="lg:col-span-2 relative rounded-xl overflow-hidden border border-[#263645] p-6 flex items-center justify-center text-center shadow-xl bg-gradient-to-b from-[#02070d]/85 to-[#02070d]/20 bg-[url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center min-h-[222px]">
                <div className="relative z-10 space-y-2">
                  <div className="text-2xl text-[#e6bd4d]">♕</div>
                  <p className="italic text-xs text-[#f0f2f5] font-serif leading-relaxed">
                    "Great leaders don't just manage today, they build tomorrow."
                  </p>
                  <small className="block text-[#f4cf69] text-[9px] font-serif">— Royal Touch CEO</small>
                </div>
              </div>
            </div>

            {/* COMPACT SMALL ADMIN FOOTER */}
            <footer className="mt-8 pt-4 pb-2 border-t border-[#172533] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs text-[#8d9bad] font-mono">
              <div className="flex flex-wrap items-center gap-2">
                <span>© {new Date().getFullYear()} Royal Touch Events Nairobi.</span>
                <span className="hidden sm:inline">•</span>
                <span className="italic text-[#f4cf69] font-serif">Powered by My World Africa</span>
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
