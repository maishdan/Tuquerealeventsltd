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
  Loader2
} from "lucide-react";
import { useAdminTeam, useAdminClients } from "@/hooks/use-dashboard-data";
import { teamPerformance } from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const { data: team = [], isLoading: loadingTeam } = useAdminTeam();
  const { data: profiles = [], isLoading: loadingProfiles } = useAdminClients();

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
    <div className="space-y-10 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Governance & Access</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">Personnel Registry</h2>
        </div>
        <div className="flex gap-4">
          <button className="h-14 px-8 rounded-full bg-gold text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-gold/20">
            <UserPlus size={16} /> Provision Executive
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          <GlassPanel title="Production Force" subtitle="Performance metrics for senior technical staff">
            {loadingTeam ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-4">
                 <Loader2 size={40} className="text-gold animate-spin" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Syncing Force Registry...</p>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                {staffMembers.map((member, i) => (
                  <div key={member.id} className="group flex items-center gap-6 p-5 rounded-[24px] bg-muted/30 border border-border hover:border-gold/30 transition-all duration-300">
                     <div className="h-12 w-12 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-gold transition-colors font-black text-xs shadow-inner">
                        {String(i + 1).padStart(2, '0')}
                     </div>
                     <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-foreground uppercase tracking-tight truncate">{member.name}</h5>
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">{member.role}</p>
                     </div>
                     <div className="text-right flex items-center gap-6">
                        <div className="hidden sm:block">
                           <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">{member.events} PROJECTS</p>
                           <div className="h-1.5 w-20 bg-background rounded-full overflow-hidden border border-border shadow-inner">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${member.score}%` }} />
                           </div>
                        </div>
                        <div>
                           <p className="text-sm font-black text-gold">{member.score}</p>
                           <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">SCORE</p>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </GlassPanel>
        </div>

        <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-right-8 duration-1000">
           <GlassPanel title="Administrative Access" subtitle="Secure privilege registry">
              {loadingProfiles ? (
                 <div className="py-12 flex items-center justify-center">
                    <Loader2 size={24} className="text-gold animate-spin" />
                 </div>
              ) : (
                <div className="space-y-4 py-2">
                   {adminUsers.map((user) => (
                     <div key={user.id} className="group flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border hover:border-blue-500/30 transition-all">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner shrink-0">
                           <Shield size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <h5 className="font-bold text-foreground text-[11px] uppercase tracking-tight truncate">{user.full_name || "PROVISIONED ADMIN"}</h5>
                           <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest truncate">{user.email}</p>
                        </div>
                     </div>
                   ))}
                </div>
              )}
           </GlassPanel>

           <div className="bg-[#121212] border border-white/10 p-8 rounded-[40px] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Fingerprint size={80} />
              </div>
              <div className="relative z-10 space-y-4">
                 <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em]">Security Protocol</h4>
                 <p className="text-gray-500 text-[10px] font-medium leading-relaxed uppercase tracking-widest leading-loose">
                    All executive sessions are logged. Privilege escalation requires manual biometric verification and two-factor clearance.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
