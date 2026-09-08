import { createFileRoute, Link } from "@tanstack/react-router";
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
import {
  FileText,
  Ticket as TicketIcon,
  CheckCircle2,
  Clock,
  ScanLine,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  DollarSign,
  UserCheck,
  Plus,
  Loader2,
  Share2,
  Send,
  Sparkles,
  Copy,
  Receipt,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking, Ticket } from "@/lib/database.types";

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
  const { data: bookings = [], isLoading: loadingBookings } = useAdminBookings();
  const { data: tickets = [], isLoading: loadingTickets } = useAdminTickets();

  const updateBookingMutation = useUpdateBookingStatus();
  const issueTicketMutation = useIssueTicket();

  // Active Tab: Inbound Orders vs Issued Digital Passes
  const [activeTab, setActiveTab] = useState<"briefs" | "passes">(
    searchParams.tab === "passes" ? "passes" : "briefs"
  );
  const [searchQuery, setSearchQuery] = useState("");

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

  // Manual Office Sales Form State
  const [holderName, setHolderName] = useState("");
  const [holderEmail, setHolderEmail] = useState("");
  const [eventName, setEventName] = useState("Kisii University Tech & Innovation Summit 2026");
  const [ticketTier, setTicketTier] = useState<"Regular" | "VIP" | "VVIP" | "General Access">("VIP");
  const [price, setPrice] = useState(1500);

  const handleIssueTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holderName.trim() || !holderEmail.trim()) return;

    issueTicketMutation.mutate(
      {
        holder_name: holderName,
        holder_email: holderEmail,
        event_name: eventName,
        ticket_tier: ticketTier,
        price,
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

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* Header Section */}
      <div className="flex flex-wrap items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Order Intake & Pass Registry</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">
            Booked Tickets & Invoices
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="h-14 px-8 rounded-none bg-gold text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black hover:text-gold transition-all shadow-xl shadow-gold/20 cursor-pointer"
          >
            <Plus size={16} /> Issue Office Ticket
          </button>
          <button
            onClick={() => setIsScannerOpen(true)}
            className="h-14 px-8 rounded-none bg-emerald-500 text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black hover:text-emerald-400 transition-all shadow-xl shadow-emerald-500/20 cursor-pointer"
          >
            <ScanLine size={16} /> Gate Verification Scanner
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-none space-y-2">
          <div className="flex items-center justify-between text-gold">
            <FileText size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Inbound Orders</span>
          </div>
          <p className="text-3xl font-black text-foreground tracking-tight">{bookings.length}</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-none space-y-2">
          <div className="flex items-center justify-between text-emerald-500">
            <TicketIcon size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Issued Gate Passes</span>
          </div>
          <p className="text-3xl font-black text-emerald-500 tracking-tight">{tickets.length}</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-none space-y-2">
          <div className="flex items-center justify-between text-blue-500">
            <DollarSign size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Settled M-Pesa Revenue</span>
          </div>
          <p className="text-3xl font-black text-blue-500 tracking-tight">
            {formatKes(tickets.reduce((acc, t) => acc + (t.price || 0), 0))}
          </p>
        </div>
      </div>

      {/* Main Console View */}
      <GlassPanel title="Production Intake & Verification" subtitle="Switch between inbound customer orders and issued QR gate passes">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-border">
          {/* Tab Switcher */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("briefs")}
              className={cn(
                "px-6 py-3 rounded-none text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer",
                activeTab === "briefs"
                  ? "bg-gold text-black border-gold shadow-md"
                  : "bg-muted/30 border-border text-foreground hover:border-gold"
              )}
            >
              Inbound Briefs & Orders ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab("passes")}
              className={cn(
                "px-6 py-3 rounded-none text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer",
                activeTab === "passes"
                  ? "bg-gold text-black border-gold shadow-md"
                  : "bg-muted/30 border-border text-foreground hover:border-gold"
              )}
            >
              Issued Gate Passes ({tickets.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, code or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 bg-muted/30 border border-border rounded-none pl-11 pr-4 text-xs font-bold text-foreground outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* TAB 1: INBOUND ORDERS & BRIEFS WITH INVOICE DISPATCH */}
        {activeTab === "briefs" && (
          <div className="pt-6">
            {loadingBookings ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 size={36} className="text-gold animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Loading Inbound Orders...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="py-16 text-center text-xs text-muted-foreground font-bold uppercase tracking-widest">
                No inbound customer orders found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="text-[9px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
                      <th className="py-4 px-3">Order ID</th>
                      <th className="py-4 px-3">Attendee Name</th>
                      <th className="py-4 px-3">Category</th>
                      <th className="py-4 px-3 text-right">Investment</th>
                      <th className="py-4 px-3 text-center">Status</th>
                      <th className="py-4 px-3 text-right">Actions / Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-xs">
                    {filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-muted/30 transition-all">
                        <td className="py-4 px-3 font-mono font-bold text-gold">BK-{b.id.slice(0, 8)}</td>
                        <td className="py-4 px-3">
                          <p className="font-bold text-foreground">{b.name}</p>
                          <p className="text-[9px] text-muted-foreground font-mono">{b.email}</p>
                          <p className="text-[9px] text-muted-foreground font-mono">{b.phone || "+254 700 000 000"}</p>
                        </td>
                        <td className="py-4 px-3 text-muted-foreground font-medium">{b.event_type}</td>
                        <td className="py-4 px-3 text-right font-black text-foreground">{b.budget}</td>
                        <td className="py-4 px-3 text-center">
                          <EventStatusBadge status={b.status as any} />
                        </td>
                        <td className="py-4 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenInvoiceModal(b)}
                              className="h-8 px-3 bg-blue-500/10 border border-blue-500/30 text-blue-500 font-black text-[9px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Receipt size={12} /> Send Official Invoice
                            </button>

                            <button
                              onClick={() =>
                                updateBookingMutation.mutate({
                                  bookingId: b.id,
                                  status: "confirmed",
                                })
                              }
                              className="h-8 px-3 bg-gold text-black font-black text-[9px] uppercase tracking-widest hover:bg-black hover:text-gold transition-all cursor-pointer"
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

        {/* TAB 2: ISSUED DIGITAL QR GATES PASSES */}
        {activeTab === "passes" && (
          <div className="pt-6">
            {loadingTickets ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 size={36} className="text-gold animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Loading Issued Digital Passes...</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="py-16 text-center text-xs text-muted-foreground font-bold uppercase tracking-widest">
                No issued gate passes found in database.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTickets.map((t) => (
                  <div
                    key={t.id}
                    className="p-6 bg-card border border-border hover:border-gold transition-all rounded-none space-y-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono text-xs font-black text-gold">{t.ticket_code}</span>
                        <h4 className="text-sm font-black uppercase text-foreground truncate max-w-[200px] mt-0.5">
                          {t.event_name}
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 bg-gold/10 border border-gold/30 text-gold font-black text-[8px] uppercase">
                        {t.ticket_tier}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 font-medium text-slate-600 dark:text-gray-300">
                      <p><span className="text-muted-foreground font-bold">Holder:</span> {t.holder_name}</p>
                      <p><span className="text-muted-foreground font-bold">Email:</span> {t.holder_email}</p>
                      <p><span className="text-muted-foreground font-bold">Seat:</span> Seat {t.seat_number || "GA"}</p>
                      <p><span className="text-muted-foreground font-bold">Price:</span> {t.price > 0 ? formatKes(t.price) : "Paid"}</p>
                    </div>

                    <div className="pt-2 border-t border-border flex justify-between items-center">
                      <span className={cn("text-[9px] font-mono font-bold uppercase", t.status === "used" ? "text-rose-500" : "text-emerald-500")}>
                        ● {t.status === "used" ? "Checked-In" : "Valid Gate Pass"}
                      </span>

                      <button
                        onClick={() => {
                          setSelectedTicket(t);
                          setIsPassModalOpen(true);
                        }}
                        className="h-9 px-4 bg-gold text-black font-black text-[9px] uppercase tracking-widest hover:bg-black hover:text-gold transition-all cursor-pointer"
                      >
                        Download PDF Pass
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </GlassPanel>

      {/* ISSUE OFFICE TICKET MODAL */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-xl bg-card border border-gold/40 rounded-none p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gold text-black flex items-center justify-center font-black">
                  <TicketIcon size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold">Office Sales Console</p>
                  <h3 className="text-lg font-black uppercase tracking-tight text-foreground">Issue Direct Gate Pass</h3>
                </div>
              </div>
              <button
                onClick={() => setIsIssueModalOpen(false)}
                className="h-10 w-10 bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleIssueTicketSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Attendee Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Daniel Maina"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="w-full h-12 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-4 text-xs font-bold text-foreground outline-none focus:border-gold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Attendee Email *</label>
                <input
                  type="email"
                  required
                  placeholder="Ex: daniel@royaltouch.com"
                  value={holderEmail}
                  onChange={(e) => setHolderEmail(e.target.value)}
                  className="w-full h-12 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-4 text-xs font-bold text-foreground outline-none focus:border-gold"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Pass Tier</label>
                  <select
                    value={ticketTier}
                    onChange={(e) => setTicketTier(e.target.value as any)}
                    className="w-full h-12 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-4 text-xs font-bold text-foreground outline-none focus:border-gold cursor-pointer"
                  >
                    <option value="Regular">Regular Pass (KSh 500)</option>
                    <option value="VIP">VIP Pass (KSh 1,500)</option>
                    <option value="VVIP">VVIP Pass (KSh 3,000)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Price Collected (KES)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full h-12 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-4 text-xs font-bold text-foreground outline-none focus:border-gold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={issueTicketMutation.isPending}
                className="w-full h-14 bg-gold text-black font-black text-xs uppercase tracking-[0.2em] rounded-none flex items-center justify-center gap-2 hover:bg-black hover:text-gold transition-all shadow-xl cursor-pointer disabled:opacity-50 pt-2"
              >
                {issueTicketMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : "Issue Pass & Generate QR Code"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* INVOICE DISPATCH MODAL */}
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
