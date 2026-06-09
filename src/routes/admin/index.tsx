import { createFileRoute } from "@tanstack/react-router";
import {
  DollarSign,
  CalendarDays,
  Users,
  TrendingUp,
  Wallet,
  Percent,
  FileSignature,
  BarChart3,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import {
  ceoInsights,
  executiveKpis,
  financialHub,
  formatKes,
  formatPercent,
  topClients,
} from "@/lib/dashboard-mock-data";
import { useAdminBookings, useAdminClients, computeAdminKpis } from "@/hooks/use-dashboard-data";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { data: bookings = [] } = useAdminBookings();
  const { data: clients = [] } = useAdminClients();
  const kpis = computeAdminKpis(bookings, clients);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Executive Overview</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">
          Luxury <span className="text-gradient-gold">Executive</span> Dashboard
        </h2>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Real-time business intelligence for weddings, corporate events, concerts and conferences.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Today's Revenue" value={formatKes(kpis.todayRevenue)} icon={DollarSign} trend={14} />
        <KpiCard label="Monthly Revenue" value={formatKes(kpis.monthlyRevenue)} icon={TrendingUp} trend={18} accent="primary" />
        <KpiCard label="Active Bookings" value={String(kpis.activeEvents)} icon={CalendarDays} accent="emerald" />
        <KpiCard label="Total Clients" value={String(kpis.totalClients)} icon={Users} trend={6} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard label="Total Revenue" value={formatKes(executiveKpis.totalRevenue)} icon={Wallet} trend={22} />
        <KpiCard label="Net Profit" value={formatKes(executiveKpis.netProfit)} icon={DollarSign} trend={11} accent="emerald" />
        <KpiCard label="Bookings This Month" value={String(kpis.eventsThisMonth)} icon={CalendarDays} accent="primary" />
        <KpiCard label="Client Retention" value={formatPercent(executiveKpis.clientRetention)} icon={Percent} trend={3} />
        <KpiCard label="New Contracts" value={String(kpis.newContracts)} icon={FileSignature} accent="gold" />
        <KpiCard label="Avg Event Value" value={formatKes(executiveKpis.avgEventValue)} icon={BarChart3} trend={9} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <GlassPanel title="Revenue Growth" subtitle="Monthly performance (KES millions)" className="lg:col-span-2">
          <RevenueChart data={financialHub.monthlyData} />
        </GlassPanel>

        <GlassPanel title="CEO Insights" subtitle="Strategic highlights">
          <dl className="space-y-4">
            {[
              ["Top Performing Team", ceoInsights.topTeam],
              ["Top Client", ceoInsights.topClient],
              ["Most Profitable Event Type", ceoInsights.topEventType],
              ["Growth Opportunity", ceoInsights.growthOpportunity],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl glass border border-white/10 p-4">
                <dt className="text-xs uppercase tracking-widest text-gold">{label}</dt>
                <dd className="mt-1 text-sm text-foreground/90">{value}</dd>
              </div>
            ))}
          </dl>
        </GlassPanel>
      </div>

      <GlassPanel title="Top Clients" subtitle="By contract value">
        <div className="space-y-3">
          {topClients.map((client, i) => (
            <div key={client.name} className="flex items-center justify-between gap-4 rounded-xl glass border border-white/10 px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-display text-lg text-gold w-6">{i + 1}</span>
                <div className="min-w-0">
                  <p className="font-medium truncate">{client.name}</p>
                  <p className="text-xs text-muted-foreground">{client.events} events</p>
                </div>
              </div>
              <p className="text-sm font-medium text-gradient-gold shrink-0">{formatKes(client.value)}</p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
