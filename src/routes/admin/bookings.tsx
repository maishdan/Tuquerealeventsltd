import { createFileRoute } from "@tanstack/react-router";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { useAdminBookings, useAdminContacts, useUpdateBookingStatus } from "@/hooks/use-dashboard-data";
import type { BookingStatus } from "@/lib/database.types";

export const Route = createFileRoute("/admin/bookings")({
  component: AdminBookings,
});

const statusOptions: BookingStatus[] = ["pending", "confirmed", "planning", "inquiry", "cancelled"];

function AdminBookings() {
  const { data: bookings = [], isLoading: loadingBookings, error: bookingsError } = useAdminBookings();
  const { data: contacts = [], isLoading: loadingContacts, error: contactsError } = useAdminContacts();
  const updateStatus = useUpdateBookingStatus();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Bookings & Inquiries</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">
          Website <span className="text-gradient-gold">leads</span>
        </h2>
        <p className="mt-2 text-muted-foreground">
          Bookings from the booking page and messages from the contact form appear here in real time.
        </p>
      </div>

      <GlassPanel title="Event Bookings" subtitle={`${bookings.length} total inquiries`}>
        {loadingBookings && <p className="text-sm text-muted-foreground">Loading bookings…</p>}
        {bookingsError && (
          <p className="text-sm text-destructive">Could not load bookings. Run supabase/schema.sql first.</p>
        )}
        {!loadingBookings && bookings.length === 0 && (
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
                <span className="inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs capitalize text-gold">{b.status}</span>
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
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel title="Contact Form Messages" subtitle={`${contacts.length} messages`}>
        {loadingContacts && <p className="text-sm text-muted-foreground">Loading messages…</p>}
        {contactsError && (
          <p className="text-sm text-destructive">Could not load contact inquiries.</p>
        )}
        {!loadingContacts && contacts.length === 0 && (
          <p className="text-sm text-muted-foreground">No contact messages yet.</p>
        )}
        <div className="space-y-3">
          {contacts.map((c) => (
            <div key={c.id} className="rounded-xl glass border border-white/10 p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <p className="font-medium">{c.name}</p>
                <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gold mt-1">{c.email}</p>
              <p className="mt-3 text-sm text-foreground/85">{c.message}</p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
