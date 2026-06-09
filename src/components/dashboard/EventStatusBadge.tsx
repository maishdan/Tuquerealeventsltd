const styles = {
  "in-progress": { label: "In Progress", dot: "bg-emerald-400", ring: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300" },
  upcoming: { label: "Upcoming", dot: "bg-blue-400", ring: "border-blue-400/40 bg-blue-500/10 text-blue-300" },
  completed: { label: "Completed", dot: "bg-gold", ring: "border-gold/40 bg-gold/10 text-gold" },
  delayed: { label: "Delayed", dot: "bg-rose-400", ring: "border-rose-400/40 bg-rose-500/10 text-rose-300" },
  confirmed: { label: "Confirmed", dot: "bg-emerald-400", ring: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300" },
  planning: { label: "Planning", dot: "bg-blue-400", ring: "border-blue-400/40 bg-blue-500/10 text-blue-300" },
  inquiry: { label: "Inquiry", dot: "bg-muted-foreground", ring: "border-white/20 bg-white/5 text-muted-foreground" },
  pending: { label: "Pending", dot: "bg-amber-400", ring: "border-amber-400/40 bg-amber-500/10 text-amber-300" },
} as const;

export type EventStatus = keyof typeof styles;

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const s = styles[status];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${s.ring}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
