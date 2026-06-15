import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin,
  Users,
  Package,
  Truck,
  AlertTriangle,
  Radio,
  Zap,
  Target,
  ShieldCheck,
  Clock,
  ArrowRight
} from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import { useAdminEvents } from "@/hooks/use-dashboard-data";
import { liveEvents } from "@/lib/dashboard-mock-data";
import { BackToDashboard } from "@/components/dashboard/BackToDashboard";

export const Route = createFileRoute("/admin/command")({
  component: AdminCommand,
});

function AdminCommand() {
  const { data: dbEvents } = useAdminEvents();
  const events = (dbEvents && dbEvents.length > 0)
    ? dbEvents.map((e) => ({
        id: e.id,
        name: e.name,
        type: e.event_type,
        status: e.status,
        venue: e.venue ?? "TBD",
        team: e.team_count,
        vendors: e.vendor_count,
      }))
    : liveEvents;

  return (
    <div className="space-y-10 pb-20 font-sans text-white">
      <BackToDashboard role="admin" />

      {/* 1. STRATEGIC HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gold">
            <div className="h-[1px] w-10 bg-gold" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Integrated Mission Control</p>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter uppercase">Event Command</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
            Real-time operational oversight of all active productions. Monitor technical readiness and logistical execution from a single interface.
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
           <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
           Systems Nominal
        </div>
      </div>

      {/* 2. OPERATIONAL METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Technical Uptime", val: "100.0%", icon: Zap, color: "gold" },
          { label: "Deployment Scale", val: "78 Staff", icon: Users, color: "blue" },
          { label: "Asset Readiness", val: "94.2%", icon: Package, color: "emerald" },
          { label: "Security Status", val: "Active", icon: ShieldCheck, color: "purple" },
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all group">
             <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 border border-white/10 mb-6 group-hover:bg-gold group-hover:text-black group-hover:border-gold transition-all">
                <stat.icon size={20} />
             </div>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">{stat.label}</p>
             <h3 className="text-2xl font-black text-white">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* 3. LIVE COMMAND BOARD */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center gap-4 mb-2">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">Live Production Feed</h4>
              <div className="h-px flex-1 bg-white/5" />
           </div>

           <div className="space-y-4">
             {events.map((event) => (
               <div key={event.id} className="group relative bg-[#121212] border border-white/10 p-8 rounded-[40px] hover:border-gold/30 transition-all duration-500">
                  <div className="flex flex-wrap justify-between items-start gap-6 mb-8">
                     <div className="space-y-2">
                        <div className="flex items-center gap-3">
                           <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                           <p className="text-gold text-[10px] font-black uppercase tracking-widest">{event.type}</p>
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-gold transition-colors">{event.name}</h3>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{event.venue}</p>
                     </div>
                     <EventStatusBadge status={event.status as any} />
                  </div>

                  <div className="grid grid-cols-3 gap-8 border-t border-white/5 pt-8">
                     <div className="space-y-1">
                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Team Size</p>
                        <p className="text-sm font-bold text-gray-300">{event.team} Members</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Vendors</p>
                        <p className="text-sm font-bold text-gray-300">{event.vendors} Partners</p>
                     </div>
                     <div className="space-y-1 text-right">
                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">GPS Track</p>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Link</p>
                     </div>
                  </div>
               </div>
             ))}
           </div>
        </div>

        {/* Alerts & Logs */}
        <div className="space-y-6">
           <div className="bg-[#121212] border border-white/10 p-10 rounded-[40px] space-y-8">
              <div className="flex items-center gap-3 text-rose-500">
                 <AlertTriangle size={20} />
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">Emergency Log</h4>
              </div>

              <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                 <p className="text-white font-bold text-xs uppercase tracking-tight">Weather Alert: Naivasha</p>
                 <p className="text-[10px] text-gray-500 leading-relaxed">Incoming storm front detected. Advise on-site team to secure outdoor rigging for Garden Ceremony.</p>
                 <button className="text-[9px] font-black text-rose-400 uppercase tracking-widest hover:text-white transition-colors">Acknowledge Alert</button>
              </div>

              <div className="pt-6 border-t border-white/5">
                 <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest text-center">No other critical alerts</p>
              </div>
           </div>

           <div className="bg-[#121212] border border-white/10 p-10 rounded-[40px] space-y-8">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.4em]">Logistics Map</h4>
              <div className="aspect-square rounded-3xl overflow-hidden border border-white/5 grayscale opacity-50 contrast-125">
                 <iframe
                    title="Live Fleet Map"
                    src="https://www.google.com/maps?q=Nairobi%2C%20Kenya&output=embed"
                    loading="lazy"
                    className="w-full h-full"
                  />
              </div>
              <button className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gold hover:text-black transition-all">Open Full Fleet View</button>
           </div>
        </div>
      </div>
    </div>
  );
}
