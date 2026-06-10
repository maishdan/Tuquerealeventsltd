import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowUpRight, FileText, CreditCard, CheckCircle2, Clock } from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { financialHub, formatKes } from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";

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
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Finance</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">
          Receipts & <span className="text-gradient-gold">payments</span>
        </h2>
        <p className="mt-2 text-muted-foreground">
          Official receipts issued to clients and payment records across M-Pesa, bank transfer and card.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Total Received" value={formatKes(totalReceived)} icon={ArrowDownLeft} accent="emerald" />
        <KpiCard label="Outstanding" value={formatKes(outstanding)} icon={ArrowUpRight} accent="rose" />
        <KpiCard label="Receipts Issued" value={String(receipts.length)} icon={FileText} accent="gold" />
        <KpiCard label="Paid In Full" value={String(paidCount)} icon={CheckCircle2} accent="primary" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassPanel title="Official Receipts" subtitle="Documents issued to clients">
          <div className="space-y-3">
            {receipts.map((r) => (
              <div key={r.id} className="rounded-xl glass border border-white/10 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-sm text-gold">{r.id}</p>
                    <p className="font-medium mt-1">{r.client}</p>
                    <p className="text-xs text-muted-foreground">{r.event}</p>
                  </div>
                  <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs capitalize", receiptStatusStyles[r.status])}>
                    {r.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{new Date(r.date).toLocaleDateString()}</span>
                  <span className="font-display text-lg text-gradient-gold">{formatKes(r.amount)}</span>
                </div>
                <button
                  type="button"
                  className="mt-3 text-xs uppercase tracking-widest text-gold hover:underline flex items-center gap-1"
                >
                  <FileText size={12} /> Download PDF
                </button>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel title="Payment Records" subtitle="Incoming payments log">
          <div className="space-y-3">
            {payments.map((p) => (
              <div key={p.id} className="rounded-xl glass border border-white/10 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-gold/10 flex items-center justify-center text-gold shrink-0">
                      <CreditCard size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{p.client}</p>
                      <p className="text-xs text-muted-foreground">{p.method} · Ref {p.ref}</p>
                    </div>
                  </div>
                  <span className="font-display text-lg text-gradient-gold">{formatKes(p.amount)}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock size={12} />
                  {new Date(p.date).toLocaleDateString()}
                  <span className="font-mono text-gold ml-auto">{p.id}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      <GlassPanel title="Financial Summary" subtitle="Month-to-date overview">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl glass border border-white/10 p-4 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Cash Flow</p>
            <p className="mt-2 font-display text-2xl text-gradient-gold">{formatKes(financialHub.cashFlow)}</p>
          </div>
          <div className="rounded-xl glass border border-white/10 p-4 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Expenses</p>
            <p className="mt-2 font-display text-2xl">{formatKes(financialHub.expenses)}</p>
          </div>
          <div className="rounded-xl glass border border-white/10 p-4 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Profit Margin</p>
            <p className="mt-2 font-display text-2xl">{financialHub.profitMargin}%</p>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
