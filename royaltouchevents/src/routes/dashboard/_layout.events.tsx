import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomerEvents } from "@/hooks/use-dashboard-data";
import { formatKes } from "@/lib/dashboard-mock-data";
import { PartyPopper, Calendar, MapPin, Wallet, ArrowRight, Sparkles, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/_layout/events")({
  component: CustomerEvents,
});

function CustomerEvents() {
  const { user } = useAuth();
  const { data: events = [], isLoading } = useCustomerEvents(user?.id);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Project Registry</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">Your celebrations</h2>
        </div>
        <div className="flex gap-4">
          <Link to="/dashboard/host-event" className="h-14 px-8 rounded-full border border-gold/40 text-gold font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-gold hover:text-black transition-all">
            <Globe size={16} /> Host Event
          </Link>
          <Link to="/dashboard/book-event" className="h-14 px-8 rounded-full bg-gold text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-gold/20">
            <Sparkles size={16} /> Plan New Event
          </Link>
        </div>
      </div>

      <GlassPanel title="Active Portfolios" subtitle="Operational status and budget overview">
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
             <LocalLoader size={40} className="text-gold animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Retrieving Event Data...</p>
          </div>
        )}

        {!isLoading && events.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
             <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border border-border">
                <PartyPopper size={32} className="text-muted-foreground" />
             </div>
             <div className="space-y-2">
                <p className="text-sm font-bold text-foreground uppercase tracking-tight">No active events found.</p>
                <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">Your event specialist will populate this sector once your booking is confirmed and transition into production.</p>
             </div>
          </div>
        )}

        <div className="grid gap-6 py-4">
          {events.map((e) => (
            <div key={e.id} className="group relative overflow-hidden rounded-[32px] bg-white/5 dark:bg-white/[0.02] light:bg-black/[0.02] border border-border hover:border-gold/30 transition-all duration-500 p-6 md:p-8">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                 <PartyPopper size={120} className="text-foreground" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                       <Calendar size={20} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gold uppercase tracking-widest leading-none mb-1">{e.event_type}</p>
                       <h3 className="text-xl md:text-2xl font-bold text-foreground uppercase tracking-tight group-hover:text-gold transition-colors">{e.name}</h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                     <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-muted-foreground opacity-50" />
                        <span>{e.event_date || "Date to be confirmed"}</span>
                     </div>
                     {e.venue && (
                       <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-muted-foreground opacity-50" />
                          <span>{e.venue}</span>
                       </div>
                     )}
                     {e.budget != null && (
                       <div className="flex items-center gap-2">
                          <Wallet size={14} className="text-muted-foreground opacity-50" />
                          <span className="text-emerald-500/80">{formatKes(e.budget)}</span>
                       </div>
                     )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <EventStatusBadge status={e.status} />
                  <div className="h-12 w-12 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:border-gold/40 group-hover:text-gold transition-all">
                     <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}

function LocalLoader({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
