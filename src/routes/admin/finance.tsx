import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowUpRight, FileWarning, PieChart } from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { financialHub, formatKes } from "@/lib/dashboard-mock-data";

export const Route = createFileRoute("/admin/finance")({
  component: AdminFinance,
});

function AdminFinance() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Financial Hub</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">
          Finance <span className="text-gradient-gold">Command</span>
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Cash Flow" value={formatKes(financialHub.cashFlow)} icon={ArrowDownLeft} trend={12} accent="emerald" />
        <KpiCard label="Expenses" value={formatKes(financialHub.expenses)} icon={ArrowUpRight} trend={-4} accent="rose" />
        <KpiCard label="Outstanding Invoices" value={formatKes(financialHub.outstandingInvoices)} icon={FileWarning} accent="gold" />
        <KpiCard label="Profit Margin" value={`${financialHub.profitMargin}%`} icon={PieChart} trend={5} accent="primary" />
      </div>

      <GlassPanel title="Revenue Analytics" subtitle="Income vs expenses trend">
        <RevenueChart data={financialHub.monthlyData} />
      </GlassPanel>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassPanel title="Profit Analysis" subtitle="By event category">
          <div className="space-y-3">
            {[
              { type: "Corporate Events", margin: 32 },
              { type: "Weddings", margin: 28 },
              { type: "Concerts", margin: 35 },
              { type: "Conferences", margin: 26 },
              { type: "Private Parties", margin: 22 },
            ].map((row) => (
              <div key={row.type} className="flex items-center justify-between rounded-xl glass border border-white/10 px-4 py-3">
                <span className="text-sm">{row.type}</span>
                <span className="text-gold font-medium">{row.margin}% margin</span>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel title="Outstanding Invoices" subtitle="Requires follow-up">
          <div className="space-y-3">
            {[
              { client: "Safaricom", amount: 420_000, due: "Apr 10" },
              { client: "Tech Summit Org", amount: 280_000, due: "Apr 14" },
              { client: "Private Client — M.", amount: 190_000, due: "Apr 20" },
            ].map((inv) => (
              <div key={inv.client} className="flex items-center justify-between gap-4 rounded-xl glass border border-white/10 px-4 py-3">
                <div>
                  <p className="font-medium text-sm">{inv.client}</p>
                  <p className="text-xs text-muted-foreground">Due {inv.due}</p>
                </div>
                <p className="text-sm text-gold shrink-0">{formatKes(inv.amount)}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
