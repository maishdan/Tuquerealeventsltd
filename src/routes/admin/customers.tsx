import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, UserCircle } from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { useAdminClients } from "@/hooks/use-dashboard-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

function AdminCustomers() {
  const { data: profiles = [], isLoading, error } = useAdminClients();

  const customers = profiles.filter((p) => p.role === "customer");
  const withPhone = customers.filter((c) => c.phone).length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Customer Management</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">
          Registered <span className="text-gradient-gold">clients</span>
        </h2>
        <p className="mt-2 text-muted-foreground">
          Customers who signed up for a Royal Touch Events account via the client portal.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass-strong rounded-2xl border border-white/15 p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Total Customers</p>
          <p className="mt-2 font-display text-3xl text-gradient-gold">{customers.length}</p>
        </div>
        <div className="glass-strong rounded-2xl border border-white/15 p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">With Phone</p>
          <p className="mt-2 font-display text-3xl">{withPhone}</p>
        </div>
        <div className="glass-strong rounded-2xl border border-white/15 p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">New This Month</p>
          <p className="mt-2 font-display text-3xl">
            {customers.filter((c) => {
              const d = new Date(c.created_at);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      <GlassPanel title="Customer Directory" subtitle={`${customers.length} registered clients`}>
        {isLoading && <p className="text-sm text-muted-foreground">Loading customers…</p>}
        {error && (
          <p className="text-sm text-destructive">Could not load customer profiles.</p>
        )}
        {!isLoading && customers.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No registered customers yet. Clients who sign up at /sign-up will appear here.
          </p>
        )}
        <div className="grid sm:grid-cols-2 gap-3">
          {customers.map((customer) => (
            <div key={customer.id} className="rounded-xl glass border border-white/10 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                  <UserCircle size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg">{customer.full_name || "Unnamed client"}</p>
                  <span className="inline-flex mt-1 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-emerald-300">
                    customer
                  </span>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail size={14} className="text-gold shrink-0" />
                  <a href={`mailto:${customer.email}`} className="truncate hover:text-gold transition">{customer.email}</a>
                </li>
                {customer.phone && (
                  <li className="flex items-center gap-2">
                    <Phone size={14} className="text-gold shrink-0" />
                    <span>{customer.phone}</span>
                  </li>
                )}
                {customer.city && (
                  <li className="flex items-center gap-2">
                    <MapPin size={14} className="text-gold shrink-0" />
                    <span>{customer.city}</span>
                  </li>
                )}
              </ul>
              <p className={cn("mt-3 text-xs text-muted-foreground")}>
                Joined {new Date(customer.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
