import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
import { useAdminTeam, useAdminClients, useAdminTickets, useUpdateUserRole } from "@/hooks/use-dashboard-data";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import type { Profile, UserRole } from "@/lib/database.types";

function RoleSwitch({
  profile,
  disabled,
  pending,
  onChange,
}: {
  profile: Profile;
  disabled?: boolean;
  pending?: boolean;
  onChange: (role: UserRole) => void;
}) {
  const current: UserRole = profile.role === "admin" ? "admin" : "customer";
  return (
    <div className="flex items-center gap-2">
      {pending && <Loader2 size={14} className="animate-spin text-amber-600" />}
      {(["customer", "admin"] as UserRole[]).map((r) => (
        <button
          key={r}
          type="button"
          disabled={disabled || pending || current === r}
          onClick={() => onChange(r)}
          className={cn(
            "px-3 py-1.5 border text-[9px] font-black uppercase tracking-widest rounded-none transition-all cursor-pointer disabled:cursor-not-allowed",
            current === r
              ? r === "admin"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-600 border-slate-300 hover:border-gold hover:text-amber-700",
            disabled && "opacity-40"
          )}
        >
          {r === "admin" ? "Admin" : "Customer"}
        </button>
      ))}
    </div>
  );
}

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

export function AdminUsers() {
  const { data: team = [], isLoading: loadingTeam } = useAdminTeam();
  const { data: profiles = [], isLoading: loadingProfiles } = useAdminClients();
  const { data: tickets = [] } = useAdminTickets();
  const { user } = useAuth();
  const roleMutation = useUpdateUserRole();
  const [roleError, setRoleError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const changeRole = (profile: Profile, role: UserRole) => {
    setRoleError("");
    setPendingId(profile.id);
    roleMutation.mutate(
      { userId: profile.id, role },
      {
        onError: (err) =>
          setRoleError(err instanceof Error ? err.message : "Could not update this person's access."),
        onSettled: () => setPendingId(null),
      }
    );
  };

  const staffMembers = team.map((m) => ({
    id: m.id,
    name: m.full_name,
    role: m.role,
    score: m.performance_score,
    events: m.events_managed,
    type: "staff" as const,
  }));

  const clientProfiles = profiles.filter((p) => p.role === "customer" || !p.role);
  const adminUsers = profiles.filter((p) => p.role === "admin");

  return (
    <div className="space-y-8 pb-20 font-sans text-slate-900">
      {/* Header Section */}
      <div className="bg-white border border-slate-200 p-8 rounded-none shadow-sm flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-700">Governance & Client Directory</p>
          <h2 className="mt-1 text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-900">
            Registered Users & Personnel
          </h2>
        </div>
        <div className="flex gap-4">
          <Link
            to="/admin/bookings"
            className="h-12 px-6 rounded-none bg-gold text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black hover:text-gold transition-all shadow-md cursor-pointer"
          >
            <TicketIcon size={16} /> View Booked Tickets
          </Link>
        </div>
      </div>

      {roleError && (
        <div className="p-4 bg-rose-50 border border-rose-300 text-rose-700 text-[10px] font-black uppercase tracking-widest">
          {roleError}
        </div>
      )}

      {/* KPI Cards (Clean White SaaS Design) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-700">
            <Users size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Registered Clients</span>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight font-mono">{clientProfiles.length}</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm space-y-2">
          <div className="flex items-center justify-between text-blue-600">
            <Shield size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Admins & Staff</span>
          </div>
          <p className="text-3xl font-black text-blue-600 tracking-tight font-mono">{adminUsers.length + staffMembers.length}</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <TicketIcon size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Active Ticket Holders</span>
          </div>
          <p className="text-3xl font-black text-emerald-600 tracking-tight font-mono">{tickets.length}</p>
        </div>
      </div>

      {/* Directory Grids */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Clients Directory */}
        <div className="lg:col-span-8 space-y-6">
          <GlassPanel title="Registered Clients & Ticket Orders" subtitle="Directory of registered client accounts and order volume">
            {loadingProfiles ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-4">
                <Loader2 size={40} className="text-amber-600 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Loading Client Registry...</p>
              </div>
            ) : clientProfiles.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-500 font-bold uppercase tracking-widest">
                No registered clients found in database.
              </div>
            ) : (
              <div className="grid gap-4 py-2">
                {clientProfiles.map((client) => {
                  const clientTickets = tickets.filter(
                    (t) => t.holder_email.toLowerCase() === client.email.toLowerCase()
                  );
                  return (
                    <div
                      key={client.id}
                      className="p-5 bg-slate-50 border border-slate-200 hover:border-gold transition-all rounded-none flex items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-black text-[8px] uppercase">
                          Registered Client
                        </span>
                        <h4 className="text-sm font-black uppercase text-slate-900 truncate">{client.full_name || "Account Member"}</h4>
                        <p className="text-[10px] text-slate-600 font-mono">{client.email}</p>
                      </div>

                      <div className="text-right shrink-0 space-y-2">
                        <span className="text-xs font-mono font-black text-amber-700 block">{clientTickets.length} Ticket(s)</span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase block">Joined {new Date(client.created_at).toLocaleDateString()}</span>
                        <RoleSwitch
                          profile={client}
                          pending={pendingId === client.id}
                          onChange={(role) => changeRole(client, role)}
                        />
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
                <Loader2 size={24} className="text-amber-600 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4 py-2">
                {adminUsers.map((u) => (
                  <div key={u.id} className="p-4 bg-slate-50 border border-slate-200 hover:border-blue-500/40 transition-all rounded-none space-y-1">
                    <div className="flex items-center gap-2 text-blue-600 font-black text-[9px] uppercase tracking-widest">
                      <Shield size={12} /> Executive Administrator
                    </div>
                    <h5 className="font-black text-xs uppercase text-slate-900">{u.full_name || "PROVISIONED ADMIN"}</h5>
                    <p className="text-[10px] text-slate-600 font-mono">{u.email}</p>
                    <div className="pt-2">
                      <RoleSwitch
                        profile={u}
                        disabled={u.id === user?.id}
                        pending={pendingId === u.id}
                        onChange={(role) => changeRole(u, role)}
                      />
                    </div>
                    {u.id === user?.id && (
                      <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">You cannot change your own access</p>
                    )}
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
