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
  Loader2
} from "lucide-react";
import { createPageSeo } from "../lib/seo";
import { fetchAllEvents } from "@/lib/api/events";
import type { EventRecord } from "@/lib/database.types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/events")({
  head: () =>
    createPageSeo({
      title: "Public Events | Royal Touch Registry",
      description:
        "Join and explore high-profile public events, concerts, and workshops hosted by Royal Touch partners across Nairobi.",
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

function EventsPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

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

  return (
    <div className="bg-[#0b0e14] text-white font-sans min-w-0">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-start overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt=""
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-[3000ms] ease-in-out",
                idx === currentImgIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
              )}
            />
          ))}
          <div className="absolute inset-0 bg-[#0b0e14]/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0e14]/80 via-transparent to-[#0b0e14]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 w-full text-center mt-12 md:mt-20">
          <div className="max-w-4xl mx-auto bg-[#0b0e14]/60 backdrop-blur-md border border-white/10 p-6 md:p-12 rounded-[24px] md:rounded-[32px] space-y-6 animate-in fade-in zoom-in duration-1000">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-black uppercase tracking-widest">
                  <Globe size={12} /> Live Event Registry
                </div>
              </div>
              <h1 className="text-3xl sm:text-6xl font-black tracking-tighter text-white uppercase leading-tight">
                Public <br />
                <span className="text-gold">Events.</span>
              </h1>
              <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-200 font-medium">
                Explore high-profile public engagements, community summits, and world-class live productions curated by Royal Touch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EVENT REGISTRY LISTING */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
           <div className="space-y-2">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Project Registry</h2>
              <h3 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">Current Engagements</h3>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{events.length} Active Events</p>
           </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
             <Loader2 size={40} className="text-gold animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Updating Registry...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="py-24 bg-white/[0.02] border border-dashed border-white/10 rounded-[40px] text-center space-y-6">
             <Globe size={48} className="mx-auto text-gray-700" />
             <p className="text-gray-500 uppercase font-black text-xs tracking-widest">No public events listed at this time.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {events.map((e) => (
              <div key={e.id} className="group relative overflow-hidden rounded-[40px] bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all duration-500 p-8 md:p-12">
                 <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                    <Globe size={160} />
                 </div>

                 <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    <div className="space-y-6 flex-1">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                             <Calendar size={20} />
                          </div>
                          <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">{e.event_type}</span>
                       </div>

                       <h4 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight group-hover:text-gold transition-colors">{e.name}</h4>

                       <div className="flex flex-wrap gap-8">
                          <div className="flex items-center gap-3">
                             <Calendar size={14} className="text-gray-500" />
                             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{e.event_date || "TBD"}</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <MapPin size={14} className="text-gray-500" />
                             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{e.venue || "Venue Unspecified"}</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                       <button className="h-16 px-10 rounded-full border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                          Event Details
                       </button>
                       <Link to="/booking" className="h-16 px-10 rounded-full bg-gold text-[#0b0e14] font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl">
                          Inquire <ArrowRight size={16} />
                       </Link>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-32">
        <div className="relative rounded-[60px] overflow-hidden bg-white/5 border border-white/10 p-12 md:p-32 text-center">
          <div className="relative z-10 max-w-3xl mx-auto space-y-10">
            <h2 className="font-display text-5xl md:text-8xl text-white tracking-tighter text-white">Host Your Own <br /><span className="text-gold">Public Event.</span></h2>
            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-xl mx-auto">
              Leverage the Royal Touch infrastructure to launch your next large-scale public project.
            </p>
            <div className="pt-8">
              <Link to="/sign-in" className="h-20 px-16 rounded-full bg-gold text-[#0b0e14] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-2xl">
                Partner With Us <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
