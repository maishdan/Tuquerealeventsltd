import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import {
  useAdminEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  uploadEventPoster,
  formatKes
} from "@/hooks/use-dashboard-data";
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
  Loader2,
  Edit,
  Image as ImageIcon,
  Check,
  Gift
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventRecord, TicketClass, EventLifecycleState } from "@/lib/database.types";

export const Route = createFileRoute("/admin/events")({
  component: AdminEvents,
});

const defaultPosterPresets = [
  "/back/e1.jfif",
  "/back/e2.jfif",
  "/back/e3.jfif",
  "/back/e4.jfif",
  "/back/e5.jfif",
  "/back/e7.jpg",
  "/back/e8.jpg",
  "/back/e9.jpg",
];

export function AdminEvents() {
  const { data: events = [], isLoading } = useAdminEvents();
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);
  const [filterState, setFilterState] = useState<string>("ALL");

  // Form State (Used for both Create and Edit)
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
  const [posterUrl, setPosterUrl] = useState("/back/e1.jfif");
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [posterError, setPosterError] = useState("");

  const handlePosterFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPosterError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPosterError("Image must be under 5MB.");
      return;
    }
    setPosterError("");
    setUploadingPoster(true);
    try {
      const url = await uploadEventPoster(file);
      setPosterUrl(url);
    } catch {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setPosterUrl(String(evt.target.result));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingPoster(false);
    }
  };
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
      name: "Free Student Pass",
      description: "Free student & public entry",
      price: 0,
      quantity_available: 200,
      quantity_sold: 0,
      benefits: ["Free General Entry", "Exhibition Access"],
    },
  ]);

  const openCreateModal = () => {
    setEditingEvent(null);
    setName("");
    setEventType("Technology");
    setDescription("");
    setOrganizerName("Royal Touch Events");
    setEventDate("2026-09-20");
    setStartTime("08:00 AM");
    setEndTime("06:00 PM");
    setVenue("Kisii University Main Auditorium");
    setPosterUrl("/back/e1.jfif");
    setLifecycleState("PUBLISHED");
    setTicketClasses([
      {
        id: "tc-1",
        name: "Regular",
        description: "General admission ticket",
        price: 500,
        quantity_available: 500,
        quantity_sold: 0,
        benefits: ["General Entrance"],
      },
      {
        id: "tc-2",
        name: "VIP",
        description: "VIP fast-track entrance & seating",
        price: 1500,
        quantity_available: 100,
        quantity_sold: 0,
        benefits: ["Priority Entrance", "VIP Seating"],
      },
      {
        id: "tc-3",
        name: "Free Admission Pass",
        description: "Complimentary admission pass",
        price: 0,
        quantity_available: 100,
        quantity_sold: 0,
        benefits: ["Free General Entry"],
      },
    ]);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (evt: EventRecord) => {
    setEditingEvent(evt);
    setName(evt.name);
    setEventType(evt.event_type || "General");
    setDescription(evt.description || "");
    setOrganizerName(evt.organizer_name || "Royal Touch Events");
    setEventDate(evt.event_date || "2026-09-20");
    setStartTime(evt.start_time || "08:00 AM");
    setEndTime(evt.end_time || "06:00 PM");
    setVenue(evt.venue || "Nairobi Venue");
    setPosterUrl(evt.poster_url || "/back/e1.jfif");
    setLifecycleState(evt.lifecycle_state || "PUBLISHED");
    setTicketClasses(
      evt.ticket_classes && evt.ticket_classes.length > 0
        ? evt.ticket_classes
        : [
            {
              id: "tc-1",
              name: "Regular",
              description: "General admission",
              price: 500,
              quantity_available: 500,
              quantity_sold: 0,
              benefits: ["General Entrance"],
            },
          ]
    );
    setIsCreateModalOpen(true);
  };

  const addTicketClass = () => {
    setTicketClasses((prev) => [
      ...prev,
      {
        id: `tc-${Date.now()}`,
        name: "Custom Class",
        description: "Custom pass description",
        price: 1000,
        quantity_available: 100,
        quantity_sold: 0,
        benefits: ["General Entrance"],
      },
    ]);
  };

  const addFreeTicketClass = () => {
    setTicketClasses((prev) => [
      ...prev,
      {
        id: `tc-free-${Date.now()}`,
        name: "Free Entry Pass",
        description: "Complimentary & free admission pass",
        price: 0,
        quantity_available: 200,
        quantity_sold: 0,
        benefits: ["Free General Entry", "Exhibition Access"],
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Partial<EventRecord> = {
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
      poster_url: posterUrl,
      lifecycle_state: lifecycleState,
      ticket_classes: ticketClasses,
      status: "upcoming",
      budget: ticketClasses.reduce((acc, tc) => acc + tc.price * tc.quantity_available, 0),
    };

    if (editingEvent) {
      updateEventMutation.mutate(
        { id: editingEvent.id, updates: payload },
        {
          onSuccess: () => {
            setIsCreateModalOpen(false);
            setEditingEvent(null);
          },
        }
      );
    } else {
      createEventMutation.mutate(payload, {
        onSuccess: () => {
          setIsCreateModalOpen(false);
        },
      });
    }
  };

  const handleDeleteEvent = (evt: EventRecord) => {
    if (confirm(`Are you sure you want to delete the event "${evt.name}"? This action cannot be undone.`)) {
      deleteEventMutation.mutate(evt.id);
    }
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
            onClick={openCreateModal}
            className="h-14 px-8 rounded-none bg-gold text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black hover:text-gold transition-all shadow-xl shadow-gold/20 cursor-pointer"
          >
            <Plus size={16} /> Add Event & Set Ticket Prices
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
          <div className="flex items-center justify-between text-emerald-500">
            <TicketIcon size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Ticket Classes</span>
          </div>
          <p className="text-3xl font-black text-emerald-500 tracking-tight">
            {events.reduce((acc, e) => acc + (e.ticket_classes?.length || 0), 0)}
          </p>
        </div>

        <div className="bg-card border border-border p-6 rounded-none space-y-2">
          <div className="flex items-center justify-between text-gold">
            <Wallet size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Total Capacity</span>
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
      <GlassPanel title="Event Registry & Ticket Pricing" subtitle="Configured event pages, posters, ticket classes, and edit/delete controls">
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
                className="group relative overflow-hidden bg-card border border-border hover:border-gold p-6 sm:p-8 rounded-none transition-all duration-300 space-y-6 shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Event Poster Image Preview */}
                  <div className="w-full lg:w-48 h-48 bg-black/40 border border-border overflow-hidden shrink-0 relative">
                    <img
                      src={evt.poster_url || "/back/e1.jfif"}
                      alt={evt.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-gold text-[8px] font-black uppercase">
                      {evt.event_type}
                    </div>
                  </div>

                  {/* Main Event Details */}
                  <div className="space-y-3 flex-1 min-w-0">
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

                    <div className="flex flex-wrap gap-6 text-xs font-bold text-muted-foreground pt-1">
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

                  {/* Action Buttons: Edit, Delete, View */}
                  <div className="flex flex-row lg:flex-col gap-3 shrink-0 justify-end">
                    <button
                      type="button"
                      onClick={() => openEditModal(evt)}
                      className="h-11 px-5 bg-gold text-black font-black text-[9px] uppercase tracking-widest rounded-none flex items-center justify-center gap-2 hover:bg-black hover:text-gold transition-all shadow-md cursor-pointer"
                    >
                      <Edit size={14} /> Edit Event & Prices
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(evt)}
                      className="h-11 px-5 bg-rose-500/10 border border-rose-500/30 text-rose-500 font-black text-[9px] uppercase tracking-widest rounded-none flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                    >
                      <Trash2 size={14} /> Delete Event
                    </button>

                    <Link
                      to="/booking"
                      search={{ eventId: evt.id }}
                      className="h-11 px-5 border border-border text-foreground font-black text-[9px] uppercase tracking-widest rounded-none flex items-center justify-center gap-2 hover:border-gold transition-all cursor-pointer"
                    >
                      Public Booking <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Configured Ticket Classes Table with Seats Available */}
                <div className="pt-4 border-t border-border space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gold">Configured Ticket Classes & Seat Capacities</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(evt.ticket_classes || []).map((tc) => {
                      const availableSeats = Math.max(0, tc.quantity_available - tc.quantity_sold);
                      const isFree = tc.price === 0;
                      return (
                        <div key={tc.id} className="p-4 bg-muted/40 border border-border rounded-none space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-black text-xs uppercase tracking-widest text-foreground">{tc.name}</span>
                            <span className="font-mono text-sm font-black text-gold">
                              {isFree ? "FREE ENTRY" : formatKes(tc.price)}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">{tc.description}</p>
                          <div className="text-[9px] text-muted-foreground font-mono flex justify-between pt-1 border-t border-border/50">
                            <span>Available: {availableSeats} / {tc.quantity_available}</span>
                            <span className={cn("font-bold", availableSeats === 0 ? "text-rose-500" : "text-emerald-500")}>
                              {availableSeats === 0 ? "SOLD OUT" : "SEATS READY"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>

      {/* CREATE / EDIT EVENT & TICKET CLASSES MODAL */}
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
                  <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
                    {editingEvent ? "Edit Event & Ticket Prices" : "Create Event & Set Prices"}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="h-10 w-10 bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-8">
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

              {/* SECTION B: POSTER IMAGE SELECTOR / UPLOADER */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold border-b border-border pb-2">
                  SECTION B: EVENT POSTER & IMAGE BRANDING
                </p>

                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
                    Upload Event Image From Your Device
                  </label>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="h-24 w-24 border border-border overflow-hidden bg-black/20 flex items-center justify-center shrink-0">
                      {posterUrl ? (
                        <img src={posterUrl} alt="Event poster preview" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon size={22} className="text-muted-foreground" />
                      )}
                    </div>

                    <label className="h-12 px-6 border border-gold/50 text-gold font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 cursor-pointer hover:bg-gold hover:text-black transition-all">
                      {uploadingPoster ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                      {uploadingPoster ? "Uploading..." : "Upload Image"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingPoster}
                        onChange={handlePosterFile}
                      />
                    </label>

                    {posterError && (
                      <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">{posterError}</p>
                    )}
                  </div>

                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block pt-2">
                    Or Choose Event Poster Preset / Custom Image URL
                  </label>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {defaultPosterPresets.map((imgSrc) => (
                      <button
                        key={imgSrc}
                        type="button"
                        onClick={() => setPosterUrl(imgSrc)}
                        className={cn(
                          "aspect-square border overflow-hidden relative cursor-pointer group",
                          posterUrl === imgSrc ? "border-gold ring-2 ring-gold" : "border-border opacity-70 hover:opacity-100"
                        )}
                      >
                        <img src={imgSrc} alt="Preset" className="w-full h-full object-cover" />
                        {posterUrl === imgSrc && (
                          <div className="absolute inset-0 bg-gold/30 flex items-center justify-center text-black font-black">
                            <Check size={16} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">
                      Custom Image / Poster URL
                    </label>
                    <input
                      type="text"
                      value={posterUrl}
                      onChange={(e) => setPosterUrl(e.target.value)}
                      placeholder="Ex: /back/e1.jfif or https://images.unsplash.com/..."
                      className="w-full h-12 bg-slate-50 dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-none px-4 text-xs font-mono font-bold text-foreground outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION C: DATE, TIME & VENUE */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold border-b border-border pb-2">
                  SECTION C: DATE, TIME & VENUE COORDINATES
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

              {/* SECTION D: TICKET CLASSES & PRICING BUILDER */}
              <div className="space-y-4">
                <div className="flex flex-wrap justify-between items-center gap-2 border-b border-border pb-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">
                    SECTION D: SET TICKET PRICES & FREE ENTRY OPTIONS
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={addFreeTicketClass}
                      className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/40 text-emerald-500 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Gift size={12} /> + Add Free Ticket Class
                    </button>
                    <button
                      type="button"
                      onClick={addTicketClass}
                      className="px-3 py-1.5 bg-gold/10 border border-gold/40 text-gold text-[9px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all cursor-pointer"
                    >
                      + Add Paid Class
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {ticketClasses.map((tc, idx) => (
                    <div key={tc.id} className="p-4 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-none space-y-3 relative">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gold flex items-center gap-2">
                          Class #{idx + 1}
                          {tc.price === 0 && (
                            <span className="px-2 py-0.5 bg-emerald-500 text-black font-black text-[8px]">
                              FREE ADMISSION
                            </span>
                          )}
                        </span>
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
                          <label className="text-[8px] font-black uppercase text-muted-foreground block mb-1">Price (KES) (Set 0 For Free)</label>
                          <input
                            type="number"
                            value={tc.price}
                            onChange={(e) => updateTicketClass(tc.id, "price", Number(e.target.value))}
                            className="w-full h-10 bg-white dark:bg-black/40 border border-border rounded-none px-3 text-xs font-bold text-foreground"
                          />
                        </div>

                        <div>
                          <label className="text-[8px] font-black uppercase text-muted-foreground block mb-1">Total Quantity / Capacity</label>
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

              {/* SECTION E: PUBLISH CONTROLS */}
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
                  disabled={createEventMutation.isPending || updateEventMutation.isPending}
                  className="h-12 px-8 bg-gold text-black font-black text-[10px] uppercase tracking-widest rounded-none flex items-center gap-2 hover:bg-black hover:text-gold transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {createEventMutation.isPending || updateEventMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : editingEvent ? (
                    "Save Event Changes & Ticket Prices"
                  ) : (
                    "Publish Event & Set Ticket Prices"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
