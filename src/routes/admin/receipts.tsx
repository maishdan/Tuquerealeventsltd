import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Download,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { financialHub, formatKes } from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";
import { BackToDashboard } from "@/components/dashboard/BackToDashboard";

export const Route = createFileRoute("/admin/receipts")({
  component: AdminReceipts,
});

const receipts = [
  { id: "RCT-2026-0142", client: "Equity Bank Kenya", event: "Annual Gala 2026", amount: 1_240_000, date: "2026-04-02", status: "paid" as const },
  { id: "RCT-2026-0138", client: "Amara & Joel", event: "Garden Wedding", amount: 680_000, date: "2026-03-28", status: "paid" as const },
  { id: "RCT-2026-0135", client: "Safaricom PLC", event: "Product Launch", amount: 420_000, date: "2026-03-22", status: "pending" as const },
  { id: "RCT-2026-0129", client: "Tech Summit Org", event: "Conference AV", amount: 280_000, date: "2026-03-15", status: "overdue" as const },
  { id: "RCT-2026-0121", client: "Private Client — M.", event: "Birthday Celebration", amount: 190_000, date: "2026-03-08", status: "paid" as const },
];

const payments = [
  { id: "PAY-8841", method: "M-Pesa", client: "Equity Bank Kenya", amount: 620_000, date: "2026-04-01", ref: "QHK7X2B9" },
  { id: "PAY-8836", method: "Bank Transfer", client: "Amara & Joel", amount: 340_000, date: "2026-03-27", ref: "FT260327001" },
  { id: "PAY-8829", method: "M-Pesa", client: "Private Client — M.", amount: 95_000, date: "2026-03-07", ref: "PLM4N8K2" },
  { id: "PAY-8821", method: "Card", client: "Sauti Sol", amount: 1_200_000, date: "2026-02-28", ref: "**** 4821" },
];

const receiptStatusStyles = {
  paid: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
  pending: "border-amber-400/40 bg-amber-500/10 text-amber-300",
  overdue: "border-rose-400/40 bg-rose-500/10 text-rose-300",
};

function AdminReceipts() {
  const totalReceived = payments.reduce((s, p) => s + p.amount, 0);
  const outstanding = receipts.filter((r) => r.status !== "paid").reduce((s, r) => s + r.amount, 0);
  const paidCount = receipts.filter((r) => r.status === "paid").length;

  return (
    <div className="space-y-10 pb-20 font-sans text-white">
      <BackToDashboard role="admin" />

      {/* 1. STRATEGIC HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gold">
            <div className="h-[1px] w-10 bg-gold" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Financial Integrity</p>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter uppercase">Ledger & Receipts</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
            Real-time tracking of empire capital flow. Manage official documentation and verify incoming high-value transactions.
          </p>
        </div>
        <button className="h-14 px-10 rounded-xl bg-gold text-[#0b0e14] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-2xl">
          <FileText size={16} /> Generate New Receipt
        </button>
      </div>

      {/* 2. CORE FINANCIAL METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Capitalized", val: formatKes(totalReceived), icon: TrendingUp, color: "emerald" },
          { label: "Accounts Receivable", val: formatKes(outstanding), icon: ArrowUpRight, color: "amber" },
          { label: "Documents Issued", val: receipts.length, icon: FileText, color: "gold" },
          { label: "Asset Compliance", val: "100%", icon: ShieldCheck, color: "blue" },
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all group">
             <div className="flex justify-between items-start mb-6">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border transition-all",
                  stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                  stat.color === "amber" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
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

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Official Receipts Log */}
        <div className="bg-[#121212] border border-white/10 rounded-[40px] p-10 shadow-2xl space-y-8">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">Official Registry</h4>
            <button className="text-[10px] font-black uppercase text-gold hover:text-white transition-colors">View Full Archive</button>
          </div>

          <div className="space-y-4">
            {receipts.map((r) => (
              <div key={r.id} className="group p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-mono text-[10px] text-gold font-bold">{r.id}</p>
                    <h5 className="font-bold text-white uppercase tracking-tight">{r.client}</h5>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{r.event}</p>
                  </div>
                  <span className={cn("inline-flex rounded-lg border px-3 py-1 text-[8px] font-black uppercase tracking-widest", receiptStatusStyles[r.status])}>
                    {r.status}
                  </span>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{new Date(r.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xl font-black text-white tracking-tight">{formatKes(r.amount)}</p>
                </div>
                <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
                   <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-gold transition-colors">
                      <Download size={14} /> Export Document
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Verification Log */}
        <div className="bg-[#121212] border border-white/10 rounded-[40px] p-10 shadow-2xl space-y-8">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">Payment Verification</h4>
          </div>

          <div className="space-y-4">
            {payments.map((p) => (
              <div key={p.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <h5 className="font-bold text-white uppercase tracking-tight">{p.client}</h5>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{p.method} • REF {p.ref}</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-lg font-black text-emerald-500">{formatKes(p.amount)}</p>
                     <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-1">{p.id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 text-center">
             <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">End of Daily Settlement Log</p>
          </div>
        </div>
      </div>
    </div>
  );
}
