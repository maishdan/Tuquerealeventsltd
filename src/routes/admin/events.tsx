import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin, Users, Handshake } from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import { useAdminEvents } from "@/hooks/use-dashboard-data";
import { liveEvents, formatKes } from "@/lib/dashboard-mock-data";
import type { EventRecord } from "@/lib/database.types";

export const Route = createFileRoute("/admin/events")({
  component: AdminEvents,
});

function AdminEvents() {
  const { data: events = [], isLoading, error } = useAdminEvents();

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
  const completed = displayEvents.filter((e) => e.status === "completed").length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Event Management</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">
          All <span className="text-gradient-gold">events</span>
        </h2>
        <p className="mt-2 text-muted-foreground">
          Track weddings, corporate events, concerts and more across your production pipeline.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Total Events", value: displayEvents.length },
          { label: "Active / Upcoming", value: active },
          { label: "Completed", value: completed },
        ].map((stat) => (
          <div key={stat.label} className="glass-strong rounded-2xl border border-white/15 p-5 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            <p className="mt-2 font-display text-3xl text-gradient-gold">{stat.value}</p>
          </div>
        ))}
      </div>

      <GlassPanel title="Event Pipeline" subtitle={`${displayEvents.length} events in the system`}>
        {isLoading && <p className="text-sm text-muted-foreground">Loading events…</p>}
        {error && (
          <p className="text-sm text-muted-foreground">
            Showing sample data. Connect Supabase and run the schema to load live events.
          </p>
        )}
        <div className="space-y-3">
          {displayEvents.map((event) => (
            <div key={event.id} className="rounded-xl glass border border-white/10 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg">{event.name}</p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{event.event_type}</p>
                </div>
                <EventStatusBadge status={event.status} />
              </div>
              <dl className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarDays size={14} className="text-gold shrink-0" />
                  <div>
                    <dt className="text-xs text-muted-foreground uppercase tracking-widest">Date</dt>
                    <dd>{event.event_date ? new Date(event.event_date).toLocaleDateString() : "TBD"}</dd>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-gold shrink-0" />
                  <div>
                    <dt className="text-xs text-muted-foreground uppercase tracking-widest">Venue</dt>
                    <dd>{event.venue || "—"}</dd>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-gold shrink-0" />
                  <div>
                    <dt className="text-xs text-muted-foreground uppercase tracking-widest">Team</dt>
                    <dd>{event.team_count} members</dd>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Handshake size={14} className="text-gold shrink-0" />
                  <div>
                    <dt className="text-xs text-muted-foreground uppercase tracking-widest">Vendors</dt>
                    <dd>{event.vendor_count} partners</dd>
                  </div>
                </div>
              </dl>
              {event.budget != null && (
                <p className="mt-3 text-sm">
                  <span className="text-muted-foreground">Budget: </span>
                  <span className="text-gold font-medium">{formatKes(event.budget)}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
