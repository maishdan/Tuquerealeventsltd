import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlassPanelProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function GlassPanel({ title, subtitle, action, children, className = "" }: GlassPanelProps) {
  return (
    <section className={cn(
      "glass-strong rounded-2xl border overflow-hidden",
      "border-white/10 dark:border-white/10 light:border-black/5",
      className
    )}>
      <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-white/10 sm:px-6">
        <div>
          <h2 className="font-display text-xl sm:text-2xl text-foreground">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-5 sm:p-6 text-foreground">{children}</div>
    </section>
  );
}
