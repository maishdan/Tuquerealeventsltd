import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import { useAdminEvents } from "@/hooks/use-dashboard-data";
import { formatKes, liveEvents } from "@/lib/dashboard-mock-data";
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
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventRecord } from "@/lib/database.types";

export const Route = createFileRoute("/admin/events")({
  component: AdminEvents,
});

function AdminEvents() {
  const { data: events = [], isLoading } = useAdminEvents();

  const displayEvents: (EventRecord | (typeof liveEvents)[0])[] =
    events.length > 0
      ? events
      : liveEvents.map((e) => ({
          id: String(e.id),
          user_id: null,
          booking_id: null,
          name: e.name,
          event_type: e.type,
          event_date: null,
          venue: e.venue,
          budget: null,
          status: e.status as EventRecord["status"],
          team_count: e.team,
          vendor_count: e.vendors,
          created_at: new Date().toISOString(),
        }));

  const active = displayEvents.filter((e) => ["in-progress", "upcoming", "confirmed", "planning"].includes(e.status)).length;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Production Registry</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">Empire Operations</h2>
        </div>
        <div className="flex gap-4">
          <Link to="/admin/events" className="h-14 px-8 rounded-full border border-border bg-card text-muted-foreground font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:text-gold transition-all">
            <Filter size={16} /> Registry Filter
          </Link>
          <Link to="/admin/bookings" className="h-14 px-8 rounded-full bg-gold text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-gold/20">
            <Plus size={16} /> Orchestrate New
          </Link>
        </div>
      </div>

      <GlassPanel title="Active Deployments" subtitle="Real-time oversight of all high-stakes productions">
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
             <Loader size={40} className="text-gold animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Retrieving Empire Data...</p>
          </div>
        )}

        <div className="grid gap-6 py-4">
          {displayEvents.map((e) => (
            <div key={e.id} className="group relative overflow-hidden rounded-[32px] bg-muted/30 border border-border hover:border-gold/30 transition-all duration-500 p-6 md:p-8">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                 <Globe size={120} className="text-foreground" />
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
                        <span>{e.event_date ? new Date(e.event_date).toLocaleDateString() : "Date TBD"}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-muted-foreground opacity-50" />
                        <span>{e.venue || "Venue TBD"}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Users size={14} className="text-muted-foreground opacity-50" />
                        <span>{e.team_count || 0} Staff Assigned</span>
                     </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <EventStatusBadge status={e.status as any} />
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

function Loader({ size, className }: { size: number; className?: string }) {
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
