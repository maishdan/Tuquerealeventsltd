import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ClipboardList,
  Search,
  Filter,
  Calendar,
  Users,
  DollarSign,
  Clock,
  ArrowRight,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useAdminBookings, useUpdateBookingStatus } from "@/hooks/use-dashboard-data";
import type { BookingStatus } from "@/lib/database.types";
import { cn } from "@/lib/utils";
import { formatKes } from "@/lib/dashboard-mock-data";
import { BackToDashboard } from "@/components/dashboard/BackToDashboard";

export const Route = createFileRoute("/admin/bookings")({
  component: AdminBookings,
});

const statusOptions: BookingStatus[] = ["pending", "confirmed", "planning", "inquiry", "cancelled"];

const statusStyles: Record<BookingStatus, string> = {
  pending: "border-amber-400/40 bg-amber-500/10 text-amber-300",
  confirmed: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
  planning: "border-blue-400/40 bg-blue-500/10 text-blue-300",
  inquiry: "border-white/20 bg-white/5 text-gray-500",
  cancelled: "border-rose-400/40 bg-rose-500/10 text-rose-300",
};

function AdminBookings() {
  const { data: bookings = [], isLoading, error } = useAdminBookings();
  const updateStatus = useUpdateBookingStatus();

  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div className="space-y-10 pb-20 font-sans text-white">
      <BackToDashboard role="admin" />

      {/* 1. STRATEGIC HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gold">
            <div className="h-[1px] w-10 bg-gold" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Project Intake</p>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter uppercase">Client Briefs</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl font-medium leading-relaxed">
            Review and qualify all inbound project requests. Convert high-intent briefs into active production events.
          </p>
        </div>
      </div>

      {/* 2. CORE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Requests", val: bookings.length, icon: ClipboardList, color: "gold" },
          { label: "Pending Qualification", val: pending, icon: AlertCircle, color: "amber" },
          { label: "Confirmed Contracts", val: confirmed, icon: CheckCircle2, color: "emerald" },
        ].map((stat, i) => (
          <div key={i} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all group">
             <div className="flex justify-between items-start mb-6">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border transition-all",
                  stat.color === "gold" ? "bg-gold/10 text-gold border-gold/20 group-hover:bg-gold group-hover:text-black" :
                  stat.color === "amber" ? "bg-amber-500/10 text-amber-500 border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black" :
                  "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black"
                )}>
                  <stat.icon size={24} />
                </div>
             </div>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">{stat.label}</p>
             <h3 className="text-4xl font-black text-white">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* 3. BRIEFS REGISTRY */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search project database..."
                className="w-full bg-transparent border-none pl-12 pr-6 py-2 text-sm text-white focus:ring-0 outline-none"
              />
           </div>
           <div className="h-8 w-[1px] bg-white/5" />
           <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
              <Filter size={14} /> Filter
           </button>
        </div>

        <div className="space-y-6">
          {isLoading && <p className="text-center py-20 text-gray-500 uppercase tracking-widest text-[10px] font-black animate-pulse">Retrieving Briefs...</p>}
          {error && <p className="text-center py-20 text-rose-500 uppercase tracking-widest text-[10px] font-black">Brief Database Access Failure</p>}

          {bookings.map((b) => (
            <div key={b.id} className="group relative bg-[#121212] border border-white/10 p-8 rounded-[40px] hover:border-gold/30 transition-all duration-500">
               <div className="flex flex-wrap justify-between items-start gap-6 mb-8">
                  <div className="space-y-1">
                     <p className="text-gold text-[10px] font-black uppercase tracking-widest mb-1">BK-{b.id.slice(0, 8).toUpperCase()}</p>
                     <h3 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-gold transition-colors">{b.name}</h3>
                     <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{b.email}</span>
                        <div className="h-1 w-1 rounded-full bg-white/10" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{b.phone || "NO PHONE"}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <span className={cn("inline-flex rounded-full border px-4 py-1.5 text-[9px] font-black uppercase tracking-widest", statusStyles[b.status])}>
                        {b.status}
                     </span>
                     <button className="p-2 rounded-xl hover:bg-white/5 text-gray-500 transition-colors">
                        <MoreHorizontal size={20} />
                     </button>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-white/5 py-8">
                  <div className="space-y-1">
                     <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Discipline</p>
                     <p className="text-sm font-bold text-gray-300">{b.event_type}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Target Date</p>
                     <p className="text-sm font-bold text-gray-300">{b.event_date || "TBD"}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Scale</p>
                     <p className="text-sm font-bold text-gray-300">{b.guests || "—"} Guests</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Investment</p>
                     <p className="text-sm font-bold text-gold">{b.budget}</p>
                  </div>
               </div>

               {Array.isArray(b.services) && b.services.length > 0 && (
                 <div className="mt-8 flex flex-wrap gap-2">
                    {b.services.map((s: string) => (
                      <span key={s} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-widest text-gray-500">{s}</span>
                    ))}
                 </div>
               )}

               {b.notes && (
                 <div className="mt-8 bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
                    <p className="text-gray-400 text-sm italic leading-relaxed">"{b.notes}"</p>
                 </div>
               )}

               <div className="flex flex-wrap items-center gap-6 mt-8 pt-8 border-t border-white/5">
                  <div className="flex items-center gap-3">
                     <label htmlFor={`status-${b.id}`} className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Update Qualification:</label>
                     <select
                       id={`status-${b.id}`}
                       value={b.status}
                       onChange={(e) => updateStatus.mutate({ id: b.id, status: e.target.value as BookingStatus })}
                       className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-gold transition-all"
                     >
                       {statusOptions.map((s) => (
                         <option key={s} value={s}>{s}</option>
                       ))}
                     </select>
                  </div>

                  <span className="ml-auto flex items-center gap-2 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                    <Clock size={12} /> Received {new Date(b.created_at).toLocaleDateString()}
                  </span>
               </div>
            </div>
          ))}

          {!isLoading && bookings.length === 0 && (
             <div className="py-32 text-center space-y-6">
                <ClipboardList size={48} className="text-gray-800 mx-auto" />
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Brief Registry Empty</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
