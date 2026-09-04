import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import { useAdminEvents, useCreateEvent, formatKes } from "@/hooks/use-dashboard-data";
import {
  PartyPopper,
  Calendar,
  MapPin,
  Wallet,
  ArrowRight,
  Sparkles,
  Globe,
  Users,
  Plus,
  Search,
  Filter,
  X,
  Ticket as TicketIcon,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Trash2,
  Tag,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventRecord, TicketClass, EventLifecycleState } from "@/lib/database.types";

export const Route = createFileRoute("/admin/events")({
  component: AdminEvents,
});

export function AdminEvents() {
  const { data: events = [], isLoading } = useAdminEvents();
  const createEventMutation = useCreateEvent();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterState, setFilterState] = useState<string>("ALL");

  // Wizard Form State
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("Technology");
  const [description, setDescription] = useState("");
  const [organizerName, setOrganizerName] = useState("Royal Touch Events");
  const [organizerEmail, setOrganizerEmail] = useState("eventsroyaltouch7@gmail.com");
  const [organizerPhone, setOrganizerPhone] = useState("+254795365334");
  const [eventDate, setEventDate] = useState("2026-09-20");
  const [startTime, setStartTime] = useState("08:00 AM");
  const [endTime, setEndTime] = useState("06:00 PM");
  const [venue, setVenue] = useState("Kisii University Main Auditorium");
  const [lifecycleState, setLifecycleState] = useState<EventLifecycleState>("PUBLISHED");

  // Ticket Classes Builder State
  const [ticketClasses, setTicketClasses] = useState<TicketClass[]>([
    {
      id: "tc-1",
      name: "Regular",
      description: "General admission ticket",
      price: 500,
      quantity_available: 500,
      quantity_sold: 0,
      benefits: ["General Entrance", "Standard Seating"],
    },
    {
      id: "tc-2",
      name: "VIP",
      description: "VIP fast-track entrance & VIP seating",
      price: 1500,
      quantity_available: 100,
      quantity_sold: 0,
      benefits: ["Priority Entrance", "VIP Reserved Seating", "Conference Materials"],
    },
    {
      id: "tc-3",
      name: "VVIP",
      description: "Front-row seating, lounge access & refreshments",
      price: 3000,
      quantity_available: 30,
      quantity_sold: 0,
      benefits: ["Front-Row Recliners", "Private VVIP Lounge", "Refreshments & Swag"],
    },
  ]);

  const addTicketClass = () => {
    setTicketClasses((prev) => [
      ...prev,
      {
        id: `tc-${Date.now()}`,
        name: "New Ticket Class",
        description: "Custom pass description",
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
    if (!name.trim()) return;

    createEventMutation.mutate(
      {
        name,
        event_type: eventType,
        description,
        organizer_name: organizerName,
        organizer_email: organizerEmail,
        organizer_phone: organizerPhone,
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
          setIsCreateModalOpen(false);
          setName("");
          setDescription("");
        },
      }
    );
  };

  const filteredEvents = events.filter((e) => {
    if (filterState === "ALL") return true;
    return e.lifecycle_state === filterState;
  });

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* Header Section */}
      <div className="flex flex-wrap items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Production & Ticketing Hub</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">
            Events & Ticket Classes
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-14 px-8 rounded-none bg-gold text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-gold/20 cursor-pointer"
          >
            <Plus size={16} /> Create Event & Classes
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-none space-y-2">
          <div className="flex items-center justify-between text-gold">
            <Globe size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Published Events</span>
          </div>
          <p className="text-3xl font-black text-foreground tracking-tight">
            {events.filter((e) => e.lifecycle_state !== "DRAFT").length}
          </p>
        </div>

        <div className="bg-card border border-border p-6 rounded-none space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <TicketIcon size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Ticket Classes</span>
          </div>
          <p className="text-3xl font-black text-emerald-400 tracking-tight">
            {events.reduce((acc, e) => acc + (e.ticket_classes?.length || 0), 0)}
          </p>
        </div>

        <div className="bg-card border border-border p-6 rounded-none space-y-2">
          <div className="flex items-center justify-between text-gold">
            <Wallet size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Est. Total Capacity</span>
          </div>
          <p className="text-3xl font-black text-gold tracking-tight">
            {events.reduce(
              (acc, e) =>
                acc + (e.ticket_classes?.reduce((sum, tc) => sum + tc.quantity_available, 0) || 500),
              0
            )}{" "}
            Passes
          </p>
        </div>
      </div>

      {/* Active Events List */}
      <GlassPanel title="Event Registry & Ticket Pricing" subtitle="Configured event pages, ticket classes, and sales availability">
        {/* Lifecycle Filter Bar */}
        <div className="flex items-center gap-2 py-4 border-b border-border overflow-x-auto">
          {["ALL", "PUBLISHED", "DRAFT", "COMPLETED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterState(st)}
              className={cn(
                "px-4 py-2 rounded-none text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer",
                filterState === st
                  ? "bg-gold text-black border-gold shadow-md"
                  : "bg-muted/40 border-border text-foreground hover:border-gold"
              )}
            >
              {st}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <Loader2 size={40} className="text-gold animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Retrieving Event Database...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
            <Globe size={40} className="text-muted-foreground" />
            <p className="text-sm font-bold uppercase tracking-tight text-foreground">No events found for this filter.</p>
          </div>
        ) : (
          <div className="grid gap-8 py-6">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="group relative overflow-hidden bg-card border border-border hover:border-gold p-8 rounded-none transition-all duration-300 space-y-6 shadow-md"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-gold/10 border border-gold/30 text-gold text-[9px] font-black uppercase tracking-widest">
                        {evt.event_type}
                      </span>
                      <span
                        className={cn(
                          "px-3 py-1 text-[9px] font-black uppercase tracking-widest border",
                          evt.lifecycle_state === "DRAFT"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        )}
                      >
                        {evt.lifecycle_state || "PUBLISHED"}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black uppercase tracking-tight text-foreground group-hover:text-gold transition-colors">
                      {evt.name}
                    </h3>

                    <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-2xl">
                      {evt.description || "Executive production by Royal Touch Events."}
                    </p>

                    <div className="flex flex-wrap gap-6 text-xs font-bold text-muted-foreground pt-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gold" />
                        <span>{evt.event_date || "Date Confirmed"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gold" />
                        <span>{evt.start_time || "08:00 AM"} - {evt.end_time || "06:00 PM"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gold" />
                        <span>{evt.venue || "Nairobi Venue"}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/booking"
                    className="h-12 px-6 bg-gold text-black font-black text-[9px] uppercase tracking-widest rounded-none flex items-center justify-center gap-2 hover:bg-black hover:text-gold transition-all shadow-md shrink-0 cursor-pointer"
                  >
                    View Public Page <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Configured Ticket Classes Table */}
                <div className="pt-4 border-t border-border space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gold">Configured Ticket Classes & Pricing</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(evt.ticket_classes || []).map((tc) => (
                      <div key={tc.id} className="p-4 bg-muted/40 border border-border rounded-none space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-black text-xs uppercase tracking-widest text-foreground">{tc.name}</span>
                          <span className="font-mono text-sm font-black text-gold">{formatKes(tc.price)}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{tc.description}</p>
                        <div className="text-[9px] text-muted-foreground font-mono flex justify-between pt-1 border-t border-border/50">
                          <span>Capacity: {tc.quantity_available}</span>
                          <span>Sold: {tc.quantity_sold}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>

      {/* CREATE EVENT & TICKET CLASSES WIZARD MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#0d121c] border border-gold/40 rounded-none p-8 space-y-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gold text-black flex items-center justify-center font-black">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gold">Admin Creator</p>
                  <h3 className="text-lg font-black uppercase tracking-tight text-foreground">Create Event & Ticket Classes</h3>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="h-10 w-10 bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-8">
              {/* SECTION A: BASIC INFO */}
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                  SECTION B: DATE, TIME & VENUE COORDINATES
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
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Venue & Address</label>
                    <input
                      type="text"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      className="w-full h-12 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-4 text-xs font-bold text-foreground outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: TICKET CLASSES BUILDER */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">
                    SECTION C: TICKET CLASSES & PRICING
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
                          <label className="text-[8px] font-black uppercase text-muted-foreground block mb-1">Price (KES)</label>
                          <input
                            type="number"
                            value={tc.price}
                            onChange={(e) => updateTicketClass(tc.id, "price", Number(e.target.value))}
                            className="w-full h-10 bg-white dark:bg-black/40 border border-border rounded-none px-3 text-xs font-bold text-foreground"
                          />
                        </div>

                        <div>
                          <label className="text-[8px] font-black uppercase text-muted-foreground block mb-1">Total Quantity</label>
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
                  {createEventMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : "Publish Event & Ticket Classes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
