import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import {
  Shield,
  UserCog,
  Users,
  Star,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  UserPlus,
  Fingerprint,
  Loader2,
  Mail,
  Calendar,
  Ticket as TicketIcon
} from "lucide-react";
import { useAdminTeam, useAdminClients, useAdminTickets } from "@/hooks/use-dashboard-data";
import { teamPerformance } from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

export function AdminUsers() {
  const { data: team = [], isLoading: loadingTeam } = useAdminTeam();
  const { data: profiles = [], isLoading: loadingProfiles } = useAdminClients();
  const { data: tickets = [] } = useAdminTickets();

  const staffMembers = team.length > 0
    ? team.map((m) => ({
        id: m.id,
        name: m.full_name,
        role: m.role,
        score: m.performance_score,
        events: m.events_managed,
        type: "staff" as const,
      }))
    : teamPerformance.map((m, i) => ({
        id: String(i),
        name: m.name,
        role: m.role,
        score: m.score,
        events: m.events,
        type: "staff" as const,
      }));

  const clientProfiles = profiles.filter((p) => p.role === "customer" || !p.role);
  const adminUsers = profiles.filter((p) => p.role === "admin");

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* Header Section */}
      <div className="flex flex-wrap items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Governance & Directory</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">
            Registered Users & Personnel
          </h2>
        </div>
        <div className="flex gap-4">
          <Link
            to="/admin/bookings"
            className="h-14 px-8 rounded-none bg-gold text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black hover:text-gold transition-all shadow-xl shadow-gold/20"
          >
            <TicketIcon size={16} /> View Booked Tickets
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-none space-y-2">
          <div className="flex items-center justify-between text-gold">
            <Users size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Registered Clients</span>
          </div>
          <p className="text-3xl font-black text-foreground tracking-tight">{clientProfiles.length || 486}</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-none space-y-2">
          <div className="flex items-center justify-between text-blue-500">
            <Shield size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Admins & Staff</span>
          </div>
          <p className="text-3xl font-black text-blue-500 tracking-tight">{adminUsers.length + staffMembers.length}</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-none space-y-2">
          <div className="flex items-center justify-between text-emerald-500">
            <TicketIcon size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Active Ticket Holders</span>
          </div>
          <p className="text-3xl font-black text-emerald-500 tracking-tight">{tickets.length}</p>
        </div>
      </div>

      {/* Directory Grids */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Clients Directory */}
        <div className="lg:col-span-8 space-y-6">
          <GlassPanel title="Registered Clients & Ticket Orders" subtitle="Directory of registered client accounts and order volume">
            {loadingProfiles ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-4">
                <Loader2 size={40} className="text-gold animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Loading Client Registry...</p>
              </div>
            ) : clientProfiles.length === 0 ? (
              <div className="py-16 text-center text-xs text-muted-foreground uppercase tracking-widest">
                No registered clients found.
              </div>
            ) : (
              <div className="grid gap-4 py-4">
                {clientProfiles.map((client) => {
                  const clientTickets = tickets.filter(
                    (t) => t.holder_email.toLowerCase() === client.email.toLowerCase()
                  );
                  return (
                    <div
                      key={client.id}
                      className="p-5 bg-card border border-border hover:border-gold transition-all rounded-none flex items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="space-y-1 min-w-0">
                        <span className="px-2 py-0.5 bg-gold/10 border border-gold/30 text-gold text-[8px] font-black uppercase">
                          Registered Client
                        </span>
                        <h4 className="text-sm font-black uppercase text-foreground truncate">{client.full_name || "Account Member"}</h4>
                        <p className="text-[10px] text-muted-foreground font-mono">{client.email}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-black text-gold block">{clientTickets.length} Ticket(s)</span>
                        <span className="text-[9px] text-muted-foreground uppercase">Joined {new Date(client.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassPanel>
        </div>

        {/* Administrative Personnel Side */}
        <div className="lg:col-span-4 space-y-6">
          <GlassPanel title="Administrative Access" subtitle="Privileged admin force">
            {loadingProfiles ? (
              <div className="py-12 flex items-center justify-center">
                <Loader2 size={24} className="text-gold animate-spin" />
              </div>
            ) : (
              <div className="space-y-4 py-2">
                {adminUsers.map((u) => (
                  <div key={u.id} className="p-4 bg-card border border-border hover:border-blue-500/40 transition-all rounded-none space-y-1">
                    <div className="flex items-center gap-2 text-blue-500 font-black text-[9px] uppercase tracking-widest">
                      <Shield size={12} /> Executive Administrator
                    </div>
                    <h5 className="font-black text-xs uppercase text-foreground">{u.full_name || "PROVISIONED ADMIN"}</h5>
                    <p className="text-[10px] text-muted-foreground font-mono">{u.email}</p>
                  </div>
                ))}
              </div>
            )}
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
