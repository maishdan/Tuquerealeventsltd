import { createFileRoute } from "@tanstack/react-router";
import { Users, Truck, Package, Handshake } from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { operations } from "@/lib/dashboard-mock-data";

export const Route = createFileRoute("/admin/operations")({
  component: AdminOperations,
});

function AdminOperations() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Operations</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">
          Fleet & <span className="text-gradient-gold">Resources</span>
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          { title: "Staff Management", icon: Users, stats: [`${operations.staff.onDuty} on duty`, `${operations.staff.available} available`, `${operations.staff.total} total`] },
          { title: "Vehicle Tracking", icon: Truck, stats: [`${operations.vehicles.active} active`, `${operations.vehicles.maintenance} in maintenance`, `${operations.vehicles.total} fleet`] },
          { title: "Inventory Status", icon: Package, stats: [`${operations.inventory.healthy}% healthy`, `${operations.inventory.low} low stock`, `${operations.inventory.critical} critical`] },
          { title: "Vendor Management", icon: Handshake, stats: [`${operations.vendors.active} active`, `${operations.vendors.pending} pending`, `${operations.vendors.overdue} overdue`] },
        ].map((block) => (
          <div key={block.title} className="glass-strong rounded-2xl border border-white/15 p-6">
            <block.icon size={22} className="text-gold" />
            <h3 className="mt-4 font-display text-xl">{block.title}</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {block.stats.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <GlassPanel title="Operations Snapshot" subtitle="Live resource allocation">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Production Crew Alpha", status: "Deployed", pct: 100 },
            { label: "Decor Team Beta", status: "On standby", pct: 60 },
            { label: "AV Rig Charlie", status: "In transit", pct: 80 },
            { label: "Logistics Delta", status: "Available", pct: 40 },
          ].map((crew) => (
            <div key={crew.label} className="rounded-xl glass border border-white/10 p-4">
              <p className="font-medium text-sm">{crew.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{crew.status}</p>
              <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gold" style={{ width: `${crew.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
