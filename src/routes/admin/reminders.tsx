import { createFileRoute } from "@tanstack/react-router";
import { BellRing, ClipboardCheck, DollarSign, CalendarClock, Users, GitBranch } from "lucide-react";

export const Route = createFileRoute("/admin/reminders")({
  component: AdminReminders,
});

const tiles = [
  { label: "Total Inquiries This Month", value: "48", icon: BellRing, accent: "text-gold" },
  { label: "Confirmed Bookings", value: "23", icon: ClipboardCheck, accent: "text-emerald-400" },
  { label: "Revenue Tracker", value: "KES 4.82M", icon: DollarSign, accent: "text-blue-400" },
  { label: "Upcoming Events Calendar", value: "12 events", icon: CalendarClock, accent: "text-purple-400" },
  { label: "Team Assignments", value: "9 active", icon: Users, accent: "text-amber-400" },
  { label: "Client Pipeline", value: "31 leads", icon: GitBranch, accent: "text-rose-400" },
];

function AdminReminders() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Admin Reminders</h2>
        <p className="text-gray-400 text-sm mt-1">Operational snapshot — inquiries, bookings, revenue, calendar, team and pipeline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((t) => (
          <div key={t.label} className="bg-[#0f172a] border border-white/5 rounded-xl p-5 hover:border-gold/30 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1 ${t.accent}`}>{t.label}</p>
                <h4 className="text-2xl font-bold text-white font-display tracking-tight">{t.value}</h4>
              </div>
              <div className="h-11 w-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <t.icon size={20} className={t.accent} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
