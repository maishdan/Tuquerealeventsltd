import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import { TicketPassModal } from "@/components/dashboard/TicketPassModal";
import { InvoiceModal } from "@/components/dashboard/InvoiceModal";
import { TicketScannerModal } from "@/components/dashboard/TicketScannerModal";
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
  Power
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

export const Route = createFileRoute("/admin/bookings")({
  validateSearch: (search: Record<string, unknown>) => ({
    action: search.action as string | undefined,
    tab: search.tab as string | undefined,
    status: search.status as string | undefined,
  }),
  component: AdminBookings,
});

function AdminBookings() {
  const searchParams = Route.useSearch();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: bookings = [], isLoading: loadingBookings } = useAdminBookings();
  const { data: tickets = [], isLoading: loadingTickets } = useAdminTickets();

  const updateBookingMutation = useUpdateBookingStatus();
  const issueTicketMutation = useIssueTicket();

  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [showLogoutConfirmModal, setShowLogoutConfirmModal] = useState(false);

  // Active Tab: Inbound Orders vs Issued Digital Passes
  const [activeTab, setActiveTab] = useState<"briefs" | "passes">(
    searchParams.tab === "passes" ? "passes" : "briefs"
  );

  // Modals State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  // Invoice Dispatch State
  const [selectedBookingForInvoice, setSelectedBookingForInvoice] = useState<Booking | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.action === "invoice" && bookings.length > 0) {
      setSelectedBookingForInvoice(bookings[0]);
      setIsInvoiceModalOpen(true);
    }
  }, [searchParams.action, bookings]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
  };

  // Manual Office Sales Form State
  const [holderName, setHolderName] = useState("");
  const [holderEmail, setHolderEmail] = useState("");
  const [eventName, setEventName] = useState("Kisii University Tech & Innovation Summit 2026");
  const [ticketTier, setTicketTier] = useState<"Regular" | "VIP" | "VVIP" | "General Access">("VIP");
  const [paymentChannel, setPaymentChannel] = useState<"M-Pesa" | "Cash (KES)" | "Bank Transfer" | "Free Pass">("M-Pesa");
  const [price, setPrice] = useState(1500);

  const handleIssueTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holderName.trim() || !holderEmail.trim()) return;

    const finalPrice = paymentChannel === "Free Pass" ? 0 : price;

    issueTicketMutation.mutate(
      {
        holder_name: holderName,
        holder_email: holderEmail,
        event_name: eventName,
        ticket_tier: `${ticketTier} [Paid via ${paymentChannel}]`,
        price: finalPrice,
        status: "valid",
        seat_number: `${Math.floor(Math.random() * 80 + 10)}`,
        event_date: "2026-09-20",
        venue: "Kisii University Main Auditorium",
      },
      {
        onSuccess: (newTkt) => {
          setIsIssueModalOpen(false);
          setHolderName("");
          setHolderEmail("");
          setSelectedTicket(newTkt);
          setIsPassModalOpen(true);
          showToast(`Digital QR Pass Issued! Payment confirmed via ${paymentChannel}`);
        },
      }
    );
  };

  const handleOpenInvoiceModal = (booking: Booking) => {
    setSelectedBookingForInvoice(booking);
    setIsInvoiceModalOpen(true);
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTickets = tickets.filter(
    (t) =>
      t.ticket_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.holder_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.holder_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.event_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              { to: "/admin/bookings", label: "Sales & CRM", icon: "▤", active: true },
              { to: "/admin/proposals", label: "Proposals", icon: "▤" },
              { to: "/admin/payments", label: "Payments", icon: "▣" },
              { to: "/admin/admin-booking", label: "Booking", icon: "▣" },
              { to: "/admin/contacts", label: "Notifications", icon: "♧" },
              { to: "/admin/contacts", label: "Messages", icon: "✉" },
              { to: "/admin/users", label: "Team", icon: "♟" },
              { to: "/admin/events", label: "Marketing", icon: "✦" },
              { to: "/admin/bookings", label: "Reports", icon: "▣" },
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
          <header className="sticky top-0 z-50 h-[74px] border-b border-[#202b37] bg-[#03080e]/95 backdrop-blur-md flex items-center gap-4 px-6 shadow-xl">
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
                placeholder="Search orders, ticket code, or attendee name..."
                className="w-full bg-transparent border-0 outline-none text-xs text-white placeholder:text-[#8291a2]"
              />
            </div>

            <div className="ml-auto flex items-center gap-4">
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
                    <Link to="/admin/events" className="flex items-center gap-3 px-3 py-2.5 text-xs font-semibold hover:bg-[#121d29] rounded-lg cursor-pointer transition-colors text-slate-200 hover:text-white">
                      <Settings size={15} className="text-[#f4cf69]" /> Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/contact" className="flex items-center gap-3 px-3 py-2.5 text-xs font-semibold hover:bg-[#121d29] rounded-lg cursor-pointer transition-colors text-slate-200 hover:text-white">
                      <Mail size={15} className="text-[#f4cf69]" /> Contact Us
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

          {/* BOOKINGS DASHBOARD CONTENT BODY */}
          <section className="p-4 sm:p-6 space-y-4 max-w-[1700px] mx-auto">
            {/* Executive 3D Tile Banner */}
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#d5a637]/30 via-[#f4cf69]/20 to-[#896019]/30 blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#0d1c28] via-[#09141f] to-[#050e17] border-2 border-[#d4a43b]/40 rounded-xl shadow-[0_12px_35px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.15)] flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden">
                <div className="space-y-2.5 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#e6b83f]/15 border border-[#e6b83f]/40 text-[#f4cf69] text-[9px] font-black uppercase tracking-[0.25em] rounded-md shadow-inner">
                    <span className="text-[#f4cf69] font-serif text-sm">♛</span> Royal Touch Sales & CRM Hub
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif tracking-tight text-white flex flex-wrap items-center gap-2 leading-tight drop-shadow-md">
                    Order Intake, Passes & Invoices <span className="text-[#f4cf69] font-serif text-2xl lg:text-3xl">♛</span>
                  </h1>

                  <p className="text-xs sm:text-sm text-[#98a7b7] font-medium leading-relaxed font-sans">
                    Process inbound customer orders, dispatch official invoices, issue gate passes, and verify M-Pesa QR payments.
                  </p>
                </div>

                {/* Quick Actions Bar embedded in Tile */}
                <div className="flex flex-wrap items-center gap-2 relative z-10 shrink-0">
                  <button
                    onClick={() => setIsIssueModalOpen(true)}
                    className="px-4 py-2.5 rounded-lg bg-[#f4cf69] text-black font-black text-xs uppercase tracking-widest shadow-lg transition-all cursor-pointer hover:bg-white flex items-center gap-2"
                  >
                    <Plus size={16} /> Issue Office Ticket
                  </button>

                  <button
                    onClick={() => setIsScannerOpen(true)}
                    className="px-4 py-2.5 rounded-lg bg-emerald-500 text-black font-black text-xs uppercase tracking-widest shadow-lg transition-all cursor-pointer hover:bg-black hover:text-emerald-400 flex items-center gap-2"
                  >
                    <ScanLine size={16} /> Gate Verification Scanner
                  </button>
                </div>
              </div>
            </div>

            {/* KPI CARDS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-2">
                <div className="flex items-center justify-between text-xs text-[#bdc8d4]">
                  <span className="font-semibold uppercase tracking-wider">Inbound Customer Orders</span>
                  <FileText size={18} className="text-[#f4cf69]" />
                </div>
                <p className="text-2xl font-black text-white font-mono">{bookings.length}</p>
                <p className="text-[10px] text-[#20e39b] font-medium">↑ Real Inbound Briefs</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-2">
                <div className="flex items-center justify-between text-xs text-[#bdc8d4]">
                  <span className="font-semibold uppercase tracking-wider">Issued Gate Passes</span>
                  <TicketIcon size={18} className="text-[#20e39b]" />
                </div>
                <p className="text-2xl font-black text-[#20e39b] font-mono">{tickets.length}</p>
                <p className="text-[10px] text-[#20e39b] font-medium">↑ Verified Digital Passes</p>
              </div>

              <div className="p-4 bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl shadow-lg space-y-2">
                <div className="flex items-center justify-between text-xs text-[#bdc8d4]">
                  <span className="font-semibold uppercase tracking-wider">Settled M-Pesa Revenue</span>
                  <DollarSign size={18} className="text-[#f4cf69]" />
                </div>
                <p className="text-2xl font-black text-[#f4cf69] font-mono">
                  {formatKes(tickets.reduce((acc, t) => acc + (t.price || 0), 0))}
                </p>
                <p className="text-[10px] text-[#20e39b] font-medium">↑ Verified DB Value</p>
              </div>
            </div>

            {/* MAIN CONSOLE VIEW */}
            <div className="bg-gradient-to-br from-[#0a141e]/98 to-[#040b12]/98 border border-[#263645] rounded-xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#172533] pb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("briefs")}
                    className={cn(
                      "px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all cursor-pointer",
                      activeTab === "briefs"
                        ? "bg-[#f4cf69] text-black border-[#f4cf69] shadow-md"
                        : "bg-[#09141f] border-[#243343] text-white hover:border-[#f4cf69]"
                    )}
                  >
                    Inbound Briefs & Orders ({bookings.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("passes")}
                    className={cn(
                      "px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all cursor-pointer",
                      activeTab === "passes"
                        ? "bg-[#f4cf69] text-black border-[#f4cf69] shadow-md"
                        : "bg-[#09141f] border-[#243343] text-white hover:border-[#f4cf69]"
                    )}
                  >
                    Issued Gate Passes ({tickets.length})
                  </button>
                </div>

                <div className="relative w-full md:w-80">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d9bad]" />
                  <input
                    type="text"
                    placeholder="Search name, email, or order ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 bg-[#09141f] border border-[#243343] rounded-lg pl-9 pr-4 text-xs text-white placeholder:text-[#8291a2] outline-none focus:border-[#f4cf69]"
                  />
                </div>
              </div>

              {activeTab === "briefs" && (
                <div className="pt-2">
                  {loadingBookings ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4">
                      <Loader2 size={36} className="text-[#f4cf69] animate-spin" />
                      <p className="text-xs font-bold uppercase tracking-widest text-[#8d9bad]">Loading Inbound Orders...</p>
                    </div>
                  ) : filteredBookings.length === 0 ? (
                    <div className="py-16 text-center text-xs text-[#8d9bad] font-bold uppercase tracking-widest">
                      No inbound customer orders found in database.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="text-[#8d9baa] bg-[#0d1823] border-b border-[#172530]">
                            <th className="p-3">Order ID</th>
                            <th className="p-3">Attendee Name</th>
                            <th className="p-3">Category</th>
                            <th className="p-3 text-right">Investment</th>
                            <th className="p-3 text-center">Status</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#172530] text-[#dbe2e9]">
                          {filteredBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-[#0d1823] transition-colors">
                              <td className="p-3 font-mono font-bold text-[#f4cf69]">BK-{b.id.slice(0, 8)}</td>
                              <td className="p-3">
                                <p className="font-bold text-white">{b.name}</p>
                                <p className="text-[10px] text-[#8d9baa] font-mono">{b.email}</p>
                              </td>
                              <td className="p-3 text-[#9ca8b6] font-medium">{b.event_type}</td>
                              <td className="p-3 text-right font-black text-white">{b.budget}</td>
                              <td className="p-3 text-center">
                                <EventStatusBadge status={b.status as any} />
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleOpenInvoiceModal(b)}
                                    className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-500 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                                  >
                                    <Receipt size={13} /> Send Official Invoice
                                  </button>

                                  <button
                                    onClick={() => {
                                      updateBookingMutation.mutate({
                                        bookingId: b.id,
                                        status: "confirmed",
                                      });
                                      showToast("Order Confirmed!");
                                    }}
                                    className="px-3 py-1.5 bg-[#f4cf69] text-black font-black text-xs uppercase rounded-lg hover:bg-white transition-all cursor-pointer"
                                  >
                                    Confirm
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "passes" && (
                <div className="pt-2">
                  {loadingTickets ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4">
                      <Loader2 size={36} className="text-[#f4cf69] animate-spin" />
                      <p className="text-xs font-bold uppercase tracking-widest text-[#8d9bad]">Loading Gate Passes...</p>
                    </div>
                  ) : filteredTickets.length === 0 ? (
                    <div className="py-16 text-center text-xs text-[#8d9bad] font-bold uppercase tracking-widest">
                      No issued gate passes found in database.
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredTickets.map((t) => (
                        <div key={t.id} className="p-5 bg-[#09141f] border border-[#243343] hover:border-[#f4cf69] rounded-xl transition-all space-y-3 shadow-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-mono text-xs font-bold text-[#f4cf69]">{t.ticket_code}</span>
                              <h4 className="text-sm font-bold uppercase text-white truncate max-w-[180px] mt-0.5">{t.event_name}</h4>
                            </div>
                            <span className="px-2 py-0.5 bg-[#f4cf69]/10 border border-[#f4cf69]/30 text-[#f4cf69] font-black text-[8px] uppercase rounded">
                              {t.ticket_tier}
                            </span>
                          </div>

                          <div className="text-xs space-y-1 text-[#9ca8b6]">
                            <p><span className="text-white font-bold">Holder:</span> {t.holder_name}</p>
                            <p><span className="text-white font-bold">Seat:</span> Seat {t.seat_number || "GA"}</p>
                            <p><span className="text-white font-bold">Price:</span> {t.price > 0 ? formatKes(t.price) : "Paid"}</p>
                          </div>

                          <div className="pt-2 border-t border-[#172533] flex justify-between items-center">
                            <span className={cn("text-[9px] font-mono font-bold uppercase", t.status === "used" ? "text-rose-400" : "text-emerald-400")}>
                              ● {t.status === "used" ? "Checked-In" : "Valid Pass"}
                            </span>

                            <button
                              onClick={() => {
                                setSelectedTicket(t);
                                setIsPassModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-[#f4cf69] text-black font-black text-xs uppercase rounded-lg hover:bg-white transition-all cursor-pointer"
                            >
                              Download PDF
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* ISSUE TICKET MODAL */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-[#09141f] border border-[#f4cf69]/40 rounded-xl p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#172533] pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#f4cf69] text-black flex items-center justify-center font-black rounded-lg">
                  <TicketIcon size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#f4cf69]">Office Sales</p>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">Issue Direct Pass</h3>
                </div>
              </div>
              <button
                onClick={() => setIsIssueModalOpen(false)}
                className="h-10 w-10 bg-[#121d29] border border-[#314354] flex items-center justify-center text-[#8d9bad] hover:text-white cursor-pointer rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleIssueTicketSubmit} className="space-y-4 text-xs font-sans">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Attendee Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Daniel Maina"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Attendee Email *</label>
                <input
                  type="email"
                  required
                  placeholder="Ex: daniel@royaltouch.com"
                  value={holderEmail}
                  onChange={(e) => setHolderEmail(e.target.value)}
                  className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#f4cf69]">
                  Payment Verification & Channel *
                </label>
                <select
                  value={paymentChannel}
                  onChange={(e) => setPaymentChannel(e.target.value as any)}
                  className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69] cursor-pointer"
                >
                  <option value="M-Pesa">Paid via M-Pesa Mobile Money (KSh)</option>
                  <option value="Cash (KES)">Paid via Cash in KES</option>
                  <option value="Bank Transfer">Paid via Bank Wire Transfer</option>
                  <option value="Free Pass">Complimentary / Free Entry Pass</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Pass Tier</label>
                  <select
                    value={ticketTier}
                    onChange={(e) => setTicketTier(e.target.value as any)}
                    className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69] cursor-pointer"
                  >
                    <option value="Regular">Regular Pass (KSh 500)</option>
                    <option value="VIP">VIP Pass (KSh 1,500)</option>
                    <option value="VVIP">VVIP Pass (KSh 3,000)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#8d9bad]">Price Collected (KES)</label>
                  <input
                    type="number"
                    disabled={paymentChannel === "Free Pass"}
                    value={paymentChannel === "Free Pass" ? 0 : price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full h-12 bg-[#121d29] border border-[#314354] rounded-lg px-4 text-xs font-bold text-white outline-none focus:border-[#f4cf69] disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={issueTicketMutation.isPending}
                className="w-full h-14 bg-[#f4cf69] text-black font-black text-xs uppercase tracking-[0.2em] rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl cursor-pointer pt-1"
              >
                {issueTicketMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : "Issue Pass & Generate QR Code"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* INVOICE MODAL */}
      <InvoiceModal
        booking={selectedBookingForInvoice}
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          setSelectedBookingForInvoice(null);
        }}
      />

      {/* GATE SCANNER MODAL */}
      <TicketScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />

      {/* TICKET PASS MODAL (PDF VIEW) */}
      <TicketPassModal
        ticket={selectedTicket}
        isOpen={isPassModalOpen}
        onClose={() => {
          setIsPassModalOpen(false);
          setSelectedTicket(null);
        }}
      />
    </div>
  );
}
