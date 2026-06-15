import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shield,
  UserCog,
  Users,
  Star,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  UserPlus
} from "lucide-react";
import { useAdminTeam, useAdminClients } from "@/hooks/use-dashboard-data";
import { teamPerformance } from "@/lib/dashboard-mock-data";
import { BackToDashboard } from "@/components/dashboard/BackToDashboard";
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
    <div className="space-y-10 pb-20 font-sans text-white">
      <BackToDashboard role="admin" />

      {/* 1. STRATEGIC HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gold">
            <div className="h-[1px] w-10 bg-gold" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Governance & Access</p>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter uppercase">Internal Forces</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
            Manage administrative privileges and internal production hierarchies. Maintain the strategic integrity of empire operations.
          </p>
        </div>
        <button className="h-14 px-10 rounded-xl bg-gold text-[#0b0e14] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-2xl">
          <UserPlus size={16} /> provision New Member
        </button>
      </div>

      {/* 2. CORE ACCESS METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Producers", val: staffMembers.length, icon: Users, color: "gold" },
          { label: "Executive Admins", val: adminUsers.length, icon: ShieldCheck, color: "blue" },
          { label: "Force Efficiency", val: "92%", icon: TrendingUp, color: "emerald" },
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

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Production Team Registry */}
        <div className="bg-[#121212] border border-white/10 rounded-[40px] p-10 shadow-2xl space-y-8">
           <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">Production Registry</h4>
           <div className="space-y-4">
              {staffMembers.map((member, i) => (
                <div key={member.id} className="group flex items-center gap-6 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all">
                   <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 border border-white/10 group-hover:text-gold transition-colors font-black">
                      {i + 1}
                   </div>
                   <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-white uppercase tracking-tight truncate">{member.name}</h5>
                      <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{member.role}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-black text-gold">{member.score}</p>
                      <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{member.events} EVENTS</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Executive Access Registry */}
        <div className="bg-[#121212] border border-white/10 rounded-[40px] p-10 shadow-2xl space-y-8">
           <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">Executive Access Registry</h4>
           <div className="space-y-4">
              {adminUsers.map((user) => (
                <div key={user.id} className="group flex items-center gap-6 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all">
                   <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                      <Shield size={20} />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-white uppercase tracking-tight truncate">{user.full_name || "PROVISIONED ADMIN"}</h5>
                      <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest truncate">{user.email}</p>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-widest">
                      <UserCog size={10} /> {user.role}
                   </div>
                </div>
              ))}
              {adminUsers.length === 0 && (
                <p className="text-center py-12 text-[10px] font-black text-gray-600 uppercase tracking-widest">No Secondary Administrators Discovered</p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
