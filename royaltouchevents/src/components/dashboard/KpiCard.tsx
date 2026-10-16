import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

type KpiCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  accent?: "gold" | "primary" | "emerald" | "rose";
};

const accents = {
  gold: "text-gold bg-gold/15 ring-gold/30",
  primary: "text-primary bg-primary/15 ring-primary/30",
  emerald: "text-emerald-400 bg-emerald-500/15 ring-emerald-500/30",
  rose: "text-rose-400 bg-rose-500/15 ring-rose-500/30",
};

export function KpiCard({ label, value, icon: Icon, trend, accent = "gold" }: KpiCardProps) {
  return (
    <div className="glass-strong rounded-2xl border border-white/15 p-5 tech-glow">
      <div className="flex items-start justify-between gap-3">
        <div className={`h-11 w-11 rounded-xl ring-1 flex items-center justify-center shrink-0 ${accents[accent]}`}>
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <span className={`inline-flex items-center gap-1 text-xs font-medium ${trend >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl sm:text-3xl text-gradient-gold">{value}</p>
    </div>
  );
}
