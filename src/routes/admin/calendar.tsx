import { createFileRoute } from "@tanstack/react-router";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import { liveEvents } from "@/lib/dashboard-mock-data";

export const Route = createFileRoute("/admin/calendar")({
  component: AdminCalendar,
});

const upcomingMajor = [
  { date: "Apr 12", title: "Equity Bank Annual Gala", type: "Corporate" },
  { date: "Apr 18", title: "Naivasha Garden Wedding", type: "Wedding" },
  { date: "Apr 22", title: "Afro-Beats Night Live", type: "Concert" },
  { date: "May 02", title: "Tech Summit 2026", type: "Conference" },
  { date: "May 14", title: "Brand Launch — Indigo", type: "Corporate" },
];

function AdminCalendar() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Event Calendar</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">
          Upcoming <span className="text-gradient-gold">Major Events</span>
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassPanel title="April — May Pipeline" subtitle="Scheduled productions">
          <div className="space-y-3">
            {upcomingMajor.map((e) => (
              <div key={e.title} className="flex items-center gap-4 rounded-xl glass border border-white/10 p-4">
                <div className="shrink-0 text-center w-14">
                  <p className="text-xs uppercase text-gold">{e.date.split(" ")[0]}</p>
                  <p className="font-display text-2xl">{e.date.split(" ")[1]}</p>
                </div>
                <div>
                  <p className="font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{e.type}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel title="Event Pipeline Funnel" subtitle="By status">
          <div className="space-y-4">
            {[
              { stage: "Inquiry", count: 24, width: "100%" },
              { stage: "Proposal Sent", count: 18, width: "75%" },
              { stage: "Contract Signed", count: 12, width: "50%" },
              { stage: "In Production", count: 8, width: "33%" },
              { stage: "Completed", count: 142, width: "90%" },
            ].map((stage) => (
              <div key={stage.stage}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{stage.stage}</span>
                  <span className="text-gold">{stage.count}</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-gold" style={{ width: stage.width }} />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      <GlassPanel title="All Scheduled Events" subtitle="Command calendar view">
        <div className="grid sm:grid-cols-2 gap-3">
          {liveEvents.map((e) => (
            <div key={e.id} className="rounded-xl glass border border-white/10 p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium truncate">{e.name}</p>
                <p className="text-xs text-muted-foreground truncate">{e.venue}</p>
              </div>
              <EventStatusBadge status={e.status as never} />
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
