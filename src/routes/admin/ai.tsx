import { createFileRoute } from "@tanstack/react-router";
import { Bot, TrendingUp, AlertTriangle, DollarSign, Sparkles } from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { aiInsights, formatKes } from "@/lib/dashboard-mock-data";

export const Route = createFileRoute("/admin/ai")({
  component: AdminAI,
});

function AdminAI() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">AI-Powered Insights</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">
          Futuristic <span className="text-gradient-gold">CEO Intelligence</span>
        </h2>
        <p className="mt-2 text-muted-foreground">Predictive analytics and strategic recommendations.</p>
      </div>

      <div className="glass-strong rounded-2xl border border-gold/30 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-gold/10 pointer-events-none" />
        <div className="relative flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
            <Bot size={28} />
          </div>
          <div>
            <h3 className="font-display text-2xl">AI Assistant Panel</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              Based on 12 months of event data, client behaviour and market trends across East Africa.
            </p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          { label: "Predicted Revenue (Next Month)", value: formatKes(aiInsights.predictedRevenue), icon: TrendingUp, accent: "emerald" as const },
          { label: "Event Success Forecast", value: `${aiInsights.successForecast}%`, icon: Sparkles, accent: "gold" as const },
          { label: "High-Risk Events", value: String(aiInsights.highRiskEvents), icon: AlertTriangle, accent: "rose" as const },
        ].map((item) => (
          <div key={item.label} className="glass-strong rounded-2xl border border-white/15 p-6">
            <item.icon size={22} className="text-gold" />
            <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{item.label}</p>
            <p className="mt-2 font-display text-3xl text-gradient-gold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassPanel title="Suggested Pricing Adjustments" subtitle="AI recommendation">
          <div className="rounded-xl glass border border-gold/30 p-5">
            <div className="flex items-center gap-3">
              <DollarSign className="text-gold" size={20} />
              <p className="text-sm">{aiInsights.pricingSuggestion}</p>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Projected impact: +KES 340,000 monthly revenue with minimal churn risk.
            </p>
          </div>
        </GlassPanel>

        <GlassPanel title="Best Performing Services" subtitle="Top revenue drivers">
          <div className="space-y-3">
            {aiInsights.topServices.map((service, i) => (
              <div key={service} className="flex items-center gap-3 rounded-xl glass border border-white/10 px-4 py-3">
                <span className="font-display text-lg text-gold">{i + 1}</span>
                <span className="text-sm">{service}</span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      <GlassPanel title="Risk Alerts" subtitle="Events requiring executive attention">
        <div className="space-y-3">
          {[
            { event: "Tech Summit 2026", risk: "Vendor delay — AV rigging", level: "High" },
            { event: "Afro-Beats Night Live", risk: "Weather contingency needed", level: "Medium" },
          ].map((alert) => (
            <div key={alert.event} className="flex items-center justify-between gap-4 rounded-xl border border-rose-400/30 bg-rose-500/5 px-4 py-3">
              <div>
                <p className="font-medium text-sm">{alert.event}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.risk}</p>
              </div>
              <span className="text-xs uppercase tracking-widest text-rose-400 shrink-0">{alert.level}</span>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
