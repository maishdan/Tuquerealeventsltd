import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Trophy,
  Star,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  Target
} from "lucide-react";
import { useAdminTeam } from "@/hooks/use-dashboard-data";
import { teamPerformance } from "@/lib/dashboard-mock-data";
import { BackToDashboard } from "@/components/dashboard/BackToDashboard";
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
    <div className="space-y-10 pb-20 font-sans text-white">
      <BackToDashboard role="admin" />

      {/* 1. STRATEGIC HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gold">
            <div className="h-[1px] w-10 bg-gold" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Human Capital Management</p>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter uppercase">Elite Force</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
            Monitor and evaluate the performance of our senior producers and production specialists. Drive excellence through data-backed delivery metrics.
          </p>
        </div>
      </div>

      {/* 2. CORE PERFORMANCE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Deployment Reliability", val: "98.4%", icon: ShieldCheck, color: "gold" },
          { label: "Talent Retention", val: "94%", icon: Users, color: "blue" },
          { label: "Avg. Mission Score", val: "4.95", icon: Star, color: "emerald" },
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all group">
             <div className="flex justify-between items-start mb-6">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border transition-all",
                  stat.color === "gold" ? "bg-gold/10 text-gold border-gold/20" :
                  stat.color === "blue" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                )}>
                  <stat.icon size={24} />
                </div>
             </div>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">{stat.label}</p>
             <h3 className="text-4xl font-black text-white">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* 3. PERFORMANCE LEADERBOARD */}
      <div className="bg-[#121212] border border-white/10 rounded-[40px] p-10 shadow-2xl space-y-8">
        <div className="flex items-center justify-between">
           <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">Performance Registry</h4>
           <div className="flex gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Live Updates Active</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {members.map((member, i) => (
            <div key={member.name} className="group relative flex items-center gap-6 p-6 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all">
               <div className="absolute top-4 right-6 text-white/5 font-display text-4xl font-black group-hover:text-gold/20 transition-colors">
                  #{i + 1}
               </div>

               <div className="h-16 w-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-display text-2xl font-black shrink-0">
                  {member.name.split(" ").map((n) => n[0]).join("")}
               </div>

               <div className="flex-1 min-w-0">
                  <h5 className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-gold transition-colors">{member.name}</h5>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{member.role}</p>
               </div>

               <div className="text-right space-y-1">
                  <div className="flex items-center justify-end gap-1.5 text-emerald-500">
                     <TrendingUp size={12} />
                     <p className="text-lg font-black">{member.score}</p>
                  </div>
                  <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{member.events} MISSIONS</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
