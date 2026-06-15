import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { adminNav } from "@/lib/dashboard-nav";
import {
  CalendarDays,
  ArrowRight,
  Sparkles,
  Zap,
  LayoutDashboard,
  Settings2,
  LogOut,
  Power
} from "lucide-react";
import {
  formatKes,
} from "@/lib/dashboard-mock-data";
import { useAdminBookings, useAdminClients, computeAdminKpis } from "@/hooks/use-dashboard-data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import eventsLogo from "../../assets/events-logo.jpeg";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const { data: bookings = [] } = useAdminBookings();
  const { data: clients = [] } = useAdminClients();
  const kpis = computeAdminKpis(bookings, clients);

  async function handleLogout() {
    await signOut();
    navigate({ to: "/sign-in" });
  }

  return (
    <div className="space-y-6 md:space-y-8 font-sans pb-20 px-0 sm:px-2 md:px-0">
      {/* Dashboard Sub-Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#2b4c8c]/60">Dashboard Overview</h2>
        <div className="flex items-center gap-4 md:gap-6 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#2b4c8c]">
           <span className="cursor-pointer hover:underline" onClick={() => navigate({ to: '/admin/finance' })}>Finance</span>
           <span className="cursor-pointer hover:underline" onClick={() => navigate({ to: '/admin/receipts' })}>View Statement</span>
           <span className="cursor-pointer hover:text-red-500 transition-colors" onClick={handleLogout}>Logout</span>
        </div>
      </div>

      {/* Stationary Welcome Section */}
      <div className="sticky top-0 sm:top-2 z-30 -mx-4 sm:mx-0">
        <div className="bg-white p-6 md:p-10 rounded-none sm:rounded-xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-lg border-b sm:border border-gray-100 min-h-[160px] md:min-h-0">
          <div className="relative z-10 space-y-3 md:space-y-4 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-bold text-[#2b4c8c] tracking-tight">
              Welcome back, {profile?.full_name?.split(' ')[0] || "Admin"}
            </h1>
            <p className="text-gray-500 text-xs md:text-sm max-w-md leading-relaxed font-medium">
              We're delighted to have you. Need help on system walk through? Navigate to virtual assistant on the side menu.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <button
                onClick={() => navigate({ to: "/admin/settings" })}
                className="h-9 px-5 rounded-lg bg-[#2b4c8c] text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#1e3a75] transition-all"
              >
                <Settings2 size={14} /> System Settings
              </button>
              <button
                onClick={handleLogout}
                className="h-9 px-5 rounded-lg border border-red-200 text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-red-50 transition-all"
              >
                <Power size={14} /> Terminate Session
              </button>
            </div>
          </div>
          <div className="hidden sm:flex mt-6 md:mt-0 relative z-10">
             <div className="h-20 w-20 md:h-32 md:w-32 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-inner">
                <Sparkles size={40} className="text-[#2b4c8c]/20 md:w-[64px] md:h-[64px]" />
             </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 -mr-32 -mt-32 rounded-full hidden md:block" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 relative z-10">
        {/* Main Content Area (8 Columns) */}
        <div className="lg:col-span-8 space-y-6 md:space-y-8 order-2 lg:order-1">
          {/* Empire Hub Table */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
             <div className="p-4 md:p-6 border-b border-gray-50 flex items-center justify-between bg-white">
                <h3 className="text-xs md:text-sm font-bold text-[#2b4c8c] uppercase tracking-wide">Current Operations Hub</h3>
                <Link to="/admin/events" className="text-[#2b4c8c] text-[11px] font-bold uppercase tracking-widest hover:underline transition-all">View All</Link>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[500px] md:min-w-full">
                 <thead className="bg-gray-50/50">
                   <tr className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
                     <th className="px-4 md:px-8 py-4 md:py-5">Operation Name</th>
                     <th className="px-4 md:px-8 py-4 md:py-5">System Code</th>
                     <th className="px-4 md:px-8 py-4 md:py-5 text-right">State</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                   {adminNav.filter(n => n.to !== "/admin").map((nav) => (
                     <tr
                       key={nav.to}
                       className="hover:bg-gray-50 transition-colors group cursor-pointer"
                       onClick={() => navigate({ to: nav.to })}
                     >
                        <td className="px-4 md:px-8 py-4 md:py-5">
                           <div className="flex items-center gap-3 md:gap-4">
                              <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#2b4c8c] group-hover:bg-[#2b4c8c] group-hover:text-white transition-all">
                                 <nav.icon size={14} className="md:w-[16px] md:h-[16px]" />
                              </div>
                              <span className="font-bold text-[#2b4c8c] text-[11px] md:text-xs uppercase tracking-tight">{nav.label}</span>
                           </div>
                        </td>
                        <td className="px-4 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">OP-{nav.label.slice(0, 3).toUpperCase()}</td>
                        <td className="px-4 md:px-8 py-4 md:py-5 text-right">
                           <span className="inline-flex px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-emerald-50 text-emerald-600 text-[8px] md:text-[9px] font-black uppercase tracking-widest">
                             Active
                           </span>
                        </td>
                     </tr>
                   ))}
                   {/* Explicit Logout Row */}
                   <tr
                      className="hover:bg-red-50 transition-colors group cursor-pointer"
                      onClick={handleLogout}
                    >
                      <td className="px-4 md:px-8 py-4 md:py-5">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                            <LogOut size={14} className="md:w-[16px] md:h-[16px]" />
                          </div>
                          <span className="font-bold text-red-500 text-[11px] md:text-xs uppercase tracking-tight">System Logout</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">SYS-EXIT</td>
                      <td className="px-4 md:px-8 py-4 md:py-5 text-right">
                        <span className="inline-flex px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-red-50 text-red-600 text-[8px] md:text-[9px] font-black uppercase tracking-widest">
                          Offline
                        </span>
                      </td>
                    </tr>
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Right Sidebar Area (4 Columns) */}
        <div className="lg:col-span-4 space-y-6 md:space-y-6 order-1 lg:order-2">
          {/* Revenue Card */}
          <div className="bg-[#1a73e8] p-6 md:p-10 rounded-2xl flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 shadow-xl relative overflow-hidden group hover:bg-[#1557b0] transition-all duration-300">
             <div className="h-14 w-14 md:h-20 md:w-20 rounded-full bg-white/20 flex items-center justify-center text-white border-2 border-white/30">
                <Zap size={24} className="fill-white md:w-[32px] md:h-[32px]" />
             </div>
             <div className="space-y-1 md:space-y-2">
                <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-blue-100">Live Capital Balance</p>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">{formatKes(kpis.monthlyRevenue)}</h3>
             </div>
             <Link to="/admin/finance" className="w-full h-10 md:h-12 rounded-lg border-2 border-white/50 text-white flex items-center justify-center text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-[#1a73e8] transition-all">
                Pay Now
             </Link>
          </div>

          {/* Progress Card */}
          <div className="bg-[#3e4a9e] p-6 md:p-10 rounded-2xl space-y-6 md:space-y-10 shadow-xl relative overflow-hidden group">
             <div className="flex items-start gap-4 md:gap-5">
                <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                   <LayoutDashboard size={20} className="md:w-[28px] md:h-[28px]" />
                </div>
                <div>
                   <h4 className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-blue-100/60 leading-relaxed">EMPIRE CYCLE 2025/2026</h4>
                   <p className="text-xs md:text-sm font-black text-white uppercase tracking-tight mt-0.5 md:mt-1">OPERATIONS PROGRESS</p>
                </div>
             </div>

             <div className="space-y-3 md:space-y-5">
                <div className="h-2.5 md:h-3 w-full bg-black/20 rounded-full overflow-hidden">
                   <div className="h-full w-[45%] bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
                </div>
                <div className="flex justify-between items-center text-[9px] md:text-[10px] font-black text-white uppercase tracking-widest">
                   <span>45% PROGRESS</span>
                   <span className="opacity-60 italic">STABLE</span>
                </div>
             </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
             {[
               { label: "Daily", val: formatKes(kpis.todayRevenue), icon: Zap, color: "text-[#1a73e8]" },
               { label: "Staff", val: "42", color: "text-[#3e4a9e]" },
             ].map((stat, i) => (
               <div key={i} className="bg-white border border-gray-100 p-4 md:p-6 rounded-xl shadow-sm space-y-1 md:space-y-2">
                  <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-gray-400">{stat.label}</p>
                  <p className={cn("text-[11px] md:text-sm font-black uppercase", stat.color)}>{stat.val}</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
