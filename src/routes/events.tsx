import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Globe,
  Calendar,
  MapPin,
  ShieldCheck,
  Zap,
  Sparkles,
  Filter,
  Loader2,
  Star,
  Search,
  Ticket as TicketIcon,
  CheckCircle2,
  Users,
  Clock,
  Tag
} from "lucide-react";
import { createPageSeo } from "../lib/seo";
import { fetchAllEvents } from "@/lib/api/events";
import { useFavorites } from "@/contexts/FavoritesContext";
import type { EventRecord, TicketClass } from "@/lib/database.types";
import { formatKes } from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/events")({
  head: () =>
    createPageSeo({
      title: "Public Events & Gate Passes | Royal Touch Registry",
      description:
        "Join and explore high-profile public events, concerts, and summits hosted by Royal Touch partners across Nairobi with instant M-Pesa QR ticketing.",
      path: "/events",
    }),
  component: EventsPage,
});

const heroImages = [
  "/back/e1.jfif",
  "/back/e2.jfif",
  "/back/e3.jfif",
  "/back/e4.jfif",
  "/back/e5.jfif",
];

export function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAllEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();

    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const categories = ["All", "Technology", "Corporate Gala", "Product Launch", "Concert Production"];

  const filteredEvents = events.filter((e) => {
    if (e.lifecycle_state === "DRAFT") return false;

    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.venue && e.venue.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.event_type && e.event_type.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" ||
      (e.event_type && e.event_type.toLowerCase().includes(selectedCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-w-0 bg-[#f8fafc] dark:bg-[#0b0e14] text-foreground font-sans overflow-x-hidden transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[55vh] flex flex-col items-center justify-start overflow-hidden pt-12 pb-16 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b0e14]">
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt="Public Events"
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-[2500ms] ease-in-out scale-105",
                idx === currentImgIndex ? "opacity-15 dark:opacity-25" : "opacity-0"
              )}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-slate-50/95 to-[#f8fafc] dark:from-[#0b0e14]/90 dark:via-[#0b0e14]/95 dark:to-[#0b0e14]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 w-full text-center mt-12 md:mt-16 space-y-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-none bg-gold/10 border border-gold/40 text-gold text-[10px] font-black uppercase tracking-[0.3em] shadow-sm">
                <Globe size={14} className="text-gold" /> Live Public Event Registry & Multi-Tier Passes
              </div>
            </div>

            <h1 className="text-4xl sm:text-7xl lg:text-[90px] font-black tracking-tighter uppercase leading-[0.88] text-[#0b0e14] dark:text-white">
              Public <br />
              <span className="text-gold font-display font-normal">Engagements.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-lg md:text-xl font-medium text-slate-700 dark:text-gray-300 leading-relaxed">
              Discover high-profile summits, live concerts, and festivals across Nairobi with instant M-Pesa guest checkout and QR ticket generation.
            </p>
          </div>
        </div>
      </section>

      {/* 2. SEARCH & FILTER BAR */}
      <section className="py-8 bg-slate-100 dark:bg-[#121722] border-b border-slate-200 dark:border-white/10 sticky top-20 z-30 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search event title or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-white dark:bg-[#0b0e14] border border-slate-300 dark:border-white/10 rounded-none pl-11 pr-4 text-xs font-bold text-foreground outline-none focus:border-gold transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2.5 rounded-none text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer",
                    selectedCategory === cat
                      ? "bg-gold text-black border-gold shadow-md"
                      : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-foreground hover:border-gold"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. EVENT REGISTRY CARDS (ARRANGED HORIZONTALLY ACROSS IN A GRID ROW WITH EVENT IMAGES) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Real-time Directory</p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white">
              Upcoming Productions ({filteredEvents.length})
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <Loader2 size={40} className="text-gold animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Updating Registry...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-20 bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 rounded-none text-center space-y-4 p-8">
            <Globe size={48} className="mx-auto text-gold/60" />
            <p className="text-sm font-bold uppercase tracking-tight text-foreground">No matching events found in registry.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((e) => {
              const isFav = isFavorite(e.id);
              const classes: TicketClass[] = e.ticket_classes || [
                { id: "c1", name: "Regular", description: "General entry", price: 500, quantity_available: 500, quantity_sold: 0, benefits: ["General Entrance"] },
                { id: "c2", name: "VIP", description: "VIP entry", price: 1500, quantity_available: 100, quantity_sold: 0, benefits: ["Priority Entry"] },
              ];

              return (
                <div
                  key={e.id}
                  className="group relative bg-white dark:bg-[#121722] border border-slate-200 dark:border-white/10 hover:border-gold transition-all duration-300 rounded-none overflow-hidden shadow-md flex flex-col justify-between"
                >
                  {/* Event Poster Image Frame */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-black/40">
                    <img
                      src={e.poster_url || "/back/e1.jfif"}
                      alt={e.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition-all duration-700"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 text-gold font-black text-[9px] uppercase tracking-widest border border-gold/40 shadow-md">
                      {e.event_type || "Public Event"}
                    </div>

                    {/* Bookmark Star Button */}
                    <button
                      onClick={() =>
                        toggleFavorite({
                          id: e.id,
                          title: e.name,
                          category: e.event_type || "Public Event",
                          link: "/events",
                          date: e.event_date || "TBD",
                          image: e.poster_url || "/back/e1.jfif",
                        })
                      }
                      className={cn(
                        "absolute top-4 right-4 h-10 w-10 border rounded-none flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer",
                        isFav
                          ? "bg-gold text-black border-gold"
                          : "bg-black/70 border-white/20 text-white hover:border-gold hover:text-gold"
                      )}
                      title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <Star size={16} className={cn(isFav && "fill-black")} />
                    </button>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 sm:p-8 space-y-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className="text-xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white group-hover:text-gold transition-colors leading-snug">
                        {e.name}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-gray-300 font-medium leading-relaxed line-clamp-2">
                        {e.description || "High-profile engagement curated by Royal Touch Events."}
                      </p>

                      <div className="space-y-1.5 pt-2 text-xs font-bold text-slate-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar size={13} className="text-gold shrink-0" />
                          <span>{e.event_date || "Date Confirmed"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={13} className="text-gold shrink-0" />
                          <span className="truncate">{e.venue || "Nairobi Venue"}</span>
                        </div>
                      </div>

                      {/* Ticket Classes Options Summary */}
                      <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-1.5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gold">Available Pass Classes</p>
                        <div className="flex flex-wrap gap-2">
                          {classes.map((tc) => (
                            <span key={tc.id} className="px-2.5 py-1 bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-[9px] font-bold text-foreground">
                              {tc.name}: <span className="text-gold font-mono font-black">{formatKes(tc.price)}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Book Action Button */}
                    <div className="pt-4">
                      <Link
                        to="/booking"
                        search={{ eventId: e.id }}
                        className="h-12 w-full bg-gold text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-black hover:text-gold transition-all shadow-md cursor-pointer"
                      >
                        Book Ticket Pass <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="py-24 bg-white dark:bg-[#0d121c] border-t border-slate-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative rounded-none border border-gold/40 bg-gradient-to-r from-gold/10 via-slate-50 to-gold/10 dark:from-gold/10 dark:via-[#0b0e14] dark:to-gold/10 p-12 sm:p-20 text-center space-y-8 shadow-2xl">
            <div className="max-w-3xl mx-auto space-y-4">
              <h2 className="text-4xl sm:text-7xl font-black uppercase tracking-tight text-[#0b0e14] dark:text-white leading-tight">
                Host Your Own <br />
                <span className="text-gold text-gradient-gold">Public Event.</span>
              </h2>
              <p className="text-slate-700 dark:text-gray-300 text-sm sm:text-lg font-medium max-w-xl mx-auto">
                Leverage Royal Touch infrastructure for stadium audio, VIP staging, and automated M-Pesa QR gate ticketing.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                to="/booking"
                className="h-16 px-12 rounded-none bg-gold text-black font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-black hover:text-gold transition-all shadow-xl shadow-gold/20"
              >
                Inquire Production Brief <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
