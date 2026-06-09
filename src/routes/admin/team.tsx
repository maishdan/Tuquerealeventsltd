import { createFileRoute } from "@tanstack/react-router";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { useAdminTeam } from "@/hooks/use-dashboard-data";
import { teamPerformance } from "@/lib/dashboard-mock-data";

export const Route = createFileRoute("/admin/team")({
  component: AdminTeam,
});

function AdminTeam() {
  const { data: team = [] } = useAdminTeam();
  const members = team.length > 0
    ? team.map((m) => ({ name: m.full_name, role: m.role, score: m.performance_score, events: m.events_managed }))
    : teamPerformance;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Team Management</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">
          Staff <span className="text-gradient-gold">Performance</span> Ranking
        </h2>
      </div>

      <GlassPanel title="Performance Leaderboard" subtitle="Based on delivery score & events managed">
        <div className="space-y-3">
          {members.map((member, i) => (
            <div key={member.name} className="flex items-center gap-4 rounded-xl glass border border-white/10 p-4 sm:p-5">
              <span className="font-display text-2xl text-gold w-8 shrink-0">#{i + 1}</span>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/40 to-gold/40 flex items-center justify-center font-display text-lg shrink-0">
                {member.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg">{member.name}</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{member.role}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display text-2xl text-gradient-gold">{member.score}</p>
                <p className="text-xs text-muted-foreground">{member.events} events</p>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Avg Attendance", value: "96%" },
          { label: "On-Time Rate", value: "98%" },
          { label: "Client Satisfaction", value: "4.9/5" },
        ].map((stat) => (
          <div key={stat.label} className="glass-strong rounded-2xl border border-white/15 p-6 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            <p className="mt-2 font-display text-3xl text-gradient-gold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
