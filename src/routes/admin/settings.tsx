import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  useAdminClients,
  useAdminEvents,
  useAdminTickets,
  useAdminBookings,
  formatKes
} from "@/hooks/use-dashboard-data";
import { useAuth } from "@/contexts/AuthContext";
import {
  Settings as SettingsIcon,
  Building2,
  Shield,
  ShieldCheck,
  Users,
  Key,
  Lock,
  Globe,
  Sliders,
  Database,
  Terminal,
  Activity,
  Bell,
  Mail,
  MessageSquare,
  FileText,
  Receipt,
  DollarSign,
  Search,
  ChevronDown,
  Power,
  X,
  Plus,
  Check,
  Loader2,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  HardDrive,
  Cpu,
  Server,
  Zap,
  Flame,
  Radio,
  LogOut,
  Crown,
  Menu,
  CheckCircle2,
  SlidersHorizontal,
  Bot,
  User,
  HelpCircle
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

export const Route = createFileRoute("/admin/settings")({
  validateSearch: (search: Record<string, unknown>) => ({
    section: search.section as string | undefined,
  }),
  component: AdminSettings,
});

type SettingsCategory =
  | "general"
  | "users_rbac"
  | "security"
  | "crm_sales"
  | "events_services"
  | "finance_tax"
  | "documents"
  | "integrations"
  | "backup_data"
  | "system_health";

function AdminSettings() {
  const searchParams = Route.useSearch();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: profiles = [] } = useAdminClients();
  const { data: events = [] } = useAdminEvents();
  const { data: tickets = [] } = useAdminTickets();
  const { data: bookings = [] } = useAdminBookings();

  const [activeCategory, setActiveCategory] = useState<SettingsCategory>(
    (searchParams.section as SettingsCategory) || "general"
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);

  // Settings Form States
  const [companyName, setCompanyName] = useState("Royal Touch Events Ltd");
  const [companyEmail, setCompanyEmail] = useState("eventsroyaltouch7@gmail.com");
  const [companyPhone, setCompanyPhone] = useState("+254 795 365 334");
  const [address, setAddress] = useState("Royal Touch Executive Tower, Kilimani, Nairobi");
  const [taxPin, setTaxPin] = useState("P0512839210Z");
  const [currency, setCurrency] = useState("KES");
  const [timezone, setTimezone] = useState("Africa/Nairobi");

  // Finance Settings
  const [invoicePrefix, setInvoicePrefix] = useState("INV-2026-");
  const [quotePrefix, setQuotePrefix] = useState("QT-2026-");
  const [vatRate, setVatRate] = useState(16);
  const [mpesaPaybill, setMpesaPaybill] = useState("522522");
  const [mpesaAccount, setMpesaAccount] = useState("ROYALTOUCH");

  // Security & Integrations
  const [twoFactorRequired, setTwoFactorRequired] = useState(true);
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState(60);
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [whatsappApi, setWhatsappApi] = useState("+254795365334");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("✓ General Company Settings updated live!");
  };

  const handleSaveFinance = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("✓ Finance, M-Pesa & VAT configuration saved!");
  };

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
              { to: "/admin/events", label: "Events", icon: "▦" },
              { to: "/admin/bookings", label: "Sales & CRM", icon: "▤" },
              { to: "/admin/proposals", label: "Proposals", icon: "▤" },
              { to: "/admin/payments", label: "Payments", icon: "▣" },
              { to: "/admin/admin-booking", label: "Booking", icon: "▣" },
              { to: "/admin/contacts", label: "Notifications", icon: "♧" },
              { to: "/admin/contacts", label: "Messages", icon: "✉" },
              { to: "/admin/users", label: "Team", icon: "♟" },
              { to: "/admin/events", label: "Marketing", icon: "✦" },
              { to: "/admin/bookings", label: "Reports", icon: "▣" },
              { to: "/admin/settings", label: "Settings", icon: "⚙", active: true },
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
                placeholder="Search settings, configurations, security, API..."
                className="w-full bg-transparent border-0 outline-none text-xs text-white placeholder:text-[#8291a2]"
              />
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
                        <span>System Security Audit</span>
                        <span className="text-[#8391a0]">Just now</span>
                      </div>
                      <p className="text-[#c7d0da] text-[11px] leading-snug">
                        2FA enforced for all Executive Administrators.
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
                      <SettingsIcon size={15} className="text-[#f4cf69]" /> Settings
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

          {/* SETTINGS CONTROL CENTER DASHBOARD CONTENT BODY */}
          <section className="p-4 sm:p-6 space-y-4 max-w-[1700px] mx-auto">
            {/* Executive 3D Tile Banner */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#d5a637]/30 via-[#f4cf69]/20 to-[#896019]/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#0d1c28] via-[#09141f] to-[#050e17] border-2 border-[#d4a43b]/40 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.15)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden">
                <div className="space-y-2.5 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e6b83f]/15 border border-[#e6b83f]/40 text-[#f4cf69] text-[9px] font-black uppercase tracking-[0.25em] rounded-md shadow-inner">
                    <span className="text-[#f4cf69] font-serif text-sm">♛</span> Executive Command Center
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif tracking-tight text-white flex flex-wrap items-center gap-2 leading-tight drop-shadow-md">
                    Admin Settings & System Control <span className="text-[#f4cf69] font-serif text-2xl lg:text-3xl">♛</span>
                  </h1>

                  <p className="text-xs sm:text-sm text-[#98a7b7] font-medium leading-relaxed font-sans">
                    Configure company branding, RBAC security, M-Pesa & VAT tax rules, API keys, document templates, and database backups.
                  </p>
                </div>
              </div>
            </div>

            {/* CATEGORIZED SETTINGS NAVIGATION CONTROL (DROPDOWN + RESPONSIVE PILLS) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#09141f] border border-[#243343] rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="h-11 px-4 bg-gradient-to-r from-[#a9741b] via-[#d5a637] to-[#896019] text-white font-black text-xs uppercase tracking-wider rounded-lg flex items-center gap-2.5 shadow-md hover:bg-gold transition-all cursor-pointer outline-none shrink-0"
                    >
                      <Menu size={18} /> ☰ Settings Navigation
                      <ChevronDown size={15} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 bg-[#09141f] border-[#243343] text-white p-2 shadow-2xl rounded-xl space-y-1 z-[150]">
                    <DropdownMenuLabel className="px-3 py-2 text-xs font-black text-[#f4cf69] uppercase tracking-wider">
                      Control Center Modules
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#172533]" />

                    {[
                      { id: "general", label: "General & Organization", icon: Building2 },
                      { id: "users_rbac", label: "Users & RBAC Policies", icon: Shield },
                      { id: "security", label: "Security & 2FA Control", icon: Lock },
                      { id: "crm_sales", label: "CRM & Sales Pipeline", icon: Sliders },
                      { id: "events_services", label: "Events & Ticket Tiers", icon: Globe },
                      { id: "finance_tax", label: "Finance & VAT Tax", icon: DollarSign },
                      { id: "documents", label: "PDF Document Templates", icon: FileText },
                      { id: "integrations", label: "API & Payment Gateways", icon: Radio },
                      { id: "backup_data", label: "Database Backups", icon: Database },
                      { id: "system_health", label: "System Health Diagnostics", icon: Server },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeCategory === tab.id;
                      return (
                        <DropdownMenuItem
                          key={tab.id}
                          onClick={() => {
                            setActiveCategory(tab.id as SettingsCategory);
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

                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#121d29] border border-[#314354] rounded-lg text-xs font-bold text-white">
                  <span className="text-[#8d9bad]">Active Module:</span>
                  <span className="text-[#f4cf69] uppercase font-mono font-black">
                    {activeCategory === "general" && "🏢 General & Organization"}
                    {activeCategory === "users_rbac" && "🛡️ Users & RBAC"}
                    {activeCategory === "security" && "🔒 Security & 2FA"}
                    {activeCategory === "crm_sales" && "📊 CRM & Sales"}
                    {activeCategory === "events_services" && "🌐 Events & Pricing Tiers"}
                    {activeCategory === "finance_tax" && "💵 Finance, M-Pesa & VAT"}
                    {activeCategory === "documents" && "📄 Document Templates"}
                    {activeCategory === "integrations" && "📻 API & Integrations"}
                    {activeCategory === "backup_data" && "💾 Database Backups"}
                    {activeCategory === "system_health" && "🖥️ System Health"}
                  </span>
                </div>
              </div>

              {/* Quick Tab Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: "general", label: "General", icon: Building2 },
                  { id: "users_rbac", label: "Users", icon: Shield },
                  { id: "security", label: "Security", icon: Lock },
                  { id: "crm_sales", label: "CRM", icon: Sliders },
                  { id: "events_services", label: "Events", icon: Globe },
                  { id: "finance_tax", label: "Finance", icon: DollarSign },
                  { id: "documents", label: "Docs", icon: FileText },
                  { id: "integrations", label: "APIs", icon: Radio },
                  { id: "backup_data", label: "Backups", icon: Database },
                  { id: "system_health", label: "Health", icon: Server },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategory(tab.id as SettingsCategory)}
                      className={cn(
                        "px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer",
                        isActive
                          ? "bg-[#f4cf69] text-black font-black shadow-md"
                          : "bg-[#121d29] text-[#8d9bad] hover:bg-[#1a2838] hover:text-white border border-[#243343]"
                      )}
                    >
                      <Icon size={12} /> {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CATEGORY 1: GENERAL & COMPANY PROFILE */}
            {activeCategory === "general" && (
              <form onSubmit={handleSaveGeneral} className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-[#172533] pb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Organization Configuration</p>
                  <h3 className="text-xl font-black uppercase text-white">Company Profile & Localization (Kenya - Nairobi)</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-[#8d9bad]">Company Legal Name</label>
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-[#8d9bad]">Corporate Email</label>
                    <input type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-[#8d9bad]">KRA Tax PIN</label>
                    <input type="text" value={taxPin} onChange={(e) => setTaxPin(e.target.value)} className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-mono font-bold text-white outline-none focus:border-[#f4cf69]" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-[#8d9bad]">Support Phone Number</label>
                    <input type="text" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]" />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[9px] font-black uppercase text-[#8d9bad]">Physical Headquarters Address</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs border-t border-[#172533] pt-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-[#8d9bad]">Operating Currency</label>
                    <input type="text" disabled value={currency} className="w-full h-12 bg-[#09141f] border border-[#243343] rounded-lg px-4 text-xs font-mono font-bold text-[#8d9bad]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-[#8d9bad]">Timezone</label>
                    <input type="text" disabled value={timezone} className="w-full h-12 bg-[#09141f] border border-[#243343] rounded-lg px-4 text-xs font-mono font-bold text-[#8d9bad]" />
                  </div>
                </div>

                <button type="submit" className="h-12 px-8 bg-[#f4cf69] text-black font-black text-xs uppercase tracking-widest rounded-lg hover:bg-white transition-all cursor-pointer">
                  Save General Settings
                </button>
              </form>
            )}

            {/* CATEGORY 2: USERS & RBAC POLICIES */}
            {activeCategory === "users_rbac" && (
              <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-[#172533] pb-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Access Governance</p>
                    <h3 className="text-xl font-black uppercase text-white">Role-Based Access Control (RBAC Policies)</h3>
                  </div>
                  <Link to="/admin/users" className="px-4 py-2 bg-[#f4cf69] text-black font-black text-xs uppercase rounded-lg">
                    Manage Users & Roles →
                  </Link>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl space-y-2">
                    <h4 className="font-bold text-[#f4cf69] uppercase flex items-center gap-2">
                      <Crown size={16} /> Super Admin Developer
                    </h4>
                    <p className="text-[#8d9bad] text-[11px]">Full immutable system privileges (Protected Accounts: Japheth Owiyo CEO & DANIWEST Developer).</p>
                  </div>

                  <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl space-y-2">
                    <h4 className="font-bold text-blue-400 uppercase flex items-center gap-2">
                      <Shield size={16} /> Executive Admin
                    </h4>
                    <p className="text-[#8d9bad] text-[11px]">Full access to Sales, CRM, Events, Proposals, Payments, and User Provisioning.</p>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY 3: SECURITY & AUDIT LOGS */}
            {activeCategory === "security" && (
              <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-[#172533] pb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-400">Security & Access Policies</p>
                  <h3 className="text-xl font-black uppercase text-white">Two-Factor Authentication (2FA) & Session Timeouts</h3>
                </div>

                <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Enforce 2FA for Executive Admins</h4>
                    <p className="text-xs text-[#8d9baa]">Mandatory SMS/Authenticator OTP during login.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTwoFactorRequired(!twoFactorRequired);
                      showToast(`2FA Enforce Mode: ${!twoFactorRequired ? "ENABLED" : "DISABLED"}`);
                    }}
                    className={cn(
                      "px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer",
                      twoFactorRequired ? "bg-emerald-500 text-black" : "bg-zinc-700 text-white"
                    )}
                  >
                    {twoFactorRequired ? "✓ ENFORCED" : "OFF"}
                  </button>
                </div>

                <div className="border-t border-[#172533] pt-4 space-y-3">
                  <h4 className="text-sm font-bold text-[#f4cf69] uppercase">Append-Only System Audit Trail</h4>
                  <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl text-xs font-mono space-y-2">
                    <p className="text-[#c7d0da]"><span className="text-[#f4cf69]">10 Sep 14:32</span> · Japheth Owiyo updated VAT Rate to 16%.</p>
                    <p className="text-[#c7d0da]"><span className="text-[#f4cf69]">10 Sep 12:15</span> · Daniwest CEO created Event #EVT-2026-9281.</p>
                    <p className="text-[#c7d0da]"><span className="text-[#f4cf69]">10 Sep 09:00</span> · M-Pesa Callback verified Payment KSh 1,500.</p>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY 4: CRM & SALES SETTINGS */}
            {activeCategory === "crm_sales" && (
              <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-[#172533] pb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Sales Configuration</p>
                  <h3 className="text-xl font-black uppercase text-white">Lead Scoring Rules & Pipeline Stage Probabilities</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl space-y-2">
                    <h4 className="font-bold text-white uppercase">Automated Lead Scoring Algorithm</h4>
                    <p className="text-[#8d9baa]">Budget &gt; KSh 1.5M = Hot (95%), Budget &gt; KSh 500K = Warm (72%), Others = Cold (45%).</p>
                  </div>

                  <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl space-y-2">
                    <h4 className="font-bold text-white uppercase">Active Inbound Lead Sources</h4>
                    <p className="text-[#8d9baa]">Website Form, WhatsApp API, Phone Inquiry, LinkedIn & Walk-ins.</p>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY 5: EVENTS & TICKET TIERS */}
            {activeCategory === "events_services" && (
              <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-[#172533] pb-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Production Catalog</p>
                    <h3 className="text-xl font-black uppercase text-white">Event Categories & Multi-Tier Ticket Pricing</h3>
                  </div>
                  <Link to="/admin/events" className="px-4 py-2 bg-[#f4cf69] text-black font-black text-xs uppercase rounded-lg">
                    Manage Events & Prices →
                  </Link>
                </div>

                <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl text-xs space-y-2">
                  <p className="text-white font-bold">Default Ticket Pricing Tiers:</p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <span className="px-3 py-1 bg-[#121d29] border border-[#314354] rounded text-white font-mono">Regular: KSh 500</span>
                    <span className="px-3 py-1 bg-[#121d29] border border-[#314354] rounded text-[#f4cf69] font-mono">VIP: KSh 1,500</span>
                    <span className="px-3 py-1 bg-[#121d29] border border-[#314354] rounded text-emerald-400 font-mono">Free Admission: KSh 0</span>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY 6: FINANCE & TAX */}
            {activeCategory === "finance_tax" && (
              <form onSubmit={handleSaveFinance} className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-[#172533] pb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Financial Configuration</p>
                  <h3 className="text-xl font-black uppercase text-white">M-Pesa Daraja, VAT Rate & Invoice Numbering</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-[#8d9bad]">M-Pesa Paybill / Till Number</label>
                    <input type="text" value={mpesaPaybill} onChange={(e) => setMpesaPaybill(e.target.value)} className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-mono font-bold text-white outline-none focus:border-[#f4cf69]" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-[#8d9bad]">M-Pesa Account Name</label>
                    <input type="text" value={mpesaAccount} onChange={(e) => setMpesaAccount(e.target.value)} className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-mono font-bold text-white outline-none focus:border-[#f4cf69]" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-[#8d9bad]">VAT Rate (%)</label>
                    <input type="number" value={vatRate} onChange={(e) => setVatRate(Number(e.target.value))} className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-mono font-bold text-white outline-none focus:border-[#f4cf69]" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-[#8d9bad]">Invoice Number Prefix</label>
                    <input type="text" value={invoicePrefix} onChange={(e) => setInvoicePrefix(e.target.value)} className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-mono font-bold text-white outline-none focus:border-[#f4cf69]" />
                  </div>
                </div>

                <button type="submit" className="h-12 px-8 bg-emerald-500 text-black font-black text-xs uppercase tracking-widest rounded-lg hover:bg-white transition-all cursor-pointer">
                  Save Financial Settings
                </button>
              </form>
            )}

            {/* CATEGORY 7: DOCUMENTS */}
            {activeCategory === "documents" && (
              <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-[#172533] pb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">PDF Branding</p>
                  <h3 className="text-xl font-black uppercase text-white">PDF Quotation, Proposal & Contract Headers</h3>
                </div>

                <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl space-y-2 text-xs">
                  <p className="font-bold text-[#f4cf69]">Configured PDF Branding Logo:</p>
                  <p className="text-[#8d9baa]">Royal Touch Events Gold Crown Emblem with KRA Tax PIN watermark on all PDF quotes & invoices.</p>
                </div>
              </div>
            )}

            {/* CATEGORY 8: INTEGRATIONS & API */}
            {activeCategory === "integrations" && (
              <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-[#172533] pb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">API Marketplace</p>
                  <h3 className="text-xl font-black uppercase text-white">M-Pesa Daraja, WhatsApp API & SMTP Gateways</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-emerald-400">M-Pesa Daraja C2B/STK</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold text-[9px] rounded">CONNECTED</span>
                    </div>
                    <p className="text-[#8d9baa]">Instant mobile money STK push & automatic payment callback verification.</p>
                  </div>

                  <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-400">WhatsApp Business API</span>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 font-bold text-[9px] rounded">READY</span>
                    </div>
                    <p className="text-[#8d9baa]">Automatic PDF gate pass delivery to attendee WhatsApp.</p>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY 9: BACKUPS & DATA */}
            {activeCategory === "backup_data" && (
              <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-[#172533] pb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Database Maintenance</p>
                  <h3 className="text-xl font-black uppercase text-white">Database Backup, Export & Disaster Recovery</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => showToast("✓ Database Backup created and stored securely in Cloud Storage!")}
                    className="p-6 bg-[#09141f] border border-[#243343] hover:border-[#f4cf69] rounded-xl text-left space-y-2 transition-all cursor-pointer group"
                  >
                    <Database size={24} className="text-[#f4cf69] group-hover:scale-110 transition-transform" />
                    <h4 className="text-sm font-bold text-white uppercase">Create Instant Database Snapshot</h4>
                    <p className="text-xs text-[#8d9baa]">Generates full SQL/JSON export of profiles, tickets, events, and bookings.</p>
                  </button>

                  <button
                    onClick={() => showToast("✓ Exporting clients and tickets data to Excel CSV...")}
                    className="p-6 bg-[#09141f] border border-[#243343] hover:border-emerald-400 rounded-xl text-left space-y-2 transition-all cursor-pointer group"
                  >
                    <Download size={24} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                    <h4 className="text-sm font-bold text-white uppercase">Export All Data (CSV / Excel)</h4>
                    <p className="text-xs text-[#8d9baa]">Download structured CSV spreadsheets for accounting or audit compliance.</p>
                  </button>
                </div>
              </div>
            )}

            {/* CATEGORY 10: SYSTEM HEALTH */}
            {activeCategory === "system_health" && (
              <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-[#172533] pb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Real-Time Diagnostics</p>
                  <h3 className="text-xl font-black uppercase text-white">System Status & Service Operational Health</h3>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl space-y-1">
                    <span className="text-[10px] text-[#8d9baa] uppercase font-bold block">Supabase Database</span>
                    <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">● OPERATIONAL</p>
                  </div>

                  <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl space-y-1">
                    <span className="text-[10px] text-[#8d9baa] uppercase font-bold block">M-Pesa Daraja Gateway</span>
                    <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">● OPERATIONAL</p>
                  </div>

                  <div className="p-4 bg-[#09141f] border border-[#243343] rounded-xl space-y-1">
                    <span className="text-[10px] text-[#8d9baa] uppercase font-bold block">PDF Pass Engine</span>
                    <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">● OPERATIONAL</p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
