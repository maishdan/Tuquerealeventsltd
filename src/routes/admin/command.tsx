import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Users, Package, Truck, AlertTriangle } from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import { useAdminEvents } from "@/hooks/use-dashboard-data";
import { liveEvents } from "@/lib/dashboard-mock-data";

export const Route = createFileRoute("/admin/command")({
  component: AdminCommand,
});

const statusFilters = [
  { key: "in-progress", label: "In Progress", emoji: "🟢" },
  { key: "upcoming", label: "Upcoming", emoji: "🔵" },
  { key: "completed", label: "Completed", emoji: "✅" },
  { key: "delayed", label: "Delayed", emoji: "🔴" },
] as const;

function AdminCommand() {
  const { data: dbEvents } = useAdminEvents();
  const events = (dbEvents && dbEvents.length > 0)
    ? dbEvents.map((e) => ({
        id: e.id,
        name: e.name,
        type: e.event_type,
        status: e.status,
        venue: e.venue ?? "TBD",
        team: e.team_count,
        vendors: e.vendor_count,
      }))
    : liveEvents;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Event Command Center</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">
          Live <span className="text-gradient-gold">Event Status</span>
        </h2>
        <p className="mt-2 text-muted-foreground">For CEOs managing multiple events simultaneously.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statusFilters.map((f) => (
          <span key={f.key} className="glass rounded-full border border-white/15 px-4 py-2 text-sm">
            {f.emoji} {f.label}
          </span>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Live Event Tracking", icon: MapPin, value: `${events.filter((e) => e.status === "in-progress").length} active` },
          { label: "Team On-Site", icon: Users, value: "78 staff" },
          { label: "Equipment Ready", icon: Package, value: "94% operational" },
          { label: "Vendor Check-ins", icon: Truck, value: "41 / 46" },
          { label: "Emergency Alerts", icon: AlertTriangle, value: "1 active", accent: true },
          { label: "GPS Venues", icon: MapPin, value: "6 mapped" },
        ].map((item) => (
          <div key={item.label} className={`glass-strong rounded-2xl border p-5 ${item.accent ? "border-rose-400/40" : "border-white/15"}`}>
            <item.icon size={20} className={item.accent ? "text-rose-400" : "text-gold"} />
            <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">{item.label}</p>
            <p className="mt-1 font-display text-2xl">{item.value}</p>
          </div>
        ))}
      </div>

      <GlassPanel title="Live Events" subtitle="Real-time command board">
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="rounded-xl glass border border-white/10 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xl">{event.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{event.type} · {event.venue}</p>
                </div>
                <EventStatusBadge status={event.status} />
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Users size={12} /> {event.team} team</span>
                <span className="inline-flex items-center gap-1"><Truck size={12} /> {event.vendors} vendors</span>
                <span className="inline-flex items-center gap-1"><MapPin size={12} /> GPS tracked</span>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
