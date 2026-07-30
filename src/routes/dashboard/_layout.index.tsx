import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  MessageSquare,
  PartyPopper,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Star,
  Clock,
  Heart,
  Trophy,
  Globe,
  User
} from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomerBookings, useCustomerEvents, useCustomerMessages } from "@/hooks/use-dashboard-data";
import type { BookingStatus, EventStatus } from "@/lib/database.types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/_layout/")({
  component: CustomerOverview,
});

function mapBookingStatus(s: BookingStatus): EventStatus {
  if (s === "confirmed") return "confirmed";
  if (s === "planning") return "planning";
  if (s === "pending") return "inquiry";
  return "inquiry";
}

function CustomerOverview() {
  const { user, profile } = useAuth();
  const { data: events = [] } = useCustomerEvents(user?.id);
  const { data: bookings = [] } = useCustomerBookings(user?.id, profile?.email);
  const { data: messages = [] } = useCustomerMessages(user?.id);
  const unread = messages.filter((m) => !m.read).length;

  const today = new Date();
  const hours = today.getHours();
  let greeting = "Evening";
  if (hours < 12) greeting = "Morning";
  else if (hours < 17) greeting = "Afternoon";
  else if (hours < 21) greeting = "Evening";
  else greeting = "Night";

  return (
    <div className="space-y-6 pb-12">
      {/* Header Profile Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
        <div className="flex items-center gap-4 flex-1">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden ring-4 ring-gold/10 shadow-2xl shrink-0 bg-white/5 flex items-center justify-center">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User size={40} className="text-gray-500" />
            )}
          </div>
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-widest mb-1.5">
              <Star size={10} className="fill-gold" /> Premium Member
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">
              Good {greeting}, {profile?.full_name?.split(' ')[0] || "Valued Client"}
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1 leading-relaxed">
              Access your personalized Royal Touch event portfolio and management tools.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/dashboard/host-event"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-12 px-5 border border-gold/40 text-gold hover:bg-gold hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-gold/5"
          >
            <Globe size={16} /> Host Event
          </Link>
          <Link
            to="/dashboard/book-event"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-12 px-5 bg-gold text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-gold/20"
          >
            <Sparkles size={16} /> Book Event
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/dashboard/events" className="bg-card border border-white/5 rounded-xl p-5 relative overflow-hidden group cursor-pointer hover:border-gold/30 transition-all shadow-sm">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-1">My Events</p>
              <h4 className="text-2xl font-bold text-foreground font-display tracking-tight">{events.length}</h4>
              <div className="flex items-center gap-1 mt-2">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span className="text-[10px] text-emerald-500 font-bold">Secured & Active</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/20">
              <PartyPopper size={20} className="text-gold" />
            </div>
          </div>
        </Link>

        <Link to="/dashboard/bookings" className="bg-card border border-white/5 rounded-xl p-5 relative overflow-hidden group cursor-pointer hover:border-blue-500/30 transition-all shadow-sm">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">Inquiries</p>
              <h4 className="text-2xl font-bold text-foreground font-display tracking-tight">{bookings.length}</h4>
              <div className="flex items-center gap-1 mt-2">
                <Clock size={12} className="text-blue-400" />
                <span className="text-[10px] text-blue-400 font-bold">Processing Status</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <CalendarDays size={20} className="text-blue-400" />
            </div>
          </div>
        </Link>

        <Link to="/dashboard/messages" className="bg-card border border-white/5 rounded-xl p-5 relative overflow-hidden group cursor-pointer hover:border-emerald-500/30 transition-all shadow-sm">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-1">Concierge</p>
              <h4 className="text-2xl font-bold text-foreground font-display tracking-tight">{unread} New</h4>
              <div className="flex items-center gap-1 mt-2">
                <Zap size={12} className="text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-bold">Direct Response</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <MessageSquare size={20} className="text-emerald-400" />
            </div>
          </div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Events Section */}
        <div className="bg-card border border-white/5 rounded-2xl overflow-hidden p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-foreground font-bold text-lg">Upcoming Celebrations</h4>
              <p className="text-muted-foreground text-xs">Your journey to extraordinary events</p>
            </div>
            <Link to="/dashboard/events" className="text-xs text-gold hover:underline flex items-center gap-1">
              All Events <ArrowRight size={12} />
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-border rounded-xl">
              <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
                <Heart size={20} className="text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">No events scheduled yet.</p>
                <Link to="/dashboard/book-event" className="text-xs text-gold font-bold mt-2 inline-block">Start Planning Now</Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {events.slice(0, 3).map((e) => (
                <div key={e.id} className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/20 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                      {e.event_type?.includes("Wedding") ? <Heart size={18} /> : <Trophy size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm group-hover:text-gold transition-colors">{e.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{e.event_date || "Date to be confirmed"} · {e.event_type}</p>
                    </div>
                  </div>
                  <EventStatusBadge status={e.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Support & Concierge */}
        <div className="space-y-6">
          <div className="bg-[#2b4c8c] border border-blue-500/20 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={80} className="text-white" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-gold mb-4">
                <Star size={18} className="fill-gold" />
                <h4 className="font-bold text-sm text-white">Royal Concierge</h4>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed mb-6">
                Your dedicated event specialist is ready to assist. We ensure every detail of your celebration meets the Royal Touch standard.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/10 border border-white/10 rounded-xl p-3">
                  <p className="text-[10px] text-blue-200 font-bold uppercase mb-1">Response Time</p>
                  <p className="text-sm text-white font-bold">Under 30 Mins</p>
                </div>
                <div className="bg-white/10 border border-white/10 rounded-xl p-3">
                  <p className="text-[10px] text-blue-200 font-bold uppercase mb-1">Event Status</p>
                  <p className="text-sm text-white font-bold">Priority</p>
                </div>
              </div>
              <Link to="/dashboard/messages" className="w-full py-2.5 bg-gold text-black rounded-lg text-xs font-bold hover:bg-white transition flex items-center justify-center gap-2">
                <MessageSquare size={14} /> Chat with Specialist
              </Link>
            </div>
          </div>

          <div className="bg-card border border-white/5 rounded-2xl p-5 shadow-sm">
            <h4 className="text-foreground font-bold text-sm mb-4">Recent Activity</h4>
            <div className="space-y-4">
               {bookings.slice(0, 2).map((b) => (
                 <div key={b.id} className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 text-[10px] font-bold">
                       BK
                     </div>
                     <div>
                       <span className="text-xs text-muted-foreground block">{b.event_type} Booking</span>
                       <span className="text-[10px] text-muted-foreground uppercase">#{b.id.slice(0, 8)}</span>
                     </div>
                   </div>
                   <EventStatusBadge status={mapBookingStatus(b.status)} />
                 </div>
               ))}
               {bookings.length === 0 && (
                 <p className="text-[10px] text-muted-foreground text-center py-4">No recent activity to show.</p>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
