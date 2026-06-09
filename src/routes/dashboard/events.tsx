import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomerEvents } from "@/hooks/use-dashboard-data";
import { formatKes } from "@/lib/dashboard-mock-data";

export const Route = createFileRoute("/dashboard/events")({
  component: CustomerEvents,
});

function CustomerEvents() {
  const { user } = useAuth();
  const { data: events = [], isLoading } = useCustomerEvents(user?.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">My Events</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">Your celebrations</h2>
        </div>
        <Link to="/booking" className="rounded-full bg-gold text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition">
          Plan New Event
        </Link>
      </div>

      <GlassPanel title="All Events" subtitle="Status and budget overview">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && events.length === 0 && (
          <p className="text-sm text-muted-foreground">No events assigned yet. Your planner will add them after booking confirmation.</p>
        )}
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id} className="rounded-xl glass border border-white/10 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xl">{e.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{e.event_type} · {e.event_date || "TBD"}</p>
                  {e.venue && <p className="text-xs text-muted-foreground mt-1">{e.venue}</p>}
                </div>
                <EventStatusBadge status={e.status} />
              </div>
              {e.budget != null && (
                <p className="mt-4 text-sm">Budget: <span className="text-gold">{formatKes(e.budget)}</span></p>
              )}
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
