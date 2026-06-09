import { createFileRoute } from "@tanstack/react-router";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { eventCategories, formatKes } from "@/lib/dashboard-mock-data";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Event Categories</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">
          Portfolio <span className="text-gradient-gold">Breakdown</span>
        </h2>
        <p className="mt-2 text-muted-foreground">Weddings, corporate, conferences, concerts and private parties.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {eventCategories.map((cat) => (
          <div key={cat.name} className="glass-strong rounded-2xl border border-white/15 p-6 tech-glow">
            <p className="font-display text-2xl">{cat.name}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Events</p>
                <p className="font-display text-3xl text-gradient-gold mt-1">{cat.count}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Revenue</p>
                <p className="text-sm font-medium mt-2">{formatKes(cat.revenue)}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-emerald-400">+{cat.growth}% YoY growth</p>
          </div>
        ))}
      </div>

      <GlassPanel title="Category Performance" subtitle="Revenue share visualization">
        <div className="space-y-3">
          {eventCategories.map((cat) => {
            const total = eventCategories.reduce((s, c) => s + c.revenue, 0);
            const pct = Math.round((cat.revenue / total) * 100);
            return (
              <div key={cat.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{cat.name}</span>
                  <span className="text-gold">{pct}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-gold/80 to-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </GlassPanel>
    </div>
  );
}
