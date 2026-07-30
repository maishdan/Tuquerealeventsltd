import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { formatKes } from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";
import {
  Receipt,
  Download,
  ShieldCheck,
  Printer,
  CheckCircle2,
  Wallet,
  Clock,
  TrendingUp,
  ArrowUpRight,
  FileText,
  CreditCard,
  Plus
} from "lucide-react";

export const Route = createFileRoute("/admin/receipts")({
  component: AdminReceipts,
});

const receipts = [
  { id: "RCT-2026-0142", client: "Equity Bank Kenya", event: "Annual Gala 2026", amount: 1_240_000, date: "2026-04-02", status: "paid" as const },
  { id: "RCT-2026-0138", client: "Amara & Joel", event: "Garden Wedding", amount: 680_000, date: "2026-03-28", status: "paid" as const },
  { id: "RCT-2026-0135", client: "Safaricom PLC", event: "Product Launch", amount: 420_000, date: "2026-03-22", status: "pending" as const },
];

const payments = [
  { id: "PAY-8841", method: "M-Pesa", client: "Equity Bank Kenya", amount: 620_000, date: "2026-04-01", ref: "QHK7X2B9" },
  { id: "PAY-8836", method: "Bank Transfer", client: "Amara & Joel", amount: 340_000, date: "2026-03-27", ref: "FT260327001" },
];

function AdminReceipts() {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-wrap items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Revenue Ledger</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">Financial Registry</h2>
        </div>
        <div className="flex gap-4">
           <button className="h-14 px-8 rounded-full bg-gold text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-gold/20">
              <Plus size={16} /> Issue Receipt
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", val: formatKes(4820000), icon: TrendingUp, color: "emerald" },
          { label: "Awaiting Clearance", val: formatKes(420000), icon: Clock, color: "amber" },
          { label: "Verified Claims", val: "100%", icon: ShieldCheck, color: "blue" },
          { label: "System Uptime", val: "100%", icon: Zap, color: "gold" },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-[32px] group hover:border-gold/30 transition-all shadow-sm">
             <div className="flex justify-between items-start mb-6">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border transition-all shadow-inner",
                  stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                  stat.color === "amber" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                  stat.color === "blue" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                  "bg-gold/10 text-gold border-gold/20"
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
        <div className="lg:col-span-7 animate-in fade-in slide-in-from-left-8 duration-1000">
          <GlassPanel title="Official Registry" subtitle="Verified executive receipts and documentation">
             <div className="space-y-4 py-2">
                {receipts.map((r) => (
                  <div key={r.id} className="group bg-muted/30 border border-border p-6 rounded-[32px] hover:border-gold/30 transition-all duration-500 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Receipt size={80} />
                     </div>
                     <div className="flex flex-wrap justify-between items-start gap-4 mb-6 relative z-10">
                        <div className="space-y-1">
                           <p className="text-gold font-mono text-[10px] font-black tracking-widest">{r.id}</p>
                           <h4 className="text-xl font-bold text-foreground uppercase tracking-tight">{r.client}</h4>
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{r.event}</p>
                        </div>
                        <div className={cn(
                          "px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest",
                          r.status === 'paid' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                        )}>
                           {r.status}
                        </div>
                     </div>
                     <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase">
                           <Clock size={12} /> {r.date}
                        </div>
                        <p className="text-2xl font-black text-foreground tracking-tighter">{formatKes(r.amount)}</p>
                     </div>
                     <div className="mt-6 pt-6 border-t border-border flex justify-end relative z-10">
                        <button className="h-9 px-6 rounded-full border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:bg-gold hover:text-black hover:border-gold transition-all">
                           Export PDF
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </GlassPanel>
        </div>

        <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000">
           <GlassPanel title="Recent Settlement" subtitle="Payment verification from production channels">
              <div className="space-y-4 py-2">
                 {payments.map((p) => (
                   <div key={p.id} className="p-5 rounded-2xl bg-muted/20 border border-border flex items-center justify-between group hover:bg-muted/40 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground shadow-inner">
                            <CreditCard size={18} />
                         </div>
                         <div>
                            <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{p.client}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{p.method} • {p.ref}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-black text-emerald-500">{formatKes(p.amount)}</p>
                         <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{p.id}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </GlassPanel>

           <div className="bg-[#1a2b4b]/10 border border-blue-500/20 p-8 rounded-[40px] space-y-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <ShieldCheck size={100} />
              </div>
              <div className="relative z-10 space-y-4">
                 <h4 className="text-blue-400 font-black text-[10px] uppercase tracking-[0.3em]">Compliance Check</h4>
                 <p className="text-blue-100/60 text-[10px] font-medium leading-relaxed uppercase tracking-widest leading-loose">
                    Automated audit systems are cross-referencing all settlements against the master registry. Financial integrity is 100%.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function Zap({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 14.71 11.5 3 13 10h7l-7.5 11.71L11 14H4z" />
    </svg>
  );
}
