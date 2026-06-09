import type { ReactNode } from "react";

export function SectionHeader({ eyebrow, title, subtitle, center = false }: { eyebrow?: string; title: ReactNode; subtitle?: string; center?: boolean }) {
  return (
    <div className={center ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      {eyebrow && <p className="text-xs uppercase tracking-[0.25em] text-gold mb-3">{eyebrow}</p>}
      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.05]">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground text-base md:text-lg">{subtitle}</p>}
    </div>
  );
}
