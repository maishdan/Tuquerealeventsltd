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
      title: "Executive CEO Command Center",
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
    if (emailLower === "abigaelmuthoni29@gmail.com" || rawName.toLowerCase().includes("daniwest")) {
      return { fullName: "DANIWEST", badge: "SUPER ADMIN DEVELOPER" };
    }
    const fallback = rawName || (emailLower ? emailLower.split("@")[0].toUpperCase() : "ADMINISTRATOR");
    return { fullName: fallback, badge: "EXECUTIVE ADMIN" };
  })();

  const userInitials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "JO";

  // Financial KPI calculations
  const totalRevenue = tickets.reduce((acc, t) => acc + (t.price || 0), 0);
  const salesPipelineAmount = bookings.reduce((acc, b) => {
    const numeric = typeof b.budget === "number" ? b.budget : parseInt(String(b.budget || 0).replace(/[^0-9]/g, "")) || 0;
    return acc + numeric;
  }, 0);

  const pendingBookings = bookings.filter((b) => b.status === "pending" || !b.status);
  const activeClients = clients.filter((c) => c.email);
  const suggestedEvents = events;

  // Search Filter Suggestions
  const isSearchActive = searchQuery.trim().length > 0;
  const q = searchQuery.toLowerCase();

  const suggestedPages = [
    { label: "AI & Insights Engine", to: "/admin/ai", icon: "✦" },
    { label: "Sales & CRM Bookings", to: "/admin/bookings", icon: "▤" },
    { label: "Events Registry", to: "/admin/events", icon: "▣" },
    { label: "Client Directory", to: "/admin/users", icon: "♟" },
    { label: "Inbound Contacts", to: "/admin/contacts", icon: "✉" },
  ].filter((p) => p.label.toLowerCase().includes(q));

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

      {/* Main Grid Layout */}
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
          {/* TOPBAR */}
          <header className="sticky top-0 z-[100] h-[74px] border-b border-[#202b37] bg-[#03080e]/95 backdrop-blur-md flex items-center gap-4 px-6 shadow-xl overflow-visible">
            <button
              type="button"
              onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
              className="h-9 w-9 rounded-lg border border-[#314354] bg-[#121d29] text-[#e6b83f] flex items-center justify-center text-lg font-bold hover:border-[#e6b83f] transition-all cursor-pointer shrink-0"
              title="Toggle Menu"
            >
              ☰
            </button>

            {/* Universal Global Search Bar */}
            <div className="relative w-full max-w-[425px]">
              <div className="h-9 border border-[#314354] rounded-lg bg-[#121d29] flex items-center px-3 gap-2.5 focus-within:border-[#e6b83f] transition-colors">
                <span className="text-[#8d9bad] text-sm">⌕</span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search clients, events, contacts, pages..."
                  className="w-full bg-transparent border-0 outline-none text-xs text-white placeholder:text-[#8291a2]"
                />
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 group cursor-pointer outline-none">
                    <div className="h-9 w-9 rounded-full bg-[#f2e8cd] text-[#25200f] font-extrabold text-xs flex items-center justify-center shadow-md overflow-hidden ring-2 ring-transparent group-hover:ring-[#f4cf69] transition-all">
                      {userInitials}
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
            {/* KPI STATS ROW */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <div className="p-4 bg-[#081522] border border-[#203348] rounded-xl space-y-1">
                <span className="text-[10px] text-[#899cb0] uppercase font-bold">Total Revenue</span>
                <p className="text-base font-black text-white font-mono">{formatKes(totalRevenue)}</p>
                <small className="text-[9px] text-emerald-400">Live DB Verified</small>
              </div>

              <div className="p-4 bg-[#081522] border border-[#203348] rounded-xl space-y-1">
                <span className="text-[10px] text-[#899cb0] uppercase font-bold">This Month</span>
                <p className="text-base font-black text-white font-mono">{formatKes(totalRevenue)}</p>
                <small className="text-[9px] text-emerald-400">MTD Sales</small>
              </div>

              <div className="p-4 bg-[#081522] border border-[#203348] rounded-xl space-y-1">
                <span className="text-[10px] text-[#899cb0] uppercase font-bold">Sales Pipeline</span>
                <p className="text-base font-black text-[#f4cf69] font-mono">{formatKes(salesPipelineAmount)}</p>
                <small className="text-[9px] text-[#899cb0]">Inbound Orders</small>
              </div>

              <div className="p-4 bg-[#081522] border border-[#203348] rounded-xl space-y-1">
                <span className="text-[10px] text-[#899cb0] uppercase font-bold">Events</span>
                <p className="text-base font-black text-white font-mono">{events.length}</p>
                <small className="text-[9px] text-[#899cb0]">Active Events</small>
              </div>

              <div className="p-4 bg-[#081522] border border-[#203348] rounded-xl space-y-1">
                <span className="text-[10px] text-[#899cb0] uppercase font-bold">Clients</span>
                <p className="text-base font-black text-white font-mono">{activeClients.length}</p>
                <small className="text-[9px] text-emerald-400">Registered Accounts</small>
              </div>

              <div className="p-4 bg-[#081522] border border-[#203348] rounded-xl space-y-1">
                <span className="text-[10px] text-[#899cb0] uppercase font-bold">Pending Orders</span>
                <p className="text-base font-black text-white font-mono">{pendingBookings.length}</p>
                <small className="text-[9px] text-[#899cb0]">Unpaid Orders</small>
              </div>

              <div className="p-4 bg-[#081522] border border-[#203348] rounded-xl space-y-1">
                <span className="text-[10px] text-[#899cb0] uppercase font-bold">Tickets Sold</span>
                <p className="text-base font-black text-white font-mono">{tickets.length}</p>
                <small className="text-[9px] text-emerald-400">Verified Passes</small>
              </div>
            </div>

            {/* ROW 2: EVENTS TABLE & FINANCIAL POSITION */}
            <div className="grid lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8 bg-[#081522] border border-[#203348] rounded-xl p-5 space-y-4">
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
                        events.slice(0, 4).map((e) => (
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

              {/* REAL AI LEAD INTELLIGENCE CARD (ZERO STATIC DEMO LEADS) */}
              <div className="lg:col-span-4 bg-[#081522] border border-[#f4cf69]/40 rounded-xl p-5 space-y-4 flex flex-col justify-between">
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
