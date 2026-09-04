import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import { TicketPassModal } from "@/components/dashboard/TicketPassModal";
import { MpesaPaymentModal } from "@/components/booking/MpesaPaymentModal";
import { SeatPicker } from "@/components/booking/SeatPicker";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomerBookings, useCustomerTickets, useAdminEvents } from "@/hooks/use-dashboard-data";
import type { BookingStatus, EventStatus, Ticket, TicketTier } from "@/lib/database.types";
import type { InitiateMpesaInput } from "@/lib/api/payments";
import { formatKes, liveEvents } from "@/lib/dashboard-mock-data";
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
  Ticket as TicketIcon,
  QrCode,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  XCircle,
  Armchair,
  Sparkles,
  Zap,
  Check,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/_layout/bookings")({
  component: CustomerBookings,
});

function mapStatus(s: BookingStatus): EventStatus {
  if (s === "confirmed") return "confirmed";
  if (s === "planning") return "planning";
  if (s === "pending") return "inquiry";
  return "inquiry";
}

const availableEventDemos = [
  {
    id: "evt-demo-1",
    name: "Gala Night & High Production Launch",
    category: "Corporate",
    date: "2026-09-20",
    venue: "Sarit Centre Expo Hall",
    vvipPrice: 25000,
    vipPrice: 10000,
    gaPrice: 3500,
  },
  {
    id: "evt-demo-2",
    name: "Corporate Leadership Summit 2026",
    category: "Summit",
    date: "2026-10-05",
    venue: "Villa Rosa Kempinski",
    vvipPrice: 20000,
    vipPrice: 8500,
    gaPrice: 2500,
  },
  {
    id: "evt-demo-3",
    name: "Royal Sound Concert & Cultural Expo",
    category: "Concert",
    date: "2026-11-12",
    venue: "Carnivore Grounds Nairobi",
    vvipPrice: 15000,
    vipPrice: 6000,
    gaPrice: 2000,
  },
];

function CustomerBookings() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<"briefs" | "tickets">("briefs");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  // M-Pesa Modal State
  const [mpesaData, setMpesaData] = useState<InitiateMpesaInput | null>(null);
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);

  // Interactive Event Booking Wizard Modal State
  const [isBookWizardOpen, setIsBookWizardOpen] = useState(false);
  const [wizardEvent, setWizardEvent] = useState<(typeof availableEventDemos)[0] | null>(null);
  const [selectedTier, setSelectedTier] = useState<TicketTier>("VIP");
  const [selectedSeat, setSelectedSeat] = useState<string | null>("07");
  const [seatPrice, setSeatPrice] = useState<number>(10000);

  const { data: bookings = [], isLoading: bookingsLoading } = useCustomerBookings(user?.id, profile?.email);
  const { data: tickets = [], isLoading: ticketsLoading } = useCustomerTickets(user?.id, profile?.email);

  const openPassModal = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsPassModalOpen(true);
  };

  const startMpesaCheckoutForBooking = (booking: any) => {
    setMpesaData({
      booking_id: booking.id,
      phone_number: booking.phone || profile?.phone || "0712345678",
      amount: 3500,
      event_name: booking.event_type ? `${booking.event_type} - ${booking.name}` : booking.name,
      holder_name: booking.name,
      holder_email: booking.email,
      seat_number: booking.seat_number || "07",
      ticket_tier: "VIP",
      event_date: booking.event_date,
      venue: "Royal Touch Venue",
      user_id: user?.id ?? null,
    });
    setIsMpesaModalOpen(true);
  };

  const startWizardForEvent = (eventDemo: (typeof availableEventDemos)[0]) => {
    setWizardEvent(eventDemo);
    setSelectedTier("VIP");
    setSeatPrice(eventDemo.vipPrice);
    setSelectedSeat("07");
    setIsBookWizardOpen(true);
  };

  const handleTierChange = (tier: TicketTier, price: number) => {
    setSelectedTier(tier);
    setSeatPrice(price);
  };

  const handleSeatSelect = (seatNum: string, price: number) => {
    setSelectedSeat(seatNum || null);
    if (price > 0) setSeatPrice(price);
  };

  const handleWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wizardEvent) return;

    setIsBookWizardOpen(false);

    setMpesaData({
      booking_id: `bk-wiz-${Date.now()}`,
      phone_number: profile?.phone || "0712345678",
      amount: seatPrice,
      event_name: wizardEvent.name,
      holder_name: profile?.full_name || "Authorized Account",
      holder_email: profile?.email || "user@domain.com",
      seat_number: selectedSeat || "07",
      ticket_tier: selectedTier,
      event_date: wizardEvent.date,
      venue: wizardEvent.venue,
      user_id: user?.id ?? null,
    });

    setIsMpesaModalOpen(true);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Operational Registry</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">
            Bookings & Gate Passes
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/booking"
            className="h-14 px-8 rounded-none bg-gold text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-[0_10px_40px_rgba(212,175,55,0.2)] cursor-pointer"
          >
            <Plus size={16} /> New Booking Brief
          </Link>
        </div>
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
          <ClipboardList size={16} /> My Bookings
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
          <TicketIcon size={16} /> Digital QR Tickets
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
            <GlassPanel title="Booking Registry" subtitle="Track your technical proposals and confirmation states">
              {bookingsLoading ? (
                <div className="py-24 flex flex-col items-center justify-center space-y-4">
                  <Loader2 size={40} className="text-gold animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Accessing Database...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="h-20 w-20 rounded-none bg-muted flex items-center justify-center border border-border">
                    <ClipboardList size={32} className="text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-foreground uppercase tracking-tight">No active inquiries found.</p>
                    <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
                      Submit a strategic brief to initiate a new project with the Royal Touch production team.
                    </p>
                    <div className="pt-4">
                      <Link to="/booking" className="text-xs text-gold font-black uppercase tracking-widest hover:underline">
                        Start Booking Now
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-6 px-6">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                        <th className="py-6 px-4">Booking ID</th>
                        <th className="py-6 px-4">Sector / Name</th>
                        <th className="py-6 px-4">Target Date</th>
                        <th className="py-6 px-4 text-right">Investment</th>
                        <th className="py-6 px-4 text-right">Status & Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {bookings.map((b) => (
                        <tr key={b.id} className="group hover:bg-white/[0.02] transition-all">
                          <td className="py-6 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-none bg-muted flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all">
                                <FileText size={14} />
                              </div>
                              <span className="font-mono text-[11px] font-bold text-foreground tracking-widest uppercase">
                                BK-{b.id.slice(0, 8)}
                              </span>
                            </div>
                          </td>
                          <td className="py-6 px-4">
                            <p className="text-xs font-bold text-foreground opacity-90 uppercase tracking-tight">{b.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{b.event_type}</p>
                          </td>
                          <td className="py-6 px-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar size={12} />
                              <span className="text-[10px] font-bold uppercase tracking-widest">{b.event_date || "TBD"}</span>
                            </div>
                          </td>
                          <td className="py-6 px-4 text-right">
                            <span className="text-xs font-black text-foreground">{b.budget}</span>
                          </td>
                          <td className="py-6 px-4 text-right">
                            <div className="flex flex-col items-end gap-1.5">
                              <EventStatusBadge status={mapStatus(b.status)} />
                              {b.status === "pending" && (
                                <button
                                  onClick={() => startMpesaCheckoutForBooking(b)}
                                  className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black text-[9px] uppercase tracking-widest rounded-none flex items-center gap-1 hover:bg-emerald-500 hover:text-black transition-all cursor-pointer"
                                >
                                  <Smartphone size={10} /> Pay M-Pesa
                                </button>
                              )}
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

          <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="bg-card border border-border p-8 rounded-none space-y-8">
              <div className="flex items-center gap-3 text-gold">
                <Clock size={20} />
                <h4 className="text-[10px] font-black uppercase tracking-widest">Processing Time</h4>
              </div>
              <div className="space-y-4">
                <p className="text-4xl font-black text-foreground tracking-tighter">Under 24H</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium uppercase tracking-[0.1em] leading-loose">
                  All inquiries are reviewed by our senior technical producers to ensure alignment with production standards.
                </p>
              </div>
            </div>

            <div className="bg-[#2b4c8c] border border-blue-500/20 p-8 rounded-none space-y-6">
              <div className="flex items-center gap-3 text-white">
                <ShieldCheck size={20} />
                <h4 className="text-[10px] font-black uppercase tracking-widest">Executive Privacy</h4>
              </div>
              <p className="text-[11px] text-blue-100 font-medium leading-relaxed">
                Your event blueprints and financial parameters are encrypted and handled with absolute executive discretion.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ISSUED TICKETS & INTERACTIVE EVENT BOOKING SECTION */
        <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-700">
          {/* STEP-BY-STEP USER FRIENDLY GUIDE */}
          <div className="bg-card border border-border p-8 rounded-none space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold">Simple 4-Step Booking Protocol</p>
                <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">How To Book Event Gate Passes</h3>
              </div>
              <span className="px-3 py-1 bg-gold/10 border border-gold/40 text-gold text-[9px] font-black uppercase tracking-widest self-start sm:self-auto">
                Instant M-Pesa QR Pass
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Select Engagement",
                  desc: "Pick an available public event below or enter your booking brief details.",
                  icon: Calendar,
                },
                {
                  step: "02",
                  title: "Reserve Seat & Tier",
                  desc: "Choose VVIP, VIP, or General Access and pick your seat on the venue map.",
                  icon: Armchair,
                },
                {
                  step: "03",
                  title: "M-Pesa STK PIN",
                  desc: "Enter your phone number for instant automated M-Pesa PIN authorization.",
                  icon: Smartphone,
                },
                {
                  step: "04",
                  title: "Scannable QR Ticket",
                  desc: "View, print, or download your PDF gate pass with scannable security token.",
                  icon: QrCode,
                },
              ].map((s, idx) => (
                <div key={idx} className="p-6 bg-muted/40 border border-border rounded-none space-y-3 relative group hover:border-gold transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-gold">{s.step}</span>
                    <s.icon size={20} className="text-gold" />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-tight text-foreground group-hover:text-gold transition-colors">{s.title}</h4>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AVAILABLE EVENTS DECK FOR ONE-CLICK BOOKING */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold">Live Event Marketplace</p>
                <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">Select Event To Book Ticket</h3>
              </div>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                {availableEventDemos.length} Available
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {availableEventDemos.map((evt) => (
                <div
                  key={evt.id}
                  className="group relative bg-card border border-border hover:border-gold p-8 rounded-none transition-all duration-300 space-y-6 flex flex-col justify-between shadow-md"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 bg-gold/10 text-gold font-black text-[9px] uppercase tracking-widest border border-gold/30">
                        {evt.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-muted-foreground">{evt.date}</span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xl font-black uppercase tracking-tight text-foreground group-hover:text-gold transition-colors">
                        {evt.name}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <MapPin size={12} className="text-gold shrink-0" /> {evt.venue}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-black">
                      <span className="text-muted-foreground uppercase text-[9px]">Starting From</span>
                      <span className="text-gold font-mono">{formatKes(evt.gaPrice)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => startWizardForEvent(evt)}
                    className="h-12 w-full bg-gold text-black font-black text-[10px] uppercase tracking-widest rounded-none flex items-center justify-center gap-2 hover:bg-black hover:text-gold transition-all shadow-md cursor-pointer"
                  >
                    Book Ticket Pass <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* MY ISSUED DIGITAL GATE PASSES */}
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <GlassPanel title="Digital Gate Passes" subtitle="Verified event entry passes with scannable QR security">
                {ticketsLoading ? (
                  <div className="py-24 flex flex-col items-center justify-center space-y-4">
                    <Loader2 size={40} className="text-gold animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Retrieving Digital Passes...</p>
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="h-20 w-20 rounded-none bg-muted flex items-center justify-center border border-border text-muted-foreground">
                      <TicketIcon size={32} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-foreground uppercase tracking-tight">No event passes issued yet.</p>
                      <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">
                        Select an event above to book your ticket and generate an encrypted QR gate pass.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6 py-4">
                    {tickets.map((t) => (
                      <div
                        key={t.id}
                        className="group relative overflow-hidden bg-white/5 dark:bg-white/[0.02] light:bg-black/[0.02] border border-border rounded-none hover:border-gold transition-all duration-300 p-6 md:p-8 space-y-6"
                      >
                        <div className="flex flex-wrap justify-between items-start gap-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-none bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                              <TicketIcon size={22} />
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-gold uppercase tracking-widest leading-none mb-1.5">{t.ticket_code}</p>
                              <h3 className="text-xl font-bold text-foreground uppercase tracking-tight group-hover:text-gold transition-colors">{t.event_name}</h3>
                            </div>
                          </div>
                          <span
                            className={cn(
                              "px-4 py-1 rounded-none text-[9px] font-black uppercase tracking-widest border",
                              t.ticket_tier === "VVIP"
                                ? "bg-gold/20 text-gold border-gold/30"
                                : t.ticket_tier === "VIP"
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            )}
                          >
                            {t.ticket_tier} PASS
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border text-xs">
                          <div>
                            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Pass Holder</p>
                            <p className="font-bold text-foreground">{t.holder_name}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Seat Assignment</p>
                            <p className="font-bold text-gold">Seat {t.seat_number || "GA"}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Venue</p>
                            <p className="font-bold text-foreground">{t.venue || "Royal Arena"}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Gate Status</p>
                            <p className={cn("font-bold uppercase tracking-widest text-[10px]", t.status === "used" ? "text-rose-500" : "text-emerald-400")}>
                              {t.status === "used" ? "Checked-In" : "Valid Pass"}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                          <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            <QrCode size={14} className="text-gold" /> Scannable QR Token
                          </div>
                          <button
                            onClick={() => openPassModal(t)}
                            className="h-11 px-6 rounded-none bg-gold text-black font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-black hover:text-gold transition-all shadow-md cursor-pointer"
                          >
                            View & Print Gate Pass <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassPanel>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-card border border-border p-8 rounded-none space-y-6 shadow-sm">
                <div className="flex items-center gap-3 text-gold">
                  <QrCode size={20} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Gate Security Protocol</h4>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium uppercase tracking-wider leading-loose">
                  Each digital access pass features a unique cryptographic token. Bring your printed pass or open the QR code on your mobile device for VIP gate scanning.
                </p>
              </div>

              <div className="bg-[#1e2838] border border-blue-500/20 p-8 rounded-none space-y-6 shadow-xl">
                <div className="flex items-center gap-3 text-blue-400">
                  <ShieldCheck size={20} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Non-Transferable</h4>
                </div>
                <p className="text-[11px] text-blue-100 font-medium leading-relaxed">
                  Passes are linked to your registered profile email and verified upon gate arrival.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TICKET BOOKING WIZARD MODAL */}
      {isBookWizardOpen && wizardEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0d121c] border border-gold/40 rounded-none p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gold text-black flex items-center justify-center font-black">
                  <TicketIcon size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold">Ticket Booking Wizard</p>
                  <h3 className="text-lg font-black uppercase tracking-tight text-foreground">{wizardEvent.name}</h3>
                </div>
              </div>
              <button
                onClick={() => setIsBookWizardOpen(false)}
                className="h-10 w-10 bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleWizardSubmit} className="space-y-6">
              {/* Step 1: Tier Selection */}
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
                  01. Choose Pass Tier
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { tier: "VVIP" as const, price: wizardEvent.vvipPrice },
                    { tier: "VIP" as const, price: wizardEvent.vipPrice },
                    { tier: "General Access" as const, price: wizardEvent.gaPrice },
                  ].map((t) => (
                    <button
                      key={t.tier}
                      type="button"
                      onClick={() => handleTierChange(t.tier, t.price)}
                      className={cn(
                        "p-4 border rounded-none text-left space-y-1 transition-all cursor-pointer",
                        selectedTier === t.tier
                          ? "bg-gold text-black border-gold shadow-md font-black"
                          : "bg-muted/40 border-border text-foreground hover:border-gold"
                      )}
                    >
                      <p className="text-[9px] font-black uppercase tracking-widest">{t.tier}</p>
                      <p className="font-mono text-sm font-black">{formatKes(t.price)}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Interactive Seat Picker */}
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
                  02. Select Reserved Seat
                </label>
                <SeatPicker selectedSeat={selectedSeat} onSelectSeat={handleSeatSelect} />
              </div>

              {/* Summary & M-Pesa Checkout Button */}
              <div className="p-6 bg-gold/10 border border-gold/40 rounded-none flex items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Total Checkout Amount</p>
                  <p className="text-2xl font-black text-gold font-mono">{formatKes(seatPrice)}</p>
                </div>

                <button
                  type="submit"
                  className="h-12 px-8 bg-gold text-black font-black text-[10px] uppercase tracking-widest rounded-none flex items-center gap-2 hover:bg-black hover:text-gold transition-all shadow-md cursor-pointer"
                >
                  Pay M-Pesa & Issue Pass <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Pass Modal */}
      <TicketPassModal
        ticket={selectedTicket}
        isOpen={isPassModalOpen}
        onClose={() => {
          setIsPassModalOpen(false);
          setSelectedTicket(null);
        }}
      />

      {/* M-Pesa Modal */}
      <MpesaPaymentModal
        isOpen={isMpesaModalOpen}
        onClose={() => setIsMpesaModalOpen(false)}
        bookingData={mpesaData}
        onPaymentSuccess={(t) => {
          setSelectedTicket(t);
          setIsMpesaModalOpen(false);
          setIsPassModalOpen(true);
        }}
      />
    </div>
  );
}
