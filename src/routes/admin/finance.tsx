import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { financialHub, formatKes } from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";
import {
  ArrowDownLeft,
  ArrowUpRight,
  FileWarning,
  PieChart,
  TrendingUp,
  ShieldCheck,
  Zap,
  Wallet,
  ArrowRight
} from "lucide-react";

export const Route = createFileRoute("/admin/finance")({
  component: AdminFinance,
});

function AdminFinance() {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Empire Capital Hub</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">Financial Hub</h2>
        </div>
        <div className="flex gap-4">
           <Link to="/admin/receipts" className="h-14 px-8 rounded-full border border-border bg-card text-muted-foreground font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:text-gold transition-all">
              Revenue Ledger <ArrowRight size={16} />
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Gross Capital", val: formatKes(financialHub.cashFlow), icon: TrendingUp, color: "emerald" },
          { label: "Operational Burn", val: formatKes(financialHub.expenses), icon: ArrowUpRight, color: "rose" },
          { label: "Pending Invoices", val: formatKes(financialHub.outstandingInvoices), icon: FileWarning, color: "gold" },
          { label: "Executive Margin", val: `${financialHub.profitMargin}%`, icon: ShieldCheck, color: "blue" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-[32px] group hover:border-gold/30 transition-all shadow-sm">
             <div className="flex justify-between items-start mb-6">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border transition-all shadow-inner",
                  stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                  stat.color === "rose" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                  stat.color === "gold" ? "bg-gold/10 text-gold border-gold/20" :
                  "bg-blue-500/10 text-blue-500 border-blue-500/20"
                )}>
                  <stat.icon size={24} />
                </div>
             </div>
             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">{stat.label}</p>
             <h3 className="text-xl font-black text-foreground">{stat.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 animate-in fade-in slide-in-from-left-8 duration-1000">
           <GlassPanel title="Revenue Trajectory" subtitle="High-precision analysis of monthly capital intake">
              <div className="h-[450px] w-full pt-10">
                 <RevenueChart data={financialHub.monthlyData} />
              </div>
           </GlassPanel>
        </div>

        <div className="lg:col-span-4 space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000">
           <GlassPanel title="Sector Margins" subtitle="Operational efficiency per discipline">
              <div className="space-y-4 py-2">
                 {[
                   { type: "Corporate Events", margin: 32 },
                   { type: "Luxury Weddings", margin: 28 },
                   { type: "Public Concerts", margin: 35 },
                   { type: "Strategic Summits", margin: 26 },
                 ].map((row) => (
                   <div key={row.type} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-muted/30 group hover:bg-muted transition-colors">
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{row.type}</span>
                     <span className="text-gold font-black text-xs">{row.margin}%</span>
                   </div>
                 ))}
              </div>
           </GlassPanel>

           <div className="bg-[#121212] border border-white/10 p-8 rounded-[40px] space-y-8 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Zap size={100} />
              </div>
              <div className="relative z-10 space-y-4">
                 <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em]">Capital Forecast</h4>
                 <div className="space-y-4">
                    <p className="text-3xl font-black text-white tracking-tighter">KSh 12.4M</p>
                    <p className="text-[9px] font-medium text-gray-500 leading-relaxed uppercase tracking-widest leading-loose">
                       Projected revenue for Q3 2026 based on active registry briefs and confirmed production slots.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
