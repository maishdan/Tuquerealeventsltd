import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bot,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Zap,
  Target,
  BarChart3
} from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { aiInsights, formatKes } from "@/lib/dashboard-mock-data";
import { BackToDashboard } from "@/components/dashboard/BackToDashboard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/ai")({
  component: AdminAI,
});

function AdminAI() {
  return (
    <div className="space-y-10 pb-20 font-sans text-white">
      <BackToDashboard role="admin" />

      {/* 1. STRATEGIC HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gold">
            <div className="h-[1px] w-10 bg-gold" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">CEO Intelligence Hub</p>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter uppercase">Predictive Analysis</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
            AI-driven forecasting and strategic recommendations based on 12 months of historical performance and market behavioral data.
          </p>
        </div>
      </div>

      {/* 2. CORE INTELLIGENCE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: "Predicted Revenue", val: formatKes(aiInsights.predictedRevenue), icon: TrendingUp, color: "blue" },
          { label: "Success Forecast", val: `${aiInsights.successForecast}%`, icon: Sparkles, color: "gold" },
          { label: "Anomalies Detected", val: aiInsights.highRiskEvents, icon: AlertTriangle, color: "rose" },
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all group">
             <div className="flex justify-between items-start mb-6">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border transition-all",
                  stat.color === "blue" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                  stat.color === "gold" ? "bg-gold/10 text-gold border-gold/20" :
                  "bg-rose-500/10 text-rose-500 border-rose-500/20"
                )}>
                  <stat.icon size={24} />
                </div>
             </div>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">{stat.label}</p>
             <h3 className="text-3xl font-black text-white">{stat.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pricing Strategy */}
        <div className="bg-[#121212] border border-white/10 rounded-[40px] p-10 shadow-2xl space-y-8">
           <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">Pricing Optimization</h4>
           <div className="bg-gold/5 border border-gold/20 p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-4 text-gold">
                 <DollarSign size={24} />
                 <p className="font-bold text-lg leading-tight uppercase">{aiInsights.pricingSuggestion}</p>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">Projected impact: <span className="text-emerald-500 font-bold">+KES 340,000</span> monthly revenue with minimal client friction risk.</p>
           </div>
        </div>

        {/* Top Drivers */}
        <div className="bg-[#121212] border border-white/10 rounded-[40px] p-10 shadow-2xl space-y-8">
           <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">High-Velocity Disciplines</h4>
           <div className="space-y-4">
              {aiInsights.topServices.map((service, i) => (
                <div key={service} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02] group hover:border-gold transition-colors">
                   <div className="flex items-center gap-4">
                      <span className="text-gold font-black text-xs">0{i + 1}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">{service}</span>
                   </div>
                   <ArrowRight size={14} className="text-gray-700 group-hover:text-gold transition-colors" />
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Risk Alert Board */}
      <div className="bg-[#121212] border border-white/10 rounded-[40px] p-10 shadow-2xl space-y-8">
         <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">Strategic Alert Registry</h4>
         <div className="grid md:grid-cols-2 gap-4">
           {[
             { event: "Tech Summit 2026", risk: "Vendor delay — AV rigging", level: "Critical" },
             { event: "Afro-Beats Night Live", risk: "Weather contingency required", level: "Moderate" },
           ].map((alert) => (
             <div key={alert.event} className="p-6 rounded-3xl border border-rose-500/20 bg-rose-500/5 space-y-4">
                <div className="flex justify-between items-center">
                   <h5 className="font-bold text-white text-sm uppercase tracking-tight">{alert.event}</h5>
                   <span className="px-2 py-0.5 rounded bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest">{alert.level}</span>
                </div>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest leading-relaxed">{alert.risk}</p>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
}
