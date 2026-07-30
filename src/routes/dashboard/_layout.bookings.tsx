import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomerBookings } from "@/hooks/use-dashboard-data";
import type { BookingStatus, EventStatus } from "@/lib/database.types";
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
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/_layout/bookings")({
  component: CustomerBookings,
});

function mapStatus(s: BookingStatus): EventStatus {
  if (s === "confirmed") return "confirmed";
  if (s === "planning") return "planning";
  if (s === "pending") return "inquiry";
  return "inquiry";
}

function CustomerBookings() {
  const { user, profile } = useAuth();
  const { data: bookings = [], isLoading } = useCustomerBookings(user?.id, profile?.email);

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Operational Registry</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">Inquiries & contracts</h2>
        </div>
        <Link
          to="/dashboard/book-event"
          className="h-14 px-8 rounded-full bg-gold text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-[0_10px_40px_rgba(212,175,55,0.2)]"
        >
          <Plus size={16} /> New Project Inquiry
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          <GlassPanel title="Booking History" subtitle="Track your technical proposals and confirmation states">
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-4">
                 <Loader2 size={40} className="text-gold animate-spin" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Accessing Database...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                 <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border border-border">
                    <ClipboardList size={32} className="text-muted-foreground" />
                 </div>
                 <div className="space-y-2">
                    <p className="text-sm font-bold text-foreground uppercase tracking-tight">No active inquiries found.</p>
                    <p className="text-[11px] text-muted-foreground max-w-xs mx-auto leading-relaxed">Submit a strategic brief to initiate a new project with the Royal Touch production team.</p>
                    <div className="pt-4">
                       <Link to="/dashboard/book-event" className="text-xs text-gold font-black uppercase tracking-widest hover:underline">Start Planning Now</Link>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                      <th className="py-6 px-4">Project ID</th>
                      <th className="py-6 px-4">Sector</th>
                      <th className="py-6 px-4">Target Date</th>
                      <th className="py-6 px-4 text-right">Investment</th>
                      <th className="py-6 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {bookings.map((b) => (
                      <tr key={b.id} className="group hover:bg-white/[0.02] transition-all">
                        <td className="py-6 px-4">
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all">
                                 <FileText size={14} />
                              </div>
                              <span className="font-mono text-[11px] font-bold text-foreground tracking-widest uppercase">BK-{b.id.slice(0, 8)}</span>
                           </div>
                        </td>
                        <td className="py-6 px-4">
                           <p className="text-xs font-bold text-foreground opacity-80 uppercase tracking-tight">{b.event_type}</p>
                        </td>
                        <td className="py-6 px-4">
                           <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar size={12} />
                              <span className="text-[10px] font-bold uppercase tracking-widest">{b.event_date || "TBD"}</span>
                           </div>
                        </td>
                        <td className="py-6 px-4 text-right">
                           <span className="text-xs font-black text-foreground">{b.budget}</span>
                        </td>
                        <td className="py-6 px-4 text-right">
                           <EventStatusBadge status={mapStatus(b.status)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassPanel>
        </div>

        <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-right-8 duration-1000">
           <div className="bg-card border border-border p-8 rounded-[40px] space-y-8">
              <div className="flex items-center gap-3 text-gold">
                 <Clock size={20} />
                 <h4 className="text-[10px] font-black uppercase tracking-widest">Processing Time</h4>
              </div>
              <div className="space-y-4">
                 <p className="text-4xl font-black text-foreground tracking-tighter">Under 24H</p>
                 <p className="text-[11px] text-muted-foreground leading-relaxed font-medium uppercase tracking-[0.1em] leading-loose">All inquiries are reviewed by our senior technical producers to ensure alignment with production standards.</p>
              </div>
           </div>

           <div className="bg-[#2b4c8c] border border-blue-500/20 p-8 rounded-[40px] space-y-6">
              <div className="flex items-center gap-3 text-white">
                 <ShieldCheck size={20} />
                 <h4 className="text-[10px] font-black uppercase tracking-widest">Executive Privacy</h4>
              </div>
              <p className="text-[11px] text-blue-100 font-medium leading-relaxed">Your event blueprints and financial parameters are encrypted and handled with absolute executive discretion.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
