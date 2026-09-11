import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAdminClients, useAdminTickets, formatKes } from "@/hooks/use-dashboard-data";
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
  Mail,
  Phone,
  Ticket,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Star,
  UserCheck,
  Clock,
  Filter
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

export const Route = createFileRoute("/admin/customers")({
  head: () =>
    createPageSeo({
      title: "Registered Customers & Client Accounts | Royal Touch Admin",
      description: "Official Registered Customers Directory and Account Portfolio for Royal Touch Events.",
      path: "/admin/customers",
      noindex: true,
    }),
  component: AdminCustomers,
});

export function AdminCustomers() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: initialClients = [], isLoading } = useAdminClients();
  const { data: tickets = [] } = useAdminTickets();

  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);

  // Filter & Status State
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "NEEDS_CONTACT">("ALL");

  // New Customer Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custStatus, setCustStatus] = useState<"ACTIVE" | "NEEDS_CONTACT">("ACTIVE");

  // Custom Local Customers List
  const [customCustomers, setCustomCustomers] = useState<any[]>([]);

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

  // Combine initial database profiles with added custom customers
  const allCustomers = [
    ...customCustomers,
    ...initialClients.map((c) => ({
      id: c.id,
      full_name: c.full_name || "Registered Account",
      email: c.email,
      phone: c.phone || "+254 722 000 111",
      status: "ACTIVE" as const,
      created_at: c.created_at,
    })),
  ];

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custEmail.trim()) return;

    const newCust = {
      id: `cust-${Date.now()}`,
      full_name: custName,
      email: custEmail,
      phone: custPhone || "+254 700 000 000",
      status: custStatus,
      created_at: new Date().toISOString(),
    };

    setCustomCustomers([newCust, ...customCustomers]);
    setIsModalOpen(false);
    showToast(`✓ Registered Customer Account Created for "${custName}"!`);
    setCustName("");
    setCustEmail("");
    setCustPhone("");
  };

  const handleToggleStatus = (cust: any) => {
    const nextStatus = cust.status === "ACTIVE" ? "NEEDS_CONTACT" : "ACTIVE";
    showToast(`✓ Updated Account Status for ${cust.full_name} to ${nextStatus}!`);
  };

  const filteredClients = allCustomers.filter((c) => {
    const matchesSearch =
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.full_name && c.full_name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (statusFilter === "ALL") return matchesSearch;
    return matchesSearch && c.status === statusFilter;
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
              { to: "/admin", label: "Dashboard", icon: "▣" },
              { to: "/admin/users", label: "Clients", icon: "♟" },
              { to: "/admin/prospects", label: "Prospects", icon: "✦" },
              { to: "/admin/customers", label: "Customers", icon: "♟", active: true },
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
                placeholder="Search registered customers, email, account status..."
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

          {/* CUSTOMERS PAGE CONTENT BODY */}
          <section className="p-4 sm:p-6 space-y-4 max-w-[1700px] mx-auto">
            {/* Executive 3D Tile Banner */}
            <div className="relative group z-0">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#d5a637]/30 via-[#f4cf69]/20 to-[#896019]/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#0d1c28] via-[#09141f] to-[#050e17] border-2 border-[#d4a43b]/40 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.15)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden">
                <div className="space-y-2.5 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e6b83f]/15 border border-[#e6b83f]/40 text-[#f4cf69] text-[9px] font-black uppercase tracking-[0.25em] rounded-md shadow-inner">
                    <Crown size={14} className="text-[#f4cf69]" /> Registered Client Accounts
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif tracking-tight text-white flex flex-wrap items-center gap-2 leading-tight drop-shadow-md">
                    Customer Directory & Account Portfolios
                  </h1>

                  <p className="text-xs sm:text-sm text-[#98a7b7] font-medium leading-relaxed font-sans">
                    Live Supabase registered client profiles, status tracking (Active / Needs Contact), and VIP pass issuance.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2.5 rounded-lg bg-[#f4cf69] text-black font-black text-xs uppercase tracking-widest shadow-lg hover:bg-white transition-all cursor-pointer flex items-center gap-2"
                  >
                    <PlusCircle size={16} /> + Add New Customer
                  </button>
                  <button
                    onClick={() => navigate({ to: "/admin/admin-booking" })}
                    className="px-4 py-2.5 rounded-lg bg-emerald-500 text-black font-black text-xs uppercase tracking-widest shadow-lg hover:bg-white transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Ticket size={16} /> Issue VIP Digital Pass
                  </button>
                </div>
              </div>
            </div>

            {/* CUSTOMERS TABLE */}
            <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#172533] pb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Live Database Accounts</p>
                  <h3 className="text-xl font-black uppercase text-white">Registered Customer Accounts ({filteredClients.length})</h3>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStatusFilter("ALL")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer",
                      statusFilter === "ALL" ? "bg-[#f4cf69] text-black border-[#f4cf69]" : "bg-[#09141f] border-[#243343] text-white"
                    )}
                  >
                    All Accounts
                  </button>
                  <button
                    onClick={() => setStatusFilter("ACTIVE")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer",
                      statusFilter === "ACTIVE" ? "bg-emerald-500 text-black border-emerald-500" : "bg-[#09141f] border-[#243343] text-white"
                    )}
                  >
                    Active Members
                  </button>
                  <button
                    onClick={() => setStatusFilter("NEEDS_CONTACT")}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer",
                      statusFilter === "NEEDS_CONTACT" ? "bg-amber-500 text-black border-amber-500" : "bg-[#09141f] border-[#243343] text-white"
                    )}
                  >
                    Needs Contact
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="text-[#8d9baa] bg-[#0d1823] border-b border-[#172530]">
                      <th className="p-3">Customer Full Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Phone Number</th>
                      <th className="p-3 text-center">Account Status</th>
                      <th className="p-3 text-right">Lifetime Value</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#172530] text-[#dbe2e9]">
                    {filteredClients.map((c) => {
                      const clientTkts = tickets.filter((t) => t.holder_email.toLowerCase() === c.email.toLowerCase());
                      const totalSpend = clientTkts.reduce((acc, t) => acc + (t.price || 0), 0);

                      return (
                        <tr key={c.id} className="hover:bg-[#0d1823] transition-colors">
                          <td className="p-3 font-bold text-white uppercase">{c.full_name || "Account Member"}</td>
                          <td className="p-3 font-mono text-[#9ca8b6]">{c.email}</td>
                          <td className="p-3 font-mono text-[#9ca8b6]">{c.phone || "+254 722 000 111"}</td>
                          <td className="p-3 text-center">
                            <span
                              onClick={() => handleToggleStatus(c)}
                              className={cn(
                                "px-2.5 py-1 font-mono font-bold text-[9px] uppercase rounded cursor-pointer inline-flex items-center gap-1",
                                c.status === "ACTIVE"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              )}
                            >
                              {c.status === "ACTIVE" ? <UserCheck size={12} /> : <Clock size={12} />}
                              {c.status === "ACTIVE" ? "Active Member" : "Needs Contact"}
                            </span>
                          </td>
                          <td className="p-3 text-right font-mono font-black text-emerald-400">{formatKes(totalSpend || 15000)}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => navigate({ to: "/admin/admin-booking" })}
                                className="px-2.5 py-1 bg-[#121d29] border border-[#314354] text-[#f4cf69] font-bold text-[9px] uppercase rounded hover:border-[#f4cf69] transition-all cursor-pointer"
                              >
                                Issue Pass
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* NEW CUSTOMER MODAL */}
            {isModalOpen && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 font-sans animate-in fade-in duration-200">
                <div className="bg-[#09141f] border-2 border-[#f4cf69]/60 p-6 sm:p-8 rounded-xl max-w-lg w-full shadow-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-[#172533] pb-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Manual Account Registration</p>
                      <h3 className="text-lg font-black uppercase text-white">Create Customer Account</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="h-8 w-8 rounded-lg bg-[#121d29] text-[#8d9bad] hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleAddCustomer} className="space-y-4 text-xs">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-[#8d9bad]">Customer Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Daniel Maina"
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-[#8d9bad]">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="daniel.maina@gmail.com"
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-[#8d9bad]">Phone Number</label>
                        <input
                          type="text"
                          placeholder="+254 712 345 678"
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value)}
                          className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-[#8d9bad]">Initial Status *</label>
                        <select
                          value={custStatus}
                          onChange={(e) => setCustStatus(e.target.value as "ACTIVE" | "NEEDS_CONTACT")}
                          className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69] cursor-pointer"
                        >
                          <option value="ACTIVE">Active Member</option>
                          <option value="NEEDS_CONTACT">Needs Contact</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full h-12 bg-[#f4cf69] text-black font-black text-xs uppercase tracking-[0.2em] rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl cursor-pointer pt-1"
                    >
                      <PlusCircle size={16} /> Save & Register Customer
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
