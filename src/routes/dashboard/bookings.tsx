import { createFileRoute } from "@tanstack/react-router";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomerBookings } from "@/hooks/use-dashboard-data";
import type { BookingStatus, EventStatus } from "@/lib/database.types";

export const Route = createFileRoute("/dashboard/bookings")({
  component: CustomerBookings,
});

function mapStatus(s: BookingStatus): EventStatus {
  if (s === "confirmed") return "confirmed";
  if (s === "planning") return "planning";
  return "inquiry";
}

function CustomerBookings() {
  const { user, profile } = useAuth();
  const { data: bookings = [], isLoading } = useCustomerBookings(user?.id, profile?.email);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Bookings</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">Inquiries & contracts</h2>
      </div>

      <GlassPanel title="Booking History" subtitle="Track confirmation and payments">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && bookings.length === 0 && (
          <p className="text-sm text-muted-foreground">No bookings yet. Submit the booking form on the website.</p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-white/10">
                <th className="pb-3 pr-4">ID</th>
                <th className="pb-3 pr-4">Event</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-white/5">
                  <td className="py-4 pr-4 text-gold">BK-{b.id.slice(0, 8).toUpperCase()}</td>
                  <td className="py-4 pr-4">{b.event_type}</td>
                  <td className="py-4 pr-4 text-muted-foreground">{b.event_date || "TBD"}</td>
                  <td className="py-4 pr-4">{b.budget}</td>
                  <td className="py-4"><EventStatusBadge status={mapStatus(b.status)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
}
