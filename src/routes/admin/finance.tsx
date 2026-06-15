import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowUpRight, FileWarning, PieChart, TrendingUp, ShieldCheck } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { financialHub, formatKes } from "@/lib/dashboard-mock-data";
import { BackToDashboard } from "@/components/dashboard/BackToDashboard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/finance")({
  component: AdminFinance,
});

function AdminFinance() {
  return (
    <div className="space-y-10 pb-20 font-sans text-white">
      <BackToDashboard role="admin" />

      {/* 1. STRATEGIC HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gold">
            <div className="h-[1px] w-10 bg-gold" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Empire Capital Hub</p>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter uppercase">Financial Hub</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
            Strategic oversight of revenue trajectories, operational expenses, and profit margins across all empire disciplines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Gross Capital", val: formatKes(financialHub.cashFlow), icon: TrendingUp, color: "emerald" },
          { label: "Operational Burn", val: formatKes(financialHub.expenses), icon: ArrowUpRight, color: "rose" },
          { label: "Pending Invoices", val: formatKes(financialHub.outstandingInvoices), icon: FileWarning, color: "gold" },
          { label: "Executive Margin", val: `${financialHub.profitMargin}%`, icon: ShieldCheck, color: "blue" },
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all group">
             <div className="flex justify-between items-start mb-6">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border transition-all",
                  stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                  stat.color === "rose" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                  stat.color === "gold" ? "bg-gold/10 text-gold border-gold/20" :
                  "bg-blue-500/10 text-blue-500 border-blue-500/20"
                )}>
                  <stat.icon size={24} />
                </div>
             </div>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">{stat.label}</p>
             <h3 className="text-2xl font-black text-white">{stat.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-[#121212] border border-white/10 rounded-[40px] overflow-hidden p-10 shadow-2xl">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.4em] mb-12">Revenue Trajectory Analysis</h4>
              <div className="h-[400px] w-full">
                 <RevenueChart data={financialHub.monthlyData} />
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-[#121212] border border-white/10 rounded-[40px] p-10 shadow-2xl space-y-8">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">Discipline Margins</h4>
              <div className="space-y-4">
                 {[
                   { type: "Corporate Events", margin: 32 },
                   { type: "Weddings", margin: 28 },
                   { type: "Concerts", margin: 35 },
                   { type: "Conferences", margin: 26 },
                   { type: "Private Parties", margin: 22 },
                 ].map((row) => (
                   <div key={row.type} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{row.type}</span>
                     <span className="text-gold font-bold text-xs">{row.margin}%</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-[#121212] border border-white/10 rounded-[40px] p-10 shadow-2xl space-y-8">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">High-Value Receivables</h4>
              <div className="space-y-4">
                 {[
                   { client: "Safaricom", amount: 420_000, due: "Apr 10" },
                   { client: "Tech Summit Org", amount: 280_000, due: "Apr 14" },
                   { client: "Private Client — M.", amount: 190_000, due: "Apr 20" },
                 ].map((inv) => (
                   <div key={inv.client} className="flex flex-col gap-2 p-4 rounded-2xl border border-white/5 bg-white/[0.02]">
                      <div className="flex justify-between items-start">
                         <h5 className="font-bold text-white text-xs uppercase tracking-tight">{inv.client}</h5>
                         <span className="text-gold font-black text-xs">{formatKes(inv.amount)}</span>
                      </div>
                      <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Due {inv.due}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
