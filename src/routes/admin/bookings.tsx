import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import { useAdminBookings, useUpdateBookingStatus } from "@/hooks/use-dashboard-data";
import type { BookingStatus } from "@/lib/database.types";
import {
  ClipboardList,
  Calendar,
  Wallet,
  ArrowRight,
  Plus,
  Search,
  Clock,
  FileText,
  ShieldCheck,
  Loader2,
  Filter,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/bookings")({
  component: AdminBookings,
});

const statusOptions: BookingStatus[] = ["pending", "confirmed", "planning", "inquiry", "cancelled"];

function AdminBookings() {
  const { data: bookings = [], isLoading } = useAdminBookings();
  const updateStatus = useUpdateBookingStatus();

  const pending = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Empire Operations</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">Project Intake</h2>
        </div>
        <div className="flex gap-4">
           <div className="bg-card border border-border px-6 h-14 rounded-2xl flex items-center gap-3 shadow-sm">
              <AlertCircle size={18} className="text-amber-500" />
              <div className="text-left">
                 <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Pending Action</p>
                 <p className="text-sm font-black text-foreground">{pending} Briefs</p>
              </div>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          <GlassPanel title="Inbound Briefs" subtitle="Registry of all strategic project requests">
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-4">
                 <Loader2 size={40} className="text-gold animate-spin" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Accessing Registry...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                 <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border border-border">
                    <ClipboardList size={32} className="text-muted-foreground" />
                 </div>
                 <div className="space-y-2">
                    <p className="text-sm font-bold text-foreground uppercase tracking-tight">Registry clear.</p>
                    <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">No project briefs have been submitted for qualification at this time.</p>
                 </div>
              </div>
            ) : (
              <div className="space-y-6 py-4">
                {bookings.map((b) => (
                  <div key={b.id} className="group bg-muted/30 border border-border p-6 rounded-[32px] hover:border-gold/30 transition-all duration-500">
                     <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                              <FileText size={20} />
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-gold uppercase tracking-widest leading-none mb-1.5">BK-{b.id.slice(0, 8).toUpperCase()}</p>
                              <h3 className="text-xl font-bold text-foreground uppercase tracking-tight group-hover:text-gold transition-colors">{b.name}</h3>
                           </div>
                        </div>
                        <EventStatusBadge status={b.status as any} />
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-border">
                        <div>
                           <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Discipline</p>
                           <p className="text-xs font-bold text-foreground">{b.event_type}</p>
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Target Date</p>
                           <p className="text-xs font-bold text-foreground">{b.event_date || "TBD"}</p>
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Investment</p>
                           <p className="text-xs font-black text-emerald-500">{b.budget}</p>
                        </div>
                        <div className="flex flex-col items-end">
                           <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Protocol</p>
                           <select
                             value={b.status}
                             onChange={(e) => updateStatus.mutate({ id: b.id, status: e.target.value as BookingStatus })}
                             className="bg-background border border-border rounded-lg px-3 py-1 text-[10px] font-black uppercase text-foreground outline-none focus:border-gold transition-all cursor-pointer"
                           >
                              {statusOptions.map(o => <option key={o} value={o}>{o}</option>)}
                           </select>
                        </div>
                     </div>

                     <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                           <span className="flex items-center gap-1.5"><Clock size={12} /> Received {new Date(b.created_at).toLocaleDateString()}</span>
                           <span className="opacity-30">|</span>
                           <span>{b.email}</span>
                        </div>
                        <Link to={`/admin/bookings`} className="h-10 px-5 rounded-full bg-foreground text-background text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gold hover:text-black transition-all">
                           Qualify Brief <ArrowRight size={14} />
                        </Link>
                     </div>
                  </div>
                ))}
              </div>
            )}
          </GlassPanel>
        </div>

        <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-right-8 duration-1000">
           <div className="bg-[#2b4c8c] border border-blue-500/20 p-8 rounded-[40px] space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <ShieldCheck size={100} className="text-white" />
              </div>
              <div className="relative z-10 space-y-4">
                 <div className="flex items-center gap-3 text-gold">
                    <ShieldCheck size={20} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Governance Active</h4>
                 </div>
                 <p className="text-[11px] text-blue-100 leading-relaxed font-medium uppercase tracking-[0.1em] leading-loose">All inbound project briefs must undergo technical qualification before conversion to active production.</p>
              </div>
           </div>

           <div className="bg-card border border-border p-8 rounded-[40px] space-y-6 shadow-sm">
              <h4 className="text-foreground font-black text-[10px] uppercase tracking-[0.2em]">Qualification Metrics</h4>
              <div className="space-y-4">
                 {[
                   { label: "Intake Volume", val: "High", color: "text-emerald-500" },
                   { label: "Conversion Rate", val: "72%", color: "text-gold" },
                   { label: "Lead Response", val: "Instant", color: "text-emerald-500" },
                 ].map((m, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{m.label}</span>
                      <span className={cn("text-[9px] font-black uppercase tracking-widest", m.color)}>{m.val}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
