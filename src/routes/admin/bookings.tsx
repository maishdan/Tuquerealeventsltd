import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import { TicketPassModal } from "@/components/dashboard/TicketPassModal";
import { TicketScannerModal } from "@/components/dashboard/TicketScannerModal";
import { InvoiceModal } from "@/components/dashboard/InvoiceModal";
import {
  useAdminBookings,
  useUpdateBookingStatus,
  useAdminTickets,
  useIssueTicket,
  useUpdateTicketStatus,
  useAdminEvents,
  formatKes
} from "@/hooks/use-dashboard-data";
import { parseAndVerifyMpesaSms } from "@/lib/api/payments";
import type { BookingStatus, Ticket, TicketStatus, TicketTier, Booking } from "@/lib/database.types";
import {
  ClipboardList,
  Calendar,
  Wallet,
  ArrowRight,
  Plus,
  Search,
  Clock,
  FileText,
  ShieldCheck,
  Loader2,
  Filter,
  CheckCircle2,
  AlertCircle,
  Ticket as TicketIcon,
  Star,
  QrCode,
  X,
  UserCheck,
  Building2,
  DollarSign,
  ScanLine,
  Armchair,
  Printer,
  Download,
  Share2,
  MessageSquare,
  Cpu,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/bookings")({
  component: AdminBookings,
});

const statusOptions: BookingStatus[] = ["pending", "confirmed", "planning", "inquiry", "cancelled"];
const ticketTierOptions: TicketTier[] = ["VVIP", "VIP", "General Access", "Regular", "Early Bird", "Staff / Press"];
const ticketStatusOptions: TicketStatus[] = ["valid", "used", "cancelled"];
const paymentMethods = ["M-Pesa", "Cash", "Card", "Bank Transfer", "Other"];

function AdminBookings() {
  const [activeTab, setActiveTab] = useState<"briefs" | "tickets">("briefs");
  const [searchQuery, setSearchQuery] = useState("");
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [previewTicket, setPreviewTicket] = useState<Ticket | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Invoice Modal State for Pending Orders
  const [invoiceBooking, setInvoiceBooking] = useState<Booking | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Admin AI SMS Verification Tool
  const [adminSmsText, setAdminSmsText] = useState("");
  const [adminSmsSuccess, setAdminSmsSuccess] = useState("");

  // Office Manual Ticket Issuance State
  const [selectedEventId, setSelectedEventId] = useState("");
  const [eventName, setEventName] = useState("");
  const [holderName, setHolderName] = useState("");
  const [holderEmail, setHolderEmail] = useState("");
  const [holderPhone, setHolderPhone] = useState("");
  const [tier, setTier] = useState<TicketTier>("VIP");
  const [price, setPrice] = useState("1500");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [seatNumber, setSeatNumber] = useState("07");
  const [eventDate, setEventDate] = useState("");
  const [venue, setVenue] = useState("");
  const [associatedBookingId, setAssociatedBookingId] = useState("");

  const { data: bookings = [], isLoading: bookingsLoading } = useAdminBookings();
  const updateStatus = useUpdateBookingStatus();

  const { data: events = [] } = useAdminEvents();
  const { data: tickets = [], isLoading: ticketsLoading } = useAdminTickets();
  const issueTicketMutation = useIssueTicket();
  const updateTicketStatusMutation = useUpdateTicketStatus();

  const validTicketsCount = tickets.filter((t) => t.status === "valid").length;
  const usedTicketsCount = tickets.filter((t) => t.status === "used").length;
  const totalRevenue = tickets.reduce((acc, t) => acc + (t.price || 0), 0);

  const filteredTickets = tickets.filter(
    (t) =>
      t.ticket_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.ticket_token && t.ticket_token.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.holder_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.holder_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIssueTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !holderName || !holderEmail) return;

    issueTicketMutation.mutate(
      {
        event_name: eventName,
        holder_name: holderName,
        holder_email: holderEmail,
        ticket_tier: tier,
        price: Number(price) || 0,
        seat_number: seatNumber || "01",
        event_date: eventDate || "TBD",
        venue: venue || "Nairobi Venue",
        booking_id: associatedBookingId || null,
      },
      {
        onSuccess: (newTicket) => {
          setIsIssueModalOpen(false);
          setPreviewTicket(newTicket);
          setIsPreviewOpen(true);
          setEventName("");
          setHolderName("");
          setHolderEmail("");
          setHolderPhone("");
          setPrice("1500");
          setSeatNumber("07");
          setEventDate("");
          setVenue("");
          setAssociatedBookingId("");
        },
      }
    );
  };

  const handleAdminSmsVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminSmsText.trim()) return;

    const parsed = parseAndVerifyMpesaSms(adminSmsText, 1500);

    issueTicketMutation.mutate(
      {
        event_name: events.length > 0 ? events[0].name : "Kisii University Tech Summit 2026",
        holder_name: parsed.recipient || "Verified M-Pesa Client",
        holder_email: "client@royaltouch.com",
        ticket_tier: "VIP",
        price: parsed.amount || 1500,
        seat_number: "07",
        event_date: events.length > 0 ? events[0].event_date : "2026-09-20",
        venue: events.length > 0 ? events[0].venue : "Kisii University Main Auditorium",
      },
      {
        onSuccess: (newTicket) => {
          setAdminSmsSuccess(`✓ Payment Verified: ${parsed.receiptCode}. Pass issued for ${newTicket.holder_name}!`);
          setPreviewTicket(newTicket);
          setIsPreviewOpen(true);
          setAdminSmsText("");
        },
      }
    );
  };

  const handleSelectEventForManualIssue = (eventId: string) => {
    setSelectedEventId(eventId);
    const evt = events.find((e) => e.id === eventId);
    if (evt) {
      setEventName(evt.name);
      setEventDate(evt.event_date || "");
      setVenue(evt.venue || "");
      if (evt.ticket_classes && evt.ticket_classes.length > 0) {
        setTier(evt.ticket_classes[0].name as any);
        setPrice(String(evt.ticket_classes[0].price));
      }
    }
  };

  const autofillFromBooking = (bookingId: string) => {
    setAssociatedBookingId(bookingId);
    const b = bookings.find((bk) => bk.id === bookingId);
    if (b) {
      setEventName(b.event_type ? `${b.event_type} - ${b.name}` : b.name);
      setHolderName(b.name);
      setHolderEmail(b.email);
      setHolderPhone(b.phone || "");
      setEventDate(b.event_date || "");
    }
  };

  const openInvoiceForBooking = (b: Booking) => {
    setInvoiceBooking(b);
    setIsInvoiceOpen(true);
  };

  const getWhatsAppLink = (ticket: Ticket) => {
    const text = encodeURIComponent(
      `Hello ${ticket.holder_name},\nYour digital ticket pass for *${ticket.event_name}* is ready!\n\nTicket Code: ${ticket.ticket_code}\nTier: ${ticket.ticket_tier}\nSeat: ${ticket.seat_number || "GA"}\n\nPlease present your QR code at entrance.`
    );
    return `https://wa.me/${ticket.holder_phone || "254795365334"}?text=${text}`;
  };

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Empire Operations</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">
            Project Intake & Gate Scanner
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="h-14 px-8 rounded-none border border-gold/40 bg-gold/10 text-gold font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-gold hover:text-black transition-all shadow-lg cursor-pointer"
          >
            <ScanLine size={18} /> Launch Gate Scanner
          </button>

          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="h-14 px-8 rounded-none bg-gold text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-[0_10px_40px_rgba(212,175,55,0.2)] cursor-pointer"
          >
            <Plus size={16} /> Office Ticket Sale
          </button>
        </div>
      </div>

      {/* ADMIN AI SMS VERIFICATION CARD */}
      <div className="bg-card border border-gold/40 p-6 rounded-none space-y-4 shadow-md">
        <div className="flex items-center gap-3 text-gold">
          <Cpu size={20} />
          <h3 className="text-xs font-black uppercase tracking-[0.3em]">AI M-Pesa SMS Instant Settlement Console</h3>
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          Paste customer M-Pesa SMS confirmation text to auto-verify receipt code, match ticket amount, and instantly generate digital PDF gate pass.
        </p>

        {adminSmsSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
            {adminSmsSuccess}
          </div>
        )}

        <form onSubmit={handleAdminSmsVerification} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={adminSmsText}
            onChange={(e) => setAdminSmsText(e.target.value)}
            placeholder='Paste M-Pesa SMS e.g. "ABCDE12345 Confirmed. Ksh1,500.00 sent to ROYAL TOUCH..."'
            className="flex-1 h-12 bg-slate-50 dark:bg-black/30 border border-border px-4 text-xs font-mono font-bold text-foreground outline-none focus:border-gold"
          />
          <button
            type="submit"
            className="h-12 px-6 bg-gold text-black font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-gold transition-all cursor-pointer shrink-0"
          >
            AI Verify & Issue Pass
          </button>
        </form>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <button
          onClick={() => setActiveTab("briefs")}
          className={cn(
            "h-12 px-8 rounded-none text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all cursor-pointer",
            activeTab === "briefs"
              ? "bg-gold text-black shadow-lg shadow-gold/20"
              : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <ClipboardList size={16} /> Inbound Briefs & Invoices
          <span
            className={cn(
              "px-2 py-0.5 rounded-none text-[9px]",
              activeTab === "briefs" ? "bg-black/20 text-black font-black" : "bg-background text-muted-foreground"
            )}
          >
            {bookings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("tickets")}
          className={cn(
            "h-12 px-8 rounded-none text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all cursor-pointer",
            activeTab === "tickets"
              ? "bg-gold text-black shadow-lg shadow-gold/20"
              : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <TicketIcon size={16} /> Ticket Registry & Gate Checks
          <span
            className={cn(
              "px-2 py-0.5 rounded-none text-[9px]",
              activeTab === "tickets" ? "bg-black/20 text-black font-black" : "bg-background text-muted-foreground"
            )}
          >
            {tickets.length}
          </span>
        </button>
      </div>

      {/* Main Content */}
      {activeTab === "briefs" ? (
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <GlassPanel title="Inbound Briefs & Unpaid Pending Orders" subtitle="Registry of all strategic project requests and pending customer invoices">
              {bookingsLoading ? (
                <div className="py-24 flex flex-col items-center justify-center space-y-4">
                  <Loader2 size={40} className="text-gold animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Accessing Registry...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="h-20 w-20 rounded-none bg-muted flex items-center justify-center border border-border">
                    <ClipboardList size={32} className="text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-foreground uppercase tracking-tight">Registry clear.</p>
                    <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
                      No project briefs have been submitted for qualification at this time.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 py-4">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="group bg-white/5 dark:bg-white/[0.02] light:bg-black/[0.02] border border-border p-6 rounded-none hover:border-gold transition-all duration-300"
                    >
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-none bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-gold uppercase tracking-widest leading-none mb-1.5">
                              BK-{b.id.slice(0, 8).toUpperCase()}
                            </p>
                            <h3 className="text-xl font-bold text-foreground uppercase tracking-tight group-hover:text-gold transition-colors">
                              {b.name}
                            </h3>
                          </div>
                        </div>
                        <EventStatusBadge status={b.status as any} />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-border">
                        <div>
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Discipline</p>
                          <p className="text-xs font-bold text-foreground">{b.event_type}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Target Date</p>
                          <p className="text-xs font-bold text-foreground">{b.event_date || "TBD"}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Investment</p>
                          <p className="text-xs font-black text-emerald-500">{b.budget}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Protocol</p>
                          <select
                            value={b.status}
                            onChange={(e) => updateStatus.mutate({ id: b.id, status: e.target.value as BookingStatus })}
                            className="bg-background border border-border rounded-none px-3 py-1 text-[10px] font-black uppercase text-foreground outline-none focus:border-gold transition-all cursor-pointer"
                          >
                            {statusOptions.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                          <span className="flex items-center gap-1.5">
                            <Clock size={12} /> Received {new Date(b.created_at).toLocaleDateString()}
                          </span>
                          <span className="opacity-30">|</span>
                          <span>{b.email}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          {b.status === "pending" && (
                            <button
                              onClick={() => openInvoiceForBooking(b)}
                              className="h-10 px-4 rounded-none bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[9px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Mail size={12} /> Send Official Invoice
                            </button>
                          )}

                          <button
                            onClick={() => {
                              autofillFromBooking(b.id);
                              setActiveTab("tickets");
                              setIsIssueModalOpen(true);
                            }}
                            className="h-10 px-5 rounded-none bg-foreground text-background text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gold hover:text-black transition-all cursor-pointer"
                          >
                            Issue Gate Pass <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassPanel>
          </div>

          <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="bg-[#2b4c8c] border border-blue-500/20 p-8 rounded-none space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck size={100} className="text-white" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3 text-gold">
                  <Star size={20} className="fill-gold" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Governance Active</h4>
                </div>
                <p className="text-[11px] text-blue-100 leading-relaxed font-medium">
                  All inbound project briefs must undergo technical qualification before conversion to active production.
                </p>
              </div>
            </div>

            <div className="bg-card border border-border p-8 rounded-none space-y-6 shadow-sm">
              <h4 className="text-foreground font-black text-[10px] uppercase tracking-[0.2em]">Qualification Metrics</h4>
              <div className="space-y-4">
                {[
                  { label: "Intake Volume", val: "High", color: "text-emerald-500" },
                  { label: "Conversion Rate", val: "72%", color: "text-gold" },
                  { label: "Lead Response", val: "Instant", color: "text-emerald-500" },
                ].map((m, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{m.label}</span>
                    <span className={cn("text-[9px] font-black uppercase tracking-widest", m.color)}>{m.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ISSUED TICKETS REGISTRY TAB */
        <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          {/* Metrics KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="bg-card border border-border p-6 rounded-none space-y-2">
              <div className="flex items-center justify-between text-gold">
                <TicketIcon size={20} />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Passes Issued</span>
              </div>
              <p className="text-3xl font-black text-foreground tracking-tight">{tickets.length}</p>
            </div>

            <div className="bg-card border border-border p-6 rounded-none space-y-2">
              <div className="flex items-center justify-between text-emerald-400">
                <UserCheck size={20} />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Active Gate Ready</span>
              </div>
              <p className="text-3xl font-black text-emerald-400 tracking-tight">{validTicketsCount}</p>
            </div>

            <div className="bg-card border border-border p-6 rounded-none space-y-2">
              <div className="flex items-center justify-between text-purple-400">
                <ScanLine size={20} />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Checked-In Count</span>
              </div>
              <p className="text-3xl font-black text-purple-400 tracking-tight">{usedTicketsCount}</p>
            </div>

            <div className="bg-card border border-border p-6 rounded-none space-y-2">
              <div className="flex items-center justify-between text-gold">
                <DollarSign size={20} />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Pass Value Total</span>
              </div>
              <p className="text-3xl font-black text-gold tracking-tight">{formatKes(totalRevenue)}</p>
            </div>
          </div>

          <GlassPanel title="Issued Ticket Registry & Scans" subtitle="Global list of event passes and gate check-in status">
            {/* Search filter bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-b border-border">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search code, holder, event..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 bg-muted/60 border border-border rounded-none pl-11 pr-4 text-xs font-bold text-foreground outline-none focus:border-gold transition-all placeholder:text-muted-foreground/40"
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="h-10 px-5 rounded-none bg-gold/10 border border-gold/30 text-gold font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-gold hover:text-black transition-all cursor-pointer"
                >
                  <ScanLine size={14} /> Scan Ticket Code
                </button>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  Showing {filteredTickets.length} of {tickets.length} Passes
                </div>
              </div>
            </div>

            {ticketsLoading ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-4">
                <Loader2 size={40} className="text-gold animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Accessing Ticket Database...</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                <div className="h-20 w-20 rounded-none bg-muted flex items-center justify-center border border-border text-muted-foreground">
                  <TicketIcon size={32} />
                </div>
                <p className="text-sm font-bold text-foreground uppercase tracking-tight">No matching tickets found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6 pt-4">
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                      <th className="py-5 px-4">Serial & Token</th>
                      <th className="py-5 px-4">Event Title</th>
                      <th className="py-5 px-4">Pass Holder</th>
                      <th className="py-5 px-4">Seat</th>
                      <th className="py-5 px-4">Tier</th>
                      <th className="py-5 px-4 text-right">Price</th>
                      <th className="py-5 px-4 text-right">Gate Status</th>
                      <th className="py-5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredTickets.map((t) => (
                      <tr key={t.id} className="group hover:bg-white/[0.02] transition-all">
                        <td className="py-5 px-4">
                          <p className="font-mono text-xs font-black text-gold tracking-widest">{t.ticket_code}</p>
                          <p className="font-mono text-[9px] text-muted-foreground">{t.ticket_token || "TOKEN-GEN"}</p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="text-xs font-bold text-foreground uppercase tracking-tight truncate max-w-[180px]">
                            {t.event_name}
                          </p>
                          <p className="text-[9px] text-muted-foreground">{t.event_date || "Date TBD"}</p>
                        </td>
                        <td className="py-5 px-4">
                          <p className="text-xs font-bold text-foreground">{t.holder_name}</p>
                          <p className="text-[9px] text-muted-foreground font-mono">{t.holder_email}</p>
                        </td>
                        <td className="py-5 px-4">
                          <span className="font-mono text-xs font-black text-gold">Seat {t.seat_number || "GA"}</span>
                        </td>
                        <td className="py-5 px-4">
                          <span
                            className={cn(
                              "px-3 py-1 rounded-none text-[9px] font-black uppercase tracking-widest border",
                              t.ticket_tier === "VVIP"
                                ? "bg-gold/20 text-gold border-gold/30"
                                : t.ticket_tier === "VIP"
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            )}
                          >
                            {t.ticket_tier}
                          </span>
                        </td>
                        <td className="py-5 px-4 text-right">
                          <span className="text-xs font-bold text-foreground">{t.price > 0 ? formatKes(t.price) : "Free"}</span>
                        </td>
                        <td className="py-5 px-4 text-right">
                          <select
                            value={t.status}
                            onChange={(e) => updateTicketStatusMutation.mutate({ id: t.id, status: e.target.value as TicketStatus })}
                            className={cn(
                              "bg-background border border-border rounded-none px-3 py-1 text-[10px] font-black uppercase outline-none focus:border-gold transition-all cursor-pointer",
                              t.status === "valid" ? "text-emerald-400" : t.status === "used" ? "text-rose-500" : "text-muted-foreground"
                            )}
                          >
                            {ticketStatusOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt === "valid" ? "Gate Valid" : opt === "used" ? "Checked-In" : "Cancelled"}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={getWhatsAppLink(t)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="h-8 px-3 rounded-none bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-1"
                              title="Send via WhatsApp"
                            >
                              <MessageSquare size={12} /> WhatsApp
                            </a>
                            <button
                              onClick={() => {
                                setPreviewTicket(t);
                                setIsPreviewOpen(true);
                              }}
                              className="h-8 px-3 rounded-none bg-gold/10 border border-gold/20 text-gold text-[9px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all cursor-pointer"
                            >
                              Download PDF Pass
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassPanel>
        </div>
      )}

      {/* OFFICE MANUAL TICKET SALE MODAL */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#0d121c] border border-gold/40 rounded-none p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gold text-black flex items-center justify-center font-black">
                  <TicketIcon size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold">Office Sales Console</p>
                  <h3 className="text-lg font-black uppercase tracking-tight text-foreground">Create Manual Ticket Sale</h3>
                </div>
              </div>
              <button
                onClick={() => setIsIssueModalOpen(false)}
                className="h-10 w-10 bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleIssueTicketSubmit} className="space-y-5">
              {/* Event Selector */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Select Event *</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => handleSelectEventForManualIssue(e.target.value)}
                  className="w-full h-12 bg-slate-50 dark:bg-black/40 border border-border rounded-none px-4 text-xs font-bold text-foreground outline-none focus:border-gold cursor-pointer"
                >
                  <option value="">Select Event...</option>
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.event_date})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Event Title / Engagement *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Kisii University Tech Summit 2026"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full h-12 bg-slate-50 dark:bg-black/40 border border-border rounded-none px-4 text-xs font-bold text-foreground outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: John Kamau"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    className="w-full h-12 bg-slate-50 dark:bg-black/40 border border-border rounded-none px-4 text-xs font-bold text-foreground outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Customer Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: john@example.com"
                    value={holderEmail}
                    onChange={(e) => setHolderEmail(e.target.value)}
                    className="w-full h-12 bg-slate-50 dark:bg-black/40 border border-border rounded-none px-4 text-xs font-bold text-foreground outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Ticket Class</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as TicketTier)}
                    className="w-full h-12 bg-slate-50 dark:bg-black/40 border border-border rounded-none px-4 text-xs font-bold text-foreground outline-none focus:border-gold cursor-pointer"
                  >
                    {ticketTierOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full h-12 bg-slate-50 dark:bg-black/40 border border-border rounded-none px-4 text-xs font-bold text-foreground outline-none focus:border-gold cursor-pointer"
                  >
                    {paymentMethods.map((pm) => (
                      <option key={pm} value={pm}>
                        {pm}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Unit Price (KES)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-12 bg-slate-50 dark:bg-black/40 border border-border rounded-none px-4 text-xs font-bold text-foreground outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="h-12 px-6 rounded-none border border-border text-muted-foreground text-[10px] font-black uppercase tracking-widest hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={issueTicketMutation.isPending}
                  className="h-12 px-8 rounded-none bg-gold text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black hover:text-gold transition-all cursor-pointer disabled:opacity-50"
                >
                  {issueTicketMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : "Issue Ticket & Generate PDF"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GATE QR SCANNER MODAL */}
      <TicketScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />

      {/* Ticket Pass Preview Modal */}
      <TicketPassModal
        ticket={previewTicket}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewTicket(null);
        }}
      />

      {/* OFFICIAL INVOICE MODAL FOR UNPAID PENDING ORDERS */}
      <InvoiceModal
        booking={invoiceBooking}
        isOpen={isInvoiceOpen}
        onClose={() => {
          setIsInvoiceOpen(false);
          setInvoiceBooking(null);
        }}
      />
    </div>
  );
}
