import { createFileRoute } from "@tanstack/react-router";
import {
  History,
  Search,
  Filter,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  Globe
} from "lucide-react";
import { BackToDashboard } from "@/components/dashboard/BackToDashboard";
import { formatKes } from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/payment-history")({
  component: PaymentHistory,
});

const log = [
  { id: "PAY-8841", method: "M-Pesa", client: "Equity Bank Kenya", amount: 620_000, date: "2026-04-01", ref: "QHK7X2B9", status: "Verified" },
  { id: "PAY-8836", method: "Bank Transfer", client: "Amara & Joel", amount: 340_000, date: "2026-03-27", ref: "FT260327001", status: "Verified" },
  { id: "PAY-8829", method: "M-Pesa", client: "Private Client — M.", amount: 95_000, date: "2026-03-07", ref: "PLM4N8K2", status: "Verified" },
  { id: "PAY-8821", method: "Card", client: "Sauti Sol", amount: 1_200_000, date: "2026-02-28", ref: "**** 4821", status: "Verified" },
  { id: "PAY-8815", method: "M-Pesa", client: "Standard Chartered", amount: 450_000, date: "2026-02-15", ref: "LMN0O1P2", status: "Verified" },
];

function PaymentHistory() {
  return (
    <div className="space-y-10 pb-20 font-sans text-white">
      <BackToDashboard role="admin" />

      {/* 1. STRATEGIC HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gold">
            <div className="h-[1px] w-10 bg-gold" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Audit Trail</p>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter uppercase">Settlement History</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
            Immutable log of all financial settlements across the empire. Verify transactional integrity and historical capital flow.
          </p>
        </div>
      </div>

      {/* 2. SUMMARY TILES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Historical Settlement", val: formatKes(log.reduce((s, p) => s + p.amount, 0)), icon: TrendingUp, color: "emerald" },
          { label: "Verified Transactions", val: log.length, icon: ShieldCheck, color: "blue" },
          { label: "Global Coverage", val: "100%", icon: Globe, color: "gold" },
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all group">
             <div className="flex justify-between items-start mb-6">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border transition-all",
                  stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                  stat.color === "blue" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                  "bg-gold/10 text-gold border-gold/20"
                )}>
                  <stat.icon size={24} />
                </div>
             </div>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">{stat.label}</p>
             <h3 className="text-3xl font-black text-white">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* 3. LOG REGISTRY */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search audit trail..."
                className="w-full bg-transparent border-none pl-12 pr-6 py-2 text-sm text-white focus:ring-0 outline-none"
              />
           </div>
           <div className="h-8 w-[1px] bg-white/5" />
           <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
              <Filter size={14} /> Audit
           </button>
        </div>

        <div className="bg-[#121212] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 border-b border-white/5">
              <tr className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
                <th className="px-8 py-6">Reference</th>
                <th className="px-8 py-6">Client Identity</th>
                <th className="px-8 py-6">Method</th>
                <th className="px-8 py-6">Value</th>
                <th className="px-8 py-6">Date</th>
                <th className="px-8 py-6 text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {log.map((p) => (
                <tr key={p.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-8 py-6 font-mono text-[10px] text-gold font-bold">{p.ref}</td>
                  <td className="px-8 py-6 font-bold text-white uppercase tracking-tight text-xs">{p.client}</td>
                  <td className="px-8 py-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">{p.method}</td>
                  <td className="px-8 py-6 font-black text-white text-xs">{formatKes(p.amount)}</td>
                  <td className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.date}</td>
                  <td className="px-8 py-6 text-right">
                     <div className="flex items-center justify-end gap-2 text-emerald-500">
                        <CheckCircle2 size={12} />
                        <span className="text-[8px] font-black uppercase tracking-widest">{p.status}</span>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
