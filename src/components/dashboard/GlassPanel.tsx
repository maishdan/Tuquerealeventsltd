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
      "bg-white border border-slate-200 rounded-none shadow-sm overflow-hidden text-slate-900 font-sans",
      className
    )}>
      <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-slate-200 bg-slate-50/80">
        <div>
          <h2 className="font-black text-lg uppercase tracking-tight text-slate-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs font-medium text-slate-600">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-6 text-slate-900">{children}</div>
    </section>
  );
}
