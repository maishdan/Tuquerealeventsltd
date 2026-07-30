import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import {
  Users,
  Trophy,
  Star,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  Target,
  Zap,
  Briefcase
} from "lucide-react";
import { useAdminTeam } from "@/hooks/use-dashboard-data";
import { teamPerformance } from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/team")({
  component: AdminTeam,
});

function AdminTeam() {
  const { data: team = [] } = useAdminTeam();
  const members = team.length > 0
    ? team.map((m) => ({ name: m.full_name, role: m.role, score: m.performance_score, events: m.events_managed }))
    : teamPerformance;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Operational Force</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">Personnel</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Technical Readiness", val: "98.4%", icon: ShieldCheck, color: "gold" },
          { label: "Deployment Scale", val: team.length || members.length, icon: Users, color: "blue" },
          { label: "Elite Performance", val: "Elite", icon: Trophy, color: "emerald" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-[32px] group hover:border-gold/30 transition-all shadow-sm">
             <div className="flex justify-between items-start mb-6">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border transition-all shadow-inner",
                  stat.color === "gold" ? "bg-gold/10 text-gold border-gold/20" :
                  stat.color === "blue" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                )}>
                  <stat.icon size={24} />
                </div>
             </div>
             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">{stat.label}</p>
             <h3 className="text-xl font-black text-foreground">{stat.val}</h3>
          </div>
        ))}
      </div>

      <GlassPanel title="Force Registry" subtitle="Individual performance metrics for senior production staff">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {members.map((member, i) => (
              <div key={member.name} className="group bg-muted/30 border border-border p-8 rounded-[40px] hover:border-gold/30 transition-all duration-500 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                    <Target size={120} />
                 </div>

                 <div className="flex items-center gap-6 relative z-10">
                    <div className="h-16 w-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-display text-3xl font-black shadow-inner group-hover:bg-gold group-hover:text-black transition-all shrink-0">
                       {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-xl font-bold text-foreground uppercase tracking-tight group-hover:text-gold transition-colors truncate">{member.name}</h4>
                       <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">{member.role}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-gold">{member.score}</p>
                       <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">METRIC</p>
                    </div>
                 </div>

                 <div className="mt-8 pt-6 border-t border-border flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                       <Briefcase size={14} className="text-muted-foreground opacity-50" />
                       <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{member.events} Missions Managed</span>
                    </div>
                    <div className="flex items-center gap-1">
                       {[1, 2, 3, 4, 5].map((star) => (
                         <Star key={star} size={10} className={cn("fill-current", star <= 5 ? "text-gold" : "text-muted")} />
                       ))}
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </GlassPanel>
    </div>
  );
}
