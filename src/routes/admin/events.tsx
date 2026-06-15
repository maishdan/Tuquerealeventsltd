import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  MapPin,
  Users,
  Handshake,
  Plus,
  LayoutDashboard,
  Filter,
  Search,
  ChevronDown,
  Globe,
  ArrowRight
} from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import { useAdminEvents } from "@/hooks/use-dashboard-data";
import { liveEvents, formatKes } from "@/lib/dashboard-mock-data";
import type { EventRecord } from "@/lib/database.types";
import { BackToDashboard } from "@/components/dashboard/BackToDashboard";

export const Route = createFileRoute("/admin/events")({
  component: AdminEvents,
});

function AdminEvents() {
  const { data: events = [], isLoading, error } = useAdminEvents();

  const displayEvents: (EventRecord | (typeof liveEvents)[0])[] =
    events.length > 0
      ? events
      : liveEvents.map((e) => ({
          id: String(e.id),
          user_id: null,
          booking_id: null,
          name: e.name,
          event_type: e.type,
          event_date: null,
          venue: e.venue,
          budget: null,
          status: e.status as EventRecord["status"],
          team_count: e.team,
          vendor_count: e.vendors,
          created_at: new Date().toISOString(),
        }));

  const active = displayEvents.filter((e) => ["in-progress", "upcoming", "confirmed", "planning"].includes(e.status)).length;
  const completed = displayEvents.filter((e) => e.status === "completed").length;

  return (
    <div className="space-y-10 pb-20 font-sans text-white">
      <BackToDashboard role="admin" />

      {/* 1. STRATEGIC HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gold">
            <div className="h-[1px] w-10 bg-gold" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Operations Pipeline</p>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter uppercase">Empire Events</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
            Centralized management for every high-stakes production, from board retreats to stadium-scale celebrations.
          </p>
        </div>
        <button className="h-14 px-10 rounded-xl bg-gold text-[#0b0e14] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-2xl">
          <Plus size={16} /> Orchestrate New Event
        </button>
      </div>

      {/* 2. CORE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Managed", val: displayEvents.length, icon: Globe },
          { label: "Active/Upcoming", val: active, icon: CalendarDays },
          { label: "Successfully Completed", val: completed, icon: Handshake },
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all group">
             <div className="flex justify-between items-start mb-6">
                <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 group-hover:bg-gold group-hover:text-black transition-all">
                  <stat.icon size={24} />
                </div>
             </div>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">{stat.label}</p>
             <h3 className="text-4xl font-black text-white">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* 3. EVENT PIPELINE GRID */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search event registry..."
                className="w-full bg-transparent border-none pl-12 pr-6 py-2 text-sm text-white focus:ring-0 outline-none"
              />
           </div>
           <div className="h-8 w-[1px] bg-white/5" />
           <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
              <Filter size={14} /> Filter
           </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayEvents.map((event: any) => (
            <div key={event.id} className="group relative bg-[#121212] border border-white/10 p-8 rounded-[40px] hover:border-gold/30 transition-all duration-500">
               <div className="flex justify-between items-start mb-8">
                  <div className="space-y-2">
                     <p className="text-gold text-[10px] font-black uppercase tracking-widest">{event.event_type}</p>
                     <h3 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-gold transition-colors">{event.name}</h3>
                  </div>
                  <EventStatusBadge status={event.status} />
               </div>

               <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                  <div className="space-y-1">
                     <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Production Date</p>
                     <p className="text-sm font-bold text-gray-300">{event.event_date ? new Date(event.event_date).toLocaleDateString() : "TBD"}</p>
                  </div>
                  <div className="space-y-1 text-right">
                     <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Lead Venue</p>
                     <p className="text-sm font-bold text-gray-300 truncate">{event.venue || "TBD"}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Staffing Level</p>
                     <p className="text-sm font-bold text-gray-300">{event.team_count} Members</p>
                  </div>
                  <div className="space-y-1 text-right">
                     <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Asset Budget</p>
                     <p className="text-sm font-bold text-gold">{event.budget ? formatKes(event.budget) : "TBD"}</p>
                  </div>
               </div>

               <div className="mt-10 flex items-center justify-between">
                  <div className="flex -space-x-2">
                     {[1,2,3].map(j => (
                       <div key={j} className="h-8 w-8 rounded-full border-2 border-[#121212] bg-white/5 flex items-center justify-center">
                          <Users size={12} className="text-gray-500" />
                       </div>
                     ))}
                  </div>
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-gold transition-colors">
                     Management Brief <ArrowRight size={14} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
