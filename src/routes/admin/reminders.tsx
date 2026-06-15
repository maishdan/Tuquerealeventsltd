import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BellRing,
  ClipboardCheck,
  DollarSign,
  CalendarClock,
  Users,
  GitBranch,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight
} from "lucide-react";
import { BackToDashboard } from "@/components/dashboard/BackToDashboard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/reminders")({
  component: AdminReminders,
});

const tiles = [
  { label: "High-Priority Inquiries", value: "48", icon: BellRing, color: "gold" },
  { label: "Active Commitments", value: "23", icon: ClipboardCheck, color: "emerald" },
  { label: "Capital Flow Status", value: "KES 4.82M", icon: DollarSign, color: "blue" },
  { label: "Mission Calendar", value: "12 Events", icon: CalendarClock, color: "purple" },
  { label: "Command Staff", value: "9 Active", icon: Users, color: "amber" },
  { label: "Market Pipeline", value: "31 Leads", icon: GitBranch, color: "rose" },
];

function AdminReminders() {
  return (
    <div className="space-y-10 pb-20 font-sans text-white">
      <BackToDashboard role="admin" />

      {/* 1. STRATEGIC HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gold">
            <div className="h-[1px] w-10 bg-gold" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Operations Awareness</p>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter uppercase">Executive Pulse</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
            Real-time critical indicators across all empire divisions. Monitor high-priority items that require immediate executive attention.
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-black uppercase tracking-widest">
           <Zap size={14} className="fill-gold" /> Critical Path Active
        </div>
      </div>

      {/* 2. REMINDER TILES (MATCHES SITE DESIGN) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiles.map((t, i) => (
          <div key={i} className="group relative flex flex-col justify-between p-8 rounded-[40px] bg-[#121212] border border-white/10 hover:border-gold/30 transition-all duration-500 overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-bl-[100px] -mr-8 -mt-8 transition-all group-hover:bg-gold/5" />

             <div className="relative z-10 flex justify-between items-start mb-10">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border transition-all",
                  t.color === "gold" ? "bg-gold/10 text-gold border-gold/20" :
                  t.color === "emerald" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                  t.color === "blue" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                  t.color === "purple" ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                  t.color === "amber" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                  "bg-rose-500/10 text-rose-500 border-rose-500/20"
                )}>
                  <t.icon size={24} />
                </div>
                <div className="text-right">
                   <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Status</p>
                   <p className="text-[10px] font-black text-white uppercase tracking-widest">Operational</p>
                </div>
             </div>

             <div className="relative z-10 space-y-2">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">{t.label}</p>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter group-hover:text-gold transition-colors">{t.value}</h3>
             </div>

             <div className="relative z-10 mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                   <Clock size={12} /> Sync 2m ago
                </span>
                <ArrowRight size={16} className="text-gray-800 group-hover:text-gold group-hover:translate-x-1 transition-all" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
