import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
  User,
  Shield,
  LogOut,
  Power
} from "lucide-react";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminBookings, useAdminEvents, useAdminContacts } from "@/hooks/use-dashboard-data";
import type { BookingStatus, EventStatus } from "@/lib/database.types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function mapBookingStatus(s: BookingStatus): EventStatus {
  if (s === "confirmed") return "confirmed";
  if (s === "planning") return "planning";
  if (s === "pending") return "inquiry";
  return "inquiry";
}

function AdminOverview() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: events = [] } = useAdminEvents();
  const { data: bookings = [] } = useAdminBookings();
  const { data: contacts = [] } = useAdminContacts();
  const unreadMessages = bookings.filter(b => b.status === 'pending').length;

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/sign-in" });
  };

  const today = new Date();
  const hours = today.getHours();
  let greeting = "Evening";
  if (hours < 12) greeting = "Morning";
  else if (hours < 17) greeting = "Afternoon";
  else if (hours < 21) greeting = "Evening";
  else greeting = "Night";

  return (
    <div className="space-y-6 pb-12">
      {/* Header Profile Section - 100% Mirror of Client Hub */}
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
              <Star size={10} className="fill-gold" /> EXECUTIVE ADMINISTRATOR
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">
              Good {greeting}, {profile?.full_name?.split(' ')[0] || "Admin"}
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1 leading-relaxed">
              Access your personalized Royal Touch empire portfolio and management tools.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/settings"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-12 px-5 border border-gold/40 text-gold hover:bg-gold hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-gold/5"
          >
            <Globe size={16} /> SYSTEM CONFIG
          </Link>
          <Link
            to="/admin/events"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-12 px-5 bg-gold text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-gold/20"
          >
            <Sparkles size={16} /> LIVE OPERATIONS
          </Link>
          <button
            onClick={handleLogout}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-12 px-5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10"
          >
            <Power size={16} /> End Session
          </button>
        </div>
      </div>

      {/* KPI Cards - 100% Mirror of Client Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/events" className="bg-card border border-white/5 rounded-xl p-5 relative overflow-hidden group cursor-pointer hover:border-gold/30 transition-all shadow-sm">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-1">EMPIRE EVENTS</p>
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

        <Link to="/admin/bookings" className="bg-card border border-white/5 rounded-xl p-5 relative overflow-hidden group cursor-pointer hover:border-blue-500/30 transition-all shadow-sm">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">INTAKE BRIEFS</p>
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

        <Link to="/admin/contacts" className="bg-card border border-white/5 rounded-xl p-5 relative overflow-hidden group cursor-pointer hover:border-emerald-500/30 transition-all shadow-sm">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-1">COMMS CENTER</p>
              <h4 className="text-2xl font-bold text-foreground font-display tracking-tight">{unreadMessages} New</h4>
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
        {/* Main Registry Section (Left Split) - Mirrors "Upcoming Celebrations" */}
        <div className="bg-card border border-white/5 rounded-2xl overflow-hidden p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-foreground font-bold text-lg">Empire Registry</h4>
              <p className="text-muted-foreground text-xs">Management of all active celebrations</p>
            </div>
            <Link to="/admin/bookings" className="text-xs text-gold hover:underline flex items-center gap-1">
              All Briefs <ArrowRight size={12} />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-border rounded-xl">
              <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
                <Heart size={20} className="text-gray-500" />
              </div>
              <p className="text-sm text-muted-foreground">No recent project intake data found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 3).map((b) => (
                <div key={b.id} className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/20 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                      {b.event_type?.includes("Wedding") ? <Heart size={18} /> : <Trophy size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm group-hover:text-gold transition-colors">{b.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{b.event_date || "Date Pending"} · {b.event_type}</p>
                    </div>
                  </div>
                  <EventStatusBadge status={b.status as any} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Support & Mission Control (Right Split) - Mirrors "Royal Concierge" */}
        <div className="space-y-6">
          <div className="bg-[#2b4c8c] border border-blue-500/20 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={80} className="text-white" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-gold mb-4">
                <Star size={18} className="fill-gold" />
                <h4 className="font-bold text-sm text-white">Mission Control</h4>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed mb-6">
                Administrative protocols are fully active. All logistical pipelines and technical infrastructures are synchronized for 100% operational uptime.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/10 border border-white/10 rounded-xl p-3">
                  <p className="text-[10px] text-blue-200 font-bold uppercase mb-1">Status</p>
                  <p className="text-sm text-white font-bold">Stable Ops</p>
                </div>
                <div className="bg-white/10 border border-white/10 rounded-xl p-3">
                  <p className="text-[10px] text-blue-200 font-bold uppercase mb-1">Capacity</p>
                  <p className="text-sm text-white font-bold">98.5% Uptime</p>
                </div>
              </div>
              <Link to="/admin/settings" className="w-full py-2.5 bg-gold text-black rounded-lg text-xs font-bold hover:bg-white transition flex items-center justify-center gap-2 shadow-xl shadow-gold/20">
                <Shield size={14} /> Manage Deployments
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
                   <EventStatusBadge status={mapBookingStatus(b.status as BookingStatus)} />
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
