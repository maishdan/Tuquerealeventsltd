import { createFileRoute } from "@tanstack/react-router";
import { Shield, UserCog } from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { useAdminTeam, useAdminClients } from "@/hooks/use-dashboard-data";
import { teamPerformance } from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const { data: team = [], isLoading: loadingTeam } = useAdminTeam();
  const { data: profiles = [] } = useAdminClients();

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

  const adminUsers = profiles.filter((p) => p.role === "admin");

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">User Management</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">
          Staff & <span className="text-gradient-gold">admins</span>
        </h2>
        <p className="mt-2 text-muted-foreground">
          Internal team members and dashboard administrators who manage Royal Touch Events operations.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass-strong rounded-2xl border border-white/15 p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Staff Members</p>
          <p className="mt-2 font-display text-3xl text-gradient-gold">{staffMembers.length}</p>
        </div>
        <div className="glass-strong rounded-2xl border border-white/15 p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Admin Accounts</p>
          <p className="mt-2 font-display text-3xl">{adminUsers.length}</p>
        </div>
        <div className="glass-strong rounded-2xl border border-white/15 p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Avg Performance</p>
          <p className="mt-2 font-display text-3xl">
            {staffMembers.length
              ? Math.round(staffMembers.reduce((s, m) => s + m.score, 0) / staffMembers.length)
              : "—"}
          </p>
        </div>
      </div>

      <GlassPanel title="Staff & Production Team" subtitle="Performance-ranked internal users">
        {loadingTeam && <p className="text-sm text-muted-foreground">Loading team…</p>}
        <div className="space-y-3">
          {staffMembers.map((member, i) => (
            <div key={member.id} className="flex items-center gap-4 rounded-xl glass border border-white/10 p-4 sm:p-5">
              <span className="font-display text-2xl text-gold w-8 shrink-0">#{i + 1}</span>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/40 to-gold/40 flex items-center justify-center font-display text-lg shrink-0">
                {member.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg">{member.name}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{member.role}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display text-2xl text-gradient-gold">{member.score}</p>
                <p className="text-xs text-muted-foreground">{member.events} events</p>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel title="Admin Accounts" subtitle="Users with administrator access">
        {adminUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No admin profiles found. Assign the admin role in Supabase profiles table.
          </p>
        ) : (
          <div className="space-y-3">
            {adminUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-4 rounded-xl glass border border-white/10 p-4">
                <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                  <Shield size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{user.full_name || "Unnamed admin"}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
                <span className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold capitalize",
                )}>
                  <UserCog size={12} />
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
