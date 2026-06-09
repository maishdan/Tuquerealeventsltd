import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, MessageSquare, PartyPopper, ArrowRight } from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomerBookings, useCustomerEvents, useCustomerMessages } from "@/hooks/use-dashboard-data";
import type { BookingStatus, EventStatus } from "@/lib/database.types";

export const Route = createFileRoute("/dashboard/")({
  component: CustomerOverview,
});

function mapBookingStatus(s: BookingStatus): EventStatus {
  if (s === "confirmed") return "confirmed";
  if (s === "planning") return "planning";
  if (s === "pending") return "inquiry";
  return "inquiry";
}

function CustomerOverview() {
  const { user, profile } = useAuth();
  const { data: events = [] } = useCustomerEvents(user?.id);
  const { data: bookings = [] } = useCustomerBookings(user?.id, profile?.email);
  const { data: messages = [] } = useCustomerMessages(user?.id);
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">
          Your <span className="text-gradient-gold">Event Hub</span>
        </h2>
        <p className="mt-2 text-muted-foreground">Track bookings, events and messages in one place.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Active Events", value: String(events.length), icon: PartyPopper, to: "/dashboard/events" },
          { label: "Open Bookings", value: String(bookings.length), icon: CalendarDays, to: "/dashboard/bookings" },
          { label: "Unread Messages", value: String(unread), icon: MessageSquare, to: "/dashboard/messages" },
        ].map((card) => (
          <Link key={card.label} to={card.to} className="glass-strong rounded-2xl border border-white/15 p-5 hover:border-gold/40 transition tech-glow">
            <card.icon size={22} className="text-gold" />
            <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{card.label}</p>
            <p className="mt-1 font-display text-3xl text-gradient-gold">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassPanel
          title="Upcoming Events"
          subtitle="Your scheduled celebrations"
          action={<Link to="/dashboard/events" className="text-xs text-gold inline-flex items-center gap-1">View all <ArrowRight size={12} /></Link>}
        >
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">No events yet. Book an event to get started.</p>
          ) : (
            <div className="space-y-3">
              {events.slice(0, 2).map((e) => (
                <div key={e.id} className="rounded-xl glass border border-white/10 p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{e.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{e.event_date || "TBD"} · {e.event_type}</p>
                  </div>
                  <EventStatusBadge status={e.status} />
                </div>
              ))}
            </div>
          )}
        </GlassPanel>

        <GlassPanel
          title="Recent Bookings"
          subtitle="Payment & confirmation status"
          action={<Link to="/booking" className="text-xs text-gold inline-flex items-center gap-1">New booking <ArrowRight size={12} /></Link>}
        >
          {bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 2).map((b) => (
                <div key={b.id} className="rounded-xl glass border border-white/10 p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-gold">BK-{b.id.slice(0, 8).toUpperCase()}</p>
                    <p className="font-medium text-sm mt-1">{b.event_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{b.budget}</p>
                    <EventStatusBadge status={mapBookingStatus(b.status)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      </div>
    </div>
  );
}
