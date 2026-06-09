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
  Plus,
  Clock,
  ArrowRight,
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
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const { data: bookings = [] } = useAdminBookings();
  const { data: clients = [] } = useAdminClients();
  const kpis = computeAdminKpis(bookings, clients);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Management Portal</p>
          <h2 className="mt-1 font-display text-2xl sm:text-3xl">
            Business <span className="text-gradient-gold">Command Center</span>
          </h2>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-sm hover:bg-white/5 transition">
            <Clock size={16} /> History
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-black font-semibold text-sm hover:bg-gold/90 transition shadow-[0_0_20px_rgba(212,175,55,0.3)]">
            <Plus size={16} /> New Event
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Today's Revenue" value={formatKes(kpis.todayRevenue)} icon={DollarSign} trend={14} />
        <KpiCard label="Monthly Revenue" value={formatKes(kpis.monthlyRevenue)} icon={TrendingUp} trend={18} accent="primary" />
        <KpiCard label="Active Bookings" value={String(kpis.activeEvents)} icon={CalendarDays} accent="emerald" />
        <KpiCard label="Total Clients" value={String(kpis.totalClients)} icon={Users} trend={6} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <GlassPanel title="Revenue Performance" subtitle="Real-time financial analytics" className="lg:col-span-2">
          <div className="h-[300px] w-full">
            <RevenueChart data={financialHub.monthlyData} />
          </div>
        </GlassPanel>

        <GlassPanel title="Recent Activity" subtitle="Latest system updates">
          <div className="space-y-4">
            {[
              { type: 'Booking', msg: 'New wedding booking from Sarah J.', time: '2m ago', color: 'text-gold' },
              { type: 'Payment', msg: 'Deposit received for Corporate Gala', time: '45m ago', color: 'text-emerald-400' },
              { type: 'Update', msg: 'Contract signed by John Doe', time: '2h ago', color: 'text-blue-400' },
              { type: 'Alert', msg: 'Inventory low: Premium Linens', time: '5h ago', color: 'text-red-400' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-3 items-start group cursor-default">
                <div className={cn("mt-1.5 h-1.5 w-1.5 rounded-full shrink-0", activity.color.replace('text-', 'bg-'))} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] font-bold uppercase tracking-tighter", activity.color)}>{activity.type}</span>
                    <span className="text-[10px] text-muted-foreground">{activity.time}</span>
                  </div>
                  <p className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{activity.msg}</p>
                </div>
              </div>
            ))}
            <button className="w-full mt-4 py-2 text-xs font-medium text-gold hover:underline flex items-center justify-center gap-1">
              View all activity <ArrowRight size={12} />
            </button>
          </div>
        </GlassPanel>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassPanel title="Executive Insights" subtitle="Strategic performance highlights">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["Top Performing Team", ceoInsights.topTeam],
              ["Premier Client", ceoInsights.topClient],
              ["High Yield Segment", ceoInsights.topEventType],
              ["Expansion Target", ceoInsights.growthOpportunity],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl glass border border-white/10 p-4 hover:border-gold/30 transition-colors">
                <dt className="text-[10px] uppercase tracking-widest text-gold/80 font-bold">{label}</dt>
                <dd className="mt-1 text-sm font-medium">{value}</dd>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel title="Top Clients" subtitle="High-value accounts">
          <div className="space-y-3">
            {topClients.slice(0, 4).map((client, i) => (
              <div key={client.name} className="flex items-center justify-between gap-4 rounded-xl glass border border-white/10 px-4 py-3 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-display">
                    {client.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{client.name}</p>
                    <p className="text-[10px] text-muted-foreground">{client.events} successful events</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-gradient-gold shrink-0">{formatKes(client.value)}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
