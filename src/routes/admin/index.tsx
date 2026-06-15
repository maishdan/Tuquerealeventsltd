import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { adminNav } from "@/lib/dashboard-nav";
import {
  DollarSign,
  CalendarDays,
  Users,
  TrendingUp,
  Wallet,
  Percent,
  FileSignature,
  BarChart3,
  Plus,
  Clock,
  ArrowRight,
  Car,
  Package,
  Eye,
  Search,
  MoreVertical,
  Activity,
  Truck,
  MessageSquare,
  ShieldCheck,
  TrendingDown,
  Target,
  Trophy,
  Zap,
  Heart,
  Briefcase,
  PartyPopper,
  Sparkles,
  Radio,
  CheckCircle2,
  LayoutDashboard,
  Globe
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { GlassPanel } from "@/components/dashboard/GlassPanel";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import {
  ceoInsights,
  executiveKpis,
  financialHub,
  formatKes,
  formatPercent,
  topClients,
} from "@/lib/dashboard-mock-data";
import { useAdminBookings, useAdminClients, computeAdminKpis } from "@/hooks/use-dashboard-data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import eventsLogo from "../../assets/events-logo.jpeg";
import { useState } from "react";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: bookings = [] } = useAdminBookings();
  const { data: clients = [] } = useAdminClients();
  const kpis = computeAdminKpis(bookings, clients);

  const today = new Date();
  const hours = today.getHours();
  let greeting = "Evening";
  if (hours < 12) greeting = "Morning";
  else if (hours < 17) greeting = "Afternoon";
  else if (hours < 21) greeting = "Evening";
  else greeting = "Night";

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#2b4c8c]/60">Dashboard Overview</h2>
        <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-[#2b4c8c]">
           <span className="cursor-pointer hover:underline" onClick={() => navigate({ to: '/admin/finance' })}>Finance</span>
           <span className="cursor-pointer hover:underline" onClick={() => navigate({ to: '/admin/receipts' })}>View Statement</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area (8 Columns) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Welcome Card (Exact Kisii University Style) */}
          <div className="bg-white p-10 rounded-xl flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-sm border border-gray-100">
            <div className="relative z-10 space-y-4">
              <h1 className="text-4xl font-bold text-[#2b4c8c] tracking-tight">
                Welcome back, {profile?.full_name?.split(' ')[0] || "Admin"}
              </h1>
              <p className="text-gray-500 text-sm max-w-md leading-relaxed font-medium">
                We're delighted to have you. Need help on system walk through? Navigate to virtual assistant on the side menu.
              </p>
            </div>
            <div className="mt-8 md:mt-0 relative z-10">
               <div className="h-32 w-32 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-inner">
                  <Sparkles size={64} className="text-[#2b4c8c]/20" />
               </div>
            </div>
          </div>

          {/* Empire Hub Table (Like "Current Registered Units") */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
             <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white">
                <h3 className="text-sm font-bold text-[#2b4c8c] uppercase tracking-wide">Current Operations Hub</h3>
                <Link to="/admin/events" className="text-[#2b4c8c] text-[11px] font-bold uppercase tracking-widest hover:underline transition-all">View All</Link>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead className="bg-gray-50/50">
                   <tr className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                     <th className="px-8 py-5">Operation Name</th>
                     <th className="px-8 py-5">System Code</th>
                     <th className="px-8 py-5 text-right">State</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                   {adminNav.filter(n => n.to !== "/admin").slice(0, 6).map((nav) => (
                     <tr
                       key={nav.to}
                       className="hover:bg-gray-50 transition-colors group cursor-pointer"
                       onClick={() => navigate({ to: nav.to })}
                     >
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-4">
                              <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#2b4c8c] group-hover:bg-[#2b4c8c] group-hover:text-white transition-all">
                                 <nav.icon size={16} />
                              </div>
                              <span className="font-bold text-[#2b4c8c] text-xs uppercase tracking-tight">{nav.label}</span>
                           </div>
                        </td>
                        <td className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">OP-{nav.label.slice(0, 3).toUpperCase()}</td>
                        <td className="px-8 py-5 text-right">
                           <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest">
                             Active
                           </span>
                        </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Right Sidebar Area (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Revenue Card (Kisii University "Fee Balance" Style) */}
          <div className="bg-[#1a73e8] p-10 rounded-2xl flex flex-col items-center justify-center text-center space-y-8 shadow-xl relative overflow-hidden group hover:bg-[#1557b0] transition-all duration-300">
             <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-white border-2 border-white/30">
                <Zap size={32} className="fill-white" />
             </div>
             <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-100">Live Capital Balance</p>
                <h3 className="text-3xl font-black text-white tracking-tight">{formatKes(kpis.monthlyRevenue)}</h3>
             </div>
             <Link to="/admin/finance" className="w-full h-12 rounded-lg border-2 border-white/50 text-white flex items-center justify-center text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-[#1a73e8] transition-all">
                Pay Now
             </Link>
          </div>

          {/* Progress Card (Kisii University "Semester Progress" Style) */}
          <div className="bg-[#3e4a9e] p-10 rounded-2xl space-y-10 shadow-xl relative overflow-hidden group">
             <div className="flex items-start gap-5">
                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                   <LayoutDashboard size={28} />
                </div>
                <div>
                   <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-100/60 leading-relaxed">EMPIRE CYCLE 2025/2026</h4>
                   <p className="text-sm font-black text-white uppercase tracking-tight mt-1">OPERATIONS PROGRESS</p>
                </div>
             </div>

             <div className="space-y-5">
                <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
                   <div className="h-full w-[45%] bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
                </div>
                <div className="flex justify-between items-center text-[10px] font-black text-white uppercase tracking-widest">
                   <span>45% PROGRESS</span>
                   <span className="opacity-60 italic">STABLE</span>
                </div>
             </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4">
             {[
               { label: "Daily", val: formatKes(kpis.todayRevenue), color: "text-[#1a73e8]" },
               { label: "Staff", val: "42", color: "text-[#3e4a9e]" },
             ].map((stat, i) => (
               <div key={i} className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm space-y-2">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">{stat.label}</p>
                  <p className={cn("text-sm font-black uppercase", stat.color)}>{stat.val}</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
