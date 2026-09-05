import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarDays,
  MessageSquare,
  PartyPopper,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Star,
  Clock,
  Heart,
  Trophy,
  Globe,
  User,
  Shield,
  LogOut,
  Power,
  Plus,
  Ticket as TicketIcon,
  DollarSign,
  UserCheck,
  ScanLine,
  X,
  Trash2,
  CheckCircle2,
  Loader2,
  Calendar,
  MapPin,
  FileText,
  TrendingUp,
  Activity,
  BarChart3,
  Users,
  Cpu,
  Layers,
  Check
} from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import { TicketPassModal } from "@/components/dashboard/TicketPassModal";
import { TicketScannerModal } from "@/components/dashboard/TicketScannerModal";
import { useAuth } from "@/contexts/AuthContext";
import {
  useAdminBookings,
  useAdminEvents,
  useAdminContacts,
  useAdminTickets,
  useAdminClients,
  useCreateEvent,
  formatKes
} from "@/hooks/use-dashboard-data";
import type { BookingStatus, EventStatus, TicketClass, EventLifecycleState, Ticket } from "@/lib/database.types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

export function AdminOverview() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: events = [], isLoading: eventsLoading } = useAdminEvents();
  const { data: bookings = [], isLoading: bookingsLoading } = useAdminBookings();
  const { data: tickets = [], isLoading: ticketsLoading } = useAdminTickets();
  const { data: profiles = [], isLoading: profilesLoading } = useAdminClients();
  const createEventMutation = useCreateEvent();

  // Modal & Preview State
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [previewTicket, setPreviewTicket] = useState<Ticket | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Quick Event & Ticket Pricing Wizard State
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("Technology");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("2026-09-20");
  const [startTime, setStartTime] = useState("08:00 AM");
  const [endTime, setEndTime] = useState("06:00 PM");
  const [venue, setVenue] = useState("Kisii University Main Auditorium");
  const [organizerName, setOrganizerName] = useState("Royal Touch Events");
  const [lifecycleState, setLifecycleState] = useState<EventLifecycleState>("PUBLISHED");

  const [ticketClasses, setTicketClasses] = useState<TicketClass[]>([
    {
      id: "tc-1",
      name: "Regular",
      description: "General admission entry pass",
      price: 500,
      quantity_available: 500,
      quantity_sold: 0,
      benefits: ["General Entrance", "Main Auditorium Seating"],
    },
    {
      id: "tc-2",
      name: "VIP",
      description: "VIP fast-track entrance & VIP seating",
      price: 1500,
      quantity_available: 100,
      quantity_sold: 0,
      benefits: ["Priority Fast-Track Entry", "VIP Reserved Seating", "Swag Bag"],
    },
    {
      id: "tc-3",
      name: "VVIP",
      description: "Front-row seating & private lounge",
      price: 3000,
      quantity_available: 30,
      quantity_sold: 0,
      benefits: ["Front-Row Recliners", "VVIP Executive Lounge", "Meals & Certificate"],
    },
  ]);

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const addTicketClass = () => {
    setTicketClasses((prev) => [
      ...prev,
      {
        id: `tc-${Date.now()}`,
        name: "Custom Class",
        description: "Custom ticket class description",
        price: 1000,
        quantity_available: 100,
        quantity_sold: 0,
        benefits: ["General Entrance"],
      },
    ]);
  };

  const removeTicketClass = (id: string) => {
    setTicketClasses((prev) => prev.filter((tc) => tc.id !== id));
  };

  const updateTicketClass = (id: string, field: keyof TicketClass, value: any) => {
    setTicketClasses((prev) =>
      prev.map((tc) => {
        if (tc.id === id) {
          if (field === "benefits" && typeof value === "string") {
            return { ...tc, benefits: value.split(",").map((b) => b.trim()) };
          }
          return { ...tc, [field]: value };
        }
        return tc;
      })
    );
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim()) return;

    createEventMutation.mutate(
      {
        name: eventName,
        event_type: eventType,
        description,
        organizer_name: organizerName,
        event_date: eventDate,
        start_time: startTime,
        end_time: endTime,
        venue,
        lifecycle_state: lifecycleState,
        ticket_classes: ticketClasses,
        status: "upcoming",
        budget: ticketClasses.reduce((acc, tc) => acc + tc.price * tc.quantity_available, 0),
      },
      {
        onSuccess: () => {
          setIsCreateEventOpen(false);
          setEventName("");
          setDescription("");
        },
      }
    );
  };

  // 100% REAL COMPUTED DATABASE METRICS
  const totalRevenue = tickets.reduce((acc, t) => acc + (t.price || 0), 0);
  const validTicketsCount = tickets.filter((t) => t.status === "valid").length;
  const registeredClientsCount = profiles.filter((p) => p.role === "customer" || !p.role).length;

  const regularTicketsCount = tickets.filter((t) => t.ticket_tier === "Regular" || t.ticket_tier === "General Access").length;
  const vipTicketsCount = tickets.filter((t) => t.ticket_tier === "VIP").length;
  const vvipTicketsCount = tickets.filter((t) => t.ticket_tier === "VVIP").length;

  return (
    <div className="space-y-8 pb-20 font-sans text-foreground">
      {/* 1. MODERN WHITE SAAS EXECUTIVE BANNER */}
      <div className="bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 p-8 rounded-none shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 bg-gold text-black flex items-center justify-center shrink-0 font-black shadow-md">
            <User size={32} />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              SaaS Live Database Online
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white">
              Welcome, {profile?.full_name?.split(" ")[0] || "Administrator"}
            </h1>
            <p className="text-xs text-slate-600 dark:text-gray-300 font-medium leading-relaxed">
              Real-time database analytics for public events, multi-tier ticket sales, customer invoices, and gate scanner logs.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setIsCreateEventOpen(true)}
            className="h-12 px-6 bg-gold text-black font-black text-[10px] uppercase tracking-widest rounded-none flex items-center gap-2 hover:bg-black hover:text-gold transition-all shadow-md cursor-pointer"
          >
            <Plus size={16} /> + Create Event & Set Prices
          </button>
          <button
            onClick={() => setIsScannerOpen(true)}
            className="h-12 px-6 bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-foreground font-black text-[10px] uppercase tracking-widest rounded-none flex items-center gap-2 hover:border-gold transition-all cursor-pointer"
          >
            <ScanLine size={16} /> Gate Scanner
          </button>
        </div>
      </div>

      {/* 2. TOP SAAS KPI STAT CARDS ROW (100% REAL DATABASE DATA) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 p-6 rounded-none shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Total Ticket Revenue</span>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-[8px] uppercase">
              Live DB
            </span>
          </div>
          <p className="text-3xl font-black text-gold font-mono">{formatKes(totalRevenue)}</p>
          <p className="text-[10px] text-muted-foreground font-bold uppercase">M-Pesa Verified Value</p>
        </div>

        <Link
          to="/admin/events"
          className="group bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 hover:border-gold p-6 rounded-none transition-all shadow-sm space-y-3"
        >
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Active Events</span>
            <span className="px-2 py-0.5 bg-gold/10 text-gold font-black text-[8px] uppercase">
              {events.length} Live
            </span>
          </div>
          <p className="text-3xl font-black text-foreground font-mono">{events.length}</p>
          <p className="text-[10px] text-muted-foreground font-bold uppercase">Configure Prices & Classes →</p>
        </Link>

        <Link
          to="/admin/bookings"
          className="group bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 hover:border-gold p-6 rounded-none transition-all shadow-sm space-y-3"
        >
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Issued Gate Tickets</span>
            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 font-black text-[8px] uppercase">
              {validTicketsCount} Valid
            </span>
          </div>
          <p className="text-3xl font-black text-blue-500 font-mono">{tickets.length}</p>
          <p className="text-[10px] text-muted-foreground font-bold uppercase">View All Digital Passes →</p>
        </Link>

        <Link
          to="/admin/users"
          className="group bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 hover:border-gold p-6 rounded-none transition-all shadow-sm space-y-3"
        >
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Registered Clients</span>
            <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 font-black text-[8px] uppercase">
              Database
            </span>
          </div>
          <p className="text-3xl font-black text-purple-500 font-mono">{registeredClientsCount}</p>
          <p className="text-[10px] text-muted-foreground font-bold uppercase">View Client Directory →</p>
        </Link>
      </div>

      {/* 3. DATA VISUALIZATION & CAPACITY GAUGES GRID */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Ticket Volume & Revenue Analytics Progress Bars (Left 8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 p-8 rounded-none shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-border pb-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold">SaaS Ticket Class Performance</p>
                <h2 className="text-xl font-black uppercase text-foreground">Real Ticket Class Distribution</h2>
              </div>
              <BarChart3 size={20} className="text-gold" />
            </div>

            <div className="space-y-6">
              {[
                { class: "Regular Class Passes", count: regularTicketsCount, total: Math.max(1, tickets.length), color: "bg-emerald-500" },
                { class: "VIP Reserved Seats", count: vipTicketsCount, total: Math.max(1, tickets.length), color: "bg-blue-500" },
                { class: "VVIP Executive Boxes", count: vvipTicketsCount, total: Math.max(1, tickets.length), color: "bg-gold" },
              ].map((item, i) => {
                const percent = Math.min(100, Math.round((item.count / item.total) * 100));
                return (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-foreground uppercase">{item.class}</span>
                      <span className="font-mono text-muted-foreground">{item.count} Issued ({percent}%)</span>
                    </div>
                    <div className="w-full h-3 bg-muted border border-border rounded-none overflow-hidden">
                      <div className={cn("h-full transition-all duration-500", item.color)} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Booked Tickets Recent Intake Table */}
          <GlassPanel title="Recent Booked Tickets & Inquiries" subtitle="Customer orders with payment verification and seat assignments">
            {bookingsLoading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 size={36} className="text-gold animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Accessing Database...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-xs uppercase tracking-widest">
                No active bookings in database.
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="text-[9px] font-black uppercase tracking-widest text-muted-foreground border-b border-border">
                      <th className="py-4 px-3">Order ID</th>
                      <th className="py-4 px-3">Attendee</th>
                      <th className="py-4 px-3">Discipline</th>
                      <th className="py-4 px-3 text-right">Investment</th>
                      <th className="py-4 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-xs">
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-muted/30 transition-all">
                        <td className="py-4 px-3 font-mono font-bold text-gold">BK-{b.id.slice(0, 8)}</td>
                        <td className="py-4 px-3">
                          <p className="font-bold text-foreground">{b.name}</p>
                          <p className="text-[9px] text-muted-foreground font-mono">{b.email}</p>
                        </td>
                        <td className="py-4 px-3 text-muted-foreground font-medium">{b.event_type}</td>
                        <td className="py-4 px-3 text-right font-black text-foreground">{b.budget}</td>
                        <td className="py-4 px-3 text-right">
                          <EventStatusBadge status={b.status as any} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassPanel>
        </div>

        {/* Live Marketplace & AI Verification Console (Right 4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 p-6 rounded-none space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold">Active Marketplace</p>
                <h3 className="text-lg font-black uppercase text-foreground">Configured Events</h3>
              </div>
              <Link to="/admin/events" className="text-[10px] text-gold font-black uppercase tracking-widest hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-4">
              {events.slice(0, 3).map((evt) => (
                <div key={evt.id} className="p-4 bg-slate-50 dark:bg-black/30 border border-border rounded-none space-y-2">
                  <span className="px-2 py-0.5 bg-gold/10 border border-gold/30 text-gold text-[8px] font-black uppercase tracking-widest">
                    {evt.event_type}
                  </span>
                  <h4 className="text-xs font-black uppercase text-foreground truncate">{evt.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{evt.event_date} · {evt.venue}</p>

                  <div className="pt-2 border-t border-border/50 text-[9px] font-mono text-muted-foreground flex justify-between">
                    <span>{evt.ticket_classes?.length || 0} Classes Set</span>
                    <span className="text-gold font-bold">Starts {formatKes(evt.ticket_classes?.[0]?.price || 500)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. RECENT ISSUED DIGITAL QR TICKETS */}
      <GlassPanel title="Issued Gate Passes Registry" subtitle="Verified digital QR tickets with instant pass view and WhatsApp share links">
        <div className="flex justify-between items-center py-3 border-b border-border">
          <p className="text-[10px] font-black uppercase tracking-widest text-gold">Recent Digital Passes ({tickets.length})</p>
          <Link to="/admin/bookings" className="text-[10px] font-black text-gold uppercase tracking-widest hover:underline">
            Manage All Tickets →
          </Link>
        </div>

        {ticketsLoading ? (
          <div className="py-16 text-center text-muted-foreground text-xs uppercase tracking-widest">
            Loading Tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-xs uppercase tracking-widest">
            No digital passes issued yet in database.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {tickets.slice(0, 6).map((t) => (
              <div
                key={t.id}
                className="group p-5 bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 hover:border-gold transition-all rounded-none space-y-4 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-black text-gold">{t.ticket_code}</span>
                    <h4 className="text-sm font-black uppercase text-foreground truncate max-w-[200px] mt-0.5">{t.event_name}</h4>
                  </div>
                  <span className="px-2 py-0.5 bg-gold/10 border border-gold/30 text-gold font-black text-[8px] uppercase">
                    {t.ticket_tier}
                  </span>
                </div>

                <div className="text-xs space-y-1 font-medium text-slate-600 dark:text-gray-300">
                  <p><span className="text-muted-foreground font-bold">Holder:</span> {t.holder_name}</p>
                  <p><span className="text-muted-foreground font-bold">Seat:</span> Seat {t.seat_number || "GA"}</p>
                  <p><span className="text-muted-foreground font-bold">Price:</span> {t.price > 0 ? formatKes(t.price) : "Paid"}</p>
                </div>

                <div className="pt-2 border-t border-border flex justify-between items-center">
                  <span className={cn("text-[9px] font-mono font-bold uppercase", t.status === "used" ? "text-rose-500" : "text-emerald-500")}>
                    ● {t.status === "used" ? "Checked-In" : "Valid Pass"}
                  </span>

                  <button
                    onClick={() => {
                      setPreviewTicket(t);
                      setIsPreviewOpen(true);
                    }}
                    className="h-8 px-3 bg-gold text-black font-black text-[9px] uppercase tracking-widest hover:bg-black hover:text-gold transition-all cursor-pointer"
                  >
                    View PDF Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>

      {/* CREATE EVENT & TICKET CLASSES WIZARD MODAL */}
      {isCreateEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#0d121c] border border-gold/40 rounded-none p-8 space-y-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gold text-black flex items-center justify-center font-black">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold">Admin Creation Console</p>
                  <h3 className="text-lg font-black uppercase tracking-tight text-foreground">Create Event & Set Class Prices</h3>
                </div>
              </div>
              <button
                onClick={() => setIsCreateEventOpen(false)}
                className="h-10 w-10 bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-8">
              {/* SECTION A: BASIC EVENT INFO */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold border-b border-border pb-2">
                  SECTION A: BASIC EVENT & ORGANIZER INFO
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Event Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Kisii University Tech & Innovation Summit 2026"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      className="w-full h-12 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-4 text-xs font-bold text-foreground outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Category</label>
                    <input
                      type="text"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full h-12 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-4 text-xs font-bold text-foreground outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Organizer Name</label>
                    <input
                      type="text"
                      value={organizerName}
                      onChange={(e) => setOrganizerName(e.target.value)}
                      className="w-full h-12 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-4 text-xs font-bold text-foreground outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Description</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detailed event synopsis for public listing and tickets..."
                      className="w-full bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none p-4 text-xs font-bold text-foreground outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: DATE, TIME & VENUE */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold border-b border-border pb-2">
                  SECTION B: DATE, TIME & VENUE
                </p>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Event Date</label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full h-12 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-4 text-xs font-bold text-foreground outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Start Time</label>
                    <input
                      type="text"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full h-12 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-4 text-xs font-bold text-foreground outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">End Time</label>
                    <input
                      type="text"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full h-12 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-4 text-xs font-bold text-foreground outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-3">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Venue Location</label>
                    <input
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      className="w-full h-12 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-4 text-xs font-bold text-foreground outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: SET TICKET PRICES FOR DIFFERENT CLASSES */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">
                    SECTION C: SET TICKET PRICES FOR DIFFERENT CLASSES
                  </p>
                  <button
                    type="button"
                    onClick={addTicketClass}
                    className="px-3 py-1.5 bg-gold/10 border border-gold/40 text-gold text-[9px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all cursor-pointer"
                  >
                    + Add Ticket Class
                  </button>
                </div>

                <div className="space-y-4">
                  {ticketClasses.map((tc, idx) => (
                    <div key={tc.id} className="p-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none space-y-3 relative">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gold">Class #{idx + 1}</span>
                        {ticketClasses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTicketClass(tc.id)}
                            className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[8px] font-black uppercase text-muted-foreground block mb-1">Class Name</label>
                          <input
                            type="text"
                            value={tc.name}
                            onChange={(e) => updateTicketClass(tc.id, "name", e.target.value)}
                            className="w-full h-10 bg-white dark:bg-black/40 border border-border rounded-none px-3 text-xs font-bold text-foreground"
                          />
                        </div>

                        <div>
                          <label className="text-[8px] font-black uppercase text-muted-foreground block mb-1">Ticket Price (KES)</label>
                          <input
                            type="number"
                            value={tc.price}
                            onChange={(e) => updateTicketClass(tc.id, "price", Number(e.target.value))}
                            className="w-full h-10 bg-white dark:bg-black/40 border border-border rounded-none px-3 text-xs font-bold text-foreground"
                          />
                        </div>

                        <div>
                          <label className="text-[8px] font-black uppercase text-muted-foreground block mb-1">Quantity Available</label>
                          <input
                            type="number"
                            value={tc.quantity_available}
                            onChange={(e) => updateTicketClass(tc.id, "quantity_available", Number(e.target.value))}
                            className="w-full h-10 bg-white dark:bg-black/40 border border-border rounded-none px-3 text-xs font-bold text-foreground"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="text-[8px] font-black uppercase text-muted-foreground block mb-1">Benefits (Comma Separated)</label>
                          <input
                            type="text"
                            value={tc.benefits.join(", ")}
                            onChange={(e) => updateTicketClass(tc.id, "benefits", e.target.value)}
                            className="w-full h-10 bg-white dark:bg-black/40 border border-border rounded-none px-3 text-xs font-bold text-foreground"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION D: PUBLISH CONTROLS */}
              <div className="p-6 bg-gold/10 border border-gold/40 rounded-none flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Event Status</label>
                  <select
                    value={lifecycleState}
                    onChange={(e) => setLifecycleState(e.target.value as EventLifecycleState)}
                    className="h-10 bg-white dark:bg-black/60 border border-border rounded-none px-4 text-xs font-bold text-foreground cursor-pointer"
                  >
                    <option value="PUBLISHED">PUBLISHED (Publicly Available)</option>
                    <option value="DRAFT">DRAFT (Admin Hidden)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={createEventMutation.isPending}
                  className="h-12 px-8 bg-gold text-black font-black text-[10px] uppercase tracking-widest rounded-none flex items-center gap-2 hover:bg-black hover:text-gold transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {createEventMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : "Publish Event & Ticket Prices"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GATE SCANNER MODAL */}
      <TicketScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />

      {/* TICKET PREVIEW MODAL */}
      <TicketPassModal
        ticket={previewTicket}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewTicket(null);
        }}
      />
    </div>
  );
}
