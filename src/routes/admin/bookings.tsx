import { createFileRoute } from "@tanstack/react-router";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { useAdminBookings, useUpdateBookingStatus } from "@/hooks/use-dashboard-data";
import type { BookingStatus } from "@/lib/database.types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/bookings")({
  component: AdminBookings,
});

const statusOptions: BookingStatus[] = ["pending", "confirmed", "planning", "inquiry", "cancelled"];

const statusStyles: Record<BookingStatus, string> = {
  pending: "border-amber-400/40 bg-amber-500/10 text-amber-300",
  confirmed: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
  planning: "border-blue-400/40 bg-blue-500/10 text-blue-300",
  inquiry: "border-white/20 bg-white/5 text-muted-foreground",
  cancelled: "border-rose-400/40 bg-rose-500/10 text-rose-300",
};

function AdminBookings() {
  const { data: bookings = [], isLoading, error } = useAdminBookings();
  const updateStatus = useUpdateBookingStatus();

  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Bookings</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">
          Event <span className="text-gradient-gold">requests</span>
        </h2>
        <p className="mt-2 text-muted-foreground">
          All booking submissions from the website booking form. Review, update status and follow up with clients.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass-strong rounded-2xl border border-white/15 p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Total Bookings</p>
          <p className="mt-2 font-display text-3xl text-gradient-gold">{bookings.length}</p>
        </div>
        <div className="glass-strong rounded-2xl border border-white/15 p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Pending Review</p>
          <p className="mt-2 font-display text-3xl">{pending}</p>
        </div>
        <div className="glass-strong rounded-2xl border border-white/15 p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Confirmed</p>
          <p className="mt-2 font-display text-3xl">{confirmed}</p>
        </div>
      </div>

      <GlassPanel title="Booking Requests" subtitle={`${bookings.length} total from /booking`}>
        {isLoading && <p className="text-sm text-muted-foreground">Loading bookings…</p>}
        {error && (
          <p className="text-sm text-destructive">Could not load bookings. Run supabase/schema.sql first.</p>
        )}
        {!isLoading && bookings.length === 0 && (
          <p className="text-sm text-muted-foreground">No bookings yet. Submissions from /booking will appear here.</p>
        )}
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-xl glass border border-white/10 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg">{b.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {b.email} · {b.phone || "No phone"}
                  </p>
                </div>
                <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs capitalize", statusStyles[b.status])}>
                  {b.status}
                </span>
              </div>
              <dl className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div><dt className="text-xs text-muted-foreground uppercase tracking-widest">Event</dt><dd>{b.event_type}</dd></div>
                <div><dt className="text-xs text-muted-foreground uppercase tracking-widest">Date</dt><dd>{b.event_date || "TBD"}</dd></div>
                <div><dt className="text-xs text-muted-foreground uppercase tracking-widest">Budget</dt><dd className="text-gold">{b.budget}</dd></div>
                <div><dt className="text-xs text-muted-foreground uppercase tracking-widest">Guests</dt><dd>{b.guests || "—"}</dd></div>
              </dl>
              {Array.isArray(b.services) && b.services.length > 0 && (
                <p className="mt-3 text-xs text-muted-foreground">Services: {(b.services as string[]).join(", ")}</p>
              )}
              {b.notes && <p className="mt-2 text-sm text-foreground/80">{b.notes}</p>}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <label htmlFor={`status-${b.id}`} className="text-xs uppercase tracking-widest text-muted-foreground">
                  Update status
                </label>
                <select
                  id={`status-${b.id}`}
                  value={b.status}
                  onChange={(e) => updateStatus.mutate({ id: b.id, status: e.target.value as BookingStatus })}
                  className="rounded-lg bg-background/60 border border-border px-3 py-1.5 text-sm"
                  aria-label={`Update status for ${b.name}`}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <span className="text-xs text-muted-foreground ml-auto">
                  Submitted {new Date(b.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
