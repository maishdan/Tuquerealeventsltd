import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  ArrowRight,
  Sparkles,
  Zap,
  LayoutDashboard,
  Settings2,
  Users,
  ShieldCheck,
  Star,
  Clock,
  Heart,
  Trophy,
  Globe,
  User,
  Activity,
  BarChart3,
  TrendingUp,
  Briefcase
} from "lucide-react";
import {
  formatKes
} from "@/lib/dashboard-mock-data";
import {
  useAdminBookings,
  useAdminClients,
  useAdminEvents,
  useAdminTeam,
  computeAdminKpis
} from "@/hooks/use-dashboard-data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { EventStatusBadge } from "@/components/dashboard/EventStatusBadge";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: bookings = [] } = useAdminBookings();
  const { data: events = [] } = useAdminEvents();
  const { data: clients = [] } = useAdminClients();
  const { data: team = [] } = useAdminTeam();
  const kpis = computeAdminKpis(bookings, clients);

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
              <ShieldCheck size={10} className="fill-gold/20" /> Executive Administrator
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">
              Good {greeting}, {profile?.full_name?.split(' ')[0] || "Admin"}
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1 leading-relaxed">
              System operational. Overseeing {events.length} active high-stakes productions across the region.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/settings"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-12 px-5 border border-border text-muted-foreground hover:text-gold rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg bg-card"
          >
            <Settings2 size={16} /> System Config
          </Link>
          <Link
            to="/admin/events"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-12 px-5 bg-gold text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-gold/20"
          >
            <Activity size={16} /> Live Operations
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-gold/30 transition-all shadow-sm">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-1">Monthly Revenue</p>
              <h4 className="text-2xl font-bold text-foreground font-display tracking-tight">{formatKes(kpis.monthlyRevenue)}</h4>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp size={12} className="text-emerald-500" />
                <span className="text-[10px] text-emerald-500 font-bold">+12.4% from LY</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center border border-gold/20">
              <Zap size={20} className="text-gold" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-blue-500/30 transition-all shadow-sm">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">Active Projects</p>
              <h4 className="text-2xl font-bold text-foreground font-display tracking-tight">{events.length} Live</h4>
              <div className="flex items-center gap-1 mt-2">
                <Briefcase size={12} className="text-blue-400" />
                <span className="text-[10px] text-blue-400 font-bold">Priority Status</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <BarChart3 size={20} className="text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-white/5 rounded-xl p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all shadow-sm">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-1">Client Registry</p>
              <h4 className="text-2xl font-bold text-foreground font-display tracking-tight">{clients.length} Profiles</h4>
              <div className="flex items-center gap-1 mt-2">
                <Users size={12} className="text-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-bold">Verified Executive Accounts</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Globe size={20} className="text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Operations Activity */}
        <div className="lg:col-span-8 bg-card border border-white/5 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h4 className="text-foreground font-bold text-lg">Registry Activity</h4>
              <p className="text-muted-foreground text-xs">Real-time project intake and status updates</p>
            </div>
            <Link to="/admin/bookings" className="text-xs text-gold hover:underline flex items-center gap-1 uppercase font-black tracking-widest">
              View Ledger <ArrowRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                  <th className="py-5 px-6">Source</th>
                  <th className="py-5 px-6">Sector</th>
                  <th className="py-5 px-6">Investment</th>
                  <th className="py-5 px-6 text-right">Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="group hover:bg-white/5 transition-all cursor-pointer" onClick={() => navigate({ to: '/admin/bookings' })}>
                    <td className="py-5 px-6">
                       <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-black text-[10px]">
                             {b.name.charAt(0)}
                          </div>
                          <div>
                             <p className="text-xs font-bold text-foreground uppercase truncate w-32">{b.name}</p>
                             <p className="text-[9px] text-muted-foreground font-medium">{b.email}</p>
                          </div>
                       </div>
                    </td>
                    <td className="py-5 px-6 text-xs font-bold text-muted-foreground uppercase tracking-tight">{b.event_type}</td>
                    <td className="py-5 px-6 text-xs font-black text-foreground">{b.budget}</td>
                    <td className="py-5 px-6 text-right">
                       <EventStatusBadge status={b.status as any} />
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-muted-foreground text-xs font-bold uppercase tracking-widest">No recent intake data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Support & System Health */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#2b4c8c] border border-blue-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={100} className="text-white" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2 text-gold">
                <ShieldCheck size={18} />
                <h4 className="font-black uppercase tracking-widest text-xs">Mission Control Ready</h4>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed font-medium">
                Administrative protocols are active. All logistical pipelines and technical infrastructures are synchronized for 100% operational uptime.
              </p>

              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-black text-white uppercase tracking-widest">
                    <span>System Capacity</span>
                    <span className="text-emerald-400">Stable</span>
                 </div>
                 <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gold rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 border border-white/10 rounded-xl p-3">
                  <p className="text-[9px] text-blue-200 font-bold uppercase mb-1">Response Time</p>
                  <p className="text-sm text-white font-black">EXECUTIVE</p>
                </div>
                <div className="bg-white/10 border border-white/10 rounded-xl p-3">
                  <p className="text-[9px] text-blue-200 font-bold uppercase mb-1">Staff Count</p>
                  <p className="text-sm text-white font-black">{team.length} Active</p>
                </div>
              </div>

              <Link to="/admin/team" className="w-full h-11 bg-white text-blue-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition flex items-center justify-center gap-2 shadow-lg">
                Manage Deployments
              </Link>
            </div>
          </div>

          <div className="bg-card border border-white/5 rounded-2xl p-6 shadow-sm space-y-5">
            <h4 className="text-foreground font-black text-[10px] uppercase tracking-[0.2em]">Deployment Readiness</h4>
            <div className="space-y-4">
               {[
                 { label: "Technical AV", val: "Ready", state: "text-emerald-500" },
                 { label: "Logistics Hub", val: "Synchronized", state: "text-emerald-500" },
                 { label: "Vendor Registry", val: "Verified", state: "text-emerald-500" },
                 { label: "Financial Ops", val: "Critical", state: "text-gold" },
               ].map((sys, i) => (
                 <div key={i} className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{sys.label}</span>
                    <span className={cn("text-[9px] font-black uppercase tracking-widest", sys.state)}>{sys.val}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
